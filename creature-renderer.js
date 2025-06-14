// 山海経の生物をプロシージャルに描画するシステム
class CreatureRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
    }
    
    // キャンバスを作成してSVG風の生物を描画
    renderCreature(creature, size = 300) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // 背景
        const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        // 生物タイプに応じて描画
        switch(creature.type) {
            case 'dragon':
                this.drawDragon(ctx, creature, size);
                break;
            case 'beast':
                this.drawBeast(ctx, creature, size);
                break;
            case 'bird':
                this.drawBird(ctx, creature, size);
                break;
            case 'hybrid':
                this.drawHybrid(ctx, creature, size);
                break;
            case 'demon':
                this.drawDemon(ctx, creature, size);
                break;
            case 'fish':
                this.drawFish(ctx, creature, size);
                break;
            default:
                this.drawDefault(ctx, creature, size);
        }
        
        return canvas.toDataURL();
    }
    
    // 龍を描画
    drawDragon(ctx, creature, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // 龍の体（S字カーブ）
        ctx.beginPath();
        ctx.strokeStyle = this.getElementColor(creature.element);
        ctx.lineWidth = 20;
        ctx.moveTo(-size/3, 0);
        ctx.bezierCurveTo(-size/4, -size/4, size/4, size/4, size/3, 0);
        ctx.stroke();
        
        // 龍の頭
        ctx.beginPath();
        ctx.fillStyle = this.getElementColor(creature.element);
        ctx.arc(size/3, 0, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // 角
        ctx.beginPath();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 5;
        ctx.moveTo(size/3 - 10, -20);
        ctx.lineTo(size/3 - 15, -40);
        ctx.moveTo(size/3 + 10, -20);
        ctx.lineTo(size/3 + 15, -40);
        ctx.stroke();
        
        // 髭
        ctx.beginPath();
        ctx.strokeStyle = this.getElementColor(creature.element);
        ctx.lineWidth = 3;
        ctx.moveTo(size/3 + 20, -5);
        ctx.quadraticCurveTo(size/3 + 40, -10, size/3 + 50, 0);
        ctx.moveTo(size/3 + 20, 5);
        ctx.quadraticCurveTo(size/3 + 40, 10, size/3 + 50, 0);
        ctx.stroke();
        
        // 鱗のパターン
        for (let i = 0; i < 5; i++) {
            const x = -size/3 + (i * size/6);
            const y = Math.sin(i * 0.5) * 20;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI, true);
            ctx.strokeStyle = this.adjustColor(this.getElementColor(creature.element), 50);
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // 獣を描画
    drawBeast(ctx, creature, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // 体
        ctx.beginPath();
        ctx.fillStyle = this.getElementColor(creature.element);
        ctx.ellipse(0, 10, 60, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 頭
        ctx.beginPath();
        ctx.fillStyle = this.getElementColor(creature.element);
        ctx.arc(0, -30, 35, 0, Math.PI * 2);
        ctx.fill();
        
        // 耳
        ctx.beginPath();
        ctx.fillStyle = this.adjustColor(this.getElementColor(creature.element), -30);
        ctx.moveTo(-25, -50);
        ctx.lineTo(-20, -70);
        ctx.lineTo(-10, -55);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(25, -50);
        ctx.lineTo(20, -70);
        ctx.lineTo(10, -55);
        ctx.closePath();
        ctx.fill();
        
        // 目
        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.arc(-12, -30, 8, 0, Math.PI * 2);
        ctx.arc(12, -30, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.arc(-12, -30, 4, 0, Math.PI * 2);
        ctx.arc(12, -30, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 尾（九尾狐の場合）
        if (creature.id === 'jiuwei') {
            for (let i = 0; i < 9; i++) {
                const angle = (Math.PI / 8) * (i - 4);
                ctx.beginPath();
                ctx.strokeStyle = this.getElementColor(creature.element);
                ctx.lineWidth = 8;
                ctx.moveTo(40, 10);
                ctx.quadraticCurveTo(
                    80 + Math.cos(angle) * 20,
                    10 + Math.sin(angle) * 30,
                    100 + Math.cos(angle) * 40,
                    Math.sin(angle) * 50
                );
                ctx.stroke();
            }
        } else {
            // 通常の尾
            ctx.beginPath();
            ctx.strokeStyle = this.getElementColor(creature.element);
            ctx.lineWidth = 15;
            ctx.moveTo(40, 10);
            ctx.quadraticCurveTo(70, 20, 80, 40);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // 鳥を描画
    drawBird(ctx, creature, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // 体
        ctx.beginPath();
        ctx.fillStyle = this.getElementColor(creature.element);
        ctx.ellipse(0, 0, 30, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 頭
        ctx.beginPath();
        ctx.arc(0, -40, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // くちばし
        ctx.beginPath();
        ctx.fillStyle = '#FFD700';
        ctx.moveTo(0, -40);
        ctx.lineTo(-15, -35);
        ctx.lineTo(0, -30);
        ctx.closePath();
        ctx.fill();
        
        // 翼
        ctx.beginPath();
        ctx.fillStyle = this.adjustColor(this.getElementColor(creature.element), 20);
        
        // 左翼
        ctx.moveTo(-25, -10);
        ctx.quadraticCurveTo(-60, -20, -70, 10);
        ctx.quadraticCurveTo(-50, 20, -25, 10);
        ctx.closePath();
        ctx.fill();
        
        // 右翼
        ctx.beginPath();
        ctx.moveTo(25, -10);
        ctx.quadraticCurveTo(60, -20, 70, 10);
        ctx.quadraticCurveTo(50, 20, 25, 10);
        ctx.closePath();
        ctx.fill();
        
        // 尾羽
        if (creature.id === 'zhuque' || creature.id === 'fenghuang') {
            // 鳳凰/朱雀の豪華な尾
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI / 6) * (i - 2);
                ctx.beginPath();
                ctx.strokeStyle = this.getElementColor(creature.element);
                ctx.lineWidth = 6;
                ctx.moveTo(0, 30);
                ctx.quadraticCurveTo(
                    Math.sin(angle) * 30,
                    50,
                    Math.sin(angle) * 40,
                    70
                );
                ctx.stroke();
                
                // 羽の装飾
                ctx.beginPath();
                ctx.fillStyle = '#FFD700';
                ctx.arc(Math.sin(angle) * 40, 70, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // 通常の尾
            ctx.beginPath();
            ctx.fillStyle = this.getElementColor(creature.element);
            ctx.moveTo(0, 30);
            ctx.lineTo(-10, 50);
            ctx.lineTo(10, 50);
            ctx.closePath();
            ctx.fill();
        }
        
        // 目
        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.arc(-8, -40, 5, 0, Math.PI * 2);
        ctx.arc(8, -40, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.arc(-8, -40, 2, 0, Math.PI * 2);
        ctx.arc(8, -40, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // ハイブリッド（玄武）を描画
    drawHybrid(ctx, creature, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        if (creature.id === 'xuanwu') {
            // 亀の甲羅
            ctx.beginPath();
            ctx.fillStyle = this.getElementColor(creature.element);
            ctx.ellipse(0, 0, 70, 50, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 甲羅の模様
            const pattern = 6;
            for (let i = 0; i < pattern; i++) {
                for (let j = 0; j < pattern/2; j++) {
                    const x = (i - pattern/2) * 20;
                    const y = (j - pattern/4) * 20;
                    if (Math.sqrt(x*x + y*y) < 60) {
                        ctx.beginPath();
                        ctx.strokeStyle = this.adjustColor(this.getElementColor(creature.element), -50);
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x - 8, y - 8, 16, 16);
                    }
                }
            }
            
            // 亀の頭
            ctx.beginPath();
            ctx.fillStyle = this.adjustColor(this.getElementColor(creature.element), 20);
            ctx.arc(-60, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // 蛇
            ctx.beginPath();
            ctx.strokeStyle = '#4B0082';
            ctx.lineWidth = 15;
            ctx.moveTo(50, 0);
            ctx.bezierCurveTo(80, -30, 100, 30, 120, 0);
            ctx.stroke();
            
            // 蛇の頭
            ctx.beginPath();
            ctx.fillStyle = '#4B0082';
            ctx.arc(120, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // 蛇の目
            ctx.beginPath();
            ctx.fillStyle = '#FF0000';
            ctx.arc(115, -3, 2, 0, Math.PI * 2);
            ctx.arc(115, 3, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.drawDefault(ctx, creature, size);
        }
        
        ctx.restore();
    }
    
    // 悪魔を描画
    drawDemon(ctx, creature, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // 体
        ctx.beginPath();
        ctx.fillStyle = this.getElementColor(creature.element);
        ctx.ellipse(0, 10, 50, 60, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 頭
        ctx.beginPath();
        ctx.fillStyle = this.getElementColor(creature.element);
        ctx.arc(0, -40, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // 角
        ctx.beginPath();
        ctx.fillStyle = '#8B0000';
        ctx.moveTo(-20, -60);
        ctx.lineTo(-25, -85);
        ctx.lineTo(-15, -65);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(20, -60);
        ctx.lineTo(25, -85);
        ctx.lineTo(15, -65);
        ctx.closePath();
        ctx.fill();
        
        // 目（光る）
        ctx.beginPath();
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 10;
        ctx.arc(-15, -40, 8, 0, Math.PI * 2);
        ctx.arc(15, -40, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 口（饕餮の大きな口）
        if (creature.id === 'taotie') {
            ctx.beginPath();
            ctx.fillStyle = '#000';
            ctx.arc(0, -25, 25, 0, Math.PI);
            ctx.fill();
            
            // 牙
            ctx.beginPath();
            ctx.fillStyle = '#FFF';
            ctx.moveTo(-20, -25);
            ctx.lineTo(-15, -15);
            ctx.lineTo(-10, -25);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(20, -25);
            ctx.lineTo(15, -15);
            ctx.lineTo(10, -25);
            ctx.closePath();
            ctx.fill();
        }
        
        // 爪
        ctx.beginPath();
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 5;
        ctx.moveTo(-30, 50);
        ctx.lineTo(-35, 65);
        ctx.moveTo(30, 50);
        ctx.lineTo(35, 65);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 魚を描画
    drawFish(ctx, creature, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // 体
        ctx.beginPath();
        ctx.fillStyle = this.getElementColor(creature.element);
        ctx.ellipse(0, 0, 60, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 尾びれ
        ctx.beginPath();
        ctx.fillStyle = this.adjustColor(this.getElementColor(creature.element), 20);
        ctx.moveTo(50, 0);
        ctx.lineTo(80, -20);
        ctx.lineTo(75, 0);
        ctx.lineTo(80, 20);
        ctx.closePath();
        ctx.fill();
        
        // 背びれ
        ctx.beginPath();
        ctx.moveTo(-10, -25);
        ctx.lineTo(0, -40);
        ctx.lineTo(10, -25);
        ctx.closePath();
        ctx.fill();
        
        // 目
        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.arc(-30, -5, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.arc(-30, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 霊魚の光
        if (creature.id === 'spirit_fish') {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.arc(0, 0, 70, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let i = 0; i < 5; i++) {
                const x = -20 + i * 10;
                const y = Math.sin(i * 0.5) * 10;
                ctx.arc(x, y, 3, 0, Math.PI * 2);
            }
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // デフォルト描画
    drawDefault(ctx, creature, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        ctx.beginPath();
        ctx.fillStyle = this.getElementColor(creature.element);
        ctx.arc(centerX, centerY, size/3, 0, Math.PI * 2);
        ctx.fill();
        
        // ?マーク
        ctx.font = 'bold 48px sans-serif';
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', centerX, centerY);
    }
    
    // 属性に基づく色を取得
    getElementColor(element) {
        const colors = {
            thunder: '#4169E1',
            metal: '#C0C0C0',
            fire: '#FF4500',
            water: '#1E90FF',
            psychic: '#FF1493',
            dark: '#4B0082',
            light: '#FFD700',
            earth: '#8B4513',
            normal: '#A0A0A0'
        };
        return colors[element] || '#808080';
    }
    
    // 色の明度を調整
    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, ((num >> 16) & 0xFF) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0xFF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
}

// グローバルに公開
window.creatureRenderer = new CreatureRenderer();