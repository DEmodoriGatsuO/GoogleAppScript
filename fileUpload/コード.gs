function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}
function upload_file_gs(reader_result, file_name) {
  var FOLDER_ID = "ID";
  var result_split = reader_result.split(',');
  var content_type = result_split[0].split(';')[0].replace('data:', '');
  var row_data = result_split[1];
  var data = Utilities.base64Decode(row_data);
  
  var file = Utilities.newBlob(data, content_type, file_name);
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var drive_file = folder.createFile(file);
  var file_url = drive_file.getUrl();
  return file_url;
}
