const ROWS = 6;
const COLUMNS = 7;
const MARGIN_RADIUS = 10;
const PROGRESS_BAR_HEIGHT = 15;
const O = 0;
const X = 1;
const EMPTY = -1;
const BOARD_FILL_STYLE = '#3879e0';

function getCanvas() {
    const canvas = document.getElementById('canvas');
    const windowWidth  = window.innerWidth;
    const windowHeight = window.innerHeight - PROGRESS_BAR_HEIGHT;
    
    const cellWidth = Math.min(Math.floor(windowWidth  / COLUMNS),
                               Math.floor(windowHeight / ROWS));
                               
    const canvasContext = canvas.getContext('2d');
    
    canvasContext.canvas.width  = cellWidth * COLUMNS;
    canvasContext.canvas.height = cellWidth * ROWS;
    
    return canvas;
};

class ConnectFourBoard {
    static ROWS = 6;
    static COLUMNS = 7;
    static VICTORY_LENGTH = 4;
    
    #boardData;
        
    #getCellChar(cellCharacter) {
        switch (cellCharacter) {
            case X:
                return "X";
                
            case O:
                return "O";
                
            case EMPTY:
                return " ";
                
            default:
                throw "Should not get here.";
        }
    }
    
    constructor(other) {
        if (arguments.length === 1) {
            this.#boardData = [...other.#boardData];
        } else {
            this.#boardData = Array(ConnectFourBoard.ROWS *
                                    ConnectFourBoard.COLUMNS);
                            
            for (let i = 0, end = this.#boardData.length; i < end; i++) {
                this.#boardData[i] = EMPTY;
            }
        }
    }
    
    get(x, y) {
        return this.#boardData[y * ConnectFourBoard.COLUMNS + x];
    }
    
    set(x, y, playerType) {
        this.#boardData[y * ConnectFourBoard.COLUMNS + x] = playerType;
    }
    
    toString() {
        let str = "";
        
        for (let y = 0; y < ConnectFourBoard.ROWS; y++) {
            for (let x = 0; x < ConnectFourBoard.COLUMNS; x++) {
                str += "|";
                str += this.#getCellChar(this.get(x, y));
            }
            
            str += "|\n";
        }
        
        str += "+-+-+-+-+-+-+-+\n";
        str += " 1 2 3 4 5 6 7";
        
        return str;
    }
    
    isTie() {
        for (let x = 0; x < COLUMNS; x++) {
            if (this.get(x, 0) === EMPTY) {
                return false;
            }
        }
        
        return true;
    }
    
    makePly(x, playerType) {
        for (let y = ROWS - 1; y >= 0; y--) {
            if (this.get(x, y) === EMPTY) {
                this.set(x, y, playerType);
                return true;
            }
        }
        
        return false;
    }
    
    unmakePly(x) {
        for (let y = 0; y < ROWS; y++) {
            if (this.get(x, y) !== EMPTY) {
                this.set(x, y, EMPTY);
                return;
            }
        }
    }
    
    isTerminal() {
        return this.isWinningFor(O) ||
               this.isWinningFor(X) ||
               this.isTie();
    }
    
    getWinningPattern() {
        if (!this.isWinningFor(X) &&
            !this.isWinningFor(O)) {
            return null;
        }
        
        let winningPattern = null;
        
        for (let length = ROWS; length >= ConnectFourBoard.VICTORY_LENGTH; length--) {
        
            // Try load the vertical winning pattern:
            winningPattern = 
                    tryLoadVerticalWinningPattern(X, length);

            if (winningPattern !== null) {
                return winningPattern;
            }
        
            winningPattern = 
                    tryLoadVerticalWinningPattern(O, length);

            if (winningPattern !== null) {
                return winningPattern;
            }
            
            // Try to load the ascending winning pattern:
            winningPattern =
                tryLoadAscendingWinningPattern(X, length);
        
            if (winningPattern !== null) {
                return winningPattern;
            }
            
            winningPattern =
                tryLoadAscendingWinningPattern(O, length);
        
            if (winningPattern !== null) {
                return winningPattern;
            }

            // Try to load the descending winning pattern:
            winningPattern = 
                    tryLoadDescendingWinningPattern(X, length);

            if (winningPattern !== null) {
                return winningPattern;
            }

            winningPattern = 
                    tryLoadDescendingWinningPattern(O, length);
            
            if (winningPattern !== null) {
                return winningPattern;
            }
        }

        for (let length = COLUMNS; length >= ConnectFourBoard.VICTORY_LENGTH; length--) {
            
            winningPattern = 
                    tryLoadHorizontalWinningPattern(X, length);
            
            if (winningPattern !== null) {
                return winningPattern;
            }
            
            winningPattern = 
                    tryLoadHorizontalWinningPattern(O, length);
            
            if (winningPattern !== null) {
                return winningPattern;
            }
        }
        
        throw "Should not get here.";
    }
    
    hasHorizontalStreak(playerType, length) {
        const lastX = COLUMNS - length;
        
        for (let y = ROWS - 1; y >= 0; y--) {
            horizontalCheck:
            
            for (let x = 0; x <= lastX; x++) {
                
                for (let i = 0; i < length; i++) {
                    if (this.get(x + i, y) !== playerType) {
                        continue horizontalCheck;
                    }
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    hasVerticalStreak(playerType, length) {
        const lastY = ROWS - length;
        
        for (let x = 0; x < COLUMNS; x++) {
            verticalCheck:
            
            for (let y = 0; y <= lastY; y++) {
                for (let i = 0; i < length; i++) {
                    if (this.get(x, y + i) !== playerType) {
                        continue verticalCheck;
                    }
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    hasAscendingDiagonalStreak(playerType, length) {
        
        const lastX = COLUMNS - length;
        const lastY = length - 1;
        
        for (let y = ROWS - 1; y >= lastY; y--) {
            diagonalCheck:
            
            for (let x = 0; x <= lastX; x++) {
                for (let i = 0; i < length; i++) {
                    if (this.get(x + i, y - i) !== playerType) {
                        continue diagonalCheck;
                    }
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    hasDescendingDiagonalStreak(playerType, length) {
        
        const firstX = length - 1;
        const lastY  = length - 1;
        
        for (let y = ROWS - 1; y >= lastY; y--) {
            diagonalCheck:
                    
            for (let x = firstX; x < COLUMNS; x++) {
                for (let i = 0; i < length; i++) {
                    if (this.get(x - i, y - i) !== playerType) {
                        continue diagonalCheck;
                    }
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    isWinningFor(playerType) {
        return this.hasAscendingDiagonalStreak  (playerType, ConnectFourBoard.VICTORY_LENGTH) ||
               this.hasDescendingDiagonalStreak (playerType, ConnectFourBoard.VICTORY_LENGTH) ||
               this.hasHorizontalStreak         (playerType, ConnectFourBoard.VICTORY_LENGTH) ||
               this.hasVerticalStreak           (playerType, ConnectFourBoard.VICTORY_LENGTH);
    }
    
    tryLoadAscendingWinningPattern(playerType, length) {
        
        const lastX = COLUMNS - length;
        const lastY = length - 1;
        const winningPattern = [];
        
        for (let y = ROWS - 1; y >= lastY; y--) {
            diagonalCheck:
                    
            for (let x = 0; x <= lastX; x++) {
                for (let i = 0; i < length; i++) {
                    if (this.get(x + i, y - i) === playerType) {
                        winningPattern.push({x: x + i, y: y - i});
                        
                        if (winningPattern.length === length) {
                            return winningPattern;
                        }
                    } else {
                        winningPattern = [];
                        continue diagonalCheck;
                    }
                }
            }
        }
        
        return null;
    }
    
    tryLoadDescendingWinningPattern(playerType, length) {
        
        const firstX = length - 1;
        const lastY = ROWS - length;
        const winningPattern = [];
        
        for (let y = ROWS - 1; y > lastY; y--) {
            diagonalCheck:
                    
            for (let x = firstX; x < COLUMNS; x++) {
                for (let i = 0; i < length; i++) {
                    if (this.get(x - i, y - i) === playerType) {
                        winningPattern.push({x: x - i, y: y - i});
                        
                        if (winningPattern.length === length) {
                            return winningPattern;
                        }
                    } else {
                        winningPattern = [];
                        continue diagonalCheck;
                    }
                }
            }
        }
        
        return null;
    }
    
    tryLoadHorizontalWinningPattern(playerType, length) {
        
        const lastX = COLUMNS - length;
        const winningPattern = [];
        
        for (let y = ROWS - 1; y >= 0; y--) {
            horizontalCheck:
                    
            for (let x = 0; x <= lastX; x++) {
                for (let i = 0; i < length; i++) {
                    if (this.get(x + i, y) === playerType) {
                        winningPattern.push({x: x + i, y: y});
                        
                        if (winningPattern.length === length) {
                            return winningPattern;
                        }
                    } else {
                        winningPattern = [];
                        continue horizontalCheck;
                    }
                }
            }
        }
        
        return null;
    }
    
    tryLoadVerticalWinningPattern(playerType, length) {
        
        const lastY = ROWS - length;
        const winningPattern = [];
        
        for (let x = 0; x < COLUMNS; x++) {
            verticalCheck:
                    
            for (let y = 0; y <= lastY; y++) {
                for (let i = 0; i < length; i++) {
                    if (this.get(x, y + i) === playerType) {
                        winningPattern.push({x: x, y: y + i});
                
                        if (winningPattern.length === length) {
                            return winningPattern;
                        }
                    } else {
                        winningPattern = [];
                        continue verticalCheck;
                    }
                }
            }
        }
        
        return null;
    }
};

class ConnectFourHeuristicFunction {
    static #TWO_BLOCKS_SCORE = 1.0;
    static #THREE_BLOCKS_SCORE = 10.0;
    static #MINIMIZING_PLAYER_VICTORY_SCORE = -10E6;
    static #MAXIMIZING_PLAYER_VICTORY_SCORE = +10E6;
    
    evaluate(state, depth) {
        if (state.isWinningFor(X)) {
            return ConnectFourHeuristicFunction.#MINIMIZING_PLAYER_VICTORY_SCORE - depth;
        }
        
        if (state.isWinningFor(O)) {
            return ConnectFourHeuristicFunction.#MAXIMIZING_PLAYER_VICTORY_SCORE + depth;
        }
        
        return this.#evaluate2(state) +
               this.#evaluate3(state);
    }
    
    #evaluate2(state) {
        return this.#evaluate2Horizontal (state) +
               this.#evaluate2Vertical   (state) + 
               this.#evaluate2Ascending  (state) +
               this.#evaluate2Descending (state);
    }
    
    #evaluate3(state) {
        return this.#evaluate3Horizontal (state) +
               this.#evaluate3Vertical   (state) + 
               this.#evaluate3Ascending  (state) +
               this.#evaluate3Descending (state);
    }
    
    #evaluate2Horizontal(state) {
        let sum = 0.0;
        
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLUMNS - 1; x++) {
                if (state.get(x, y) === O &&
                    state.get(x + 1, y) === O) {
                    sum += ConnectFourHeuristicFunction.#TWO_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                           state.get(x + 1, y) === X) {
                    
                    sum -= ConnectFourHeuristicFunction.#TWO_BLOCKS_SCORE;
                }
            }
        }
        
        return sum;
    }
    
    #evaluate2Vertical(state) {
        let sum = 0.0;
        
        for (let y = 0; y < ROWS - 1; y++) {
            for (let x = 0; x < COLUMNS; x++) {
                if (state.get(x, y) === O &&
                    state.get(x, y + 1) === O) {
                    
                    sum += ConnectFourHeuristicFunction.#TWO_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                       state.get(x, y + 1) === X) {
                    
                    sum -= ConnectFourHeuristicFunction.#TWO_BLOCKS_SCORE;
                }
            }
        }
        
        return sum;
    }
    
    #evaluate2Ascending(state) {
        let sum = 0.0;
        
        for (let y = ROWS - 1; y > 0; y--) {
            for (let x = 0; x < COLUMNS - 1; x++) {
                if (state.get(x, y) === O &&
                    state.get(x + 1, y - 1) === O) {
                    sum += ConnectFourHeuristicFunction.#TWO_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                           state.get(x + 1, y - 1) === X) {
                    
                    sum -= ConnectFourHeuristicFunction.#TWO_BLOCKS_SCORE;
                }
            }
        }
        
        return sum;
    }
    
    #evaluate2Descending(state) {
        let sum = 0.0;
        
        for (let y = ROWS - 1; y > 0; y--) {
            for (let x = 1; x < COLUMNS; x++) {
                if (state.get(x, y) === O &&
                    state.get(x - 1, y - 1) === O) {
                    
                    sum += ConnectFourHeuristicFunction.#TWO_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                           state.get(x - 1, y - 1) === X) {
                    
                    sum -= ConnectFourHeuristicFunction.#TWO_BLOCKS_SCORE;
                }
            }
        }
        
        return sum;
    }
    
    #evaluate3Horizontal(state) {
        let sum = 0.0;
        
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLUMNS - 2; x++) {
                if (state.get(x, y) === O &&
                    state.get(x + 1, y) === O &&
                    state.get(x + 2, y) === O) {
                    
                    sum += ConnectFourHeuristicFunction.#THREE_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                        state.get(x + 1, y) === X &&
                        state.get(x + 2, y) === X) {
                    
                    sum -= ConnectFourHeuristicFunction.#THREE_BLOCKS_SCORE;
                }
            }
        }
        
        return sum;
    }
    
    #evaluate3Vertical(state) {
        let sum = 0.0;
        
        for (let y = 0; y < ROWS - 2; y++) {
            for (let x = 0; x < COLUMNS; x++) {
                if (state.get(x, y) === O &&
                    state.get(x, y + 1) === O &&
                    state.get(x, y + 2) === O) {
                    
                    sum += ConnectFourHeuristicFunction.#THREE_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                        state.get(x, y + 1) === X &&
                        state.get(x, y + 2) === X) {
                    
                    sum -= ConnectFourHeuristicFunction.#THREE_BLOCKS_SCORE;
                }
            }
        }
        
        return sum;
    }
    
    #evaluate3Ascending(state) {
        let sum = 0.0;
        
        for (let y = ROWS - 1; y > 1; y--) {
            for (let x = 0; x < COLUMNS - 2; x++) {
                if (state.get(x, y) === O &&
                    state.get(x + 1, y - 1) === O &&
                    state.get(x + 2, y - 2) === O) {
                    
                    sum += ConnectFourHeuristicFunction.#THREE_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                        state.get(x + 1, y - 1) === X && 
                        state.get(x + 2, y - 2) === X) {
                    
                    sum -= ConnectFourHeuristicFunction.#THREE_BLOCKS_SCORE;
                }
            }
        }
        
        return sum;
    }
    
    #evaluate3Descending(state) {
        let sum = 0.0;
        
        for (let y = ROWS - 1; y > 1; y--) {
            for (let x = 2; x < COLUMNS; x++) {
                if (state.get(x, y) === O &&
                    state.get(x - 1, y - 1) === O &&
                    state.get(x - 2, y - 2) === O) {
                    
                    sum += ConnectFourHeuristicFunction.#THREE_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                        state.get(x - 1, y - 1) === X &&
                        state.get(x - 2, y - 2) === X) {
                    
                    sum -= ConnectFourHeuristicFunction.#THREE_BLOCKS_SCORE;
                }
            }
        }
        
        return sum;
    }
}

class ConnectFourSearchEngine {
    #bestMoveState;
    #heuristicFunction;
    
    constructor(heuristicFunction) {
        this.#heuristicFunction = heuristicFunction;
    }
    
    search(root, depth, playerType = O) {
        this.#bestMoveState = null;
        
        this.#alphaBetaPruningRootImpl(root,
                                       depth,
                                       playerType);
        
        return this.#bestMoveState;
    }
    
    #alphaBetaPruningRootImpl(root, depth, playerType) {
        
        if (playerType === O) {
            
            // Try to maximize the value:
            let alpha = Number.NEGATIVE_INFINITY;
            let value = Number.NEGATIVE_INFINITY;
            let tentativeValue = Number.NEGATIVE_INFINITY;
            
            for (let x = 0; x < ConnectFourBoard.COLUMNS; x++) {
                if (!root.makePly(x, O)) {
                    continue;
                }

                value = Math.max(value,
                                 this.#alphaBetaPruningImpl(
                                         root,
                                         depth - 1,
                                         alpha,
                                         Number.POSITIVE_INFINITY,
                                         X));
                
                if (tentativeValue < value) {
                    tentativeValue = value;
                    this.#bestMoveState = new ConnectFourBoard(root);
                }

                root.unmakePly(x);  
                
                alpha = Math.max(alpha, value);
            }
        } else {
            
            let beta  = Number.POSITIVE_INFINITY;
            let value = Number.POSITIVE_INFINITY;
            let tentativeValue = Number.POSITIVE_INFINITY;
            
            for (let x = 0; x < ConnectFourBoard.COLUMNS; x++) {
                if (!root.makePly(x, X)) {
                    continue;
                }

                value = Math.min(value,
                                 this.#alphaBetaPruningImpl(
                                         root,
                                         depth - 1,
                                         Number.NEGATIVE_INFINITY,
                                         beta,
                                         O));

                if (tentativeValue > value) {
                    tentativeValue = value;
                    this.#bestMoveState = new ConnectFourBoard(root);
                }

                root.unmakePly(x);
                
                beta = Math.min(beta, value);
            }
        }
    } 
    
    #alphaBetaPruningImpl(state, 
                          depth, 
                          alpha,
                          beta, 
                          playerType) {

        if (depth === 0 || state.isTerminal()) {
            return heuristicFunction.evaluate(state, depth);
        }
        
        if (playerType === O) {
            let value = Number.NEGATIVE_INFINITY;
            
            for (let x = 0; x < ConnectFourBoard.COLUMNS; x++) {
                if (!state.makePly(x, O)) {
                    continue;
                }
                
                value = Math.max(value, 
                                 this.#alphaBetaPruningImpl(state,
                                                            depth - 1,
                                                            alpha,
                                                            beta,
                                                            X));
                
                state.unmakePly(x);
                
                if (value > beta) {
                    break;
                }
                
                alpha = Math.max(alpha, value);
            }   
            
            return value;
        } else {
            let value = Number.POSITIVE_INFINITY;
            
            for (let x = 0; x < ConnectFourBoard.COLUMNS; x++) {
                if (!state.makePly(x, X)) {
                    continue;
                }
                
                value = Math.min(value,
                                 this.#alphaBetaPruningImpl(state,
                                                            depth - 1,
                                                            alpha,
                                                            beta,
                                                            O));
                
                state.unmakePly(x);
                
                if (value < alpha) {
                    break;
                }
                
                beta = Math.min(beta, value);
            }
            
            return value;
        }          
    }
}

