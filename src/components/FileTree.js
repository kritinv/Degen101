import zIndex from "@mui/material/styles/zIndex";
import React from "react";
import treeFileRoot from "./resource/treeData";

class TreeItemComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      active: false,
      currentButton: this.props.currentButton,
      chart: this.props.chart,
    };
    if (this.props.index === 0) {
      this.onClick();
    }
  }

  onClick() {
    var currentButton = this.state.currentButton;
    currentButton[0] = this.state.name;
    this.setState({
      active: this.state.active,
      currentButton: currentButton,
    });
    this.props.changeChart(this.state.chart, this.props.name);
    this.props.stateChangeTrigger();
  }
  render() {
    return (
      <div>
        {this.state.currentButton[0] === this.state.name ? (
          <button
            type="button"
            class="tree-item-component disable tree-item-component-disable"
            data-bs-toggle="button"
            aria-pressed="false"
            disabled
            onClick={() => {
              this.onClick();
            }}
          >
            {this.state.name}
          </button>
        ) : (
          <button
            type="button"
            class="tree-item-component"
            data-bs-toggle="button"
            aria-pressed="false"
            onClick={() => {
              this.onClick();
            }}
          >
            {this.state.name}
          </button>
        )}
      </div>
    );
  }
}

class TreeContainerComponent extends React.Component {
  render() {
    return (
      <div>
        {this.props.hidden ? (
          <div>
            <button
              className="tree-container-component"
              onClick={() => this.props.toggleHidden()}
            >
              ► {this.props.name}
            </button>
          </div>
        ) : (
          <div>
            <button
              className="tree-container-component"
              onClick={() => this.props.toggleHidden()}
            >
              ▼ {this.props.name}
            </button>
            <div class="margin-right: 1rem ">{this.props.children}</div>
          </div>
        )}
      </div>
    );
  }
}

class TreeComponent extends React.Component {
  constructor(props) {
    super(props);
    let root = this.props.root;
    let currentButton = this.props.currentButton;

    this.state = {
      treeFileRoot: root,
      currentButton: currentButton,
      disable: [],
    };
    for (var i = 0; i < this.state.treeFileRoot.children.length; i++) {
      this.state.disable.push(true);
    }
    if (root === treeFileRoot["root"]) {
      this.state.disable[0] = false;
    }
  }

  toggleHidden(i) {
    let new_disable = this.state.disable;
    for (var j = 0; j < this.state.treeFileRoot.children.length; j++) {
      if (j !== i) {
        new_disable[j] = true;
      }
    }
    new_disable[i] = !this.state.disable[i];
    this.setState({
      disable: new_disable,
    });
  }

  render() {
    // console.log(this.state.disable);
    return (
      <div className="margin-tree">
        {this.props.root.children.map((ele, i) => {
          return (
            <div>
              {ele.isFolder === true ? (
                <TreeContainerComponent
                  name={ele.key}
                  hidden={this.state.disable[i]}
                  toggleHidden={() => this.toggleHidden(i)}
                >
                  {/* {console.log(ele.children.map(ele => ele.key))} */}
                  {/* {console.log(ele.key)} */}
                  {/* {console.log(ele.children[0].key)}
                {console.log(ele.children.length > 0)} */}
                  {ele.children.length > 0 ? (
                    <TreeComponent
                      root={ele}
                      currentButton={this.state.currentButton}
                      stateChangeTrigger={() => {
                        this.props.stateChangeTrigger();
                      }}
                      changeChart={(newChart, name) => {
                        this.props.changeChart(newChart, name);
                      }}
                    ></TreeComponent>
                  ) : null}
                  {/* <TreeItemComponent name={"open"}></TreeItemComponent> */}
                  {/* <button>This is a button</button> */}
                </TreeContainerComponent>
              ) : (
                <TreeItemComponent
                  index={i}
                  name={ele.key}
                  currentButton={this.state.currentButton}
                  stateChangeTrigger={() => {
                    this.props.stateChangeTrigger();
                  }}
                  chart={ele.value}
                  changeChart={(newChart, name) => {
                    this.props.changeChart(newChart, name);
                  }}
                ></TreeItemComponent>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export { TreeComponent, TreeContainerComponent, TreeItemComponent };
