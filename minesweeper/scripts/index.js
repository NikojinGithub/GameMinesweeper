import { cells, mid } from "./data.js";

const page = document.querySelector('body');
const header = document.createElement('header');
const main = document.createElement('section');
const footer = document.createElement('footer');
const minesweeperBlock = document.createElement('div');
const instrumentsArea = document.createElement('div');
const mineArea =  document.createElement('div');
const clickBlock = document.createElement('div');
const resetButton = document.createElement('button');
const timerBlock = document.createElement('div');
const themeBlock = document.createElement('div');
const titleHeader = document.createElement('h1');
const difficultBlock = document.createElement('div');



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

//Создание счетчика кликов
const clickCount = document.createElement('div');
clickCount.textContent = '000';

//
//Создание таймер
const playDuration = document.createElement('div');
playDuration.textContent = '000';
//

//Создание кнопок сложности и переключения темы.
const buttonEase = document.createElement('button');
const buttonMedium = document.createElement('button');
const buttonHard = document.createElement('button');
const buttonTheme = document.createElement('button');
//


const blocksPage = [header, main, footer];
const blocksMain = [minesweeperBlock];
const insideBlocks= [instrumentsArea, mineArea];
const instruments = [clickBlock, resetButton, timerBlock];
const popups = [popupLose, popupWin];
const popupBlocksLose = [titlePopupLose, buttonPopupLose];
const popupBlocksWin = [titlePopupWin, buttonPopupWin];
const clock = [playDuration];
const clicks = [clickCount];
const headerElements = [themeBlock, titleHeader, difficultBlock];
const difficultButtons = [buttonEase, buttonMedium, buttonHard];
const themeButton = [buttonTheme];

page.classList.add('page');
header.classList.add('header');
main.classList.add('main');
footer.classList.add('footer');
minesweeperBlock.classList.add('minesweeper');
instrumentsArea.classList.add('minesweeper__instruments');
mineArea.classList.add('minesweeper__area');
clickBlock.classList.add('minesweeper__count');
resetButton.classList.add('minesweeper__button');
timerBlock.classList.add('minesweeper__timer');
resetButton.classList.add('minesweeper__button_type_play');
titleHeader.classList.add('header__title');
titleHeader.textContent = 'Minesweeper';
difficultBlock.classList.add('header__buttons');
difficultButtons.forEach(button => button.classList.add('header__button'));
themeBlock.classList.add('header__theme');
buttonTheme.classList.add('header__button', 'header__button_type_theme');

const easyLevel = 10;
const midLevel = 20;


