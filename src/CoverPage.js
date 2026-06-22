import './CoverPage.css';

function CoverPage({ onStart }) {
  const playSound = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleStart = (e) => {
    e.stopPropagation();
    playSound('开始挑战');
    onStart();
  };

  return (
    <div className="cover" onClick={() => playSound('我的刀盾')}>
      <div className="cover-bg" />
      <div className="cover-content">
        <div className="cover-icon">
          <span className="icon-sword">🗡️</span>
          <img
            src="/images/dog-hero.jpg"
            alt="刀盾狗"
            className="icon-dog"
          />
          <span className="icon-shield">🛡️</span>
        </div>
        <h1 className="cover-title">WHATS DOG DOING</h1>
        <p className="cover-subtitle">A New Adventure Awaits</p>
        <button className="cover-btn" onClick={handleStart}>
          开 始
        </button>
      </div>
    </div>
  );
}

export default CoverPage;
