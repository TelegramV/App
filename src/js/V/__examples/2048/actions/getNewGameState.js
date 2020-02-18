import {generateNewTile} from './generateTileHandler';

export function getNewGameState(size) {
    let sqr = Array(size).fill().map(() => Array(size).fill(null));
    sqr = generateNewTile(generateNewTile(sqr));

    return {
        squares: sqr,
        isMoved: false,
        isStarted: false,
        score: 0,
        rewinds: 0,
        history: []
    };
}
