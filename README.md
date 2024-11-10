# Ecommerce API

This project is a backend API for an eCommerce platform, built with Node.js, TypeScript, and Express.js. The API provides functionalities for managing products, categories, user accounts, orders, and payments.

## Table of Contents

- [Ecommerce API](#ecommerce-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Scripts](#scripts)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- User authentication with JWT and role-based access control.
- Product and category management.
- Cart and order management.
- Payment processing.
- License generation for digital products.

## Technologies

- **Node.js** with **TypeScript**
- **Express.js** - Web framework for API routes
- **Prisma** - Database ORM for efficient data modeling and management
- **Zod** - Schema validation for request and response validation
- **Jest** - Unit and integration testing

## Requirements

- Node.js v16+ and npm
<!-- - Docker (for containerization) -->
- Prisma CLI for database migrations

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Xpronoob/Ecommerce-API.git
   cd Ecommerce-API
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and configure database and JWT settings.

4. **Database Setup:**

   - Use Prisma to push the latest schema to the database.

   ```bash
   npm run prisma:push
   ```

5. **Build the project:**

   ```bash
   npm run build
   ```

6. **Run the project:**
   ```bash
   npm start
   ```

## Usage

- **Development Mode:**
  ```bash
  npm run dev
  ```
- **Testing:**
  ```bash
  npm run test
  ```

## Scripts

- **`npm run dev`** - Run in development mode
- **`npm run build`** - Compile TypeScript to JavaScript
- **`npm start`** - Start the server
- **`npm run prisma:pull`** - Sync schema with the database
- **`npm run prisma:push`** - Apply schema changes to the database
- **`npm run test`** - Run tests with Jest
- **`npm run prettier:all`** - Format code with Prettier

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

<!-- This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details. -->
