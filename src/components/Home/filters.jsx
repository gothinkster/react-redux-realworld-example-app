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
      filtersActive: false,
      tags: []
    };
    this.toggleFilters = this.toggleFilters.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  componentDidMount() {
    const getTags = new Promise(resolve => {
      resolve(fetchAllTags());
    });

    getTags.then(result => {
      const tags = result.tags.map(item => {
        return {
          name: item,
          selected: true
        };
      });
      this.setState({ tags });
    });
  }

  toggleFilter(event, index) {
    const { tags } = this.state;
    tags[index].selected = event.target.checked;
    this.setState({ tags });
  }

  toggleFilters() {
    this.setState(prevState => ({
      filtersActive: !prevState.filtersActive
    }));
  }

  render() {
    const { filtersActive, tags } = this.state;
    return (
      <div>
        <button
          className="btn btn-sm btn-primary"
          type="button"
          onClick={this.toggleFilters}
        >
          Toggle Filters
        </button>

        {filtersActive && (
          <ul className="list-unstyled toggleUL">
            {tags.map((tag, index) => {
              return (
                <li key={`${tag}${index}`}>
                  <form className="form-inline">
                    <label className="checkbox" htmlFor={`${tag}Checkbox`}>
                      <input
                        type="checkbox"
                        name={`${tag}Checkbox`}
                        checked={tag.selected}
                        onChange={event => this.toggleFilter(event, index)}
                      />
                      &nbsp;
                      {tag.name}
                    </label>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}
