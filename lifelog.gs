//doPost→どこからかこのアプリケーションにアクセスがあった場合に自動で呼び出されるハンドラ
function doPost(e) {
  //slackの設定
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var bot_name = "lifelog";
  
  //スプレッドシート設定
  var mySs = SpreadsheetApp.getActiveSpreadsheet(); //スプレッドシートを取得
  var mySheet = SpreadsheetApp.getActiveSheet(); //シートを取得
  
  //今日の日付を取得
  var today = new Date();
  var today_year = today.getFullYear();
  var today_month = today.getMonth()+1;
  var today_date = today.getDate(); 
  var today_array = [today_year,today_month,today_date];
  
  //A列一番最初が2行目のため
  var ai = 2;
  
  //日付探索while
  while(1){
    //A列の日付をひたすら取得していく
    var sdate = mySheet.getRange(ai,1).getValue();
    var sdate_year = sdate.getFullYear();
    var sdate_month = sdate.getMonth()+1;
    var sdate_date = sdate.getDate();
    var sdate_array = [sdate_year,sdate_month,sdate_date];
    //arrayで等不号使えないので、どちらともJSONに落とし込んでから使えるようにする
    var sdate_array_ja = JSON.stringify(sdate_array);
    var today_array_ja = JSON.stringify(today_array);
    //JSON形式で今日の日付とA列日付を比較
    if(sdate_array_ja == today_array_ja){
      //A列の日付と今日の日付が一致したら
      break;
    }
    else{
      //そうでない限り探索していく
      ai++;
      Logger.log(sdate_array);
    }
  }  
  Logger.log(ai);
  
  //レスポンス設定
  var message = "こんにちは"
  var app = SlackApp.create(token);
  var usermessage = e.parameter.text;
  
  //ここからメッセージ毎に条件分岐
  if(usermessage.match(/起床/)){
    message = "おはようございます！"
    var today = new Date();
    mySheet.getRange(ai,2).setValue(today);
  }
  
  else if(usermessage.match(/出勤/)){
    message = "一日頑張ってください";
    var today = new Date();
    mySheet.getRange(ai,3).setValue(today);
  }

  else if(usermessage.match(/退勤/)){
    message = "おつかれさまでした！";
    var today = new Date();
    mySheet.getRange(ai,4).setValue(today);
    
  }
  else if(usermessage.match(/就寝/)){
    message = "おやすみなさい";
    var today = new Date();
    mySheet.getRange(ai,5).setValue(today);

  }
  
  //slackに投稿
  return app.postMessage("#lifelog", message, {
    username: bot_name
  });
}
