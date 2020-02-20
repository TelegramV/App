function copy(square) {
    const newSquare = {
        number: square.number,
        isNew: square.isNew,
        isMerged: square.isMerged,
        copy: () => copy(newSquare)
    };
    return newSquare;
}

export function CreateSquare(number) {
    const square = {number: number, isNew: true, isMerged: false, copy: () => copy(square)};
    return square;
}