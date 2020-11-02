import { isSuccess } from "../../utils/utils";

test("should return true if is success header and false otherwise", () => {
  // a list of status codes and the expected return value of isSuccess()
  const codes = [
    [200, true],
    [204, true],
    [301, false],
    [401, false],
    [500, false],
    [999, false],
    [20, false],
    [2000, false],
  ];

  for (const code of codes) {
    expect(isSuccess(code[0])).toBe(code[1]);
  }
});
