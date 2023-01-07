import React from "react";
import RangeConstructorMatrix from "./components/RangeConstructorMatrix";
import { TreeComponent } from "./components/FileTree";

import { deepCopyTree } from "./components/resource/tree";

import Alert from "react-bootstrap/Alert";

import html2canvas from "html2canvas";
import { VerticallyCenteredModal } from "./components/Model";

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

class RangeConstructorPage extends React.Component {
  constructor(props) {
    super(props);
    // let currentPage = this.props.currentPage;
    let currentButton = ["UTG RFI"];
    this.state = {
      saved: false,
      rangeConstructorPage: this.props.rangeConstructorPage,
      currentButton: currentButton,
      chart_title: "UTG RFI",
      modalShow: false,
    };
  }

  // manually trigger rerender
  stateChangeTrigger() {
    this.setState({});
  }

  save() {
    let newTree = deepCopyTree(this.props.rangeConstructorPage.treeFileRoot);
    console.log(newTree.find(this.state.chart_title).value);
    // save to local storage
    window.localStorage.setItem("data", JSON.stringify(newTree));
    this.props.loadData(this.state.chart_title);
    this.setState({
      saved: true,
    });
    setTimeout(() => {
      this.setState({
        saved: false,
      });
    }, 1000);
  }

  reset() {
    let newTree = deepCopyTree(this.props.homePage.treeFileRoot);
    let new_rangeConstructorPage = this.props.rangeConstructorPage;
    new_rangeConstructorPage.treeFileRoot = newTree;
    new_rangeConstructorPage.curr_chart =
      new_rangeConstructorPage.treeFileRoot.find(this.state.chart_title).value;
    this.props.updateRangeConstructorPage(new_rangeConstructorPage);
    this.stateChangeTrigger();
  }

  download() {
    // var data = structuredClone(this.props.rangeConstructorPage.treeFileRoot)
    // var fileName = 'myData.json';

    // // Create a blob of the data
    // var fileToSave = new Blob([JSON.stringify(data)], {
    //     type: 'application/json'
    // });

    // // Save the file
    // saveAs(fileToSave, fileName);

    this.setState({
      modalShow: true,
    });

    html2canvas(document.getElementById("screenshot"), {
      onclone: function (clonedDoc) {
        clonedDoc.getElementById("screenshot").style.display = "block";
      },
    }).then(function (canvas) {
      console.log("modal show");
      canvas.style.height = "70%";
      canvas.style.width = "100%";
      document.getElementById("screenshot-result").appendChild(canvas);
    });
  }

  load() {}

  changeChart(newChart, name) {
    let new_rangeConstructorPage = this.props.rangeConstructorPage;
    new_rangeConstructorPage.curr_chart = newChart;
    this.props.updateRangeConstructorPage(new_rangeConstructorPage);
    this.stateChangeTrigger();
    this.setState({
      chart_title: name,
    });
  }

  convertHandToIndex(hand) {
    var row = helperArray.findIndex((ele) => ele === hand[0]);
    var col = helperArray.findIndex((ele) => ele === hand[1]);
    return [row, col];
  }

  onMouseDown(hand, action) {
    let [row, col] = this.convertHandToIndex(hand);
    let new_rangeConstructorPage = this.state.rangeConstructorPage;
    let chart = new_rangeConstructorPage.curr_chart;
    let actions = ["R", "C", "B"];

    if (hand[2] === "o") {
      let temp = row;
      row = col;
      col = temp;
    }

    if (chart[row][col] === "F") chart[row][col] = actions[action];
    else if (chart[row][col] !== actions[action])
      chart[row][col] = actions[action];
    else chart[row][col] = "F";

    this.setState({
      rangeConstructorPage: new_rangeConstructorPage,
      chart: chart,
    });
  }

  render() {
    return (
      <div className="wrapper">
        <VerticallyCenteredModal
          show={this.state.modalShow}
          onHide={() => {
            this.setState({
              modalShow: false,
            });
          }}
          heading={"Chart Screenshot"}
        >
          <div id="screenshot-result"></div>
        </VerticallyCenteredModal>
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-column justify-content-between left-panel">
            <div className="chart-title d-flex flex-column justify-content-center">
              <div>{this.state.chart_title}</div>
            </div>
            <div className="file-tree-container file-tree-joyride">
              <div className="file-tree">
                <TreeComponent
                  root={this.props.rangeConstructorPage.treeFileRoot.root}
                  currentButton={this.state.currentButton}
                  stateChangeTrigger={() => {
                    this.stateChangeTrigger();
                  }}
                  changeChart={(newChart, name) => {
                    this.changeChart(newChart, name);
                  }}
                ></TreeComponent>
              </div>
            </div>
          </div>
          <div>
            <RangeConstructorMatrix
              chart_title={this.state.chart_title}
              curr_chart={this.props.rangeConstructorPage.curr_chart}
              onMouseDown={(hand, action) => {
                this.onMouseDown(hand, action);
              }}
              resetOneChart={() => {
                this.props.resetOneChart(this.state.chart_title);
              }}
              resetAllCharts={() =>
                this.props.resetAllCharts(this.state.chart_title)
              }
              download={() => {
                this.download();
              }}
              save={() => {
                this.save();
              }}
              reset={() => {
                this.reset();
              }}
            ></RangeConstructorMatrix>
          </div>
          <div class="d-flex flex-row mb-10">
            {this.state.saved === true ? (
              <Alert className="alert-div" key={"success"} variant={"success"}>
                Saved Successfully!
              </Alert>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default RangeConstructorPage;
