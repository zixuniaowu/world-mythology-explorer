// 山海経リーダーシステム v2
class ShanhaijingReaderV2 {
    constructor() {
        this.currentVolume = null;
        this.currentChapter = null;
        this.illustrationSystem = window.illustrationSystem || null;
        this.traditionalIllustrations = window.traditionalIllustrations || null;
        this.completeTexts = window.SHANHAIJING_COMPLETE || null;
        this.init();
    }
    
    init() {
        console.log('ShanhaijingReaderV2初期化開始');
        console.log('SHANHAIJING_COMPLETE:', this.completeTexts ? 'OK' : 'NG');
        
        if (!this.completeTexts) {
            console.error('完全なテキストデータがありません');
            return;
        }
        
        // ナビゲーションを作成
        this.createNavigation();
        
        // 最初の巻を表示
        this.showVolume('nanshan');
    }
    
    createNavigation() {
        const navContainer = document.getElementById('volume-navigation');
        if (!navContainer) return;
        
        navContainer.innerHTML = '';
        
        // 各巻のボタンを作成
        const volumes = [
            { id: 'nanshan', name: '南山経' },
            { id: 'xishan', name: '西山経' },
            { id: 'beishan', name: '北山経' },
            { id: 'dongshan', name: '東山経' },
            { id: 'zhongshan', name: '中山経' },
            { id: 'haiwainan', name: '海外南経' },
            { id: 'haiwaixi', name: '海外西経' },
            { id: 'haiwaibei', name: '海外北経' },
            { id: 'haiwaidong', name: '海外東経' },
            { id: 'haineinan', name: '海内南経' },
            { id: 'haineixi', name: '海内西経' },
            { id: 'haineibei', name: '海内北経' },
            { id: 'haineidong', name: '海内東経' },
            { id: 'dahuangdong', name: '大荒東経' },
            { id: 'dahuangnan', name: '大荒南経' },
            { id: 'dahuangxi', name: '大荒西経' },
            { id: 'dahuangbei', name: '大荒北経' },
            { id: 'haineijing', name: '海内経' }
        ];
        
        volumes.forEach(vol => {
            const btn = document.createElement('button');
            btn.className = 'volume-btn';
            btn.textContent = vol.name;
            btn.onclick = () => this.showVolume(vol.id);
            navContainer.appendChild(btn);
        });
    }
    
    showVolume(volumeId) {
        console.log('showVolume called with:', volumeId);
        this.currentVolume = volumeId;
        
        const volumeData = this.completeTexts[volumeId];
        if (!volumeData) {
            console.error('巻が見つかりません:', volumeId);
            return;
        }
        
        // ナビゲーションボタンの状態を更新
        document.querySelectorAll('.volume-btn').forEach((btn, index) => {
            btn.classList.remove('active');
            const volumes = Object.keys(this.completeTexts);
            if (volumes[index] === volumeId) {
                btn.classList.add('active');
            }
        });
        
        // コンテンツエリアをクリア
        const contentArea = document.getElementById('content-area');
        if (!contentArea) return;
        
        contentArea.innerHTML = '';
        
        // 巻を作成
        const volumeElement = this.createVolumeElement(volumeData);
        contentArea.appendChild(volumeElement);
        
        // 挿図を描画
        setTimeout(() => {
            this.drawChapterIllustrations(volumeId, volumeData.chapters);
        }, 100);
    }
    
    createVolumeElement(volumeData) {
        const volume = document.createElement('div');
        volume.className = 'volume';
        
        // 巻ヘッダー
        const header = document.createElement('div');
        header.className = 'volume-header';
        header.innerHTML = `
            <h2 class="volume-title">${volumeData.titleJa}（${volumeData.title}）</h2>
            <p class="volume-subtitle">${volumeData.subtitle}</p>
        `;
        volume.appendChild(header);
        
        // 各章を作成
        volumeData.chapters.forEach((chapter, index) => {
            const chapterElement = this.createChapterElement(chapter, index + 1);
            volume.appendChild(chapterElement);
        });
        
        return volume;
    }
    
