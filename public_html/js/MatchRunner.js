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
    
    #currentTurnNumber = 1;
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
        this.#outputDiv.innerHTML += "Match halted!";
    }
    
    clearOutput() {
        this.#outputDiv.innerHTML = "";
    }
    
    getTotalDurationX() {
        return this.#totalDurationX;
    }
    
    getTotalDurationO() {
        return this.#totalDurationO;
    }
    
    #gameLoop() {
        if (!this.#keepRunning) {
            this.#outputDiv.innerHTML += "Stopped prematurely.";
            window.scrollTo(0, document.body.scrollHeight);
            return;
        }
        
        const startTime = this.#millis();
        
        this.#currentState =
                this.#currentEngineTurn.search(
                    this.#currentState, 
                    this.#currentEngineDepth, 
                    this.#currentTurnNumber);
        
        const endTime = this.#millis();
        const duration = endTime - startTime;
        
        if (this.#currentEngineTurn === this.#engineX) {
            this.#totalDurationX += duration;
        } else {
            this.#totalDurationO += duration;
        }
        
        this.#outputDiv.innerHTML += this.#currentState.toString();
        this.#outputDiv.innerHTML += "<br/>";
        
        const turnNumberString = this.#getCurrentEngineName();
        
        this.#outputDiv.innerHTML += 
                this.#currentEngineTurn === this.#engineX ? 
                    turnNumberString 
                            + " made the "
                            + turnNumberString 
                            + " turn, duration: "
                            + (endTime - startTime) 
                            + " milliseconds.<br/>"
                    :
                    turnNumberString 
                            + " made the "
                            + turnNumberString
                            + " turn, duration: "
                            + (endTime - startTime)
                            + " milliseconds.<br/>";
                    
        this.#currentTurnNumber++;
        
        if (this.#currentState.isTie()) {
            this.#outputDiv.innerHTML += "RESULT: It's a tie.<br/>";
            this.#keepRunning = false;
            window.scrollTo(0, document.body.scrollHeight);
            return;
        }
        
        if (this.#currentEngineTurn === this.#engineX) {
            if (this.#currentState.isWinningFor(MatchRunner.#X)) {
                this.#outputDiv.innerHTML += 
                        "RESULT: " 
                        + this.#currentEngineTurn.getName() 
                        + " (X) won.<br/>";
                
                this.#outputDiv.innerHTML += getDurationReport();
                window.scrollTo(0, document.body.scrollHeight);
                this.#keepRunning = false;
                return;
            }
        } else {
            if (this.#currentState.isWinningFor(MatchRunner.#O)) {
                this.#outputDiv.innerHTML += 
                        "RESULT: " 
                        + this.#currentEngineTurn.getName() 
                        + " (O) won.<br/>";
                
                this.#outputDiv.innerHTML += getDurationReport();
                window.scrollTo(0, document.body.scrollHeight);
                this.#keepRunning = false;
                return;
            }
        }
        
        window.requestAnimationFrame(() => this.#gameLoop());
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
            return this.#engineDepthO;
        }
        
        return this.#engineX;
    }
    
    #flipDepth() {
        if (this.#currentEngineDepth === this.#engineDepthX) {
            return this.#engineDepthO;
        }
        
        return this.#engineDepthX;
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