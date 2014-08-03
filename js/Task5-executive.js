/**
 * Created by Victoria on 02.08.2014.
 */
'use strict';

//__________________________________CONSTANTS____________________________________________________
var CONSTANTS = {PICTURE_URLs: ['img/picture1.png', 'img/picture2.png', 'img/picture3.png'],
    CLASSES: { MAIN_WINDOW: 'main-window', EMPTY_CELL: 'empty-cell', ELEMENT: 'element-', POPUP: 'popup',
               BLACK_OVERLAY: 'black_overlay'},
    GAME_STATUSES: {ON: 0, PREPARE: 1, OFF: -1},
    SPAN:'span',
    NUM_CELLS_IN_ROW: 4,
    EMPTY_CELL:-1,
    BORDER: 0,
    NUM_ELEMENTS: 16};

//________________________________CLASS ELEMENT__________________________________________________
function Element(index, domElement){
    if(!this.domElement instanceof HTMLElement){
        window.console.error('Error Element initialization: domElement isn`t element of HTMLElement-class!');
    }
    this.domElement = domElement;
    this.index = index;
    this.setNeighborsAndIndexProperties();
}

Element.prototype.setNeighborsAndIndexProperties = function(){
    var neighbors =   { topNeighborIndex: this.index-CONSTANTS.NUM_CELLS_IN_ROW,
        leftNeighborIndex: this.index-1,
        rightNeighborIndex: this.index+1,
        bottomNeighborIndex: this.index+CONSTANTS.NUM_CELLS_IN_ROW};
    switch (this.index % CONSTANTS.NUM_CELLS_IN_ROW){
        case 1:
            neighbors.leftNeighborIndex = CONSTANTS.BORDER;
            break;
        case 0:
            neighbors.rightNeighborIndex = CONSTANTS.BORDER;
    }
    if(this.index <= 4){
        neighbors.topNeighborIndex = CONSTANTS.BORDER;
    }
    if(this.index >= 13){
        neighbors.bottomNeighborIndex = CONSTANTS.BORDER;
    }
    if(this.index === 12){
        neighbors.bottomNeighborIndex = CONSTANTS.EMPTY_CELL;
    }
    if(this.index === 15){
        neighbors.rightNeighborIndex = CONSTANTS.EMPTY_CELL;
    }

    this.neighbors = neighbors;
};

Element.prototype.hasEmptyNeighbor = function(){
    return (this.neighbors.topNeighborIndex === CONSTANTS.EMPTY_CELL ||
            this.neighbors.leftNeighborIndex === CONSTANTS.EMPTY_CELL ||
            this.neighbors.rightNeighborIndex === CONSTANTS.EMPTY_CELL ||
            this.neighbors.bottomNeighborIndex === CONSTANTS.EMPTY_CELL);
};

//________________________________CLASS FIFTEEN_PUZZLE__________________________________________________

function FifteenPuzzle(){
    this.popupWindow = document.getElementsByClassName(CONSTANTS.CLASSES.POPUP)[0];
    this.blackOverlay = document.getElementsByClassName(CONSTANTS.CLASSES.BLACK_OVERLAY)[0];
    this.initElements();
    this.gameStatus = CONSTANTS.GAME_STATUSES.OFF;
}

function setOnclickFunction(domElement, element, game) {
    domElement.onclick = click;

    function click(){
        FifteenPuzzle.prototype.clickElement.call(this, element, game);
    }
}

FifteenPuzzle.prototype.startNewGame = function(){
    this.gameStatus = CONSTANTS.GAME_STATUSES.PREPARE;
    for(var i = 0; i < 250; i++){
        randomStep(this);
    }
    this.gameStatus = CONSTANTS.GAME_STATUSES.ON;

    function randomStep(game){
        var number, index = -1;

        while(index <= 0) {
            number = Math.random()*99 + 1;
            number = Math.ceil(number)% 4;
            switch (number) {
                case 0:
                    index = game.emptyCell.neighbors.topNeighborIndex;
                    break;
                case 1:
                    index = game.emptyCell.neighbors.leftNeighborIndex;
                    break;
                case 2:
                    index = game.emptyCell.neighbors.bottomNeighborIndex;
                    break;
                case 3:
                    index = game.emptyCell.neighbors.rightNeighborIndex;
                    break;
            }
        }
        game.elements[index-1].domElement.onclick();
    }
};

FifteenPuzzle.prototype.closePopup = function(){
    this.popupWindow.style.display='none';
    this.blackOverlay.style.display ='none';
};

FifteenPuzzle.prototype.clickElement = function(element, game){
    if(game.gameStatus === CONSTANTS.GAME_STATUSES.OFF){return;}

    if(element.index !== CONSTANTS.EMPTY_CELL && element.hasEmptyNeighbor()){
        game.sayAboutEmptyCellNeighbor(element);
        game.sayAboutNoEmptyNeighbor(element);
        game.replaceWithEmptyCell(element);
    }
    if(game.gameStatus === CONSTANTS.GAME_STATUSES.ON){
        if(game.checkWin()) {
            game.popupWindow.style.display='block';
            game.blackOverlay.style.display='block';

            game.gameStatus = CONSTANTS.GAME_STATUSES.OFF;
        }
    }
};

