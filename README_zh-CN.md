# Portfolio Blog - Gatsby + WordPress（中文）

一个现代化的 Gatsby 作品集博客模板，可选接入 WordPress 数据，实现静态站点生成（SSG），同时提供优秀的 SEO 与开箱即用的本地回退数据。

## 🎯 项目目的

本项目是一个**作品集博客模板**，融合了：

- **Gatsby 性能**：静态生成，加载飞快
- **WordPress 内容管理**：可选的后台内容更新
- **SEO 友好**：预渲染页面与完善的 meta 信息
- **现代化 UI**：响应式设计，流畅动画
- **零配置**：缺省即用，不填环境变量也能跑

适合需要快速上线、易维护、可选后台的开发者、设计师和内容创作者。

## 🚀 一键部署

### 部署到 EdgeOne

[![Deploy to EdgeOne](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=https://github.com/tomcomtang/wordpress-gatsby&output-directory=./public&build-command=npm%20run%20build&install-command=npm%20install)

### 手动部署

```bash
# 克隆仓库
git clone https://github.com/tomcomtang/wordpress-gatsby.git
cd wordpress-gatsby

# 安装依赖
npm install

# 构建与部署（无需环境变量！）
npm run build
```

## 🌐 在线预览

示例站点：<https://wordpress-gatsby.edgeone.app/>

## 🏗️ 架构

### 技术栈

- **前端**：Gatsby 4（基于 React 的静态站点生成器）
- **内容**：WordPress REST API（可选）
- **样式**：CSS Modules
- **评论**：Giscus（GitHub Discussions，可选）
- **部署**：EdgeOne 或任意静态托管

### 数据流

```
WordPress API（可选） → Gatsby 构建阶段 → 静态 HTML/CSS/JS → CDN
```

1. **构建期获取数据**：如配置 WordPress，Gatsby 在构建时抓取数据
2. **本地回退数据**：未配置 WordPress 时使用 `src/data/fallbackData.js`
3. **静态生成**：生成预渲染 HTML
4. **无运行时请求**：内容随静态文件下发
5. **极速加载**：CDN 直接分发

### 项目结构

```
src/
├── components/          # React 组件
│   ├── HeroSection.js   # 首页 Hero
│   ├── AboutMe.js       # About 区域
│   ├── header.js        # 导航头
│   └── layout.js        # 页面布局
├── data/
│   └── fallbackData.js  # 本地回退数据（未配 WP 时使用）
├── pages/               # 页面组件
│   ├── index.js         # 首页
│   ├── posts.js         # 博文列表
│   ├── post/[slug].js   # 单篇文章
│   ├── comments.js      # 评论页（配置 Giscus 时显示）
│   └── contact.js       # 联系页
├── services/
│   └── wordpressApi.js  # WordPress API 工具
└── styles/              # 样式
```

## ⚙️ 环境变量

### 所有环境变量都是可选的！

项目默认可直接运行，环境变量缺省时自动使用本地回退数据：

```bash
# WordPress 配置（可选）
# 未设置时，使用 src/data/fallbackData.js
GATSBY_WORDPRESS_URL=https://your-wordpress-site.wordpress.com

# Giscus 评论（可选）
# 任意缺失时，评论菜单不会显示
GATSBY_GISCUS_REPO=your-username/your-repo-name
GATSBY_GISCUS_REPO_ID=your-repo-id
GATSBY_GISCUS_CATEGORY_ID=your-category-id
```

#### 示例 `.env`（本地开发）

```env
# WordPress 数据源（可选）
GATSBY_WORDPRESS_URL=https://tomchild5.wordpress.com

# Giscus 评论（可选，若不填则隐藏评论菜单）
GATSBY_GISCUS_REPO=tomcomtang/astro-cartoon-portfolio
GATSBY_GISCUS_REPO_ID=R_kgDOPFb2Xg
GATSBY_GISCUS_CATEGORY_ID=DIC_kwDOPFb2Xs4CsW3j
```

> 提示：`.env` 仅保留在本地，不要提交；未配置时会自动使用本地回退数据并隐藏评论入口。

### WordPress 配置（可选）

**未设置 `GATSBY_WORDPRESS_URL`：**

- ✅ 站点照常运行，使用本地回退数据
- ✅ 功能完整，无外部依赖

**设置了 `GATSBY_WORDPRESS_URL`：**

- ✅ 构建时从你的 WordPress 拉取内容
- ✅ 数据结构与回退数据一致
- ✅ 自动生成最新内容的 `posts-list.js`
- ✅ WordPress 不可用时回退到本地数据

#### WordPress URL 格式

- WordPress.com: `https://your-site.wordpress.com`
- 自建站: `https://your-domain.com`

#### 本地测试

```bash
# macOS/Linux
export GATSBY_WORDPRESS_URL=https://your-wordpress-site.wordpress.com

# Windows (Command Prompt)
set GATSBY_WORDPRESS_URL=https://your-wordpress-site.wordpress.com

# Windows (PowerShell)
$env:GATSBY_WORDPRESS_URL="https://your-wordpress-site.wordpress.com"

# 启动开发服务
npm run develop
```

### Giscus 评论配置（可选）

- **未设置任意 Giscus 变量**：隐藏评论菜单，无评论功能
- **设置全部三项**：显示评论菜单，启用完整评论

#### 配置步骤（可选）

1. 访问 [Giscus](https://giscus.app/)
2. 关联你的 GitHub 仓库
3. 将生成的配置填入 `.env`：
   - `GATSBY_GISCUS_REPO`: 仓库名（如 `username/repo`）
   - `GATSBY_GISCUS_REPO_ID`: 仓库 ID
   - `GATSBY_GISCUS_CATEGORY_ID`: 分类 ID
4. 导航会自动出现“Comments”菜单
5. 评论将显示在文章页和 `/comments` 页面

> 测试：访问 `/giscus-test` 检查配置。

## 📝 WordPress 数据结构（可选）

如使用 WordPress，请确保数据结构与本地回退数据一致（参见 `src/data/fallbackData.js`）。

### 支持的数据来源

- **ACF 自定义字段**（推荐自建站）：字段结构需与回退数据一致
- **分类描述 JSON**（WordPress.com 免费版）：在分类描述中粘贴 JSON，格式同回退数据

### ACF 示例（Hero）

```json
{
  "basic": {
    "name": "Your Name",
    "title": "Welcome Message",
    "description": "Your introduction text",
    "avatar": "https://your-avatar-url.com"
  },
  "buttons": [
    { "text": "View Posts", "link": "/posts", "type": "primary" },
    { "text": "Contact Me", "link": "/contact", "type": "secondary" }
  ]
}
```

> 提示：字段命名与嵌套需与 `fallbackData.js` 保持一致。

### 必需分类（描述式数据）

- `hero`：站点头部信息（包含按钮）
- `about`：关于信息、形象、技能
- `contact`：联系方式与文案
- `socials`：社交链接列表
- `comments`：评论政策文案
- `footer`：页脚文案与链接
- `skills`：技能列表（含等级、颜色）
- `projects`：项目列表（含描述、封面、链接、技术栈）

## 🚀 快速开始

### 前置条件

- Node.js 16+
- npm 或 yarn

### 安装

1. 克隆仓库

   ```bash
   git clone https://github.com/tomcomtang/wordpress-gatsby.git
   cd wordpress-gatsby
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 启动开发环境

   ```bash
   npm run develop
   ```

   默认即用本地回退数据！

4. （可选）配置 WordPress
   - 创建 `.env`
   - 填写 `GATSBY_WORDPRESS_URL`
   - 重启开发服务

5. （可选）配置评论
   - 在 `.env` 添加 Giscus 变量
   - 评论菜单会自动出现

### 生产构建

```bash
npm run build
```

构建结果输出到 `public/`，可直接部署。

## 🎨 定制

- **样式**：修改 `src/styles/` 或各组件 CSS Module
- **内容**：
  - 使用 WordPress：后台更新
  - 不用 WordPress：编辑 `src/data/fallbackData.js`
- **布局**：调整 `src/components/` 和 `src/pages/`，导航见 `src/components/header.js`

## 📦 部署

- **EdgeOne（推荐）**：使用上方一键按钮
- **手动部署**：将 `public/` 上传到任意静态托管

## 🤝 贡献

1. Fork 仓库
2. 创建分支
3. 开发与测试
4. 提交 PR

## 📄 许可证

MIT，详见 [LICENSE](LICENSE)。

## 🙏 致谢

- Gatsby 团队
- WordPress
- Giscus
- 所有贡献者和使用者

---

**记住**：即使不配置任何环境变量，这个模板也能直接运行！执行 `npm install && npm run develop` 即可得到完整的作品集博客。
