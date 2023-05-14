import { cells, mid } from "./data.js";

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


//Создание всплывающего окна.
const popupLose = document.createElement('div');
const popupWin = document.createElement('div');
popupLose.classList.add('popup');
popupWin.classList.add('popup');

const titlePopupLose = document.createElement('h2');
const titlePopupWin = document.createElement('h2');
titlePopupLose.textContent = 'Вы проиграли!';
titlePopupWin.textContent = 'Вы победили!';

titlePopupLose.classList.add('popup__title');
titlePopupWin.classList.add('popup__title');

const buttonPopupLose = document.createElement('button');
const buttonPopupWin = document.createElement('button');
buttonPopupLose.textContent = 'Начать сначала';
buttonPopupWin.textContent = 'Начать сначала';

buttonPopupLose.classList.add('popup__button');
buttonPopupWin.classList.add('popup__button');
//


const blocksPage = [header, main, footer];
const blocksMain = [minesweeperBlock];
const insideBlocks= [instrumentsArea, mineArea];
const instruments = [minesCount, resetButton, timer];
const popups = [popupLose, popupWin];
const popupBlocksLose = [titlePopupLose, buttonPopupLose];
const popupBlocksWin = [titlePopupWin, buttonPopupWin];

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
resetButton.classList.add('minesweeper__button_type_play');

const easyLevel = 10;
const midLevel = 20;

