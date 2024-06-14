const ROWS = 6;
const COLUMNS = 7;
const MARGIN_RADIUS = 10;
const PROGRESS_BAR_HEIGHT = 15;
const O = 0;
const X = 1;
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
    
    constructor(other) {
        if (arguments.length === 1) {
            this.#boardData = [...other.#boardData];
        } else {
            this.#boardData = Array(ConnectFourBoard.#ROWS *
                                    ConnectFourBoard.#COLUMNS);
        }
    }
    
    toString() {
        let str = "";
        
        for (let y = 0; y < ConnectFourBoard.#ROWS; y++) {
            for (let x = 0; x < ConnectFourBoard.#COLUMNS; x++) {
                str += "|";
                str += this.#getCellChar(this.#get(x, y));
            }
            
            str += "|\n";
        }
        
        str += "+-+-+-+-+-+-+-+\n";
        str += " 1 2 3 4 5 6 7";
        
        return str;
    }
    
    #get(x, y) {
        return this.#boardData[y * ConnectFourBoard.#COLUMNS + x];
    }
    
    #getCellChar(cellCharacter) {
        switch (cellCharacter) {
            case X:
                return "X";
                
            case O:
                return "O";
                
            default:
                return " ";
        }
    }
};

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