# WHATS DOG DOING 🐕

一款帮助儿童练习加减法的数学答题网页游戏。怪物正在靠近英雄，答对则消灭怪物，答错或超时则英雄跌落。

## 功能

- **三种难度模式**：
  - 简单：30 秒倒计时，答案填空
  - 普通：15 秒倒计时，答案填空
  - 困难：12 秒倒计时，随机位置填空（a / b / 答案）
- **战斗动画**：怪物从右向左逐步靠近英雄，答对触发消灭特效，答错英雄跌落
- **可自定义**：英雄与怪物图片、每题背景音乐均可替换
- **语音反馈 / 音效**：答对/答错播放独立音效，不同场景有背景音乐

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
  CoverPage.css
  Quiz.css
```

## 自定义

替换 `public/images/` 和 `public/sounds/` 下的文件即可更换素材。路径映射见 `Quiz.js` 中的 `MONSTER_IMG` 对象和各个 `useEffect` 中的音频文件路径。
