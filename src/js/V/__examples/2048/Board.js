import Tile from './Tile';
import XVComponent from "../../X/Component/XVComponent"

class Board extends XVComponent {
    renderSquare(i, j) {
        let item = this.props.squares[i][j];
        return (
            <Tile
                value={item} key={"sqr" + i + j} rowIndex={i} colIndex={j}
            />
        );
    }

    renderRow(rowIndex) {
        const row = this.props.squares[rowIndex];
        return (
            <div className="board-row" key={"br" + rowIndex}>{
                row.map((_col, colIndex) => this.renderSquare(rowIndex, colIndex))
            }</div>
        );
    }

    render() {
        return (
            <div>
                {this.props.squares.map((_row, rowIndex) => this.renderRow(rowIndex))}
            </div>
        );
    }
}

export default Board;
