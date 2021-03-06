import React from "react";

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    store.subscribe(() => this.setState(store.getState()));
  }

  componentWillMount() {
    store.subscribe(() => this.setState(store.getState()));
  }

  render() {
    const onClick = () => store.dispatch({ type: "TOGGLE" });
    return (
      <div>
        <h1>Hey, Y'all!</h1>
        <div>
          Learn Redux
          <input
            type="checkbox"
            checked={!!this.state.checked}
            onClick={onClick}
          />
        </div>
        {this.state.checked ? <h2>Done!</h2> : null}
      </div>
    );
  }
}
