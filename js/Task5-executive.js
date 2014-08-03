/**
 * Created by Victoria on 02.08.2014.
 */
'use strict';

//__________________________________CONSTANTS____________________________________________________
var CONSTANTS = {PICTURE_URLs: ['img/picture1.png', 'img/picture2.png', 'img/picture3.png'],
    CLASSES: { MAIN_WINDOW: 'main-window', EMPTY_CELL: 'empty-cell', ELEMENT: 'element'},
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

FifteenPuzzle.prototype.clickElement = function(element, game){
    if(element.index !== CONSTANTS.EMPTY_CELL && element.hasEmptyNeighbor()){
        game.sayAboutEmptyCellNeighbor(element);
        game.sayAboutNoEmptyNeighbor(element);
        game.replaceWithEmptyCell(element);
    }
};

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

/*Element.prototype.replaceEmptyNeighborPlace = function(){
    var index;
    if (this.neighbors.topNeighborIndex === CONSTANTS.EMPTY_CELL){
        index = this.neighbors.
    } ||
        this.neighbors.leftNeighborIndex === CONSTANTS.EMPTY_CELL ||
        this.neighbors.rightNeighborIndex === CONSTANTS.EMPTY_CELL ||
        this.neighbors.bottomNeighborIndex === CONSTANTS.EMPTY_CELL);
};*/

//________________________________CLASS FIFTEEN_PUZZLE__________________________________________________

function FifteenPuzzle(){
    //this.setPicture(); //Doesn't work  =(
    this.initElements();
}

function setOnclickFunction(domElement, element, game) {
    domElement.onclick = click;

    function click(){
        FifteenPuzzle.prototype.clickElement.call(this, element, game);
    }
}

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

FifteenPuzzle.prototype.setPicture = function(numberPicture) {
    var elements = document.getElementsByTagName(CONSTANTS.SPAN);
    if(!numberPicture){
        numberPicture = 0;
    }
    Array.prototype.forEach.call( elements, function(element){
        element.style.backgroundImage = 'url('+ CONSTANTS.PICTURE_URLs[numberPicture]+')';
    });
    elements[15].style.backgroundImage = 'none';
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
    var temp, index, container;

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