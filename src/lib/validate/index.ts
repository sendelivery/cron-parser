const VALID_CHARACTERS = /^(\d|[*/\-,])*$/;

/**
 * Takes a string array of the passed in arguments and returns a cron string if first argument is a
 * valid cron expression.
 * @param args
 * @throws an Error if the input is invalid in some way.
 * @returns a valid cron expression as a string
 */
export default function validateArgs(args: string[]): string {
  if (args.length < 1) {
    throw new Error(`cron not provided`);
  }

  if (args.length > 1) {
    throw new Error("too many arguments provided");
  }

  const cronFields = args[0].split(" ");

  if (cronFields.length < 5) {
    throw new Error(`not enough cron fields, received ${cronFields.length}, expected 6 or more`);
  }

  if (cronFields.length === 5) {
    throw new Error("no command given");
  }

  // Check for any invalid fields
  cronFields.slice(0, 5).forEach((field) => {
    if (VALID_CHARACTERS.test(field) === false) {
      throw new Error(`malformed cron expression - invalid field "${field}"`);
    }
  });

  return args[0];
}
