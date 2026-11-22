import { useState, useRef, useEffect, useMemo } from 'react';
import VerticalAnswer from './VerticalAnswer';
import { buildVerticalPlan } from './vertical';
import './Quiz.css';

const randIn = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

// 三数混合运算：乘法因数在九九表内，每步中间结果与答案都落在 1-100
function generateMixedQuestion() {
  const forms = ['mulAdd', 'mulSub', 'addMul', 'subMul', 'addAdd', 'addSub', 'subAdd', 'subSub'];
  const form = forms[Math.floor(Math.random() * forms.length)];
  let a, b, c, op1, op2, answer;

  switch (form) {
    case 'mulAdd': {
      a = randIn(2, 9);
      b = randIn(2, 9);
      const m = a * b;
      c = randIn(1, Math.min(20, 99 - m));
      op1 = '×';
      op2 = '+';
      answer = m + c;
      break;
    }
    case 'mulSub': {
      a = randIn(2, 9);
      b = randIn(2, 9);
      const m = a * b;
      c = randIn(1, m - 1);
      op1 = '×';
      op2 = '-';
      answer = m - c;
      break;
    }
    case 'addMul': {
      b = randIn(2, 9);
      c = randIn(2, 9);
      const m = b * c;
      a = randIn(1, Math.min(20, 99 - m));
      op1 = '+';
      op2 = '×';
      answer = a + m;
      break;
    }
    case 'subMul': {
      b = randIn(2, 9);
      c = randIn(2, 9);
      const m = b * c;
      a = randIn(m + 1, Math.min(m + 50, 99));
      op1 = '-';
      op2 = '×';
      answer = a - m;
      break;
    }
    case 'addAdd': {
      a = randIn(10, 60);
      b = randIn(5, 94 - a);
      c = randIn(5, 99 - a - b);
      op1 = '+';
      op2 = '+';
      answer = a + b + c;
      break;
    }
    case 'addSub': {
      a = randIn(10, 60);
      b = randIn(5, 99 - a);
      c = randIn(1, a + b - 1);
      op1 = '+';
      op2 = '-';
      answer = a + b - c;
      break;
    }
    case 'subAdd': {
      a = randIn(20, 99);
      b = randIn(5, a - 1);
      c = randIn(1, 99 - (a - b));
      op1 = '-';
      op2 = '+';
      answer = a - b + c;
      break;
    }
    default: {
      a = randIn(20, 99);
      b = randIn(5, a - 2);
      c = randIn(1, a - b - 1);
      op1 = '-';
      op2 = '-';
      answer = a - b - c;
    }
  }

  return { a, b, c, op1, op2, answer };
}

function generateQuestions(count, difficulty) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    if (difficulty === 'easy' || difficulty === 'normal') {
      const mixed = generateMixedQuestion();
      questions.push({ ...mixed, blankPos: 'answer', blankValue: mixed.answer });
      continue;
    }

    let a, b, c, op1, op2, answer;

    if (difficulty === 'hell') {
      const patterns = [
        { o1: '+', o2: '+' },
        { o1: '+', o2: '-' },
        { o1: '-', o2: '+' },
        { o1: '-', o2: '-' },
      ];
      const { o1, o2 } = patterns[Math.floor(Math.random() * 4)];
      op1 = o1;
      op2 = o2;

      if (o1 === '+' && o2 === '+') {
        a = Math.floor(Math.random() * 48) + 1;
        b = Math.floor(Math.random() * (48 - a)) + 1;
        c = Math.floor(Math.random() * (50 - a - b)) + 1;
        answer = a + b + c;
      } else if (o1 === '+' && o2 === '-') {
        a = Math.floor(Math.random() * 49) + 1;
        b = Math.floor(Math.random() * (49 - a)) + 1;
        c = Math.floor(Math.random() * (a + b - 1)) + 1;
        answer = a + b - c;
      } else if (o1 === '-' && o2 === '+') {
        a = Math.floor(Math.random() * 49) + 2;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        c = Math.floor(Math.random() * (50 - a + b)) + 1;
        answer = a - b + c;
      } else {
        a = Math.floor(Math.random() * 48) + 3;
        b = Math.floor(Math.random() * (a - 2)) + 1;
        c = Math.floor(Math.random() * (a - b - 1)) + 1;
        answer = a - b - c;
      }
    } else {
      c = null;
      op2 = null;
      const isAdd = Math.random() > 0.5;
      op1 = isAdd ? '+' : '-';
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
    }

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
    } else if (difficulty === 'hell') {
      const rand = Math.random();
      if (rand < 1 / 4) {
        blankPos = 'a';
        blankValue = a;
      } else if (rand < 2 / 4) {
        blankPos = 'b';
        blankValue = b;
      } else if (rand < 3 / 4) {
        blankPos = 'c';
        blankValue = c;
      }
    }

    questions.push({ a, b, c, op1, op2, answer, blankPos, blankValue });
  }
  return questions;
}

