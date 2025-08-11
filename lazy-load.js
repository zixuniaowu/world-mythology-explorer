/**
 * Lazy Loading Image Module
 * 画像の遅延読み込みを実装するモジュール
 */

class LazyLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: options.rootMargin || '50px 0px',
            threshold: options.threshold || 0.01,
            loadingClass: options.loadingClass || 'loading',
            loadedClass: options.loadedClass || 'loaded',
            errorClass: options.errorClass || 'error',
            ...options
        };
        
        this.imageObserver = null;
        this.init();
    }
    
    init() {
        // Intersection Observer APIをサポートしているかチェック
        if (!('IntersectionObserver' in window)) {
            this.loadImagesImmediately();
            return;
        }
        
        // Observerを作成
        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold
        });
        
        // 既存の画像を監視
        this.observeImages();
    }
    
    observeImages() {
        // data-src属性を持つ全ての画像を取得
        const lazyImages = document.querySelectorAll('img[data-src], picture source[data-srcset]');
        
        lazyImages.forEach(image => {
            // プレースホルダーを設定
            if (image.tagName === 'IMG' && !image.src) {
                image.src = this.generatePlaceholder(image);
            }
            
            // 画像にloadingクラスを追加
            image.classList.add(this.options.loadingClass);
            
            // 監視を開始
            this.imageObserver.observe(image);
        });
    }
    
    loadImage(image) {
        const imageLoader = new Image();
        
        // エラーハンドリング
        imageLoader.onerror = () => {
            image.classList.remove(this.options.loadingClass);
            image.classList.add(this.options.errorClass);
            
            // エラー時のフォールバック画像を設定
            if (image.tagName === 'IMG') {
                image.src = this.generateErrorPlaceholder();
            }
        };
        
        // 読み込み成功時の処理
        imageLoader.onload = () => {
            if (image.tagName === 'IMG') {
                image.src = imageLoader.src;
                // srcset対応
                if (image.dataset.srcset) {
                    image.srcset = image.dataset.srcset;
                }
            } else if (image.tagName === 'SOURCE') {
                image.srcset = image.dataset.srcset;
            }
            
            // フェードインアニメーション
            image.classList.remove(this.options.loadingClass);
            image.classList.add(this.options.loadedClass);
            
            // データ属性をクリーンアップ
            delete image.dataset.src;
            delete image.dataset.srcset;
        };
        
        // 画像の読み込みを開始
        if (image.tagName === 'IMG') {
            imageLoader.src = image.dataset.src;
        } else if (image.tagName === 'SOURCE' && image.dataset.srcset) {
            image.srcset = image.dataset.srcset;
            image.classList.remove(this.options.loadingClass);
            image.classList.add(this.options.loadedClass);
            delete image.dataset.srcset;
        }
    }
    
    generatePlaceholder(image) {
        // データURIでシンプルなプレースホルダーを生成
        const width = image.getAttribute('width') || 100;
        const height = image.getAttribute('height') || 100;
        
        // 透明なSVGプレースホルダー
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E`;
    }
    
    generateErrorPlaceholder() {
        // エラー時のプレースホルダー画像
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='sans-serif' font-size='14'%3EError%3C/text%3E%3C/svg%3E`;
    }
    
    loadImagesImmediately() {
        // Intersection Observerがサポートされていない場合の代替処理
        const lazyImages = document.querySelectorAll('img[data-src], picture source[data-srcset]');
        
        lazyImages.forEach(image => {
            if (image.tagName === 'IMG' && image.dataset.src) {
                image.src = image.dataset.src;
                if (image.dataset.srcset) {
                    image.srcset = image.dataset.srcset;
                }
            } else if (image.tagName === 'SOURCE' && image.dataset.srcset) {
                image.srcset = image.dataset.srcset;
            }
            
            image.classList.add(this.options.loadedClass);
            delete image.dataset.src;
            delete image.dataset.srcset;
        });
    }
    
    // 新しい画像が動的に追加された場合の処理
    refresh() {
        if (this.imageObserver) {
            this.observeImages();
        } else {
            this.loadImagesImmediately();
        }
    }
    
    // クリーンアップ
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// CSS スタイルを自動的に追加
const style = document.createElement('style');
style.textContent = `
    img.loading {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    img.error {
        opacity: 0.5;
        filter: grayscale(100%);
    }
    
    /* プレースホルダーのぼかし効果 */
    img[data-src] {
        filter: blur(5px);
        transition: filter 0.3s ease-in-out;
    }
    
    img.loaded {
        filter: none;
    }
`;
document.head.appendChild(style);

// 自動初期化
let lazyLoader;

document.addEventListener('DOMContentLoaded', () => {
    lazyLoader = new LazyLoader({
        rootMargin: '100px 0px',
        threshold: 0.01
    });
});

// グローバルに公開
window.LazyLoader = LazyLoader;
window.lazyLoader = lazyLoader;