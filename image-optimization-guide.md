# 画像最適化ガイド

## 概要
このプロジェクトで画像を使用する際の最適化ガイドラインです。

## 遅延読み込みの実装

### 1. HTMLでの使用方法

```html
<!-- 通常の画像 -->
<img data-src="path/to/image.jpg" 
     alt="画像の説明" 
     width="800" 
     height="600"
     class="lazy">

<!-- レスポンシブ画像 -->
<img data-src="path/to/image.jpg"
     data-srcset="path/to/image-small.jpg 400w,
                  path/to/image-medium.jpg 800w,
                  path/to/image-large.jpg 1200w"
     sizes="(max-width: 400px) 100vw, 
            (max-width: 800px) 50vw, 
            33vw"
     alt="画像の説明"
     class="lazy">

<!-- picture要素での使用 -->
<picture>
  <source media="(min-width: 800px)" 
          data-srcset="large.webp" 
          type="image/webp">
  <source media="(min-width: 400px)" 
          data-srcset="medium.webp" 
          type="image/webp">
  <img data-src="fallback.jpg" 
       alt="画像の説明" 
       class="lazy">
</picture>
```

### 2. JavaScriptの設定

ページに以下を追加：

```html
<script src="lazy-load.js"></script>
```

### 3. カスタマイズオプション

```javascript
// カスタム設定で初期化
const lazyLoader = new LazyLoader({
    rootMargin: '100px 0px',  // 画像が表示される100px前から読み込み開始
    threshold: 0.01,          // 1%表示されたら読み込み開始
    loadingClass: 'loading',  // 読み込み中のクラス
    loadedClass: 'loaded',    // 読み込み完了時のクラス
    errorClass: 'error'       // エラー時のクラス
});
```

## 画像フォーマットの推奨事項

### 1. WebP形式の使用

WebPは高品質で小さいファイルサイズを実現できます：

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="フォールバック画像">
</picture>
```

### 2. 適切なサイズの提供

デバイスに応じた画像サイズを提供：

- モバイル: 最大 800px
- タブレット: 最大 1200px
- デスクトップ: 最大 1920px

### 3. 画像の圧縮

- JPEG: 品質 85%
- PNG: TinyPNGなどで圧縮
- WebP: 品質 80-90%

## パフォーマンスのベストプラクティス

### 1. Critical Images

ファーストビューに表示される重要な画像は遅延読み込みしない：

```html
<!-- ヒーロー画像などは通常通り読み込む -->
<img src="hero-image.jpg" alt="重要な画像" loading="eager">
```

### 2. プレースホルダー

読み込み中の表示を改善：

```css
.lazy {
    background: #f0f0f0;
    min-height: 200px;
}
```

### 3. アスペクト比の維持

レイアウトシフトを防ぐ：

```css
.image-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
}

.image-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

## 実装例

### 神話カードの画像最適化

```html
<div class="mythology-card">
  <div class="card-image">
    <img data-src="mythology/greek-gods.jpg"
         data-srcset="mythology/greek-gods-small.jpg 400w,
                      mythology/greek-gods-medium.jpg 800w,
                      mythology/greek-gods-large.jpg 1200w"
         sizes="(max-width: 600px) 100vw, 
                (max-width: 1200px) 50vw, 
                400px"
         alt="ギリシャ神話の神々"
         class="lazy"
         width="400"
         height="300">
  </div>
  <div class="card-content">
    <h3>ギリシャ神話</h3>
    <p>オリュンポスの神々の物語</p>
  </div>
</div>
```

## 測定とモニタリング

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: 2.5秒以内
- **CLS (Cumulative Layout Shift)**: 0.1以下
- **FID (First Input Delay)**: 100ms以内

### 確認ツール

- Chrome DevTools の Lighthouse
- PageSpeed Insights
- WebPageTest

## トラブルシューティング

### 画像が表示されない

1. `data-src`属性が正しく設定されているか確認
2. 画像のパスが正しいか確認
3. コンソールエラーを確認

### レイアウトシフト

1. 画像に`width`と`height`属性を設定
2. アスペクト比を維持するCSSを使用

### パフォーマンスが改善されない

1. 画像のファイルサイズを確認
2. 適切な画像フォーマットを使用
3. CDNの使用を検討