    createChapterElement(chapter, number) {
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter';
        
        // 章ヘッダー
        const header = document.createElement('div');
        header.className = 'chapter-header';
        header.innerHTML = `
            <div class="chapter-number">${number}</div>
            <h3 class="chapter-title">${chapter.title}</h3>
        `;
        chapterDiv.appendChild(header);
        
        // 挿図コンテナ
        const illustrationContainer = document.createElement('div');
        illustrationContainer.className = 'illustration-container';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'illustration';
        canvas.id = `illustration-${chapter.id}`;
        canvas.width = 800;
        canvas.height = 400;
        illustrationContainer.appendChild(canvas);
        
        chapterDiv.appendChild(illustrationContainer);
        
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
            <p class="original-text">${chapter.original}</p>
        `;
        textRow.appendChild(originalColumn);
        
        // 日本語訳列
        const translationColumn = document.createElement('div');
        translationColumn.className = 'text-column';
        translationColumn.innerHTML = `
            <span class="text-label">書き下し文</span>
            <p class="translation-text">${chapter.translation}</p>
        `;
        textRow.appendChild(translationColumn);
        
        textContent.appendChild(textRow);
        
        // 現代日本語訳
        const japaneseDiv = document.createElement('div');
        japaneseDiv.className = 'japanese-text';
        japaneseDiv.innerHTML = `
            <span class="text-label">現代日本語訳</span>
            <p>${chapter.japanese}</p>
        `;
        textContent.appendChild(japaneseDiv);
        
        // 注釈
        if (chapter.notes) {
            const notes = document.createElement('div');
            notes.className = 'notes';
            notes.innerHTML = `<span class="text-label">注釈</span> ${chapter.notes}`;
            textContent.appendChild(notes);
        }
        
        chapterDiv.appendChild(textContent);
        
        return chapterDiv;
    }
    
    drawChapterIllustrations(volumeId, chapters) {
        chapters.forEach(chapter => {
            const canvas = document.getElementById(`illustration-${chapter.id}`);
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // 背景
            ctx.fillStyle = '#F5E6D3';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 章に応じた挿図を描画
            this.drawChapterSpecificIllustration(ctx, canvas.width, canvas.height, volumeId, chapter);
            
            // 装飾枠
            this.addIllustrationFrame(ctx, canvas.width, canvas.height);
        });
    }
    
    drawChapterSpecificIllustration(ctx, width, height, volumeId, chapter) {
        // 和紙のテクスチャ
        this.addPaperTexture(ctx, width, height);
        
        // 巻と章に基づいて適切な挿図を選択
        const illustrationMap = {
            'nanshan': () => this.drawSouthernCreature(ctx, width, height, chapter),
            'xishan': () => this.drawWesternCreature(ctx, width, height, chapter),
            'beishan': () => this.drawNorthernCreature(ctx, width, height, chapter),
            'dongshan': () => this.drawEasternCreature(ctx, width, height, chapter),
            'zhongshan': () => this.drawCentralCreature(ctx, width, height, chapter),
            'haiwainan': () => this.drawOverseasSouth(ctx, width, height, chapter),
            'haiwaixi': () => this.drawOverseasWest(ctx, width, height, chapter),
            'haiwaibei': () => this.drawOverseasNorth(ctx, width, height, chapter),
            'haiwaidong': () => this.drawOverseasEast(ctx, width, height, chapter),
            'haineinan': () => this.drawInlandSouth(ctx, width, height, chapter),
            'haineixi': () => this.drawInlandWest(ctx, width, height, chapter),
            'haineibei': () => this.drawInlandNorth(ctx, width, height, chapter),
            'haineidong': () => this.drawInlandEast(ctx, width, height, chapter),
            'dahuangdong': () => this.drawGreatWildernessEast(ctx, width, height, chapter),
            'dahuangnan': () => this.drawGreatWildernessSouth(ctx, width, height, chapter),
            'dahuangxi': () => this.drawGreatWildernessWest(ctx, width, height, chapter),
            'dahuangbei': () => this.drawGreatWildernessNorth(ctx, width, height, chapter),
            'haineijing': () => this.drawInlandGeneral(ctx, width, height, chapter)
        };
        
        const drawFunc = illustrationMap[volumeId];
        if (drawFunc) {
            drawFunc();
        } else {
            this.drawDefaultIllustration(ctx, width, height, chapter);
        }
    }
    
    // 各巻の特徴的な挿図
    drawSouthernCreature(ctx, width, height, chapter) {
        // 南山経の特徴：火の鳥、鳳凰など
        if (chapter.id.includes('_1')) {
            this.drawPhoenix(ctx, width, height);
        } else if (chapter.id.includes('_2')) {
            this.drawFireBird(ctx, width, height);
        } else {
            this.drawSouthernMountains(ctx, width, height);
        }
    }
    
    drawWesternCreature(ctx, width, height, chapter) {
        // 西山経の特徴：白虎、金属の精霊
        if (chapter.id.includes('_1')) {
            this.drawWhiteTiger(ctx, width, height);
        } else if (chapter.id.includes('_2')) {
            this.drawMetalSpirit(ctx, width, height);
        } else {
            this.drawWesternPlains(ctx, width, height);
        }
    }
    
    drawNorthernCreature(ctx, width, height, chapter) {
        // 北山経の特徴：玄武、水の神獣
        if (chapter.id.includes('_1')) {
            this.drawBlackTortoise(ctx, width, height);
        } else if (chapter.id.includes('_2')) {
            this.drawWaterDragon(ctx, width, height);
        } else {
            this.drawNorthernLakes(ctx, width, height);
        }
    }
    
    drawEasternCreature(ctx, width, height, chapter) {
        // 東山経の特徴：青龍、雷獣
        if (chapter.id.includes('_1')) {
            this.drawAzureDragon(ctx, width, height);
        } else if (chapter.id.includes('_2')) {
            this.drawThunderBeast(ctx, width, height);
        } else {
            this.drawEasternMountains(ctx, width, height);
        }
    }
    
    drawCentralCreature(ctx, width, height, chapter) {
        // 中山経の特徴：九尾狐、饕餮
        if (chapter.id.includes('_7')) {
            this.drawNineTailFox(ctx, width, height);
        } else if (chapter.id.includes('_2')) {
            this.drawTaotie(ctx, width, height);
        } else {
            this.drawCentralLands(ctx, width, height);
        }
    }
    
    // 簡略化された挿図関数
    drawPhoenix(ctx, width, height) {
        if (this.traditionalIllustrations?.drawFenghuang) {
            this.traditionalIllustrations.drawFenghuang(ctx, width, height);
        } else {
            this.drawCreatureWithLabel(ctx, width, height, '鳳凰', '#FFD700');
        }
    }
    
    drawWhiteTiger(ctx, width, height) {
        if (this.traditionalIllustrations?.drawBaihu) {
            this.traditionalIllustrations.drawBaihu(ctx, width, height);
        } else {
            this.drawCreatureWithLabel(ctx, width, height, '白虎', '#FFFFFF');
        }
    }
    
    drawBlackTortoise(ctx, width, height) {
        if (this.traditionalIllustrations?.drawXuanwu) {
            this.traditionalIllustrations.drawXuanwu(ctx, width, height);
        } else {
            this.drawCreatureWithLabel(ctx, width, height, '玄武', '#000080');
        }
    }
    
    drawAzureDragon(ctx, width, height) {
        if (this.traditionalIllustrations?.drawQinglong) {
            this.traditionalIllustrations.drawQinglong(ctx, width, height);
        } else {
            this.drawCreatureWithLabel(ctx, width, height, '青龍', '#0000FF');
        }
    }
    
    drawNineTailFox(ctx, width, height) {
        if (this.traditionalIllustrations?.drawJiuweihuli) {
            this.traditionalIllustrations.drawJiuweihuli(ctx, width, height);
        } else {
            this.drawCreatureWithLabel(ctx, width, height, '九尾狐', '#7C3AED');
        }
    }
    
    // デフォルトの挿図
    drawDefaultIllustration(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, chapter.title, '#8B4513');
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
        ctx.font = 'bold 30px "Noto Serif JP"';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, 0, 0);
        
        ctx.restore();
    }
    
    // その他の挿図関数
    drawFireBird(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '火鳥', '#FF4500');
    }
    
    drawMetalSpirit(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '金精', '#FFD700');
    }
    
    drawWaterDragon(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '水龍', '#00CED1');
    }
    
    drawThunderBeast(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '雷獣', '#4169E1');
    }
    
    drawTaotie(ctx, width, height) {
        this.drawCreatureWithLabel(ctx, width, height, '饕餮', '#8B0000');
    }
    
    // 地形の描画
    drawSouthernMountains(ctx, width, height) {
        this.drawLandscape(ctx, width, height, '南山', '#FF6347');
    }
    
    drawWesternPlains(ctx, width, height) {
        this.drawLandscape(ctx, width, height, '西原', '#F0E68C');
    }
    
    drawNorthernLakes(ctx, width, height) {
        this.drawLandscape(ctx, width, height, '北湖', '#4682B4');
    }
    
    drawEasternMountains(ctx, width, height) {
        this.drawLandscape(ctx, width, height, '東山', '#228B22');
    }
    
    drawCentralLands(ctx, width, height) {
        this.drawLandscape(ctx, width, height, '中原', '#8B7355');
    }
    
    drawLandscape(ctx, width, height, name, color) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 風景の輪郭
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-200, 50);
        ctx.lineTo(-100, -50);
        ctx.lineTo(0, -20);
        ctx.lineTo(100, -80);
        ctx.lineTo(200, 50);
        ctx.stroke();
        
        // 地名
        ctx.font = 'bold 40px "Noto Serif JP"';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, 0, 100);
        
        ctx.restore();
    }
    
    // 海外経の挿図
    drawOverseasSouth(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '羽民', '#FF69B4');
    }
    
    drawOverseasWest(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '形天', '#8B0000');
    }
    
    drawOverseasNorth(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '夸父', '#4B0082');
    }
    
    drawOverseasEast(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '扶桑', '#FFD700');
    }
    
    // 海内経の挿図
    drawInlandSouth(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '巫臷民', '#FF1493');
    }
    
    drawInlandWest(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '共工', '#000080');
    }
    
    drawInlandNorth(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '燭陰', '#DC143C');
    }
    
    drawInlandEast(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '青丘', '#00CED1');
    }
    
    // 大荒経の挿図
    drawGreatWildernessEast(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '大人国', '#8B4513');
    }
    
    drawGreatWildernessSouth(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '羽民国', '#FF69B4');
    }
    
    drawGreatWildernessWest(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '崑崙山', '#FFD700');
    }
    
    drawGreatWildernessNorth(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '不周山', '#696969');
    }
    
    drawInlandGeneral(ctx, width, height, chapter) {
        this.drawCreatureWithLabel(ctx, width, height, '九州', '#DAA520');
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
let readerV2;

// すべてのリソースが読み込まれたら初期化
window.addEventListener('load', () => {
    // データが読み込まれているか確認
    if (typeof window.SHANHAIJING_COMPLETE === 'undefined') {
        console.error('SHANHAIJING_COMPLETEが定義されていません。shanhaijing-complete-text.jsが正しく読み込まれているか確認してください。');
        return;
    }
    
    console.log('Initializing ShanhaijingReaderV2...');
    readerV2 = new ShanhaijingReaderV2();
});