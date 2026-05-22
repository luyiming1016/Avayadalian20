# Avaya Dalian 20年 —— Backbone 传奇

一款剧情向模拟经营游戏 demo。玩家从 2018 年的大连软件园入职开始，在技术成长、团队关系、家庭选择和行业变化之间做决定，走向 2026 年的终章。

## Version

- Version: v1.2 monthly story build
- Date: 2026-05-22
- Made by: Arthur
- Copyright: Copyright © 2026 Arthur. All rights reserved.

## Release Notes

### v1.2 monthly story build - 2026-05-22

- Expanded the full 2018-2026 timeline to at least one playable turn per month.
- Added recurring union events every year:
  - April: three-day, two-night employee outing
  - May: Dalian Federation of Trade Unions dragon boat race
  - October-November: 5 km union running activity
- Updated outing destinations so early years use out-of-province trips, while later years shift to in-province trips due to budget pressure.
- Updated the in-game top bar to show `YYYY-MM` and season by event month.

### v1.1 responsive build - 2026-05-22

- Added responsive layout support for desktop browsers and mobile screens.
- Reworked mobile game flow into a vertical layout with status, scene, and story card sections.
- Localized remote art references to assets stored in the repository.

### v1.0 playable demo - 2026-05-21

- Initial playable story demo with character creation, yearly progression, finale, epilogue, and multiple endings.

## Features

- 2018-2026 的多年份剧情推进
- 角色创建、属性成长、人物关系和行动日志
- 年度回顾、终章分屏演出、尾声选择与多结局
- 本地化图片资源，无需加载远程美术素材
- 支持桌面浏览器和手机端响应式布局

## Run Locally

这是一个纯静态项目，可以直接用浏览器打开 `index.html`。

也可以在项目目录启动本地服务：

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

然后访问：

```text
http://127.0.0.1:5173/index.html
```

## Project Structure

```text
.
├── index.html
├── style.css
├── game.js
├── content.js
├── assets/
└── Avaya_Dalian_20Years_Backbone_Legend_RDF.md
```
