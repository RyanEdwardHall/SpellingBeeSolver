# beewordle

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Roadmap
- report progress to console with level and score
- report if all words found was hit
- report % of guesses that were erroneous
- full automation. game runs on a lambda, reports outcomes on twitter?
- rewrite dictionary filters to share file IO and let functions handle filter logic
