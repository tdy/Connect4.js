class MatchRunner {
    
    static #X = 1;
    static #O = 0;
    
    #engineX;
    #engineO;
    #engineDepthX;
    #engineDepthO;
    #outputDiv;
    #currentEngineDepth;
    #currentEngineTurn;
    
    #currentTurnNumber = MatchRunner.#X;
    #keepRunning       = false;
    #currentState      = new ConnectFourBoard();
    #totalDurationX    = 0;
    #totalDurationO    = 0;
    
    constructor() {
        this.#engineX            = arguments[0];
        this.#engineO            = arguments[1];
        this.#engineDepthX       = arguments[2];
        this.#engineDepthO       = arguments[3];
        this.#outputDiv          = arguments[4];
        this.#currentEngineTurn  = this.#engineX;
        this.#currentEngineDepth = this.#engineDepthX;
    }
    
    start() {
        this.#keepRunning = true;
        this.clearOutput();
        this.#gameLoop();
    }
    
    halt() {
        this.#keepRunning = false;
        this.#outputDiv.insertAdjacentHTML("beforeend",
            "Match halted! Stopping prematurely..."
        );
    }
    
    clearOutput() {
        this.#outputDiv.innerHTML = "";
    }
    
    scrollOutput() {
        this.#outputDiv.scrollTo(0, this.#outputDiv.scrollHeight);
    }
    
    getTotalDurationX() {
        return this.#totalDurationX;
    }
    
    getTotalDurationO() {
        return this.#totalDurationO;
    }
    
    #gameLoop() {
        if (!this.#keepRunning) {
            this.scrollOutput();
            return;
        }
        
        const startTime = this.#millis();
        
        this.#currentState =
                this.#currentEngineTurn.search(
                    this.#currentState, 
                    this.#currentEngineDepth,
                    this.#getPlayerEnum());
        
        const endTime = this.#millis();
        const duration = endTime - startTime;
        
        if (this.#currentEngineTurn === this.#engineX) {
            this.#totalDurationX += duration;
        } else {
            this.#totalDurationO += duration;
        }
        
        this.#outputDiv.insertAdjacentHTML("beforeend",
            `${this.#currentState.toString()}<br/>`
        );
        
        const turnEngineName = this.#getCurrentEngineName();
        const turnNumeral = this.#getTurnNumberString();;
        
        this.#outputDiv.insertAdjacentHTML("beforeend",
            `${turnEngineName} made the ${turnNumeral} turn, duration: ${endTime - startTime} milliseconds.<br/>`
        );
        
        this.#currentTurnNumber++;
        
        if (this.#currentState.isTie()) {
            this.#keepRunning = false;
            this.#outputDiv.insertAdjacentHTML("beforeend",
                `RESULT: It's a tie.<br/>${this.#getDurationReport()}`
            );
            this.scrollOutput();
            return;
        }
        
        if (this.#currentEngineTurn === this.#engineX) {
            if (this.#currentState.isWinningFor(MatchRunner.#X)) {
                this.#keepRunning = false;
                this.#outputDiv.insertAdjacentHTML("beforeend",
                    `RESULT: ${this.#currentEngineTurn.getName()} (X) won.<br/>${this.#getDurationReport()}`
                );
                this.scrollOutput();
                return;
            }
        } else {
            if (this.#currentState.isWinningFor(MatchRunner.#O)) {
                this.#keepRunning = false;
                this.#outputDiv.insertAdjacentHTML("beforeend",
                    `RESULT: ${this.#currentEngineTurn.getName()} (O) won.<br/>${this.#getDurationReport()}`
                );
                this.scrollOutput();
                return;
            }
        }
        
        this.#flipCurrentEngineTurn();
        this.#flipDepth();
        
        this.scrollOutput();
        window.requestAnimationFrame(() => this.#gameLoop());
    }
    
    #getPlayerEnum() {
        if (this.#currentEngineTurn === this.#engineX) {
            return MatchRunner.#X;
        } else {
            return MatchRunner.#O;
        }
    }
    
    #getDurationReport() {
        return this.#engineX.getName() 
                + " (X) total duration: "
                + this.#totalDurationX 
                + " milliseconds.<br/>"
                + this.#engineO.getName()
                + " (O) total duration: " 
                + this.#totalDurationO 
                + " milliseconds.<br/>";
    }
    
    #flipCurrentEngineTurn() {
        if (this.#currentEngineTurn === this.#engineX) {
            this.#currentEngineTurn = this.#engineO;
        } else {
            this.#currentEngineTurn = this.#engineX;
        }
    }
    
    #flipDepth() {
        if (this.#currentEngineDepth === this.#engineDepthX) {
            this.#currentEngineDepth = this.#engineDepthO;
        } else {
            this.#currentEngineDepth = this.#engineDepthX;
        }
    }
    
    #getTurnNumberString() {
        const turn = this.#currentTurnNumber;
        
        if (turn % 10 === 1) {
            return turn + "st";
        }
        
        if (turn %10 === 2) {
            return turn + "nd";
        }
        
        if (turn % 10 === 3) {
            return turn + "rd";
        }
        
        return turn + "th";
    }
    
    #millis() {
        return new Date().valueOf();
    }
    
    #getCurrentEngineName() {
        if (this.#currentEngineTurn === this.#engineX) {
            return this.#engineX.getName() + " (X)";
        }
        
        return this.#engineO.getName() + " (O)";
    }
}
