// 山海経の章節スタイルのメインメニューシステム
class MainMenuSystem {
    constructor() {
        this.chapters = [
            {
                id: 'eastern_chapter',
                title: '東山経',
                titleJa: 'トウザンキョウ',
                subtitle: '青龍と雷雲の章',
                description: '東方の神山を探索し、雷を操る青龍に出会う。',
                locations: ['eastern_mountains', 'spirit_pond'],
                mainCreature: 'qinglong',
                unlocked: true
            },
            {
                id: 'western_chapter', 
                title: '西山経',
                titleJa: 'セイザンキョウ',
                subtitle: '白虎と金属の章',
                description: '西方の平原で、風を纏う白虎の試練に挑む。',
                locations: ['western_plains', 'treasure_valley'],
                mainCreature: 'baihu',
                unlocked: true
            },
            {
                id: 'southern_chapter',
                title: '南山経',
                titleJa: 'ナンザンキョウ',
                subtitle: '朱雀と炎の章',
                description: '南方の火山で、不死鳥朱雀の炎を求める。',
                locations: ['southern_volcano', 'sacred_mountain'],
                mainCreature: 'zhuque',
                unlocked: false
            },
            {
                id: 'northern_chapter',
                title: '北山経',
                titleJa: 'ホクザンキョウ',
                subtitle: '玄武と水の章',
                description: '北方の湖で、玄武の守る秘密を解き明かす。',
                locations: ['northern_lake'],
                mainCreature: 'xuanwu',
                unlocked: false
            },
            {
                id: 'central_chapter',
                title: '中山経',
                titleJa: 'チュウザンキョウ',
                subtitle: '妖怪と幻の章',
                description: '中央の地で、九尾狐や饕餮などの妖怪と遭遇する。',
                locations: ['mystic_forest', 'dark_cave', 'grassland'],
                mainCreature: 'jiuwei',
                unlocked: false
            }
        ];
    }
    
    // メインメニューのHTMLを生成
    generateMainMenuHTML() {
        return `
            <div id="main-menu-redesign" class="main-menu-container">
                <div class="menu-header">
                    <h1 class="title-japanese">山海経クロニクル</h1>
                    <h2 class="title-chinese">山海經編年史</h2>
                    <p class="subtitle">古代中国の神獣と幻想世界への旅</p>
                </div>
                
                <div class="chapters-scroll">
                    <div class="chapters-container">
                        ${this.chapters.map((chapter, index) => this.generateChapterHTML(chapter, index)).join('')}
                    </div>
                </div>
                
                <div class="menu-footer">
                    <button class="menu-option-btn" onclick="game.showCollection()">
                        <span class="icon">📖</span> 山海図鑑
                    </button>
                    <button class="menu-option-btn" onclick="game.showSettings()">
                        <span class="icon">⚙</span> 設定
                    </button>
                    <button class="menu-option-btn" onclick="game.continueGame()">
                        <span class="icon">💾</span> 続きから
                    </button>
                </div>
            </div>
        `;
    }
    
    // 各章のHTMLを生成
    generateChapterHTML(chapter, index) {
        const locked = !chapter.unlocked;
        const chapterClass = locked ? 'chapter-panel locked' : 'chapter-panel';
        
        return `
            <div class="${chapterClass}" data-chapter="${chapter.id}">
                <div class="chapter-illustration" id="illustration-${chapter.id}">
                    <canvas width="400" height="500"></canvas>
                </div>
                
                <div class="chapter-content">
                    <div class="chapter-header">
                        <h3 class="chapter-number">第${this.toJapaneseNumber(index + 1)}章</h3>
                        <h2 class="chapter-title">${chapter.titleJa}</h2>
                        <p class="chapter-subtitle">${chapter.subtitle}</p>
                    </div>
                    
                    <div class="chapter-description">
                        <p>${locked ? '？？？？？' : chapter.description}</p>
                    </div>
                    
                    <div class="chapter-info">
                        ${locked ? '' : `
                            <div class="location-list">
                                <span class="info-label">探索地域：</span>
                                ${chapter.locations.map(loc => {
                                    const location = LOCATIONS[loc];
                                    return `<span class="location-tag">${location.nameJa}</span>`;
                                }).join(' ')}
                            </div>
                        `}
                    </div>
                    
                    <button class="chapter-start-btn" onclick="game.startChapter('${chapter.id}')" ${locked ? 'disabled' : ''}>
                        ${locked ? '🔒 未解放' : '探索開始 →'}
                    </button>
                </div>
                
                ${locked ? '<div class="lock-overlay">🔒</div>' : ''}
            </div>
        `;
    }
    
