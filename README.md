# Skill-NodeJS

Skill-NodeJS is a REST API service for managing skills in projects. Built with Node.js (v8) using TypeScript, Express, SQLite2, and TypeORM.

## Features

- Manage users and projects
- Assign skills to projects
- Token-based authentication

## Technologies Used

- **Node.js v8**
- **TypeScript**
- **Express**
- **SQLite2**
- **TypeORM**

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd skill-nodejs
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```

## API Endpoints

### Initialize Data

Create sample users with projects:

```http
GET http://localhost:3001/init
```

### Generate Token

Generate an authentication token for a user:

```http
POST http://localhost:3001/token
Content-Type: application/json

{
    "userId": 1,
    "username": "Test"
}
```

## Usage

After running `npm run dev`, the API will be available at `http://localhost:3001/`.

## License

This project is licensed under the MIT License.
