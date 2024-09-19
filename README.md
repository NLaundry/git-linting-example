# Code Formatting with Prettier | How to format your code with: your editor, git hooks, github actions

```js
function bad_promise() {
  Promise.reject("something bad happened");
  Promise.reject(5);
  Promise.reject();

  new Promise(function (resolve, reject) {
    reject("something bad happened");
  });

  new Promise(function (resolve, reject) {
    reject();
  });
}
```

- Your project partner submits code that looks like this ... what do you do next?
  - A: Cry
  - B: Yell at your partner
  - C: Format it yourself one line at a time
  - D: Our project has autoformatting setup ... idk what you're talking about

---

## Why should we autoformat code?

- Problem #1:
  - Somebody on your team keeps submitting ugly code like above
- Problem #2:
  - Two members of the team are committed to good formatting, but disagree on what good formatting is
- Problem #3:
  - You agree on a standard, but now you have to overcome habits and spend time formatting

Autoformatting deals with all these issues. It delegates that responsibility so we don't have to have these arguments, remember this project's standards, or waste time thinking about this.

## When can we format code?

- During development: Editor and CLI
- Pre Commit: git hooks
- After Pushing/Merging: Github Actions

## Formatting During Development | Setting up your Editor

The example repository is just a create-react-app with some ugly code at the top of app.js
`npx create-react-app my-app`

### Prettier from the CLI

https://prettier.io/docs/en/install

- npm install --save-dev --save-exact prettier
- node --eval "fs.writeFileSync('.prettierrc','{}\n')"
- node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"

- npx prettier . --check
- npx prettier . --write

### Prettier from VSCode

VSCode's slogan should be "There's an Extension for that!"

In the VSCode extensions "market", we're going to grab the prettier extension

To use it:

- open the command palette: ctrl shift p
- format document (sometimes force) - ctrl shift I

It's that easy :D

## Linting vs. Formatting

Formatting - autoformatting code to a set style

- Prettier

Linting - points out code quality issues to help you follow best practices

- ESLint

EXAMPLE: https://eslint.org/docs/latest/rules/prefer-promise-reject-errors

### Why Lint your code

- Best practices aren't arbitrary
- Like the prefer-promise-reject-errors linter code,
  fixing these code quality issues makes your code easier
  to extend and debug
- Helps you become a better programmer

### ESLint Setup

https://eslint.org/docs/latest/use/getting-started

SETUP: `npm init @eslint/config@latest`
To Lint from the CLI: `npx eslint src/App.js`
Gives you a table of linter errors in the terminal

#### Linting from the editor

Grab the extension from VSCode's extension marketplace

- open the command palette (ctrl-shift-p)
- "revalidate all open files" - probably not necessary but it triggers another check. This, as far as I know, runs periodically anyway
- in the bottom pane, we can see all the same linting errors we got on the terminal. Huzzah!

#### Adding useful rules to the config file

```mjs
// eslint.config.mjs

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      "prefer-promise-reject-errors": "error",
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
```

### Making ESLint and Prettier Play Nice

- prettier-eslint: makes these play nice. So ESLint doesn't look for formatting stuff. We want prettier to handle that

## Formatting Pre-Commit | Git Hooks

Now, let's say I forgot to format my code before commiting my code. BTW this can be avoided by formatting on save, but some people don't like to do that ... Idk why.

Git hooks to the rescue

### Prettier-ESLint for compatibility

https://github.com/prettier/prettier-eslint
npm install --save-dev prettier-eslint

## Git pre-commit hooks

https://prettier.io/docs/en/precommit

There are a bunch of easier ways to do this, but I want to start with the classic git approach

In you project directory, there's a hidden file (find with ls -a) called ".git"
This file contains all sorts of data about the git repository. It's cool. Take a look.
BTW if you remove this file, you'll notice that the directory is no longer recognized as a git repo.

```sh
#!/bin/sh
# This shebang line tells the system to use the /bin/sh shell to execute this script.

# Get a list of files that have been staged (added to the index) and are either
# Added (A), Copied (C), Modified (M), or Renamed (R).
# Replace spaces in filenames with a backslash followed by a space to handle filenames with spaces.
FILES=$(git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g')

# Check if the FILES variable is empty (i.e., no staged files to process).
# If it's empty, exit the script with a status code of 0, indicating success.
[ -z "$FILES" ] && exit 0

# Prettify all selected files using Prettier.
# Pass the list of files to Prettier, ignoring unknown file extensions and writing changes in place.
echo "$FILES" | xargs ./node_modules/.bin/prettier --ignore-unknown --write

# Add back the modified/prettified files to the staging area.
# This ensures that the prettified versions of the files are included in the commit.
echo "$FILES" | xargs git add

# Exit the script with a status code of 0, indicating successful execution.
exit 0
```

now if I run a commit

```sh
👽 👉 git-linting-example (US! main) git commit -m "Added some broken promises :("
hint: The '.git/hooks/pre-commit' hook was ignored because it's not set as executable.
hint: You can disable this warning with `git config advice.ignoredHook false`.
[main 114e73b] Added some broken promises :(
```

### Make your scripts executable

Remember you need to make your shell scripts executables.
On a Unix-like system, files need to have permissions set.
We can easily set this file to executable with:
`chmod u+x pre-commit`

Now we can re-commit this stuff, and it'll autoformat all files staged for that commit.

NOTES:

- your .git folder isn't shared on github so people won't automatically get your git hooks
- if you want everyone on your team to have these githooks, you have to share them manually
- I recommend you have a shared githooks template shared somewhere for the team to use.

## Github Actions

Many of the baseline ones are sourced from here
https://github.com/actions

But you can source github actions from any repository that follows the correct directory structure

SETUP: https://docs.github.com/en/actions/writing-workflows/quickstart
LintAction: https://github.com/marketplace/actions/lint-action
https://mskelton.dev/blog/auto-formatting-code-using-prettier-and-github-actions

in your github repo, create a .github directory. In there create a "workflows" folder.
then, lob some actions in that sucker.

#RUN the example github action. Go to site. Under actions, we have the output.

Things don't run immediately.
Remember you're basically provisioning a VM to then throw a container together
install some stuff (probably)
run some stuff actions
and report back to you
that's a lot of work to do

```yaml
name: Lint

on:
  # Trigger the workflow on push or pull request,
  # but only for the main branch
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  run-linters:
    name: Run linters
    runs-on: ubuntu-latest

    steps:
      - name: Check out Git repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      # ESLint and Prettier must be in `package.json`
      - name: Install Node.js dependencies
        run: npm ci

      - name: Run linters
        uses: wearerequired/lint-action@v2
        with:
          eslint: true
          prettier: true
```

## Resources

https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
https://stackoverflow.com/collectives/articles/71270196/how-to-use-pre-commit-to-automatically-correct-commits-and-merge-requests-with-g
https://www.slingacademy.com/article/git-pre-commit-hook-a-practical-guide-with-examples/
