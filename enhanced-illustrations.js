// 山海経の伝統的な木版画スタイルの挿図
class EnhancedIllustrations {
    constructor() {
        // 木版画スタイルの設定
        this.woodblockStyle = {
            // 墨の濃淡
            ink: {
                black: '#000000',
                dark: '#1a1a1a',
                medium: '#333333',
                light: '#666666',
                wash: '#999999'
            },
            // 紙の色
            paper: {
                aged: '#F5E6D3',
                clean: '#FFF8F0',
                yellow: '#F4E4C1'
            },
            // 線の種類
            lines: {
                thick: 8,
                medium: 4,
                thin: 2,
                hair: 1
            }
        };
    }
    
    // 青龍 - 東山経より
    drawDongshan1(ctx, width, height) {
        // 背景を古い紙の色に
        ctx.fillStyle = this.woodblockStyle.paper.aged;
        ctx.fillRect(0, 0, width, height);
        
        // 紙のテクスチャを追加
        this.addPaperTexture(ctx, width, height);
        
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // タイトル枠
        this.drawTitleBox(ctx, -width/2 + 50, -height/2 + 30, '青龍');
        
        // 山の描写（背景）
        this.drawMountainRange(ctx, -width/2, height/4, width, height/3);
        
        // 青龍本体
        this.drawDetailedQinglong(ctx);
        
        // 装飾的な雲
        this.drawDecorativeClouds(ctx, -width/3, -height/3, width*2/3, height/4);
        
        // 説明文の領域
        this.drawTextArea(ctx, -width/2 + 50, height/3, width - 100, 80, 
            '青龍見則天下安寧');
        
        ctx.restore();
        
        // 枠線
        this.drawBorder(ctx, width, height);
    }
    
