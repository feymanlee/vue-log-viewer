# Contributing Guide

## Commit Message Convention

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，配合 [semantic-release](https://semantic-release.gitbook.io/) 实现自动版本管理和发布。

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 | 版本变化 |
|------|------|---------|
| `feat` | 新功能 | minor (+0.1.0) |
| `fix` | Bug 修复 | patch (+0.0.1) |
| `docs` | 文档更新 | 无 |
| `style` | 代码格式（不影响代码运行）| 无 |
| `refactor` | 重构（既不是新功能也不是修复）| 无 |
| `perf` | 性能优化 | patch |
| `test` | 测试相关 | 无 |
| `chore` | 构建/工具/依赖更新 | 无 |
| `ci` | CI/CD 配置 | 无 |
| `revert` | 回滚提交 | patch |

### 示例

```bash
# 新功能 - 会发布 minor 版本
feat: add virtual scrolling support

# Bug 修复 - 会发布 patch 版本
fix: resolve memory leak in ring buffer

# 破坏性变更 - 会发布 major 版本
feat: redesign log entry interface

BREAKING CHANGE: LogEntry timestamp format changed from string to number

# 关闭 Issue
fix: correct search highlighting

Closes #123
```

### 提交检查

PR 提交时会自动检查 commit message 是否符合规范。

## 发布流程

项目使用全自动发布流程：

1. **开发阶段**：按 Conventional Commits 规范提交代码
2. **合并到 main**：PR 合并后自动触发 release 工作流
3. **自动发布**：
   - 分析 commits 确定版本号（patch/minor/major）
   - 更新 package.json 版本
   - 生成 CHANGELOG.md
   - 创建 GitHub Release
   - 发布到 npm

无需手动打 tag 或修改版本号！

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```
