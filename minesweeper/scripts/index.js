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

//Вставка элементов в контейнер.
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

//Создание ячеек из массива.
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

//Делегирование событий. Поле -> кнопки.
mineArea.addEventListener('click', (evt) => {
  //Если клик не по ячейке, а по другому месту поля -> не делать ничего.
  if(!evt.target.classList.contains('minesweeper__cell')){
    return;
  }

  evt.target.classList.add('minesweeper__cell_type_open');

  //Проверка на наличие мины в ячейке. Тут добавлять счетчик.
  if(!evt.target.style.backgroundImage){
    evt.target.textContent = bombCount(evt.target);
  }

})

//Функция возвращает количество мин вокруг ячейки.
function bombCount(cell){
  let count = 0;
  //Находим индекс ячейки на которую был клик. Находим ряд и колонку.
  const index = Array.from(mineArea.childNodes).indexOf(cell);
  const column = index % 10;
  const row = Math.floor(index / 10);

  //Проходим по всем соседним ячейками.
  for(let i = -1; i <= 1; i++){
    for(let j = -1; j <= 1; j++){
      const neigborColumn = column + i;
      const neigborRow = row + j;

      //Исключаем из проверки ячейки за пределами поля.
      if(neigborColumn < 0 || neigborColumn > 9 || neigborRow < 0 || neigborRow > 9) continue;

      //Находим  индекс соседней ячейки.
      const neigborIndex = neigborRow * 10 + neigborColumn;
      //Находим эту ячейку по индексу в коллекции.
      const neigborCell = mineArea.childNodes[neigborIndex];
      //Проверяем на наличие мины.
      if(isBomb(neigborCell)) count++;
    }
  }
  return count;
}

//Проверка есть ли в ячейке мина.
function isBomb(cell){
  if(cell.style.backgroundImage){
    return true;
  }
}




