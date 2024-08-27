import { describe, it, expect } from "@jest/globals";
import generateCronTable, { formatValue } from ".";
import { MaxValues, type CronExpression } from "../expression";

describe("table module", () => {
  describe("generateCronTable", () => {
    it("should return a correctly formatted table", () => {
      // GIVEN
      // "*/15 0 1,15 * 1-5"
      // every 15 minutes at midnight to 1am on 1st and 15th mon through fri
      const input: CronExpression = {
        minute: ["0", "15", "30", "45"],
        hour: ["0"],
        dayOfMonth: ["0", "14"],
        month: ["*"],
        dayOfWeek: ["1", "2", "3", "4", "5"],
        command: ["<command>"],
      };

      // WHEN
      const result = generateCronTable(input);

      // THEN
      expect(result).toBe(`
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       <command>
`);
    });

    it("should return a correctly formatted table when command includes arguments", () => {
      // GIVEN
      // 30 minutes past the hour
      const input: CronExpression = {
        minute: ["30"],
        hour: ["*"],
        dayOfMonth: ["*"],
        month: ["*"],
        dayOfWeek: ["*"],
        command: ["<command>", "arg1", "arg2", "arg3"],
      };

      // WHEN
      const result = generateCronTable(input);

      // THEN
      expect(result).toBe(`
minute        30
hour          0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
day of month  1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   0 1 2 3 4 5 6
command       <command> arg1 arg2 arg3
`);
    });
  });

  describe("formatValue", () => {
    it("should correctly format asterisk values", () => {
      // WHEN
      const result = formatValue(["*"], MaxValues.MONTHS);

      // THEN
      expect(result).toBe("0 1 2 3 4 5 6 7 8 9 10 11");
    });

    it("should correctly format asterisk values and increment", () => {
      // WHEN
      const result = formatValue(["*"], MaxValues.MONTHS, true);

      // THEN
      expect(result).toBe("1 2 3 4 5 6 7 8 9 10 11 12");
    });

    it("should correctly format non-asterisk values", () => {
      // WHEN
      const result = formatValue(["0", "15", "30", "45"], MaxValues.MINUTES);

      // THEN
      expect(result).toBe("0 15 30 45");
    });

    it("should correctly format non-asterisk values and increment", () => {
      // WHEN
      const result = formatValue(["0", "15", "30", "45"], MaxValues.MINUTES, true);

      // THEN
      expect(result).toBe("1 16 31 46");
    });
  });
});
