# 自动发布指南

本项目已配置 GitHub Actions 自动发布到 npm。

## 设置步骤

### 1. 配置 NPM Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 进入 Account Settings → Access Tokens
3. 创建新的 **Granular Access Token** 或 **Classic Token**
4. 复制 Token 值

### 2. 添加 Secret 到 GitHub

1. 打开 GitHub 仓库页面
2. 进入 Settings → Secrets and variables → Actions
3. 点击 **New repository secret**
4. 名称填写：`NPM_TOKEN`
5. 值填写：刚才复制的 npm token
6. 点击 **Add secret**

### 3. 确保 package.json 中的 name 正确

```json
{
  "name": "@your-username/vue-log-viewer"
}
```

如果是 scoped package（@username/pkg），首次发布需要 `--access public`。

## 发布方式

### 方式一：通过 GitHub Release 发布（推荐）

1. 进入 GitHub 仓库 → Releases
2. 点击 **Draft a new release**
3. 选择或输入新标签（如 `v0.1.0`）
4. 填写 Release 标题和说明
5. 点击 **Publish release**
6. 自动触发发布到 npm

### 方式二：通过 Workflow Dispatch 发布

1. 进入 GitHub 仓库 → Actions → Publish to NPM
2. 点击 **Run workflow**
3. 选择版本类型：
   - `patch` - 补丁版本 (0.0.1 → 0.0.2)
   - `minor` - 次要版本 (0.0.1 → 0.1.0)
   - `major` - 主要版本 (0.0.1 → 1.0.0)
   - 或直接输入具体版本号如 `0.2.0-beta.1`
4. 点击 **Run workflow**
5. 自动完成：版本更新 → 发布到 npm → 创建 Git tag → 创建 Release

### 方式三：本地手动发布

```bash
# 更新版本
npm version patch  # 或 minor/major

# 推送 tag 触发发布
git push origin main --follow-tags
```

## 工作流说明

| 工作流 | 触发条件 | 功能 |
|--------|----------|------|
| **CI** | push 到 main/PR | 构建测试 |
| **Publish** | Release 创建 / 手动触发 | 发布到 npm |
| **Release** | push tag v* | 创建 GitHub Release |

## 发布检查清单

- [ ] 代码已提交并推送到 main 分支
- [ ] package.json 中的版本号正确
- [ ] NPM_TOKEN 已添加到 GitHub Secrets
- [ ] 构建成功无错误
- [ ] 版本 tag 遵循语义化版本（SemVer）

## 故障排查

### 发布失败：401 Unauthorized
- 检查 NPM_TOKEN 是否正确
- 检查 Token 是否过期
- 确认 npm 账户有发布权限

### 发布失败：403 Forbidden
- 包名可能已被占用
- scoped package 需要 `--access public`
- 检查 npm 账户是否已验证邮箱

### 发布失败：版本已存在
- npm 不允许重复发布相同版本
- 需要先更新版本号再发布
