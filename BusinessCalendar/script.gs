function onOpen(){
  const menu=[
    {name: "カレンダー更新", functionName: "createDateTable"},
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu("My Menu",menu);
}
function createDateTable() {
  const sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('calendar');
  let lastRow = sheet.getLastRow();

  if(lastRow != 0){
    let range = sheet.getRange(2,1,lastRow - 1,9);
    range.clearContent();
  };

  let dat = [];
  let values = new Array("日付","年番号","年","月番号","月","日番号","日","四半期","四半期名","曜日名","曜日","区分","祝日","国民の祝日・休日名称","営業日インデックス");
  const columns = values.length;
  dat.push(values);

  let date = new Date();
  let start_date = new Date(date.getFullYear(),0,1);

  const year = start_date.getFullYear() + 1;
  const calendar = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com');
  let ret;
  let month;
  let j = 0;
  for(let i = 1; start_date.getFullYear() <= year ;i++){
    if(month != start_date.getMonth()){
      month = start_date.getMonth();
      j = 0}
    values = new Array(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
    values[0] = Utilities.formatDate(start_date,"Asia/Tokyo","yyyy/MM/dd");
    values[1] = start_date.getFullYear();
    values[2] = values[1] + "年";
    values[3] = start_date.getMonth() + 1;
    ret = ('0' + values[3]).slice(-2);
    values[4] = ret + "月";
    values[5] = start_date.getDate();
    ret = ('0' + values[5]).slice(-2);
    values[6] = ret + "日";
    values[7] = getQuarter(start_date.getMonth());
    values[8] = getQuarter(start_date.getMonth()) + "Q";
    values[9] = getWeekDay(start_date.getDay()) + '曜日';
    values[10] = getWeekDay(start_date.getDay());

    const events = calendar.getEventsForDay(start_date);
    if(events.length != 0){
      values[12] = '祝日';
      values[13] = events[0].getTitle();
    };

    if (values[10] == '土' || values[10] == '日' || values[12] == '祝日'){
      values[11] = '休日';
    } else {
      j++;
      values[14] = j;
    }

    dat.push(values);

    start_date.setDate(start_date.getDate() + 1);
  };

  sheet.getRange(1,1,dat.length,columns).setValues(dat);
}
function getWeekDay(day){
  const WEEKDAY = new Array('日', '月', '火', '水', '木', '金', '土');
  return WEEKDAY[day];
}
function getQuarter(month){
  if(month >= 0 && month <= 2){
    return 1;
  } else if(month >= 3 && month <= 5){
    return 2;
  } else if(month >= 6 && month <= 8){
    return 3;
  } else if(month >= 9 && month <= 11){
    return 4;
  }
  return;
}
