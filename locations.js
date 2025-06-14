// 山海経の世界の場所データベース
const LOCATIONS = {
    eastern_mountains: {
        id: 'eastern_mountains',
        name: '東方青山',
        nameJa: 'トウホウセイザン',
        description: '青龍が住む神聖な山脈。雷雲が常に頂上を覆っている。',
        bgColor: '#2E4057',
        creatures: ['qinglong', 'spirit_fish', 'shanhai_rabbit'],
        items: ['thunder_stone', 'dragon_scale'],
        events: [
            {
                id: 'dragon_shrine',
                name: '龍の祠',
                type: 'blessing',
                description: '古代の祠で祈ると、霊力が回復する。'
            }
        ]
    },
    
    western_plains: {
        id: 'western_plains',
        name: '西方白原',
        nameJa: 'セイホウハクゲン',
        description: '白虎が支配する広大な平原。金属鉱物が豊富。',
        bgColor: '#D4AF37',
        creatures: ['baihu', 'pixiu', 'shanhai_rabbit'],
        items: ['metal_ore', 'tiger_fang'],
        events: [
            {
                id: 'metal_vein',
                name: '金属鉱脈',
                type: 'resource',
                description: '珍しい金属を発見できる。'
            }
        ]
    },
    
    southern_volcano: {
        id: 'southern_volcano',
        name: '南方朱山',
        nameJa: 'ナンポウシュザン',
        description: '朱雀が舞う活火山。永遠の炎が燃え続ける。',
        bgColor: '#8B0000',
        creatures: ['zhuque', 'fenghuang'],
        items: ['fire_crystal', 'phoenix_feather'],
        events: [
            {
                id: 'lava_pool',
                name: '溶岩池',
                type: 'danger',
                description: '熱い溶岩でダメージを受ける可能性がある。'
            }
        ]
    },
    
    northern_lake: {
        id: 'northern_lake',
        name: '北方玄湖',
        nameJa: 'ホッポウゲンコ',
        description: '玄武が眠る神秘的な湖。深い霧に包まれている。',
        bgColor: '#1E3A8A',
        creatures: ['xuanwu', 'spirit_fish'],
        items: ['water_pearl', 'turtle_shell'],
        events: [
            {
                id: 'misty_shore',
                name: '霧の岸辺',
                type: 'mystery',
                description: '濃い霧の中で不思議な出会いがある。'
            }
        ]
    },
    
    mystic_forest: {
        id: 'mystic_forest',
        name: '幻妖の森',
        nameJa: 'ゲンヨウノモリ',
        description: '九尾狐が潜む魔法の森。幻覚が見える。',
        bgColor: '#2F4F4F',
        creatures: ['jiuwei', 'shanhai_rabbit'],
        items: ['illusion_herb', 'fox_tail'],
        events: [
            {
                id: 'illusion_trap',
                name: '幻術の罠',
                type: 'trap',
                description: '道に迷う可能性がある。'
            }
        ]
    },
    
    dark_cave: {
        id: 'dark_cave',
        name: '暗黒洞窟',
        nameJa: 'アンコクドウクツ',
        description: '饕餮が住む恐ろしい洞窟。光が届かない。',
        bgColor: '#1A1A1A',
        creatures: ['taotie'],
        items: ['dark_gem', 'demon_horn'],
        events: [
            {
                id: 'hungry_beast',
                name: '飢えた獣',
                type: 'battle',
                description: '空腹な生物に襲われる。'
            }
        ]
    },
    
    sacred_mountain: {
        id: 'sacred_mountain',
        name: '神聖山',
        nameJa: 'シンセイザン',
        description: '鳳凰が巣を作る聖なる山。祝福の地。',
        bgColor: '#FFD700',
        creatures: ['fenghuang', 'spirit_fish'],
        items: ['blessing_charm', 'sacred_flower'],
        events: [
            {
                id: 'divine_blessing',
                name: '神の祝福',
                type: 'blessing',
                description: '全ての状態が回復する。'
            }
        ]
    },
    
    treasure_valley: {
        id: 'treasure_valley',
        name: '宝谷',
        nameJa: 'タカラダニ',
        description: '貔貅が守る宝物の谷。金運上昇の地。',
        bgColor: '#B8860B',
        creatures: ['pixiu', 'shanhai_rabbit'],
        items: ['gold_nugget', 'lucky_coin'],
        events: [
            {
                id: 'treasure_chest',
                name: '宝箱',
                type: 'treasure',
                description: '貴重なアイテムを発見できる。'
            }
        ]
    },
    
    grassland: {
        id: 'grassland',
        name: '霊草原',
        nameJa: 'レイソウゲン',
        description: '平和な草原。初心者に最適な場所。',
        bgColor: '#228B22',
        creatures: ['shanhai_rabbit', 'spirit_fish'],
        items: ['healing_grass', 'spirit_berry'],
        events: [
            {
                id: 'peaceful_meadow',
                name: '平和な草地',
                type: 'rest',
                description: '安全に休憩できる。'
            }
        ]
    },
    
    spirit_pond: {
        id: 'spirit_pond',
        name: '霊泉',
        nameJa: 'レイセン',
        description: '霊力に満ちた神秘的な泉。',
        bgColor: '#4682B4',
        creatures: ['spirit_fish'],
        items: ['spirit_water', 'mystic_algae'],
        events: [
            {
                id: 'spirit_spring',
                name: '霊力の泉',
                type: 'restore',
                description: '霊力が完全に回復する。'
            }
        ]
    }
};

// 場所管理システム
class LocationSystem {
    constructor() {
        this.currentLocation = 'grassland';
        this.visitedLocations = ['grassland'];
        this.unlockedLocations = ['grassland', 'spirit_pond'];
    }
    
    getLocationInfo(locationId) {
        return LOCATIONS[locationId] || LOCATIONS.grassland;
    }
    
    getCurrentLocation() {
        return this.getLocationInfo(this.currentLocation);
    }
    
    canTravelTo(locationId) {
        return this.unlockedLocations.includes(locationId);
    }
    
    travelTo(locationId) {
        if (this.canTravelTo(locationId)) {
            this.currentLocation = locationId;
            if (!this.visitedLocations.includes(locationId)) {
                this.visitedLocations.push(locationId);
            }
            return true;
        }
        return false;
    }
    
    unlockLocation(locationId) {
        if (!this.unlockedLocations.includes(locationId)) {
            this.unlockedLocations.push(locationId);
            return true;
        }
        return false;
    }
    
    getRandomEvent() {
        const location = this.getCurrentLocation();
        if (location.events && location.events.length > 0) {
            return location.events[Math.floor(Math.random() * location.events.length)];
        }
        return null;
    }
    
    getAvailableCreatures() {
        const location = this.getCurrentLocation();
        return location.creatures || [];
    }
    
    getAvailableItems() {
        const location = this.getCurrentLocation();
        return location.items || [];
    }
    
    getAllLocations() {
        return Object.values(LOCATIONS);
    }
    
    getUnlockedLocations() {
        return this.unlockedLocations.map(id => this.getLocationInfo(id));
    }
}