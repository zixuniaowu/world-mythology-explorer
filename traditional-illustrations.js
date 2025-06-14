// 山海経の伝統的な挿図描画システム
class TraditionalIllustrations {
    constructor() {
        this.inkColors = {
            primary: '#1a1a1a',
            secondary: '#4a4a4a',
            accent: '#8B4513',
            light: '#D2691E',
            paper: '#F5E6D3'
        };
    }
    
    // 青龍 - 東方の守護神
    drawQinglong(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 背景に雲を描く
        this.drawClouds(ctx, -width/2, -height/3, width, height/3);
        
        // 龍の体を描く（S字カーブ）
        ctx.strokeStyle = this.inkColors.primary;
        ctx.lineWidth = 8;
        ctx.beginPath();
        
        // 龍の主体
        const dragonPath = [
            {x: -200, y: 50},
            {cp1x: -150, cp1y: -100, cp2x: -50, cp2y: -100, x: 0, y: -50},
            {cp1x: 50, cp1y: 0, cp2x: 100, cp2y: 100, x: 150, y: 50},
            {cp1x: 200, cp1y: 0, cp2x: 250, cp2y: -50, x: 300, y: -20}
        ];
        
        ctx.moveTo(dragonPath[0].x, dragonPath[0].y);
        for (let i = 1; i < dragonPath.length; i++) {
            const p = dragonPath[i];
            ctx.bezierCurveTo(p.cp1x, p.cp1y, p.cp2x, p.cp2y, p.x, p.y);
        }
        ctx.stroke();
        
        // 龍の頭部詳細
        this.drawDragonHead(ctx, 300, -20, 40);
        
        // 龍の四肢
        const legPositions = [
            {x: -150, y: 20, angle: Math.PI/4},
            {x: -50, y: -30, angle: Math.PI/3},
            {x: 50, y: 20, angle: Math.PI/4},
            {x: 150, y: 30, angle: Math.PI/3}
        ];
        
        legPositions.forEach(pos => {
            this.drawDragonLeg(ctx, pos.x, pos.y, pos.angle);
        });
        
        // 鱗の描画
        this.drawScales(ctx, dragonPath);
        
        // 雲と雷
        this.drawThunderClouds(ctx, 0, -150);
        
        ctx.restore();
    }
    
    // 龍の頭部
    drawDragonHead(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        // 頭の輪郭
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.8, -Math.PI/6, 0, Math.PI * 2);
        ctx.stroke();
        
