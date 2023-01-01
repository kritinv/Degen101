import React from "react";
import Matrix from "./Matrix.js";
import { std_matrix } from "./../data.js";
import Legend from "./Legend.js";

const helperArray = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

class RangeConstructorMatrix extends React.Component {
  constructor(props) {
    super(props);
    let defaultChart = this.props.curr_chart;
    this.state = {
      curr_chart: defaultChart,
      chart: std_matrix,
      selected_id: [0],
    };
  }

  convertHandToIndex(hand) {
    var row = helperArray.findIndex((ele) => ele === hand[0]);
    var col = helperArray.findIndex((ele) => ele === hand[1]);
    return [row, col];
  }

  onMouseDown(hand, action) {
    let [row, col] = this.convertHandToIndex(hand);
    let chart = this.state.curr_chart;
    let actions = ["R", "C", "B"];

    if (hand[2] === "o") {
      let temp = row;
      row = col;
      col = temp;
    }

    if (chart[row][col] === "F") chart[row][col] = actions[action];
    else chart[row][col] = "F";

    this.setState({
      curr_chart: chart,
    });
  }

  // manually trigger rerender
  stateChangeTrigger() {
    this.setState({});
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <Matrix
          curr_chart={this.state.curr_chart}
          chart={this.state.chart}
          onMouseDown={(hand, action) => {
            this.onMouseDown(hand, action);
          }}
          selected_id={this.state.selected_id}
        ></Matrix>
        <div className="d-flex flex-column rangeconstructor">
          <div className="d-flex flex-column">
            {["Raise", "Call", "Bluff Raise"].map((ele, i) => {
              let chart = this.state.curr_chart;
              let combos = 0;
              for (var r = 0; r < chart.length; r++) {
                for (var c = 0; c < chart[r].length; c++) {
                  if (chart[r][c] === ele[0]) {
                    if (r === c)
                      // pocket pair
                      combos += 6;
                    else if (r < c)
                      // suited hand
                      combos += 4;
                    else combos += 12;
                  }
                }
              }
              let percentage = combos / 1326;

              return (
                <Legend
                  value={ele}
                  id={i}
                  selected_id={this.state.selected_id}
                  stateChangeTrigger={() => {
                    this.stateChangeTrigger();
                  }}
                  percentage={(percentage * 100).toFixed(2) + " %"}
                  isClickable={true}
                ></Legend>
              );
            })}
            <div className="d-inline-flex "></div>
          </div>
        </div>
      </div>
    );
  }
}

export default RangeConstructorMatrix;