function startGame(level, area){

  let seconds = 0;
  let clicksCount = 0;

  //Функция отвечает за работу таймера. Увеличивает значение счетчика на 1.
  function updateTimer(){
    seconds++;
    if(seconds < 10){
      playDuration.textContent = `00${seconds}`;
    } if(seconds < 100 && seconds >= 10){
      playDuration.textContent = `0${seconds}`;
    } if(seconds >= 100){
      playDuration.textContent = seconds;
    }
  }

  //Функция отвечает за работу счетчика кликов. Если клик произведен не по ячейке с флагом,
  //то увеличивает число кликов на 1 и записывает в счетчик.
  function updateClick(cell){
    const openCells = document.querySelectorAll('.minesweeper__cell_type_open');
    if(!cell.classList.contains('minesweeper__cell_type_flag')){
      clicksCount++;

      if(clicksCount < 10){
        clickCount.textContent = `00${clicksCount}`;
      } if(clicksCount < 100 && clicksCount >= 10){
        clickCount.textContent = `0${clicksCount}`;
      } if(clicksCount >= 100){
        clickCount.textContent = clicksCount;
      }

    }
  }



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
  addBlocks(timerBlock, clock);
  addBlocks(clickBlock, clicks)
  addBlocks(header, headerElements);
  addBlocks(difficultBlock, difficultButtons);
  addBlocks(themeBlock, themeButton);



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
        //Туту будет функция обработки клика по открытой ячейке.
        checkAroundCell(evt.target);
      }
        updateClick(evt.target);
      
    })
  }


  //Функция вешает флаг.
  function addFlag(cell){
    //Проверка на количество мин. Что бы нельзя было поставить лишних флагов.
    const collection = document.querySelectorAll('.minesweeper__cell_type_flag');
    // if(collection.length <= 9) {
      if(!cell.classList.contains('minesweeper__cell_type_open')){
        cell.classList.toggle('minesweeper__cell_type_flag');
      }
    // }

    //Функция проверяет ячейки и если все открыто верно вызывает функцию winGame.
    checkField();
  }

  let playTimer;
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
    let openCells = document.querySelectorAll('.minesweeper__cell_type_open');
    if(openCells.length === 1){
    playTimer = setInterval(updateTimer, 1000);
    }

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
        // const index = Array.from(mineArea.childNodes).indexOf(cell);
        // const column = index % level;
        // const row = Math.floor(index / level);

        // //Проходим по всем соседним ячейками.
        // for(let i = -1; i <= 1; i++){
        //   for(let j = -1; j <= 1; j++){
        //     const neigborColumn = column + i;
        //     const neigborRow = row + j;

        //     if(neigborColumn < 0 || neigborColumn > level-1 || neigborRow < 0 || neigborRow > level-1) continue;
        //     if(neigborColumn === column && neigborRow === row) continue;

        //     const neigborIndex = neigborRow * level + neigborColumn;
        //     // console.log(neigborIndex);
        //     const neigborCell = mineArea.childNodes[neigborIndex];
        //     openCell(neigborCell);
                // console.log(findNeigborCell(cell, level));
        //   }
        // }
        findNeigborCell(cell, level).forEach(item => openCell(item));
      }
    }

    //Если нажали на кнопку с миной. Открываем все ячейки. Показываем мины. !!!!! Дописать код конца игры !!!!!
    if(cell.classList.contains('bomb')){
      loseGame(cell);
      clearInterval(playTimer);
    }
  }

    

  //Функция возвращает количество мин вокруг ячейки.
  function bombCount(cell){
    let count = 0;

    // //Находим индекс ячейки на которую был клик. Находим ряд и колонку.
    // const index = Array.from(mineArea.childNodes).indexOf(cell);
    // const column = index % level;
    // const row = Math.floor(index / level);

    // //Проходим по всем соседним ячейками.
    // for(let i = -1; i <= 1; i++){
    //   for(let j = -1; j <= 1; j++){
    //     const neigborColumn = column + i;
    //     const neigborRow = row + j;

    //     //Исключаем из проверки ячейки за пределами поля.
    //     if(neigborColumn < 0 || neigborColumn > level-1 || neigborRow < 0 || neigborRow > level-1) continue;

    //     //Находим  индекс соседней ячейки.
    //     const neigborIndex = neigborRow * level + neigborColumn;
    //     //Находим эту ячейку по индексу в коллекции.
    //     const neigborCell = mineArea.childNodes[neigborIndex];
    //     //Проверяем на наличие мины.
    //     if(isBomb(neigborCell)) count++;
    //   }
    // }

    findNeigborCell(cell, level).forEach(elem => {
      if(isBomb(elem)) count++;
    })

    return count;

  }

  //Проверка есть ли в ячейке мина.
  function isBomb(cell){
    if(cell.classList.contains('bomb')){
      return true;
    }
  }

  function checkAroundCell(cell){
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
        // console.log(neigborCell);

        //Если в соседней ячейке есть флаг, но ячейка с флагом не является миной. Мы проиграли.
       if(neigborCell.classList.contains('minesweeper__cell_type_flag') && !neigborCell.classList.contains('bomb')){
        loseGame();
       }

       if(neigborCell.classList.contains('minesweeper__cell_type_flag') && neigborCell.classList.contains('bomb')){
          const index = Array.from(mineArea.childNodes).indexOf(cell);
          const column = index % level;
          const row = Math.floor(index / level);

          let countBombsAndFlags = 0;
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
             if(neigborCell.classList.contains('bomb') && neigborCell.classList.contains('minesweeper__cell_type_flag')){
              countBombsAndFlags++;
             }
              }
            }

          if(countBombsAndFlags === parseInt(cell.textContent)){
            findNeigborCell(cell, level).forEach(item => openCell(item));

          }

        }
      }
    }
  }

  function winGame(){
    resetButton.classList.remove('minesweeper__button_type_play');
    resetButton.classList.add('minesweeper__button_type_win');
    popupWin.classList.add('popup_active');
    mineArea.childNodes.forEach(cell => {
      cell.classList.add('minesweeper__cell_type_disabled');
      // тут исправили для верного отображения мин когда прогрыш было ||
      if(!cell.classList.contains('minesweeper__cell_type_open') && cell.classList.contains('minesweeper__cell_type_flag')){
        cell.classList.add('minesweeper__cell_type_flag');
      }
    })
    clearInterval(playTimer);
  }

  function loseGame(){
    popupLose.classList.add('popup_active');
    Array.from(mineArea.childNodes).forEach(cell => {
      if(cell.classList.contains('bomb')){
        cell.classList.add('minesweeper__cell_type_mine');
        cell.style.backgroundColor = 'red';
      }
      openCell(cell);
      // cell.classList.add('minesweeper__cell_type_open');
      resetButton.classList.remove('minesweeper__button_type_play');
      resetButton.classList.add('minesweeper__button_type_lose');
    });
  }

  function checkField(){
    //Проверям сколько ячеек открыто.
    let countOpenCells = document.querySelectorAll('.minesweeper__cell_type_open').length;
    let countBombCells = document.querySelectorAll('.minesweeper__cell_type_flag').length;
    //Если открыты все ячейки -количество бомб. Вызваем функцию победа.
    if(countOpenCells === 90 && countBombCells === 10){
      winGame();
    }
  }

  //Остановка таймера при перезагрузке игры.
  resetButton.addEventListener('click', () => {
    clearInterval(playTimer);
  })

  function findNeigborCell(cell, level){
    //Находим индекс ячейки на которую был клик. Находим ряд и колонку.
    const index = Array.from(mineArea.childNodes).indexOf(cell);
    const column = index % level;
    const row = Math.floor(index / level);

    const array = [];
    //Проходим по всем соседним ячейками.
    for(let i = -1; i <= 1; i++){
      for(let j = -1; j <= 1; j++){
        const neigborColumn = column + i;
        const neigborRow = row + j;

        //Исключаем из проверки ячейки за пределами поля.
        if(neigborColumn < 0 || neigborColumn > level-1 || neigborRow < 0 || neigborRow > level-1) continue;
        if(neigborColumn === column && neigborRow === row) continue;

        //Находим  индекс соседней ячейки.
        const neigborIndex = neigborRow * level + neigborColumn;
        //Находим эту ячейку по индексу в коллекции.
        const neigborCell = mineArea.childNodes[neigborIndex];

        array.push(neigborCell);
      }
    }
    return array;
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
  playDuration.textContent = '000';
  clickCount.textContent = '000';

  startGame(easyLevel, cells);

  // startGame(midLevel, mid);
}

