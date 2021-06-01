var canvas = document.getElementById("gameScreen");
var context = canvas.getContext("2d");

var leftPlayerMenu = $("section.left_player");
var rightPlayerMenu = $("section.right_player");

var leftPlayerHealthRender = $("section.left_player section.info p.health");
var rightPlayerHealthRender = $("section.right_player section.info p.health");

var leftPlayerMoneyRender = $("section.left_player section.info p.money");
var rightPlayerMoneyRender = $("section.right_player section.info p.money");

var endOfTurn = $("section.end_step_button button");

var units = $("section.unit");

var moneyPerTurn = $("section.info_player p.gold_per_tick");
var playerPoints = $("section.info_player p.captured_points");
var totalUnits = $("section.info_player p.units_on_battleground");

var selectedUnitImage = $("section.info_selected_unit_img img");

var selectedUnitHealth = $("section.info_selected_unit p.unit_hp");
var selectedUnitDamage = $("section.info_selected_unit p.unit_dmg");
var selectedUnitSpeed = $("section.info_selected_unit p.unit_energy");
var selectedUnitRange = $("section.info_selected_unit p.unit_range");
/////////// Переменные

var cellWidth = 30;		// Ширина тайла.
var cellHeight = 30;	// Высота тайла.

canvas.width = 25*cellWidth;	// Задание ширины поля.
canvas.height = 13*cellHeight;	// Задание высоты поля.

var cellArray = [];			// Двумерный массив тайлов.

var stepCellArray = [];	// Массив тайлов, на которые может сходить юнит за этот ход
var attackCellArray = [];	// Массив разрешённых к атаке юнитом тайлов за этот ход
var buildRadiusArray = [];	// Массив тайлов где юнит может строить

var goldPointArray = [];	// Массив точек добычи ресурсов
var relicPoint = {
	x: (((canvas.width/cellWidth)/2)*cellWidth)-cellWidth/2,
	y: (((canvas.height/cellHeight)/2)*cellHeight)-cellHeight/2,
	side: "none",
	maxHealth: 250,
	currentHealth: 0
};

var relicUnitCoolDown = 0;

var playerTurn = "left";	// Переменная содержащая информацию о том, чей ход.

var turnCount = 0;

var selectedUnitMenu = "cursor";	// Имя выбранного в меню покупки юнита 

var leftPlayerUnitsArray = [];	// Список юнитов левого игрока
var rightPlayerUnitsArray = [];	// Список юнитов правого игрока

var leftPlayerMoney = 1000;
var rightPlayerMoney = 950;

var leftPlayerHealth = 1000;
var rightPlayerHealth = 1000;

var currentUnit = [];	// Переменная для хранения выбранного юнита

///////////

/////////// Объекты

//// Тайлы

var cellGrass = new Image();
cellGrass.src = "assets/images/tiles/grass.png";
var cellSand = new Image();
cellSand.src = "assets/images/tiles/sand.png";
var cellAttack = new Image();
cellAttack.src = "assets/images/tiles/attack.png";
var goldPoint = new Image();
goldPoint.src = "assets/images/tiles/gold_point.png";
var mine_left = new Image();
mine_left.src = "assets/images/tiles/mine_left.png";
var mine_right = new Image();
mine_right.src = "assets/images/tiles/mine_right.png";
var relicPointCell = new Image();
relicPointCell.src = "assets/images/tiles/relic_point.png";
var leftRelicPoint =  new Image();
leftRelicPoint.src = "assets/images/tiles/left_relic_point.png";
var rightRelicPoint =  new Image();
rightRelicPoint.src = "assets/images/tiles/right_relic_point.png";

////

//// Юниты

// Изображения юнитов

var leftRat = new Image();
leftRat.src="assets/images/units/rat_left.jpg";
var rightRat = new Image();
rightRat.src="assets/images/units/rat_right.jpg";
var leftThiccRat = new Image();
leftThiccRat.src = "assets/images/units/left_thicc-rat.png";
var rightThiccRat = new Image();
rightThiccRat.src = "assets/images/units/right_thicc-rat.png";

//

