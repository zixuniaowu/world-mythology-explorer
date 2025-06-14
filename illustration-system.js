// 山海経スタイルの挿図生成システム
class IllustrationSystem {
    constructor() {
        this.inkStyle = {
            strokeColor: '#2C1810',
            fillColor: '#F5E6D3',
            lineWidth: 2,
            brushTexture: true
        };
    }
    
    // 場所の挿図を生成
    createLocationIllustration(location, canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 背景色（和紙風）
        ctx.fillStyle = this.inkStyle.fillColor;
        ctx.fillRect(0, 0, width, height);
        
        // 和紙のテクスチャ効果
        this.addPaperTexture(ctx, width, height);
        
        // 場所に応じた挿図を描画
        switch(location.id) {
            case 'eastern_mountains':
                this.drawEasternMountains(ctx, width, height);
                break;
            case 'western_plains':
                this.drawWesternPlains(ctx, width, height);
                break;
            case 'southern_volcano':
                this.drawSouthernVolcano(ctx, width, height);
                break;
            case 'northern_lake':
                this.drawNorthernLake(ctx, width, height);
                break;
            case 'mystic_forest':
                this.drawMysticForest(ctx, width, height);
                break;
            case 'dark_cave':
                this.drawDarkCave(ctx, width, height);
                break;
            case 'sacred_mountain':
                this.drawSacredMountain(ctx, width, height);
                break;
            case 'treasure_valley':
                this.drawTreasureValley(ctx, width, height);
                break;
            case 'grassland':
                this.drawGrassland(ctx, width, height);
                break;
            case 'spirit_pond':
                this.drawSpiritPond(ctx, width, height);
                break;
        }
        
        // 装飾的な枠を追加
        this.addDecorativeBorder(ctx, width, height);
    }
    
