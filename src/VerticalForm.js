import './VerticalForm.css';

function Slot({ slot, row, showMarks, revealed, values, wrong, disabled, onChange, onKeyDown, setCellRef }) {
  const carry = showMarks && row.carryAbove[slot.col];
  const dot = showMarks && row.borrowDot[slot.col];

  if (slot.mode === 'blank') {
    return (
      <span className="v-slot blank">
        {carry && <i className="v-carry">1</i>}
      </span>
    );
  }

  if (slot.mode === 'given') {
    return (
      <span className="v-slot given">
        {dot && <i className="v-dot" />}
        {carry && <i className="v-carry">1</i>}
        {slot.digit}
      </span>
    );
  }

  const value = revealed ? slot.digit : values[slot.key];
  const cls = ['v-slot', 'input'];
  if (value != null) cls.push('filled');
  if (revealed) cls.push(wrong ? 'wrong' : 'ok');

  return (
    <span className="v-cell">
      {dot && <i className="v-dot" />}
      {carry && <i className="v-carry">1</i>}
      <input
        className={cls.join(' ')}
        value={value != null ? String(value) : ''}
        onChange={(e) => onChange(slot.key, e.target.value)}
        onKeyDown={(e) => onKeyDown(slot.key, e)}
        ref={(el) => setCellRef(slot.key, el)}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        maxLength={1}
        disabled={disabled}
      />
    </span>
  );
}

function VerticalForm({ plan, values, showMarks, wrongKeys, revealed, disabled, onChange, onKeyDown, setCellRef }) {
  return (
    <div className="v-form">
      {plan.rows.map((row) => (
        <div className={`v-row${row.final ? ' final' : ''}`} key={row.key}>
          <div className="v-cells">
            <span className="v-sign">{row.sign || ''}</span>
            {row.slots.map((slot) => (
              <Slot
                key={slot.col}
                slot={slot}
                row={row}
                showMarks={showMarks}
                revealed={revealed}
                values={values}
                wrong={slot.key != null && wrongKeys.has(slot.key)}
                disabled={disabled}
                onChange={onChange}
                onKeyDown={onKeyDown}
                setCellRef={setCellRef}
              />
            ))}
          </div>
          {row.lineAfter && <div className="v-rule" />}
        </div>
      ))}
    </div>
  );
}

export default VerticalForm;
