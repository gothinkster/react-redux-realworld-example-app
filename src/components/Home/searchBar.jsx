import React from "react";

import { searchArticles } from "../../services/article";

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      searchInput: "",
      error: ""
    };

    this.inputField = this.inputField.bind(this);
    this.search = this.search.bind(this);
  }

  watchForEnter(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this.checkForErrors(event.target.value);
      //this.search();
    }
  }

  search() {
    searchArticles(this.state.searchInput);
  }

  inputField(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  checkForErrors(value) {
    if (value.length > 0) {
      if (value.match(/"/g) !== null && value.match(/"/g).length % 2 !== 0) {
        this.setState({ error: "Quote must be used as a pair" });
      } else {
        this.search();
      }
    } else {
      this.setState({ error: "Cannot enter blank search term" });
    }
  }

  render() {
    const { searchInput, error } = this.state;
    return (
      <div className="row">
        {error.length > 0 ? <div className="error">{error}</div> : <br />}

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
          <input
            type="button"
            className="btn btn-sm btn-primary pull-xs-right ml-5"
            onClick={this.checkForErrors}
            value="search"
          />
        </div>
      </div>
    );
  }
}

export default SearchBar;
