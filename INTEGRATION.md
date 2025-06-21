# Frontend-Backend Integration

## Overview

The frontend has been successfully updated to use our local Node.js backend instead of the remote Mara API. This provides better control, debugging capabilities, and local development experience.

## Architecture

```
Frontend (React) ←→ Local Backend (Node.js/Express) ←→ Mara API
     Port 3000              Port 3001                    Remote
```

## Backend Setup

### Location: `backend/`
- **server.js**: Express server with API endpoints
- **package.json**: Dependencies and scripts
- **test.js**: Direct API testing script

### Endpoints:
- `GET /api/test` - Health check
- `GET /api/prices` - Fetches price data from Mara API
- `GET /api/inventory` - Fetches inventory data from Mara API

### Start Backend:
```bash
cd backend
npm install
npm start
```

## Frontend Changes

### Updated Files:
- **src/services/api.js**: Changed BASE_URL to `http://localhost:3001/api`
- **src/App.js**: Added API test route and navigation
- **src/components/ApiTest.js**: New component to test integration

### Key Changes:
1. **API Service**: Updated to use local backend endpoints
2. **Data Extraction**: Added `.data` property extraction from backend responses
3. **Error Handling**: Fallback to mock data if backend is unavailable
4. **Logging**: Added console logs for debugging

## Testing

### 1. Backend Test:
```bash
curl http://localhost:3001/api/test
curl http://localhost:3001/api/prices
curl http://localhost:3001/api/inventory
```

### 2. Frontend Test:
- Navigate to `http://localhost:3000/api-test`
- Check browser console for API calls
- Verify data is displayed correctly

### 3. Integration Test:
- Start both backend and frontend
- Visit any page in the app
- Check that data loads from local backend

## Data Flow

1. **Frontend Request**: React component calls `fetchPrices()` or `fetchInventory()`
2. **API Service**: Makes request to `http://localhost:3001/api/prices` or `/inventory`
3. **Backend Processing**: Express server calls Mara API and logs response
4. **Response**: Backend returns structured data with success flag
5. **Frontend Processing**: Extracts `.data` property and updates UI

## Benefits

- **Local Development**: No dependency on external API availability
- **Debugging**: Full control over API responses and logging
- **Performance**: Faster response times for development
- **Reliability**: Fallback to mock data if needed
- **Monitoring**: Console logs show all API interactions

## Troubleshooting

### Backend Not Starting:
- Check if port 3001 is available
- Verify all dependencies are installed
- Check console for error messages

### Frontend Can't Connect:
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify API endpoints are correct

### Data Not Loading:
- Check backend console for API call logs
- Verify Mara API is accessible
- Check frontend console for error messages

## Next Steps

1. **Add More Endpoints**: Extend backend with additional Mara API endpoints
2. **Caching**: Implement response caching for better performance
3. **Error Handling**: Add more sophisticated error handling and retry logic
4. **Monitoring**: Add metrics and monitoring for API calls
5. **Environment Config**: Add environment variables for different deployment scenarios 