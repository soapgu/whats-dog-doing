import './CoverPage.css';

function CoverPage({ onStart }) {
  const playSound = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleEasy = (e) => {
    e.stopPropagation();
    playSound('简单模式');
    onStart('easy');
  };

  const handleHard = (e) => {
    e.stopPropagation();
    playSound('困难模式');
    onStart('hard');
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
        <div className="cover-btn-row">
          <button className="cover-btn easy" onClick={handleEasy}>
            简 单
          </button>
          <button className="cover-btn hard" onClick={handleHard}>
            困 难
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoverPage;
