$(document).ready(function(){
	var startButton = $("input.play");
	var menu = $("div.menu");
	var gameZone = $("div.game");
	var units = $("section.unit");
	startButton.click(function(){
		menu.fadeOut();
		gameZone.fadeIn();
		game();
	});

	units.click(function(){ 
		selectUnitMenu($(this).attr("name"));
		units.removeClass("select_unit");
		$(this).addClass("select_unit");
	});
});