import React from "react";
import { shallow } from "enzyme";
import Register from "../../components/Register";

describe("Renders Register component", () => {
  let wrapper;

  it("renders the form", () => {
    wrapper = shallow(<Register />);
    expect(wrapper.find("form").exists()).toBe(true);
  });

  describe("when no fields are filled out", () => {
    beforeEach(() => {
      wrapper = shallow(<Register />);
    });

    it("does not render any warnings", () => {
      expect(wrapper.find(".error")).toHaveLength(0);
    });

    it("disables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(true);
    });
  });

  describe("when all fields are properly filled out", () => {
    beforeEach(() => {
      wrapper = shallow(<Register />);
      wrapper.setState({
        fields: {
          firstName: "Joe",
          lastName: "Shmo",
          username: "JoeShmo",
          email: "Joe.Shmo@curly.com",
          password: "weakPass1!"
        }
      });
    });

    it("does not render any warnings", () => {
      expect(wrapper.find("span.error")).toHaveLength(0);
    });

    it("enables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(false);
    });
  });

  describe("when the full name is not filled out", () => {
    beforeEach(() => {
      wrapper = shallow(<Register />);
      wrapper.setState({
        fields: {
          firstName: "Joe",
          lastname: "",
          username: "JoeShmo",
          email: "Joe.Shmo@curly.com",
          password: "badPassword"
        }
      });
    });

    it("renders last name warning", () => {
      console.log(wrapper.instance().state.errors);
      expect(wrapper.instance().state.errors.lastName).toBe(true);
    });

    it("disables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(true);
    });
  });
});
