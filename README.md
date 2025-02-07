# WikTok

WikTok is an application built to interact with Wikipedia articles, allowing users to like, comment, and bookmark articles. The project consists of both a frontend and a backend, with the backend primarily built using TypeScript and various other technologies.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- **User Authentication**: Allows users to sign in using Wikipedia OAuth.
- **Article Interactions**: Users can like, comment, and bookmark articles.
- **Health Check Endpoint**: Provides a health check endpoint to ensure the server is running.

## Installation

To install and set up the project locally, follow these steps:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/r69shabh/WikTok.git
    cd WikTok
    ```

2. **Install dependencies for both frontend and backend:**

    For the frontend:
    ```sh
    npm install
    ```

    For the backend:
    ```sh
    cd backend
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory of both the frontend and backend, and populate it with the necessary environment variables. Refer to the `.env.example` for the required variables.

## Usage

To start the application, you need to run both the frontend and backend servers.

1. **Start the backend server:**

    ```sh
    cd backend
    npm run dev
    ```

2. **Start the frontend server:**

    ```sh
    npm run dev
    ```

The application should now be running, and you can access it at `http://localhost:3000`.

## Environment Variables

The project requires the following environment variables:

### Backend

- `VITE_WIKIPEDIA_CLIENT_ID`: Your Wikipedia OAuth client ID.
- `VITE_VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_SUPABASE_URL`: Your supabase URL

Refer to the `.env.example` file for more details.

## Project Structure

The project is structured as follows:

```
WikTok/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma  # Prisma schema
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.ts  # Supabase client setup
│   │   ├── routes/
│   │   └── index.ts  # Main server file
│   ├── package.json  # Backend dependencies and scripts
│   ├── package-lock.json
│   └── .env.example  # Example environment variables for backend
├── src/
│   └── ...  # Frontend source files
├── public/
│   └── ...  # Public assets
├── package.json  # Frontend dependencies and scripts
├── package-lock.json
├── .gitignore  # Git ignore file
└── .env.example  # Example environment variables for frontend
```

## License

This project is licensed under the MIT License.
