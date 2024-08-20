import styles from '../styles/wordle.module.css';
import { useEffect, useState } from 'react';

const urlTwo = 'https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/6bfa15d263d6d5b63840a8e5b64e04b382fdb079/valid-wordle-words.txt'
const WORD_LENGTH = 5; 

export default function App() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null))
  const [currentGuess, setCurrentGuess] = useState(''); 
  const [isGameOver, setIsGameOver] = useState(false)
  const [wordList, setWordList] = useState([]); 
  const [showSolution, setShowSolution] = useState(false)

  useEffect(() => { 
    const handleType = (event ) => { 

      if (isGameOver) { 
        alert('You got it!');
        return; 
      } 
      if (event.key === 'Enter') { 
        if (currentGuess.length !== 5) {  
          return; 
        }

        if (!wordList.includes(currentGuess)) {
          alert('Invalid Word!');
          return; 
        }

        const newGuesses = [...guesses]; 
        newGuesses[guesses.findIndex(val => val == null)] = currentGuess; 
        setGuesses(newGuesses); 
        setCurrentGuess('');

        const isCorrect = solution === currentGuess; 
        if (isCorrect) {
          setIsGameOver(true); 

        } 
      }

      if (event.key === 'Backspace') { 
        setCurrentGuess(currentGuess.slice(0, -1));
        return; 
      }

      if (currentGuess.length >=5) { 
        return; 
      }

      const isLetter = event.key.match(/^[a-z]{1}$/) !=null; 
      if (isLetter) {
        setCurrentGuess(currentGuess + event.key);

      }

    };

    window.addEventListener('keydown', handleType); 

    return () => window.removeEventListener('keydown', handleType); 

  }, [currentGuess, isGameOver, solution, guesses])


  useEffect(() => {
    const fetchWord = async () => { 
      const response = await fetch(API_URL);
      const words = await response.json(); 
      const randomWord = words[Math.floor(Math.random() * words.length)];

    };

    const fetchWordTwo = async () => { 
      const responseTwo = await fetch(urlTwo);
      const wordsTwo = await responseTwo.text(); 
      const array = wordsTwo.toString().split("\n")
      const randomWordTwo = array[Math.floor(Math.random() * array.length)];
      setSolution(randomWordTwo.toLowerCase());
      setWordList(array.map(word => word.toLowerCase()));
    }   


    fetchWordTwo();

  }, []); // use Effect dependecy so the array only runs once

  return (

    <>
      <h1 className={styles.header}> WORDLE CLONE </h1>
        <div className={styles.Board}>
          {
            guesses.map((guess, i )  => { 
              const isCurrentGuess = i === guesses.findIndex(val => val == null); 
              return (
                <Line guess = {isCurrentGuess ? currentGuess : guess ?? ""} 
                isFinal = {!isCurrentGuess && guess !=null} 
                solution = {solution} 
                key = {i}/> 
              );
            })
          }
          <button className={styles.button} onClick={() => setShowSolution(true)}> See Solution </button>
          {showSolution && <div> {solution} </div> } 
        </div>
    </>

  ) 
} 

function Line({guess, isFinal, solution}) { 
  const tiles = []; 
  for (let i = 0; i < WORD_LENGTH; i++) { 
    const char = guess[i]; 
    let className = styles.Tile;

    if (isFinal) { 
      if (char === solution[i]) { 
        className += ` ${styles.correct}` ;
      } else if (solution.includes(char)) {
        className += ` ${styles.close}`;
      } else { 
        className += ` ${styles.incorrect}`; 
      }

    }

    tiles.push(<div key={i} className={className}> {char} </div>)
  }
  return <div className={styles.Line}>{tiles}</div> 
}

