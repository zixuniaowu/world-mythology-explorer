# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**World Mythology Explorer** - 世界神話探索者
一個交互式的世界神話地圖探索網站，使用HTML/CSS/JavaScript構建，展示世界各地的神話體系。

## 🌟 Current Features (已完成功能)

### ✅ Core Functionality
- **交互式世界地圖**: 使用Canvas繪製的風格化世界地圖
- **神話標記系統**: 各地區神話用泡泡標記顯示在地圖上
- **多神話體系支持**: 
  - 東亞神話 (中國、日本)
  - 南亞神話 (印度)
  - 歐洲神話 (希臘、北歐)
  - 中東神話 (美索不達米亞)
  - 非洲神話 (埃及)
  - 美洲神話 (阿茲特克、瑪雅、原住民)
  - 大洋洲神話 (澳洲原住民、波利尼西亞)

### ✅ UI/UX Features
- **分類過濾系統**: 點擊分類標籤過濾顯示特定地區神話
- **響應式設計**: 桌面端和手機端優化
- **搜索功能**: 搜索框支持神話名稱搜索
- **動畫效果**: 
  - 泡泡浮動動畫
  - 過濾時的交錯動畫
  - 懸停和點擊效果
- **粒子背景**: 飄浮的星空粒子效果

### ✅ Technical Implementation
- **純HTML/CSS/JavaScript**: 無框架依賴
- **Canvas繪圖**: 自定義世界地圖渲染
- **流暢動畫**: 使用CSS3和JavaScript動畫
- **手機端優化**: 
  - 泡泡尺寸調整避免重疊
  - 增加點擊區域提升可點擊性
  - 響應式布局

### ✅ Deployment & Testing
- **GitHub集成**: 自動化Git工作流
- **Cloudflare Pages**: 自動部署配置
- **E2E測試工具**: 手機端測試工具 (mobile-test.html)
- **測試腳本**: Puppeteer自動化測試

## 🚧 Pending Tasks (待完成任務)

### 高優先級
1. **神話內容頁面完善**
   - 完善各神話體系的詳細頁面內容
   - 添加更多神話故事和角色介紹
   - 優化現有神話閱讀器的用戶體驗

2. **多語言支持完善**
   - 目前主要支持日語界面
   - 添加完整的中文和英文語言切換
   - 統一所有頁面的多語言支持

3. **性能優化**
   - 圖片資源優化和懶加載
   - Canvas渲染性能優化
   - 移動端性能提升

### 中優先級
4. **內容管理**
   - 添加更多神話體系 (凱爾特、斯拉夫等)
   - 神話之間的關聯性展示
   - 神話角色數據庫完善

5. **交互功能增強**
   - 神話故事音頻支持
   - 更多動畫和視覺效果
   - 用戶收藏功能

6. **SEO和可訪問性**
   - Meta標籤優化
   - 無障礙功能支持
   - 搜索引擎優化

### 低優先級
7. **高級功能**
   - 用戶評論系統
   - 社交分享功能
   - 神話測驗遊戲

## 📁 Project Structure

```
/
├── index.html                 # 主頁面 - 交互式地圖
├── *-mythology-index.html     # 各神話體系索引頁
├── *-reader.html             # 神話故事閱讀器
├── *-game.html               # 神話互動遊戲
├── *-animation.html          # 神話動畫展示
├── mythology_texts/          # 神話文本資源
├── *_images/                 # 圖片資源
├── *.css                     # 樣式文件
├── *.js                      # JavaScript功能文件
├── mobile-test.html          # 手機端測試工具
├── e2e-mobile-test.js        # E2E測試腳本
├── .github/workflows/        # GitHub Actions配置
└── wrangler.toml            # Cloudflare配置
```

## 🛠 Development Commands

### 本地開發
```bash
# 啟動本地服務器
python3 -m http.server 8000

# 訪問主頁面
http://localhost:8000

# 手機端測試
http://localhost:8000/mobile-test.html
```

### 測試
```bash
# 運行E2E測試 (需要Puppeteer)
node e2e-mobile-test.js

# 手動測試使用瀏覽器打開
# mobile-test.html - 可視化測試工具
```

### 部署
```bash
# 提交更改
git add .
git commit -m "描述更改"
git push origin main

# 自動部署到Cloudflare Pages
# 無需手動操作，推送後自動觸發
```

## 🎯 Key Development Patterns

### CSS組織
- 使用CSS自定義屬性進行主題化
- 響應式設計使用媒體查詢
- 動畫使用CSS3 transition和transform

### JavaScript架構
- 模塊化函數設計
- 事件驅動的交互邏輯
- Canvas API用於自定義圖形渲染

### 性能考慮
- 最小化重排和重繪
- 使用requestAnimationFrame進行動畫
- 事件委託減少內存使用

## 🌐 Live Site
- **主站**: https://world-mythology-explorer.pages.dev
- **GitHub**: https://github.com/zixuniaowu/world-mythology-explorer

## 📝 Notes for Future Development

1. **代碼質量**: 保持函數簡潔，註釋清晰
2. **用戶體驗**: 優先考慮手機端體驗
3. **性能**: 注意圖片和動畫的性能影響
4. **可維護性**: 保持CSS和JavaScript的模塊化結構
5. **多語言**: 新功能需要考慮多語言支持

當添加新功能時，請更新此文件以反映項目的當前狀態。