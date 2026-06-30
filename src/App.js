import { useState } from 'react';
import CoverPage from './CoverPage';
import Quiz from './Quiz';
import ResultPage from './ResultPage';

function App() {
  const [page, setPage] = useState('cover');
  const [result, setResult] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');

  const handleStart = (difficulty) => {
    setDifficulty(difficulty);
    setPage('quiz');
  };

  const handleComplete = (scoreData) => {
    setResult(scoreData);
    setPage('result');
  };

  const handleRestart = () => {
    setResult(null);
    setPage('cover');
  };

  const handleBack = () => {
    setPage('cover');
  };

  if (page === 'cover') {
    return <CoverPage onStart={handleStart} />;
  }

  if (page === 'quiz') {
    return <Quiz difficulty={difficulty} onComplete={handleComplete} onBack={handleBack} />;
  }

  return <ResultPage result={result} difficulty={difficulty} onRestart={handleRestart} />;
}

export default App;
