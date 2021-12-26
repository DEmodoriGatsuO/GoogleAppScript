function summary_mails(){
  var myAddress = Session.getActiveUser().getEmail(); // 自分のメールアドレス
  var sheet = SpreadsheetApp.getActive().getSheetByName('シート1'); // 情報を書くスプレッドシート
  var range = sheet.getDataRange(); // データが入っているところ全て
  var lastRow = range.getLastRow(); // 最終行

  // 受信トレイを検索する
  var threads = GmailApp.search('newer_than:100d label:gas_amazon'); // 直近100日のラベル「」を検索する方法です
  // ここからループ
  for (var i=0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j=0; j < messages.length; j++) {
      if(findId(messages[j].getId(),lastRow,sheet) != true && !messages[j].getSubject().match(/^re:|^fwd:|^\[.*\].*re:|^\[.*\].*fwd:/i)){
        let MailSubject = messages[j].getSubject(); //メールタイトル
        MailSubject =　MailSubject.replace("Amazon.co.jpでのご注文",""); //余計な文字消しちゃいましょう
        let MailDate = messages[j].getDate();　//メールの日付
        let MailBody = messages[j].getPlainBody(); //Amazonの自動返信メールはHTML形式で若干今回はやりづらいのでプレーンテキストで取ります
        let orderAmount = MailBody.match(/(?<=注文合計：).*/g); //注文合計が複数に分かれているケースに対応
        for (let k=0; k < orderAmount.length; k++){
          lastRow++; //ここで書き込み先を指定します。最終行にプラス1してます
          sheet.getRange(lastRow,1).setValue(messages[j].getId());//ID
          sheet.getRange(lastRow,2).setValue(MailDate);//受信日
          sheet.getRange(lastRow,3).setValue(MailSubject);//メールタイトル 
          sheet.getRange(lastRow,4).setValue(orderAmount[k]);//注文合計
        }
      }
    }
  }
}
// 重複するIDがないか調べる
function findId(mailID, lastRow, sheet) {
  for (j = 1; j <= lastRow; j++) {
    if(sheet.getRange(j, 1).getValues() == mailID) {
      return(true);
    }
  }
  return(false);
}