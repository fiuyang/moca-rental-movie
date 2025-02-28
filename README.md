# Moca Rental Movie API

Moca Rental Movie API is a modern Point of Sale (POS) system built with NestJS, designed to optimize movie rental operations. This API provides a complete solution for managing movies, users, transactions, and payments, ensuring efficient and organized rental business operations.

## 🚀 Features

### 🎭 Genre Management
- Add, edit, delete, and view movie genres
- Assign multiple genres to a single movie

### 🎬 Movie Management
- Add, edit, delete, and view movie listings
- Link movies to multiple genres

### 👥 User Management
- Add, edit, delete, and view user accounts
- Secure authentication using **JWT (JSON Web Token)**

### 💰 Transaction & Rental Management
- Create new rental transactions
- View and manage rental periods and due dates
- Track transaction history

### ⚠️ Late Fee System
- Automatically apply late fees for overdue rentals

### 💳 Payment Processing
- Secure payments via **Midtrans Payment Gateway**

### 📜 Rental & Transaction History
- Logged-in users can view their past rentals and transactions

## 🚀 Technologies Used

- ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) **NestJS** – A progressive Node.js framework for building efficient and scalable applications.
- ![TypeORM](https://img.shields.io/badge/TypeORM-FF5A5F?style=flat&logo=typeorm&logoColor=white) **TypeORM** – An ORM for seamless interaction with **PostgreSQL** databases.
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) **PostgreSQL** – A powerful relational database for managing data.
- ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white) **Redis** – A fast, in-memory data store for caching and session management.
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) **JWT Authentication** – Secure user authentication and authorization.
- ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black) **Swagger** – API documentation and testing made easy.
- ![Midtrans](https://img.shields.io/badge/Midtrans-0A4FA3?style=flat) **Midtrans** – Secure online payment gateway integration.


## Clone the repository:

```bash
   git clone git@github.com:fiuyang/moca-rental-movie.git
   cd moca-rental-movie
```

## Copy .env file
```bash
   cp .env.example .env
```

## Install dependencies:

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Check Docs Swagger
```bash
$ http://localhost:3000/api/docs/
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).