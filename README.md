# Reading Tracker

A full-stack Reading Tracker application that allows users to manage books they are reading, want to read, or have completed.

The application includes a React frontend and a REST API built with Node.js and Hapi. PostgreSQL and Prisma are used for data storage, with authentication and role-based access control used to protect user data.

---

## Live Application

Frontend:

https://reading-tracker-1-t5y5.onrender.com

Backend API:

https://reading-tracker-jsii.onrender.com

Health Check:

https://reading-tracker-jsii.onrender.com/health

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- SCSS

### Backend

- Node.js
- Hapi
- Prisma ORM
- PostgreSQL
- Supabase
- bcrypt
- JSON Web Tokens (JWT)

### Testing and Development Tools

- Jest
- Playwright
- Postman
- k6
- Python
- Git and GitHub

### Deployment

- Render

---

## Features

### Authentication

- User registration
- User login
- Password hashing using bcrypt
- JWT authentication
- Protected book routes
- USER and ADMIN roles

### Book Management

Authenticated users can:

- Add a book
- View their books
- View a specific book
- Update a book
- Delete a book
- Track reading status
- Add notes
- Record start and finish dates

### Book Search

Users can search for books using live data from the Open Library API.

Search results include book information such as the title, author and cover image. A book returned by the external API can then be added to the user's own reading tracker and persisted in the PostgreSQL database.

### Access Control

Books belong to individual users.

A normal `USER` can only access and manage their own books.

An `ADMIN` has additional permissions and can view and manage books belonging to other users.

Ownership checks are performed by the backend rather than relying on the frontend to restrict access.

---

## Authentication Approach

The application uses JSON Web Tokens (JWT) for authentication.

When a user logs in successfully, the backend creates a JWT containing the user's ID and role. The frontend sends this token in the `Authorization` header when making requests to protected endpoints.

JWT was chosen because it provides a simple way for the React frontend and REST API to authenticate requests without maintaining server-side session state.

Passwords are never stored as plain text. bcrypt is used to hash passwords before they are stored in the database.

---

## External API

The application integrates with the Open Library API to provide live book search functionality.

Users can search for a book and add a result to their personal library. The selected book information is then stored through the Reading Tracker API, meaning it remains in the user's library after the page is refreshed.

---

## Postman Collection

The API was manually tested using Postman, including authentication, book CRUD operations and role-based access control.

The collection includes requests for:

- Health check
- User registration
- User login
- Getting books
- Creating books
- Updating books
- Deleting books

Postman Collection:

https://alisha-shamsher-356229.postman.co/workspace/alisha-shamsher's-Workspace~151b474b-76b5-4583-8ca5-7719d38f871a/folder/54451579-41b1ce7a-5759-4000-adc0-2aae2564a436?action=share&source=copy-link&creator=54451579

The collection is provided through a shared Postman workspace link because collection export was not available on the Postman plan used during development.

---

## Testing

The project uses several different testing approaches to check the backend, frontend and application functionality.

### Jest Unit Tests

Jest is used to test the book service and its interaction with Prisma.

The tests cover:

- Retrieving books belonging to the logged-in user
- Retrieving a specific book using both the book ID and user ID
- Creating a book and assigning it to the logged-in user
- Updating a book owned by the logged-in user
- Deleting a book owned by the logged-in user
- Preventing one user from updating another user's book
- Preventing one user from deleting another user's book
- Preventing one user from retrieving another user's book
- Allowing an ADMIN to update another user's book

All 9 Jest tests are currently passing.

The ownership tests are particularly important because they verify that users cannot read, update or delete another user's books even if they know the ID of the book.

### Playwright End-to-End Tests

Playwright is used to test important user journeys through the React application.

Two end-to-end tests are included:

1. **Book CRUD happy path**
   - Logs in
   - Adds a book
   - Verifies that the book appears
   - Edits the book
   - Verifies the update
   - Deletes the book
   - Verifies that the book has been removed

2. **Authorization failure**
   - Logs in as a normal user
   - Attempts to access an ADMIN-only API endpoint
   - Confirms that the API returns a `403 Forbidden` response

Both Playwright tests are currently passing.

### Testing Strategy

The Week 4 focus for this project was testing.

The testing approach combines unit testing, end-to-end testing, authorization testing and basic performance testing.

Jest is used to test the book service in isolation by mocking Prisma. Particular attention was given to ownership and role-based access control.

Additional negative tests verify that:

- One user cannot update another user's book
- One user cannot delete another user's book
- One user cannot retrieve another user's book

Playwright is used to test the main CRUD user journey and an authorization failure scenario.

Postman was used for manual API testing, while k6 was used for a basic API smoke test.

