import React from "react";
import { connect } from "react-redux";
import { searchArticles } from "../../services/article";
import { LOAD } from "../../constants/actionTypes";

const mapDispatchToProps = dispatch => ({
  load: articles => dispatch({ type: LOAD, payload: articles })
});

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      searchInput: "",
      error: ""
    };

    this.inputField = this.inputField.bind(this);
    this.checkForErrors = this.checkForErrors.bind(this);
    this.search = this.search.bind(this);
  }

  watchForEnter(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this.checkForErrors(event.target.value);
    }
  }

  search(searchInput) {
    const mySearch = new Promise(resolve => {
      resolve(searchArticles(searchInput));
    });

    mySearch.then(results => {
      this.props.load(results);
    });
  }

  inputField(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  checkForErrors() {
    const { searchInput } = this.state;
    if (searchInput.length > 0) {
      if (
        searchInput.match(/"/g) !== null &&
        searchInput.match(/"/g).length % 2 !== 0
      ) {
        this.setState({ error: "Quote must be used as a pair" });
      } else {
        this.search(searchInput);
      }
    } else {
      this.setState({ error: "Cannot enter blank search term" });
    }
  }

  render() {
    const { searchInput, error } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          {error.length > 0 ? <div className="error">{error}</div> : <br />}
        </div>
        <div className="row">
          <div className="col">
            <input
              type="text"
              name="searchInput"
              className="form-control form-control-sm"
              value={searchInput}
              onChange={event => this.inputField(event)}
              onKeyUp={event => this.watchForEnter(event)}
              placeholder="Enter Search parameters"
              autoFocus
            />
          </div>
          <div className="col">
            <button
              className="btn btn-sm btn-primary pull-xs-right ml-5"
              onClick={this.checkForErrors}
            >
              Search
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SearchBar);
