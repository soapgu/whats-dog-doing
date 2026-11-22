# WHATS DOG DOING 🐕

一款帮助儿童练习口算的数学答题网页游戏。怪物正在靠近英雄，答对则消灭怪物，答错或超时则英雄跌落。

## 功能

- **四种难度模式**：
  - 简单：三数混合运算，列竖式逐位填空，进位小 1 与退位点自动给出，不限时
  - 普通：三数混合运算，列竖式逐位填空，进位退位需自己判断，30 秒倒计时
  - 困难：12 秒倒计时，横式随机位置填空（a / b / 答案）
  - 地狱：12 秒倒计时，三数运算（a+b+c / a+b-c / a-b+c / a-b-c），横式随机位置填空（a / b / c / 答案）
- **竖式答题**（简单 / 普通）：横式只给题面，答案按竖式一位一位填，顺序和竖式算法一致——每行先个位后十位；乘法先口算，积作为竖式的一个操作数行同样要填；三数连加连减用连写竖式；填完最后一格自动判定
- **直接用键盘填**：桌面敲数字键，手机点格子弹系统数字键盘；填完一格自动跳到下一格，退格回到前一格，左右方向键在格间移动焦点
- **战斗动画**：怪物从右向左逐步靠近英雄，答对触发消灭特效，答错英雄跌落
- **可自定义**：英雄与四种怪物图片、每关独立背景音乐均可替换
- **音效反馈**：答对/答错播放独立音效，首页、答题、结算各场景有背景音乐

## 技术栈

- React 19
- Create React App + react-app-rewired
- GitHub Pages 部署

## 本地运行

```bash
npm start
```

## 构建与部署

```bash
npm run build
npm run deploy
```

部署后访问：https://soapgu.github.io/whats-dog-doing

## 项目结构

```
public/
  images/       — 英雄、怪物图片
  sounds/       — 背景音乐、音效
src/
  App.js        — 根组件，页面路由
  CoverPage.js  — 首页（难度选择）
  Quiz.js       — 答题页（战斗动画、计时、输入）
  ResultPage.js — 结算页
  vertical.js        — 竖式分解与逐列进位退位计算（纯逻辑）
  VerticalForm.js    — 竖式渲染（行、横线、进位小 1、退位点）
  VerticalAnswer.js  — 竖式填空（空格状态、分格输入与焦点推进、自动提交）
  CoverPage.css  — 首页样式
  Quiz.css       — 答题页样式
  VerticalForm.css   — 竖式样式
```

## 自定义素材

| 分类 | 路径 |
|---|---|
| 英雄图片 | `public/images/hero.png` |
| 简单怪物 | `public/images/monster.jpg` |
| 普通怪物 | `public/images/monster-normal.png` |
| 困难怪物 | `public/images/monster-hard.png` |
| 地狱怪物 | `public/images/monster-hell.png` |
| 首页 BGM | `public/sounds/cover.mp3` |
| 简单 BGM | `public/sounds/easy.mp3` |
| 普通 BGM | `public/sounds/normal.mp3` |
| 困难 BGM | `public/sounds/hard.mp3` |
| 地狱 BGM | `public/sounds/hell.mp3` |
| 答对音效 | `public/sounds/win.mp3` |
| 答错音效 | `public/sounds/fail.mp3` |
| 结算 BGM | `public/sounds/clear.mp3` |