(function() {
    
    const obj = new ConnectFourBoard();
    console.log(obj.toString());
    
    function paintBoard(canvas) {
        
        const context = canvas.getContext('2d');
        const width  = context.canvas.width;
        const height = context.canvas.height;
        context.fillStyle = BOARD_FILL_STYLE;
        
        context.fillRect(0, 
                         0, 
                         width,
                         height);
    };
    
    function getCanvasCellWidth(canvas) {
        return Math.floor(canvas.getContext('2d').canvas.width / COLUMNS);
    };
    
    function repaint() {
        const canvas = getCanvas();
        const cellWidth = getCanvasCellWidth(canvas);
        paintBoard(canvas);
        
        const state = [
            [X, O, O, O,    X, X,    X],
            [X, O, O, null, X, X,    X],
            [X, O, O, O,    X, X,    X],
            [X, O, O, O,    X, null, X],
            [X, O, O, O,    X, X,    X],
            [X, O, O, O,    X, X,    X]
        ];
        
        paintCells(canvas, state, cellWidth);
    };
    
    window.onresize = (event) => {
        repaint();
    };
    
    window.onload = (event) => {
        repaint();
    };
    
    function paintCells(canvas, boardState, cellWidth) {
        
        const context = canvas.getContext('2d');
        
        for (let y = 0, endy = boardState.length; y < endy; y++) {
            for (let x = 0, endx = boardState[0].length; x < endx; x++) {
                
                const cell = boardState[y][x];
                let fillStyle;
                
                switch (cell) {
                    case X:
                        fillStyle = '#e0ae38';
                        break;
                        
                    case O:
                        fillStyle = '#b31e1e';
                        break;
                        
                    default:
                        fillStyle = 'white';
                        break;
                }
                
                context.fillStyle = fillStyle;
                
                const centerX = x * cellWidth + cellWidth / 2;
                const centerY = y * cellWidth + cellWidth / 2;
                const radius = (cellWidth / 2) - MARGIN_RADIUS;
                
                context.beginPath();
                context.arc(centerX,
                            centerY,
                            radius,
                            0,
                            2 * Math.PI,
                            false);
                            
                context.fillStyle = fillStyle;
                context.fill();
            }
        }
    };
    
//    paintBoard();
//    
//    const d = [
//        [X, O, O, O, X, X, X],
//        [X, O, O, null, X, X, X],
//        [X, O, O, O, X, X, X],
//        [X, O, O, O, X, null, X],
//        [X, O, O, O, X, X, X],
//        [X, O, O, O, X, X, X]
//    ];
//    
//    paintCells(d);
//    console.log(window.innerWidth, window.innerHeight);
});

