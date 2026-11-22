# whats-dog-doing

儿童数学答题游戏（React 19 + JavaScript）。

## 技术栈

- **React 19** / 纯 JS（无 TypeScript）
- Create React App + **react-app-rewired**（`config-overrides.js` 为空桩，未做覆盖）
- 无 React Router，通过 `App.js` 中 `page` state 做页面切换
- 无 CSS 预处理器 / CSS Modules / CSS-in-JS
- 无状态管理库（纯 `useState`）

## 开发命令

| 命令 | 说明 |
|---|---|
| `npm start` | 启动开发服务器 |
| `npm test` | 运行测试（当前无测试文件，会跳过） |
| `npm run build` | 生产构建 |
| `npm run deploy` | 构建并部署到 GitHub Pages |

所有命令需用 `react-app-rewired` 而非 `react-scripts`（已在 package.json 中配置好）。

## 代码约定

- **ESLint**：配置在 package.json 中，`extends: ["react-app", "react-app/jest"]`，无独立配置文件
- **格式化**：无 Prettier 等格式化工具
- **页面路由**：`App.js` 内部 `page` 变量：`"cover"` → `"quiz"` → `"result"`，通过回调切换
- **难度**：四种难度 `easy` / `normal` / `hard` / `hell`，通过 `CoverPage` → `App` 传入 `Quiz`。`easy` / `normal` 用竖式逐位填空（`timerSeconds === null` 表示不限时），`hard` / `hell` 用横式输入框
- **竖式样式隔离**：竖式模式对既有布局的压缩全部写在 `Quiz.css` 的 `.quiz-col` 作用域下，改这里不要动基础规则，否则会回归影响 `hard` / `hell`

## 项目结构

```
src/
├── index.js            # 入口
├── App.js              # 根组件（状态机路由）
├── CoverPage.js        # 首页（难度选择）
├── Quiz.js             # 核心答题页（出题、计时、动画）
├── ResultPage.js       # 结算页
├── vertical.js         # 竖式分解与逐列进位退位计算（纯逻辑，无 import）
├── VerticalForm.js     # 竖式渲染（行、横线、进位小 1、退位点）
└── VerticalAnswer.js   # 竖式填空（空格状态、分格输入与焦点推进、自动提交）
```

`public/sounds/` 音效通过 Audio API 播放，`public/images/` 为游戏素材。

## 部署

- 部署到 GitHub Pages：`npm run deploy`（内部执行 `gh-pages -d build`）
- 无 CI/CD 工作流
