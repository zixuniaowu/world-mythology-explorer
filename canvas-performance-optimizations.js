/**
 * Canvas Performance Optimization Module
 * Canvas描画のパフォーマンス最適化モジュール
 */

class CanvasOptimizer {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', {
            alpha: options.alpha !== false,
            desynchronized: options.desynchronized || true,
            willReadFrequently: options.willReadFrequently || false
        });
        
        this.options = {
            enableOffscreenCanvas: options.enableOffscreenCanvas !== false,
            enableImageSmoothing: options.enableImageSmoothing !== false,
            pixelRatio: options.pixelRatio || window.devicePixelRatio || 1,
            frameRate: options.frameRate || 60,
            ...options
        };
        
        this.offscreenCanvas = null;
        this.offscreenCtx = null;
        this.animationId = null;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / this.options.frameRate;
        
        this.setupCanvas();
        this.createOffscreenCanvas();
    }
    
    setupCanvas() {
        // High DPI ディスプレイ対応
        const pixelRatio = this.options.pixelRatio;
        const rect = this.canvas.getBoundingClientRect();
        
        // Canvas のサイズを設定
        this.canvas.width = rect.width * pixelRatio;
        this.canvas.height = rect.height * pixelRatio;
        
        // CSS サイズを維持
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Context のスケーリング
        this.ctx.scale(pixelRatio, pixelRatio);
        
        // 画像スムージングの設定
        this.ctx.imageSmoothingEnabled = this.options.enableImageSmoothing;
        if (this.ctx.imageSmoothingEnabled) {
            this.ctx.imageSmoothingQuality = 'high';
        }
    }
    
    createOffscreenCanvas() {
        if (!this.options.enableOffscreenCanvas) return;
        
        try {
            // OffscreenCanvas をサポートしているかチェック
            if (typeof OffscreenCanvas !== 'undefined') {
                this.offscreenCanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
                this.offscreenCtx = this.offscreenCanvas.getContext('2d');
            } else {
                // フォールバック: 通常の Canvas 要素を使用
                this.offscreenCanvas = document.createElement('canvas');
                this.offscreenCanvas.width = this.canvas.width;
                this.offscreenCanvas.height = this.canvas.height;
                this.offscreenCtx = this.offscreenCanvas.getContext('2d');
            }
            
            this.offscreenCtx.imageSmoothingEnabled = this.options.enableImageSmoothing;
        } catch (error) {
            console.warn('Offscreen canvas not supported:', error);
            this.offscreenCanvas = null;
            this.offscreenCtx = null;
        }
    }
    
    // バッチ描画で複数の要素を効率的に描画
    batchDraw(drawFunction, shouldClear = true) {
        const ctx = this.offscreenCtx || this.ctx;
        
        if (shouldClear) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // 描画状態を保存
        ctx.save();
        
        try {
            drawFunction(ctx);
        } finally {
            // 描画状態を復元
            ctx.restore();
        }
        
        // オフスクリーンからメインキャンバスに転送
        if (this.offscreenCanvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        }
    }
    
    // レイヤード描画システム
    drawLayers(layers) {
        const ctx = this.offscreenCtx || this.ctx;
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // レイヤーを順番に描画
        layers.forEach(layer => {
            if (!layer.visible) return;
            
            ctx.save();
            ctx.globalAlpha = layer.opacity || 1;
            ctx.globalCompositeOperation = layer.blendMode || 'source-over';
            
            if (layer.transform) {
                ctx.setTransform(...layer.transform);
            }
            
            layer.draw(ctx);
            ctx.restore();
        });
        
        // メインキャンバスに転送
        if (this.offscreenCanvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        }
    }
    
    // アニメーション制御
    startAnimation(drawFunction) {
        const animate = (currentTime) => {
            if (currentTime - this.lastFrameTime >= this.frameInterval) {
                drawFunction(currentTime);
                this.lastFrameTime = currentTime;
            }
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    // パフォーマンス測定
    measurePerformance(name, drawFunction) {
        const start = performance.now();
        drawFunction();
        const end = performance.now();
        console.log(`${name}: ${(end - start).toFixed(2)}ms`);
    }
    
    // メモリ最適化
    optimizeMemory() {
        // 不要なイメージデータをクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // ガベージコレクションを促進
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
    }
    
    // リサイズ処理
    resize(width, height) {
        const pixelRatio = this.options.pixelRatio;
        
        this.canvas.width = width * pixelRatio;
        this.canvas.height = height * pixelRatio;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        this.ctx.scale(pixelRatio, pixelRatio);
        this.ctx.imageSmoothingEnabled = this.options.enableImageSmoothing;
        
        // オフスクリーンキャンバスもリサイズ
        if (this.offscreenCanvas) {
            this.offscreenCanvas.width = this.canvas.width;
            this.offscreenCanvas.height = this.canvas.height;
            this.offscreenCtx.imageSmoothingEnabled = this.options.enableImageSmoothing;
        }
    }
    
    // クリーンアップ
    destroy() {
        this.stopAnimation();
        this.optimizeMemory();
        
        if (this.offscreenCanvas) {
            this.offscreenCanvas = null;
            this.offscreenCtx = null;
        }
    }
}

// 世界地図専用の最適化クラス
class WorldMapCanvasOptimizer extends CanvasOptimizer {
    constructor(canvas, options = {}) {
        super(canvas, {
            enableOffscreenCanvas: true,
            enableImageSmoothing: true,
            frameRate: 30, // 地図は30FPSで十分
            ...options
        });
        
        this.mapCache = new Map();
        this.staticLayers = [];
        this.dynamicLayers = [];
        this.isDirty = true;
    }
    
    // マップデータをキャッシュ
    cacheMapData(key, imageData) {
        this.mapCache.set(key, imageData);
    }
    
    // キャッシュされたマップデータを取得
    getCachedMapData(key) {
        return this.mapCache.get(key);
    }
    
    // 静的レイヤーを追加（背景、地形など、変更されないもの）
    addStaticLayer(layer) {
        this.staticLayers.push(layer);
        this.isDirty = true;
    }
    
    // 動的レイヤーを追加（マーカー、アニメーションなど）
    addDynamicLayer(layer) {
        this.dynamicLayers.push(layer);
    }
    
    // 効率的な描画
    render() {
        // 静的レイヤーが変更された場合のみ再描画
        if (this.isDirty) {
            this.renderStaticLayers();
            this.isDirty = false;
        }
        
        // 動的レイヤーは毎回描画
        this.renderDynamicLayers();
    }
    
    renderStaticLayers() {
        const ctx = this.offscreenCtx || this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.staticLayers.forEach(layer => {
            if (layer.visible) {
                ctx.save();
                layer.draw(ctx);
                ctx.restore();
            }
        });
    }
    
    renderDynamicLayers() {
        // 静的レイヤーをメインキャンバスにコピー
        if (this.offscreenCanvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        }
        
        // 動的レイヤーを直接メインキャンバスに描画
        this.dynamicLayers.forEach(layer => {
            if (layer.visible) {
                this.ctx.save();
                layer.draw(this.ctx);
                this.ctx.restore();
            }
        });
    }
    
    // マーカーの効率的な描画
    drawMarkers(markers) {
        // ビューポート内のマーカーのみ描画
        const visibleMarkers = markers.filter(marker => 
            this.isInViewport(marker.x, marker.y)
        );
        
        this.batchDraw((ctx) => {
            visibleMarkers.forEach(marker => {
                this.drawSingleMarker(ctx, marker);
            });
        }, false);
    }
    
    drawSingleMarker(ctx, marker) {
        ctx.save();
        ctx.translate(marker.x, marker.y);
        
        // マーカーの種類に応じた描画
        switch (marker.type) {
            case 'circle':
                this.drawCircleMarker(ctx, marker);
                break;
            case 'icon':
                this.drawIconMarker(ctx, marker);
                break;
            default:
                this.drawDefaultMarker(ctx, marker);
        }
        
        ctx.restore();
    }
    
    drawCircleMarker(ctx, marker) {
        ctx.beginPath();
        ctx.arc(0, 0, marker.radius, 0, Math.PI * 2);
        ctx.fillStyle = marker.color;
        ctx.fill();
        
        if (marker.borderWidth) {
            ctx.strokeStyle = marker.borderColor;
            ctx.lineWidth = marker.borderWidth;
            ctx.stroke();
        }
    }
    
    drawIconMarker(ctx, marker) {
        if (marker.image) {
            ctx.drawImage(marker.image, -marker.width/2, -marker.height/2, marker.width, marker.height);
        }
    }
    
    drawDefaultMarker(ctx, marker) {
        this.drawCircleMarker(ctx, {
            radius: 5,
            color: '#ff6b6b',
            borderWidth: 2,
            borderColor: '#ffffff'
        });
    }
    
    // ビューポート判定
    isInViewport(x, y, margin = 50) {
        return x >= -margin && 
               x <= this.canvas.width + margin && 
               y >= -margin && 
               y <= this.canvas.height + margin;
    }
    
    // メモリ使用量の監視
    getMemoryUsage() {
        const usage = {
            cacheSize: this.mapCache.size,
            staticLayers: this.staticLayers.length,
            dynamicLayers: this.dynamicLayers.length
        };
        
        if (performance.memory) {
            usage.jsHeapSize = performance.memory.usedJSHeapSize;
            usage.totalJSHeapSize = performance.memory.totalJSHeapSize;
            usage.jsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
        }
        
        return usage;
    }
}

// エクスポート
window.CanvasOptimizer = CanvasOptimizer;
window.WorldMapCanvasOptimizer = WorldMapCanvasOptimizer;