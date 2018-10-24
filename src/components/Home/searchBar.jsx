import React from "react";

import { searchArticles } from "../../services/article";

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      searchInput: ""
    };

    this.inputField = this.inputField.bind(this);
    this.search = this.search.bind(this);
  }

  search() {
    searchArticles(this.state.searchInput);
  }

  inputField(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div>
        <input
          type="text"
          name="searchInput"
          onChange={event => {
            this.inputField(event);
          }}
          placeholder="Enter Search parameters"
        />
        <input type="button" onClick={this.search} value="search" />
      </div>
    );
  }
}

export default SearchBar;
