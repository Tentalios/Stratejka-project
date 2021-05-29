var canvas = document.getElementById("gameScreen");
var context = canvas.getContext("2d");

var leftPlayerMenu = $("section.left_player");
var rightPlayerMenu = $("section.right_player");

var endOfTurn = $("input.end_turn");

var units = $("section.unit");

/////////// Переменные

var cellWidth = 60;		// Ширина тайла.
var cellHeight = 60;	// Высота тайла.

canvas.width = 12*cellWidth;	// Задание ширины поля.
canvas.height = 12*cellHeight;	// Задание высоты поля.

var cellArray = [];	// Двумерный массив тайлов.

var playerTurn = 0;	// Переменная содержащая информацию о том, чей ход.

var selectedUnitMenu = "";	// Имя выбранного в меню покупки юнита 

///////////

/////////// Объекты

//// Тайлы

var cellGrass = new Image();
cellGrass.src = "assets/images/tiles/grass.png";

////


///////////

/////////// Тайлы

for (var cellX = 0; cellX<canvas.width/cellWidth; cellX++) {
	cellArray[cellX] = [];
	for (var cellY = 0; cellY<canvas.height/cellHeight; cellY++) {
		cellArray[cellX].push({
			x:cellX*cellHeight,
			y:cellY*cellWidth
		});
	}
}

///////////

/////////// Функции

//// Передача хода

function takeTurn(player){
	units.removeClass("select_unit");
	switch(player){
		case "leftTurnEnd":
			playerTurn = 1;
			leftPlayerMenu.addClass("non-display");
			rightPlayerMenu.removeClass("non-display");
			break;
		case "rightTurnEnd":
			playerTurn = 0;
			rightPlayerMenu.addClass("non-display");
			leftPlayerMenu.removeClass("non-display");
			break;
	}
}

// Вызов функции смены хода при клике на кнопку

endOfTurn.click(function(){
	takeTurn($(this).attr("name"));
});

//

////

//// Занесение имени выбранного юнита

function selectUnitMenu(unitName){
	selectedUnitMenu = unitName;
}

////

/////////// Игра

function game(){
	// Отрисовка тайлов травы
	cellArray.forEach(function(item){
		item.forEach(function(item){
			context.drawImage(cellGrass, item.x, item.y, cellWidth, cellHeight);
		});
	});
	// 

	requestAnimationFrame(game);
}

///////////

///////////