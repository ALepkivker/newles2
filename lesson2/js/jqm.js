/**
 * 
 */

var db = window.openDatabase("RssDB", "0.1", "RSSList.", 2*1024*1024);
var dbLike = window.openDatabase("AppRate", "0.1", "AppList", 2*1024*1024);


function findTitle(){
	
	var findStr = $("#search_inp").val();
	alert(findStr);
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM todo WHERE tit=?', [findStr], function(tx, result) {
				for(var i = 0; i < result.rows.length; i++) {
					alert("SUccess");
					var url_img = result.rows.item(i)['img'];
					
					var title = result.rows.item(i)['tit'];
					
					var desc = result.rows.item(i)['desc'];
					
					$('#searchresult').append('<div class="feed"><div class="images"><img src='+ url_img + '  width="90%px" /></div><div class="title">'+ title +'</div><div class="description">'+ desc +'</div></div>');
				}
			}, null)
	}); 
}


function showCom(){
	
	$( "#textCom" ).textinput('enable');
	
		

}

function hideCom(){
	
	$( "#textCom" ).textinput('disable');
}

function classApp(){
	var radio1 = document.getElementById("radio1"),
		radio2 = document.getElementById("radio2"),
		rate = "",
		comment = "";
	$("#allResults").show();
	$("#likeField").children('#radio1').prop('readonly',true);
	if (radio1.checked){
		 
		rate = document.getElementById("like").innerHTML;
		setData(rate, comment);		
		showResults();
	}else{
		if(radio2.checked){
			
			rate = document.getElementById("unlike").innerHTML;
			comment = document.getElementById("textCom").value;
			setData(rate, comment);
			showResults();
		}
	}
	 
}

function setData(_rate, _comment){
	
	dbLike.transaction(function(tx) {	
		console.log(_rate);
		tx.executeSql('CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY AUTOINCREMENT, rate TEXT, comment TEXT)',[],null,null);
		tx.executeSql('INSERT INTO todo (rate,comment) VALUES(?,?)', [_rate,_comment], null,null);
	});
}

function showResults(){
	
	dbLike.transaction(function(tx) {
		tx.executeSql('SELECT * FROM todo', [], function(tx, result) {
				var likeNumber = 0,
					unlikeNumber = 0,
					likeResField = document.getElementById("likeRes"),
					unlikeResField = document.getElementById("unlikeRes");
				 
				for(var i = 0; i < result.rows.length; i++) {
					
					if	(result.rows.item(i)['rate'] == "Понравилось"){
						likeNumber++;
					}else{
						unlikeNumber++;
					}				
					
				}
				 
				likeResField.innerHTML = likeNumber.toString();
				unlikeResField.innerHTML = unlikeNumber.toString();
				
			}, null)
	});
	
	setTimeout(function(){
		  $('#allResults').hide();
		}, 10000);

}
   