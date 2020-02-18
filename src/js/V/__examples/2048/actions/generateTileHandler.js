import {CreateSquare} from './createSquare';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getEmptySquaresCount(squares) {
    let numberOfEmpty = squares.length * squares[0].length;
    for (let i = 0; i !== squares.length; i++) {
        const row = squares[i];
        for (let j = 0; j !== row.length; j++) {
            if (row[j]) {
                numberOfEmpty--;
            }
        }
    }
    return numberOfEmpty;
}

export function generateNewTile(squares) {
    let emptyCount = getEmptySquaresCount(squares);
    if (emptyCount === 0)
        return squares;

    let nextNumber = getRndInteger(0, 9) === 9 ? 4 : 2; // 10% chance for 4 to appear
    let nextPosition = getRndInteger(0, emptyCount - 1);

    for (let i = 0; i !== squares.length; i++) {
        const row = squares[i];
        for (let j = 0; j !== row.length; j++) {
            if (row[j]) {
                continue;
            }

            if (nextPosition === 0) {
                squares[i][j] = CreateSquare(nextNumber);
                return squares;
            }

            nextPosition--;
        }
    }
}