    // 数字を日本語に変換
    toJapaneseNumber(num) {
        const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        return numbers[num - 1] || num;
    }
    
    // 章の挿図を描画
    drawChapterIllustrations() {
        this.chapters.forEach(chapter => {
            const container = document.getElementById(`illustration-${chapter.id}`);
            if (container) {
                const canvas = container.querySelector('canvas');
                if (canvas) {
                    this.drawChapterIllustration(canvas, chapter);
                }
            }
        });
    }
    
    // 各章の挿図を描画
    drawChapterIllustration(canvas, chapter) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 背景（巻物風）
        ctx.fillStyle = '#F5E6D3';
        ctx.fillRect(0, 0, width, height);
        
        // 和紙のテクスチャ
        this.addScrollTexture(ctx, width, height);
        
        if (!chapter.unlocked) {
            // ロックされた章
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.font = 'bold 60px serif';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('？', width/2, height/2);
        } else {
            // 章ごとの挿図
            switch(chapter.id) {
                case 'eastern_chapter':
                    this.drawEasternChapter(ctx, width, height);
                    break;
                case 'western_chapter':
                    this.drawWesternChapter(ctx, width, height);
                    break;
                case 'southern_chapter':
                    this.drawSouthernChapter(ctx, width, height);
                    break;
                case 'northern_chapter':
                    this.drawNorthernChapter(ctx, width, height);
                    break;
                case 'central_chapter':
                    this.drawCentralChapter(ctx, width, height);
                    break;
            }
        }
        
