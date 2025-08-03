# NextGen Electronics Backend

Node.js (Express) REST API for the NextGen Electronics platform. MongoDB integration ready.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file with your MongoDB URI (optional):
   ```
   # MongoDB connection string for NextGen Electronics
   MONGODB_URI=mongodb+srv://admin:L5Rqtki9Q7JcZjb9@cluster0.mongodb.net/nextgen?retryWrites=true&w=majority
   ```
3. Start the server:
   ```
   npm run dev
   ```

## Scripts

- `npm run dev` — Start with nodemon (development)
- `npm start` — Start with Node.js (production)

## Endpoints

- `GET /` — Test route

Extend with routes for users, products, orders, etc.
