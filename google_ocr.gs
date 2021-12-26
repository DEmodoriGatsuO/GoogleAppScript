function convertTextFromPDFFile(file, folder) {
  return convertTextFromPDF_(convertDocumentFromPDFFile, file, folder);
}
function convertTextFromPDFBlob(blob, folder) {
  return convertTextFromPDF_(convertDocumentFromPDFBlob, blob, folder);
}
function convertTextFromPDF_(convertDocument, pdf, folder) {
  const document = convertDocument(pdf, folder);
  const text = DocumentApp.openById(document.getId()).getBody().getText();
  document.setTrashed(true);
  return text;
}
function convertDocumentFromPDFFile(file, folder) {
  if (!folder)
    folder = file.getParents().next();
  const blob = file.getBlob();
  return convertDocumentFromPDFBlob(blob, folder);
}
function convertDocumentFromPDFBlob(blob, folder) {
  const fileMeta = {title: blob.getName(), mimeType: MimeType.PDF};
  const result = Drive.Files.insert(fileMeta, blob, {
    convert: true,
    ocr: true,
    ocrLanguage: 'ja'
   });
   const file = DriveApp.getFileById(result.id);
   if (folder) {
     const parents = file.getParents();
     while (parents.hasNext())
       parents.next().removeFile(file);
     folder.addFile(file);
   }
   return file;
}
// フォームの回答をキャッチして動くスクリプト
function onFormSubmit(e) {
  // フォームの回答を取得
  var email = Session.getActiveUser().getUserLoginId();
  const regExpGid = new RegExp("id=(.*?)(&|$)");
  var url = e.namedValues['アップしても問題ないPDF限定です'][0];
  const gid = url.match(regExpGid)[1];

  // 自動返信メール件名
  var subject = 'メールの内容がOCRの結果です';

  const pdf = DriveApp.getFileById(gid);
  var body = convertTextFromPDFFile(pdf);
  var options = {
    noReply: true
  };
  GmailApp.sendEmail(email, subject, body, options); 
  pdf.setTrashed(true);
  deleteTrashedFiles;
}
function instantPdf() {
// '1zN78mDVqn1q7fI6xJENv8QcjUUCri60S'
  // 自動返信メール件名
  var subject = 'メールの内容がOCRの結果です';
  var email = "shougoss90@gmail.com";
  const pdf = DriveApp.getFileById('1ATMUIV4mfBGMwSkr77IsggzgQe_BaQvz');
  var body = convertTextFromPDFFile(pdf);
  var options = {
    noReply: true
  };
  GmailApp.sendEmail(email, subject, body, options); 
  pdf.setTrashed(true);
  deleteTrashedFiles;
}
// アップしたファイルはGoogleドライブにプールされてしまうので消します。
function deleteTrashedFiles() {
  var contents = DriveApp.getTrashedFiles();
  var i = 0;
  while(contents.hasNext()) {
    var file = contents.next();
    var id = file.getId();
    i++;
    Drive.Files.remove(id);// この行のコメントを外して実行すると削除されます
  }
}