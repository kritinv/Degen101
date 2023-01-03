import React from "react";

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      self_id: this.props.id,
      selected_id: this.props.selected_id,
    };
  }

  selected() {
    console.log(this.state);

    var selected_id = this.state.selected_id;
    selected_id[0] = this.state.self_id;
    this.setState({
      selected_id: selected_id,
    });
    this.props.stateChangeTrigger();
  }

  render() {
    return this.state.selected_id[0] === this.state.self_id &&
      this.props.isClickable === true ? (
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <button
            className={"legend-color selected l-" + this.props.id}
          ></button>
          <div className="fw-bold">{this.props.value}</div>
        </div>
        <div>{this.props.percentage}</div>
      </div>
    ) : (
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <button
            className={"legend-color l-" + this.props.id}
            onClick={() => {
              this.selected();
            }}
          ></button>
          <div>{this.props.value}</div>
        </div>
        <div>{this.props.percentage}</div>
      </div>
    );
  }
}

export default Legend;
