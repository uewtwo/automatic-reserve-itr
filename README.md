# reserve-sushi-isshin
A script to reserve a restaurant of Sushi-Isshin 3 months later.

To install dependencies:

```bash
bun install
```

Set up:
1. Get an API key from [2Captcha](https://2captcha.com/?from=23740056). *Paid Service*
1. Create a `.env` file based on `.env.example`.

To run:

```bash
bun run src/index.ts {oukarou|sushi}
```

To build:
```
bun build --compile --target=bun ./src/index.ts --outfile ./dist/main
```

Note:
- 'alfaro' and 'kotoritei' are not supported yet. (But it's almost no problem since you can reserve it manually.)
- build does not work 😥😥😥😥😥😥😥😥 (MB related [PR](https://github.com/oven-sh/bun/issues/11754))