// Список юнитов
var unitsArray = {
	rat:{
		health: 100,
		damage: 20,
		speed: 3,
		range: 2,
		price: 50,
		leftImage: leftRat,
		rightImage: rightRat
	},
	thiccRat:{
		health: 300,
		damage: 35,
		speed: 2,
		range: 1,
		price: 150,
		leftImage: leftThiccRat,
		rightImage: rightThiccRat
	}
};
//

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

/////////// Генерация точек ресурсов

var sideRelicsCount = getRandomInt(2, 5);
var i = 0;
while (i < sideRelicsCount) {
	var goldX = (getRandomInt(2, (canvas.width/2 - cellWidth)/cellWidth)*cellWidth);
	var goldY = (getRandomInt(0, canvas.height/cellHeight)*cellHeight);
	var check_gold = goldPointArray.filter(function(e){
		return e.x==goldX - cellWidth &&  e.y==goldY-cellHeight;
	});	
	if(check_gold.length == 0){
		goldPointArray.push({
			x: goldX-cellWidth,
			y: goldY-cellHeight,
			side: "none"
		});
		goldPointArray.push({
			x: canvas.width-goldX,
			y: canvas.height-goldY,
			side: "none"
		});
		i++;
	}
}
console.log(goldPointArray);
///////////

/////////// Функции

//// Рандомизация числа в диапозоне

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
}

////

//// Передача хода

function takeTurn(){
	units.removeClass("select_unit");
	selectedUnitMenu = "cursor";
	switch(playerTurn){
		case "left":
			playerTurn = "right";
			leftPlayerMenu.addClass("non-display");
			rightPlayerMenu.removeClass("non-display");
			var check_money = goldPointArray.filter(function(e){
				return e.side == "right";
			});
			rightPlayerMoney += 50*(check_money.length+1);
			currentUnit = [];
			buildRadiusArray = [];
			stepCellArray = [];
			attackCellArray = [];
			leftPlayerUnitsArray.forEach(function(item){
				item.turnStep = 0;
				item.turnAtack = 0;
			});
			rightPlayerUnitsArray.forEach(function(item){
				item.turnStep = 1;
				item.turnAtack = 1;
			});
			relicUnitCoolDown--;
			break;
		case "right":
			playerTurn = "left";
			rightPlayerMenu.addClass("non-display");
			leftPlayerMenu.removeClass("non-display");
			var check_money = goldPointArray.filter(function(e){
				return e.side == "left";
			});
			leftPlayerMoney += 50*(check_money.length+1);
			currentUnit = [];
			buildRadiusArray = [];
			stepCellArray = [];
			attackCellArray = [];
			rightPlayerUnitsArray.forEach(function(item){
				item.turnStep = 0;
				item.turnAtack = 0;
			});
			leftPlayerUnitsArray.forEach(function(item){
				item.turnStep = 1;
				item.turnAtack = 1;
			});
			turnCount+=1;
			relicUnitCoolDown--;
			break;
	}
}

// Вызов функции смены хода при клике на кнопку

endOfTurn.click(function(){
	takeTurn();
});

//

////

//// Занесение имени выбранного юнита

function selectUnitMenu(unitName){
	selectedUnitMenu = unitName;
}

////

//// Вычисление разрешённых клеток для юнита

