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

const randomWord = () => {
  return wordBank[Math.floor(Math.random() * wordBank.length)];
}