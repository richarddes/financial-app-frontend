import {
  getCsrfToken,
  invalidateCSRFToken,
  updateCSRFToken,
} from "../../auth/auth";
import * as dependency from "../../utils/utils";

dependency.apiFetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    headers: {
      get: jest.fn(() => "some-csrf-token"),
    },
  })
);

test("should fetch when no csrf token in session storage", async () => {
  getCsrfToken();

  await dependency.apiFetch();

  expect(window.sessionStorage.getItem("csrfToken")).toBe("some-csrf-token");
  // expect 2 calls since the mocking counts as one call already
  expect(dependency.apiFetch.mock.calls.length).toBe(2);
});

test("should reset csrf token in session storage when invalidated", () => {
  window.sessionStorage.setItem("csrfToken", "some-csrf-token");

  invalidateCSRFToken();

  expect(window.sessionStorage.getItem("csrfToken")).toBe("");
});

test("should update csrf token in session storage", () => {
  const values = ["", "   ", null];

  for (const v in values) {
    window.sessionStorage.setItem("csrfToken", v);

    updateCSRFToken("some-csrf-token");

    expect(window.sessionStorage.getItem("csrfToken")).toBe("some-csrf-token");
  }
});
