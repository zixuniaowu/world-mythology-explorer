// 山海経の生物データベース
const CREATURES = {
    // 東方の生物
    qinglong: {
        id: 'qinglong',
        name: '青龍',
        nameJa: 'セイリュウ',
        description: '東方を守護する神聖な龍。雷と嵐を操る。',
        type: 'dragon',
        element: 'thunder',
        rarity: 'legendary',
        stats: {
            hp: 500,
            attack: 120,
            defense: 100,
            speed: 90,
            spirit: 150
        },
        skills: [
            { name: '雷撃', damage: 50, cost: 30 },
            { name: '龍の咆哮', damage: 80, cost: 50 }
        ],
        habitat: 'eastern_mountains'
    },
    
    baihu: {
        id: 'baihu',
        name: '白虎',
        nameJa: 'ビャッコ',
        description: '西方を守護する神獣。風と金属を操る。',
        type: 'beast',
        element: 'metal',
        rarity: 'legendary',
        stats: {
            hp: 450,
            attack: 140,
            defense: 110,
            speed: 100,
            spirit: 120
        },
        skills: [
            { name: '鋼の爪', damage: 60, cost: 25 },
            { name: '虎の猛襲', damage: 90, cost: 45 }
        ],
        habitat: 'western_plains'
    },
    
    zhuque: {
        id: 'zhuque',
        name: '朱雀',
        nameJa: 'スザク',
        description: '南方を守護する不死鳥。炎と再生の力を持つ。',
        type: 'bird',
        element: 'fire',
        rarity: 'legendary',
        stats: {
            hp: 400,
            attack: 130,
            defense: 80,
            speed: 120,
            spirit: 140
        },
        skills: [
            { name: '火炎翼', damage: 55, cost: 30 },
            { name: '不死鳥の炎', damage: 100, cost: 60 }
        ],
        habitat: 'southern_volcano'
    },
    
    xuanwu: {
        id: 'xuanwu',
        name: '玄武',
        nameJa: 'ゲンブ',
        description: '北方を守護する亀と蛇の合体神獣。水と氷を操る。',
        type: 'hybrid',
        element: 'water',
        rarity: 'legendary',
        stats: {
            hp: 600,
            attack: 90,
            defense: 150,
            speed: 60,
            spirit: 130
        },
        skills: [
            { name: '氷の盾', damage: 0, cost: 20, effect: 'defense_up' },
            { name: '玄武の波動', damage: 70, cost: 40 }
        ],
        habitat: 'northern_lake'
    },
    
    // 一般的な生物
    jiuwei: {
        id: 'jiuwei',
        name: '九尾狐',
        nameJa: 'キュウビノキツネ',
        description: '九つの尾を持つ妖狐。幻術を使う。',
        type: 'beast',
        element: 'psychic',
        rarity: 'rare',
        stats: {
            hp: 280,
            attack: 90,
            defense: 70,
            speed: 110,
            spirit: 120
        },
        skills: [
            { name: '幻術', damage: 40, cost: 20, effect: 'confuse' },
            { name: '九尾の呪い', damage: 65, cost: 35 }
        ],
        habitat: 'mystic_forest'
    },
    
    taotie: {
        id: 'taotie',
        name: '饕餮',
        nameJa: 'トウテツ',
        description: '貪欲な怪物。すべてを食べ尽くす。',
        type: 'demon',
        element: 'dark',
        rarity: 'rare',
        stats: {
            hp: 350,
            attack: 110,
            defense: 90,
            speed: 70,
            spirit: 80
        },
        skills: [
            { name: '暴食', damage: 50, cost: 25, effect: 'heal_self' },
            { name: '闇の顎', damage: 75, cost: 40 }
        ],
        habitat: 'dark_cave'
    },
    
    fenghuang: {
        id: 'fenghuang',
        name: '鳳凰',
        nameJa: 'ホウオウ',
        description: '美しい霊鳥。幸運をもたらす。',
        type: 'bird',
        element: 'light',
        rarity: 'rare',
        stats: {
            hp: 250,
            attack: 100,
            defense: 60,
            speed: 130,
            spirit: 110
        },
        skills: [
            { name: '祝福の光', damage: 0, cost: 15, effect: 'heal_all' },
            { name: '鳳凰の舞', damage: 60, cost: 30 }
        ],
        habitat: 'sacred_mountain'
    },
    
    pixiu: {
        id: 'pixiu',
        name: '貔貅',
        nameJa: 'ヒキュウ',
        description: '財運を呼ぶ神獣。宝物を守る。',
        type: 'beast',
        element: 'earth',
        rarity: 'uncommon',
        stats: {
            hp: 300,
            attack: 80,
            defense: 100,
            speed: 80,
            spirit: 90
        },
        skills: [
            { name: '金運上昇', damage: 0, cost: 20, effect: 'gold_bonus' },
            { name: '地震撃', damage: 55, cost: 30 }
        ],
        habitat: 'treasure_valley'
    },
    
    // コモン生物
    shanhai_rabbit: {
        id: 'shanhai_rabbit',
        name: '山海兎',
        nameJa: 'サンカイウサギ',
        description: '霊力を持つ不思議な兎。',
        type: 'beast',
        element: 'normal',
        rarity: 'common',
        stats: {
            hp: 150,
            attack: 50,
            defense: 40,
            speed: 100,
            spirit: 60
        },
        skills: [
            { name: '跳躍攻撃', damage: 25, cost: 10 },
            { name: '月光の加護', damage: 0, cost: 15, effect: 'speed_up' }
        ],
        habitat: 'grassland'
    },
    
    spirit_fish: {
        id: 'spirit_fish',
        name: '霊魚',
        nameJa: 'レイギョ',
        description: '神秘的な光を放つ魚。',
        type: 'fish',
        element: 'water',
        rarity: 'common',
        stats: {
            hp: 120,
            attack: 40,
            defense: 50,
            speed: 90,
            spirit: 70
        },
        skills: [
            { name: '水流弾', damage: 20, cost: 10 },
            { name: '癒しの光', damage: 0, cost: 20, effect: 'heal' }
        ],
        habitat: 'spirit_pond'
    }
};

