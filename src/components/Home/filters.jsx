import React from "react";
import { connect } from "react-redux";
import { fetchAllTags } from "../../services/article";
import { LOAD_TAGS } from "../../constants/actionTypes";

const mapStateToProps = state => ({
  tags: state.tags
});

const mapDispatchToProps = dispatch => ({
  loadTags: payload => dispatch({ type: LOAD_TAGS, payload })
});

class Filters extends React.Component {
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
      if (result.tags) {
        const tags = result.tags.map(item => {
          return {
            name: item,
            selected: true
          };
        });
        this.props.loadTags(tags);

        //this.setState({ tags });
      }
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
    const { tags } = this.props.tags;
    console.log(tags);
    const { filtersActive } = this.state;
    return (
      <React.Fragment>
        <div className="row mt-5">
          <button
            className="btn btn-sm btn-primary blockBtn"
            type="button"
            onClick={this.toggleFilters}
          >
            Toggle Filters
          </button>
        </div>

        {filtersActive ? (
          <React.Fragment>
            {tags.map((tag, index) => {
              return (
                <div key={`${tag}${index}`} className="filter-container">
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
                </div>
              );
            })}
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
