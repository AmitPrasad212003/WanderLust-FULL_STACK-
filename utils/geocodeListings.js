/**
 * Utility script to geocode existing listings that don't have coordinates
 * Run this script after enabling Geocoding API in Google Cloud Console
 * 
 * Usage: node utils/geocodeListings.js
 */

require('dotenv').config();
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const Listing = require("../models/listing.js");

// Use the same MongoDB URL as your app
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function geocodeAddress(location, country) {
    const key = process.env.MAP_API_KEY;
    
    if (!key) {
        throw new Error("MAP_API_KEY is not set in environment variables");
    }

    // Build address string with location and country
    let addressString = location.trim();
    if (country && country.trim().length > 0) {
        addressString += `, ${country.trim()}`;
    }
    
    const address = encodeURIComponent(addressString);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;
    
    try {
        const resp = await fetch(url);
        
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }
        
        const data = await resp.json();
        
        if (data.error_message) {
            throw new Error(`API Error: ${data.error_message}`);
        }
        
        if (data.status === "OK" && data.results && data.results.length > 0) {
            const coords = data.results[0].geometry.location;
            if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
                return {
                    type: "Point",
                    coordinates: [coords.lng, coords.lat]
                };
            }
        }
        
        throw new Error(`Geocoding failed: ${data.status}`);
    } catch (error) {
        console.error(`Error geocoding "${addressString}":`, error.message);
        throw error;
    }
}

async function geocodeAllListings() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");

        // Find all listings that need geocoding
        // Either no geometry, empty coordinates, or coordinates array doesn't have exactly 2 numbers
        const listings = await Listing.find({
            location: { $exists: true, $ne: "" }
        });

        // Filter listings that need geocoding
        const listingsToGeocode = listings.filter(listing => {
            // No geometry at all
            if (!listing.geometry) return true;
            
            // No coordinates
            if (!listing.geometry.coordinates) return true;
            
            // Empty coordinates array
            if (!Array.isArray(listing.geometry.coordinates) || listing.geometry.coordinates.length === 0) return true;
            
            // Coordinates array doesn't have exactly 2 valid numbers
            if (listing.geometry.coordinates.length !== 2) return true;
            
            // Coordinates are not valid numbers
            const [lng, lat] = listing.geometry.coordinates;
            if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) return true;
            
            // All checks passed - this listing has valid coordinates
            return false;
        });

        console.log(`Found ${listings.length} total listings`);
        console.log(`Found ${listingsToGeocode.length} listings that need geocoding`);

        if (listingsToGeocode.length === 0) {
            console.log("All listings already have valid coordinates!");
            await mongoose.disconnect();
            return;
        }

        let successCount = 0;
        let failCount = 0;

        for (const listing of listingsToGeocode) {
            try {
                console.log(`\nGeocoding: "${listing.title}" - ${listing.location}, ${listing.country || 'N/A'}`);
                
                const geometry = await geocodeAddress(listing.location, listing.country);
                
                listing.geometry = geometry;
                await listing.save();
                
                console.log(`✓ Success! Coordinates: [${geometry.coordinates[0]}, ${geometry.coordinates[1]}]`);
                successCount++;
                
                // Add a small delay to avoid hitting rate limits
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`✗ Failed: ${error.message}`);
                failCount++;
            }
        }

        console.log("\n" + "=".repeat(50));
        console.log(`Geocoding Complete!`);
        console.log(`Success: ${successCount}`);
        console.log(`Failed: ${failCount}`);
        console.log("=".repeat(50));

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Fatal error:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    geocodeAllListings();
}

module.exports = { geocodeAllListings, geocodeAddress };