startGame(easyLevel, cells);


//Добавил цвет на цифры - работает. коммит
//Доделать функцию перезапуска - работает. коммит
//Дописать код победы\ поражения. выводить надпись. - работает. коммит
//Добавлен таймер + коммит
//Добавлен счетчик кликов +
//Добавлены кнопки в header +


// Реализована логика клика открытой ячейки +;

//Следующие шаги:
//-Подсчет кликов +
//-реализация записи результатов
//-уровни сложности
//-Темная\светлая тема - повесить слушатель. Класс готов кнопка готова.
//-звук
//-Безопасный первый клик



//***************************ДОРАБОТАТЬ*********************
//Счетчик кликов сейчас реагирует на все клики кроме флага. ВОзможно правильно будет не реагировать на
//пустые ячейки тоже.

//логика клика открытой ячейки - доработать код, сейчас не везде использована функция поиска ячеек соседей. 
//findNeigborCell необходимо заменить ей все повторяющие поиски соседей.

//Доработать логику победы в игре. Не открываются оставшиеся клетки. - не реализовано.

//Доработать логику. Победа засчитывается только если отмеить все мины. Проверка 303 строка.
//Если это убрать все работаеть верно, тоесть победа засчитывается и когда открыты все ячейки кроме мин.
//Но в этом случае Не верно работает логика поражения.
//***************************************************/


//Для сложности игры.
//Проблема с увеличением размера поля заключается в строке
//if(neigborColumn < 0 || neigborColumn > level-1 || neigborRow < 0 || neigborRow > level-1) continue;
//Нужно изменять значения level типо level-11.  Возможно вынести эту часть в отдельную функцию и вызывать
//с определенным параметром в зависимости от стиля размера поля.




//Уровни сложности.
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