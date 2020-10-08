import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from "react-redux";
import { store, history } from "../../store";
import Register from "../Register";

describe("<Register />", () => {
  describe("Given that I'm in the Sign up page", () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Register />
          </ConnectedRouter>
        </Provider>
      );
    });

    describe("when I have inserted a valid username", () => {
      beforeEach(() => {
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test08102020' } });
      });

      describe("and clicking sign up", () => {
        beforeEach(() => {
          fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
        });

        test("then the email can't be blank error is shown", async () => {
          await waitFor(() => expect(screen.getByText("email can't be blank")).toBeInTheDocument());
        });

        test("then the password can't be blank error is shown", async () => {
          await waitFor(() => expect(screen.getByText("password can't be blank")).toBeInTheDocument());
        });
      });

      describe("and I have inserted an invalid email", () => {
        beforeEach(() => {
          fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@test' } });
        });

        describe("and clicking sign up", () => {
          beforeEach(() => {
            fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
          });
  
          test("then the email is invalid error is shown", async () => {
            await waitFor(() => expect(screen.getByText("email is invalid")).toBeInTheDocument());
          });
  
          test("then the password can't be blank error is shown", async () => {
            await waitFor(() => expect(screen.getByText("password can't be blank")).toBeInTheDocument());
          });
        });
      });
      
      describe("and I have inserted a valid email", () => {
        beforeEach(() => {
          fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'testbruno2@test.com' } });
        });

        describe("and clicking sign up", () => {
          beforeEach(() => {
            fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
          });

          test("then the password can't be blank error is shown", async () => {
            await waitFor(() => expect(screen.getByText("password can't be blank")).toBeInTheDocument());
          });
        });

        describe("and I have inserted a short password", () => {
          beforeEach(() => {
            fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123456' } });
          });

          describe("and clicking sign up", () => {
            beforeEach(() => {
              fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
            });
  
            test("then the password is too short error is shown", async () => {
              await waitFor(() => expect(screen.getByText("password is too short (minimum is 8 characters)")).toBeInTheDocument());
            });
          });
        });

        describe("and I have inserted a good password", () => {
          beforeEach(() => {
            fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123456789' } });
          });

          describe("and clicking sign up", () => {
            beforeEach(() => {
              fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
            });
  
            test("then I should be redirected to the main page", async () => {
              // check if redirected
            });
          });
        });
      });
    });
  });
});
