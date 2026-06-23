import { useState, useRef, useEffect } from 'react';
import './Quiz.css';

function generateQuestions(count, difficulty) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const isAdd = Math.random() > 0.5;
    let a, b, answer;
    do {
      if (isAdd) {
        a = Math.floor(Math.random() * 49) + 1;
        b = Math.floor(Math.random() * (50 - a)) + 1;
        answer = a + b;
      } else {
        a = Math.floor(Math.random() * 49) + 2;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        answer = a - b;
      }
    } while (answer === 0);
    let blankPos = 'answer';
    let blankValue = answer;
    if (difficulty === 'hard') {
      const rand = Math.random();
      if (rand < 1 / 3) {
        blankPos = 'a';
        blankValue = a;
      } else if (rand < 2 / 3) {
        blankPos = 'b';
        blankValue = b;
      }
    }
    questions.push({ a, b, op: isAdd ? '+' : '-', answer, blankPos, blankValue });
  }
  return questions;
}

const MONSTER_IMG = {
  easy: '/images/monster.jpg',
  normal: '/images/monster-normal.png',
  hard: '/images/monster-hard.png',
};

function Quiz({ difficulty, onComplete }) {
  const timerSeconds = difficulty === 'easy' ? 30 : difficulty === 'hard' ? 12 : 15;
  const [questions] = useState(() => generateQuestions(10, difficulty));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState(Array(10).fill(null));
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [monsterLeft, setMonsterLeft] = useState(80);
  const submittedRef = useRef(false);
  const inputRef = useRef(null);

  const q = questions[index];

  useEffect(() => {
    inputRef.current?.focus();
  }, [index, feedback]);

  useEffect(() => {
    if (feedback) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [index, feedback]);

  useEffect(() => {
    if (timeLeft === 0 && !submittedRef.current) {
      finishQuestion(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (feedback) return;
    setMonsterLeft(80);
    const startTime = Date.now();
    const totalMs = timerSeconds * 1000;
    let rafId;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalMs, 1);
      setMonsterLeft(80 - progress * 78);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [index, feedback, timerSeconds]);

  const finishQuestion = (correct) => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    if (correct) setScore((s) => s + 1);
    setFeedback(correct ? 'correct' : 'wrong');

    const sound = new SpeechSynthesisUtterance(correct ? '比比拉布' : '错误');
    sound.lang = 'zh-CN';
    sound.rate = 0.9;
    window.speechSynthesis.speak(sound);
    setResults((prev) => {
      const next = [...prev];
      next[index] = correct;
      return next;
    });

    setTimeout(() => {
      submittedRef.current = false;
      setFeedback(null);
      setInput('');
      setTimeLeft(timerSeconds);
      if (index < questions.length - 1) {
        setIndex((i) => i + 1);
      } else {
        onComplete({ score: score + (correct ? 1 : 0), total: questions.length });
      }
    }, 1500);
  };

  const handleSubmit = () => {
    const val = parseInt(input, 10);
    if (isNaN(val) || submittedRef.current) return;
    finishQuestion(val === q.blankValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="quiz">
      <div className="quiz-bg" />
      <div className="quiz-layout">
        <div className="battle-arena">
          <div className="battle-hero">
            <span className={`hero-emoji ${feedback === 'wrong' ? 'fall' : ''}`}>
              <img src="/images/hero.png" alt="英雄" className="hero-img" />
            </span>
          </div>
          <div className="battle-track">
            <span
              className={`monster-emoji ${feedback === 'correct' ? 'hit' : ''}`}
              style={{ left: `${monsterLeft}%` }}
            >
              <img src={MONSTER_IMG[difficulty]} alt="怪物" className="monster-img" />
            </span>
            {feedback === 'correct' && <span className="hit-effect">💥</span>}
          </div>
        </div>
        <div className="quiz-content">
        <div className="quiz-progress">
          {results.map((r, i) => (
            <div
              key={i}
              className={`quiz-cell ${r === null ? (i === index ? 'current' : 'pending') : r ? 'correct' : 'wrong'}`}
            >
              {r === null ? (i === index ? '▸' : i + 1) : r ? '✓' : '✗'}
            </div>
          ))}
        </div>

        <div className="quiz-question">
          {q.blankPos === 'a' ? (
            <span className="quiz-answer-box">?</span>
          ) : (
            <span className="quiz-num">{q.a}</span>
          )}
          <span className="quiz-op">{q.op}</span>
          {q.blankPos === 'b' ? (
            <span className="quiz-answer-box">?</span>
          ) : (
            <span className="quiz-num">{q.b}</span>
          )}
          <span className="quiz-eq">=</span>
          {q.blankPos === 'answer' ? (
            <span className="quiz-answer-box">?</span>
          ) : (
            <span className="quiz-num">{q.answer}</span>
          )}
        </div>

        <div className="quiz-timer">
          <span className={`timer-icon ${timeLeft <= 5 ? 'urgent' : ''}`}>⏱</span>
          <span className={`timer-text ${timeLeft <= 5 ? 'urgent' : timeLeft <= 10 ? 'warn' : ''}`}>
            {timeLeft}s
          </span>
        </div>

        <div className="quiz-input-row">
          <input
            ref={inputRef}
            className="quiz-input"
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={feedback !== null}
            placeholder="输入答案"
          />
          <button
            className="quiz-submit"
            onClick={handleSubmit}
            disabled={feedback !== null}
          >
            确 认
          </button>
        </div>

          <div className={`quiz-feedback-wrap ${!feedback ? 'hidden' : ''}`}>
            <div className={`quiz-feedback ${feedback || ''}`}>
              {feedback === 'correct' ? '✓ 正确！' : feedback ? `✗ 错误！正确答案是 ${q.blankValue}` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
