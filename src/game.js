
const BASE_STR = "abcdefghijklmnopqrstuvwxyz";
const STR_LENGTH = 4;
const ANSWER_COUNT = 20;
const guesses = document.querySelector('.guesses');
const lastResult = document.querySelector('.lastResult');
const guessSubmit = document.getElementById('guessSubmit');
const guessField = document.getElementById('guessField');
const guessResult = document.getElementById('guessResult');
let resetButton = document.getElementById('resetButton');
let answer =  createAnswer();
let guessCount = 1;
let button;


// ランダムの英小文字を作成する関数
function createAnswer(){
  let answer = Array.from(Array(STR_LENGTH)).map(()=>BASE_STR[Math.floor(Math.random()*BASE_STR.length)]).join('');
  let setAnswer = new Set(answer);
  
  // 文字列に同じ文字を出さないための操作
  while(answer.length !== setAnswer.size){
    answer = Array.from(Array(STR_LENGTH)).map(()=>BASE_STR[Math.floor(Math.random()*BASE_STR.length)]).join(''); 
    setAnswer = new Set(answer);
  }
  return answer;
}

// 入力した文字列に数字が含まれているか調べる関数
function containNum(strInput){
  for(i=0;i<strInput.length;i++){
    if(!isNaN(strInput[i])){
      // 含まれていたら ture
      return true;
    }
  }
  // 含まれていなかったら false
  return false;
}

// 解答をチェックする関数
function checkGuess() {
  const userGuess = guessField.value.toLowerCase(); 
  console.log('answer '+answer);

  // userGuess が4文字の半角英文字列かチェック
  if(userGuess.length!==4 || containNum(userGuess) || userGuess.match(/^[^\x01-\x7E\xA1-\xDF]+$/)){
    window.alert('長さ4の半角英文字列を入力してください');
    return;
  }
  lastResult.style.display ="block";

  if (userGuess === answer){
    // 正解した時
    let clearText = '正解です! ';
    if(guessCount<6){
      clearText += '称号 : マスター';
    }else if(guessCount<11){
      clearText += '称号 : ゴールド';
    }else if(guessCount<16){
      clearText += '称号 : シルバー';
    }else{
      clearText += '称号 : ブロンズ';
    }
    
    lastResult.classList.add('alert-info');
    lastResult.textContent = clearText;
    setGameOver();
  } else if (guessCount === ANSWER_COUNT){
    // 解答権を無くしたとき
    lastResult.textContent = '!!! ゲームオーバー !!! 答えは '+answer+' でした';
    lastResult.classList.add('alert');
    lastResult.classList.add('alert-danger');
    setGameOver();
  } else {
    // 解答権がある中で間違えた時
    lastResult.textContent = '残り'+(ANSWER_COUNT-guessCount)+'回';
    lastResult.classList.add('alert');
    lastResult.classList.add('alert-secondary');
    checkEatBite(userGuess)
  }

  guessCount++;
  guessField.value = '';
  guessField.focus();
}

// eat と bite の数を調べる関数
function checkEatBite(userGuess){
  // eat : 文字が同じかつ, 文字の場所が同じ 
  // bite : 同じ文字が何種類含まれているか, ただし eat と bite は重複しない
  let eatCount = 0;
  let biteCount = 0;
  let setGuess = Array.from(new Set(userGuess)); 
  
  // eat を調べる
  for(i=0;i<STR_LENGTH;i++){
    if(userGuess[i] === answer[i]){
      eatCount++;
    }
  }
  // bite を調べる
  for(i=0;i<answer.length;i++){
    for(j=0;j<setGuess.length;j++){
      if(answer[i] === setGuess[j]){
        biteCount++;
      }
    }
  }
  // eat と bit は重複しない
  biteCount -= eatCount;
  let p = document.createElement('p');
  p.textContent =  userGuess +' '+ eatCount+' eat '+biteCount+' bite.';
  guessResult.prepend(p);
}

// ゲームオーバーにする関数
function setGameOver() {
  guessField.disabled = true;
  guessSubmit.disabled = true;
  button = document.createElement('button');
  button.textContent = 'ゲームをやり直す';
  button.classList.add('btn' ,'btn-primary');
  resetButton.prepend(button);
  resetButton.addEventListener('click', resetGame);
}

// リセットする関数
function resetGame() {
  guessCount = 1;
  const resetParas = document.querySelectorAll('.resultParas p');

  for (const resetPara of resetParas) {
    resetPara.textContent = '';
  }

  button.parentNode.removeChild(button);
  lastResult.style.display = "none";
  const alertList = ['alert-danger','alert-info','alert-secondary','alert-dark','alert-warning','alert-primary'];

  for (i=0;i<alertList.length;i++ ){
    lastResult.classList.remove(alertList[i]);
  }

  guessField.disabled = false;
  guessSubmit.disabled = false;
  guessField.value = '';
  guessField.focus();
  answer = createAnswer();
}

// 実行
guessSubmit.addEventListener('click',checkGuess);
