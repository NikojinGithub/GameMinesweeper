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
const clickAudio = document.createElement('audio');
const winAudio = document.createElement('audio');
const loseAudio = document.createElement('audio');
const flagAudio = document.createElement('audio');
clickAudio.src = '../audio/click.mp3';
winAudio.src = '../audio/win.mp3';
loseAudio.src = '../audio/lose.wav'
flagAudio.src = '../audio/flag.mp3'


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
const buttonSound = document.createElement('button');
buttonSound.textContent = 'Sound ON';
buttonTheme.textContent = 'Dark';
buttonEase.textContent = 'Easy';
buttonMedium.textContent = 'Medium';
buttonHard.textContent = 'Hard';
//

//Создание блока с результатами
const resultsBlock = document.createElement('div');
const resultList = document.createElement('ol');
//

const blocksPage = [header, main, footer];
const blocksMain = [minesweeperBlock, resultsBlock];
const insideBlocks= [instrumentsArea, mineArea];
const instruments = [clickBlock, resetButton, timerBlock];
const popups = [popupLose, popupWin];
const popupBlocksLose = [titlePopupLose, buttonPopupLose];
const popupBlocksWin = [titlePopupWin, buttonPopupWin];
const headerElements = [themeBlock, titleHeader, difficultBlock];
const difficultButtons = [buttonEase, buttonMedium, buttonHard];
const themeButton = [buttonSound, buttonTheme];

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
buttonSound.classList.add('header__button', 'header__button_type_sound');
resultsBlock.classList.add('result');
resultList.classList.add('result__list');

buttonSound.addEventListener('click', offSound);
buttonTheme.addEventListener('click', shiftTheme);

const easyLevel = 10;
const midLevel = 40;


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

  //Вставка  элемента в контейнер.
  function addElement(container, element){
    container.append(element);
  }


  //Вставка массива элемнтов в контейнер.
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
  addBlocks(header, headerElements);
  addBlocks(difficultBlock, difficultButtons);
  addBlocks(themeBlock, themeButton);
  addElement(timerBlock, playDuration);
  addElement(clickBlock, clickCount);
  addElement(resultsBlock, resultList);
  // addElement(resultList, createListElement());
  




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
    playSound(flagAudio);
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
    playSound(clickAudio);
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
    playSound(winAudio);
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
    playSound(loseAudio);
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

//Функция проигрывает звуковые эффекты, если на странице нет выключен звук.
function playSound(audio){
  if(!page.classList.contains('page_type_mute')){
    audio.play();
  }
}

function offSound(){
  page.classList.toggle('page_type_mute');

  if(page.classList.contains('page_type_mute')){
    buttonSound.textContent = 'Sound OFF'
  } else {
    buttonSound.textContent = 'Sound ON'
  }
}

function shiftTheme(){
  page.classList.toggle('page_type_dark');
  if(!page.classList.contains('page_type_dark')){
    buttonTheme.textContent = 'Dark';
  } else {
    buttonTheme.textContent = 'Light';
  }
}


//Функция создает элемент в таблице результатов, при нажатии на кнопка в попапе win.
//Функция создает всего 10 элементов, если будет больше элементов она удалит последний.
function createListElement(){
  const resultElement = document.createElement('li');
  resultElement.classList.add('result__element');
  resultElement.textContent = `Clicks: ${clickCount.textContent} Time: ${playDuration.textContent}sec`;
  const collectionResults = document.querySelectorAll('.result__element');
  if(collectionResults.length < 10){
    resultList.prepend(resultElement);
  } else {
    collectionResults[9].remove()
    resultList.prepend(resultElement);
  }
  return collectionResults;
}

//Обработчики для добавления результатов в таблицу. Результат добавится как если кликнуть на кнопку попапа.
//так и если кликнуть на смайлик рестарта после победы.
resetButton.addEventListener('click', () => {
  if(resetButton.classList.contains('minesweeper__button_type_win')){
        createListElement();
      }
  resetGame();
});

//Обработчик кнопки на попапе Win. Создает запись и перезапускает игру.
buttonPopupWin.addEventListener('click', () => {
  createListElement();
  resetGame();
});

//Перезапускает игру.
buttonPopupLose.addEventListener('click', resetGame);

//Обработчик события перезагрузки или закрытия страницы. Записывает в localStorage значения перед выходом.
window.addEventListener('beforeunload', recordLocalStorage);

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


//Функция записывает значения из таблицы очков в localStorage по ключами вида elem0, elem1 ...
function recordLocalStorage(){
  let count = 0;
  const collection = document.querySelectorAll('.result__element');
  console.log(collection)
  collection.forEach(item => {
    localStorage.setItem(`elem${count}`, item.textContent);
    count++;
  })
}


// console.log(localStorage);

//Функция создает элементы таблицы очков при загрузке страницы на основании данных из localStorage.
function getScore(){

  const keys = Object.keys(localStorage);
  keys.sort().reverse();
  console.log(keys);
  keys.forEach(element => {
    const elementValue = localStorage.getItem(element);
    const resultElement = document.createElement('li');
    resultElement.classList.add('result__element');
    resultElement.textContent = elementValue;
    resultList.prepend(resultElement);
  })

}

getScore();

//Добавил цвет на цифры - работает. коммит.
//Доделать функцию перезапуска - работает. коммит.
//Дописать код победы\ поражения. выводить надпись. - работает. коммит.
//Добавлен таймер + коммит.
//Добавлен счетчик кликов + коммит.
//Добавлены кнопки в header + коммит.
//Темная светлая тема. + коммит.
//Добавлены звуки + кнопка отключения звука.+ коммит.
// Реализована логика клика открытой ячейки + коммит.
//Реализована запись результатов + localStorage. +

//Следующие шаги:

//-реализация записи результатов

//-уровни сложности - прблема с отрисовкой мин, открытием пустых ячеек.


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

//Подумать над размерами. Плохо на 320px.

//-Темная\светлая тема + Доработать стили других элементов.
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