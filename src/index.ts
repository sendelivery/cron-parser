import validateArgs from "./lib/validate";
import parseCronExpression from "./lib/expression";
import generateCronTable from "./lib/table";

export default function main(args: string[]): string | undefined {
  const cronString = validateArgs(args);
  const cronExpression = parseCronExpression(cronString);
  const table = generateCronTable(cronExpression);

  return table;
}

// If being run as a script
if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    console.log(main(args));
    process.exit(0);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