function startGame(level, area){

  //Вставка элементов в контейнер.
  function addBlocks(container, array){
    array.forEach(elem => container.append(elem));
  }

  addBlocks(page, blocksPage);
  addBlocks(main, blocksMain);
  addBlocks(minesweeperBlock, insideBlocks);
  addBlocks(main, popups);
  addBlocks(instrumentsArea, instruments);
  addBlocks(popupLose, popupBlocksLose);
  addBlocks(popupWin, popupBlocksWin);



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

        addListeners(element);
      // element.addEventListener('contextmenu', (evt) => {
      //   evt.preventDefault();
      //   addFlag(evt.target);

      // })
    })
  }

  createCells(mineArea, area);

  //Функция вешает обработчики событий на ячейки. Клик левой кнопкой и клик правой кнопкой.
  function addListeners(cell){
    cell.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
      addFlag(evt.target);
     })

     cell.addEventListener('click', (evt) => {
      if(!evt.target.classList.contains('minesweeper__cell_type_flag')){
        openCell(evt.target);
      }
    })
  }


  //Функция вешает флаг.
  function addFlag(cell){

    if(!cell.classList.contains('minesweeper__cell_type_open')){
      cell.classList.toggle('minesweeper__cell_type_flag');
    }

    //Функция проверяет ячейки и если все открыто верно вызывает функцию winGame.
    checkField();
  }

  //Функция открытия ячейки.
  function openCell(cell){
   //Если клик не по ячейке, а по другому месту поля -> не делать ничего.
    if(!cell.classList.contains('minesweeper__cell')){
      return;
    }

    if(cell.classList.contains('minesweeper__cell_type_flag')) return;

    //Остановка рекурсии для этой части код "if(count === 0){}". Если ячейка уже открыта, останавливаемся.
    if(cell.classList.contains('minesweeper__cell_type_open')) return;

    //Добавляем класс открывающий ячейку.
    cell.classList.add('minesweeper__cell_type_open');

    //Записываем в переменную счетчик.
    const count = bombCount(cell);

    //Если нет мины в ячейке.
    if(!cell.classList.contains('bomb')){

      //Функция проверяет ячейки и если все открыто верно вызывает функцию winGame.
      checkField();

      //Счетчик не равен 0 -> рядом мина -> записываем количество мин рядом в ячейку.
      //Добавляем цвета цифрам.
      if(count !== 0){
      cell.textContent = count;
        if(cell.textContent === '1'){
          cell.style.color = 'blue';
        } else if(cell.textContent === '2'){
          cell.style.color = 'green';
        } else if(cell.textContent === '3'){
          cell.style.color = 'red';
        } else if(cell.textContent === '4'){
          cell.style.color = 'brown';
        } else if(cell.textContent === '5'){
          cell.style.color = 'black';
        }
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
        const column = index % level;
        const row = Math.floor(index / level);

        //Проходим по всем соседним ячейками.
        for(let i = -1; i <= 1; i++){
          for(let j = -1; j <= 1; j++){
            const neigborColumn = column + i;
            const neigborRow = row + j;

            if(neigborColumn < 0 || neigborColumn > level-1 || neigborRow < 0 || neigborRow > level-1) continue;
            if(neigborColumn === column && neigborRow === row) continue;

            const neigborIndex = neigborRow * level + neigborColumn;
            // console.log(neigborIndex);
            const neigborCell = mineArea.childNodes[neigborIndex];
            openCell(neigborCell);
          }
        }
      }
    }

    //Если нажали на кнопку с миной. Открываем все ячейки. Показываем мины. !!!!! Дописать код конца игры !!!!!
    if(cell.classList.contains('bomb')){
      cell.style.backgroundColor = 'red';
      popupLose.classList.add('popup_active');
      Array.from(mineArea.childNodes).forEach(cell => {
        if(cell.classList.contains('bomb')){
          cell.classList.add('minesweeper__cell_type_mine');
        }
        openCell(cell);
        resetButton.classList.remove('minesweeper__button_type_play');
        resetButton.classList.add('minesweeper__button_type_lose');
      });
    }
  }

  //Функция возвращает количество мин вокруг ячейки.
  function bombCount(cell){
    let count = 0;

    //Находим индекс ячейки на которую был клик. Находим ряд и колонку.
    const index = Array.from(mineArea.childNodes).indexOf(cell);
    const column = index % level;
    const row = Math.floor(index / level);

    //Проходим по всем соседним ячейками.
    for(let i = -1; i <= 1; i++){
      for(let j = -1; j <= 1; j++){
        const neigborColumn = column + i;
        const neigborRow = row + j;

        //Исключаем из проверки ячейки за пределами поля.
        if(neigborColumn < 0 || neigborColumn > level-1 || neigborRow < 0 || neigborRow > level-1) continue;

        //Находим  индекс соседней ячейки.
        const neigborIndex = neigborRow * level + neigborColumn;
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

  function winGame(){
    resetButton.classList.remove('minesweeper__button_type_play');
    resetButton.classList.add('minesweeper__button_type_win');
    popupWin.classList.add('popup_active');
    mineArea.childNodes.forEach(cell => {
      cell.classList.add('minesweeper__cell_type_disabled');
      if(!cell.classList.contains('minesweeper__cell_type_open') || cell.classList.contains('minesweeper__cell_type_flag')){
        cell.classList.add('minesweeper__cell_type_flag');
      }
    })
  }

  function checkField(){
    //Проверям сколько ячеек открыто.
    let countOpenCells = document.querySelectorAll('.minesweeper__cell_type_open').length;
    let countBombCells = document.querySelectorAll('.minesweeper__cell_type_flag').length;
    //Если открыты все ячейки -количество бомб. Вызваем функцию победа.
    if(countBombCells === 10 && countOpenCells === 90){
      winGame();
    }
  }

}

resetButton.addEventListener('click', resetGame);
buttonPopupLose.addEventListener('click', resetGame);
buttonPopupWin.addEventListener('click', resetGame);

function resetGame(){
  page.innerHTML = '';
  mineArea.innerHTML = '';
  resetButton.classList.remove('minesweeper__button_type_win');
  resetButton.classList.remove('minesweeper__button_type_lose');
  resetButton.classList.add('minesweeper__button_type_play');
  popupLose.classList.remove('popup_active');
  popupWin.classList.remove('popup_active');

  startGame(easyLevel, cells);

  // startGame(midLevel, mid);
}

startGame(easyLevel, cells);


//Добавил цвет на цифры - работает.
//Доделать функцию перезапуска - работает.
//Дописать код победы\ поражения. выводить надпись. - работает.

//Доработать логику победы в игре. Не открываются оставшиеся клетки. - не реализовано.

//Для сложности игры.
//Проблема с увеличением размера поля заключается в строке
//if(neigborColumn < 0 || neigborColumn > level-1 || neigborRow < 0 || neigborRow > level-1) continue;
//Нужно изменять значения level типо level-11.  Возможно вынести эту часть в отдельную функцию и вызывать
//с определенным параметром в зависимости от стиля размера поля.





//Обернуть весь код в функцию. Вызвать ее. Для перезапуска кода. очистить страницу. и Запустить функцию старт.

// resetButton.addEventListener('click', () => {
//   page.innerHTML = '';
//   mineArea.innerHTML = '';
//   start();
// });


// start(); 










//Старые функции удалить.

//Клик правой кнопкой.
  // mineArea.addEventListener('contextmenu', (evt) => {
  //  evt.preventDefault();
  //  addFlag(evt.target);
  // })

  //Клик левой кнопкой. Делегирование событий. Поле -> кнопки.
  // mineArea.addEventListener('click', (evt) => {
  //   if(!evt.target.classList.contains('minesweeper__cell_type_flag')){
  //     openCell(evt.target);
  //   }
  // })

   // function removeFlag(cell){
  //   if(cell.classList.contains('minesweeper__cell_type_flag')){
  //     cell.classList.remove('minesweeper__cell_type_flag')
  //   }
  // }