        // 装飾的な枠
        this.addChapterBorder(ctx, width, height);
    }
    
    // 東山経の挿図
    drawEasternChapter(ctx, width, height) {
        // 青龍
        ctx.save();
        ctx.translate(width/2, height/3);
        
        // 龍の体
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-100, 0);
        ctx.bezierCurveTo(-50, -50, 50, 50, 100, 0);
        ctx.stroke();
        
        // 雷雲
        ctx.fillStyle = '#4A5568';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-50 + i * 50, -80, 30, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 雷
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(-10, -40);
        ctx.lineTo(10, -40);
        ctx.lineTo(0, -20);
        ctx.stroke();
        
        ctx.restore();
        
        // 章タイトル
        this.drawChapterTitle(ctx, '東山経', width/2, height * 0.8);
    }
    
    // 西山経の挿図
    drawWesternChapter(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 白虎
        ctx.strokeStyle = '#6B7280';
        ctx.lineWidth = 4;
        
        // 体
        ctx.beginPath();
        ctx.ellipse(0, 0, 80, 50, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 縞模様
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(-60 + i * 30, -40);
            ctx.lineTo(-60 + i * 30, 40);
            ctx.stroke();
        }
        
        // 風
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-120, -60 + i * 30);
            ctx.bezierCurveTo(-60, -60 + i * 30 - 10, 60, -60 + i * 30 + 10, 120, -60 + i * 30);
            ctx.stroke();
        }
        
        ctx.restore();
        
        this.drawChapterTitle(ctx, '西山経', width/2, height * 0.8);
    }
    
    // 南山経の挿図
    drawSouthernChapter(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 朱雀
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 4;
        
        // 翼を広げた姿
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.bezierCurveTo(-100, -80, -120, 0, -80, 50);
        ctx.lineTo(0, 30);
        ctx.lineTo(80, 50);
        ctx.bezierCurveTo(120, 0, 100, -80, 0, -50);
        ctx.stroke();
        
        // 炎
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
            const x = -40 + i * 20;
            const y = 60;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(x - 10, y - 20, x + 10, y - 20, x, y - 40);
            ctx.stroke();
        }
        
        ctx.restore();
        
        this.drawChapterTitle(ctx, '南山経', width/2, height * 0.8);
    }
    
    // 北山経の挿図
    drawNorthernChapter(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 玄武（亀と蛇）
        ctx.strokeStyle = '#1E40AF';
        ctx.lineWidth = 4;
        
        // 亀の甲羅
        ctx.beginPath();
        ctx.ellipse(0, 0, 70, 50, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 甲羅の模様
        const hexSize = 20;
        for (let i = -2; i <= 2; i++) {
            for (let j = -1; j <= 1; j++) {
                if (Math.abs(i) + Math.abs(j) <= 2) {
                    this.drawHexagon(ctx, i * hexSize * 1.5, j * hexSize * 1.7, hexSize * 0.8);
                }
            }
        }
        
        // 蛇
        ctx.beginPath();
        ctx.moveTo(60, 0);
        ctx.bezierCurveTo(90, -30, 110, 30, 130, 0);
        ctx.stroke();
        
        ctx.restore();
        
        this.drawChapterTitle(ctx, '北山経', width/2, height * 0.8);
    }
    
    // 中山経の挿図
    drawCentralChapter(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 九尾狐
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 3;
        
        // 体
        ctx.beginPath();
        ctx.ellipse(0, 0, 50, 40, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 九つの尾
        for (let i = 0; i < 9; i++) {
            const angle = (Math.PI / 4) * (i / 9 - 0.5);
            ctx.beginPath();
            ctx.moveTo(40, 0);
            ctx.quadraticCurveTo(
                80 + Math.cos(angle) * 30,
                Math.sin(angle) * 40,
                100 + Math.cos(angle) * 40,
                Math.sin(angle) * 60
            );
            ctx.stroke();
        }
        
        ctx.restore();
        
        this.drawChapterTitle(ctx, '中山経', width/2, height * 0.8);
    }
    
    // 章タイトルを描画
    drawChapterTitle(ctx, title, x, y) {
        ctx.save();
        
        // 背景の帯
        ctx.fillStyle = '#2C1810';
        ctx.fillRect(x - 80, y - 30, 160, 50);
        
        // タイトル
        ctx.font = 'bold 28px serif';
        ctx.fillStyle = '#F5E6D3';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, x, y);
        
        ctx.restore();
    }
    
    // 六角形を描画
    drawHexagon(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // 巻物のテクスチャ
    addScrollTexture(ctx, width, height) {
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.1)';
        ctx.lineWidth = 0.5;
        
        // 縦線
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + (Math.random() - 0.5) * 20, height);
            ctx.stroke();
        }
        
        // 横線
        for (let i = 0; i < 5; i++) {
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y + (Math.random() - 0.5) * 10);
            ctx.stroke();
        }
    }
    
    // 章の枠
    addChapterBorder(ctx, width, height) {
        ctx.strokeStyle = '#2C1810';
        ctx.lineWidth = 3;
        
        // 外枠
        ctx.strokeRect(5, 5, width - 10, height - 10);
        
        // 角の装飾
        const cornerSize = 20;
        const corners = [
            [5, 5], [width - 5, 5],
            [5, height - 5], [width - 5, height - 5]
        ];
        
        ctx.lineWidth = 2;
        corners.forEach(([x, y], i) => {
            // 雲型の装飾
            ctx.beginPath();
            if (i < 2) {
                ctx.arc(x + (i === 0 ? cornerSize : -cornerSize)/2, y + cornerSize/2, cornerSize/2, 0, Math.PI * 2);
            } else {
                ctx.arc(x + (i === 2 ? cornerSize : -cornerSize)/2, y - cornerSize/2, cornerSize/2, 0, Math.PI * 2);
            }
            ctx.stroke();
        });
    }
}

// グローバルに公開
window.mainMenuSystem = new MainMenuSystem();