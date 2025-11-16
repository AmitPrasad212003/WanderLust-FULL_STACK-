# Step-by-Step Guide: Fixing Map/Geocoding Issues

## Problem
Your listings are showing:
- "Geocoding API is not enabled" error
- "Map not available for this listing (address not geocoded)" message
- Empty coordinates: `geometry: { type: 'Point', coordinates: [] }`

## Solution Overview
1. Enable Geocoding API in Google Cloud Console
2. Enable Billing (if required)
3. Verify API Key permissions
4. Run script to fix existing listings

---

## STEP 1: Enable Geocoding API

### 1.1 Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 1.2 Select Your Project
- Click the project dropdown at the top
- Select your project (or create a new one if needed)

### 1.3 Navigate to APIs & Services
- Click the hamburger menu (☰) in the top left
- Go to **APIs & Services** > **Library**

### 1.4 Enable Geocoding API
- In the search bar, type: **"Geocoding API"**
- Click on **"Geocoding API"** from the results
- Click the **"ENABLE"** button
- Wait for confirmation (usually takes a few seconds)

### 1.5 Enable Maps JavaScript API (for displaying maps)
- Still in the API Library
- Search for: **"Maps JavaScript API"**
- Click **"ENABLE"**

---

## STEP 2: Enable Billing

### 2.1 Go to Billing
- Click the hamburger menu (☰)
- Go to **Billing**

### 2.2 Link Billing Account
- If you don't have a billing account, click **"CREATE BILLING ACCOUNT"**
- Follow the prompts to add a payment method
- **Note:** Google provides $200 free credit per month for Maps APIs

### 2.3 Link to Project
- If billing is not linked to your project:
  - Click **"LINK A BILLING ACCOUNT"**
  - Select your billing account
  - Click **"SET ACCOUNT"**

---

## STEP 3: Verify API Key

### 3.1 Go to Credentials
- Click the hamburger menu (☰)
- Go to **APIs & Services** > **Credentials**

### 3.2 Check Your API Key
- Find your API key (the one in your `.env` file as `MAP_API_KEY`)
- Click on the API key name to edit it

### 3.3 Set API Restrictions (Recommended)
- Under **API restrictions**, select **"Restrict key"**
- Check the following APIs:
  - ✅ **Geocoding API**
  - ✅ **Maps JavaScript API**
- Click **"SAVE"**

### 3.4 Set Application Restrictions (Optional but Recommended)
- Under **Application restrictions**, you can:
  - **HTTP referrers** (for web apps): Add your domain
  - **IP addresses** (for server-side): Add your server IP
- Or select **"None"** for testing (less secure)

---

## STEP 4: Wait for Propagation
- **Wait 2-5 minutes** for API changes to propagate
- This is important! Changes may not be immediate

---

## STEP 5: Test the API

### 5.1 Test in Browser
Open this URL in your browser (replace `YOUR_API_KEY`):
```
https://maps.googleapis.com/maps/api/geocode/json?address=Shimla,India&key=YOUR_API_KEY
```

You should see JSON with coordinates if it works:
```json
{
  "status": "OK",
  "results": [
    {
      "geometry": {
        "location": {
          "lat": 31.1048,
          "lng": 77.1734
        }
      }
    }
  ]
}
```

If you see an error, go back to Steps 1-3.

---

## STEP 6: Fix Existing Listings

### 6.1 Make sure your `.env` file has the API key:
```env
MAP_API_KEY=your_actual_api_key_here
```

### 6.2 Run the geocoding script:
```bash
node utils/geocodeListings.js
```

This script will:
- Find all listings without valid coordinates
- Geocode each one using the Google API
- Update the database with coordinates
- Show progress and results

### 6.3 Expected Output:
```
Connected to MongoDB
Found 2 listings that need geocoding

Geocoding: "Shimla Hill View Cottage" - Shimla, India
✓ Success! Coordinates: [77.1734, 31.1048]

Geocoding: "Jaisalmer Desert Camp" - Jaisalmer, India
✓ Success! Coordinates: [70.9153, 26.9157]

==================================================
Geocoding Complete!
Success: 2
Failed: 0
==================================================
Disconnected from MongoDB
```

---

## STEP 7: Verify It Works

### 7.1 Create/Update a New Listing
- Go to your app
- Create a new listing or update an existing one
- The map should now appear!

### 7.2 Check Existing Listings
- View any listing page
- You should see the map with a marker
- No more "Map not available" message

---

## Troubleshooting

### Error: "API project is not authorized"
- **Solution:** Make sure Geocoding API is enabled (Step 1.4)
- **Solution:** Make sure billing is enabled (Step 2)

### Error: "REQUEST_DENIED"
- **Solution:** Check API key restrictions (Step 3.3)
- **Solution:** Make sure the API key has access to Geocoding API

### Error: "OVER_QUERY_LIMIT"
- **Solution:** You've exceeded the free quota
- **Solution:** Wait 24 hours or upgrade your billing plan

### Script shows "Found 0 listings"
- **Solution:** Your listings might already have coordinates
- **Solution:** Check your database directly

### Map still not showing
- **Solution:** Check browser console for JavaScript errors
- **Solution:** Verify `MAP_API_KEY` is set in `.env`
- **Solution:** Make sure Maps JavaScript API is enabled (Step 1.5)

---

## Quick Checklist

- [ ] Geocoding API enabled
- [ ] Maps JavaScript API enabled
- [ ] Billing account linked
- [ ] API key has correct permissions
- [ ] API key in `.env` file
- [ ] Waited 2-5 minutes after enabling APIs
- [ ] Tested API in browser
- [ ] Ran geocoding script
- [ ] Verified map appears on listing pages

---

## Need Help?

If you're still having issues:
1. Check the server console logs for detailed error messages
2. Verify your API key is correct in `.env`
3. Test the API directly in browser (Step 5)
4. Check Google Cloud Console for API usage/quota

