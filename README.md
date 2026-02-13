<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Expense Tracker

## Overview

Expense Tracker API is a simple REST API built using **NestJS (TypeScript)** with an SQL database and JWT-based authentication.

The application allows users to:

- Register and login using JWT
- Manage Accounts (CRUD)
- Manage Expenses (CRUD)
- View financial statistics
- Access protected endpoints using authentication tokens

ERD is provided through drawsql.app:
`https://drawsql.app/teams/noobie-isc-tech-dev/diagrams/expense-tracker`

E2E testing is also implemented to verify JWT authentication and protected API behavior.

## API Documentation

API documentation is provided through Postman Collection:
`https://documenter.getpostman.com/view/30807981/2sBXcBmMRN`

## Why Use Modular Controller–Service–Repository Pattern?

This project uses a **Modular Architecture with Controller–Service–Repository pattern**, which is a structure I frequently use when building backend applications.

### Reasons for using this pattern:

1. **Separation of Concerns**
   - Controller → handles HTTP layer
   - Service → contains business logic
   - Repository → handles database access

2. **Scalable & Maintainable**
   Each domain (Auth, Accounts, Expenses) is isolated, making the application easier to extend and maintain.

3. **Production-oriented Structure**
   This pattern is commonly used in real-world backend projects because it keeps code clean, structured, and maintainable.

Because I frequently use this approach, it helps me keep project organization consistent and speeds up development while maintaining code clarity.