    // 東方青山 - 雷雲と山脈
    drawEasternMountains(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = this.inkStyle.lineWidth;
        
        // 山脈
        ctx.beginPath();
        ctx.moveTo(0, height * 0.8);
        
        // 三つの山を描く
        for (let i = 0; i < 3; i++) {
            const peakX = width * (0.2 + i * 0.3);
            const peakY = height * (0.3 + i * 0.1);
            
            ctx.quadraticCurveTo(
                peakX - width * 0.1, peakY,
                peakX, peakY - height * 0.05
            );
            ctx.quadraticCurveTo(
                peakX + width * 0.1, peakY,
                peakX + width * 0.15, height * 0.8
            );
        }
        
        ctx.stroke();
        
        // 雷雲
        this.drawStylizedClouds(ctx, width * 0.5, height * 0.2, 80);
        
        // 雷
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height * 0.25);
        ctx.lineTo(width * 0.48, height * 0.35);
        ctx.lineTo(width * 0.52, height * 0.35);
        ctx.lineTo(width * 0.5, height * 0.45);
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 青龍のシルエット
        this.drawDragonSilhouette(ctx, width * 0.7, height * 0.4, 60);
    }
    
    // 西方白原 - 平原と風
    drawWesternPlains(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = this.inkStyle.lineWidth;
        
        // 地平線
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        ctx.lineTo(width, height * 0.6);
        ctx.stroke();
        
        // 草原の草
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = height * 0.6 + Math.random() * height * 0.3;
            this.drawGrass(ctx, x, y);
        }
        
        // 風の線
        ctx.strokeStyle = this.inkStyle.strokeColor + '40';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            const y = height * (0.3 + i * 0.1);
            ctx.moveTo(0, y);
            ctx.bezierCurveTo(
                width * 0.3, y - 10,
                width * 0.7, y + 10,
                width, y
            );
            ctx.stroke();
        }
        
        // 白虎のシルエット
        this.drawTigerSilhouette(ctx, width * 0.3, height * 0.5, 70);
    }
    
    // 南方朱山 - 火山
    drawSouthernVolcano(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = this.inkStyle.lineWidth;
        
        // 火山の形
        ctx.beginPath();
        ctx.moveTo(width * 0.2, height * 0.9);
        ctx.lineTo(width * 0.35, height * 0.3);
        ctx.lineTo(width * 0.45, height * 0.25);
        ctx.lineTo(width * 0.55, height * 0.25);
        ctx.lineTo(width * 0.65, height * 0.3);
        ctx.lineTo(width * 0.8, height * 0.9);
        ctx.stroke();
        
        // 火口
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.25, width * 0.1, height * 0.03, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 炎と煙
        for (let i = 0; i < 3; i++) {
            const x = width * 0.5 + (i - 1) * 20;
            const y = height * 0.2 - i * 10;
            this.drawFlame(ctx, x, y, 30);
        }
        
        // 朱雀
        this.drawPhoenixSilhouette(ctx, width * 0.5, height * 0.15, 50);
    }
    
    // 北方玄湖 - 神秘的な湖
    drawNorthernLake(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = this.inkStyle.lineWidth;
        
        // 湖の輪郭
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.7, width * 0.4, height * 0.15, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 波紋
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(width * 0.5, height * 0.7, width * (0.2 + i * 0.1), height * (0.08 + i * 0.03), 0, 0, Math.PI * 2);
            ctx.strokeStyle = this.inkStyle.strokeColor + (80 - i * 20).toString(16);
            ctx.stroke();
        }
        
        // 霧
        ctx.strokeStyle = this.inkStyle.strokeColor + '30';
        for (let i = 0; i < 5; i++) {
            const x = width * (0.2 + i * 0.15);
            const y = height * 0.5;
            this.drawMist(ctx, x, y, 40);
        }
        
        // 玄武（亀と蛇）
        this.drawTurtleSnake(ctx, width * 0.5, height * 0.7, 60);
    }
    
    // 幻妖の森
    drawMysticForest(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = this.inkStyle.lineWidth;
        
        // 木々
        for (let i = 0; i < 5; i++) {
            const x = width * (0.1 + i * 0.2);
            const y = height * 0.9;
            this.drawMysticTree(ctx, x, y, height * 0.6);
        }
        
        // 狐火
        ctx.fillStyle = this.inkStyle.strokeColor + '40';
        for (let i = 0; i < 7; i++) {
            const x = Math.random() * width;
            const y = height * (0.4 + Math.random() * 0.3);
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 九尾狐のシルエット
        this.drawFoxSilhouette(ctx, width * 0.6, height * 0.7, 50);
    }
    
    // 補助的な描画関数
    drawStylizedClouds(ctx, x, y, size) {
        ctx.beginPath();
        ctx.arc(x - size/3, y, size/3, 0, Math.PI * 2);
        ctx.arc(x, y - size/4, size/2, 0, Math.PI * 2);
        ctx.arc(x + size/3, y, size/3, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawGrass(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - 2, y - 10, x + 2, y - 15, x, y - 20);
        ctx.stroke();
    }
    
    drawFlame(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x - size/2, y - size,
            x + size/2, y - size,
            x, y - size * 1.5
        );
        ctx.stroke();
    }
    
    drawMist(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.bezierCurveTo(
            x - size/2, y - size/2,
            x + size/2, y + size/2,
            x + size, y
        );
        ctx.stroke();
    }
    
    drawMysticTree(ctx, x, y, height) {
        // 幹
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - height);
        ctx.stroke();
        
        // 枝
        for (let i = 0; i < 5; i++) {
            const branchY = y - height * (0.3 + i * 0.15);
            const angle = (i % 2 === 0 ? -1 : 1) * Math.PI / 6;
            ctx.beginPath();
            ctx.moveTo(x, branchY);
            ctx.lineTo(x + Math.cos(angle) * 30, branchY + Math.sin(angle) * 20);
            ctx.stroke();
        }
    }
    
    // 生物のシルエット
    drawDragonSilhouette(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size/100, size/100);
        
        ctx.beginPath();
        // 簡略化された龍の形
        ctx.moveTo(-50, 0);
        ctx.bezierCurveTo(-40, -20, -20, -30, 0, -20);
        ctx.bezierCurveTo(20, -10, 40, 10, 50, 0);
        ctx.bezierCurveTo(40, 20, 20, 30, 0, 20);
        ctx.bezierCurveTo(-20, 10, -40, -10, -50, 0);
        
        // 角
        ctx.moveTo(0, -20);
        ctx.lineTo(-5, -35);
        ctx.moveTo(0, -20);
        ctx.lineTo(5, -35);
        
        ctx.stroke();
        ctx.restore();
    }
    
    drawTigerSilhouette(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size/100, size/100);
        
        ctx.beginPath();
        // 体
        ctx.ellipse(0, 0, 40, 25, 0, 0, Math.PI * 2);
        // 頭
        ctx.moveTo(35, -10);
        ctx.arc(45, -5, 15, 0, Math.PI * 2);
        // 尾
        ctx.moveTo(-35, 0);
        ctx.quadraticCurveTo(-50, -10, -60, 5);
        
        ctx.stroke();
        ctx.restore();
    }
    
    drawPhoenixSilhouette(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size/100, size/100);
        
        ctx.beginPath();
        // 翼を広げた鳥
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-50, -20, -60, 10, -40, 20);
        ctx.lineTo(0, 10);
        ctx.lineTo(40, 20);
        ctx.bezierCurveTo(60, 10, 50, -20, 0, 0);
        
        ctx.stroke();
        ctx.restore();
    }
    
    drawTurtleSnake(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size/100, size/100);
        
        // 亀の甲羅
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 蛇
        ctx.beginPath();
        ctx.moveTo(35, 0);
        ctx.bezierCurveTo(50, -20, 70, 20, 80, 0);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawFoxSilhouette(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size/100, size/100);
        
        ctx.beginPath();
        // 体
        ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
        
        // 九つの尾
        for (let i = 0; i < 9; i++) {
            const angle = (Math.PI / 8) * (i - 4);
            ctx.moveTo(25, 0);
            ctx.quadraticCurveTo(
                40 + Math.cos(angle) * 10,
                Math.sin(angle) * 15,
                50 + Math.cos(angle) * 20,
                Math.sin(angle) * 25
            );
        }
        
        ctx.stroke();
        ctx.restore();
    }
    
    // 残りの場所の描画関数
    drawDarkCave(ctx, width, height) {
        // 洞窟の入口
        ctx.fillStyle = this.inkStyle.strokeColor;
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.5, width * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 岩の質感
        ctx.strokeStyle = this.inkStyle.fillColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            const x = width * 0.5 + (Math.random() - 0.5) * width * 0.5;
            const y = height * 0.5 + (Math.random() - 0.5) * height * 0.5;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    drawSacredMountain(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = this.inkStyle.lineWidth;
        
        // 山
        ctx.beginPath();
        ctx.moveTo(width * 0.2, height * 0.9);
        ctx.lineTo(width * 0.5, height * 0.2);
        ctx.lineTo(width * 0.8, height * 0.9);
        ctx.stroke();
        
        // 光輪
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.2, 30, 0, Math.PI * 2);
        ctx.strokeStyle = this.inkStyle.strokeColor + '60';
        ctx.stroke();
        
        // 鳳凰
        this.drawPhoenixSilhouette(ctx, width * 0.5, height * 0.2, 40);
    }
    
    drawTreasureValley(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = this.inkStyle.lineWidth;
        
        // 谷の形
        ctx.beginPath();
        ctx.moveTo(0, height * 0.3);
        ctx.quadraticCurveTo(width * 0.5, height * 0.7, width, height * 0.3);
        ctx.stroke();
        
        // 宝箱
        const boxX = width * 0.5;
        const boxY = height * 0.6;
        ctx.strokeRect(boxX - 30, boxY - 20, 60, 40);
        ctx.beginPath();
        ctx.arc(boxX, boxY - 20, 30, Math.PI, 0);
        ctx.stroke();
        
        // 金貨
        for (let i = 0; i < 5; i++) {
            const x = boxX + (i - 2) * 15;
            const y = boxY - 25 - Math.abs(i - 2) * 5;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    drawGrassland(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = this.inkStyle.lineWidth;
        
        // 地平線
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        ctx.lineTo(width, height * 0.6);
        ctx.stroke();
        
        // 草
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = height * 0.6 + Math.random() * height * 0.4;
            this.drawGrass(ctx, x, y);
        }
        
        // 太陽
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.2, 30, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawSpiritPond(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = this.inkStyle.lineWidth;
        
        // 池
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.6, width * 0.35, height * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 蓮の花
        for (let i = 0; i < 3; i++) {
            const x = width * (0.3 + i * 0.2);
            const y = height * 0.6;
            this.drawLotus(ctx, x, y, 20);
        }
        
        // 霊気
        ctx.strokeStyle = this.inkStyle.strokeColor + '40';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(width * 0.5, height * 0.6);
            ctx.quadraticCurveTo(
                width * 0.5 + (Math.random() - 0.5) * 100,
                height * 0.4,
                width * 0.5 + (Math.random() - 0.5) * 50,
                height * 0.2
            );
            ctx.stroke();
        }
    }
    
    drawLotus(ctx, x, y, size) {
        // 花びら
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            ctx.beginPath();
            ctx.ellipse(
                x + Math.cos(angle) * size/2,
                y + Math.sin(angle) * size/2,
                size/3, size/2,
                angle,
                0, Math.PI * 2
            );
            ctx.stroke();
        }
    }
    
    // 和紙のテクスチャ効果
    addPaperTexture(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor + '10';
        ctx.lineWidth = 0.5;
        
        // ランダムな繊維
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, 0);
            ctx.lineTo(Math.random() * width, height);
            ctx.stroke();
        }
    }
    
    // 装飾的な枠
    addDecorativeBorder(ctx, width, height) {
        ctx.strokeStyle = this.inkStyle.strokeColor;
        ctx.lineWidth = 3;
        
        // 外枠
        ctx.strokeRect(10, 10, width - 20, height - 20);
        
        // 角の装飾
        const cornerSize = 20;
        const corners = [
            [10, 10],
            [width - 10, 10],
            [10, height - 10],
            [width - 10, height - 10]
        ];
        
        corners.forEach(([x, y], i) => {
            ctx.beginPath();
            if (i < 2) {
                ctx.moveTo(x, y + cornerSize);
                ctx.lineTo(x, y);
                ctx.lineTo(x + (i === 0 ? cornerSize : -cornerSize), y);
            } else {
                ctx.moveTo(x, y - cornerSize);
                ctx.lineTo(x, y);
                ctx.lineTo(x + (i === 2 ? cornerSize : -cornerSize), y);
            }
            ctx.stroke();
        });
    }
}

// グローバルに公開
window.illustrationSystem = new IllustrationSystem();