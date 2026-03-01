const Board={game:null,
    init(gameInstance){
    this.game=gameInstance;
    },
    findAllMatches(){
        const matches=new Set();
        const board=this.game.board;
        const rows=this.game.rows;
        const cols=this.game.cols;
        for(let r=0;r<rows;r++){
            for(let c=0;c<cols-2;c++){
                const candy=board[r][c];
                const color=candy?.color;
                if(!color||candy.type ==='blocker' ||candy.special ==='color-bomb')continue;
                let matchLen=1;
                while (c+matchLen<cols &&
                       board[r][c+matchLen]?.color ===color &&
                       board[r][c+matchLen].type !=='blocker' &&
                       board[r][c+matchLen].special !=='color-bomb'){
                    matchLen++;
                }
                if (matchLen>=3){
                    for(let i=0;i<matchLen;i++){
                        matches.add(`${r},${c+i}`);
                    }
                }
                c+=matchLen-1;
            }
        }
        // vertical matches
        for (let c=0;c<cols;c++){
            for(let r=0;r<rows-2;r++){
                const candy=board[r][c];
                const color=candy?.color;
                if(!color ||candy.type ==='blocker' ||candy.special ==='color-bomb')continue;
                let matchLen=1;
                while(r+matchLen<rows &&
                       board[r+matchLen][c]?.color ===color &&
                       board[r+matchLen][c].type !=='blocker' &&
                       board[r+matchLen][c].special !=='color-bomb'){
                    matchLen++;
                }
                if(matchLen>=3){
                    for(let i=0;i<matchLen;i++){
                        matches.add(`${r + i},${c}`);
                    }
                }
                r+=matchLen-1;
            }
        }
        return [...matches].map(k=>{
            const [r,c] =k.split(',').map(Number);
            return{r,c};
        });
    },
    findMatchShapes(){
        const hMatches=[];
        const vMatches=[];
        const board=this.game.board;
        const rows=this.game.rows;
        const cols=this.game.cols;
        // find horizontal matches
        for (let r=0;r<rows;r++) {
            let c=0;
            while(c<cols){
                const candy=board[r][c];
                const color=candy?.color;
                if (!color ||candy.type ==='blocker' || candy.special ==='color-bomb'){
                    c++;
                    continue;
                }
                
                let end=c+1;
                while (end<cols && board[r][end]?.color ===color && 
                       board[r][end].type !=='blocker' && 
                       board[r][end].special !=='color-bomb') end++;
                
                const len=end-c;
                if (len>=3) {
                    const cells=[];
                    for (let i=c;i<end;i++)cells.push({r,c:i});
                    hMatches.push({cells,len,dir:'h',color,startR:r,startC:c,endC:end-1});
                }
                c=end;
            }
        }
        // find vertical matches
        for (let c=0;c<cols;c++){
            let r=0;
            while (r<rows){
                const candy=board[r][c];
                const color=candy?.color;
                if(!color || candy.type ==='blocker' || candy.special ==='color-bomb'){
                    r++;
                    continue;
                }
                
                let end=r+1;
                while (end<rows && board[end][c]?.color ===color && 
                       board[end][c].type !=='blocker' && 
                       board[end][c].special !=='color-bomb')end++;
                
                const len =end-r;
                if (len>=3) {
                    const cells = [];
                    for (let i=r;i<end;i++)cells.push({r:i,c});
                    vMatches.push({cells,len,dir:'v',color,startR:r,endR:end-1,startC:c});
                }
                r=end;
            }
        }

        // find L and T shapes
        const ltShapes=[];
        const usedH=new Set();
        const usedV=new Set();

        for(let hi=0;hi<hMatches.length;hi++){
            for(let vi=0;vi<vMatches.length;vi++){
                const h=hMatches[hi];
                const v=vMatches[vi];
                if(h.color !==v.color)continue;
                const intersection=h.cells.find(hc=> 
                    v.cells.find(vc=>vc.r===hc.r && vc.c===hc.c)
                );
                if(intersection){
                    const mergedCells =[...h.cells];
                    for(const vc of v.cells){
                        if(!mergedCells.find(mc => mc.r === vc.r && mc.c === vc.c)){
                            mergedCells.push(vc);
                        }
                    }
                    ltShapes.push({
                        cells:mergedCells,
                        len:mergedCells.length,
                        dir:'lt',
                        color:h.color,
                        intersection
                    });
                    usedH.add(hi);
                    usedV.add(vi);
                }
            }
        }
        const shapes =[...ltShapes];
        for(let i=0;i<hMatches.length;i++){
            if(!usedH.has(i))shapes.push(hMatches[i]);
        }
        for(let i=0;i<vMatches.length;i++) {
            if(!usedV.has(i))shapes.push(vMatches[i]);
        }
        return shapes;
    },

    swap(r1,c1,r2,c2){
        const temp=this.game.board[r1][c1];
        this.game.board[r1][c1]=this.game.board[r2][c2];
        this.game.board[r2][c2]=temp;
    },
    applyGravity(){
        for(let c=0;c<this.game.cols;c++){
            let writeRow=this.game.rows-1;
            for(let r =this.game.rows-1;r>= 0;r--){
                if(this.game.board[r][c] && this.game.board[r][c].type ==='blocker'){
                    writeRow=r-1;
                    continue;
                }
                if(this.game.board[r][c]){
                    if(writeRow !== r){
                        this.game.board[writeRow][c]=this.game.board[r][c];
                        this.game.board[r][c]=null;
                    }
                    writeRow--;
                }
            }
        }
    },
    
    fillEmpty(){
        for(let r=0; r<this.game.rows;r++){
            for(let c=0;c<this.game.cols;c++){
                if(!this.game.board[r][c]){
                    this.game.board[r][c]=Utils.createCandy(this.game.colors);
                }
            }
        }
    },
    
    checkAdjacentBlockers(r,c){
        for(const [dr, dc] of DIRECTIONS){
            const nr=r+dr;
            const nc=c+dc;
            if (nr >=0 && nr<this.game.rows && nc>=0 && nc<this.game.cols){
                if(this.game.board[nr][nc]?.type==='blocker'){
                    this.game.board[nr][nc]=null;
                }
            }
        }
    },
    findValidMove(){
        for (let r=0;r<this.game.rows;r++) {
            for (let c=0;c<this.game.cols;c++){
                if (this.game.board[r][c]?.type==='blocker')continue;
                const isColorBomb = this.game.board[r][c]?.special === 'color-bomb';
                // check right
                if (c + 1 < this.game.cols && this.game.board[r][c + 1]?.type !== 'blocker') {
                    if (isColorBomb || this.game.board[r][c + 1]?.special === 'color-bomb') {
                        return { from: { r, c }, to: { r, c: c + 1 } };
                    }
                    this.swap(r, c, r, c + 1);
                    const m = this.findAllMatches();
                    this.swap(r, c, r, c + 1);
                    if (m.length > 0) return { from: { r, c }, to: { r, c: c + 1 } };
                }
                
                // Check down
                if (r + 1 < this.game.rows && this.game.board[r + 1][c]?.type !== 'blocker') {
                    if (isColorBomb || this.game.board[r + 1]?.[c]?.special === 'color-bomb') {
                        return { from: { r, c }, to: { r: r + 1, c } };
                    }
                    this.swap(r, c, r + 1, c);
                    const m = this.findAllMatches();
                    this.swap(r, c, r + 1, c);
                    if (m.length > 0) return { from: { r, c }, to: { r: r + 1, c } };
                }
            }
        }
        return null;
    },
    
    hasValidMoves() {
        return !!this.findValidMove();
    }
};  