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
    return ((this.state.selected_id[0] === this.state.self_id) && (this.props.isClickable === true))? (
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <button className={"legend selected l-" + this.props.id}></button>
          <h5 className="fw-bold">{this.props.value}</h5>
        </div>
        <h5>{this.props.percentage}</h5>
      </div>
    ) : (
      <div className="legend-text d-flex justify-content-between">
        <div className="d-flex">
          <button
            className={"legend l-" + this.props.id}
            onClick={() => {
              this.selected();
            }}
          ></button>
          <h5>{this.props.value}</h5>
        </div>
        <h5>{this.props.percentage}</h5>
      </div>
    );
  }
}

export default Legend;
