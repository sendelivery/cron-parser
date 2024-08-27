import { describe, expect, it } from "@jest/globals";
import validateArgs from ".";

describe("validate module", () => {
  describe("validateArgs", () => {
    it("returns a cron string for valid input", () => {
      // GIVEN
      const input = ["*/15 0 1,15 * 1-5 /usr/bin/find"];

      // WHEN
      const cronString = validateArgs(input);

      // THEN
      expect(cronString).toBe("*/15 0 1,15 * 1-5 /usr/bin/find");
    });

    it("throws if no args", () => {
      // GIVEN
      const input: string[] = [];

      // WHEN & THEN
      expect(() => validateArgs(input)).toThrow("cron not provided");
    });

    it("throws if too many args", () => {
      // GIVEN
      const input = ["arg0", "arg1"];

      // WHEN & THEN
      expect(() => validateArgs(input)).toThrow("too many arguments provided");
    });

    it("throws if not enough cron fields", () => {
      // GIVEN
      const input = ["* * * <command>"];

      // WHEN & THEN
      expect(() => validateArgs(input)).toThrow("not enough cron fields");
    });

    it("throws if no command is specified", () => {
      // GIVEN
      const input = ["* * * * *"];

      // WHEN & THEN
      expect(() => validateArgs(input)).toThrow("no command given");
    });

    it("throws if cron field contain invalid characters", () => {
      // GIVEN
      const input = ["*/15 0 abc,123 * 1-5 <command>"];

      // WHEN & THEN
      expect(() => validateArgs(input)).toThrow("malformed cron expression");
    });
  });
});