        // 角（鹿角のような）
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-size/3, -size/2);
        ctx.quadraticCurveTo(-size/2, -size, -size/2, -size*1.2);
        ctx.moveTo(-size/3, -size/2);
        ctx.quadraticCurveTo(-size/4, -size*0.8, -size/6, -size);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(size/3, -size/2);
        ctx.quadraticCurveTo(size/2, -size, size/2, -size*1.2);
        ctx.moveTo(size/3, -size/2);
        ctx.quadraticCurveTo(size/4, -size*0.8, size/6, -size);
        ctx.stroke();
        
        // 目
        ctx.fillStyle = this.inkColors.primary;
        ctx.beginPath();
        ctx.ellipse(-size/4, -size/6, size/8, size/6, -Math.PI/6, 0, Math.PI * 2);
        ctx.fill();
        
        // 髭
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(size/2, -size/4);
        ctx.quadraticCurveTo(size, -size/3, size*1.5, -size/4);
        ctx.moveTo(size/2, 0);
        ctx.quadraticCurveTo(size, size/6, size*1.5, 0);
        ctx.stroke();
        
        // 口と牙
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-size/2, size/3);
        ctx.quadraticCurveTo(0, size/2, size/2, size/3);
        ctx.stroke();
        
        // 牙
        ctx.beginPath();
        ctx.moveTo(-size/4, size/3);
        ctx.lineTo(-size/4, size/2);
        ctx.moveTo(size/4, size/3);
        ctx.lineTo(size/4, size/2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 龍の足
    drawDragonLeg(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 40);
        ctx.lineTo(-10, 50);
        ctx.moveTo(0, 40);
        ctx.lineTo(10, 50);
        ctx.moveTo(0, 40);
        ctx.lineTo(0, 55);
        ctx.stroke();
        
        // 爪
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-10, 50);
        ctx.lineTo(-15, 58);
        ctx.moveTo(0, 55);
        ctx.lineTo(0, 63);
        ctx.moveTo(10, 50);
        ctx.lineTo(15, 58);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 鱗の描画
    drawScales(ctx, path) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.inkColors.secondary;
        
        // パスに沿って鱗を配置
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            const segments = 8;
            
            for (let j = 0; j < segments; j++) {
                const t = j / segments;
                let x, y;
                
                if (p2.cp1x !== undefined) {
                    // ベジェ曲線上の点を計算
                    x = Math.pow(1-t, 3) * p1.x + 
                        3 * Math.pow(1-t, 2) * t * p2.cp1x + 
                        3 * (1-t) * Math.pow(t, 2) * p2.cp2x + 
                        Math.pow(t, 3) * p2.x;
                    y = Math.pow(1-t, 3) * p1.y + 
                        3 * Math.pow(1-t, 2) * t * p2.cp1y + 
                        3 * (1-t) * Math.pow(t, 2) * p2.cp2y + 
                        Math.pow(t, 3) * p2.y;
                } else {
                    x = p1.x + t * (p2.x - p1.x);
                    y = p1.y + t * (p2.y - p1.y);
                }
                
                // 鱗を描く
                ctx.beginPath();
                ctx.arc(x, y - 15, 8, 0, Math.PI, true);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x + 15, y, 8, 0, Math.PI, true);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x, y + 15, 8, 0, Math.PI, true);
                ctx.stroke();
            }
        }
    }
    
    // 雷雲
    drawThunderClouds(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // 雲
        ctx.fillStyle = this.inkColors.secondary;
        ctx.globalAlpha = 0.3;
        
        const cloudCircles = [
            {x: -40, y: 0, r: 30},
            {x: -20, y: -10, r: 35},
            {x: 0, y: 0, r: 40},
            {x: 20, y: -5, r: 35},
            {x: 40, y: 0, r: 30}
        ];
        
        cloudCircles.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
        
        // 雷
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(-10, 40);
        ctx.lineTo(5, 45);
        ctx.lineTo(-5, 65);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 白虎 - 西方の守護神
    drawBaihu(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 体の主要部分
        ctx.strokeStyle = this.inkColors.primary;
        ctx.lineWidth = 8;
        
        // 胴体
        ctx.beginPath();
        ctx.ellipse(0, 0, 120, 80, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 虎の縞模様
        this.drawTigerStripes(ctx);
        
        // 頭部
        this.drawTigerHead(ctx, -120, -30);
        
        // 四肢
        const legs = [
            {x: -80, y: 60, front: true},
            {x: -40, y: 65, front: true},
            {x: 40, y: 65, front: false},
            {x: 80, y: 60, front: false}
        ];
        
        legs.forEach(leg => {
            this.drawTigerLeg(ctx, leg.x, leg.y, leg.front);
        });
        
        // 翼（白虎の特徴）
        this.drawTigerWings(ctx);
        
        // 尾
        this.drawTigerTail(ctx, 110, 20);
        
        ctx.restore();
    }
    
    // 虎の頭
    drawTigerHead(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // 頭の形
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        // 耳
        ctx.beginPath();
        ctx.moveTo(-35, -35);
        ctx.lineTo(-40, -60);
        ctx.lineTo(-20, -45);
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(35, -35);
        ctx.lineTo(40, -60);
        ctx.lineTo(20, -45);
        ctx.closePath();
        ctx.stroke();
        
        // 目
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-25, -10);
        ctx.lineTo(-15, -5);
        ctx.moveTo(25, -10);
        ctx.lineTo(15, -5);
        ctx.stroke();
        
        // 鼻と口
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-5, 15);
        ctx.lineTo(0, 20);
        ctx.lineTo(5, 15);
        ctx.closePath();
        ctx.fill();
        
        // 牙
        ctx.beginPath();
        ctx.moveTo(-15, 25);
        ctx.lineTo(-12, 35);
        ctx.lineTo(-10, 25);
        ctx.moveTo(15, 25);
        ctx.lineTo(12, 35);
        ctx.lineTo(10, 25);
        ctx.stroke();
        
        // 髭
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-50, -5);
        ctx.lineTo(-80, -10);
        ctx.moveTo(-50, 5);
        ctx.lineTo(-80, 5);
        ctx.moveTo(50, -5);
        ctx.lineTo(80, -10);
        ctx.moveTo(50, 5);
        ctx.lineTo(80, 5);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 虎の縞模様
    drawTigerStripes(ctx) {
        ctx.lineWidth = 15;
        ctx.strokeStyle = this.inkColors.primary;
        
        const stripes = [
            {x: -100, y: -60, x2: -80, y2: 60},
            {x: -60, y: -70, x2: -40, y2: 70},
            {x: -20, y: -75, x2: 0, y2: 75},
            {x: 20, y: -75, x2: 40, y2: 75},
            {x: 60, y: -70, x2: 80, y2: 70},
            {x: 100, y: -60, x2: 110, y2: 60}
        ];
        
        stripes.forEach(s => {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x2, s.y2);
            ctx.stroke();
        });
    }
    
    // 虎の翼
    drawTigerWings(ctx) {
        ctx.strokeStyle = this.inkColors.secondary;
        ctx.lineWidth = 4;
        
        // 左翼
        ctx.beginPath();
        ctx.moveTo(-60, -40);
        ctx.quadraticCurveTo(-120, -80, -140, -40);
        ctx.quadraticCurveTo(-130, 0, -100, 20);
        ctx.quadraticCurveTo(-80, 10, -60, -20);
        ctx.stroke();
        
        // 右翼
        ctx.beginPath();
        ctx.moveTo(60, -40);
        ctx.quadraticCurveTo(120, -80, 140, -40);
        ctx.quadraticCurveTo(130, 0, 100, 20);
        ctx.quadraticCurveTo(80, 10, 60, -20);
        ctx.stroke();
        
        // 羽の詳細
        this.drawFeatherDetails(ctx, -100, -30, true);
        this.drawFeatherDetails(ctx, 100, -30, false);
    }
    
    // 朱雀 - 南方の守護神
    drawZhuque(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 体
        ctx.strokeStyle = this.inkColors.primary;
        ctx.lineWidth = 6;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, 60, 80, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 長い首
        ctx.beginPath();
        ctx.moveTo(0, -80);
        ctx.quadraticCurveTo(-20, -120, 0, -150);
        ctx.stroke();
        
        // 頭部
        this.drawPhoenixHead(ctx, 0, -150);
        
        // 翼（大きく広げた状態）
        this.drawPhoenixWings(ctx);
        
        // 尾羽（豪華な5本）
        this.drawPhoenixTail(ctx);
        
        // 炎のオーラ
        this.drawFireAura(ctx);
        
        ctx.restore();
    }
    
    // 鳳凰の頭
    drawPhoenixHead(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // 頭
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.stroke();
        
        // 冠羽
        const crownFeathers = [
            {angle: -Math.PI/3, length: 30},
            {angle: -Math.PI/6, length: 35},
            {angle: 0, length: 40},
            {angle: Math.PI/6, length: 35},
            {angle: Math.PI/3, length: 30}
        ];
        
        ctx.lineWidth = 3;
        crownFeathers.forEach(f => {
            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(
                Math.cos(f.angle - Math.PI/2) * f.length,
                -15 + Math.sin(f.angle - Math.PI/2) * f.length
            );
            ctx.stroke();
            
            // 羽の先端の装飾
            ctx.beginPath();
            ctx.arc(
                Math.cos(f.angle - Math.PI/2) * f.length,
                -15 + Math.sin(f.angle - Math.PI/2) * f.length,
                4, 0, Math.PI * 2
            );
            ctx.stroke();
        });
        
        // くちばし
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(-15, 10);
        ctx.lineTo(0, 15);
        ctx.closePath();
        ctx.stroke();
        
        // 目
        ctx.beginPath();
        ctx.arc(-10, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // 鳳凰の翼
    drawPhoenixWings(ctx) {
        // 左翼
        ctx.beginPath();
        ctx.moveTo(-50, -40);
        ctx.quadraticCurveTo(-150, -100, -200, -50);
        ctx.quadraticCurveTo(-180, 0, -150, 50);
        ctx.quadraticCurveTo(-100, 60, -50, 40);
        ctx.stroke();
        
        // 右翼
        ctx.beginPath();
        ctx.moveTo(50, -40);
        ctx.quadraticCurveTo(150, -100, 200, -50);
        ctx.quadraticCurveTo(180, 0, 150, 50);
        ctx.quadraticCurveTo(100, 60, 50, 40);
        ctx.stroke();
        
        // 羽の層
        this.drawWingLayers(ctx, -150, 0, true);
        this.drawWingLayers(ctx, 150, 0, false);
    }
    
    // 鳳凰の尾
    drawPhoenixTail(ctx) {
        const tailFeathers = [
            {angle: -Math.PI/3, length: 150, curve: 0.3},
            {angle: -Math.PI/6, length: 180, curve: 0.2},
            {angle: 0, length: 200, curve: 0.1},
            {angle: Math.PI/6, length: 180, curve: -0.2},
            {angle: Math.PI/3, length: 150, curve: -0.3}
        ];
        
        ctx.lineWidth = 4;
        tailFeathers.forEach((f, i) => {
            ctx.beginPath();
            ctx.moveTo(0, 60);
            
            const endX = Math.sin(f.angle) * f.length;
            const endY = 60 + Math.cos(f.angle) * f.length;
            const ctrlX = Math.sin(f.angle + f.curve) * f.length * 0.7;
            const ctrlY = 60 + Math.cos(f.angle + f.curve) * f.length * 0.7;
            
            ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
            ctx.stroke();
            
            // 羽の先端の目玉模様
            ctx.beginPath();
            ctx.arc(endX, endY, 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(endX, endY, 6, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    // 炎のオーラ
    drawFireAura(ctx) {
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const radius = 100 + Math.random() * 20;
            
            ctx.beginPath();
            ctx.moveTo(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
            ctx.quadraticCurveTo(
                Math.cos(angle + 0.2) * (radius + 30),
                Math.sin(angle + 0.2) * (radius + 30),
                Math.cos(angle) * (radius + 50),
                Math.sin(angle) * (radius + 50)
            );
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    // 玄武 - 北方の守護神
    drawXuanwu(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 亀の部分
        this.drawTurtleBody(ctx);
        
        // 蛇の部分
        this.drawSnakeBody(ctx);
        
        // 水の波紋
        this.drawWaterRipples(ctx, 0, 100);
        
        ctx.restore();
    }
    
    // 亀の体
    drawTurtleBody(ctx) {
        ctx.strokeStyle = this.inkColors.primary;
        ctx.lineWidth = 8;
        
        // 甲羅
        ctx.beginPath();
        ctx.ellipse(0, 0, 130, 90, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 甲羅の模様（六角形パターン）
        this.drawHexagonPattern(ctx);
        
        // 頭
        ctx.beginPath();
        ctx.arc(-130, 0, 35, 0, Math.PI * 2);
        ctx.stroke();
        
        // 目
        ctx.beginPath();
        ctx.arc(-140, -10, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 足
        const feet = [
            {x: -90, y: 70, angle: Math.PI/4},
            {x: -30, y: 80, angle: Math.PI/6},
            {x: 30, y: 80, angle: -Math.PI/6},
            {x: 90, y: 70, angle: -Math.PI/4}
        ];
        
        ctx.lineWidth = 6;
        feet.forEach(f => {
            ctx.save();
            ctx.translate(f.x, f.y);
            ctx.rotate(f.angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 30);
            ctx.lineTo(-10, 40);
            ctx.moveTo(0, 30);
            ctx.lineTo(10, 40);
            ctx.stroke();
            ctx.restore();
        });
    }
    
    // 六角形パターン
    drawHexagonPattern(ctx) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.inkColors.secondary;
        
        const hexSize = 30;
        const rows = 3;
        const cols = 5;
        
        for (let row = -rows/2; row <= rows/2; row++) {
            for (let col = -cols/2; col <= cols/2; col++) {
                const x = col * hexSize * 1.5;
                const y = row * hexSize * 1.7 + (col % 2) * hexSize * 0.85;
                
                if (Math.sqrt(x*x + y*y) < 110) {
                    this.drawHexagon(ctx, x, y, hexSize * 0.8);
                }
            }
        }
    }
    
    // 蛇の体
    drawSnakeBody(ctx) {
        ctx.strokeStyle = this.inkColors.primary;
        ctx.lineWidth = 12;
        
        // 蛇の曲線
        ctx.beginPath();
        ctx.moveTo(100, 0);
        ctx.bezierCurveTo(150, -50, 200, 50, 250, 0);
        ctx.bezierCurveTo(280, -30, 310, 30, 340, 0);
        ctx.stroke();
        
        // 蛇の頭
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(340, 0, 20, 15, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 目
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(335, -5, 3, 0, Math.PI * 2);
        ctx.arc(335, 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 舌
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(360, 0);
        ctx.lineTo(370, -5);
        ctx.moveTo(360, 0);
        ctx.lineTo(370, 5);
        ctx.stroke();
        
        // 鱗のパターン
        ctx.strokeStyle = this.inkColors.secondary;
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
            const x = 100 + i * 12;
            const y = this.getSnakeY(x);
            ctx.beginPath();
            ctx.arc(x, y - 5, 4, 0, Math.PI, true);
            ctx.stroke();
        }
    }
    
    // 蛇のY座標を計算
    getSnakeY(x) {
        return Math.sin((x - 100) * 0.03) * 30;
    }
    
    // 九尾狐
    drawJiuweihuli(ctx, width, height) {
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // 体
        ctx.strokeStyle = this.inkColors.primary;
        ctx.lineWidth = 6;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, 80, 60, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 頭
        this.drawFoxHead(ctx, -80, -20);
        
        // 九つの尾
        this.drawNineTails(ctx);
        
        // 足
        const legs = [
            {x: -50, y: 50},
            {x: -20, y: 55},
            {x: 20, y: 55},
            {x: 50, y: 50}
        ];
        
        ctx.lineWidth = 4;
        legs.forEach(leg => {
            ctx.beginPath();
            ctx.moveTo(leg.x, leg.y);
            ctx.lineTo(leg.x, leg.y + 30);
            ctx.stroke();
        });
        
        // 妖気
        this.drawMysticAura(ctx);
        
        ctx.restore();
    }
    
    // 狐の頭
    drawFoxHead(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // 頭の形（三角形に近い）
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-30, 20);
        ctx.lineTo(-10, 30);
        ctx.lineTo(0, 25);
        ctx.lineTo(10, 30);
        ctx.lineTo(30, 20);
        ctx.closePath();
        ctx.stroke();
        
        // 耳
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.lineTo(-25, -40);
        ctx.lineTo(-10, -25);
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(20, -15);
        ctx.lineTo(25, -40);
        ctx.lineTo(10, -25);
        ctx.closePath();
        ctx.stroke();
        
        // 目（細い）
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(-8, 3);
        ctx.moveTo(15, 0);
        ctx.lineTo(8, 3);
        ctx.stroke();
        
        // 鼻
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(-3, 18);
        ctx.lineTo(0, 20);
        ctx.lineTo(3, 18);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    // 九つの尾
    drawNineTails(ctx) {
        const tails = [];
        for (let i = 0; i < 9; i++) {
            const angle = (Math.PI / 2) * (i / 8 - 0.5) - Math.PI/4;
            tails.push({
                angle: angle,
                length: 120 + Math.random() * 30,
                curve: (Math.random() - 0.5) * 0.5
            });
        }
        
        ctx.lineWidth = 8;
        tails.forEach((tail, i) => {
            ctx.beginPath();
            ctx.moveTo(70, 0);
            
            const endX = 70 + Math.cos(tail.angle) * tail.length;
            const endY = Math.sin(tail.angle) * tail.length;
            const ctrlX = 70 + Math.cos(tail.angle + tail.curve) * tail.length * 0.6;
            const ctrlY = Math.sin(tail.angle + tail.curve) * tail.length * 0.6;
            
            ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
            ctx.stroke();
            
            // 尾の先端を太く
            ctx.beginPath();
            ctx.arc(endX, endY, 10, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    // 妖気のオーラ
    drawMysticAura(ctx) {
        ctx.strokeStyle = '#9370DB';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, 100 + i * 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    // 共通メソッド
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
    
    drawClouds(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.strokeStyle = this.inkColors.secondary;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        
        for (let i = 0; i < 5; i++) {
            const cloudX = Math.random() * width;
            const cloudY = Math.random() * height;
            
            ctx.beginPath();
            ctx.arc(cloudX - 20, cloudY, 15, 0, Math.PI * 2);
            ctx.arc(cloudX, cloudY - 5, 20, 0, Math.PI * 2);
            ctx.arc(cloudX + 20, cloudY, 15, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    
    drawWaterRipples(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.strokeStyle = this.inkColors.secondary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(0, 0, 50 + i * 30, 20 + i * 10, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    
    drawFeatherDetails(ctx, x, y, isLeft) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, -20 + i * 10);
            ctx.lineTo(isLeft ? -20 : 20, -15 + i * 10);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    drawWingLayers(ctx, x, y, isLeft) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(0, -30 + i * 20);
            ctx.quadraticCurveTo(
                isLeft ? -40 : 40, -20 + i * 20,
                isLeft ? -50 : 50, 0 + i * 20
            );
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    drawTigerLeg(ctx, x, y, isFront) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 40);
        ctx.lineTo(-10, 50);
        ctx.moveTo(0, 40);
        ctx.lineTo(10, 50);
        ctx.stroke();
        
        // 爪
        ctx.lineWidth = 3;
        if (isFront) {
            ctx.beginPath();
            ctx.moveTo(-10, 50);
            ctx.lineTo(-15, 55);
            ctx.moveTo(0, 48);
            ctx.lineTo(0, 55);
            ctx.moveTo(10, 50);
            ctx.lineTo(15, 55);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    drawTigerTail(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(40, 20, 60, 60);
        ctx.stroke();
        
        // 尾の縞
        ctx.lineWidth = 8;
        for (let i = 0; i < 3; i++) {
            const t = (i + 1) / 4;
            const tx = t * 60;
            const ty = t * t * 60;
            
            ctx.beginPath();
            ctx.moveTo(tx - 5, ty - 5);
            ctx.lineTo(tx + 5, ty + 5);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// グローバルに公開
window.traditionalIllustrations = new TraditionalIllustrations();