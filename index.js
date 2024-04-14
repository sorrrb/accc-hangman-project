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
  let activeWord = wordBank[randInt(wordBank.length)].toUpperCase();
  const INCORRECT_GUESS_LIMIT = 6;
  let incorrectGuesses = 0;
  let guessedLetters = [];
  let gameState = 0;

  const getActiveWord = () => activeWord;

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
    if (!guessedLetters.includes(letter)) guessedLetters.push(letter.toUpperCase());
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
    setNewWord,
    getGameState,
    updateGameState,
    resetGame
  }
})();



const play = (() => {
  let isGameOver = false;
  let roundCount = 1;
  let outcome;
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
        outcome = true;
      } else if (logicController.checkLoss()) {
        console.log(`\nThe word was '${logicController.getActiveWord()}'`);
        console.log('Better luck next time!\n');
        outcome = false;
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
        if (outcome) wins++;
        if (!outcome) losses++;
        isGameOver = false;
        logicController.resetGame();
        roundCount = 1;
        console.log(`\nCurrent score [${wins} - ${losses}]\n`);
      }
    }
  }
})();