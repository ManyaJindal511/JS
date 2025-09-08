import React, { useEffect, useState } from "react";

// Alphabet A-Z
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Hangman() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState("");
  const [display, setDisplay] = useState("");
  const [usedLetters, setUsedLetters] = useState([]);
  const [lives, setLives] = useState(6);
  const [status, setStatus] = useState(""); // "win" | "lose" | ""

  // Fetch questions from API
  useEffect(() => {
    fetch(
      "http://codeapi.net.cws18.my-hosting-panel.com/hangman.php"
    )
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        let randomQ = data[Math.floor(Math.random() * data.length)];
        setCurrentQ(randomQ);
        setAnswer(randomQ.Answer.toUpperCase());
        setDisplay(
          randomQ.Answer.replace(/[A-Z]/gi, (c) =>
            c === " " ? " " : "_"
          )
        );
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle letter click
  const handleGuess = (letter) => {
    if (status) return; // stop if game finished
    setUsedLetters((prev) => [...prev, letter]);

    if (answer.includes(letter)) {
      // correct guess -> update display
      let newDisplay = display
        .split("")
        .map((ch, i) =>
          answer[i] === letter ? letter : ch
        )
        .join("");
      setDisplay(newDisplay);

      if (newDisplay === answer) {
        setStatus("win");
      }
    } else {
      // wrong guess -> reduce life
      let newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setStatus("lose");
      }
    }
  };

  const resetGame = () => {
    let randomQ = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQ(randomQ);
    setAnswer(randomQ.Answer.toUpperCase());
    setDisplay(randomQ.Answer.replace(/[A-Z]/gi, (c) => (c === " " ? " " : "_")));
    setUsedLetters([]);
    setLives(6);
    setStatus("");
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Hangman Game</h1>

      {currentQ ? (
        <>
          <p className="mb-4 text-lg font-medium">{currentQ.Question}</p>

          {/* Display Answer */}
          <div className="text-2xl font-mono tracking-widest mb-6">
            {display}
          </div>

          {/* Alphabet Buttons */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {ALPHABETS.map((letter) => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={usedLetters.includes(letter) || status}
                className={`px-3 py-2 rounded-lg text-lg font-bold 
                  ${
                    usedLetters.includes(letter)
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Lives */}
          <p className="text-lg font-semibold mb-4">
            Lives Left: {lives}
          </p>

          {/* Game Status */}
          {status === "win" && (
            <div className="text-green-600 text-xl font-bold mb-4">
              🎉 You Won! The answer was "{answer}"
            </div>
          )}
          {status === "lose" && (
            <div className="text-red-600 text-xl font-bold mb-4">
              ❌ You Lost! The answer was "{answer}"
            </div>
          )}

          {/* Reset Button */}
          {(status === "win" || status === "lose") && (
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Play Again
            </button>
          )}
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}