import React from "react";
import { vs_3betcold, rfi_vs_3bet, vs_rfi, rfi, positions } from "./../data.js";

function Action(props) {
  return props.action === props.value ? (
    <button className="action-on" onClick={props.changeAction}>
      {props.value}
    </button>
  ) : (
    <button className="action" onClick={props.changeAction}>
      {props.value}
    </button>
  );
}

function Position(props) {
  return props.curr_index === props.index ? (
    <div>
      <button className="position-on mx-3">{props.value}</button>
    </div>
  ) : (
    <div>
      <button className="position mx-3" onClick={props.changeCurrPosition}>
        {props.value}
      </button>
    </div>
  );
}

function ActionOff(props) {
  return <button className="actionoff">{props.value}</button>;
}

function PositionOff(props) {
  return <button className="positionoff mx-3">{props.value}</button>;
}

class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.actions = props.homepage.actions;
    this.curr_index = props.homepage.curr_index;
    this.open_pos = props.homepage.open_pos;
    this.curr_chart = props.homepage.curr_chart;
    this.state = {
      chart_title: "UTG Open",
      cannot_open_idx_start: 1,
      cannot_raise_idx_end: -1,
      cannot_raise_idx_start: 9,
    };
  }

  // update action based on pressed buttons (R/O/F)
  changeAction(index, action) {
    let new_cannot_raise_idx_end = this.state.cannot_raise_idx_end;
    let new_cannot_raise_idx_start = this.state.cannot_raise_idx_start;
    let new_chart_title = this.state.chart_title;

    this.actions[index] = action;
    if (action === "O") {
      this.open_pos = index;
      // ensures that you can only open once in a game
      for (var i = 0; i < index; i++) {
        this.actions[i] = "F";
      }
      for (var j = index + 1; j < 10 + 1; j++) {
        this.actions[j] = "F";
      }

      if (index === this.curr_index) {
        // case when opening is equal to current position
        this.curr_chart = rfi[this.open_pos];
        new_chart_title = positions[index] + " RFI";
        new_cannot_raise_idx_start = 9;
        new_cannot_raise_idx_end = index;
      } else {
        // case when opening is before current position
        this.curr_chart =
          vs_rfi[this.open_pos][this.curr_index - this.open_pos - 1];
        new_chart_title =
          positions[this.curr_index] + " vs. " + positions[index] + " RFI";
        new_cannot_raise_idx_start = this.curr_index;
        new_cannot_raise_idx_end = this.open_pos - 1;
      }
    } else if (action === "R") {
      // ensures that you can only raise once in a game
      for (var z = 0; z < this.actions.length; z++) {
        if (index !== z && this.actions[z] !== "O") {
          this.actions[z] = "F";
        }
      }
      if (index < this.curr_index && index > this.open_pos) {
        this.curr_chart = vs_3betcold[this.curr_index - 2];
        new_chart_title =
          positions[this.curr_index] +
          " vs. " +
          positions[index] +
          " 3-bet Cold";
      }
      if (index > this.curr_index) {
        this.curr_chart =
          rfi_vs_3bet[this.curr_index][index - this.curr_index - 1];
        new_chart_title =
          positions[this.curr_index] +
          " RFI vs. " +
          positions[index] +
          " 3-bet";
      }
    } else if (action === "F") {
      this.changeAction(this.open_pos, "O");
      return;
    }

    console.log(new_chart_title);
    this.setState({
      chart_title: new_chart_title,
      cannot_raise_idx_end: new_cannot_raise_idx_end,
      cannot_raise_idx_start: new_cannot_raise_idx_start,
    });
    let new_homepage = this.props.homepage;
    new_homepage.actions = this.actions;
    new_homepage.open_pos = this.open_pos;
    new_homepage.curr_chart = this.curr_chart;
    this.props.updateHomePage(new_homepage);
  }

  // update action and position based on pressed button position
  changeCurrPosition(index) {
    let new_cannot_open_idx_start = index + 1;
    this.setState({ cannot_open_idx_start: new_cannot_open_idx_start });
    this.curr_index = index;
    this.changeAction(index, "O");
  }

  render() {
    return (
      <div>
        <div className="Actions">
          <button className="chart-title">{this.state.chart_title}</button>
          {positions.map((i, index) => {
            if (index >= 9 - this.props.homepage.num_players) {
              return (
                <div className="d-flex">
                  <Position
                    value={i}
                    curr_index={this.curr_index}
                    index={index}
                    changeCurrPosition={() => {
                      this.changeCurrPosition(index);
                    }}
                  ></Position>

                  {index > this.state.cannot_raise_idx_end &&
                  index < this.state.cannot_raise_idx_start &&
                  index !== this.open_pos ? (
                    <Action
                      value={"R"}
                      action={this.actions[index]}
                      changeAction={() => {
                        this.changeAction(index, "R");
                      }}
                    ></Action>
                  ) : (
                    <ActionOff value="R"></ActionOff>
                  )}

                  {index < this.state.cannot_open_idx_start && index < 8 ? (
                    <Action
                      value={"O"}
                      action={this.actions[index]}
                      changeAction={() => {
                        this.changeAction(index, "O");
                      }}
                    ></Action>
                  ) : (
                    <ActionOff value={"O"}></ActionOff>
                  )}

                  {index !== this.open_pos ? (
                    <Action
                      value={"F"}
                      action={this.actions[index]}
                      changeAction={() => {
                        this.changeAction(index, "F");
                      }}
                    ></Action>
                  ) : (
                    <ActionOff value={"F"}></ActionOff>
                  )}
                </div>
              );
            } else {
              return (
                <div className="d-flex">
                  <PositionOff value={i}></PositionOff>
                  {["R", "O", "F"].map((a) => {
                    return <ActionOff value={a}></ActionOff>;
                  })}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default Actions;
