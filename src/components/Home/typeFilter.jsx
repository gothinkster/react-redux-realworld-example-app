import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { UPDATE_TYPE_FILTER } from "../../constants/actionTypes";

const mapStateToProps = state => ({
  typeFilter: state.articleList.typeFilter
});

const mapDispatchToProps = dispatch => ({
  updateTypeFilter: payload => dispatch({ type: UPDATE_TYPE_FILTER, payload })
});

class TypeFilter extends React.Component {
  constructor() {
    super();
    this.updateTypeFilter = this.updateTypeFilter.bind(this);
  }

  componentDidMount() {
    this.props.updateTypeFilter("All");
  }

  updateTypeFilter(event) {
    const { name } = event.target;
    this.props.updateTypeFilter(name);
  }

  render() {
    const { typeFilter } = this.props;
    return (
      <div style={{ float: "right" }}>
        <button
          className={`btn btn-sm btn-left ${
            typeFilter === "Tutorial" ? "btn-primary" : ""
          }`}
          name="Tutorial"
          onClick={event => this.updateTypeFilter(event)}
        >
          Tutorial/Op-Ed
        </button>
        <button
          className={`btn btn-sm btn-middle ${
            typeFilter === "All" ? "btn-primary" : ""
          }`}
          onClick={event => this.updateTypeFilter(event)}
          name="All"
        >
          All
        </button>
        <button
          className={`btn btn-sm btn-right ${
            typeFilter === "Stack Overflow" ? "btn-primary" : ""
          }`}
          onClick={event => this.updateTypeFilter(event)}
          name="Stack Overflow"
        >
          Stack Overflow
        </button>
      </div>
    );
  }
}

TypeFilter.propTypes = {
  updateTypeFilter: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TypeFilter);
