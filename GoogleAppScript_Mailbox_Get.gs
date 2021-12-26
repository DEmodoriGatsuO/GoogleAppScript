function Main() {
	var myadr = Session.getActiveUser().getEmail(); //MyMailAddress
	var sheet = SpreadsheetApp.getActive().getSheetByName('-'); // Record
	var range = sheet.getDataRange();
	var line = range.getLastRow();
	var cnt = 0;
	var threads = GmailApp.search('newer_than: 30d label:-');
	var MailDate = "";
	var MailBody = "";
 	for (var i=0; i < threads.length; i++) { 
		var messages = threads [i].getMessages();
		for (var j=0;j < messages.length; j++) {
 			if (FindItem (messages[j].getId(),line,sheet) != true && 
				! messages[j].getSubject().match(/^re:|^fwd:|^\[.*\].*re:|^\[.*\].*fwd:/i)){
			line++;
			MailDate = messages[j].getDate();
			MailBody = messages[j].getBody();
			sheet.getRange(line, 1).setValue(messages[j].getId());
			cnt++;
			}
		}
	}
 }
function FindItem (value, line, sheet) { 
	for (j = 1; j <= line; j++) {
		if (sheet.getRange(j, 1).getValues() == value) {
		return(true);
		}
	}
	return(false);
}
function yyyyMM_return (date){
  var day = date.getDate();
  if(day> 10){
    date.setDate(1);
    date.setMonth(date.getMonth()+1);
  } 
  return(Utilities.formatDate(date, 'JST','yyyyMM'));
}