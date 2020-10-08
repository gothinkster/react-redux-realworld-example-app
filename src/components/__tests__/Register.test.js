import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from "react-redux";
import { store, history } from "../../store";
import Register from "../Register";

describe("<Register />", () => {
  test("should render", () => {
    const { container } = render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Register />
        </ConnectedRouter>
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
