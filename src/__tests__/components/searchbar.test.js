import React from "react";
import { shallow } from "enzyme";
import SearchBar from "../../components/Home/searchBar";

describe("renders SearchBar component", () => {
  let store = {
    getState: () => {}
  };
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<SearchBar store={store} />);
  });

  it("renders the text input", () => {
    expect(wrapper.find("input").exists()).toBe(true);
  });
});
