# pet-adoption-frontend

This is the frontend component of the Pet Adoption project. This project uses [React](https://react.dev/) as a framework and [Next.js](https://nextjs.org/) (using the **pages router**) as a routing and building solution. [Yarn](https://yarnpkg.com/) is used for project and dependency management (in other words, use `yarn add` instead of `npm install` when following any guides online). In addition, [Material UI](https://mui.com/material-ui/) and [Redux](https://react-redux.js.org/) are preconfigured for styling and global state management, respectively. Finally, [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) and included for dev tooling.

This set of tools has been chosen to be a solid, simple foundation for frontend development that mimics what is commonly used in production applications that are developed in the industry. However, as consultants, your team may discover that a different tool or library suits the needs of your specific project better than what we have provided here. If you choose to replace some of the pieces of the project, please just run it by your mentors and the class TAs in your next scrum meeting; just keep in mind that the mentors and class TAs are only guaranteed to be familiar and be able to provide help with this specific set of tools. Using additional tools is always allowed and encouraged!

**For installation and setup instructions, see the root folder's README.**

## Quick Reference

To run the development server:

```bash
yarn dev
```

To run a production version of your application:

```bash
# Build the producation application
yarn build

# Run the production application
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

In development mode, pages that you are viewing will auto-update as you edit the corresponding files in your project.

## Overview of Pre-Configured Tools

### React

React is a JavaScript-based open-source web application framework for the application’s front-end that allows you to create dynamic views for your single-page application. It is a very widely-used platform and is thus many developers; go-to when creating a web application.

React allows you to declare re-usable, composable components that allows you to quickly and easily create interactive webpages written in a way that looks almost like normal HTML.

The React documentation offers a good way to learn the basics that will get you started:

- [React Quick Start Guide](https://react.dev/learn) - introduction to the 80% of React concepts that you will use on a daily basis
- [Tic-Tac-Toe](https://react.dev/learn/tutorial-tic-tac-toe) - learn-by-doing approach to make a quick tic-tac-toe game as a way to learn React
- [Thinking in React](https://react.dev/learn/thinking-in-react) - example of how to transform some data and site designs into actual React components
- ⭐ [**React Tutorial Video**](https://www.youtube.com/watch?v=SqcY0GlETPk) - there are MANY React tutorials out there, and they all use different frameworks and versions. Find one that works for you. The one linked here is one that I (Matthew M) personally recommend because he does a great job explaining the concepts of React, even though we are using Next.js instead of Vite and aren't using Typescript (by default).

### Next.js

Next.js is one of the most popular frameworks for easily setting up and deploying a React project. It offers many different benefits to React developers, such as straightforward routing, support for various rendering approaches (server-side, client-side, static), CSS support, and general optimizations.

The main benefit of using Next.js in the context of this project is its **pages router**, which will allow you to create new pages in your app by creating a separate file per-page and link them automatically without having to write the code to do so yourself. **Important: Next.js offers two routing approaches: the App Router and the Pages Router. This template project uses the pages router as it is generally the simpler of the two and works better for multi-page projects like this one. Make sure that you select the correct version of the documentation (app vs pages router) when looking at the Next.js documentation.**

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure) - helps to describe the different folders and files present in the project
- ⭐ [**Next.js Tutorial**](https://youtu.be/Sklc_fQBmcs?si=4ki2U5RrIa9LM5Ek) - easy to follow, concise Next.js tutorial

### Material UI

Material UI is a React component library which allows you to quickly create apps that follow Google's [Material Design specifications](https://m3.material.io/). It includes both common components, such as buttons, dialogs, and layouts, as well as a styling solution that lets you integrate CSS styles within your Javascript code that are responsive and interactive (different color themes included!).

See the Material UI documentation [here](https://mui.com/material-ui/getting-started/). Do note that Material UI version 6 (which is what this template project uses) is not compatible with code written for version 4, which many guides and tutorials online still use.

### Redux

Redux allows you to manage state that you can access from anywhere in your app (i.e., "global state"). This is useful for things like information about the logged-in user, cookie preferences, configuration settings (light vs. dark color scheme), etc.

This project uses Redux Toolkit, a separate library which makes configuring the Redux stores in a more organized way. Here are some resources you might find useful:

- [Redux Core Concepts](https://redux.js.org/introduction/core-concepts) - brief introduction to how Redux works
- [Redux Learning Resources](https://redux.js.org/introduction/learning-resources) - additional resources to learn about Redux
- [Redux Toolkit Quick Start Guide](https://redux-toolkit.js.org/tutorials/quick-start) - brief tutorial on how to use Redux
- [Redux Toolkit Usage Guide](https://redux-toolkit.js.org/usage/usage-guide) - full guide about the various aspects of Redux toolkit

### ESLint

ESLint is a **linting** tool. Linting is the process of using a tool to automatically check source code for errors and best practices. ESLint (or any linting tool in general) provides the following benefits during development:

- Marks some programming errors, bugs, and potentially dangerous constructs.
- Ensures consistent code style among the team.
- Enforces best practices for the languages/frameworks you are using.

**The most important thing is to not fight the linter.** It is there to help you code better. If you find yourself constantly fighting against the linter, your first action should be trying to fix the problem in your code, not disabling the rule or reconfiguring ESLint.

Here are some resources that are useful for configuring and using ESLint:

- [ESLint Rules Reference](https://eslint.org/docs/latest/rules/) - reference for ESLint config rules if your team wants to modify the included configuration
- [ESLint/Prettier GH Actions CI/CD Workflow](https://t-i-show.medium.com/build-a-ci-cd-environment-with-github-actions-eslint-prettier-ee725c5fe2ab) - rudimentary example of how to make a GH Actions workflow to automatically check ESLint & Prettier rules

### Prettier

Prettier is a **code formatting** tool. Prettier is the de facto standard opinionated JavaScript/TypeScript tool that reformats your code in a consistent way.

**Just like ESLint, you should not fight the formatter.** It is very opinionated and consistent for a reason.

Here are some resources that are useful for configuring and using Prettier:

- [Prettier Config Reference](https://prettier.io/docs/en/options) - reference for Prettier config rules if your team wants to modify the included configuration
- [ESLint/Prettier GH Actions CI/CD Workflow](https://t-i-show.medium.com/build-a-ci-cd-environment-with-github-actions-eslint-prettier-ee725c5fe2ab) - rudimentary example of how to make a GH Actions workflow to automatically check ESLint & Prettier rules

### TypeScript

TypeScript is a superset of JavaScript with static typing. The benefit of TypeScript is that you get the flexibility and ease of use of JavaScript with the compile-time error checking of staticly typed languages. In other words, a "catch bugs before they happen" tool.

TypeScript use is **optional** for this project. It is incredibly beneficial (and, as such, the template project is pre-configured to support it), but it also definitely will cause a steeper learning curve, especially for those of you without any web development experience prior to this class. Adapting third-party code to Typescript can also be challenging. Your team, however, should weigh the pros/cons (taking into account your prior experience) to determine whether it is a tool that you want to use.

As a note, it *is* possible to use Typescript and Javascript together in the same project (this template project is configured as such) if you want to slowly transition to using 100% TS throughout the semester.

Note also that you do not need to do anything to build/transpile any TypeScript you do choose to write. Next.js supports it out of the box and handles all of the configuration/building/transpilation for you.

Here are some resources if you want to learn more about TypeScript and why your team would consider using it:
- ⭐ [**TypeScript for the New Programmer**](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html) - if you aren't familiar with JavaScript, start here
- ⭐ [**TypeScript for JavaScript Programmers**](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) - if you are familiar with JavaScript, start here
- [TypeScript Pros/Cons](https://www.altexsoft.com/blog/typescript-pros-and-cons/) - a decent pros/cons list outlining some of the major points to using it
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - honestly, the best Typescript resource out there is their own documentation, if you take an hour to read through it you should have more than enough to get started