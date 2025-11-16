# Quick Fix: Geocoding Issues

## The Problem
- Listings show "Map not available" 
- Empty coordinates: `coordinates: []`
- Error: "Geocoding API is not enabled"

## Quick Solution (5 Steps)

### 1. Enable Geocoding API
1. Go to: https://console.cloud.google.com/apis/library
2. Search: "Geocoding API"
3. Click: **ENABLE**

### 2. Enable Maps JavaScript API  
1. Same page, search: "Maps JavaScript API"
2. Click: **ENABLE**

### 3. Enable Billing
1. Go to: https://console.cloud.google.com/billing
2. Link a billing account (Google gives $200/month free credit)

### 4. Wait 2-5 Minutes
Let the API changes propagate

### 5. Run the Fix Script
```bash
npm run geocode
```

Or:
```bash
node utils/geocodeListings.js
```

## That's It! ✅

After running the script, all your listings will have coordinates and maps will work.

**For detailed instructions, see: `GEOCODING_SETUP.md`**

