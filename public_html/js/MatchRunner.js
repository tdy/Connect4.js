class MatchRunner {
    #engineX;
    #engineY;
    #engineDepthX;
    #engineDepthO;
    #engineXName;
    #engineOName;
    #outputDiv;
    #currentEngineDepth;
    
    #currentTurnNumber = 1;
    #keepRunning       = false;
    #currentState      = new ConnectFourBoard();
    #currentTurnEngine = #engineX;
    #totalDurationX    = 0;
    #totalDurationY    = 0;
    
    constructor() {
        this.#engineX            = arguments[0];
        this.#engineO            = arguments[1];
        this.#engineDepthX       = arguments[2];
        this.#engineDepthO       = arguments[3];
        this.#engineXName        = arguments[4];
        this.#engineOName        = arguments[5];
        this.#outputDiv          = arguments[6];
        this.#currentEngineDepth = this.#engineDepthX;
    }
    
    start() {
        this.#keepRunning = true;
        this.#clearOutput();
        
        
    }
    
    halt() {
        this.#keepRunning = false;
    }
    
    getTotalDurationX() {
        return this.#totalDurationX;
    }
    
    getTotalDurationo() {
        return this.#totalDurationO;
    }
    
    #clearOutput() {
        this.#outputDiv.innerHTML = "";
    }
    
    #gameLoop() {
        const startTime = this.#millis();
        
        this.#currentState =
                this.#currentTurnEngine.search(
                    this.#currentState, 
                    this.#currentEngineDepth, 
                    this.#currentTurnNumber);
        
        const endTime = this.#millis();
        const duration = endTime - startTime;
        
        if (this.#currentTurnEngine === this.#engineX) {
            this.#totalDurationX += duration;
        } else {
            this.#totalDurationO += duration;
        }
        
        this.#outputDiv.innerHTML += this.#currentState.toString();
        this.#outputDiv.innerHTML += "<br/>";
        
        const turnNumberString = this.#getCurrentEngineName();
        
        
        this.#outputDiv.innerHTML += 
                this.#currentTurnEngine === this.#engineX ? 
                    turnNumberString 
                            + " made the "
                    :
                            "";
                    
    }
    
    #flipCurrentEngineTurn() {
        if (this.#currentTurnEngine === this.#engineX) {
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
        if (this.#currentTurnEngine === this.#engineX) {
            return this.#engineXName + " (X)";
        }
        
        return this.#engineOName + " (O)";
    }
    
    
}