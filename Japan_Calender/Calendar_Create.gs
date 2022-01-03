function Calendar_Function() {
  var sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Calendar');
  var lastRow = sheet.getLastRow();
  if(lastRow != 1){
    var range = sheet.getRange(2,1,lastRow - 1,9);
    range.clearContent();
  };
  var dat = [];
  var date = new Date();
  var start_date = new Date(date.getFullYear(),0,1);
  var end_date = new Date(date.getFullYear(),11,31);
  var year = start_date.getFullYear();
  const calendar = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com');
  for(var i = 1 ;start_date.getFullYear() == year ;i++){
    var values = new Array("日付","年","月","日","四半期","曜日名","曜日","区分","祝日","国民の祝日・休日名称");
    values[0] = start_date.getFullYear() + '/' + (start_date.getMonth()+1) + '/' + start_date.getDate();
    values[1] = start_date.getFullYear();
    values[2] = start_date.getMonth()+1;
    values[3] = start_date.getDate();
    values[4] = quarter_year(start_date.getMonth());
    values[5] = arr_getDay(start_date.getDay()) + '曜日';
    values[6] = arr_getDay(start_date.getDay());
    const events = calendar.getEventsForDay(start_date);
    if(events.length != 0){
      values[8] = '祝日';
      values[9] = events[0].getTitle();
    } else {
      values[8] = null;
      values[9] = null;
    };
    if (values[6] == '土' || values[6] == '日' || values[8] == '祝日'){
      values[7] = '休日';
    } else {
      values[7] = null;
    };
    dat.push(values);
    start_date.setDate(start_date.getDate() + 1);
  };
  sheet.getRange(2,1,dat.length,dat[0].length).setValues(dat);
}
function arr_getDay(day){
  var arr_day = new Array('日', '月', '火', '水', '木', '金', '土');
  return arr_day[day];
}
function quarter_year(month){
  if(month >= 0 && month <= 2){
    return 1;
  } else if(month >= 3 && month <= 5){
    return 2;
  } else if(month >= 6 && month <= 8){
    return 3;
  } else if(month >= 9 && month <= 11){
    return 4;
  }

  return arr_day[day];
}
