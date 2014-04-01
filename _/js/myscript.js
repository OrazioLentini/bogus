var apiKey = "a2a8dfb93f306b41ba5edd9eae9b48ee43593e8c";

function getGameList() {
    getGames(document.getElementById("searchGame").value);
}

//--------------------------------------- NEW RELEASES ------------------------------------
/*
function newRelease() {
	$.ajax({
		url: "http://www.giantbomb.com/api/releases/",
		type: "GET",
		data: {
			api_key: apiKey,
			platforms: "17",
			filter: "release_date: august 2013",
			field_list: "name" + "," + "id" + "," + "image" + "," + "release_date",
			resources: "game",
			format: "jsonp",
			json_callback: "releases"
		},
		dataType: 'jsonp'	
	});
}

function releases(data) {
    window.data = data;
    console.log(data);
    
}

*/
//--------------------------------------- SEARCH RESULTS ------------------------------------
function getGames(game) {
	s = game;
	//alert(s);
	$.ajax({
		url: "http://www.giantbomb.com/api/search/",
		type: "GET",
		data: {
			api_key: apiKey,
			query: game,
			field_list: "name" + "," + "platforms" + "," + "id" + "," + "image",
			resources: "game",
			format: "jsonp",
			json_callback: "gameData"
		},
		dataType: 'jsonp'	
	});
}

function gameData(data) {
    window.data = data;
    console.log(data);
    
    $("#gameResults ul").empty();
     
	for(var i=0; i<data.results.length; i++){
	    game = data.results[i];
	    var id = game.id;
	    var title = game.name;
	    var image = game.image.icon_url;
	    var platforms = "Platforms: ";
	    
	    for(var x=0; x<game.platforms.length; x++){
		gamePlatform = game.platforms[x];
		var tempPlatform  = gamePlatform.abbreviation;
		
		if (x == (game.platforms.length - 1)){
			platforms += tempPlatform + "";
		}
		else { 
		    platforms += tempPlatform + ", ";
		}
	    }
	    var output = '';
    	    output += '<li><a onclick="loadFunctions(\'' +  id + '\',\'' + title + '\')" href="#gameInfo">';
	    output += '<img  src='+image+'>'+title+'<br>'+platforms+'</a></li>';

	    //console.log(platforms);
	    $("#gameResults ul").append(output);
	    //$("#gameResults ul").append("<li><a onclick=getGameInfo('"+id+"');getGamePlay('"+title+"') href=#gameInfo><img  src='"+image+"'>"+title+"<br>"+platforms+"</a></li>");
	    $("#gameResults ul").listview('refresh'); 
	}
}

function loadFunctions(id, title){
    getGameInfo(id);
    getGamePlay(title);
}

//--------------------------------------- GAME INFORMATION ------------------------------------
function getGameInfo(title){
	//alert(title);
	$.ajax({
		url: "http://www.giantbomb.com/api/game/" + title,
		type: "GET",
		data: {
			api_key: apiKey,
			query: title,
			field_list: "name" + "," + "deck" + "," + "id" + "," + "description" + "," + "genres" + "," + "image" + "," + "releases" + "," + "reviews" + "," + "images",
			resources: "game",
			format: "jsonp",
			json_callback: "gameDetails"
		},
		dataType: 'jsonp'	
	});
}

function gameDetails(data){
	window.data = data;
	console.log(data);
	
	game = data.results;
	var description = game.deck;
	var image = game.image.thumb_url;
	//var images = game.images[0].medium_url;
	
	var imageOutput = '';
	var imagesOutput = '';
	var decriptionOutput = '';
	
	imageOutput += "<img  src='"+image+"'>";
	decriptionOutput += description;
	decriptionOutput += '<br><br><hr>';
	//imagesOutput += "<img  src='"+images+"'>";
/*	
	for(var i=0; i<= 5; i++) {
	    var images = game.images[i].medium_url;
	    
	    imagesOutput += "<li><img src='"+images+"'>";
	    

	}
	*/
	console.log();
	$('#image').html(imageOutput);
	$('#images').html(imagesOutput);
	$('#info').html(decriptionOutput);
}

//--------------------------------------- GAMEPLAY VIDEOS ------------------------------------
var youtubeApiKey = "AIzaSyDZwGRSbI8GkRto-Ekyvoz32pD_rJQCGqQ";
/*
function getGamePlay(title){
	search = title + " gameplay";
	alert(search);
	$.ajax({
		url:  "https://www.googleapis.com/youtube/v3/search?",
		type: "GET",
		data: {
			key: youtubeApiKey,
			part: "snippet",
			maxResults: "10",
			q: title,
			//type: "jsonp"
		},
		//dataType: "jsonp"
	})
}
*/
function getGamePlay(title){
	search = title + " gameplay";
	//alert(search);
	$.ajax({
		url:  "http://gdata.youtube.com/feeds/api/videos?",
		type: "GET",
		data: {
			key: youtubeApiKey,
			//part: "snippet",
			maxResults: "10",
			q: title,
			alt: "json",
			callback: "listVideos"
		},
	})
}

function getVideos(data) {
    console.log(data.feed);
}

function listVideos(data) {
    var output ='Gameplay Videos <br>';
    console.log(data);
    for ( var i=0; i<6; i++) {
	    
	    var title = data.feed.entry[i].title.$t;
	    var thumbnail = data.feed.entry[i].media$group.media$thumbnail[0].url;
	    var description = data.feed.entry[i].media$group.media$description.$t;
	    var id = data.feed.entry[i].id.$t.substring(42);
	    
	    var blocktype = ((i % 2)===1) ? 'b': 'a';
	    
	    output += '<div class="ui-block-' + blocktype + '">';

	    output += '<a href="#videoplayer" data-transition="fade" onclick="playVideo(\'' +  id + '\',\'' + title + '\', \'' + escape(description) + '\')">';
	    output += '<h3 class="movietitle">' + title + '</h3>';
	    output += '<img src="' + thumbnail + '" alt="' + title + '" />';
	    output +="</a>";
	    output +="</div>";
    }
    
    $('#videolist').html(output);
}

function playVideo(id, title, description) {
	//alert(id);
	var output ='<iframe src="https://www.youtube.com/embed/'+ id +'?autoplay=1" frameborder="0" allowfullscreen></iframe>';
	output += '<h3>' + title + '</h3>';
	//output += '<p>' + unescape(description) + '</p>';
	$('#myplayer').html(output);
}



