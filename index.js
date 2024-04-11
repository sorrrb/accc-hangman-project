import prompt from "readline-sync";
import wordBank from './word-bank.js';

const CONSOLE_SYMBOLS = [
  '______\n|/ |\n| \n| \n| \n| \n|_____\n',
  '______\n|/ |\n| (_)\n| \n| \n| \n|_____\n',
  '______\n|/ |\n| (_)\n|  |\n|  |\n| \n|_____\n',
  '______\n|/ |\n| (_)\n| \\|\n|  |\n| \n|_____\n',
  '______\n|/ |\n| (_)\n| \\|/\n|  |\n| \n|_____\n',
  '______\n|/ |\n| (_)\n| \\|/\n|  |\n| /\n|_____\n',
  '______\n|/ |\n| (_)\n| \\|/\n|  |\n| / \\\n|_____\n'
];

const randInt = num => Math.floor(Math.random() * num);



const logicController = (() => {
  let activeWord = wordBank[randInt(wordBank.length)];
  const MAX_INCORRECT_GUESSES = 5;
  let incorrectGuesses = 0;
  let guessedLetters = [];

  const getWordOutline = () => {
    let outline = '';
    for (let i = 0; i < activeWord.length; i++) outline += '_';
    let outlineDisplay = outline.split('');

    guessedLetters.forEach((letter) => {
      if (activeWord.includes(letter)) {
        for (let i = 0; i < activeWord.length; i++) {
          if (activeWord.charAt(i) === letter) outlineDisplay[i] = letter;
        }
      }
    });

    return outlineDisplay.join(' ');
  }

  const checkEnd = () => {
    let wordProgress = getWordOutline().split(' ').join('');
    let isGameWon = wordProgress === activeWord;
    let isGameLost = !(MAX_INCORRECT_GUESSES - incorrectGuesses);
    return isGameWon || isGameLost;
  }

  const setNewWord = () => activeWord = wordBank[randInt(wordBank.length)];

  return {
    getWordOutline,
    checkEnd,
    setNewWord
  }
})();