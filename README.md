# Midnight Rubix Cube: URL Shortener

A lightweight, robust URL shortening service built with Node.js, Express, TypeScript, and MongoDB.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Current Status](#current-status)
- [Future Scope](#future-scope)

## Features

- **Shorten URLs**: Converts long URLs into small, shareable base64url-encoded shortcodes.
- **Redirection**: Seamlessly redirects users from a shortcode to the original destination.
- **Analytics**: Basic endpoint to retrieve click statistics for a specific shortcode.
- **Linting & Formatting**: Clean code enforced automatically with ESLint and Prettier.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (v5.4)
- **Database**: MongoDB with Mongoose ORM
- **Tooling**: ESLint, Prettier

## Current Status
*The project is currently in the active development phase. The foundation is complete.*

- Basic routing and controllers (`createUrl`, `redirectUrl`, `getStats`) are scaffolded.
- Database integration with Mongoose and model definitions are implemented.
- Strict static code analysis and auto-formatting are set up with ESLint (Flat Config) and Prettier.

## Future Scope
We are working on expanding the capabilities and robustness of the application. Next up on the roadmap:

### 1. Advanced Analytics & Tracking

- Store granular access metadata such as timestamps, IP addresses (hashed), and referrers for detailed analytics tracking.

### 2. General Hardening
- **Global Error Handling**: Implement robust global error-handling middlewares to catch asynchronous issues effectively without application crashes.
- **Advanced Validation**: Go beyond the built-in `URL` constructor to mandate secure schemas (e.g., `http://` or `https://`).

### 3. CI/CD & Testing
- Establish an automated testing pipeline using Jest/Supertest for API endpoints.
- Configure CI checks to enforce type-checking and linting automatically.