    // 詳細な青龍
    drawDetailedQinglong(ctx) {
        ctx.strokeStyle = this.woodblockStyle.ink.black;
        ctx.fillStyle = this.woodblockStyle.ink.black;
        
        // 龍の本体（より詳細に）
        ctx.lineWidth = this.woodblockStyle.lines.thick;
        
        // 体の主線
        ctx.beginPath();
        const bodyPath = [
            {x: -250, y: 50},
            {x: -200, y: 20, cp1x: -230, cp1y: 40, cp2x: -210, cp2y: 30},
            {x: -150, y: -30, cp1x: -180, cp1y: 0, cp2x: -160, cp2y: -20},
            {x: -80, y: -50, cp1x: -120, cp1y: -40, cp2x: -100, cp2y: -45},
            {x: 0, y: -40, cp1x: -40, cp1y: -55, cp2x: -20, cp2y: -50},
            {x: 80, y: 0, cp1x: 40, cp1y: -30, cp2x: 60, cp2y: -15},
            {x: 150, y: 30, cp1x: 110, cp1y: 10, cp2x: 130, cp2y: 20},
            {x: 220, y: 20, cp1x: 180, cp1y: 35, cp2x: 200, cp2y: 30},
            {x: 280, y: -10, cp1x: 250, cp1y: 10, cp2x: 260, cp2y: 0}
        ];
        
        // パスを描く
        ctx.moveTo(bodyPath[0].x, bodyPath[0].y);
        for (let i = 1; i < bodyPath.length; i++) {
            const point = bodyPath[i];
            if (point.cp1x !== undefined) {
                ctx.bezierCurveTo(
                    point.cp1x, point.cp1y,
                    point.cp2x, point.cp2y,
                    point.x, point.y
                );
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
        
        // 体の太さを表現する平行線
        ctx.lineWidth = this.woodblockStyle.lines.medium;
        ctx.beginPath();
        ctx.moveTo(-250, 70);
        for (let i = 1; i < bodyPath.length; i++) {
            const point = bodyPath[i];
            if (point.cp1x !== undefined) {
                ctx.bezierCurveTo(
                    point.cp1x, point.cp1y + 20,
                    point.cp2x, point.cp2y + 20,
                    point.x, point.y + 20
                );
            }
        }
        ctx.stroke();
        
        // 頭部の詳細
        this.drawDragonHeadDetailed(ctx, 280, -10);
        
        // 四つの足
        this.drawDragonLegs(ctx, bodyPath);
        
        // 鱗の詳細パターン
        this.drawDragonScales(ctx, bodyPath);
        
        // ひげと角
        this.drawDragonWhiskers(ctx, 280, -10);
        
        // 雲と雷のエフェクト
        this.drawThunderEffect(ctx, 0, -150);
    }
    
    // 龍の頭（詳細版）
    drawDragonHeadDetailed(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // 頭の輪郭
        ctx.lineWidth = this.woodblockStyle.lines.thick;
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.bezierCurveTo(10, -35, 30, -35, 40, -25);
        ctx.bezierCurveTo(45, -20, 45, -10, 40, -5);
        ctx.lineTo(35, 0);
        ctx.bezierCurveTo(30, 5, 25, 10, 20, 15);
        ctx.lineTo(15, 20);
        ctx.bezierCurveTo(10, 25, 0, 30, -10, 25);
        ctx.bezierCurveTo(-15, 22, -20, 15, -20, 5);
        ctx.bezierCurveTo(-20, -5, -15, -15, -5, -20);
        ctx.closePath();
        ctx.stroke();
        
        // 目
        ctx.lineWidth = this.woodblockStyle.lines.medium;
        ctx.beginPath();
        ctx.arc(5, -5, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(5, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 鼻孔
        ctx.beginPath();
        ctx.arc(30, -5, 3, 0, Math.PI * 2);
        ctx.arc(30, 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 口と牙
        ctx.lineWidth = this.woodblockStyle.lines.medium;
        ctx.beginPath();
        ctx.moveTo(35, 10);
        ctx.lineTo(20, 15);
        ctx.lineTo(10, 18);
        ctx.lineTo(0, 20);
        ctx.stroke();
        
        // 上顎の牙
        ctx.beginPath();
        ctx.moveTo(25, 10);
        ctx.lineTo(23, 18);
        ctx.lineTo(21, 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(15, 12);
        ctx.lineTo(13, 20);
        ctx.lineTo(11, 12);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    // 龍の角（鹿角スタイル）
    drawDragonWhiskers(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.lineWidth = this.woodblockStyle.lines.medium;
        
        // 左角
        ctx.beginPath();
        ctx.moveTo(-10, -25);
        ctx.bezierCurveTo(-15, -35, -20, -45, -15, -55);
        ctx.moveTo(-10, -25);
        ctx.bezierCurveTo(-12, -30, -10, -40, -5, -45);
        ctx.stroke();
        
        // 右角
        ctx.beginPath();
        ctx.moveTo(10, -25);
        ctx.bezierCurveTo(15, -35, 20, -45, 15, -55);
        ctx.moveTo(10, -25);
        ctx.bezierCurveTo(12, -30, 10, -40, 5, -45);
        ctx.stroke();
        
        // ひげ
        ctx.lineWidth = this.woodblockStyle.lines.thin;
        ctx.beginPath();
        ctx.moveTo(35, -5);
        ctx.bezierCurveTo(50, -8, 65, -5, 75, 0);
        ctx.moveTo(35, 5);
        ctx.bezierCurveTo(50, 8, 65, 5, 75, 10);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 龍の足（四足）
    drawDragonLegs(ctx, bodyPath) {
        ctx.lineWidth = this.woodblockStyle.lines.medium;
        
        const legPositions = [
            {x: -180, y: 10, angle: Math.PI/3},
            {x: -80, y: -30, angle: Math.PI/4},
            {x: 50, y: -20, angle: Math.PI/3},
            {x: 150, y: 20, angle: Math.PI/4}
        ];
        
        legPositions.forEach(leg => {
            ctx.save();
            ctx.translate(leg.x, leg.y);
            ctx.rotate(leg.angle);
            
            // 上腿
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(15, 35);
            ctx.lineTo(10, 70);
            ctx.stroke();
            
            // 下腿
            ctx.beginPath();
            ctx.moveTo(10, 70);
            ctx.lineTo(5, 90);
            ctx.lineTo(0, 95);
            ctx.stroke();
            
            // 爪（5本）
            const claws = [-10, -5, 0, 5, 10];
            claws.forEach(offset => {
                ctx.beginPath();
                ctx.moveTo(offset, 95);
                ctx.lineTo(offset - 2, 105);
                ctx.stroke();
            });
            
            ctx.restore();
        });
    }
    
    // 龍の鱗
    drawDragonScales(ctx, bodyPath) {
        ctx.lineWidth = this.woodblockStyle.lines.hair;
        ctx.strokeStyle = this.woodblockStyle.ink.medium;
        
        // 体に沿って鱗を配置
        for (let i = 0; i < bodyPath.length - 1; i++) {
            const start = bodyPath[i];
            const end = bodyPath[i + 1];
            
            // セグメント間に鱗を描く
            for (let t = 0; t < 1; t += 0.1) {
                let x, y;
                
                if (end.cp1x !== undefined) {
                    // ベジェ曲線上の点
                    const t2 = 1 - t;
                    x = t2 * t2 * t2 * start.x +
                        3 * t2 * t2 * t * end.cp1x +
                        3 * t2 * t * t * end.cp2x +
                        t * t * t * end.x;
                    y = t2 * t2 * t2 * start.y +
                        3 * t2 * t2 * t * end.cp1y +
                        3 * t2 * t * t * end.cp2y +
                        t * t * t * end.y;
                } else {
                    x = start.x + t * (end.x - start.x);
                    y = start.y + t * (end.y - start.y);
                }
                
                // U字型の鱗
                ctx.beginPath();
                ctx.arc(x, y, 8, Math.PI, 0, true);
                ctx.stroke();
                
                // 下段の鱗
                ctx.beginPath();
                ctx.arc(x + 10, y + 15, 8, Math.PI, 0, true);
                ctx.stroke();
            }
        }
    }
    
    // 白虎 - 西山経より
    drawXishan1(ctx, width, height) {
        ctx.fillStyle = this.woodblockStyle.paper.aged;
        ctx.fillRect(0, 0, width, height);
        this.addPaperTexture(ctx, width, height);
        
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // タイトル
        this.drawTitleBox(ctx, -width/2 + 50, -height/2 + 30, '白虎');
        
        // 平原の風景
        this.drawPlains(ctx, -width/2, height/4, width, height/3);
        
        // 白虎本体
        this.drawDetailedBaihu(ctx);
        
        // 風のエフェクト
        this.drawWindEffect(ctx);
        
        // 説明文
        this.drawTextArea(ctx, -width/2 + 50, height/3, width - 100, 80,
            '白虎見則兵起');
        
        ctx.restore();
        
        this.drawBorder(ctx, width, height);
    }
    
    // 詳細な白虎
    drawDetailedBaihu(ctx) {
        ctx.strokeStyle = this.woodblockStyle.ink.black;
        ctx.fillStyle = this.woodblockStyle.ink.black;
        ctx.lineWidth = this.woodblockStyle.lines.thick;
        
        // 体の輪郭
        ctx.beginPath();
        ctx.ellipse(0, 0, 140, 90, -0.1, 0, Math.PI * 2);
        ctx.stroke();
        
        // 虎の縞模様（より詳細に）
        this.drawTigerStripesDetailed(ctx);
        
        // 頭部
        this.drawTigerHeadDetailed(ctx, -140, -20);
        
        // 翼（白虎の特徴）
        this.drawTigerWingsDetailed(ctx);
        
        // 四肢
        this.drawTigerLegsDetailed(ctx);
        
        // 尾
        this.drawTigerTailDetailed(ctx, 130, 20);
    }
    
    // 朱雀 - 南山経より
    drawNanshan1(ctx, width, height) {
        ctx.fillStyle = this.woodblockStyle.paper.aged;
        ctx.fillRect(0, 0, width, height);
        this.addPaperTexture(ctx, width, height);
        
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // タイトル
        this.drawTitleBox(ctx, -width/2 + 50, -height/2 + 30, '朱雀');
        
        // 火山の風景
        this.drawVolcano(ctx, -width/2, height/4, width, height/3);
        
        // 朱雀本体
        this.drawDetailedZhuque(ctx);
        
        // 炎のエフェクト
        this.drawFlameEffect(ctx);
        
        // 説明文
        this.drawTextArea(ctx, -width/2 + 50, height/3, width - 100, 80,
            '朱雀火之精也');
        
        ctx.restore();
        
        this.drawBorder(ctx, width, height);
    }
    
    // 玄武 - 北山経より
    drawBeishan1(ctx, width, height) {
        ctx.fillStyle = this.woodblockStyle.paper.aged;
        ctx.fillRect(0, 0, width, height);
        this.addPaperTexture(ctx, width, height);
        
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // タイトル
        this.drawTitleBox(ctx, -width/2 + 50, -height/2 + 30, '玄武');
        
        // 湖の風景
        this.drawLake(ctx, -width/2, height/4, width, height/3);
        
        // 玄武本体
        this.drawDetailedXuanwu(ctx);
        
        // 水のエフェクト
        this.drawWaterEffect(ctx);
        
        // 説明文
        this.drawTextArea(ctx, -width/2 + 50, height/3, width - 100, 80,
            '玄龜與蛇共居');
        
        ctx.restore();
        
        this.drawBorder(ctx, width, height);
    }
    
    // 九尾狐 - 中山経より
    drawZhongshan1(ctx, width, height) {
        ctx.fillStyle = this.woodblockStyle.paper.aged;
        ctx.fillRect(0, 0, width, height);
        this.addPaperTexture(ctx, width, height);
        
        ctx.save();
        ctx.translate(width/2, height/2);
        
        // タイトル
        this.drawTitleBox(ctx, -width/2 + 50, -height/2 + 30, '九尾狐');
        
        // 森の風景
        this.drawForest(ctx, -width/2, height/4, width, height/3);
        
        // 九尾狐本体
        this.drawDetailedJiuweihuli(ctx);
        
        // 妖気のエフェクト
        this.drawMysticEffect(ctx);
        
        // 説明文
        this.drawTextArea(ctx, -width/2 + 50, height/3, width - 100, 80,
            '其音如嬰兒能食人');
        
        ctx.restore();
        
        this.drawBorder(ctx, width, height);
    }
    
    // 共通要素の描画メソッド
    drawTitleBox(ctx, x, y, title) {
        ctx.save();
        
        // 枠
        ctx.strokeStyle = this.woodblockStyle.ink.black;
        ctx.lineWidth = this.woodblockStyle.lines.medium;
        ctx.strokeRect(x, y, 120, 50);
        
        // 装飾
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y - 10);
        ctx.lineTo(x + 130, y - 10);
        ctx.lineTo(x + 120, y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + 120, y);
        ctx.lineTo(x + 130, y - 10);
        ctx.lineTo(x + 130, y + 40);
        ctx.lineTo(x + 120, y + 50);
        ctx.stroke();
        
        // タイトル文字
        ctx.font = 'bold 24px serif';
        ctx.fillStyle = this.woodblockStyle.ink.black;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, x + 60, y + 25);
        
        ctx.restore();
    }
    
    drawTextArea(ctx, x, y, width, height, text) {
        ctx.save();
        
        // 枠
        ctx.strokeStyle = this.woodblockStyle.ink.medium;
        ctx.lineWidth = this.woodblockStyle.lines.thin;
        ctx.strokeRect(x, y, width, height);
        
        // テキスト
        ctx.font = '16px serif';
        ctx.fillStyle = this.woodblockStyle.ink.dark;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width/2, y + height/2);
        
        ctx.restore();
    }
    
    drawBorder(ctx, width, height) {
        ctx.strokeStyle = this.woodblockStyle.ink.black;
        ctx.lineWidth = this.woodblockStyle.lines.thick;
        ctx.strokeRect(20, 20, width - 40, height - 40);
        
        // 角の装飾
        const corners = [
            {x: 20, y: 20},
            {x: width - 20, y: 20},
            {x: 20, y: height - 20},
            {x: width - 20, y: height - 20}
        ];
        
        ctx.lineWidth = this.woodblockStyle.lines.medium;
        corners.forEach((corner, i) => {
            ctx.beginPath();
            if (i % 2 === 0) {
                ctx.moveTo(corner.x, corner.y + 30);
                ctx.lineTo(corner.x, corner.y);
                ctx.lineTo(corner.x + 30, corner.y);
            } else {
                ctx.moveTo(corner.x - 30, corner.y);
                ctx.lineTo(corner.x, corner.y);
                ctx.lineTo(corner.x, corner.y + 30);
            }
            if (i >= 2) {
                ctx.moveTo(corner.x, corner.y - 30);
                ctx.lineTo(corner.x, corner.y);
                ctx.lineTo(corner.x + (i === 2 ? 30 : -30), corner.y);
            }
            ctx.stroke();
        });
    }
    
    addPaperTexture(ctx, width, height) {
        ctx.save();
        
        // 縦の繊維
        ctx.strokeStyle = this.woodblockStyle.ink.wash;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            const x = Math.random() * width;
            ctx.moveTo(x, 0);
            ctx.lineTo(x + (Math.random() - 0.5) * 20, height);
            ctx.stroke();
        }
        
        // 横の繊維
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            const y = Math.random() * height;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y + (Math.random() - 0.5) * 10);
            ctx.stroke();
        }
        
        // しみ
        ctx.fillStyle = this.woodblockStyle.ink.wash;
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * width,
                Math.random() * height,
                Math.random() * 30 + 10,
                0, Math.PI * 2
            );
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // 風景要素
    drawMountainRange(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.strokeStyle = this.woodblockStyle.ink.medium;
        ctx.lineWidth = this.woodblockStyle.lines.medium;
        
        // 遠景の山
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(width * 0.2, height * 0.3);
        ctx.lineTo(width * 0.4, height * 0.5);
        ctx.lineTo(width * 0.6, height * 0.2);
        ctx.lineTo(width * 0.8, height * 0.4);
        ctx.lineTo(width, height);
        ctx.stroke();
        
        // 近景の山
        ctx.globalAlpha = 1;
        ctx.strokeStyle = this.woodblockStyle.ink.dark;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(width * 0.3, height * 0.4);
        ctx.lineTo(width * 0.5, height * 0.6);
        ctx.lineTo(width * 0.7, height * 0.3);
        ctx.lineTo(width, height);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawDecorativeClouds(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.strokeStyle = this.woodblockStyle.ink.medium;
        ctx.lineWidth = this.woodblockStyle.lines.thin;
        
        // 伝統的な雲の模様
        for (let i = 0; i < 3; i++) {
            const cloudX = (width / 3) * i;
            const cloudY = Math.random() * height;
            
            ctx.beginPath();
            // 渦巻き状の雲
            ctx.moveTo(cloudX, cloudY);
            ctx.bezierCurveTo(
                cloudX + 20, cloudY - 10,
                cloudX + 30, cloudY + 10,
                cloudX + 20, cloudY + 20
            );
            ctx.bezierCurveTo(
                cloudX + 10, cloudY + 25,
                cloudX - 10, cloudY + 20,
                cloudX - 15, cloudY + 10
            );
            ctx.bezierCurveTo(
                cloudX - 20, cloudY,
                cloudX - 15, cloudY - 10,
                cloudX, cloudY - 5
            );
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    drawThunderEffect(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // 雷文様
        ctx.strokeStyle = this.woodblockStyle.ink.dark;
        ctx.lineWidth = this.woodblockStyle.lines.thick;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-20, 30);
        ctx.lineTo(10, 35);
        ctx.lineTo(-10, 65);
        ctx.lineTo(15, 70);
        ctx.lineTo(-5, 100);
        ctx.stroke();
        
        // 雷光
        ctx.strokeStyle = this.woodblockStyle.ink.medium;
        ctx.lineWidth = this.woodblockStyle.lines.thin;
        ctx.setLineDash([5, 5]);
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-30 + i * 30, 0);
            ctx.lineTo(-35 + i * 30, 80);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        ctx.restore();
    }
    
    // その他の詳細メソッド（省略）
    drawDetailedZhuque(ctx) {
        // 朱雀の詳細な描画
    }
    
    drawDetailedXuanwu(ctx) {
        // 玄武の詳細な描画
    }
    
    drawDetailedJiuweihuli(ctx) {
        // 九尾狐の詳細な描画
    }
    
    drawTigerStripesDetailed(ctx) {
        // 虎の縞模様の詳細
    }
    
    drawTigerHeadDetailed(ctx, x, y) {
        // 虎の頭部の詳細
    }
    
    drawTigerWingsDetailed(ctx) {
        // 虎の翼の詳細
    }
    
    drawTigerLegsDetailed(ctx) {
        // 虎の脚の詳細
    }
    
    drawTigerTailDetailed(ctx, x, y) {
        // 虎の尾の詳細
    }
    
    drawPlains(ctx, x, y, width, height) {
        // 平原の風景
    }
    
    drawWindEffect(ctx) {
        // 風のエフェクト
    }
    
    drawVolcano(ctx, x, y, width, height) {
        // 火山の風景
    }
    
    drawFlameEffect(ctx) {
        // 炎のエフェクト
    }
    
    drawLake(ctx, x, y, width, height) {
        // 湖の風景
    }
    
    drawWaterEffect(ctx) {
        // 水のエフェクト
    }
    
    drawForest(ctx, x, y, width, height) {
        // 森の風景
    }
    
    drawMysticEffect(ctx) {
        // 妖気のエフェクト
    }
}

// グローバルに公開
window.enhancedIllustrations = new EnhancedIllustrations();