# Mara Wattson Backend

A basic Node.js backend that fetches price data from the Mara Hackathon API.

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/test` - Test endpoint to verify the server is running
- `GET /api/prices` - Fetches price data from Mara Hackathon API

## Usage

The server will run on `http://localhost:3001` by default.

You can test the endpoints using curl or a web browser:

```bash
# Test the server
curl http://localhost:3001/api/test

# Get prices data
curl http://localhost:3001/api/prices
```

The prices endpoint will:
1. Call the Mara Hackathon API at `https://mara-hackathon-api.onrender.com/prices`
2. Print the response details to the console
3. Return the data as JSON with a success flag and timestamp 