This combination provides coverage of core functionality, user permissions and important failure cases.

---

## Performance Testing

A basic k6 smoke test is included in:

`backend/performance/smoke-test.js`

The test sends requests to the `/health` endpoint using one virtual user for 10 seconds.

### Results

- 10 requests completed
- 0% request failure rate
- 20/20 checks passed
- Average response time: 1.41 ms
- Maximum response time: 6.16 ms
- 95th percentile response time: 4.19 ms

The smoke test showed that the health endpoint remained available and responded correctly throughout the test.

This was a small local smoke test rather than a full performance or stress test, so the results are intended to verify basic reliability rather than production-scale performance.

---

## Python Utility Script

A small Python health-check script is included in:

`backend/scripts/api_health_check.py`

The script sends a request to the API `/health` endpoint and displays:

- HTTP status
- Service name
- API status
- Whether the API is healthy

This provides a simple command-line way to verify that the backend is running and responding correctly.

---

## Running the Project Locally

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

`http://localhost:3000`

You can check that the API is running using:

`http://localhost:3000/health`

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

`http://localhost:5173`

---

## Environment Variables

Environment variables are used to keep configuration and sensitive information outside of the source code.

Real `.env` files are excluded from Git using `.gitignore`.

### Backend

The backend requires the following environment variables:

```env
DATABASE_URL=
JWT_SECRET=
```

- `DATABASE_URL` contains the PostgreSQL database connection string.
- `JWT_SECRET` is used to sign and verify JSON Web Tokens.

### Frontend

The frontend requires:

```env
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` tells the React application which backend API it should communicate with.

For the deployed application, this environment variable is configured on Render to point to the deployed backend.

Example environment configuration is provided through `.env.example` without exposing secret values.

---

## Architecture

The application is separated into a React frontend and a Hapi REST API.

The main application flow is:

`React Frontend → Hapi REST API → Prisma → PostgreSQL`

The React frontend handles the user interface and sends requests to the backend API.

Hapi handles the API routes, authentication and requests from the frontend.

Prisma is used to communicate with the PostgreSQL database.

Supabase provides the hosted PostgreSQL database used by the deployed application.

### Authentication Flow

When a user logs in successfully:

1. The frontend sends the user's email and password to the backend.
2. The backend finds the user in the database.
3. bcrypt is used to compare the supplied password with the stored password hash.
4. The backend creates a JWT containing the user's ID and role.
5. The frontend stores the token and sends it with requests to protected routes.
6. The backend verifies the token before allowing access to protected resources.

This allows the backend to identify the logged-in user and apply ownership and role-based access rules.

### External Book Search

Book searching uses the Open Library API:

`React Frontend → Open Library API`

When a user chooses a book from the search results, the frontend sends the selected book information to the Reading Tracker backend:

`Open Library Result → Reading Tracker API → PostgreSQL`

This means external book information can be added to the user's library and stored permanently.

---

## Roles and Permissions

The application contains two roles:

### USER

A normal user can:

- View their own books
- Add books to their own library
- Update their own books
- Delete their own books
- Search for books using Open Library

A user cannot modify books belonging to another user.

### ADMIN

An administrator has additional permissions and can:

- View books belonging to all users
- Manage books belonging to other users

Role and ownership checks are performed by the backend to prevent users from bypassing restrictions through direct API requests.

---

## Security

Several measures are used to protect user data:

- Passwords are hashed using bcrypt before being stored.
- JWTs are used to authenticate protected API requests.
- Book routes require authentication.
- Ownership checks prevent users from modifying another user's books.
- ADMIN-only functionality checks the user's role on the backend.
- Database credentials and JWT secrets are stored using environment variables.
- `.env` files are excluded from Git.

---

## Limitations and Future Improvements

The current application meets the main project requirements, but there are several areas that could be developed further.

Possible future improvements include:

- More detailed form validation
- Additional automated tests for edge cases and invalid input
- Improved error handling and user feedback
- More advanced filtering and sorting of books
- Pagination for larger libraries and search results
- Additional book information from the Open Library API
- Improved accessibility
- More extensive performance and load testing

The current k6 test is a small smoke test and is not intended to represent production-scale performance testing.

The Postman collection is provided through a shared workspace link because collection export was not available on the Postman plan used during development.

---

## Deployment

Both parts of the application are publicly deployed using Render.

### Frontend

https://reading-tracker-1-t5y5.onrender.com

### Backend

https://reading-tracker-jsii.onrender.com

The deployed frontend communicates with the deployed backend using the `VITE_API_URL` environment variable.

The backend uses environment variables for its database connection and JWT secret.

The deployed application has been manually tested to confirm that users can log in, view their library, add books, edit books and search for books using the external Open Library integration.