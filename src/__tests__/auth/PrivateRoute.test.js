import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import PrivateRoute from "../../auth/PrivateRoute";
import { AuthContext } from "../../auth/auth";

function MockComponent() {
  return <div />;
}

test("should go to component when authorized", () => {
  const history = createMemoryHistory();

  render(
    <AuthContext.Provider value={{
      isAuth: true,
    }}>
      <Router history={history}>
        <PrivateRoute path="/auth-route">
          <MockComponent />
        </PrivateRoute>
      </Router>
    </AuthContext.Provider>
  );

  history.push("/auth-route");

  expect(history.location.pathname).toBe("/auth-route");
});

test("shouldn't go to component when unauthenticated", () => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <PrivateRoute path="/auth-route" />
    </Router>
  );

  history.push("/auth-route");

  expect(history.location.pathname).toBe("/login");
});
