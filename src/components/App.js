import Header from './Header';
import Home from './Home';
import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  appName: state.appName
});

class App extends React.Component {
  render() {
    return (
      <div>
        <Header appName={this.props.appName} />
        {this.props.children}
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, () => ({}))(App);
