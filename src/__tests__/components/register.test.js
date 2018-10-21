import React from "react";
import { shallow } from "enzyme";
import Register from "../../components/Register";

describe("Renders Register component", () => {
  let wrapper = shallow(<Register />);

  it("renders the form", () => {
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

  describe("when the full name is not completely filled out", () => {
    beforeEach(() => {
      const mockEvent = {
        target: {
          value: "Joe"
        }
      };
      wrapper.instance().updateNameField(mockEvent);
    });

    it("triggers an error on fullName", () => {
      expect(wrapper.find("span.error")).toHaveLength(1);
    });

    it("Submit button is disabled", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(true);
    });
  });

  describe("when the full name is filled out", () => {
    beforeEach(() => {
      const mockEvent = {
        target: {
          value: "Joe Shmo"
        }
      };
      wrapper.instance().updateNameField(mockEvent);
    });

    it("does not triggers an error on fullName", () => {
      expect(wrapper.find("span.error")).toHaveLength(0);
    });

    it("disables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(true);
    });
  });

  describe("when the email is not completely filled out", () => {
    beforeEach(() => {
      const mockEvent = {
        target: {
          name: "email",
          value: "joe.schmo"
        }
      };
      wrapper.instance().updateField(mockEvent);
    });

    it("triggers an error on email", () => {
      expect(wrapper.find("span.error")).toHaveLength(1);
    });

    it("disables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(true);
    });
  });

  describe("when the email is completely filled out", () => {
    beforeEach(() => {
      const mockEvent = {
        target: {
          name: "email",
          value: "joe.schmo@ruralsourcing.com"
        }
      };
      wrapper.instance().updateField(mockEvent);
    });

    it("does not trigger an error on email", () => {
      expect(wrapper.find("span.error")).toHaveLength(0);
    });

    it("disables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(true);
    });
  });

  describe("when the username is not completely filled out", () => {
    beforeEach(() => {
      const mockEvent = {
        target: {
          name: "username",
          value: "joe"
        }
      };
      wrapper.instance().updateField(mockEvent);
    });

    it("triggers an error on username", () => {
      expect(wrapper.find("span.error")).toHaveLength(1);
    });

    it("disables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(true);
    });
  });

  describe("when the username is completely filled out", () => {
    beforeEach(() => {
      const mockEvent = {
        target: {
          name: "username",
          value: "joeschmo"
        }
      };
      wrapper.instance().updateField(mockEvent);
    });

    it("does not trigger an error on username", () => {
      expect(wrapper.find("span.error")).toHaveLength(0);
    });

    it("disables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(true);
    });
  });

  describe("when the password is not completely filled out", () => {
    beforeEach(() => {
      const mockEvent = {
        target: {
          name: "password",
          value: "joe"
        }
      };
      wrapper.instance().updateField(mockEvent);
    });

    it("triggers an error on username", () => {
      expect(wrapper.find("span.error")).toHaveLength(1);
    });

    it("disables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(true);
    });
  });

  describe("when the password is completely filled out", () => {
    beforeEach(() => {
      const mockEvent = {
        target: {
          name: "password",
          value: "weakPass1!"
        }
      };
      wrapper.instance().updateField(mockEvent);
    });

    it("does not trigger an error on password", () => {
      expect(wrapper.find("span.error")).toHaveLength(0);
    });

    it("enables the Submit button", () => {
      expect(wrapper.find("button").get(0).props.disabled).toBe(false);
    });
  });
});
