const Storage = {
    savedData: {
        levelStars: {},
        bestScores: {},
        unlockedLevel: 1,
        coins: 100,
        inventory: {
            extraMoves: 0,
            rowBlast: 0,
            colBlast: 0,
            colorBomb: 0,
            wrappedBlast: 0
        },
        profile: {
            name: 'Player',
            avatar: '🍬',
            gamesPlayed: 0,
            levelsWon: 0
        }
    },
    
    load() {
        try {
            const d = JSON.parse(localStorage.getItem('candyCrushSaga'));
            if (d) {
                this.savedData = {
                    ...this.savedData,
                    ...d,
                    profile: { ...this.savedData.profile, ...(d.profile || {}) },
                    inventory: { ...this.savedData.inventory, ...(d.inventory || {}) },
                };
            }
        } catch (e) {
            console.error('Failed to load saved data', e);
        }
        return this.savedData;
    },
    
    save() {
        localStorage.setItem('candyCrushSaga', JSON.stringify(this.savedData));
    },
    
    updateLevelProgress(level, score, stars) {
        const prevStars = this.savedData.levelStars[level] || 0;
        this.savedData.levelStars[level] = Math.max(prevStars, stars);
        
        const prevBest = this.savedData.bestScores[level] || 0;
        this.savedData.bestScores[level] = Math.max(prevBest, score);
        
        if (level >= this.savedData.unlockedLevel && level < LEVELS.length) {
            this.savedData.unlockedLevel = level + 1;
        }
        
        this.savedData.profile.levelsWon = (this.savedData.profile.levelsWon || 0) + 1;
        this.savedData.profile.gamesPlayed = (this.savedData.profile.gamesPlayed || 0) + 1;
        
        this.save();
    },
    
    addCoins(amount) {
        this.savedData.coins += amount;
        this.save();
    },
    
    usePowerup(key) {
        if (this.savedData.inventory[key] > 0) {
            this.savedData.inventory[key]--;
            this.save();
            return true;
        }
        return false;
    },
    
    buyPowerup(key, cost) {
        if (this.savedData.coins >= cost) {
            this.savedData.coins -= cost;
            this.savedData.inventory[key] = (this.savedData.inventory[key] || 0) + 1;
            this.save();
            return true;
        }
        return false;
    }
};