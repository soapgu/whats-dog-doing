# WHATS DOG DOING 🐕

一款帮助儿童练习加减法的数学答题网页游戏。怪物正在靠近英雄，答对则消灭怪物，答错或超时则英雄跌落。

## 功能

- **四种难度模式**：
  - 简单：30 秒倒计时，答案填空
  - 普通：15 秒倒计时，答案填空
  - 困难：12 秒倒计时，随机位置填空（a / b / 答案）
  - 地狱：12 秒倒计时，三数运算（a+b+c / a+b-c / a-b+c / a-b-c），随机位置填空（a / b / c / 答案）
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
  CoverPage.css  — 首页样式
  Quiz.css       — 答题页样式
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
