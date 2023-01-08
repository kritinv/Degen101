import React from "react";
import Matrix from "./Matrix.js";
import { std_matrix } from "./../data.js";
import Legend from "./Legend.js";

class RangeConstructorMatrix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curr_chart: this.props.curr_chart,
      chart: std_matrix,
      selected_id: [0],
    };
  }

  // manually trigger rerender
  stateChangeTrigger() {
    this.setState({});
  }

  save() {
    this.props.save();
    return;
  }

  reset() {
    this.props.reset();
    return;
  }

  render() {
    return (
      <div className="d-flex select-matrix-joyride">
        <div id="screenshot" class="screenshot">
          <div className="chart-title-screenshot d-flex flex-column justify-content-center">
            <div>{this.props.chart_title}</div>
          </div>
          <Matrix
            curr_chart={this.props.curr_chart}
            chart={this.state.chart}
            onMouseDown={(hand, action) => {
              this.props.onMouseDown(hand, action);
            }}
            selected_id={this.state.selected_id}
          ></Matrix>
        </div>

        <Matrix
          curr_chart={this.props.curr_chart}
          chart={this.state.chart}
          onMouseDown={(hand, action) => {
            this.props.onMouseDown(hand, action);
          }}
          onMouseOver={(i, j) => {}}
          selected_id={this.state.selected_id}
        ></Matrix>

        <div className="right-panel d-flex flex-column justify-content-spacebetween">
          <div className="legend-joyride legend-container-new flex-column">
            <div className="legend-box-new">
              <h4>Select</h4>

              {["Raise", "Call", "Bluff Raise"].map((ele, i) => {
                let chart = this.props.curr_chart;
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
              <div>
                <button
                  className="edit-button"
                  onClick={() => {
                    this.save();
                  }}
                >
                  Save
                </button>
              </div>
              <div>
                <button
                  className="edit-button"
                  onClick={() => {
                    this.reset();
                  }}
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>

          <div className="reset-container d-flex flex-column justify-content-center">
            <div className="reset-inner-container d-flex flex-column justify-content-around">
              <h4 className="reset-title">Reset Charts</h4>
              <button className="reset" onClick={this.props.resetAllCharts}>
                Reset All Charts
              </button>
              <button className="reset" onClick={this.props.resetOneChart}>
                Reset Current Chart
              </button>
            </div>
          </div>

          <div className="download-wrapper">
            <button className="download" onClick={this.props.download}>
              <i class="fa fa-download"></i> Download Chart
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default RangeConstructorMatrix;
