export type CronExpression = {
  minute: string[];
  hour: string[];
  dayOfMonth: string[];
  month: string[];
  dayOfWeek: string[];
  command: string[];
};

// CronExpression values are 0 based, so these represent exclusive upper bounds.
export enum MaxValues {
  MINUTES = 60,
  HOURS = 24,
  DAY_OF_MONTH = 31,
  MONTHS = 12,
  DAY_OF_WEEK = 7,
}

const DIGITS_OR_ASTERISK = /^\d{0,2}$|^\*{1}$/;

/**
 * Parses a valid cron expression string into a {@link CronExpression} object.
 * @param cron
 * @throws an Error if the cron string is invalid in some way.
 * @returns a {@link CronExpression} object.
 */
export default function parseCronExpression(cron: string): CronExpression {
  const expressions = cron.split(" ");

  if (expressions.length < 6) {
    throw new Error(`Invalid cron expression ${cron} - missing terms.`);
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = expressions.slice(0, 5);
  const command = expressions.slice(5);

  const shift = -1;

  return {
    minute: expandExpression(minute, MaxValues.MINUTES),
    hour: expandExpression(hour, MaxValues.HOURS),
    dayOfMonth: expandExpression(dayOfMonth, MaxValues.DAY_OF_MONTH, shift),
    month: expandExpression(month, MaxValues.MONTHS, shift),
    dayOfWeek: expandExpression(dayOfWeek, MaxValues.DAY_OF_WEEK),
    command,
  };
}

export function expandExpression(expression: string, max: MaxValues, shift = 0): string[] {
  const result: string[] = [];

  // First, split the expression into separate terms by the comma operator
  // e.g. "*/4,5" -> ["*/4", "5"]
  const terms = expression.split(",");

  terms.forEach((term) => {
    if (term.includes("-")) {
      // Split by dash, discard remaining elements if there are more than 2
      const [lower, upper] = term.split("-");
      const lowerBound = Number(lower) + shift;
      const upperBound = Number(upper) + shift;

      throwIfNaN(term, lowerBound, upperBound);

      for (let i = lowerBound; i <= upperBound; ++i) {
        const m = String(i);
        result.push(m);
      }
      return;
    } else if (term.includes("/")) {
      const [start, interval] = term.split("/");
      const intervalNum = Number(interval);
      let current = 0;

      if (start !== "*") {
        current = Number(start) + shift;
      }

      throwIfNaN(term, current, intervalNum);

      for (; current < max; current += intervalNum) {
        result.push(String(current));
      }
      return;
    } else {
      let value = term.slice(0, 1);

      if (max > 9) {
        value = term.slice(0, 2);
      }

      const valueNum = Number(value) + shift;

      if (DIGITS_OR_ASTERISK.test(value) === false) {
        throw new Error(`Malformed term "${term}"`);
      }

      if (valueNum && valueNum >= max) {
        throw new RangeError(`Term "${term}" outside of valid range: 0 - ${max - 1}`);
      }

      if (isNaN(valueNum) === false) result.push(String(valueNum));
      else result.push(value);
    }
  });

  return result;
}

function throwIfNaN(term: string, ...num: number[]) {
  num.forEach((n) => {
    if (isNaN(n)) {
      throw new Error(`Malformed term "${term}"`);
    }
  });
}
