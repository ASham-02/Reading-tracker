# Reading-tracker

A full-stack Reading Tracker application that allows users to manage books they are reading, want to read, or have completed.

The project currently includes a REST API built with Node.js and Hapi, with PostgreSQL and Prisma used for data storage.

The frontend will be built using React.

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

### Access Control

Books belong to individual users.

A normal `USER` can only access and manage their own books.

An `ADMIN` can access and manage books belonging to other users.

---

## Postman Collection

A Postman collection is available for testing the API.

The collection includes requests for:

- Health check
- User registration
- User login
- Getting books
- Creating books
- Updating books
- Deleting books

Postman Collection: **https://alisha-shamsher-356229.postman.co/workspace/alisha-shamsher's-Workspace~151b474b-76b5-4583-8ca5-7719d38f871a/folder/54451579-41b1ce7a-5759-4000-adc0-2aae2564a436?action=share&source=copy-link&creator=54451579**