function getStepCells(unit){
	currentUnit = unit;
	var radius_cells = [
				{
					x:currentUnit[0].x+cellWidth,
					y:currentUnit[0].y
				},
				{
					x:currentUnit[0].x+cellWidth,
					y:currentUnit[0].y+cellHeight
				},
				{
					x:currentUnit[0].x,
					y:currentUnit[0].y+cellHeight
				},
				{
					x:currentUnit[0].x-cellWidth,
					y:currentUnit[0].y+cellHeight
				},
				{
					x:currentUnit[0].x-cellWidth,
					y:currentUnit[0].y
				},
				{
					x:currentUnit[0].x-cellWidth,
					y:currentUnit[0].y-cellHeight
				},
				{
					x:currentUnit[0].x,
					y:currentUnit[0].y-cellHeight
				},
				{
					x:currentUnit[0].x+cellWidth,
					y:currentUnit[0].y-cellHeight
				}
			];
	radius_cells.forEach(function(item){
		var x = item.x;
		var y = item.y;
		goldPointArray.forEach(function(item){
			if(x==item.x && y==item.y && item.side != playerTurn){
				buildRadiusArray.push({
					x:x,
					y:y
				});
			}
		});
		if(relicPoint.x == x && relicPoint.y == y && relicPoint.side!=playerTurn){
			buildRadiusArray.push({
				x:x,
				y:y
			});
		}
	});
	if(unit.length>0 && unit[0].turnStep == 1){
		for (var step = unit[0].speed; step>=0; step--) {
			for (var i = step; i>0; i--){
				stepCellArray.push({
					x:(unit[0].cellX-step+i)*cellWidth,
					y:(unit[0].cellY+i)*cellHeight
				});
				stepCellArray.push({
					x:(unit[0].cellX+step-i)*cellWidth,
					y:(unit[0].cellY-i)*cellHeight
				});
				stepCellArray.push({
					x:(unit[0].cellX+i)*cellWidth,
					y:(unit[0].cellY+step-i)*cellHeight
				});
				stepCellArray.push({
					x:(unit[0].cellX-i)*cellWidth,
					y:(unit[0].cellY-step+i)*cellHeight
				});
			}
		}
	}
}

////

//// Вычисление атакуемых юнитом клеток

function getAttackCells(){
	if(currentUnit.length > 0 && currentUnit[0].turnAtack == 1){
		switch(playerTurn){
			case "left":
				rightPlayerUnitsArray.forEach(function(item){
					if(Math.pow((currentUnit[0].cellX - item.cellX),2) + Math.pow((currentUnit[0].cellY - item.cellY),2) <= Math.pow(currentUnit[0].range, 2)){
						attackCellArray.push({
							x:item.x,
							y:item.y
						});
					}
				});
				break;
			case "right":
				leftPlayerUnitsArray.forEach(function(item){
					if(Math.pow((currentUnit[0].cellX - item.cellX),2) + Math.pow((currentUnit[0].cellY - item.cellY),2) <= Math.pow(currentUnit[0].range, 2)){
						attackCellArray.push({
							x:item.x,
							y:item.y
						});
					}
				});
				break;
		}
	}
}

////

//// Передвижение юнитов

function unitMove(currentUnitArray){
	var check_buildings = goldPointArray.filter(function(e){
		return e.x==cursorX && e.y==cursorY && e.side != "none";
	});
	var check_step = stepCellArray.filter(function(e){
		return e.x==cursorX && e.y==cursorY;
	});
	switch(playerTurn){
		case "right":
			var check_enemy = leftPlayerUnitsArray.filter(function(e){
				return e.x==cursorX && e.y==cursorY;
			});
			var check_other_units = rightPlayerUnitsArray.filter(function(e){
				return e.x==cursorX && e.y==cursorY && e.type != currentUnit[0].type;
			});
			break;
		case "left":
			var check_enemy = rightPlayerUnitsArray.filter(function(e){
				return e.x==cursorX && e.y==cursorY;
			});
			var check_other_units = leftPlayerUnitsArray.filter(function(e){
				return e.x==cursorX && e.y==cursorY && e.type != currentUnit[0].type;
			});
			break;
	}
	if(check_step.length > 0 && check_enemy.length == 0 && check_other_units == 0 && check_buildings.length == 0 && !(cursorX==relicPoint.x && cursorY==relicPoint.y)){
		currentUnit.forEach(function(item){
				item.x = cursorX;
				item.y = cursorY;
				item.cellX = cursorX/cellWidth;
				item.cellY = cursorY/cellHeight;
				item.turnStep = 0;
				console.log("Юнит сходил");
		});
	}
}

////

//// Атака юнитов

