# TipMate React Native — working notes

## Package manager

- This project uses **yarn** (Yarn 1 / classic, `yarn.lock` is the source of truth).
- Install dependencies with `yarn install`. Never run `npm ci`, `npm install`, or `npm audit fix` here; they would rewrite or conflict with `yarn.lock`.
- Add or remove packages with `yarn add` / `yarn remove`. Use `yarn audit` for security checks.
