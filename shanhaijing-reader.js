// 山海経リーダーシステム
class ShanhaijingReader {
    constructor() {
        this.currentChapter = null;
        this.illustrationSystem = window.illustrationSystem || null;
        this.traditionalIllustrations = window.traditionalIllustrations || null;
        this.init();
    }
    
    init() {
        console.log('ShanhaijingReader初期化開始');
        console.log('SHANHAIJING_TEXTS:', typeof SHANHAIJING_TEXTS !== 'undefined' ? 'OK' : 'NG');
        console.log('illustrationSystem:', this.illustrationSystem ? 'OK' : 'NG');
        
        // 最初の章を表示
        this.showChapter('eastern_chapter');
    }
    
    showChapter(chapterId) {
        console.log('showChapter called with:', chapterId);
        this.currentChapter = chapterId;
        
        if (typeof SHANHAIJING_TEXTS === 'undefined') {
            console.error('SHANHAIJING_TEXTSが定義されていません');
            return;
        }
        
        const chapterData = SHANHAIJING_TEXTS[chapterId];
        
        if (!chapterData) {
            console.error('章が見つかりません:', chapterId);
            console.log('利用可能な章:', Object.keys(SHANHAIJING_TEXTS));
            return;
        }
        
        console.log('章データ取得成功:', chapterData.title);
        
        // ナビゲーションボタンの状態を更新
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.onclick && btn.onclick.toString().includes(chapterId)) {
                btn.classList.add('active');
            }
        });
        
        // コンテンツエリアをクリア
        const contentArea = document.getElementById('content-area');
        if (!contentArea) {
            console.error('content-areaが見つかりません');
            return;
        }
        
        console.log('コンテンツエリアをクリア');
        contentArea.innerHTML = '';
        
        // 章を作成
        console.log('章要素を作成中...');
        const chapterElement = this.createChapterElement(chapterData);
        contentArea.appendChild(chapterElement);
        console.log('章要素を追加完了');
        
        // 各セクションの挿図を描画
        setTimeout(() => {
            this.drawSectionIllustrations(chapterId, chapterData.sections);
        }, 100);
    }
    
    createChapterElement(chapterData) {
        try {
            const chapter = document.createElement('div');
            chapter.className = 'chapter';
            
            // 章ヘッダー
            const header = document.createElement('div');
            header.className = 'chapter-header';
            header.innerHTML = `
                <h2 class="chapter-title">${chapterData.titleJa}（${chapterData.title}）</h2>
                <p class="chapter-subtitle">${chapterData.subtitle}</p>
            `;
            chapter.appendChild(header);
            
            // 各セクションを作成
            chapterData.sections.forEach((section, index) => {
                const sectionElement = this.createSectionElement(section, index + 1);
                chapter.appendChild(sectionElement);
            });
            
            return chapter;
        } catch (error) {
            console.error('createChapterElementでエラー:', error);
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `<p style="color: red;">エラーが発生しました: ${error.message}</p>`;
            return errorDiv;
        }
    }
    
    createSectionElement(section, number) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        
        // セクションヘッダー
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = `
            <div class="section-number">${number}</div>
            <h3 class="section-title">${section.title}</h3>
        `;
        sectionDiv.appendChild(header);
        
        // 挿図コンテナ
        const illustrationContainer = document.createElement('div');
        illustrationContainer.className = 'illustration-container';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'illustration';
        canvas.id = `illustration-${section.id}`;
        canvas.width = 800;
        canvas.height = 400;
        illustrationContainer.appendChild(canvas);
        
        sectionDiv.appendChild(illustrationContainer);
        
        // テキストコンテンツ
        const textContent = document.createElement('div');
        textContent.className = 'text-content';
        
        // 原文と翻訳
        const textRow = document.createElement('div');
        textRow.className = 'text-row';
        
        // 原文列
        const originalColumn = document.createElement('div');
        originalColumn.className = 'text-column';
        originalColumn.innerHTML = `
            <span class="text-label">原文</span>
            <p class="original-text">${section.original}</p>
        `;
        textRow.appendChild(originalColumn);
        
        // 日本語訳列
        const translationColumn = document.createElement('div');
        translationColumn.className = 'text-column';
        translationColumn.innerHTML = `
            <span class="text-label">書き下し文</span>
            <p class="translation-text">${section.translation}</p>
        `;
        textRow.appendChild(translationColumn);
        
        textContent.appendChild(textRow);
        
        // 現代日本語訳
        const japaneseDiv = document.createElement('div');
        japaneseDiv.className = 'japanese-text';
        japaneseDiv.innerHTML = `
            <span class="text-label">現代日本語訳</span>
            ${section.japanese}
        `;
        textContent.appendChild(japaneseDiv);
        
        // 注釈
        if (section.notes) {
            const notes = document.createElement('div');
            notes.className = 'notes';
            notes.textContent = section.notes;
            textContent.appendChild(notes);
        }
        
        sectionDiv.appendChild(textContent);
        
        return sectionDiv;
    }
    
    drawSectionIllustrations(chapterId, sections) {
        sections.forEach(section => {
            const canvas = document.getElementById(`illustration-${section.id}`);
            if (canvas && this.illustrationSystem) {
                const ctx = canvas.getContext('2d');
                
                // 背景
                ctx.fillStyle = '#F5E6D3';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // セクションに応じた挿図を描画
                this.drawSectionSpecificIllustration(ctx, canvas.width, canvas.height, chapterId, section);
                
                // 装飾枠
                this.addIllustrationFrame(ctx, canvas.width, canvas.height);
            }
        });
    }
    
    drawSectionSpecificIllustration(ctx, width, height, chapterId, section) {
        // 和紙のテクスチャ
        this.addPaperTexture(ctx, width, height);
        
        // セクションIDに基づいて挿図を描画
        switch(section.id) {
            // 東山経
            case 'east_1':
                this.drawQinglong(ctx, width, height);
                break;
            case 'east_2':
                this.drawThunderBeast(ctx, width, height);
                break;
            case 'east_3':
                this.drawFusangTree(ctx, width, height);
                break;
                
            // 西山経
            case 'west_1':
                this.drawBaihu(ctx, width, height);
                break;
            case 'west_2':
                this.drawPixiu(ctx, width, height);
                break;
            case 'west_3':
                this.drawWindBird(ctx, width, height);
                break;
                
            // 南山経
            case 'south_1':
                this.drawZhuque(ctx, width, height);
                break;
            case 'south_2':
                this.drawFireBeast(ctx, width, height);
                break;
            case 'south_3':
                this.drawFenghuang(ctx, width, height);
                break;
                
            // 北山経
            case 'north_1':
                this.drawXuanwu(ctx, width, height);
                break;
            case 'north_2':
                this.drawSnowBeast(ctx, width, height);
                break;
            case 'north_3':
                this.drawMysticFish(ctx, width, height);
                break;
                
            // 中山経
            case 'central_1':
                this.drawNineTailFox(ctx, width, height);
                break;
            case 'central_2':
                this.drawTaotie(ctx, width, height);
                break;
            case 'central_3':
                this.drawQilin(ctx, width, height);
                break;
        }
    }
    
    // 青龍の挿図
    drawQinglong(ctx, width, height) {
        if (this.traditionalIllustrations) {
            this.traditionalIllustrations.drawQinglong(ctx, width, height);
            return;
        }
        
        // フォールバック
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 山脈
        ctx.strokeStyle = '#2C1810';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-300, 100);
        ctx.lineTo(-150, -50);
        ctx.lineTo(0, 20);
        ctx.lineTo(150, -80);
        ctx.lineTo(300, 100);
        ctx.stroke();
        
        // 雲
        ctx.strokeStyle = '#4A4A4A';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-200 + i * 200, -100, 30, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 青龍
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-150, -20);
        ctx.bezierCurveTo(-100, -80, 0, -80, 50, -20);
        ctx.bezierCurveTo(100, 40, 150, 40, 200, -20);
        ctx.stroke();
        
        // 龍の頭
        ctx.beginPath();
        ctx.arc(200, -20, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        // 角
        ctx.beginPath();
        ctx.moveTo(190, -35);
        ctx.lineTo(185, -50);
        ctx.moveTo(210, -35);
        ctx.lineTo(215, -50);
        ctx.stroke();
        
        // 髭
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(220, -20);
        ctx.quadraticCurveTo(240, -25, 250, -15);
        ctx.moveTo(220, -15);
        ctx.quadraticCurveTo(240, -10, 250, -20);
        ctx.stroke();
        
        // 鱗
        for (let i = 0; i < 8; i++) {
            const x = -120 + i * 40;
            const y = -20 + Math.sin(i * 0.5) * 30;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI, true);
            ctx.stroke();
        }
        
        // 雷
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -120);
        ctx.lineTo(-10, -100);
        ctx.lineTo(10, -100);
        ctx.lineTo(0, -80);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 白虎の挿図
    drawBaihu(ctx, width, height) {
        if (this.traditionalIllustrations) {
            this.traditionalIllustrations.drawBaihu(ctx, width, height);
            return;
        }
        
        // フォールバック
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 平原の地平線
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-350, 50);
        ctx.lineTo(350, 50);
        ctx.stroke();
        
        // 白虎
        ctx.strokeStyle = '#2C1810';
        ctx.lineWidth = 4;
        
        // 体
        ctx.beginPath();
        ctx.ellipse(0, 0, 100, 60, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 縞模様
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(-80 + i * 30, -50);
            ctx.lineTo(-80 + i * 30, 50);
            ctx.stroke();
        }
        
        // 頭
        ctx.beginPath();
        ctx.arc(-100, -20, 40, 0, Math.PI * 2);
        ctx.stroke();
        
        // 翼
        ctx.beginPath();
        ctx.moveTo(50, -30);
        ctx.bezierCurveTo(100, -80, 150, -80, 180, -40);
        ctx.lineTo(150, 0);
        ctx.lineTo(100, 0);
        ctx.stroke();
        
        // 尾
        ctx.beginPath();
        ctx.moveTo(90, 20);
        ctx.quadraticCurveTo(130, 30, 150, 60);
        ctx.stroke();
        
        // 風の線
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            const y = -100 + i * 40;
            ctx.moveTo(-300, y);
            ctx.bezierCurveTo(-150, y - 10, 150, y + 10, 300, y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // 朱雀の挿図
    drawZhuque(ctx, width, height) {
        if (this.traditionalIllustrations) {
            this.traditionalIllustrations.drawZhuque(ctx, width, height);
            return;
        }
        
        // フォールバック
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 火山
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-200, 150);
        ctx.lineTo(-50, -50);
        ctx.lineTo(50, -50);
        ctx.lineTo(200, 150);
        ctx.stroke();
        
        // 火口
        ctx.beginPath();
        ctx.ellipse(0, -50, 50, 15, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 朱雀
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 4;
        
        // 体
        ctx.beginPath();
        ctx.ellipse(0, -100, 40, 50, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 翼（広げた状態）
        ctx.beginPath();
        ctx.moveTo(-30, -100);
        ctx.bezierCurveTo(-120, -150, -150, -100, -120, -50);
        ctx.lineTo(-40, -80);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(30, -100);
        ctx.bezierCurveTo(120, -150, 150, -100, 120, -50);
        ctx.lineTo(40, -80);
        ctx.stroke();
        
        // 尾羽
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI / 6) * (i - 2);
            ctx.beginPath();
            ctx.moveTo(0, -60);
            ctx.quadraticCurveTo(
                Math.sin(angle) * 40,
                -20,
                Math.sin(angle) * 60,
                20
            );
            ctx.stroke();
        }
        
        // 炎
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        for (let i = 0; i < 7; i++) {
            const x = -60 + i * 20;
            const y = 100;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(x - 10, y - 30, x + 10, y - 30, x, y - 50);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // 玄武の挿図
    drawXuanwu(ctx, width, height) {
        if (this.traditionalIllustrations) {
            this.traditionalIllustrations.drawXuanwu(ctx, width, height);
            return;
        }
        
        // フォールバック
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 湖
        ctx.strokeStyle = '#1E40AF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 80, 250, 60, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 波紋
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(0, 80, 150 + i * 30, 40 + i * 10, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 玄武（亀）
        ctx.strokeStyle = '#2C1810';
        ctx.lineWidth = 4;
        
        // 甲羅
        ctx.beginPath();
        ctx.ellipse(0, 0, 100, 70, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 甲羅の模様（六角形）
        const hexSize = 25;
        for (let row = -1; row <= 1; row++) {
            for (let col = -2; col <= 2; col++) {
                if (Math.abs(col) + Math.abs(row) <= 2) {
                    this.drawHexagon(ctx, col * hexSize * 1.5, row * hexSize * 1.7, hexSize * 0.8);
                }
            }
        }
        
        // 亀の頭
        ctx.beginPath();
        ctx.arc(-100, 0, 25, 0, Math.PI * 2);
        ctx.stroke();
        
        // 蛇
        ctx.strokeStyle = '#4B0082';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(80, 0);
        ctx.bezierCurveTo(120, -40, 160, 40, 200, 0);
        ctx.bezierCurveTo(220, -20, 240, 20, 260, 0);
        ctx.stroke();
        
        // 蛇の頭
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(260, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // 九尾狐の挿図
    drawNineTailFox(ctx, width, height) {
        if (this.traditionalIllustrations) {
            this.traditionalIllustrations.drawJiuweihuli(ctx, width, height);
            return;
        }
        
        // フォールバック
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 森の背景
        ctx.strokeStyle = '#2C1810';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const x = -250 + i * 125;
            ctx.beginPath();
            ctx.moveTo(x, 100);
            ctx.lineTo(x, -50);
            // 枝
            ctx.moveTo(x, -20);
            ctx.lineTo(x - 20, -40);
            ctx.moveTo(x, -30);
            ctx.lineTo(x + 20, -50);
            ctx.stroke();
        }
        
        // 九尾狐
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 4;
        
        // 体
        ctx.beginPath();
        ctx.ellipse(0, 0, 70, 50, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 頭
        ctx.beginPath();
        ctx.moveTo(-60, -20);
        ctx.lineTo(-90, -40);
        ctx.lineTo(-85, -10);
        ctx.lineTo(-90, 0);
        ctx.lineTo(-70, 10);
        ctx.closePath();
        ctx.stroke();
        
        // 耳
        ctx.beginPath();
        ctx.moveTo(-85, -35);
        ctx.lineTo(-90, -55);
        ctx.lineTo(-75, -45);
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-75, -40);
        ctx.lineTo(-70, -60);
        ctx.lineTo(-60, -45);
        ctx.closePath();
        ctx.stroke();
        
        // 九つの尾
        for (let i = 0; i < 9; i++) {
            const angle = (Math.PI / 3) * (i / 9 - 0.5);
            const startX = 60;
            const startY = 0;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(
                startX + 40,
                startY + Math.sin(angle) * 20,
                startX + 80,
                startY + Math.sin(angle) * 40,
                startX + 120 + Math.cos(angle) * 20,
                Math.sin(angle) * 80
            );
            ctx.stroke();
            
            // 尾の先端
            ctx.beginPath();
            ctx.arc(
                startX + 120 + Math.cos(angle) * 20,
                Math.sin(angle) * 80,
                5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // 狐火
        ctx.fillStyle = 'rgba(124, 58, 237, 0.3)';
        for (let i = 0; i < 5; i++) {
            const x = -200 + Math.random() * 400;
            const y = -100 + Math.random() * 200;
            ctx.beginPath();
            ctx.arc(x, y, 10 + Math.random() * 10, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // その他の生物の描画関数（簡略版）
    drawThunderBeast(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '雷獣', '#4169E1');
    }
    
    drawFusangTree(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 巨大な樹
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(0, 150);
        ctx.lineTo(0, -100);
        ctx.stroke();
        
        // 枝
        ctx.lineWidth = 10;
        for (let i = 0; i < 5; i++) {
            const y = -50 + i * 20;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(-50 - i * 10, y - 30);
            ctx.moveTo(0, y);
            ctx.lineTo(50 + i * 10, y - 30);
            ctx.stroke();
        }
        
        // 太陽
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, -150, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // 鳳鳥
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-30, -50);
        ctx.bezierCurveTo(-50, -70, -30, -90, -10, -70);
        ctx.lineTo(0, -60);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawPixiu(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '貔貅', '#FFD700');
    }
    
    drawWindBird(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '風鳥', '#4682B4');
    }
    
    drawFireBeast(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '火獣', '#FF4500');
    }
    
    drawFenghuang(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '鳳凰', '#FFD700');
    }
    
    drawSnowBeast(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '雪獣', '#E0FFFF');
    }
    
    drawMysticFish(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '霊魚', '#00CED1');
    }
    
    drawTaotie(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '饕餮', '#8B0000');
    }
    
    drawQilin(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '麒麟', '#FFD700');
    }
    
    // 汎用的な生物描画（ラベル付き）
    drawCreatureWithLabel(ctx, width, height, name, color) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 円形の枠
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, Math.PI * 2);
        ctx.stroke();
        
        // 名前
        ctx.font = 'bold 40px "Noto Serif JP"';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, 0, 0);
        
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
    
    // 和紙のテクスチャ
    addPaperTexture(ctx, width, height) {
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.05)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + (Math.random() - 0.5) * 30, height);
            ctx.stroke();
        }
    }
    
    // 挿図の装飾枠
    addIllustrationFrame(ctx, width, height) {
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        
        // 外枠
        ctx.strokeRect(10, 10, width - 20, height - 20);
        
        // 角の雲文様
        const corners = [
            [10, 10], [width - 10, 10],
            [10, height - 10], [width - 10, height - 10]
        ];
        
        ctx.lineWidth = 2;
        corners.forEach(([x, y], i) => {
            const size = 30;
            ctx.beginPath();
            
            if (i === 0) { // 左上
                ctx.arc(x + size/2, y + size/2, size/2, Math.PI, Math.PI * 1.5);
                ctx.arc(x + size, y + size/2, size/2, Math.PI, Math.PI * 2);
            } else if (i === 1) { // 右上
                ctx.arc(x - size/2, y + size/2, size/2, Math.PI * 1.5, 0);
                ctx.arc(x - size, y + size/2, size/2, Math.PI, 0);
            } else if (i === 2) { // 左下
                ctx.arc(x + size/2, y - size/2, size/2, Math.PI * 0.5, Math.PI);
                ctx.arc(x + size, y - size/2, size/2, Math.PI, Math.PI * 2);
            } else { // 右下
                ctx.arc(x - size/2, y - size/2, size/2, 0, Math.PI * 0.5);
                ctx.arc(x - size, y - size/2, size/2, 0, Math.PI);
            }
            
            ctx.stroke();
        });
    }
}

// リーダーを初期化
let reader;

// DOMが読み込まれたら初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        reader = new ShanhaijingReader();
    });
} else {
    // すでに読み込まれている場合
    reader = new ShanhaijingReader();
}