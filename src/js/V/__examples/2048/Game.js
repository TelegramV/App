import Board from './Board';
import {getNewGameState} from './actions/getNewGameState';
import {generateNewTile} from './actions/generateTileHandler';
import {getKeyHandler} from './inputHandlers/keyboard';
import {getTouchHandler} from './inputHandlers/touch';
import VComponent from "../../VRDOM/component/VComponent"

class Game extends VComponent {
    constructor(props) {
        super(props);

        this.state = getNewGameState(this.props.fieldSize);
        this.rewind = this.rewind.bind(this);
        this.reset = this.reset.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
    }

    touchStart(event) {
        let touch = event.touches[0];
        if (!touch)
            return;

        this.setState(() => {
            return {touch: {X: touch.clientX, Y: touch.clientY}};
        });
    }

    touchEnd(event) {
        const handler = getTouchHandler(event, this.state.touch);
        this.handleMove(handler);
    }

    keyPressed(event) {
        if (event.keyCode === 81) {
            this.rewind();
            return;
        }
        const handler = getKeyHandler(event);
        this.handleMove(handler);
    }

    rewind() {
        if (this.state.history.length > 0) {
            this.setState((state) => {
                const {squares, score} = state.history[state.history.length - 1];
                state.history.splice(-1, 1);
                return {squares: squares, score: score, rewinds: state.rewinds + 1};
            });
        }
    }

    reset() {
        this.setState(() => {
            return getNewGameState(this.props.fieldSize);
        });
    }

    writeHistory(state) {
        const {squares, score} = state;
        this.setState(() => {
            return {history: [...this.state.history, {squares: squares, score: score}]}
        });
    }

    handleMove(handler) {
        let {squares, isMoved, isStarted, score} = handler(this.state);
        if (isMoved) {
            this.writeHistory({squares: this.state.squares, score: this.state.score});
            squares = generateNewTile(squares);
            this.setState(() => {
                return {squares: squares, isMoved: isMoved, isStarted: isStarted, score: score};
            });

            return;
        }

        this.setState(() => {
            return {isMoved: false};
        });
    }

    // just a hack for iOS bouncing effect
    handleTouchMove(event) {
        const className = event.target.className;
        if (className.includes('square')) {
            event.preventDefault();
            ;
            return;
        }
    }

    componentDidMount() {
        document.addEventListener("touchmove", this.handleTouchMove, {passive: false});
        document.addEventListener("keydown", this.keyPressed, false);

        const doc = document.getElementById("game-board");
        doc.addEventListener("touchstart", this.touchStart, false);
        doc.addEventListener("touchend", this.touchEnd, false);
    }

    componentWillUnmount() {
        document.removeEventListener("touchmove", this.handleTouchMove, {passive: false});
        document.removeEventListener("keydown", this.keyPressed, false);

        const doc = document.getElementById("game-board");
        doc.removeEventListener("touchstart", this.touchStart, false);
        doc.removeEventListener("touchend", this.touchEnd, false);
    }

    render() {
        return (
            <div className="game" id="game">
                <div className="game-board" id="game-board">
                    <div className="status">
                        <span>Score: {this.state.score}</span>
                    </div>
                    <div className="status">
                        {this.state.rewinds > 0 ? <span>Rewinds used: {this.state.rewinds}</span> : null}
                    </div>
                    <div className="game-info">
                        <span>{(this.state.isStarted && !this.state.isMoved) ? "Nothing has moved" : null}</span>
                    </div>
                    <Board
                        squares={this.state.squares}
                    />
                </div>
                <div className="game-buttons">
                    <ul>
                        <button className="veryBoringButton" onClick={this.reset}>New game</button>
                        <button className="veryBoringButton" onClick={this.rewind}>Rewind</button>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Game;
