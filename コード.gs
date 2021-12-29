function showDialog(){
  var html = HtmlService.createHtmlOutputFromFile('dialog');
  SpreadsheetApp.getUi().showModalDialog(html, "CSVアップロード");
}
function uploadCsv(form) {  
  var blob = form.myFile;
  var name = blob.getName();

  var csvText = blob.getDataAsString();    
  var values = Utilities.parseCsv(csvText);
  SpreadsheetApp.getActiveSheet().getRange(1, 1, values.length, values[0].length).setValues(values);
  Browser.msgBox(name);
}