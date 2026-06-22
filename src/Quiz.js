import { useState, useRef, useEffect } from 'react';
import './Quiz.css';

function generateQuestions(count) {
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
    questions.push({ a, b, op: isAdd ? '+' : '-', answer });
  }
  return questions;
}

function Quiz({ onComplete }) {
  const [questions] = useState(() => generateQuestions(10));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState(Array(10).fill(null));
  const [timeLeft, setTimeLeft] = useState(15);
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
      setTimeLeft(15);
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
    finishQuestion(val === q.answer);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="quiz">
      <div className="quiz-bg" />
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
          <span className="quiz-num">{q.a}</span>
          <span className="quiz-op">{q.op}</span>
          <span className="quiz-num">{q.b}</span>
          <span className="quiz-eq">=</span>
          <span className="quiz-answer-box">?</span>
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

        {feedback && (
          <div className="quiz-feedback-wrap">
            <img
              src={feedback === 'correct' ? '/images/dog-happy.jpg' : '/images/dog-sad.jpg'}
              alt={feedback === 'correct' ? '正确' : '错误'}
              className="quiz-feedback-img"
            />
            <div className={`quiz-feedback ${feedback}`}>
              {feedback === 'correct' ? '✓ 正确！' : `✗ 错误！正确答案是 ${q.answer}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
