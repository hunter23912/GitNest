# GitNest 前端项目说明文档

## 项目简介

GitNest 是一个现代化的代码托管与协作平台，前端基于 **React** + **Vite** + **styled-components** 技术栈开发，支持模块化开发、热更新、组件复用和良好的代码质量保障。适合团队协作开发和持续扩展。

---

## 目录结构说明

```
frontend/
│
├── public/                  # 公共静态资源目录（如 favicon、静态图片等）
│   └── vite.svg
│
├── src/                     # 前端源代码目录
│   ├── assets/              # 项目图片、SVG等静态资源
│   │   ├── homelogo.svg
│   │   └── react.svg
│   │
│   ├── components/          # 可复用的通用组件
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── SearchOverlay.jsx
│   │
│   ├── pages/               # 路由页面组件（每个页面一个文件）
│   │   ├── About.jsx
│   │   ├── AIAssistant.jsx
│   │   ├── CodeQuality.jsx
│   │   ├── CollaborativeEditor.jsx
│   │   ├── CreateRepo.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── ProjectKanban.jsx
│   │   ├── Register.jsx
│   │   ├── RepoDetail.jsx
│   │   ├── Repos.jsx
│   │   └── Search.jsx
│   │
│   ├── router/              # 路由配置
│   │   └── index.jsx
│   │
│   ├── App.jsx              # 应用主组件
│   ├── main.jsx             # 应用入口文件
│   ├── App.css              # 全局样式
│   └── index.css            # 全局基础样式
│
├── index.html               # 入口 HTML 文件
├── package.json             # 项目依赖与脚本配置
├── vite.config.js           # Vite 配置文件
├── eslint.config.js         # ESLint 配置
├── tsconfig.node.json       # TypeScript 配置（部分依赖类型校验）
└── README.md                # 项目说明文档
```

---

## 主要文件说明

- **public/**  
  存放无需 Webpack/Vite 处理的静态资源，访问路径以 `/` 开头。

- **src/assets/**  
  项目用到的图片、SVG 等静态资源，需通过 `import` 方式在组件中引用。

- **src/components/**  
  存放可复用的 UI 组件，如导航栏、布局、搜索等。

- **src/pages/**  
  每个页面一个组件文件，通常与路由一一对应。页面内部可组合多个通用组件。

- **src/router/index.jsx**  
  路由配置文件，集中管理页面路由跳转。

- **src/App.jsx**  
  应用主组件，通常用于路由出口和全局布局。

- **src/main.jsx**  
  应用入口，挂载 React 应用到 DOM。

- **index.html**  
  Vite 的 HTML 模板，入口为 `src/main.jsx`。

- **package.json**  
  记录依赖包、启动/构建脚本等。

- **vite.config.js**  
  Vite 工具的自定义配置。

- **eslint.config.js**  
  代码规范和质量检查配置。

---

## 启动与开发

1. 安装依赖

   ```sh
   npm install
   ```

2. 启动开发服务器

   ```sh
   npm run dev
   ```

3. 构建生产版本

   ```sh
   npm run build
   ```

---

## 代码风格与规范

- 使用 ESLint 进行代码规范检查，配置见 [`eslint.config.js`](eslint.config.js)。
- 推荐使用函数式组件和 Hooks。
- 样式统一采用 `styled-components`。
- 静态资源统一放在 `src/assets/`，通过 `import` 引用。

---

## 其他说明

- 路由页面建议放在 `src/pages/`，通用组件放在 `src/components/`。
- 如需添加新页面，建议在 `src/pages/` 新建对应文件，并在 `src/router/index.jsx` 配置路由。
- 静态图片如需直接通过 URL 访问，请放在 `public/` 目录。
