function Tile(props) {
    let item = props.value;
    let number = item ? item.number : null;
    let className = item ? (item.isNew ? "squareNew" : (item.isMerged ? "squareMerged" : "squareOld")) : "squareDefault";
    return (
        <span className={className}>
      {number}
    </span>
    );
}

export default Tile;
