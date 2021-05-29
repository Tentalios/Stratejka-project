var canvas = document.getElementById("gameScreen");
var context = canvas.getContext("2d");

var leftPlayerMenu = $("section.left_player");
var rightPlayerMenu = $("section.right_player");

var leftPlayerHealthRender = $("section.left_player section.info p.health");
var rightPlayerHealthRender = $("section.right_player section.info p.health");

var leftPlayerMoneyRender = $("section.left_player section.info p.money");
var rightPlayerMoneyRender = $("section.right_player section.info p.money");

var endOfTurn = $("input.end_turn");

var units = $("section.unit");

/////////// Переменные

var cellWidth = 60;		// Ширина тайла.
var cellHeight = 60;	// Высота тайла.

canvas.width = 12*cellWidth;	// Задание ширины поля.
canvas.height = 12*cellHeight;	// Задание высоты поля.

var cellArray = [];	// Двумерный массив тайлов.

var playerTurn = "left";	// Переменная содержащая информацию о том, чей ход.

var selectedUnitMenu = "";	// Имя выбранного в меню покупки юнита 

var leftPlayerUnitsArray = [];	// Список юнитов левого игрока
var rightPlayerUnitsArray = [];	// Список юнитов правого игрока

var leftPlayerMoney = 1000;
var rightPlayerMoney = 1000;

var leftPlayerHealth = 1000;
var rightPlayerHealth = 1000;

///////////

/////////// Объекты

//// Тайлы

var cellGrass = new Image();
cellGrass.src = "assets/images/tiles/grass.png";

////

//// Юниты

// Изображения юнитов

var leftRat = new Image();
leftRat.src="assets/images/units/rat_left.jpg";
var rightRat = new Image();
rightRat.src="assets/images/units/rat_right.jpg";

//

var unitsArray = {
	rat:{
		health: 100,
		damage: 20,
		speed: 2,
		range: 2,
		price: 50,
		leftImage: leftRat,
		rightImage: rightRat
	}
};

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
	selectedUnitMenu = "";
	switch(player){
		case "leftTurnEnd":
			playerTurn = "right";
			leftPlayerMenu.addClass("non-display");
			rightPlayerMenu.removeClass("non-display");
			break;
		case "rightTurnEnd":
			playerTurn = "left";
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

//// Обработка нажатия по полю

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    cursorX = Math.floor((event.clientX - rect.left)/cellWidth)*cellWidth;
    cursorY = Math.floor((event.clientY - rect.top)/cellHeight)*cellHeight;
    console.log('x'+cursorX+'---y'+cursorY);
    if(event.which==3) // правый клик
	{
			
	}
	if(event.which==1) // левый клик
	{ 
		// Высадка юнитов на поле

			if(selectedUnitMenu != ""){
				switch(playerTurn){
					case "right":
						if(rightPlayerMoney>=unitsArray[selectedUnitMenu].price){
							rightPlayerUnitsArray.push({
								x: cursorX,
								y: cursorY,
								cellX: cursorX/cellWidth,
								cellY: cursorY/cellHeight,
								type: selectedUnitMenu,
								maxHealth: unitsArray[selectedUnitMenu].health,
								currentHealth: unitsArray[selectedUnitMenu].health,
								damage: unitsArray[selectedUnitMenu].damage,
								speed: unitsArray[selectedUnitMenu].speed,
								range: unitsArray[selectedUnitMenu].range,
								img: unitsArray[selectedUnitMenu].rightImage,
								turn: 0
							});
							rightPlayerMoney-=unitsArray[selectedUnitMenu].price;
						}
						break;
					case "left":
						if(leftPlayerMoney>=unitsArray[selectedUnitMenu].price){
							leftPlayerUnitsArray.push({
								x: cursorX,
								y: cursorY,
								cellX: cursorX/cellWidth,
								cellY: cursorY/cellHeight,
								type: selectedUnitMenu,
								maxHealth: unitsArray[selectedUnitMenu].health,
								currentHealth: unitsArray[selectedUnitMenu].health,
								damage: unitsArray[selectedUnitMenu].damage,
								speed: unitsArray[selectedUnitMenu].speed,
								range: unitsArray[selectedUnitMenu].range,
								img: unitsArray[selectedUnitMenu].leftImage,
								turn: 0
							});
							leftPlayerMoney-=unitsArray[selectedUnitMenu].price;
						}
						break;
				}
			}

		//
	} 
}

////

//// Нажатие по полю

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
});

////

/////// Игра

function game(){
	// Отрисовка тайлов травы
	cellArray.forEach(function(item){
		item.forEach(function(item){
			context.drawImage(cellGrass, item.x, item.y, cellWidth, cellHeight);
		});
	});
	// 
	// Отрисовка юнитов на поле
	if(leftPlayerUnitsArray.length > 0){
		leftPlayerUnitsArray.forEach(function(item){
			context.drawImage(item.img, item.x, item.y, cellWidth, cellHeight);
		});
	}
	if(rightPlayerUnitsArray.length > 0){
		rightPlayerUnitsArray.forEach(function(item){
			context.drawImage(item.img, item.x, item.y, cellWidth, cellHeight);
		});
	}
	//
	// Отрисовка денег и здоровья игроков
	leftPlayerHealthRender.text(leftPlayerHealth);
	rightPlayerHealthRender.text(rightPlayerHealth);
	leftPlayerMoneyRender.text(leftPlayerMoney);
	rightPlayerMoneyRender.text(rightPlayerMoney);
	//
	requestAnimationFrame(game);
}

///////

///////////