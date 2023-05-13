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
    // element.style.backgroundImage = `url(${item.link})`
    if(typeof(item) === 'object'){
      element.classList.add('bomb');
    }
    container.append(element);
  })
}

createCells(mineArea, cells);
//Клик правой кнопкой.
mineArea.addEventListener('contextmenu', (evt) => {
  evt.preventDefault();
  addFlag(evt.target);
})



//Клик левой кнопкой. Делегирование событий. Поле -> кнопки.
mineArea.addEventListener('click', (evt) => {
  if(!evt.target.classList.contains('minesweeper__cell_type_flag')){
    openCell(evt.target);
  }
})

//Функция вешает флаг.
function addFlag(cell){
  if(!cell.classList.contains('minesweeper__cell_type_open')){
    cell.classList.toggle('minesweeper__cell_type_flag');
  }
}

//Функция открытия ячейки.
function openCell(cell){
  //Если клик не по ячейке, а по другому месту поля -> не делать ничего.
  if(!cell.classList.contains('minesweeper__cell')){
    return;
  }

  //Остановка рекурсии для этой части код "if(count === 0){}". Если ячейка уже открыта, останавливаемся.
  if(cell.classList.contains('minesweeper__cell_type_open')) return;

  //Добавляем класс открывающий ячейку.
  cell.classList.add('minesweeper__cell_type_open');

  //Записываем в переменную счетчик.
  const count = bombCount(cell);

  //Если нет мины в ячейке.
  if(!cell.classList.contains('bomb')){

    //Счетчик не равен 0 -> рядом мина -> записываем количество мин рядом в ячейку.
    if(count !== 0){
    cell.textContent = count;
    }

    // Если счетчик равен 0 -> мин нет:
    // 1)Открываем ячейку без записи цифры.
    // 2)Находим соседей и проверяем есть ли в соседних с ячейках мины: (рекурсия)
    //    -Если нет открываем и проверям соседние ячейки тем же образом.
    //    -Если есть мина -> записываем в ячейку число мин в соседних. (рекурсия останавливается)
    if(count === 0){
      cell.textContent = ' ';

      //Находим индекс ячейки на которую был клик. Находим ряд и колонку.
      const index = Array.from(mineArea.childNodes).indexOf(cell);
      const column = index % 10;
      const row = Math.floor(index / 10);

      //Проходим по всем соседним ячейками.
      for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
          const neigborColumn = column + i;
          const neigborRow = row + j;

          if(neigborColumn < 0 || neigborColumn > 9 || neigborRow < 0 || neigborRow > 9) continue;
          if(neigborColumn === column && neigborRow === row) continue;

          const neigborIndex = neigborRow * 10 + neigborColumn;
          console.log(neigborIndex);
          const neigborCell = mineArea.childNodes[neigborIndex];
          openCell(neigborCell);
        }
      }
    }
  }

  //Если нажали на кнопку с миной. Открываем все ячейки. Отмечаем красным ячейки с минами.
  if(cell.classList.contains('bomb')){
    cell.style.backgroundColor = 'red';
    Array.from(mineArea.childNodes).forEach(cell => {
      if(cell.classList.contains('bomb')){
      cell.classList.add('minesweeper__cell_type_mine');
      }
      openCell(cell);
    });
  }
}

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
  if(cell.classList.contains('bomb')){
    return true;
  }
}

//Добавлен Флаг.