FifteenPuzzle.prototype.checkWin = function(){

    var spans = document.getElementsByTagName(CONSTANTS.SPAN), number;
    for(var i = 0; i < CONSTANTS.NUM_ELEMENTS-1; i++){
        number = parseInt(spans[i].className.replace(CONSTANTS.CLASSES.ELEMENT, ''), 10);
        if(number !== i+1){
            return false;
        }
    }
    return true;
};

FifteenPuzzle.prototype.initElements = function(){
    var game = this;
    
    this.elements = [];
    var domElements = document.getElementsByTagName(CONSTANTS.SPAN);
    for(var i = 0; i < CONSTANTS.NUM_ELEMENTS; i++){
        this.elements.push(new Element(i+1, domElements[i]));
        setOnclickFunction(domElements[i], this.elements[i], game);
    }
    this.emptyCell = this.elements[CONSTANTS.NUM_ELEMENTS-1];
    this.emptyCell.index = CONSTANTS.EMPTY_CELL;
};

FifteenPuzzle.prototype.sayAboutNoEmptyNeighbor = function(element) {
    var index = this.emptyCell.neighbors.leftNeighborIndex;
    if(index > 0 && index!== element.index) {
        this.elements[index-1].neighbors.rightNeighborIndex = element.index;
    }
    index = this.emptyCell.neighbors.rightNeighborIndex;
    if(index > 0 && index!== element.index) {
        this.elements[index-1].neighbors.leftNeighborIndex = element.index;
    }
    index = this.emptyCell.neighbors.topNeighborIndex;
    if(index > 0 && index!== element.index) {
        this.elements[index-1].neighbors.bottomNeighborIndex  = element.index;
    }
    index = this.emptyCell.neighbors.bottomNeighborIndex;
    if(index > 0 && index!== element.index) {
        this.elements[index-1].neighbors.topNeighborIndex = element.index;
    }
};
FifteenPuzzle.prototype.sayAboutEmptyCellNeighbor = function(element) {
    var index = element.neighbors.leftNeighborIndex;
    if(index > 0) {
        this.elements[index-1].neighbors.rightNeighborIndex = CONSTANTS.EMPTY_CELL;
    }
    index = element.neighbors.rightNeighborIndex;
    if(index > 0) {
        this.elements[index-1].neighbors.leftNeighborIndex = CONSTANTS.EMPTY_CELL;
    }
    index = element.neighbors.topNeighborIndex;
    if(index > 0) {
        this.elements[index-1].neighbors.bottomNeighborIndex  = CONSTANTS.EMPTY_CELL;
    }
    index = element.neighbors.bottomNeighborIndex;
    if(index > 0) {
        this.elements[index-1].neighbors.topNeighborIndex = CONSTANTS.EMPTY_CELL;
    }
};
FifteenPuzzle.prototype.replaceWithEmptyCell = function(element) {
    var temp;

    if(element.neighbors.topNeighborIndex === CONSTANTS.EMPTY_CELL){
        element.neighbors.topNeighborIndex = element.index;
        this.emptyCell.neighbors.bottomNeighborIndex = CONSTANTS.EMPTY_CELL;
    }
    if(element.neighbors.bottomNeighborIndex === CONSTANTS.EMPTY_CELL){
        element.neighbors.bottomNeighborIndex = element.index;
        this.emptyCell.neighbors.topNeighborIndex = CONSTANTS.EMPTY_CELL;
    }
    if(element.neighbors.leftNeighborIndex === CONSTANTS.EMPTY_CELL){
        element.neighbors.leftNeighborIndex = element.index;
        this.emptyCell.neighbors.rightNeighborIndex = CONSTANTS.EMPTY_CELL;
    }
    if(element.neighbors.rightNeighborIndex === CONSTANTS.EMPTY_CELL){
        element.neighbors.rightNeighborIndex = element.index;
        this.emptyCell.neighbors.leftNeighborIndex = CONSTANTS.EMPTY_CELL;
    }

    temp = element.neighbors;
    element.neighbors = this.emptyCell.neighbors;
    this.emptyCell.neighbors = temp;


    temp = element.domElement;
    element.domElement= this.emptyCell.domElement;
    this.emptyCell.domElement = temp;

    temp = element.domElement.className;
    element.domElement.className = this.emptyCell.domElement.className;
    this.emptyCell.domElement.className = temp;

    temp = element.domElement.onclick;
    element.domElement.onclick = this.emptyCell.domElement.onclick;
    this.emptyCell.domElement.onclick = temp;
};

//_____________________MAIN____________________________________________________
var newGame = new FifteenPuzzle();