import { describe, expect, it } from "@jest/globals";
import parseCronExpression, { expandExpression, MaxValues } from ".";

describe("cron expression module", () => {
  describe("parseCronExpression", () => {
    it("should parse a valid cron expression", () => {
      // GIVEN
      const input = "*/15 0 1,15 * 1-5 /usr/bin/find";

      // WHEN
      const cron = parseCronExpression(input);

      // THEN
      expect(cron).toStrictEqual({
        minute: ["0", "15", "30", "45"],
        hour: ["0"],
        dayOfMonth: ["0", "14"],
        month: ["*"],
        dayOfWeek: ["1", "2", "3", "4", "5"],
        command: ["/usr/bin/find"],
      });
    });

    it("should parse a valid cron expression when command has flags and arguments", () => {
      // GIVEN
      const input = "*/15 0 1,15 * 1-5 /usr/bin/find -flagA -flagB arg1 arg2";

      // WHEN
      const cron = parseCronExpression(input);

      // THEN
      expect(cron).toStrictEqual({
        minute: ["0", "15", "30", "45"],
        hour: ["0"],
        dayOfMonth: ["0", "14"],
        month: ["*"],
        dayOfWeek: ["1", "2", "3", "4", "5"],
        command: ["/usr/bin/find", "-flagA", "-flagB", "arg1", "arg2"],
      });
    });

    it("throws an error if cron expression is too short", () => {
      // GIVEN
      const input = "* * * <command>";

      // WHEN & THEN
      expect(() => parseCronExpression(input)).toThrow("Invalid cron expression");
    });
  });

  describe("expand minutes expression", () => {
    it.each([
      ["0", ["0"]],
      ["20", ["20"]],
      ["59", ["59"]],
      ["*", ["*"]],
      ["*/15", ["0", "15", "30", "45"]],
      ["5/15", ["5", "20", "35", "50"]],
      ["5-10", ["5", "6", "7", "8", "9", "10"]],
      ["5,10,15", ["5", "10", "15"]],
    ])("should correctly expand valid input - %s", (input, expected) => {
      // WHEN
      const result = expandExpression(input, MaxValues.MINUTES);

      // THEN
      expect(result).toStrictEqual(expected);
    });

    it("should best effort parse malformed input", () => {
      // GIVEN
      const input = "111";

      // WHEN
      const result = expandExpression(input, MaxValues.MINUTES);

      // THEN
      expect(result).toStrictEqual(["11"]);
    });

    it.each(["15/*", "asdf", "a", "/-,*"])(
      "should throw an error for erroneous input - %s",
      (input) => {
        // WHEN & THEN
        expect(() => expandExpression(input, MaxValues.MINUTES)).toThrow("Malformed term");
      },
    );

    it("should throw an error if term exceeds max minutes", () => {
      // GIVEN
      const input = "66";

      // WHEN & THEN
      expect(() => expandExpression(input, MaxValues.MINUTES)).toThrow("outside of valid range");
    });
  });

  describe("expand hours expression", () => {
    it.each([
      ["0", ["0"]],
      ["12", ["12"]],
      ["23", ["23"]],
      ["*", ["*"]],
      ["*/15", ["0", "15"]],
      ["5/15", ["5", "20"]],
      ["5-10", ["5", "6", "7", "8", "9", "10"]],
      ["5,10,15", ["5", "10", "15"]],
    ])("should correctly expand valid input - %s", (input, expected) => {
      // WHEN
      const result = expandExpression(input, MaxValues.HOURS);

      // THEN
      expect(result).toStrictEqual(expected);
    });

    it("should best effort parse malformed input", () => {
      // GIVEN
      const input = "111";

      // WHEN
      const result = expandExpression(input, MaxValues.HOURS);

      // THEN
      expect(result).toStrictEqual(["11"]);
    });

    it.each(["15/*", "asdf", "a", "/-,*"])(
      "should throw an error for erroneous input - %s",
      (input) => {
        // WHEN & THEN
        expect(() => expandExpression(input, MaxValues.HOURS)).toThrow("Malformed term");
      },
    );

    it("should throw an error if term exceeds max hours", () => {
      // GIVEN
      const input = "66";

      // WHEN & THEN
      expect(() => expandExpression(input, MaxValues.HOURS)).toThrow("outside of valid range");
    });
  });

  describe("expand day of the month expression", () => {
    it.each([
      ["1", ["0"]],
      ["15", ["14"]],
      ["31", ["30"]],
      ["*", ["*"]],
      ["*/15", ["0", "15", "30"]],
      ["5/3", ["4", "7", "10", "13", "16", "19", "22", "25", "28"]],
      ["5-10", ["4", "5", "6", "7", "8", "9"]],
      ["5,10,15", ["4", "9", "14"]],
    ])("should correctly expand valid input - %s", (input, expected) => {
      // WHEN
      const result = expandExpression(input, MaxValues.DAY_OF_MONTH, -1);

      // THEN
      expect(result).toStrictEqual(expected);
    });

    it("should best effort parse malformed input", () => {
      // GIVEN
      const input = "111";

      // WHEN
      const result = expandExpression(input, MaxValues.DAY_OF_MONTH, -1);

      // THEN
      expect(result).toStrictEqual(["10"]);
    });

    it.each(["15/*", "asdf", "a", "/-,*"])(
      "should throw an error for erroneous input - %s",
      (input) => {
        // WHEN & THEN
        expect(() => expandExpression(input, MaxValues.DAY_OF_MONTH, -1)).toThrow("Malformed term");
      },
    );

    it("should throw an error if term exceeds max day of month", () => {
      // GIVEN
      const input = "32";

      // WHEN & THEN
      expect(() => expandExpression(input, MaxValues.DAY_OF_MONTH, -1)).toThrow(
        "outside of valid range",
      );
    });
  });

  describe("expand months expression", () => {
    it.each([
      ["1", ["0"]],
      ["6", ["5"]],
      ["11", ["10"]],
      ["*", ["*"]],
      ["*/3", ["0", "3", "6", "9"]],
      ["3/4", ["2", "6", "10"]],
      ["5-10", ["4", "5", "6", "7", "8", "9"]],
      ["2,4,6,8", ["1", "3", "5", "7"]],
    ])("should correctly expand valid input - %s", (input, expected) => {
      // WHEN
      const result = expandExpression(input, MaxValues.MONTHS, -1);

      // THEN
      expect(result).toStrictEqual(expected);
    });

    it("should best effort parse malformed input", () => {
      // GIVEN
      const input = "111";

      // WHEN
      const result = expandExpression(input, MaxValues.MONTHS, -1);

      // THEN
      expect(result).toStrictEqual(["10"]);
    });

    it.each(["15/*", "asdf", "a", "/-,*"])(
      "should throw an error for erroneous input - %s",
      (input) => {
        // WHEN & THEN
        expect(() => expandExpression(input, MaxValues.MONTHS, -1)).toThrow("Malformed term");
      },
    );

    it("should throw an error if term exceeds max months", () => {
      // GIVEN
      const input = "66";

      // WHEN & THEN
      expect(() => expandExpression(input, MaxValues.MONTHS, -1)).toThrow("outside of valid range");
    });
  });

  describe("expand day of the week expression", () => {
    it.each([
      ["0", ["0"]],
      ["3", ["3"]],
      ["5", ["5"]],
      ["*", ["*"]],
      ["*/2", ["0", "2", "4", "6"]],
      ["1/3", ["1", "4"]],
      ["2-4", ["2", "3", "4"]],
      ["1,3,5", ["1", "3", "5"]],
    ])("should correctly expand valid input - %s", (input, expected) => {
      // WHEN
      const result = expandExpression(input, MaxValues.DAY_OF_WEEK);

      // THEN
      expect(result).toStrictEqual(expected);
    });

    it("should best effort parse malformed input", () => {
      // GIVEN
      const input = "55";

      // WHEN
      const result = expandExpression(input, MaxValues.DAY_OF_WEEK);

      // THEN
      expect(result).toStrictEqual(["5"]);
    });

    it.each(["15/*", "asdf", "a", "/-,*"])(
      "should throw an error for erroneous input - %s",
      (input) => {
        // WHEN & THEN
        expect(() => expandExpression(input, MaxValues.DAY_OF_WEEK)).toThrow("Malformed term");
      },
    );

    it("should throw an error if term exceeds max day of week", () => {
      // GIVEN
      const input = "777";

      // WHEN & THEN
      expect(() => expandExpression(input, MaxValues.DAY_OF_WEEK)).toThrow(
        "outside of valid range",
      );
    });
  });
});
