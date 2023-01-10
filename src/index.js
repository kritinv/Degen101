import React from "react";
import ReactDOM from "react-dom/client";
import { tutorial, positions, std_matrix } from "./data.js";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import Matrix from "./components/Matrix.js";
import Legend from "./components/Legend.js";
import Actions from "./components/Actions.js";
import Navigation from "./components/Navigation.js";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import RangeConstructorPage from "./RangeConstructorPage.js";
import treeFileRoot from "./components/resource/treeData.js";
import { Tree, deepCopyTree } from "./components/resource/tree.js";

// Create page component
// page has variable preflop action (stores preflop action)
// redners matrix based on preflop action

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.mobile = false;

    this.state = {
      first_load: true,
      curr_page: "homePage",
      run: false,
      steps: tutorial,
      stepIndex: 0,
      homePage: {
        chart_title: "UTG RFI",
        open_pos: 0,
        curr_index: 0,
        curr_hand: "AA",
        curr_hand_color: "hand-R",
        curr_hand_suggestion: "Raise",
        actions: ["O", "F", "F", "F", "F", "F", "F", "F", "F"],
        num_players: 9,
        cannot_open_idx_start: 9,
        cannot_raise_idx_end: -1,
        cannot_raise_idx_start: 9,
      },
      rangeConstructorPage: {
        open_pos: 0,
        curr_index: 0,
        curr_hand: "AA",
        actions: ["O", "F", "F", "F", "F", "F", "F", "F", "F"],
      },
      data: window.localStorage.getItem("data"),
    };

    // set rangeConstructorPageFileRoot and homePageTreeFileRoot in state
    if (this.state.data === null) {
      this.state.rangeConstructorPage.treeFileRoot = deepCopyTree(treeFileRoot);
    } else {
      this.state.rangeConstructorPage.treeFileRoot = new Tree(
        "root",
        "root",
        true,
        JSON.parse(this.state.data)
      );
    }
    this.state.homePage.treeFileRoot = deepCopyTree(
      this.state.rangeConstructorPage.treeFileRoot
    );

    // set treeFileRoot and currChart in state
    this.state.homePage.curr_chart =
      this.state.homePage.treeFileRoot.find("UTG RFI").value;
    this.state.rangeConstructorPage.curr_chart =
      this.state.rangeConstructorPage.treeFileRoot.find("UTG RFI").value;
  }

  // loadData after saving to local storage
  loadData(chart) {
    console.log(chart);
    let new_data = window.localStorage.getItem("data");
    let newHomePage = this.state.homePage;
    let newRangeConstructorPage = this.state.rangeConstructorPage;

    newRangeConstructorPage.treeFileRoot = new Tree(
      "root",
      "root",
      true,
      JSON.parse(new_data)
    );
    newRangeConstructorPage.curr_chart =
      newRangeConstructorPage.treeFileRoot.find(chart).value;
    newHomePage.treeFileRoot = deepCopyTree(
      newRangeConstructorPage.treeFileRoot
    );
    newHomePage.curr_chart = newHomePage.treeFileRoot.find(chart).value;

    this.setState({
      data: new_data,
      homePage: newHomePage,
      rangeConstructorPage: newRangeConstructorPage,
    });
  }

  // Reseting All Charts from Range Constructor Page
  resetAllCharts(chart) {
    let newTree = deepCopyTree(treeFileRoot);
    window.localStorage.setItem("data", JSON.stringify(newTree));
    this.loadData(chart);
  }
  // Reseting One Chart from Range Constructor Page
  resetOneChart(chart) {
    let newChartValue = deepCopyTree(treeFileRoot).find(chart).value;
    let new_data = new Tree("root", "root", true, JSON.parse(this.state.data));
    let node = new_data.find(chart);
    node.value = newChartValue;

    console.log(chart);
    console.log(newChartValue);
    console.log(new_data);

    window.localStorage.setItem("data", JSON.stringify(new_data));
    this.loadData(chart);
  }

  startTutorial() {
    this.changePage("homePage");
    this.setState({
      run: true,
    });
  }

  endTutorial() {
    this.setState({
      run: false,
    });
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

  updateRangeConstructorPage(new_rangeConstructorPage) {
    this.setState({
      rangeConstructorPage: new_rangeConstructorPage,
    });
    console.log(this.state.rangeConstructorPage);
  }

  handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    console.log(index);

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      this.setState({
        stepIndex: index + (action === ACTIONS.PREV ? -1 : 1),
      });
      if (index === 5) {
        this.changePage("rangeConstructorPage");
        this.setState({ stepIndex: 6 });
      }
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ run: false });
      this.setState({ stepIndex: 0 });
    }
  };

  render() {
    if (this.state.first_load) {
      var r = document.querySelector(":root");

      if (window.screen.availHeight > 600 && window.screen.width > 600) {
        r.style.setProperty("--screenheight", window.screen.availHeight * 0.9);
        r.style.setProperty("--screenwidth", window.screen.width);
      } else {
        r.style.setProperty("--screenheight", 770);
        r.style.setProperty("--screenwidth", 1440);
        this.mobile = true;
      }
      this.setState({ first_load: false });
    }
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.mobile = true;
    }

    return (
      <div>
        <Joyride
          continuous
          showProgress
          showSkipButton
          callback={this.handleJoyrideCallback}
          run={this.state.run}
          stepIndex={this.state.stepIndex}
          steps={this.state.steps}
        />
        {/* Navigation Bar */}
        <Navigation
          mobile={this.mobile}
          startTutorial={() => this.startTutorial()}
          endTutorial={() => this.endTutorial()}
          updateHomePage={(i) => this.updateHomePage(i)}
          homePage={this.state.homePage}
          changePage={(i) => this.changePage(i)}
          curr_page={this.state.curr_page}
        ></Navigation>

        <div>
          {/* Home Page */}
          {this.state.curr_page === "homePage" ? (
            <div className="wrapper d-flex justify-content-center">
              <Actions
                homepage={this.state.homePage}
                updateHomePage={(chart) => {
                  this.updateHomePage(chart);
                }}
                treeData={treeFileRoot}
              ></Actions>
              <div>
                <Matrix
                  curr_chart={
                    this.state.homePage.treeFileRoot.find(
                      this.state.homePage.chart_title
                    ).value
                  }
                  chart={std_matrix}
                  onMouseOver={(i, j) => {
                    this.onHover(i, j);
                  }}
                  onMouseDown={(i, j) => {}}
                ></Matrix>
              </div>

              <div className="right-panel right-panel-joyride d-flex flex-column justify-content-between">
                <div
                  className={
                    "d-flex flex-column justify-content-center curr_hand " +
                    this.state.homePage.curr_hand_color
                  }
                >
                  <div>
                    <div>{this.state.homePage.curr_hand}</div>
                    <div className="suggestion">
                      {this.state.homePage.curr_hand_suggestion}
                    </div>
                  </div>
                </div>

                <div className="legend-joyride legend-container">
                  <div className="legend-joyride legend-box">
                    {["Raise", "Call", "Bluff Raise", "Fold"].map((ele, i) => {
                      // calculate percentage
                      let chart = this.state.homePage.treeFileRoot.find(
                        this.state.homePage.chart_title
                      ).value;
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
                          key={i}
                          value={ele}
                          id={i}
                          selected_id={[5]}
                          percentage={(percentage * 100).toFixed(2) + " %"}
                          isClickable={false}
                        ></Legend>
                      );
                    })}
                  </div>
                </div>
                <div className="hand-history">
                  <div className="block">
                    <h4>Hand Action</h4>
                    <div className="">
                      {this.state.homePage.actions.map((ele, index) => {
                        return (
                          <div key={index}>
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
          ) : null}

          {/* Range Constructor Page */}
          {this.state.curr_page === "rangeConstructorPage" ? (
            <RangeConstructorPage
              loadData={(chart) => this.loadData(chart)}
              resetOneChart={(chart) => this.resetOneChart(chart)}
              resetAllCharts={(chart) => this.resetAllCharts(chart)}
              rangeConstructorPage={this.state.rangeConstructorPage}
              curr_chart={this.state.rangeConstructorPage.curr_chart}
              updateRangeConstructorPage={(rangeConstructorState) => {
                this.updateRangeConstructorPage(rangeConstructorState);
              }}
              updateHomePage={(chart) => {
                this.updateHomePage(chart);
              }}
              homePage={this.state.homePage}
            ></RangeConstructorPage>
          ) : null}
        </div>
      </div>
    );
  }
}

////////////////////////////////////////////////////////////////////////

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page></Page>);
