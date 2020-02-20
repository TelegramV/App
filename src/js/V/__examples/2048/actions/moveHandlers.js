function processMove(state, accessors) {

    if (!canMove(state.squares, accessors)) {
        return {squares: state.squares, isMoved: false, isStarted: state.isStarted, score: state.score};
    }

    const squares = state.squares.map(arr => arr.map(square => square ? square.copy() : null));
    let score = state.score;
    const length = squares.length;

    const get = accessors.get;
    const set = accessors.set;
    for (let i = 0; i !== length; i++) {
        const row = getRowObject(length);

        for (let j = length - 1; j >= 0; j--) {
            const item = get(squares, i, j);
            if (item) {
                item.isNew = false;
                item.isMerged = false;

                const index = row.getLastNonOccupiedIndex();

                if (row.canMerge(item)) {
                    row.merge();
                    score = score + row.mergedSum;
                } else {
                    row.occupied++;
                    row.items[index] = item;
                }
            }
        }

        for (let j = 0; j !== length; j++) {
            set(squares, i, j, row.items[j]);
        }
    }

    return {squares: squares, isMoved: true, isStarted: true, score: score};
}

function canMove(squares, accessors) {
    const length = squares.length;
    const {get} = accessors;

    for (let i = 0; i !== length; i++) {
        let j = 0;
        while (j < length - 1) {
            const startItem = get(squares, i, j);
            const endItem = get(squares, i, j + 1);

            if (!startItem) {
                j++;
                continue;
            }

            if (!endItem) {
                return true;
            }

            if (startItem.number === endItem.number) {
                return true;
            }

            j++;
        }
    }

    return false;
}

function getRowObject(length) {
    const row = {
        length: length,
        items: new Array(length),
        occupied: 0,
        mergedSum: 0,
        mergedTiles: new Set()
    };

    row.getLastNonOccupiedIndex = function () {
        return row.length - row.occupied - 1
    };

    row.canMerge = function (item) {
        if (row.occupied > 0) {
            const nextIndex = row.getLastNonOccupiedIndex() + 1;

            // already merged items can't be merged again within the same move
            if (row.mergedTiles.has(nextIndex)) {
                return false;
            }

            return item.number === row.items[nextIndex].number;
        }

        return false;
    }

    row.merge = function () {
        const index = row.getLastNonOccupiedIndex() + 1;
        const item = row.items[index];
        item.number = item.number * 2;
        item.isMerged = true;
        row.items[index] = item;
        row.mergedTiles.add(index);

        // calculate score
        row.mergedSum = item.number;
    }

    return row;
}

function leftGet(squares, i, j) {
    return squares[i][squares.length - j - 1];
}

function leftSet(squares, i, j, item) {
    squares[i][squares.length - j - 1] = item;
}

function upGet(squares, i, j) {
    const length = squares.length;
    return squares[length - j - 1][i];
}

function upSet(squares, i, j, item) {
    const length = squares.length;
    squares[length - j - 1][i] = item;
}

function rightGet(squares, i, j) {
    return squares[i][j];
}

function rightSet(squares, i, j, item) {
    squares[i][j] = item;
}

function downGet(squares, i, j) {
    return squares[j][i];
}

function downSet(squares, i, j, item) {
    squares[j][i] = item;
}

export function handleLeft(state) {
    const accessors = {get: leftGet, set: leftSet};
    return processMove(state, accessors);
}

export function handleRight(state) {
    const accessors = {get: rightGet, set: rightSet};
    return processMove(state, accessors);
}

export function handleUp(state) {
    const accessors = {get: upGet, set: upSet};
    return processMove(state, accessors);
}

export function handleDown(state) {
    const accessors = {get: downGet, set: downSet};
    return processMove(state, accessors);
}

export function handleNone(state) {
    return {squares: state.squares, isMoved: false, isStarted: state.isStarted, score: state.score};
}