function unitAttack(currentUnitArray){
	var negativeHealth = 0;
	for(var i = currentUnitArray.length-1; i>=0; i--){
		if(currentUnitArray[i].x == cursorX && currentUnitArray[i].y == cursorY){
			console.log("Урон прошёл");
			if(currentUnit[0].turnAtack == 1){
				currentUnitArray[i].currentHealth-=currentUnit[0].damage*currentUnit.length;
				currentUnit.forEach(function(item){
					item.turnAtack = 0;
				});
			}
			if(negativeHealth<=0){
				var currentHealth = currentUnitArray[i].currentHealth;
				console.log(currentHealth);
				currentUnitArray[i].currentHealth+=negativeHealth;
				console.log(currentUnitArray[i].currentHealth);
				negativeHealth+=currentHealth;
				console.log(negativeHealth);
			}
		}
		if(currentUnitArray[i].currentHealth<=0){
			console.log("Вошел");
			console.log(negativeHealth);
			currentUnitArray.splice(i,1);
		}
	}
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
		console.log("ПКМ");
		if(currentUnit.length>0){
			var check_units;
			var check_enemy;
			var currentArray;
			switch(playerTurn){
				case "right":
					console.log("Правый");
					check_units = rightPlayerUnitsArray.filter(function(e){
						return e.x == cursorX && e.y==cursorY && e.type == currentUnit[0].type;
					});
					break;
				case "left":
					console.log("Левый");
					check_units = leftPlayerUnitsArray.filter(function(e){
						return e.x == cursorX && e.y==cursorY && e.type == currentUnit[0].type;
					});
					break;
			}
			var check_step = stepCellArray.filter(function(e){
				return e.x==cursorX && e.y==cursorY;
			});
			var check_gold = buildRadiusArray.filter(function(e){
				return e.x==cursorX && e.y==cursorY;
			});
			if(check_units.length > 0 && check_step.length > 0){

				switch(playerTurn){
					case "left":
						unitMove(leftPlayerUnitsArray);
						break;
					case "right":
						unitMove(rightPlayerUnitsArray);
						break;
				}
				currentUnit = [];
				buildRadiusArray = [];
				stepCellArray = [];
				attackCellArray = [];
			}
			else if(check_gold.length>0 && currentUnit[0].turnAtack == 1){
				goldPointArray.forEach(function(item){
					if(check_gold[0].x == item.x && check_gold[0].y == item.y){
						item.side = playerTurn;
						switch(playerTurn){
							case "right":
								rightPlayerMoney -= 100;
								break;
							case "left":
								leftPlayerMoney -= 100;
								break;
						}
						currentUnit[0].turnAtack = 0;
					}
				});
				if(relicPoint.x == check_gold[0].x && relicPoint.y == check_gold[0].y){

					if(relicPoint.currentHealth>0 ){
						relicPoint.currentHealth-=currentUnit[0].damage*currentUnit.length;
						if(relicPoint.currentHealth<=0){
							relicPoint.side = "none";
						}
					}
					else{
						switch(playerTurn){
							case "right":
								if(rightPlayerMoney >= 300){
									relicPoint.side = playerTurn;
									rightPlayerMoney-=300;
									relicPoint.currentHealth = relicPoint.maxHealth;
									relicUnitCoolDown = 10;
								}
								break;
							case "left":
								if(leftPlayerMoney >= 300){
									relicPoint.side = playerTurn;
									leftPlayerMoney-=300;
									relicPoint.currentHealth = relicPoint.maxHealth;
									relicUnitCoolDown = 10;
								}
								break;
						}
					}
				}
				currentUnit = [];
				buildRadiusArray = [];
				stepCellArray = [];
				attackCellArray = [];
			}
		}
		else{
			var check_units;
			switch(playerTurn){
				case "right":
					check_units = rightPlayerUnitsArray.filter(function(e){
						return e.x==cursorX && e.y == cursorY;
					});

					break;
				case "left":
					check_units = leftPlayerUnitsArray.filter(function(e){
						return e.x==cursorX && e.y == cursorY;
					});
					break;
			}
			console.log(check_units);
			if(check_units.length >= 2 && check_units[0].turnStep == 1){
				if(check_units[0].y>0){
					cursorY-=cellHeight;
					currentUnit = [];
					currentUnit.push(check_units[0]);
					getStepCells(currentUnit);
					switch(playerTurn){
						case "right":
							unitMove(rightPlayerUnitsArray);
						case "left":
							unitMove(leftPlayerUnitsArray);
					}
				}
				else{
					cursorY+=cellHeight;
					currentUnit = [];
					currentUnit.push(check_units[0]);
					getStepCells(currentUnit);
					switch(playerTurn){
						case "right":
							unitMove(rightPlayerUnitsArray);
						case "left":
							unitMove(leftPlayerUnitsArray);
					}
				}
			}
			currentUnit = [];
			buildRadiusArray = [];
			stepCellArray = [];
			attackCellArray = [];
		}
	}
	if(event.which==1) // левый клик
	{ 
			switch(selectedUnitMenu){
				case "cursor":
					switch(playerTurn){
						case "right":
								var check_unit = rightPlayerUnitsArray.filter(function(e){
									return e.x==cursorX && e.y==cursorY;
								});
								if(check_unit.length > 0){
									stepCellArray = [];
									attackCellArray = [];
									getStepCells(check_unit);
									getAttackCells();
								}
								else if(currentUnit.length>0){
									if(attackCellArray.length > 0){
										var check_attack = attackCellArray.filter(function(e){
											return e.x==cursorX && e.y==cursorY;
										});
										if(check_attack.length > 0){
											unitAttack(leftPlayerUnitsArray);
										}
									}
									if(stepCellArray.length > 0){
										unitMove(rightPlayerUnitsArray);
									}
									stepCellArray = [];
									currentUnit = [];
									buildRadiusArray = [];
									attackCellArray = [];
								}
								else{
									stepCellArray = [];
									currentUnit = [];
									buildRadiusArray = [];
									attackCellArray = [];
								}
							break;
						case "left":
								var check_unit = leftPlayerUnitsArray.filter(function(e){
									return e.x==cursorX && e.y==cursorY;
								});
								if(check_unit.length > 0){
									stepCellArray = [];
									getStepCells(check_unit);
									getAttackCells();
								}
								else if(currentUnit.length>0){
									if(attackCellArray.length > 0){
										var check_attack = attackCellArray.filter(function(e){
											return e.x==cursorX && e.y==cursorY;
										});
										if(check_attack.length > 0){
											unitAttack(rightPlayerUnitsArray);
										}
									}
									if(stepCellArray.length > 0){
										unitMove(leftPlayerUnitsArray);
									}
									stepCellArray = [];
									currentUnit = [];
									buildRadiusArray = [];
									attackCellArray = [];
								}
								else{
									stepCellArray = [];
									currentUnit = [];
									buildRadiusArray = [];
									attackCellArray = [];
								}
							break;
					}
					break;

		// Высадка юнитов на поле	
				default:
					switch(playerTurn){
						case "right":
							var check_other_units = rightPlayerUnitsArray.filter(function(e){
								return e.x==cursorX && e.y==cursorY && e.type != selectedUnitMenu;
							});
							var check_enemy = leftPlayerUnitsArray.filter(function(e){
								return e.x==cursorX && e.y==cursorY;
							});
							if(rightPlayerMoney>=unitsArray[selectedUnitMenu].price && check_other_units.length == 0 && check_enemy == 0 && cursorX >= canvas.width-2*cellWidth){
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
									turnStep: 0,
									turnAtack: 0
								});
								rightPlayerMoney-=unitsArray[selectedUnitMenu].price;
							}
							break;
						case "left":
							var check_other_units = leftPlayerUnitsArray.filter(function(e){
								return e.x==cursorX && e.y==cursorY && e.type != selectedUnitMenu;
							});
							var check_enemy = rightPlayerUnitsArray.filter(function(e){
								return e.x==cursorX && e.y==cursorY;
							});
							if(leftPlayerMoney>=unitsArray[selectedUnitMenu].price && check_other_units.length == 0 && check_enemy == 0 && cursorX <= cellWidth){
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
									turnStep: 0,
									turnAtack: 0
								});
								leftPlayerMoney-=unitsArray[selectedUnitMenu].price;
							}
							break;
					}
					break;
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
	context.fillStyle = "#ffc0cb"; //Цвет текста в игре
    context.font = "25px Arial"; //Размер и шрифт тектса
	// Отрисовка тайлов травы
	cellArray.forEach(function(item){
		item.forEach(function(item){
			context.drawImage(cellGrass, item.x, item.y, cellWidth, cellHeight);
		});
	});
	// 
	// Отрисовка помеченных тайлов
	stepCellArray.forEach(function(item){
		context.drawImage(cellSand, item.x, item.y, cellWidth, cellHeight)
	});
	//
	// Отрисовка реликтовых точек
	goldPointArray.forEach(function(item){
		switch(item.side){
			case "right":
				context.drawImage(mine_right, item.x, item.y, cellWidth, cellHeight);
				break;
			case "left":
				context.drawImage(mine_left, item.x, item.y, cellWidth, cellHeight);
				break;
			default:
				context.drawImage(goldPoint, item.x, item.y, cellWidth, cellHeight);
				break;
		}
	});
	switch(relicPoint.side){
		case "none":
			context.drawImage(relicPointCell, relicPoint.x, relicPoint.y, cellWidth, cellHeight);
			break;
		case "right":
			context.drawImage(rightRelicPoint, relicPoint.x, relicPoint.y, cellWidth, cellHeight);
			break;
		case "left":
			context.drawImage(leftRelicPoint, relicPoint.x, relicPoint.y, cellWidth, cellHeight);
			break;
	}
	//
	// Отрисовка юнитов на поле
	if(leftPlayerUnitsArray.length > 0){
		leftPlayerUnitsArray.forEach(function(item){
			context.drawImage(item.img, item.x, item.y, cellWidth, cellHeight);
			var stack = leftPlayerUnitsArray.filter(function(e){
				return e.x == item.x && e.y == item.y;
			});
    		context.fillText(stack.length, item.x+cellWidth/2, item.y+cellHeight);
		});
	}
	if(rightPlayerUnitsArray.length > 0){
		rightPlayerUnitsArray.forEach(function(item){
			context.drawImage(item.img, item.x, item.y, cellWidth, cellHeight);
			var stack = rightPlayerUnitsArray.filter(function(e){
				return e.x == item.x && e.y == item.y;
			});
    		context.fillText(stack.length, item.x+cellWidth/2, item.y+cellHeight);
		});
	}
	//
	// Отрисовка атакуемых юнитов
	if(attackCellArray.length > 0){
		attackCellArray.forEach(function(item){
			context.drawImage(cellAttack, item.x, item.y, cellWidth, cellHeight);
		});
	}
	//
	// Отрисовка точек где можно строить
	if(buildRadiusArray.length > 0){
		buildRadiusArray.forEach(function(item){
			context.drawImage(cellAttack, item.x, item.y, cellWidth, cellHeight);
		});
	}
	//
	// Отрисовка денег и здоровья игроков
	leftPlayerHealthRender.text(leftPlayerHealth);
	rightPlayerHealthRender.text(rightPlayerHealth);
	leftPlayerMoneyRender.text(leftPlayerMoney);
	rightPlayerMoneyRender.text(rightPlayerMoney);
	//
	// Отрисовка информации игроков в нижнем меню
	var check_mines = goldPointArray.filter(function(e){
		return e.side == playerTurn;
	});
	moneyPerTurn.text("Золота за ход: "+((check_mines.length+1)*50));
	playerPoints.text("Построено шахт: "+check_mines.length);
	switch(playerTurn){
		case "right":
			totalUnits.text("Войска: "+rightPlayerUnitsArray.length);
			break;
		case "left":
			totalUnits.text("Войска: "+leftPlayerUnitsArray.length);
			break;
	}
	//
	// Отрисовка информации о выбранном в меню юните
	if(selectedUnitMenu!="cursor"){
		selectedUnitHealth.text("Здоровье: "+unitsArray[selectedUnitMenu].health);
		selectedUnitDamage.text("Урон: "+unitsArray[selectedUnitMenu].damage);
		selectedUnitSpeed.text("Передвижение: "+unitsArray[selectedUnitMenu].speed+" кл/ход");
		selectedUnitRange.text("Дальность атаки: "+unitsArray[selectedUnitMenu].range);
		switch(playerTurn){
			case "right":
				selectedUnitImage.attr("src",unitsArray[selectedUnitMenu].rightImage.src);
				break;
			case "left":
				selectedUnitImage.attr("src",unitsArray[selectedUnitMenu].leftImage.src);
				break;
		}
	}
	//
	requestAnimationFrame(game);
}

///////

///////////