import { MaxValues, type CronExpression } from "../expression";

/**
 * Generates a formatted table detailing the schedule and command to be run as specified by the CronExpression input.
 * @param cron
 * @returns string
 */
export default function generateCronTable(cron: CronExpression): string {
  const increment = true;

  return `
minute        ${formatValue(cron.minute, MaxValues.MINUTES)}
hour          ${formatValue(cron.hour, MaxValues.HOURS)}
day of month  ${formatValue(cron.dayOfMonth, MaxValues.DAY_OF_MONTH, increment)}
month         ${formatValue(cron.month, MaxValues.MONTHS, increment)}
day of week   ${formatValue(cron.dayOfWeek, MaxValues.DAY_OF_WEEK)}
command       ${cron.command.join(" ")}
`;
}

export function formatValue(values: string[], max: MaxValues, increment?: boolean) {
  if (values.length === 1 && values[0] === "*") {
    const result: string[] = [];
    for (let i = 0; i < max; ++i) {
      if (increment) {
        result.push(String(i + 1));
      } else {
        result.push(String(i));
      }
    }
    return result.join(" ");
  }

  if (increment) {
    return values
      .map((v) => {
        const num = Number(v) + 1;
        return String(num);
      })
      .join(" ");
  }

  return values.join(" ");
}