// 生物遭遇システム
class CreatureSystem {
    constructor() {
        this.capturedCreatures = [];
        this.currentTeam = [];
        this.maxTeamSize = 3;
    }
    
    getCreaturesByHabitat(habitat) {
        return Object.values(CREATURES).filter(c => c.habitat === habitat);
    }
    
    getRandomCreature(habitat) {
        const availableCreatures = this.getCreaturesByHabitat(habitat);
        if (availableCreatures.length === 0) {
            // デフォルトのコモン生物を返す
            return CREATURES.shanhai_rabbit;
        }
        
        // レアリティに基づく確率
        const rarityWeights = {
            common: 60,
            uncommon: 30,
            rare: 9,
            legendary: 1
        };
        
        const weightedCreatures = [];
        availableCreatures.forEach(creature => {
            const weight = rarityWeights[creature.rarity] || 10;
            for (let i = 0; i < weight; i++) {
                weightedCreatures.push(creature);
            }
        });
        
        return weightedCreatures[Math.floor(Math.random() * weightedCreatures.length)];
    }
    
    captureCreature(creature) {
        if (!this.capturedCreatures.find(c => c.id === creature.id)) {
            this.capturedCreatures.push({
                ...creature,
                level: 1,
                experience: 0,
                currentHp: creature.stats.hp
            });
            return true;
        }
        return false;
    }
    
    addToTeam(creatureId) {
        if (this.currentTeam.length >= this.maxTeamSize) {
            return false;
        }
        
        const creature = this.capturedCreatures.find(c => c.id === creatureId);
        if (creature && !this.currentTeam.find(c => c.id === creatureId)) {
            this.currentTeam.push(creature);
            return true;
        }
        return false;
    }
    
    removeFromTeam(creatureId) {
        this.currentTeam = this.currentTeam.filter(c => c.id !== creatureId);
    }
    
    healTeam() {
        this.currentTeam.forEach(creature => {
            creature.currentHp = creature.stats.hp;
        });
    }
    
    getCreatureInfo(creatureId) {
        return CREATURES[creatureId] || null;
    }
}