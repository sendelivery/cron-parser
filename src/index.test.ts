import { describe, it, expect } from "@jest/globals";
import main from ".";

describe("cron-parser script", () => {
  it("should return a correctly formatted table when given a valid input", () => {
    // GIVEN
    const input = ["*/15 0 1,15 * 1-5 /usr/bin/find"];

    // WHEN
    const result = main(input);

    // THEN
    expect(result).toBe(`
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
`);
  });
});
