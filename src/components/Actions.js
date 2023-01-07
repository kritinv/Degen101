import React from "react";
import { positions } from "./../data.js";

function Action(props) {
  return props.action === props.value ? (
    <button className="action-on action" onClick={props.changeAction}>
      {props.value}
    </button>
  ) : (
    <button className="action-off action" onClick={props.changeAction}>
      {props.value}
    </button>
  );
}

function Position(props) {
  return props.curr_index === props.index ? (
    <button className="position position-on">{props.value}</button>
  ) : (
    <button
      className="position position-off"
      onClick={props.changeCurrPosition}
    >
      {props.value}
    </button>
  );
}

function ActionOff(props) {
  return <button className="action action-dead">{props.value}</button>;
}

function PositionOff(props) {
  return <button className="position position-dead">{props.value}</button>;
}

class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.actions = props.homepage.actions;
    this.curr_index = props.homepage.curr_index;
    this.open_pos = props.homepage.open_pos;
    this.chart_title = props.homepage.chart_title;
    this.cannot_open_idx_start = props.homepage.cannot_open_idx_start;
    this.cannot_raise_idx_end = props.homepage.cannot_raise_idx_end;
    this.cannot_raise_idx_start = props.homepage.cannot_raise_idx_start;
  }

  // update action based on pressed buttons (R/O/F)
  changeAction(index, action) {
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
        this.chart_title = positions[index] + " RFI";
        this.cannot_raise_idx_start = 9;
        this.cannot_raise_idx_end = index;
      } else {
        // case when opening is before current position

        this.chart_title =
          positions[this.curr_index] + " vs " + positions[index] + " RFI";
        this.cannot_raise_idx_start = this.curr_index;
        this.cannot_raise_idx_end = this.open_pos - 1;
      }
    } else if (action === "R") {
      // ensures that you can only raise once in a game
      for (var z = 0; z < this.actions.length; z++) {
        if (index !== z && this.actions[z] !== "O") {
          this.actions[z] = "F";
        }
      }
      if (index < this.curr_index && index > this.open_pos) {
        this.chart_title =
          positions[this.curr_index] + " vs " + positions[index] + " 3-bet";
      }
      if (index > this.curr_index) {
        this.chart_title =
          positions[this.curr_index] + " RFI vs " + positions[index] + " 3-bet";
      }
    } else if (action === "F") {
      this.changeAction(this.open_pos, "O");
      return;
    }

    let new_homepage = this.props.homepage;
    new_homepage.chart_title = this.chart_title;
    new_homepage.actions = this.actions;
    new_homepage.open_pos = this.open_pos;
    new_homepage.cannot_raise_idx_start = this.cannot_raise_idx_start;
    new_homepage.cannot_raise_idx_end = this.cannot_raise_idx_end;
    this.props.updateHomePage(new_homepage);
  }

  // update action and position based on pressed button position
  changeCurrPosition(index) {
    let new_homepage = this.props.homepage;
    this.curr_index = index;
    this.cannot_open_idx_start = index + 1;
    new_homepage.curr_index = this.curr_index;
    new_homepage.cannot_open_idx_start = this.cannot_open_idx_start;
    this.props.updateHomePage(new_homepage);
    this.changeAction(index, "O");
  }

  render() {
    return (
      <div className="actions">
        <div className="chart-title chart-title-joyride d-flex flex-column justify-content-center">
          <div>{this.chart_title}</div>
        </div>
        <div className="action-button-wrapper">
          {positions.map((i, index) => {
            if (index >= 9 - this.props.homepage.num_players) {
              return (
                <div key={index} className="actions-row d-flex action-joyride">
                  <Position
                    value={i}
                    curr_index={this.curr_index}
                    index={index}
                    changeCurrPosition={() => {
                      this.changeCurrPosition(index);
                    }}
                  ></Position>

                  {index > this.cannot_raise_idx_end &&
                  index < this.cannot_raise_idx_start &&
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

                  {index < this.cannot_open_idx_start && index !== 8 ? (
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
                <div className="actions-row d-flex">
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
