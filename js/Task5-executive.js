/**
 * Created by Victoria on 02.08.2014.
 */
'use strict';

//__________________________________CONSTANTS____________________________________________________
var CONSTANTS = {PICTURE_URLs: ['img/picture1.png', 'img/picture2.png', 'img/picture3.png'],
    CLASSES: { MAIN_WINDOW: 'main-window', EMPTY_CELL_CLASS: 'empty-cell', ELEMENT: 'element-', POPUP: 'popup',
               BLACK_OVERLAY: 'black_overlay'},
    GAME_STATUSES: {ON: 0, PREPARE: 1, OFF: -1},
    SPAN:'span',
    NUM_CELLS_IN_ROW: 4,
    BORDER: -1,
    NUM_ELEMENTS: 16};

FifteenPuzzle.prototype.hasEmptyNeighbor = function(elementIndex){
    return (this.topNeighborIndex(this.emptyCell.Index) === elementIndex ||
            this.leftNeighborIndex(this.emptyCell.Index) === elementIndex ||
            this.rightNeighborIndex(this.emptyCell.Index) === elementIndex ||
            this.bottomNeighborIndex(this.emptyCell.Index) === elementIndex);
};

//________________________________CLASS FIFTEEN_PUZZLE__________________________________________________

function FifteenPuzzle(){
    this.popupWindow = document.getElementsByClassName(CONSTANTS.CLASSES.POPUP)[0];
    this.blackOverlay = document.getElementsByClassName(CONSTANTS.CLASSES.BLACK_OVERLAY)[0];
    this.initElements();
    this.gameStatus = CONSTANTS.GAME_STATUSES.OFF;
}

function setOnclickFunction(domElement, elementIndex, game) {
    domElement.onclick = click;

    function click(){
        FifteenPuzzle.prototype.clickElement.call(this, elementIndex, game);
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
                    index = game.topNeighborIndex(game.emptyCell.Index);
                    break;
                case 1:
                    index = game.leftNeighborIndex(game.emptyCell.Index);
                    break;
                case 2:
                    index = game.bottomNeighborIndex(game.emptyCell.Index);
                    break;
                case 3:
                    index = game.rightNeighborIndex(game.emptyCell.Index);
                    break;
            }
        }
        game.domElements[index].onclick();
    }
};

FifteenPuzzle.prototype.closePopup = function(){
    this.popupWindow.style.display='none';
    this.blackOverlay.style.display ='none';
};

FifteenPuzzle.prototype.clickElement = function(elementIndex, game){
    if(game.gameStatus === CONSTANTS.GAME_STATUSES.OFF){return;}

    if(elementIndex !== game.emptyCell.Index && game.hasEmptyNeighbor(elementIndex)){
        game.replaceWithEmptyCell(elementIndex);
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
    this.emptyCell = {};
    this.emptyCell.Index = CONSTANTS.NUM_ELEMENTS-1;

    this.elementsArray = [];
    this.domElements = document.getElementsByTagName(CONSTANTS.SPAN);

    for(var i = 0; i < CONSTANTS.NUM_ELEMENTS; i++){
        this.elementsArray.push(i);
        setOnclickFunction(this.domElements[i], i, this);
    }
};

FifteenPuzzle.prototype.replaceWithEmptyCell = function(elementIndex) {
    var temp = this.domElements[elementIndex].className;
    this.domElements[elementIndex].className = this.domElements[this.emptyCell.Index].className;
    this.domElements[this.emptyCell.Index].className = temp;

    this.elementsArray[elementIndex] = this.emptyCell.Index;
    this.elementsArray[this.emptyCell.Index] = elementIndex;
    this.emptyCell.Index = elementIndex;
};

FifteenPuzzle.prototype.topNeighbor = function(index){

    var res = index-CONSTANTS.NUM_CELLS_IN_ROW;
    if( index < CONSTANTS.NUM_CELLS_IN_ROW){
        return CONSTANTS.BORDER;
    }else{
        return this.elementsArray[res];
    }
};

FifteenPuzzle.prototype.bottomNeighbor = function(index){
    var res = index+CONSTANTS.NUM_CELLS_IN_ROW;
    if( index >= CONSTANTS.NUM_ELEMENTS-CONSTANTS.NUM_CELLS_IN_ROW){
        return CONSTANTS.BORDER;
    }else{
        return this.elementsArray[res];
    }
};

FifteenPuzzle.prototype.leftNeighbor = function(index){
    var res = index-1;
    if(index % 4 === 1 ){
        return CONSTANTS.BORDER;
    }else{
        return this.elementsArray[res];
    }
};

FifteenPuzzle.prototype.rightNeighbor = function(index){
    var res = index+1;
    if( index % 4 === 0){
        return CONSTANTS.BORDER;
    }else{
        return this.elementsArray[res];
    }
};

FifteenPuzzle.prototype.topNeighborIndex = function(index){

    var res = index-CONSTANTS.NUM_CELLS_IN_ROW;
    if( index < CONSTANTS.NUM_CELLS_IN_ROW){
        return CONSTANTS.BORDER;
    }else{
        return res;
    }
};

FifteenPuzzle.prototype.bottomNeighborIndex = function(index){
    var res = index+CONSTANTS.NUM_CELLS_IN_ROW;
    if( index >= CONSTANTS.NUM_ELEMENTS-CONSTANTS.NUM_CELLS_IN_ROW){
        return CONSTANTS.BORDER;
    }else{
        return res;
    }
};

FifteenPuzzle.prototype.leftNeighborIndex = function(index){
    var res = index-1;
    if((index+1) % 4 === 1 ){
        return CONSTANTS.BORDER;
    }else{
        return res;
    }
};

FifteenPuzzle.prototype.rightNeighborIndex = function(index){
    var res = index+1;
    if( (index+1) % 4 === 0){
        return CONSTANTS.BORDER;
    }else{
        return res;
    }
};

//_____________________MAIN____________________________________________________
var newGame = new FifteenPuzzle();