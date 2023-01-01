import React from "react";
import ReactDOM from "react-dom/client";
import { positions, rfi, std_matrix } from "./data.js";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import Matrix from "./components/Matrix.js";
import Legend from "./components/Legend.js";
import Actions from "./components/Actions.js";
import Navigation from "./components/Navigation.js";

import RangeConstructorMatrix from "./components/RangeConstructorMatrix.js";

// Create page component
// page has variable preflop action (stores preflop action)
// redners matrix based on preflop action
class Page extends React.Component {
  homePageChart = structuredClone(rfi[0]);
  rangeConstructorPageChart = structuredClone(rfi[0]);
  constructor(props) {
    super(props);
    this.state = {
      curr_page: "rangeConstructorPage",
      homePage: {
        open_pos: 0,
        curr_index: 0,
        curr_hand: "AA",
        curr_hand_color: "hand-R",
        curr_hand_suggestion: "Raise",
        actions: ["O", "F", "F", "F", "F", "F", "F", "F", "F"],
        curr_chart: this.homePageChart,
        num_players: 9,
      },
      rangeConstructorPage: {
        open_pos: 0,
        curr_index: 0,
        curr_hand: "AA",
        actions: ["O", "F", "F", "F", "F", "F", "F", "F", "F"],
        curr_chart: this.rangeConstructorPageChart,
      },
    };
  }

  onHover(hand, color) {
    var homePage = this.state.homePage;
    homePage.curr_hand = hand;
    homePage.curr_hand_color = color;
    var code = color[5];
    if (code === "F") {
      homePage.curr_hand_suggestion = "Fold";
    } else if (code === "C") {
      homePage.curr_hand_suggestion = "Call";
    } else if (code === "R") {
      homePage.curr_hand_suggestion = "Raise";
    } else if (code === "B") {
      homePage.curr_hand_suggestion = "Raise as Bluff";
    }
    this.setState({
      homePage: homePage,
    });
  }

  updateHomePage(homePage) {
    this.setState({
      homePage: homePage,
    });
  }

  changePage(newPage) {
    console.log(this.state);
    this.setState({
      curr_page: newPage,
    });
  }

  changeChart_rangeConstructorPage(newChart) {
    var rangeConstructorPage = this.state.rangeConstructorPage;
    rangeConstructorPage.curr_chart = newChart;
    this.setState({
      rangeConstructorPage: rangeConstructorPage,
    });
  }

  render() {
    return (
      <div>
        {/* Navigation Bar */}
        <Navigation
          updateHomePage={(i) => this.updateHomePage(i)}
          homePage={this.state.homePage}
          changePage={(i) => this.changePage(i)}
        ></Navigation>

        <div id="wrapper">
          {/* Home Page */}
          {this.state.curr_page === "homePage" ? (
            <div>
              <div className="d-flex justify-content-center">
                <Actions
                  homepage={this.state.homePage}
                  changeAction={(index, action) => {
                    this.changeAction(index, action);
                  }}
                  updateHomePage={(chart) => {
                    this.updateHomePage(chart);
                  }}
                ></Actions>
                <div>
                  <Matrix
                    curr_chart={this.state.homePage.curr_chart}
                    chart={std_matrix}
                    onMouseOver={(i, j) => {
                      this.onHover(i, j);
                    }}
                  ></Matrix>
                </div>

                <div className="d-flex flex-column">
                  <button
                    className={
                      "curr_hand " + this.state.homePage.curr_hand_color
                    }
                  >
                    <div>
                      <div>{this.state.homePage.curr_hand}</div>
                      <div class="suggestion">
                        {this.state.homePage.curr_hand_suggestion}
                      </div>
                    </div>
                  </button>
                  <div className="my-2"></div>
                  <div className="legend-box p-4 d-flex flex-column">
                    {["Raise", "Call", "Bluff Raise", "Fold"].map((ele, i) => {
                      // calculate percentage
                      let chart = this.state.homePage.curr_chart;
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
                          selected_id={[5]}
                          percentage={(percentage * 100).toFixed(2) + " %"}
                          isClickable={false}
                        ></Legend>
                      );
                    })}
                  </div>
                  <div className="hand-history">
                    <div className="block">
                      <h4>
                        <u>Hand Action</u>
                      </h4>
                      <div className="">
                        {this.state.homePage.actions.map((ele, index) => {
                          console.log(this.state.homePage.actions);
                          return (
                            <div>
                              <strong>{positions[index]}</strong>{" "}
                              {ele === "F"
                                ? "Folds"
                                : ele === "O"
                                ? "Opens"
                                : "Raises"}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {/* Range Constructor Page */}
          {this.state.curr_page === "rangeConstructorPage" ? (
            <div className="d-flex justify-content-center">
              <RangeConstructorMatrix
                curr_chart={this.state.rangeConstructorPage.curr_chart}
              >
                {" "}
              </RangeConstructorMatrix>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

////////////////////////////////////////////////////////////////////////

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page></Page>);
