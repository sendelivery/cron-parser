# cron-parser

## Prerequisites

Make sure you have [Node](https://nodejs.org/en) v20 LTS installed. This project contains a `.nvmrc` file, if using [nvm](https://github.com/nvm-sh/nvm), simply run the following in the project root:

```
$ nvm use
```

## Usage

In the project root:

1. Install dependencies:

```
$ npm i
```

2. Build the project:

```
$ npm run build
```

3. Run the script, passing in the cron as a single argument wrapped in quotes:

```
$ node build/index.js "*/15 0 1,15 * 1-5 /usr/bin/find"
>
> minute        0 15 30 45
> hour          0
> day of month  1 15
> month         1 2 3 4 5 6 7 8 9 10 11 12
> day of week   1 2 3 4 5
> command       /usr/bin/find
>
```

## Development

During development, please keep the codebase formatted and without linting errors using the configured prettier / eslint rules before pushing any commits.

NPM scripts have been configured to help:

1. `npm run format` - to format all files.
2. `npm run lint` - to report on any linting errors.
3. `npm run build` - which runs `format`, then `lint`, and finally builds the project to a `build` directory.

### Tests

Unit tests have been written using [Jest](https://jestjs.io/) and can be run with:

```
$ npm t
```
