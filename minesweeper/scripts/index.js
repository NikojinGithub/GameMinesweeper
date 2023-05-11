import { cells } from "./data.js";

const page = document.querySelector('body');
const header = document.createElement('header');
const main = document.createElement('section');
const footer = document.createElement('footer');
const minesweeperBlock = document.createElement('div');
const instrumentsArea = document.createElement('div');
const mineArea =  document.createElement('div');
const minesCount = document.createElement('div');
const resetButton = document.createElement('button');
const timer = document.createElement('div');

const blocksPage = [header, main, footer];
const blocksMain = [minesweeperBlock];
const insideBlocks= [instrumentsArea, mineArea];
const instruments = [minesCount, resetButton, timer];

function addBlocks(container, array){
  array.forEach(elem => container.append(elem));
}

addBlocks(page, blocksPage);
addBlocks(main, blocksMain);
addBlocks(minesweeperBlock, insideBlocks);
addBlocks(instrumentsArea, instruments);

page.classList.add('page');
header.classList.add('header');
main.classList.add('main');
footer.classList.add('footer');
minesweeperBlock.classList.add('minesweeper');
instrumentsArea.classList.add('minesweeper__instruments');
mineArea.classList.add('minesweeper__area');
minesCount.classList.add('minesweeper__count');
resetButton.classList.add('minesweeper__button');
timer.classList.add('minesweeper__timer');

function createCells(container, array){
  array = array.sort(() => Math.random() - 0.5);
  array.forEach(item => {
    const element = document.createElement('div');
    element.classList.add('minesweeper__cell');
    element.style.backgroundImage = `url(${item.link})`
    container.append(element);
  })
}

createCells(mineArea, cells);

const cell = mineArea.querySelectorAll('.minesweeper__cell');

cell.forEach(item => {
  item.addEventListener('click', (evt) => {
    evt.target.classList.add('open');
  })
})



