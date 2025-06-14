// メインゲームシステム
class Game {
    constructor() {
        this.player = {
            name: '探索者',
            hp: 100,
            maxHp: 100,
            spiritPower: 100,
            maxSpiritPower: 100,
            level: 1,
            experience: 0,
            gold: 0
        };
        
        this.creatureSystem = new CreatureSystem();
        this.locationSystem = new LocationSystem();
        this.inventory = [];
        this.currentView = 'exploration';
        this.currentEncounter = null;
        this.battleState = null;
        this.dialogueQueue = [];
        
        this.init();
    }
    
    init() {
        // ローディング完了後、メインメニューを表示
        setTimeout(() => {
            this.showRedesignedMainMenu();
        }, 2000);
    }
    
    showRedesignedMainMenu() {
        // 新しいメインメニューを表示
        if (window.mainMenuSystem) {
            // 既存の画面を非表示
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // メインメニューのHTMLを生成して挿入
            const mainMenuScreen = document.getElementById('main-menu');
            mainMenuScreen.innerHTML = window.mainMenuSystem.generateMainMenuHTML();
            mainMenuScreen.classList.add('active');
            
            // 章の挿図を描画
            setTimeout(() => {
                window.mainMenuSystem.drawChapterIllustrations();
            }, 100);
        } else {
            this.showScreen('main-menu');
        }
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId + '-view').classList.add('active');
        this.currentView = viewId;
    }
    
    startNewGame() {
        this.showScreen('game-screen');
        this.showView('exploration');
        this.updateLocationDisplay();
        this.showDialogue('山海経の世界へようこそ！神秘的な生物を探して、仲間にしましょう。');
    }
    
    startChapter(chapterId) {
        // 章を開始
        const chapter = window.mainMenuSystem.chapters.find(c => c.id === chapterId);
        if (chapter && chapter.unlocked) {
            // 最初の場所に移動
            if (chapter.locations && chapter.locations.length > 0) {
                this.locationSystem.currentLocation = chapter.locations[0];
                this.locationSystem.unlockLocation(chapter.locations[0]);
            }
            
            this.showScreen('game-screen');
            this.showView('exploration');
            this.updateLocationDisplay();
            this.showDialogue(`${chapter.titleJa}の冒険が始まる！${chapter.description}`);
        }
    }
    
    continueGame() {
        // セーブデータの読み込み（未実装）
        this.startNewGame();
    }
    
    showCollection() {
        this.showScreen('collection-screen');
        this.updateCollectionDisplay();
    }
    
    closeCollection() {
        this.showScreen('game-screen');
    }
    
    showSettings() {
        // 設定画面（未実装）
        this.showDialogue('設定機能は開発中です。');
    }
    
    toggleMenu() {
        // メニュートグル（未実装）
    }
    
    updateLocationDisplay() {
        const location = this.locationSystem.getCurrentLocation();
        document.getElementById('location-name').textContent = location.nameJa;
        document.getElementById('location-desc').textContent = location.description;
        
        // 場所の挿図を生成
        const locationImage = document.getElementById('location-image');
        if (window.illustrationSystem) {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 300;
            window.illustrationSystem.createLocationIllustration(location, canvas);
            locationImage.style.backgroundImage = `url(${canvas.toDataURL()})`;
            locationImage.style.backgroundSize = 'cover';
            locationImage.style.backgroundPosition = 'center';
        } else {
            locationImage.style.background = 
                `linear-gradient(135deg, ${location.bgColor} 0%, ${this.adjustColor(location.bgColor, -30)} 100%)`;
        }
    }
    
    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    
    explore() {
        const location = this.locationSystem.getCurrentLocation();
        const creatures = location.creatures;
        
        if (!creatures || creatures.length === 0) {
            this.showDialogue('この場所には生物がいないようだ...');
            return;
        }
        
        // ランダムイベントチェック
        const event = this.locationSystem.getRandomEvent();
        if (event && Math.random() < 0.3) {
            this.handleEvent(event);
            return;
        }
        
        // 生物との遭遇
        const creature = this.creatureSystem.getRandomCreature(location.id);
        this.startEncounter(creature);
    }
    
    rest() {
        const healAmount = Math.floor(this.player.maxHp * 0.3);
        const spiritAmount = Math.floor(this.player.maxSpiritPower * 0.5);
        
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        this.player.spiritPower = Math.min(this.player.maxSpiritPower, this.player.spiritPower + spiritAmount);
        
        this.updatePlayerDisplay();
        this.showDialogue(`休憩した。HPが${healAmount}、霊力が${spiritAmount}回復した。`);
    }
    
    openInventory() {
        // インベントリ表示（未実装）
        this.showDialogue('持ち物機能は開発中です。');
    }
    
    startEncounter(creature) {
        this.currentEncounter = creature;
        this.showView('encounter');
        
        document.getElementById('creature-name').textContent = creature.nameJa;
        document.getElementById('encounter-log').innerHTML = 
            `<p>${creature.nameJa}が現れた！</p><p>${creature.description}</p>`;
        
        // 生物のビジュアル表示
        const creatureArt = document.getElementById('creature-art');
        creatureArt.style.backgroundImage = this.getCreatureVisual(creature);
    }
    
    getCreatureVisual(creature) {
        // 新しいレンダラーを使用して生物を描画
        if (window.creatureRenderer) {
            const imageData = window.creatureRenderer.renderCreature(creature, 300);
            return `url(${imageData})`;
        }
        
        // フォールバック
        const colors = {
            dragon: '#4B0082',
            beast: '#8B4513',
            bird: '#FF6347',
            hybrid: '#2F4F4F',
            demon: '#800000',
            fish: '#4682B4'
        };
        
        const color = colors[creature.type] || '#696969';
        return `radial-gradient(circle, ${color} 0%, transparent 70%)`;
    }
    
    attemptCapture() {
        if (!this.currentEncounter) return;
        
        const creature = this.currentEncounter;
        const captureRate = this.calculateCaptureRate(creature);
        
        if (Math.random() < captureRate) {
            this.creatureSystem.captureCreature(creature);
            this.showDialogue(`${creature.nameJa}を捕獲した！`);
            this.endEncounter();
        } else {
            this.showDialogue(`捕獲に失敗した！${creature.nameJa}は怒っている！`);
            this.battle();
        }
    }
    
    calculateCaptureRate(creature) {
        const rarityRates = {
            common: 0.6,
            uncommon: 0.4,
            rare: 0.2,
            legendary: 0.05
        };
        
        return rarityRates[creature.rarity] || 0.3;
    }
    
    battle() {
        if (!this.currentEncounter) return;
        
        this.showView('battle');
        this.initBattle(this.currentEncounter);
    }
    
    flee() {
        if (Math.random() < 0.7) {
            this.showDialogue('逃げ出した！');
            this.endEncounter();
        } else {
            this.showDialogue('逃げられなかった！');
            this.battle();
        }
    }
    
    observe() {
        if (!this.currentEncounter) return;
        
        const creature = this.currentEncounter;
        const info = `
            <p><strong>${creature.nameJa}</strong></p>
            <p>タイプ: ${creature.type}</p>
            <p>属性: ${creature.element}</p>
            <p>レアリティ: ${creature.rarity}</p>
            <p>HP: ${creature.stats.hp}</p>
            <p>攻撃力: ${creature.stats.attack}</p>
        `;
        
        document.getElementById('encounter-log').innerHTML = info;
    }
    
    initBattle(creature) {
        this.battleState = {
            enemy: {
                ...creature,
                currentHp: creature.stats.hp
            },
            playerTeam: this.creatureSystem.currentTeam.length > 0 ? 
                this.creatureSystem.currentTeam[0] : null,
            turn: 'player'
        };
        
        this.updateBattleDisplay();
    }
    
    updateBattleDisplay() {
        if (!this.battleState) return;
        
        const enemy = this.battleState.enemy;
        document.getElementById('enemy-name').textContent = enemy.nameJa;
        document.getElementById('enemy-hp').style.width = 
            `${(enemy.currentHp / enemy.stats.hp) * 100}%`;
        
        if (this.battleState.playerTeam) {
            const ally = this.battleState.playerTeam;
            document.getElementById('ally-name').textContent = ally.nameJa;
            document.getElementById('ally-hp').style.width = 
                `${(ally.currentHp / ally.stats.hp) * 100}%`;
        } else {
            document.getElementById('ally-name').textContent = this.player.name;
            document.getElementById('ally-hp').style.width = 
                `${(this.player.hp / this.player.maxHp) * 100}%`;
        }
    }
    
    attack() {
        if (!this.battleState || this.battleState.turn !== 'player') return;
        
        const damage = this.calculateDamage(20);
        this.battleState.enemy.currentHp -= damage;
        
        this.showBattleMessage(`${damage}のダメージを与えた！`);
        
        if (this.battleState.enemy.currentHp <= 0) {
            this.winBattle();
        } else {
            this.enemyTurn();
        }
        
        this.updateBattleDisplay();
    }
    
    useSkill() {
        // スキル使用（未実装）
        this.showDialogue('スキル機能は開発中です。');
    }
    
    useItem() {
        // アイテム使用（未実装）
        this.showDialogue('アイテム機能は開発中です。');
    }
    
    calculateDamage(baseDamage) {
        const variance = 0.2;
        const min = baseDamage * (1 - variance);
        const max = baseDamage * (1 + variance);
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    enemyTurn() {
        setTimeout(() => {
            const enemy = this.battleState.enemy;
            const damage = this.calculateDamage(enemy.stats.attack / 5);
            
            if (this.battleState.playerTeam) {
                this.battleState.playerTeam.currentHp -= damage;
                if (this.battleState.playerTeam.currentHp <= 0) {
                    this.loseBattle();
                    return;
                }
            } else {
                this.player.hp -= damage;
                this.updatePlayerDisplay();
                if (this.player.hp <= 0) {
                    this.gameOver();
                    return;
                }
            }
            
            this.showBattleMessage(`${enemy.nameJa}の攻撃！${damage}のダメージを受けた！`);
            this.battleState.turn = 'player';
            this.updateBattleDisplay();
        }, 1000);
    }
    
    winBattle() {
        const exp = this.battleState.enemy.stats.hp / 10;
        const gold = Math.floor(Math.random() * 50) + 10;
        
        this.player.experience += exp;
        this.player.gold += gold;
        
        this.showDialogue(`勝利！${exp}の経験値と${gold}ゴールドを獲得した！`);
        this.endEncounter();
    }
    
    loseBattle() {
        this.showDialogue('戦闘に敗れた...');
        this.player.hp = Math.floor(this.player.maxHp * 0.1);
        this.updatePlayerDisplay();
        this.endEncounter();
    }
    
    gameOver() {
        this.showDialogue('ゲームオーバー...');
        setTimeout(() => {
            this.showScreen('main-menu');
        }, 3000);
    }
    
    endEncounter() {
        this.currentEncounter = null;
        this.battleState = null;
        this.showView('exploration');
    }
    
    showBattleMessage(message) {
        // バトルメッセージ表示（簡易版）
        console.log(message);
    }
    
    updatePlayerDisplay() {
        document.querySelector('.hp-fill').style.width = 
            `${(this.player.hp / this.player.maxHp) * 100}%`;
        document.querySelector('.hp-text').textContent = 
            `HP: ${this.player.hp}/${this.player.maxHp}`;
        document.getElementById('spirit-points').textContent = this.player.spiritPower;
    }
    
    updateCollectionDisplay() {
        const grid = document.getElementById('collection-grid');
        grid.innerHTML = '';
        
        Object.values(CREATURES).forEach(creature => {
            const captured = this.creatureSystem.capturedCreatures.find(c => c.id === creature.id);
            const card = document.createElement('div');
            card.className = `creature-card ${captured ? '' : 'unknown'}`;
            
            if (captured) {
                card.innerHTML = `
                    <div class="creature-sprite-small" style="background-image: ${this.getCreatureVisual(creature)}"></div>
                    <h4>${creature.nameJa}</h4>
                    <p>${creature.type}</p>
                `;
            } else {
                card.innerHTML = `
                    <div class="creature-sprite"></div>
                    <h4>???</h4>
                    <p>未発見</p>
                `;
            }
            
            grid.appendChild(card);
        });
    }
    
    showDialogue(text) {
        const dialogueBox = document.getElementById('dialogue-box');
        const dialogueText = document.getElementById('dialogue-text');
        
        dialogueText.textContent = text;
        dialogueBox.style.display = 'block';
        
        this.dialogueQueue = [text];
    }
    
    nextDialogue() {
        const dialogueBox = document.getElementById('dialogue-box');
        dialogueBox.style.display = 'none';
    }
    
    handleEvent(event) {
        switch (event.type) {
            case 'blessing':
                this.player.hp = this.player.maxHp;
                this.player.spiritPower = this.player.maxSpiritPower;
                this.updatePlayerDisplay();
                this.showDialogue(`${event.name}：${event.description}`);
                break;
            case 'danger':
                const damage = Math.floor(this.player.maxHp * 0.1);
                this.player.hp -= damage;
                this.updatePlayerDisplay();
                this.showDialogue(`${event.name}：${damage}のダメージを受けた！`);
                break;
            case 'treasure':
                const gold = Math.floor(Math.random() * 100) + 50;
                this.player.gold += gold;
                this.showDialogue(`${event.name}：${gold}ゴールドを発見した！`);
                break;
            default:
                this.showDialogue(`${event.name}：${event.description}`);
        }
    }
}

// ゲームインスタンスの作成
const game = new Game();