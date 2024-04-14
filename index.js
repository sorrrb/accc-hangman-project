import prompt from "readline-sync";
import wordBank from './word-bank.js';

// Array representing gallows containing ASCII symbols
const CONSOLE_SYMBOLS = [
  '______\n|/ |\n| \n| \n| \n| \n|_____\n',
  '______\n|/ |\n| (_)\n| \n| \n| \n|_____\n',
  '______\n|/ |\n| (_)\n|  |\n|  |\n| \n|_____\n',
  '______\n|/ |\n| (_)\n| \\|\n|  |\n| \n|_____\n',
  '______\n|/ |\n| (_)\n| \\|/\n|  |\n| \n|_____\n',
  '______\n|/ |\n| (_)\n| \\|/\n|  |\n| /\n|_____\n',
  '______\n|/ |\n| (_)\n| \\|/\n|  |\n| / \\\n|_____\n'
];

// Helper function to return a pseudo-random integer
const randInt = num => Math.floor(Math.random() * num);


// Module (IIFE) designed to handle core functionality of game and ruleset
const logicController = (() => {
  let activeWord = wordBank[randInt(wordBank.length)].toUpperCase();
  const INCORRECT_GUESS_LIMIT = 6;
  let incorrectGuesses = 0;
  let guessedLetters = [];
  let gameState = 0;

  // Getter for the current word
  const getActiveWord = () => activeWord;

  // Getter for the word outline [ie: _ _ _ _ ]
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

  const checkGuess = letter => {
    if (!guessedLetters.includes(letter.toUpperCase())) guessedLetters.push(letter.toUpperCase());
    if (activeWord.includes(letter.toUpperCase())) return true;
    else return false;
  }

  const checkRepeatGuess = letter => guessedLetters.includes(letter.toUpperCase());

  const checkWin = () => {
    let wordProgress = getWordOutline().split(' ').join('');
    return wordProgress === activeWord;
  }

  const checkLoss = () => !(INCORRECT_GUESS_LIMIT - incorrectGuesses);

  const checkEnd = () => checkWin() || checkLoss();

  const getLettersGuessed = () => guessedLetters.sort().join(',');

  const setNewWord = () => activeWord = wordBank[randInt(wordBank.length)].toUpperCase();

  const getGameState = () => CONSOLE_SYMBOLS[gameState];

  const updateGameState = () => {
    gameState++;
    incorrectGuesses++;
  }

  const resetGame = () => {
    setNewWord();
    incorrectGuesses = 0;
    guessedLetters = [];
    gameState = 0;
  }

  return {
    getActiveWord,
    getWordOutline,
    checkGuess,
    checkRepeatGuess,
    checkWin,
    checkLoss,
    checkEnd,
    getLettersGuessed,
    getGameState,
    updateGameState,
    resetGame
  }
})();


// Module (IIFE) to handle game control flow and console display to the user
const play = (() => {
  let isGameOver = false;
  let roundCount = 1;
  let wins = 0;
  let losses = 0;

  console.log('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::\n::::::::::::::::::::Welcome to Hangman!:::::::::::::::::::::\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::\n\nPress CTRL+C to stop.\n');
  while (!isGameOver) {
    console.log(`- - - - - - - - - - ROUND ${roundCount++} - - - - - - - - - -\n`);
    console.log(logicController.getGameState());
    console.log(`${logicController.getWordOutline()}\n`);
    console.log(`Guesses: \n<${(!(logicController.getLettersGuessed().length) ? ' N/A ' : logicController.getLettersGuessed())}>\n`);
    let guess = prompt.question('Guess a letter.\n>',
      {
        limit: function (input) {
          return /^[A-Z]+$/i.test(input) && input.length === 1;
        },
        limitMessage: 'Please enter a letter of the English alphabet.'
      });
    let isRepeatLetter = logicController.checkRepeatGuess(guess);
    let isCorrectGuess = logicController.checkGuess(guess);
    if (isRepeatLetter) {
      console.log('\nYou already guessed that letter! Guess again!\n');
    } else if (isCorrectGuess) {
      console.log('\nCORRECT - Good guess!\n');
    } else {
      logicController.updateGameState();
      console.log('\nUnfortunately, that is INCORRECT.\n');
    }

    isGameOver = logicController.checkEnd();
    if (isGameOver) {
      console.log('::::::::::::::::::::::::::::::\n::::::::::Game Over!::::::::::\n::::::::::::::::::::::::::::::\n');
      console.log(logicController.getGameState());
      console.log(logicController.getWordOutline());
      if (logicController.checkWin()) {
        console.log('\nCongratulations! You win!\n');
        wins++;
      } else if (logicController.checkLoss()) {
        console.log(`\nThe word was '${logicController.getActiveWord()}'`);
        console.log('Better luck next time!\n');
        losses++;
      }
      let playNewRound = prompt.question('Would you like to play again?\n',
        {
          trueValue: ['Yes', 'yes', 'y', 'Y'],
          falseValue: ['No', 'no', 'n', 'N']
        },
        {
          limitMessage: 'Please input yes or no.'
        }
      );
      if (playNewRound) {
        isGameOver = false;
        logicController.resetGame();
        roundCount = 1;
        console.log(`\nCurrent score [${wins} - ${losses}]\n`);
      }
    }
  }
  console.log(`\n---------------\nWINS: ${wins}\nLOSSES: ${losses}\nWIN PERCENTAGE: ${((wins / (wins + losses)) * 100).toPrecision(3)}%\n---------------\n`);
})();