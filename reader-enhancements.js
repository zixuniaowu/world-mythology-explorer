/**
 * Reader Enhancements Module
 * 読み上げ機能、テーマ切り替えなどの拡張機能
 */

class ReaderEnhancements {
    constructor(options = {}) {
        this.options = {
            enableTextToSpeech: options.enableTextToSpeech !== false,
            enableThemeToggle: options.enableThemeToggle !== false,
            enableReadingProgress: options.enableReadingProgress !== false,
            enableFontSizeControl: options.enableFontSizeControl !== false,
            ...options
        };
        
        this.isReading = false;
        this.currentUtterance = null;
        this.readingQueue = [];
        this.currentTheme = localStorage.getItem('reader-theme') || 'dark';
        this.fontSize = localStorage.getItem('reader-font-size') || '16';
        this.readingSpeed = localStorage.getItem('reading-speed') || '1';
        
        this.init();
    }
    
    init() {
        this.createControlPanel();
        this.setupTextToSpeech();
        this.setupThemeToggle();
        this.setupFontSizeControl();
        this.setupReadingProgress();
        this.applyStoredSettings();
    }
    
    createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'reader-control-panel';
        controlPanel.innerHTML = `
            <div class="control-panel-content">
                <button class="control-btn" id="ttsToggle" title="音声読み上げ切り替え">
                    <span class="icon">🔊</span>
                </button>
                <button class="control-btn" id="themeToggle" title="テーマ切り替え">
                    <span class="icon">🌙</span>
                </button>
                <div class="font-size-control">
                    <button class="control-btn" id="fontDecrease" title="文字サイズを小さく">
                        <span class="icon">A-</span>
                    </button>
                    <span class="font-size-display" id="fontSizeDisplay">${this.fontSize}px</span>
                    <button class="control-btn" id="fontIncrease" title="文字サイズを大きく">
                        <span class="icon">A+</span>
                    </button>
                </div>
                <div class="speed-control">
                    <label for="speedSlider">読み上げ速度:</label>
                    <input type="range" id="speedSlider" min="0.5" max="2" step="0.1" value="${this.readingSpeed}">
                    <span id="speedDisplay">${this.readingSpeed}x</span>
                </div>
                <div class="reading-progress" id="readingProgress">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(controlPanel);
        this.addControlPanelStyles();
        this.bindControlEvents();
    }
    
    addControlPanelStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .reader-control-panel {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 15px 10px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
            }
            
            .reader-control-panel:hover {
                background: rgba(0, 0, 0, 0.9);
            }
            
            .control-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 8px 12px;
                color: #fff;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                min-width: 50px;
            }
            
            .control-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.05);
            }
            
            .control-btn.active {
                background: rgba(74, 144, 226, 0.8);
                border-color: #4a90e2;
            }
            
            .font-size-control {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .font-size-display {
                color: #fff;
                font-size: 12px;
                min-width: 35px;
                text-align: center;
            }
            
            .speed-control {
                display: flex;
                flex-direction: column;
                gap: 5px;
                font-size: 12px;
                color: #fff;
            }
            
            .speed-control label {
                font-size: 10px;
                opacity: 0.8;
            }
            
            #speedSlider {
                width: 80px;
            }
            
            #speedDisplay {
                font-size: 10px;
                text-align: center;
                opacity: 0.8;
            }
            
            .reading-progress {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
                margin-top: 10px;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #4a90e2, #74b9ff);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            /* テーマ切り替え */
            body.light-theme {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                color: #333;
            }
            
            body.light-theme .story-section,
            body.light-theme .episode-card,
            body.light-theme .character-card {
                background: rgba(255, 255, 255, 0.9);
                color: #333;
            }
            
            body.light-theme .section-title,
            body.light-theme .episode-title,
            body.light-theme .character-name {
                color: #2c3e50;
            }
            
            body.light-theme .story-text,
            body.light-theme .episode-content,
            body.light-theme .character-description {
                color: #555;
            }
            
            /* レスポンシブ */
            @media (max-width: 768px) {
                .reader-control-panel {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    top: auto;
                    transform: none;
                    flex-direction: row;
                    flex-wrap: wrap;
                    max-width: calc(100vw - 40px);
                }
                
                .speed-control {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    bindControlEvents() {
        // 音声読み上げ切り替え
        document.getElementById('ttsToggle').addEventListener('click', () => {
            this.toggleTextToSpeech();
        });
        
        // テーマ切り替え
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // フォントサイズ制御
        document.getElementById('fontDecrease').addEventListener('click', () => {
            this.adjustFontSize(-2);
        });
        
        document.getElementById('fontIncrease').addEventListener('click', () => {
            this.adjustFontSize(2);
        });
        
        // 読み上げ速度制御
        const speedSlider = document.getElementById('speedSlider');
        speedSlider.addEventListener('input', (e) => {
            this.readingSpeed = e.target.value;
            document.getElementById('speedDisplay').textContent = this.readingSpeed + 'x';
            localStorage.setItem('reading-speed', this.readingSpeed);
        });
    }
    
    setupTextToSpeech() {
        if (!this.options.enableTextToSpeech || !window.speechSynthesis) return;
        
        // 読み上げ可能なテキスト要素をクリック可能にする
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, .story-text, .episode-content').forEach(element => {
            element.style.cursor = 'pointer';
            element.title = 'クリックして読み上げ';
            
            element.addEventListener('click', (e) => {
                if (!this.isReading) {
                    this.speakText(element.textContent);
                    element.classList.add('reading-highlight');
                }
            });
        });
    }
    
    speakText(text) {
        if (!window.speechSynthesis) {
            alert('お使いのブラウザは音声読み上げ機能をサポートしていません。');
            return;
        }
        
        // 既存の読み上げを停止
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = parseFloat(this.readingSpeed);
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => {
            this.isReading = true;
            document.getElementById('ttsToggle').classList.add('active');
        };
        
        utterance.onend = () => {
            this.isReading = false;
            document.getElementById('ttsToggle').classList.remove('active');
            document.querySelectorAll('.reading-highlight').forEach(el => {
                el.classList.remove('reading-highlight');
            });
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isReading = false;
            document.getElementById('ttsToggle').classList.remove('active');
        };
        
        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
    }
    
    toggleTextToSpeech() {
        if (this.isReading) {
            window.speechSynthesis.cancel();
            this.isReading = false;
            document.getElementById('ttsToggle').classList.remove('active');
        } else {
            // ページ全体を読み上げ
            this.readEntirePage();
        }
    }
    
    readEntirePage() {
        const textElements = document.querySelectorAll('.story-text p, .episode-content, .character-description');
        const textArray = Array.from(textElements).map(el => el.textContent.trim()).filter(text => text.length > 0);
        
        if (textArray.length === 0) return;
        
        this.readingQueue = textArray;
        this.readNextInQueue();
    }
    
    readNextInQueue() {
        if (this.readingQueue.length === 0) {
            this.isReading = false;
            document.getElementById('ttsToggle').classList.remove('active');
            return;
        }
        
        const text = this.readingQueue.shift();
        this.speakText(text);
        
        // 次のテキストを読み上げるためのイベントリスナー
        this.currentUtterance.onend = () => {
            setTimeout(() => this.readNextInQueue(), 500);
        };
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.className = this.currentTheme === 'light' ? 'light-theme' : '';
        
        const themeIcon = document.querySelector('#themeToggle .icon');
        themeIcon.textContent = this.currentTheme === 'light' ? '☀️' : '🌙';
        
        localStorage.setItem('reader-theme', this.currentTheme);
    }
    
    adjustFontSize(delta) {
        this.fontSize = Math.max(12, Math.min(24, parseInt(this.fontSize) + delta));
        document.getElementById('fontSizeDisplay').textContent = this.fontSize + 'px';
        
        // フォントサイズを適用
        document.querySelectorAll('.story-text, .episode-content, .character-description, p').forEach(element => {
            element.style.fontSize = this.fontSize + 'px';
        });
        
        localStorage.setItem('reader-font-size', this.fontSize);
    }
    
    setupReadingProgress() {
        if (!this.options.enableReadingProgress) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            
            document.getElementById('progressBar').style.width = Math.min(100, Math.max(0, progress)) + '%';
        });
    }
    
    applyStoredSettings() {
        // テーマを適用
        if (this.currentTheme === 'light') {
            document.body.className = 'light-theme';
            document.querySelector('#themeToggle .icon').textContent = '☀️';
        }
        
        // フォントサイズを適用
        this.adjustFontSize(0);
        
        // 読み上げ速度を適用
        document.getElementById('speedDisplay').textContent = this.readingSpeed + 'x';
    }
    
    // 読み上げハイライト用のスタイル
    addReadingHighlightStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .reading-highlight {
                background: rgba(74, 144, 226, 0.3);
                border-radius: 4px;
                padding: 2px 4px;
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // クリーンアップ
    destroy() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        const controlPanel = document.querySelector('.reader-control-panel');
        if (controlPanel) {
            controlPanel.remove();
        }
    }
}

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
    // 読み上げページかどうかを判定
    if (document.querySelector('.story-text, .episode-content, .character-description')) {
        window.readerEnhancements = new ReaderEnhancements({
            enableTextToSpeech: true,
            enableThemeToggle: true,
            enableReadingProgress: true,
            enableFontSizeControl: true
        });
    }
});

// グローバルに公開
window.ReaderEnhancements = ReaderEnhancements;