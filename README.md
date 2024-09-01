# Netflix Account API

This project provides a set of APIs for managing user accounts in a Netflix-like application. It includes endpoints for signing up, logging in, logging out, and deleting accounts. MongoDB is used for dynamic data management.

## Features

- **Signup**: Create a new user account.
- **Login**: Authenticate a user.
- **Logout**: Log out a user from the application.
- **Delete Account**: Remove a user account from the database.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
  - Either install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-based solution.

## Getting Started

Follow the steps below to set up the project locally.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AasthaShah23/Netflix_API.git


### change directory and install node modules
<br>
cd netflix-backend
npm install

### Create .env file in root directory
<br>
touch .env

add below lines to .env file
<br>
MONGODB_URL=<Your MongoDB Connection String>
PORT=3001

## Run application
npm start
