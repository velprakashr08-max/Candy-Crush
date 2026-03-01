const UI ={boardEl:null,scorePopups:null,toastContainer:null,
    init(){
this.boardEl=document.getElementById('game-board');
this.scorePopups=document.getElementById('score-popups');
this.toastContainer=document.getElementById('toast-container');
},
renderBoard(game){
 this.boardEl.innerHTML='';
const existingBanner=document.querySelector('.swap-mode-banner');
  if(existingBanner)existingBanner.remove();
        for(let r=0;r<game.rows;r++){
            for(let c=0;c<game.cols;c++){
            const cell=this.createCell(r,c,game);
            this.boardEl.appendChild(cell);
     } }
},
createCell(r,c,game){
        const cell=document.createElement('div');
        cell.className='candy-cell';
        cell.dataset.row=r;
        cell.dataset.col=c;

        const candy=game.board[r][c];   
        if (candy && candy.type ==='blocker'){
            cell.classList.add('blocker');
            const img=document.createElement('img');
            img.src=candy.img;
            img.className='candy-img';
            img.draggable=false;
            cell.appendChild(img);
        } else if (candy && (candy.color || candy.special ==='color-bomb')) {
            const img=document.createElement('img');
            img.src=candy.special ? Utils.getSpecialImg(candy.color,candy.special):candy.img;
            img.className='candy-img';
            img.draggable=false;
            cell.appendChild(img);
            if (candy.special){
                cell.classList.add('special-glow');
                if(candy.special ==='color-bomb'){
                cell.classList.add('color-bomb-cell');
                }
            }
        }

        if (game.selected && game.selected.r === r && game.selected.c ===c){
            cell.classList.add('selected');
        }
        if(game.swapMode){
            cell.classList.add('swap-mode-active');
            if (game.swapFirst && game.swapFirst.r === r && game.swapFirst.c === c){
                cell.classList.add('swap-selected');
            }
        }

        return cell;
    },
    updateCellVisual(r,c,game){
        const idx=r*game.cols + c;
        const cell=this.boardEl.children[idx];
        if(!cell) return;
        const candy=game.board[r][c];
        cell.innerHTML='';
        cell.className='candy-cell';
        if (!candy || (!candy.color && candy.special !=='color-bomb')) {
            if (candy && candy.type==='blocker') {
                cell.classList.add('blocker');
                const img=document.createElement('img');
                img.src=candy.img;
                img.className='candy-img';
                img.draggable=false;
                cell.appendChild(img);
            }
            return;
        }

        const img=document.createElement('img');
        img.src=candy.special ? Utils.getSpecialImg(candy.color,candy.special):candy.img;
        img.className='candy-img';
        img.draggable=false;
        cell.appendChild(img);

        if(candy.special){
            cell.classList.add('special-glow');
            if (candy.special==='color-bomb') {
                cell.classList.add('color-bomb-cell');
            }
        }
    },
    
    showScorePopup(r,c,text,big=false){
        const popup=document.createElement('div');
        popup.className='score-popup'+(big?'big':'');
        popup.textContent=text;
        const cellSize=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--candy-size'));
        const gap=3; 
        popup.style.left=`${c*(cellSize+gap)+cellSize/2}px`;
        popup.style.top=`${r*(cellSize+gap)}px`;
        this.scorePopups.appendChild(popup);
        setTimeout(()=>popup.remove(),1200);
    },
    
    highlightSelected(r,c,game) {
        this.boardEl.querySelectorAll('.candy-cell.selected').forEach(el=>el.classList.remove('selected'));
        const idx=r*game.cols+c;
        if(this.boardEl.children[idx])this.boardEl.children[idx].classList.add('selected');
    },
    clearHighlight(){
        this.boardEl.querySelectorAll('.candy-cell.selected').forEach(el=>el.classList.remove('selected'));
    },
    updateLevelCards(){
        LEVELS.forEach(lv=>{
            const card=document.querySelector(`.level-card[data-level="${lv.id}"]`);
            if (!card) return;
            const unlocked=lv.id<=Storage.savedData.unlockedLevel;
            card.classList.toggle('unlocked',unlocked);
            card.classList.toggle('locked',!unlocked);
            const lock=card.querySelector('.lock-overlay');
            const playBtn=card.querySelector('.level-play-btn');
            if(unlocked){
                if(lock) lock.style.display='none';
                playBtn.disabled=false;
                playBtn.textContent='PLAY';}
           else{
                if(lock)lock.style.display ='flex';
                playBtn.disabled=true;
                playBtn.textContent='LOCKED';
            }
            let bestEl=card.querySelector('.node-best');
            const best =Storage.savedData.bestScores[lv.id] ||0;
            if (best>0){
                if(!bestEl){
                    bestEl=document.createElement('div');
                    bestEl.className='node-best';
                    const nameEl=card.querySelector('.node-name');
                    if(nameEl)nameEl.after(bestEl);
                }
                bestEl.textContent='Best:' + best.toLocaleString();
            } else if(bestEl){
                bestEl.remove();
            }
            const starsContainer = document.getElementById(`stars-${lv.id}`);
            if (starsContainer) {
                const earned = Storage.savedData.levelStars[lv.id] || 0;
                const spans = starsContainer.querySelectorAll('.star');
                spans.forEach((s, i) => {
                    s.classList.toggle('earned', i < earned);
                });
            }
        });
    },
    
    renderProfile() {
        const { name, avatar } = Storage.savedData.profile;
        
        const hudAvEls = [document.getElementById('hud-avatar'), document.getElementById('level-hud-avatar')];
        const hudNmEls = [document.getElementById('hud-name'), document.getElementById('level-hud-name')];
        
        hudAvEls.forEach(el => { if (el) el.textContent = avatar; });
        hudNmEls.forEach(el => { if (el) el.textContent = name || 'Player'; });
    },
    
    renderCoins() {
        const coins = Storage.savedData.coins || 0;
        document.querySelectorAll('.coin-count-display').forEach(el => el.textContent = coins.toLocaleString());
    },
    
    renderPowerupBar() {
        const inv = Storage.savedData.inventory;
        
        ['rowBlast', 'colBlast', 'wrappedBlast', 'colorBomb', 'extraMoves'].forEach(key => {
            const countEl = document.getElementById(`pu-count-${key}`);
            const btn = document.getElementById(`pu-${key}`);
            const qty = inv[key] || 0;
            
            if (countEl) countEl.textContent = qty;
            if (btn) {
                btn.disabled = qty <= 0;
                btn.classList.toggle('pu-empty', qty <= 0);
            }
        });
    },
    
    updateGameUI(game) {
        document.getElementById('target-score').textContent = Math.ceil(game.target * game.levelData.star1).toLocaleString();
        document.getElementById('current-score').textContent = game.score.toLocaleString();
        document.getElementById('moves-left').textContent = game.moves;
        
        const pct = Math.min(100, (game.score / game.target) * 100);
        document.getElementById('progress-fill').style.width = `${pct}%`;

        const ld = game.levelData;
        if (pct >= ld.star1 * 100 && !document.getElementById('pstar1').classList.contains('earned')) {
            document.getElementById('pstar1').classList.add('earned');
            AudioManager.play('star');
        }
        if (pct >= ld.star2 * 100 && !document.getElementById('pstar2').classList.contains('earned')) {
            document.getElementById('pstar2').classList.add('earned');
            AudioManager.play('star');
        }
        if (pct >= ld.star3 * 100 && !document.getElementById('pstar3').classList.contains('earned')) {
            document.getElementById('pstar3').classList.add('earned');
            AudioManager.play('star');
        }
    },
    
    showSwapModeBanner(onCancel) {
        const banner = document.createElement('div');
        banner.className = 'swap-mode-banner';
        banner.innerHTML = 'Pick 2 candies to swap <button class="cancel-swap"><i class="icon-close"></i></button>';
        banner.querySelector('.cancel-swap').addEventListener('click', onCancel);
        document.querySelector('.board-wrapper').appendChild(banner);
        return banner;
    }
};