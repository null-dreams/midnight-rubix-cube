# Midnight Rubix Cube: URL Shortener

A full-stack, robust URL shortening service. It features a modern, responsive frontend built with Next.js and Tailwind CSS, backed by a Node.js, Express, and MongoDB API.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Current Status](#current-status)
- [Future Scope](#future-scope)

## Features

- **Shorten URLs**: Converts long URLs into small, shareable base64url-encoded shortcodes.
- **QR Code Generation**: Instantly generates downloadable QR codes for any shortened link.
- **Redirection**: Seamlessly redirects users from a shortcode to the original destination.
- **Analytics**: Endpoints to retrieve click statistics for specific shortcodes.
- **Modern UI**: A premium, responsive interface engineered with Next.js and Tailwind CSS.
- **Seamless API Integration**: Frontend proxy rewrites to communicate fluidly with the backend API.

## Tech Stack

> **Note**: The modern frontend UI, design aesthetic, and seamless integration into this project were primarily developed using an AI agentic workflow.

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS (v4)
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Language**: TypeScript
- **Tooling**: ESLint, Prettier, tsx

## Project Structure

The repository is organized into two main directories:
- `/frontend`: Contains the Next.js UI application.
- `/backend`: Contains the Node.js/Express API server, database models, and entry points.

## Current Status

*The project's MVP features and user-facing frontend are currently implemented.*

- **Backend Architecture**: Fully organized into a dedicated `backend` directory. Core endpoints (routing, URL creation, and QR code generation) are deployed.
- **Frontend Application**: Built and fully connected to the backend API. Features highly polished aesthetics and interactive real-time data flow.
- **Code Quality**: Strict static code analysis and auto-formatting are active across the project using ESLint and Prettier.

## Future Scope

Development is ongoing to expand system capabilities. Next major roadmap items include:

### 1. Authentication & User Accounts
- **User Management**: Support for user creation and authentication to enable link management and referral tracking.
- **Private Dashboards**: Build private analytics dashboard sections specifically for authenticated users to manage their URLs.

### 2. Advanced Analytics & Tracking
- **Granular Data**: Store detailed access metadata (timestamps, hashed IP addresses, and HTTP referrers) to provide better tracking analytics.

### 3. Hardening & Deployment
- **Global Error Handling**: Add robust global error middlewares to gracefully catch and handle asynchronous issues.
- **Containerization**: Prepare `Dockerfile` and `docker-compose.yml` configurations for deployment and easy provisioning.
- **Automated Testing**: Establish an automated testing pipeline using Jest/Supertest with CI pipelines via GitHub Actions.