const MONSTER_IMG = {
  easy: process.env.PUBLIC_URL + '/images/monster.jpg',
  normal: process.env.PUBLIC_URL + '/images/monster-normal.png',
  hard: process.env.PUBLIC_URL + '/images/monster-hard.png',
  hell: process.env.PUBLIC_URL + '/images/monster-hell.png',
};

function Quiz({ difficulty, onComplete, onBack }) {
  const useVertical = difficulty === 'easy' || difficulty === 'normal';
  const timerSeconds = difficulty === 'easy' ? null : difficulty === 'normal' ? 30 : 12;
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
  const plan = useMemo(() => (useVertical ? buildVerticalPlan(q) : null), [q, useVertical]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [index, feedback]);

  useEffect(() => {
    const bgm = new Audio(process.env.PUBLIC_URL + `/sounds/${difficulty}.mp3`);
    bgm.loop = true;
    bgm.play().catch(() => {});
    return () => {
      bgm.pause();
      bgm.currentTime = 0;
    };
  }, [difficulty]);

  useEffect(() => {
    if (!timerSeconds || feedback) return;
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
  }, [index, feedback, timerSeconds]);

  useEffect(() => {
    if (timerSeconds != null && timeLeft === 0 && !submittedRef.current) {
      finishQuestion(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  useEffect(() => {
    if (feedback) return;
    setMonsterLeft(80);
    if (!timerSeconds) return;
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

    const sound = new Audio(process.env.PUBLIC_URL + (correct ? '/sounds/win.mp3' : '/sounds/fail.mp3'));
    sound.play();
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
    <div className={useVertical ? 'quiz quiz-col' : 'quiz'}>
      <div className="quiz-bg" />
      <button className="quiz-back" onClick={onBack}>← 返回</button>
      <div className="quiz-layout">
          <div className="quiz-content">
            <div className="quiz-top-row">
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
              <div className="quiz-timer">
                {timerSeconds == null ? (
                  <span className="timer-text unlimited">不限时</span>
                ) : (
                  <>
                    <span className={`timer-icon ${timeLeft <= 5 ? 'urgent' : ''}`}>⏱</span>
                    <span className={`timer-text ${timeLeft <= 5 ? 'urgent' : timeLeft <= 10 ? 'warn' : ''}`}>
                      {timeLeft}s
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="battle-arena">
              <div className="battle-hero">
                <span className={`hero-emoji ${feedback === 'wrong' ? 'fall' : ''}`}>
                  <img src={process.env.PUBLIC_URL + '/images/hero.png'} alt="英雄" className="hero-img" />
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

            <div className="quiz-question">
              {q.c != null ? (
                <>
                  {q.blankPos === 'a' ? <span className="quiz-answer-box">?</span> : <span className="quiz-num">{q.a}</span>}
                  <span className="quiz-op">{q.op1}</span>
                  {q.blankPos === 'b' ? <span className="quiz-answer-box">?</span> : <span className="quiz-num">{q.b}</span>}
                  <span className="quiz-op">{q.op2}</span>
                  {q.blankPos === 'c' ? <span className="quiz-answer-box">?</span> : <span className="quiz-num">{q.c}</span>}
                  <span className="quiz-eq">=</span>
                  {!useVertical &&
                    (q.blankPos === 'answer' ? (
                      <span className="quiz-answer-box">?</span>
                    ) : (
                      <span className="quiz-num">{q.answer}</span>
                    ))}
                </>
              ) : (
                <>
                  {q.blankPos === 'a' ? <span className="quiz-answer-box">?</span> : <span className="quiz-num">{q.a}</span>}
                  <span className="quiz-op">{q.op1}</span>
                  {q.blankPos === 'b' ? <span className="quiz-answer-box">?</span> : <span className="quiz-num">{q.b}</span>}
                  <span className="quiz-eq">=</span>
                  {q.blankPos === 'answer' ? <span className="quiz-answer-box">?</span> : <span className="quiz-num">{q.answer}</span>}
                </>
              )}
            </div>

            {useVertical ? (
              <VerticalAnswer
                plan={plan}
                showMarks={difficulty === 'easy'}
                revealed={feedback === 'wrong'}
                locked={feedback !== null}
                onSubmit={finishQuestion}
              />
            ) : (
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
            )}

            <div className={`quiz-feedback-wrap ${!feedback ? 'hidden' : ''}`}>
              <div className={`quiz-feedback ${feedback || ''}`}>
                {feedback === 'correct' && '✓ 正确！'}
                {feedback === 'wrong' && (useVertical ? '✗ 错误！' : `✗ 错误！正确答案是 ${q.blankValue}`)}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Quiz;