const heuristicFunction = new ConnectFourHeuristicFunction();
const engine = new ConnectFourSearchEngine(heuristicFunction);
const depth = 8;

let state = new ConnectFourBoard();
console.log(state.toString());

function millis() {
    return new Date().valueOf();
}

let totalDurationX = 0;
let totalDurationO = 0;

while (true) {
    console.log("X's turn:");
    
    let ta = millis();
    state = engine.search(state, depth, X);
    let tb = millis();
    
    totalDurationX += tb - ta;
    
    console.log(state.toString());
    console.log("X AI duration: " + (tb - ta) + " milliseconds.");
    
    if (state.isTie()) {
        console.log("RESULT: It's a tie.");
        break;
    }
    
    if (state.isWinningFor(X)) {
        console.log("RESULT: X won.");
        break;
    }
    
    console.log("O's turn:");
    
    ta = millis();
    state = engine.search(state, depth, O);
    tb = millis();
    
    totalDurationO += tb - ta;
    
    console.log(state.toString());
    console.log("O AI duration: " + (tb - ta) + " milliseconds.");
    
    if (state.isTie()) {
        console.log("RESULT: It's a tie.");
        break;
    }
    
    if (state.isWinningFor(O)) {
        console.log("RESULT: O won.");
        break;
    }
}

console.log("X AI total duration: " + totalDurationX + " milliseconds.");
console.log("O AI total duration: " + totalDurationO + " milliseconds.");