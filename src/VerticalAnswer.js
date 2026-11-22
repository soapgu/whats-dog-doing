import { useState, useEffect, useMemo, useRef } from 'react';
import VerticalForm from './VerticalForm';

function VerticalAnswer({ plan, showMarks, revealed, locked, onSubmit }) {
  const [cells, setCells] = useState({});
  const refs = useRef({});

  useEffect(() => {
    setCells({});
  }, [plan]);

  // 换题时 disabled 刚解除，等这一帧渲染完再聚焦，手机会跟着弹系统数字键盘
  useEffect(() => {
    if (locked || !plan.inputKeys.length) return;
    const el = refs.current[plan.inputKeys[0]];
    if (el) el.focus();
  }, [plan, locked]);

  const focusAt = (index) => {
    const el = refs.current[plan.inputKeys[index]];
    if (el) el.focus();
  };

  // col 越大越靠左（col=1 是十位），所以左键是 +1；只在同一行内找邻居
  const focusCol = (key, delta) => {
    const row = plan.rows.find((r) => r.slots.some((s) => s.key === key));
    if (!row) return;
    const { col } = row.slots.find((s) => s.key === key);
    const nb = row.slots.find((s) => s.key != null && s.col === col + delta);
    const el = nb && refs.current[nb.key];
    if (el) el.focus();
  };

  const handleChange = (key, raw) => {
    if (locked) return;
    const last = raw.slice(-1);
    if (last < '0' || last > '9') return;
    const next = { ...cells, [key]: Number(last) };
    setCells(next);
    const upcoming = plan.inputKeys.find((k) => next[k] == null);
    if (upcoming) {
      focusAt(plan.inputKeys.indexOf(upcoming));
    } else {
      onSubmit(plan.inputKeys.every((k) => next[k] === plan.expected[k]));
    }
  };

  const handleKeyDown = (key, e) => {
    if (locked) return;
    const keys = plan.inputKeys;
    const i = keys.indexOf(key);
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (cells[key] == null && i <= 0) return;
      const target = cells[key] != null ? key : keys[i - 1];
      setCells({ ...cells, [target]: null });
      if (target !== key) focusAt(i - 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusCol(key, 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusCol(key, -1);
    }
  };

  const wrongKeys = useMemo(
    () => new Set(revealed ? plan.inputKeys.filter((k) => cells[k] !== plan.expected[k]) : []),
    [revealed, cells, plan]
  );

  return (
    <VerticalForm
      plan={plan}
      values={cells}
      showMarks={showMarks}
      wrongKeys={wrongKeys}
      revealed={revealed}
      disabled={locked}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      setCellRef={(key, el) => {
        refs.current[key] = el;
      }}
    />
  );
}

export default VerticalAnswer;
