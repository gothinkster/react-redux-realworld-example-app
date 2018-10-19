import React from "react";
import agent from "../../agent";
import { fetchAllTags } from "../../services/article";

export const YourFeedTab = props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      props.onTabClick("feed", agent.Articles.feed, agent.Articles.feed());
    };

    return (
      <li className="nav-item">
        <a
          href=""
          className={props.tab === "feed" ? "nav-link active" : "nav-link"}
          onClick={clickHandler}
        >
          Your Feed
        </a>
      </li>
    );
  }
  return null;
};

export const GlobalFeedTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick("all", agent.Articles.all, agent.Articles.all());
  };
  return (
    <li className="nav-item">
      <a
        href=""
        className={props.tab === "all" ? "nav-link active" : "nav-link"}
        onClick={clickHandler}
      >
        Global Feed
      </a>
    </li>
  );
};

export const TagFilterTab = props => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound" /> {props.tag}
      </a>
    </li>
  );
};

export class Filters extends React.Component {
  constructor() {
    super();
    this.state = {
      filtersActive: false
    };
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  toggleFilters() {
    const getCount = new Promise((resolve, reject) => {
      resolve(getArticleCount());
    });

    getCount.then(result => {
      this.setState({ articlesCount: result.count });
    });

    const getArticles = new Promise((resolve, reject) => {
      resolve(fetchArticles(this.state.currentPage));
    });

    getArticles.then(result => {
      this.setState({ articles: result.articles });
    });

    const getTags = new Promise(resolve => {
      resolve(fetchAllTags());
    });

    this.setState(prevState => ({
      filtersActive: !prevState.filtersActive
    }));
  }

  render() {
    return (
      <div>
        <button
          className="btn btn-sm btn-primary"
          type="button"
          onClick={this.toggleFilters}
        >
          Toggle Filters
        </button>

        {this.state.filtersActive === true && (
          <ul className="list-unstyled toggleUL">
            <li>
              <form className="form-inline">
                <label className="checkbox" htmlFor="react">
                  <input name="react" type="checkbox" />
                  react
                </label>
              </form>
            </li>
          </ul>
        )}
      </div>
    );
  }
}
