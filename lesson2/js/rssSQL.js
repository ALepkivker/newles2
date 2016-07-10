/**
 * 
 */

function getFeed(){
	var FEED_URL = "http://www.3dnews.ru/news/rss/";
	var width = screen.width
	
	$(document).ready(function(){
		$.ajax({
			type:"GET",
			url: FEED_URL,
			dataType: "xml",			
			success: xmlParser
			
		});
		
	});
	
	function xmlParser(xml){
		
		db.transaction(function (tx) {
			  tx.executeSql('DROP TABLE todo');
			});
		
		$(xml).find("item").each(function(){
			
			var i = 0;
			var arr = [];
			var url_img = $(this).find("enclosure").attr('url');
			
			if (url_img != undefined){
				$("#rssContent").append('<div class="feed"><div class="images"><img src='+ url_img + '  width='+ width + 'px /></div><div class="title">'+ $(this).find("title").text() +'</div><div class="description">'+ $(this).find("description").text() +'</div></div>');
			}else{
				$("#rssContent").append('<div class="feed"><div class="images">"No image"<div class="title">'+ $(this).find("title").text() +'</div><div class="description">'+ $(this).find("description").text() +'</div></div>');
			}
			arr[i] = {url_img:$(this).find("enclosure").attr('url'), title:$(this).find("title").text(), description:$(this).find("description").text()}
			SetData(arr[i]);			
			i++
			
		});
		
	}
	
}
var db = window.openDatabase("RssDB", "0.1", "RSSList.", 2*1024*1024);


function SetData(tabItem){
	
	db.transaction(function(tx) {	
		console.log(tabItem.url_img);
		tx.executeSql('CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY AUTOINCREMENT, img TEXT, tit TEXT, desc TEXT)',[],null,null);
		tx.executeSql('INSERT INTO todo (img,tit,desc) VALUES(?,?,?)', [tabItem.url_img,tabItem.title,tabItem.description], null,onError);
	});
}

function onError(e){
	console.log(e);
}

