import { useState } from 'react';
import CoverPage from './CoverPage';
import Quiz from './Quiz';

const MODE_LABEL = { easy: '简单', hard: '困难' };
const MODE_EMOJI = { easy: '🌱', hard: '🔥' };

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

  if (page === 'cover') {
    return <CoverPage onStart={handleStart} />;
  }

  if (page === 'quiz') {
    return <Quiz difficulty={difficulty} onComplete={handleComplete} />;
  }

  return (
    <div className="cover">
      <div className="cover-bg" />
      <div className="cover-content">
        <div className="cover-icon" style={{ fontSize: 72, marginBottom: 24 }}>
          {result.score >= 8 ? '🎉' : result.score >= 5 ? '👍' : '💪'}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 24 }}>
          {MODE_EMOJI[difficulty]} {MODE_LABEL[difficulty]}模式
        </p>
        <h1 className="cover-title" style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: 16 }}>
          答题结束！
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20, marginBottom: 8 }}>
          答对 <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 32 }}>{result.score}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}> / {result.total}</span>
        </p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 48 }}>
          正确率 {Math.round((result.score / result.total) * 100)}%
        </p>
        <button className="cover-btn" onClick={handleRestart}>
          再来一次
        </button>
      </div>
    </div>
  );
}

export default App;
