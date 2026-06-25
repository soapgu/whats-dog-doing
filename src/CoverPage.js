import { useEffect, useRef } from 'react';
import './CoverPage.css';

function CoverPage({ onStart }) {
  const bgmRef = useRef(null);

  useEffect(() => {
    const bgm = new Audio(process.env.PUBLIC_URL + '/sounds/cover.mp3');
    bgm.loop = true;
    bgmRef.current = bgm;
    return () => {
      bgm.pause();
      bgm.currentTime = 0;
    };
  }, []);

  const playSound = (text) => {
    if (!window.speechSynthesis) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  };

  const handleBgClick = () => {
    if (bgmRef.current && bgmRef.current.paused) {
      bgmRef.current.play().catch(() => {});
    }
    playSound('我的刀盾');
  };

  const handleEasy = (e) => {
    e.stopPropagation();
    playSound('简单模式');
    onStart('easy');
  };

  const handleNormal = (e) => {
    e.stopPropagation();
    playSound('普通模式');
    onStart('normal');
  };

  const handleHard = (e) => {
    e.stopPropagation();
    playSound('困难模式');
    onStart('hard');
  };

  const handleHell = (e) => {
    e.stopPropagation();
    playSound('地狱模式');
    onStart('hell');
  };

  return (
    <div className="cover" onClick={handleBgClick}>
      <div className="cover-bg" />
      <div className="cover-content">
        <div className="cover-icon">
          <span className="icon-sword">🗡️</span>
          <img
            src={process.env.PUBLIC_URL + '/images/dog-hero.jpg'}
            alt="刀盾狗"
            className="icon-dog"
          />
          <span className="icon-shield">🛡️</span>
        </div>
        <h1 className="cover-title">WHATS DOG DOING</h1>
        <p className="cover-subtitle">A New Adventure Awaits</p>
        <div className="cover-btn-row">
          <button className="cover-btn easy" onClick={handleEasy}>
            <img src={process.env.PUBLIC_URL + '/images/monster.jpg'} alt="" className="cover-btn-img" />
            <span>简 单</span>
          </button>
          <button className="cover-btn normal" onClick={handleNormal}>
            <img src={process.env.PUBLIC_URL + '/images/monster-normal.png'} alt="" className="cover-btn-img" />
            <span>普 通</span>
          </button>
          <button className="cover-btn hard" onClick={handleHard}>
            <img src={process.env.PUBLIC_URL + '/images/monster-hard.png'} alt="" className="cover-btn-img" />
            <span>困 难</span>
          </button>
          <button className="cover-btn hell" onClick={handleHell}>
            <img src={process.env.PUBLIC_URL + '/images/monster-hell.png'} alt="" className="cover-btn-img" />
            <span>地 狱</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoverPage;
