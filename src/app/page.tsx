// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

type WordSet = {
  words: string[];
  connection: string;
};

type GameBoard = WordSet[];

const gameBoards: GameBoard[] = [
  [
    { words: ['Mela', 'Pera', 'Banana', 'Arancia'], connection: 'Frutta' },
    { words: ['Cane', 'Gatto', 'Topo', 'Cavallo'], connection: 'Animali' },
    { words: ['Rosso', 'Blu', 'Verde', 'Giallo'], connection: 'Colori' },
    { words: ['Pizza', 'Pasta', 'Risotto', 'Lasagna'], connection: 'Piatti italiani' }
  ],
  [
    { words: ['Roma', 'Parigi', 'Londra', 'Berlino'], connection: 'Capitali europee' },
    { words: ['Violino', 'Pianoforte', 'Flauto', 'Chitarra'], connection: 'Strumenti musicali' },
    { words: ['Calcio', 'Tennis', 'Nuoto', 'Pallacanestro'], connection: 'Sport' },
    { words: ['Primavera', 'Estate', 'Autunno', 'Inverno'], connection: 'Stagioni' }
  ],
  [
    { words: ['Dante', 'Petrarca', 'Boccaccio', 'Ariosto'], connection: 'Poeti italiani' },
    { words: ['Leonardo', 'Michelangelo', 'Raffaello', 'Donatello'], connection: 'Artisti del Rinascimento' },
    { words: ['Vesuvio', 'Etna', 'Stromboli', 'Vulcano'], connection: 'Vulcani italiani' },
    { words: ['Venezia', 'Firenze', 'Napoli', 'Milano'], connection: 'Città italiane' }
  ],
  [
    { words: ['Cappuccino', 'Espresso', 'Macchiato', 'Latte'], connection: 'Tipi di caffè' },
    { words: ['Colosseo', 'Torre di Pisa', 'Duomo di Milano', 'Ponte di Rialto'], connection: 'Monumenti italiani' },
    { words: ['Ferrari', 'Lamborghini', 'Maserati', 'Alfa Romeo'], connection: 'Marche di auto italiane' },
    { words: ['Parmigiano', 'Mozzarella', 'Gorgonzola', 'Pecorino'], connection: 'Formaggi italiani' }
  ],
  [
    { words: ['Verdi', 'Puccini', 'Rossini', 'Bellini'], connection: 'Compositori d\'opera' },
    { words: ['Margherita', 'Marinara', 'Quattro Formaggi', 'Capricciosa'], connection: 'Tipi di pizza' },
    { words: ['Chianti', 'Barolo', 'Prosecco', 'Amarone'], connection: 'Vini italiani' },
    { words: ['Pinocchio', 'Geppetto', 'Fata Turchina', 'Lucignolo'], connection: 'Personaggi di Pinocchio' }
  ]
];

export default function Home() {
  const [currentBoardIndex, setCurrentBoardIndex] = useState<number>(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [foundSets, setFoundSets] = useState<WordSet[]>([]);
  const [lives, setLives] = useState<number>(4);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newBoardIndex = Math.floor(Math.random() * gameBoards.length);
    setCurrentBoardIndex(newBoardIndex);
    setShuffledWords(gameBoards[newBoardIndex].flatMap(set => set.words).sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setFoundSets([]);
    setLives(4);
    setGameOver(false);
  };

  const handleWordClick = (word: string) => {
    if (gameOver) return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else if (selectedWords.length < 4) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleSubmit = () => {
    if (selectedWords.length !== 4 || gameOver) return;

    const correctSet = gameBoards[currentBoardIndex].find(set => 
      set.words.every(word => selectedWords.includes(word))
    );

    if (correctSet) {
      setFoundSets([...foundSets, correctSet]);
      setSelectedWords([]);
      setShuffledWords(shuffledWords.filter(word => !correctSet.words.includes(word)));
      if (foundSets.length === 3) {
        setGameOver(true);
      }
    } else {
      setLives(lives - 1);
      setSelectedWords([]);
      if (lives === 1) {
        setGameOver(true);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Italian Connections</h1>
      <div className="mb-4 text-xl font-semibold text-gray-700">Lives: {lives}</div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {shuffledWords.map((word, index) => (
          <button
            key={index}
            className={`p-4 border rounded text-lg font-semibold ${
              selectedWords.includes(word) 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => handleWordClick(word)}
            disabled={gameOver}
          >
            {word}
          </button>
        ))}
      </div>
      <button 
        onClick={handleSubmit}
        className="mb-8 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-lg font-semibold"
        disabled={gameOver}
      >
        Submit
      </button>
      <button 
        onClick={startNewGame}
        className="mb-8 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg font-semibold"
      >
        New Game
      </button>
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl mb-4 font-bold text-gray-800">Found Sets:</h2>
        {foundSets.map((set, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded shadow">
            <p className="font-semibold text-gray-800">{set.connection}:</p>
            <p className="text-gray-700">{set.words.join(', ')}</p>
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="mt-8 p-4 bg-white rounded shadow">
          <h2 className="text-2xl mb-4 font-bold text-gray-800">
            {lives > 0 ? 'Congratulations! You won!' : 'Game Over'}
          </h2>
          {lives === 0 && (
            <div>
              <p className="text-xl mb-2 font-semibold text-gray-800">Correct Answers:</p>
              {gameBoards[currentBoardIndex].map((set, index) => (
                <div key={index} className="mb-2">
                  <p className="font-semibold text-gray-800">{set.connection}:</p>
                  <p className="text-gray-700">{set.words.join(', ')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}