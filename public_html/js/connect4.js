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
    static #ROWS = 6;
    static #COLUMNS = 7;
    static #VICTORY_LENGTH = 4;
    
    #boardData;
        
    #getCellChar(cellCharacter) {
        switch (cellCharacter) {
            case X:
                return "X";
                
            case O:
                return "O";
                
            case EMPTY:
                return " ";
        }
    }
    
    constructor(other) {
        if (arguments.length === 1) {
            this.#boardData = [...other.#boardData];
        } else {
            this.#boardData = Array(ConnectFourBoard.#ROWS *
                                    ConnectFourBoard.#COLUMNS);
                            
            for (let i = 0, end = this.#boardData.length; i < end; i++) {
                this.#boardData[i] = EMPTY;
            }
        }
    }
    
    get(x, y) {
        return this.#boardData[y * ConnectFourBoard.#COLUMNS + x];
    }
    
    set(x, y, playerType) {
        this.#boardData[y * ConnectFourBoard.#COLUMNS + x] = playerType;
    }
    
    toString() {
        let str = "";
        
        for (let y = 0; y < ConnectFourBoard.#ROWS; y++) {
            for (let x = 0; x < ConnectFourBoard.#COLUMNS; x++) {
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
            if (!get(x, 0)) {
                return false;
            }
        }
        
        return true;
    }
    
    makePly(x, playerType) {
        for (let y = ROWS - 1; y >= 0; y--) {
            if (!get(x, y)) {
                set(x, y, playerType);
                return true;
            }
        }
        
        return false;
    }
    
    unmakePly(x) {
        for (let y = 0; y < ROWS; y++) {
            if (get(x, y)) {
                set(x, y, undefined);
                return;
            }
        }
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
        return 
           this.hasAscendingDiagonalStreak  (playerType, VICTORY_LENGTH) ||
           this.hasDescendingDiagonalStreak (playerType, VICTORY_LENGTH) ||
           this.hasHorizontalStreak         (playerType, VICTORY_LENGTH) ||
           this.hasVerticalStreak           (playerType, VICTORY_LENGTH);
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
        
        return evaluate2(state) + evaluate3(state);
    }
    
    #evaluate2(state) {
        return #evaluate2Horizontal(state) +
               #evaluate2Vertical(state) + 
               #evaluate2Ascending(state) +
               #evaluate2Descending(state);
    }
    
    #evaluate3(state) {
        return #evaluate3Horizontal(state) +
               #evaluate3Vertical(state) + 
               #evaluate3Ascending(state) +
               #evaluate3Descending(state);
    }
    
    #evaluate2Horizontal(state) {
        let sum = 0.0;
        
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLUMNS - 1; x++) {
                if (state.get(x, y) === O &&
                    state.get(x + 1, y) === O) {
                    sum += #TWO_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                       state.get(x + 1, y) === X) {
                    
                    sum -= #TWO_BLOCKS_SCORE;
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
                    
                    sum += #TWO_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                       state.get(x, y + 1) === X) {
                    
                    sum -= #TWO_BLOCKS_SCORE;
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
                    sum += #TWO_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                           state.get(x + 1, y - 1) === X) {
                    
                    sum -= #TWO_BLOCKS_SCORE;
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
                    
                    sum += #TWO_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                           state.get(x - 1, y - 1) === X) {
                    
                    sum -= #TWO_BLOCKS_SCORE;
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
                    
                    sum += #THREE_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                        state.get(x + 1, y) === X &&
                        state.get(x + 2, y) === X) {
                    
                    sum -= #THREE_BLOCKS_SCORE;
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
                    
                    sum += #THREE_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                        state.get(x, y + 1) === X &&
                        state.get(x, y + 2) === X) {
                    
                    sum -= #THREE_BLOCKS_SCORE;
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
                    
                    sum += #THREE_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                        state.get(x + 1, y - 1) === X && 
                        state.get(x + 2, y - 2) === X) {
                    
                    sum -= #THREE_BLOCKS_SCORE;
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
                    
                    sum += #THREE_BLOCKS_SCORE;
                } else if (state.get(x, y) === X &&
                        state.get(x - 1, y - 1) === X &&
                        state.get(x - 2, y - 2) === X) {
                    
                    sum -= #THREE_BLOCKS_SCORE;
                }
            }
        }
        
        return sum;
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
})();