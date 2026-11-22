export function digitAt(n, col) {
  return Math.floor(n / Math.pow(10, col)) % 10;
}

export function digitCount(n) {
  return String(n).length;
}

const NO_MARKS = [false, false];

// 竖式逐列规则：进位只可能出现在十位列（个位满十向十位进 1），退位同理。
// 十位再进位就会得到三位数，本项目的取值范围不会走到，出现即视为数据异常。
export function computeStepColumns(op, top, bottom) {
  const t0 = digitAt(top, 0);
  const b0 = digitAt(bottom, 0);
  const t1 = digitAt(top, 1);
  const b1 = digitAt(bottom, 1);
  const carry = [false, false];
  const borrow = [false, false];

  if (op === '+') {
    if (t0 + b0 >= 10) carry[1] = true;
    if (t1 + b1 + (carry[1] ? 1 : 0) >= 10) {
      throw new Error(`竖式溢出三位数：${top} + ${bottom}`);
    }
  } else if (op === '-') {
    if (t0 < b0) borrow[1] = true;
    const t = t1 - (borrow[1] ? 1 : 0) - b1;
    if (t < 0) throw new Error(`竖式十位减成负数：${top} - ${bottom}`);
  } else {
    throw new Error(`竖式不支持运算符 ${op}`);
  }

  return { carry, borrow };
}

function makeStep(op, top, bottom, result) {
  const { carry, borrow } = computeStepColumns(op, top.value, bottom.value);
  return { op, top, bottom, result, carry, borrow };
}

function operand(value, editable) {
  return { value, editable };
}

// 把一道三数题分解成 1~2 个竖式步骤。乘法只对口算出的积列竖式，
// 纯加减拆成两步且第一步的结果对象就是第二步的被加数，竖式才能连写成一列。
function decomposeSteps(q) {
  const { a, b, c, op1, op2, answer } = q;
  const result = operand(answer, true);

  if (op1 === '×') {
    return [makeStep(op2, operand(a * b, true), operand(c, false), result)];
  }
  if (op2 === '×') {
    return [makeStep(op1, operand(a, false), operand(b * c, true), result)];
  }

  const s1 = operand(op1 === '+' ? a + b : a - b, true);
  return [
    makeStep(op1, operand(a, false), operand(b, false), s1),
    makeStep(op2, s1, operand(c, false), result),
  ];
}

function toRowDefs(steps) {
  const defs = [];
  steps.forEach((st, i) => {
    if (i === 0) defs.push({ num: st.top, sign: null, borrow: st.borrow });
    defs.push({ num: st.bottom, sign: st.op, carry: st.carry, lineAfter: true });

    if (i === steps.length - 1) {
      defs.push({ num: st.result, sign: null, final: true });
    } else {
      if (steps[i + 1].top !== st.result) throw new Error('竖式步骤未衔接');
      defs.push({ num: st.result, sign: null, borrow: steps[i + 1].borrow });
    }
  });
  return defs;
}

export function buildVerticalPlan(q) {
  if (q.c == null) throw new Error('buildVerticalPlan 只接受三数题');

  const steps = decomposeSteps(q);
  const defs = toRowDefs(steps);
  const colCount = Math.max(...defs.map((d) => digitCount(d.num.value)));
  if (colCount > 2) throw new Error(`竖式超过两列：${JSON.stringify(q)}`);

  const inputKeys = [];
  const expected = {};

  const rows = defs.map((d, ri) => {
    const digits = digitCount(d.num.value);
    const slots = [];
    const rowKeys = [];
    for (let col = colCount - 1; col >= 0; col--) {
      if (col >= digits) {
        slots.push({ col, key: null, mode: 'blank' });
        continue;
      }
      const digit = digitAt(d.num.value, col);
      if (!d.num.editable) {
        slots.push({ col, key: null, mode: 'given', digit });
      } else {
        const key = `r${ri}:${col}`;
        rowKeys.push(key);
        expected[key] = digit;
        slots.push({ col, key, mode: 'input', digit });
      }
    }
    // 竖式从个位算起，填空顺序也跟着按个位→十位
    inputKeys.push(...rowKeys.reverse());
    return {
      key: `r${ri}`,
      sign: d.sign,
      lineAfter: !!d.lineAfter,
      final: !!d.final,
      editable: d.num.editable,
      slots,
      carryAbove: d.carry || NO_MARKS,
      borrowDot: d.borrow || NO_MARKS,
    };
  });

  return {
    form: `${opKey(q)}|${q.op1}${q.op2}`,
    colCount,
    answer: q.answer,
    rows,
    inputKeys,
    expected,
    blankCount: inputKeys.length,
  };
}

function opKey(q) {
  return `${q.op1 === '×' ? 'm' : 'n'}${q.op2 === '×' ? 'm' : 'n'}`;
}
