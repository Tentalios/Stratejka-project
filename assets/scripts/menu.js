$(document).ready(function(){
	var selectedUnitImageBlock = $("section.info_selected_unit_img");
	var selectedUnitInfo = $("section.info_selected_unit");
	var startButton = $("input.play");
	var menu = $("div.menu");
	var gameZone = $("div.game");
	var units = $("section.unit");
	var endOfTurn = $("section.end_step_button button");
	startButton.click(function(){
		menu.fadeOut();
		gameZone.fadeIn();
		game();
	});

	units.click(function(){ 
		selectUnitMenu($(this).attr("name"));
		units.removeClass("select_unit");
		$(this).addClass("select_unit");
		switch($(this).attr("name")){
			case "cursor":
				selectedUnitImageBlock.addClass("non-display");
				selectedUnitInfo.addClass("non-display");
				break;
			default:
				selectedUnitImageBlock.removeClass("non-display");
				selectedUnitInfo.removeClass("non-display");
				break;
		}
	});

	endOfTurn.click(function(){
		selectedUnitImageBlock.addClass("non-display");
		selectedUnitInfo.addClass("non-display");
	});
});