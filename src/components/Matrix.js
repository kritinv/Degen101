import React from "react";

// Box component for each square in the poker matrix
// box has prop hand (stores dealt hand)
// box has prop action (stores color based on GTO action)
function Box(props) {
  return (
    <button
      className={"matrix-cell hand-" + props.action}
      onMouseOver={props.onMouseOver}
      onMouseDown={props.onMouseDown}
    >
      {props.value}
    </button>
  );
}

// Matrix component
// matrix state has prop chart
class Matrix extends React.Component {
  generateMatrixRow(row, row_preflop) {
    return (
      <div>
        {row.map((hand, index) => {
          return (
            <Box
              value={hand}
              action={row_preflop[index]}
              onMouseOver={() =>
                this.props.onMouseOver(hand, "hand-" + row_preflop[index])
              }
              onMouseDown={() =>
                this.props.onMouseDown(hand, this.props.selected_id[0])
              }
            ></Box>
          );
        })}
      </div>
    );
  }

  generateMatrix(matrix, preflop_chart) {
    return (
      <div className="mx-4">
        {matrix.map((row, index) => {
          return this.generateMatrixRow(row, preflop_chart[index]);
        })}
      </div>
    );
  }

  render() {
    return this.generateMatrix(this.props.chart, this.props.curr_chart);
  }
}

export default Matrix;
