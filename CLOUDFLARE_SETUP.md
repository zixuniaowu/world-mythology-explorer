# Cloudflare Pages 自動部署設置

## 步驟 1: 在 Cloudflare Pages 中連接 GitHub 倉庫

1. 登錄到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 選擇 "Pages" 
3. 點擊 "Create a project"
4. 選擇 "Connect to Git"
5. 授權 Cloudflare 訪問你的 GitHub 賬戶
6. 選擇 `world-mythology-explorer` 倉庫
7. 配置構建設置：
   - Framework preset: None
   - Build command: （留空）
   - Build output directory: /
   - Root directory: /

## 步驟 2: 設置 GitHub Secrets（可選，如果使用 GitHub Actions）

如果你想使用 GitHub Actions 進行部署，需要在 GitHub 倉庫中設置以下 secrets：

1. 進入 GitHub 倉庫的 Settings > Secrets and variables > Actions
2. 添加以下 secrets：
   - `CLOUDFLARE_API_TOKEN`: 從 Cloudflare 獲取的 API Token
   - `CLOUDFLARE_ACCOUNT_ID`: 你的 Cloudflare Account ID

### 獲取 Cloudflare API Token:
1. 登錄 Cloudflare Dashboard
2. 進入 My Profile > API Tokens
3. 點擊 "Create Token"
4. 使用 "Cloudflare Pages - Edit" 模板
5. 複製生成的 token

### 獲取 Account ID:
1. 在 Cloudflare Dashboard 右側找到 Account ID
2. 複製這個 ID

## 自動部署

設置完成後，每次推送到 `main` 分支時，會自動觸發部署：
- 如果使用 Cloudflare Pages 直接連接：Cloudflare 會自動檢測並部署
- 如果使用 GitHub Actions：會通過 workflow 文件觸發部署

## 訪問你的網站

部署成功後，你的網站會在以下地址可用：
- `https://world-mythology-explorer.pages.dev`
- 或者你設置的自定義域名