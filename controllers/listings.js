const { model } = require("mongoose");
const Listing = require("../models/listing.js");
const fetch = require("node-fetch"); // if node < 18
// const fetch = global.fetch; // if node >= 18 you can use native fetch



module.exports.index = async (req, res, next) => {
    try {
        const { location, category, minPrice, maxPrice, search } = req.query;
        
        // Build query object
        let query = {};
        
        // Location search (case-insensitive)
        if (location && location.trim()) {
            query.location = { $regex: location.trim(), $options: 'i' };
        }
        
        // Category filter
        if (category && category.trim() && category !== 'All') {
            query.category = category;
        }
        
        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice) {
                query.price.$lte = Number(maxPrice);
            }
        }
        
        // General search (searches in title, description, location, country)
        if (search && search.trim()) {
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } },
                { location: { $regex: search.trim(), $options: 'i' } },
                { country: { $regex: search.trim(), $options: 'i' } }
            ];
        }
        
        const allListings = await Listing.find(query);
        
        // Get unique categories for filter
        const categories = await Listing.distinct('category');
        
        res.render("listing/index.ejs", { 
            allListings,
            categories: categories.filter(c => c), // Remove null/undefined
            currentFilters: { location, category, minPrice, maxPrice, search }
        });
    } catch (err) {
        next(err);
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
    try {
        let {id} = req.params;
        const listing = await Listing.findById(id).populate({path :"reviews", populate : {
            path : "author",
        },
        }).populate("owner");
        if(!listing){
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listing");
        }
        res.render("listing/show.ejs", { listing });
    } catch (err) {
        next(err);
    }
};

module.exports.createListing = async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        // upload image handling (your existing code)
        if (req.file) {
            newListing.image = { url: req.file.path, filename: req.file.filename };
        }

        // Geocode the location text if provided
        if (newListing.location && newListing.location.trim().length > 0) {
            const key = process.env.MAP_API_KEY;
            
            if (!key) {
                console.error("MAP_API_KEY is not set in environment variables");
                req.flash("error", "Map API key is missing. Listing created but location not geocoded.");
            } else {
                try {
                    // Build address string with location and country if available
                    let addressString = newListing.location.trim();
                    if (newListing.country && newListing.country.trim().length > 0) {
                        addressString += `, ${newListing.country.trim()}`;
                    }
                    const address = encodeURIComponent(addressString);
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;
                    
                    const resp = await fetch(url);
                    
                    // Check if response is OK before parsing
                    if (!resp.ok) {
                        throw new Error(`HTTP error! status: ${resp.status}`);
                    }
                    
                    const data = await resp.json();
                    
                    // Check for API errors
                    if (data.error_message || (data.status && data.status !== "OK")) {
                        const errorMsg = data.error_message || `API returned status: ${data.status}`;
                        console.error("Geocoding API error:", errorMsg, "Status:", data.status);
                        
                        // Provide helpful error messages for common issues
                        let userFriendlyMsg = errorMsg;
                        if (errorMsg.includes("not authorized") || errorMsg.includes("API project is not authorized")) {
                            userFriendlyMsg = "Geocoding API is not enabled. Please enable 'Geocoding API' in Google Cloud Console and ensure billing is enabled.";
                        } else if (errorMsg.includes("REQUEST_DENIED")) {
                            userFriendlyMsg = "Geocoding API access denied. Check API key restrictions and ensure Geocoding API is enabled.";
                        } else if (errorMsg.includes("OVER_QUERY_LIMIT")) {
                            userFriendlyMsg = "Geocoding API quota exceeded. Please check your usage limits.";
                        } else if (errorMsg.includes("INVALID_REQUEST")) {
                            userFriendlyMsg = "Invalid geocoding request. Please check the location format.";
                        }
                        
                        req.flash("error", `${userFriendlyMsg} Listing created but map may not be available.`);
                        // Don't set geometry if geocoding fails
                        newListing.geometry = undefined;
                    } else if (data.status === "OK" && data.results && data.results.length > 0) {
                        const coords = data.results[0].geometry.location; // { lat, lng }
                        if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
                            newListing.geometry = {
                                type: "Point",
                                coordinates: [coords.lng, coords.lat]
                            };
                            console.log(`Geocoded "${addressString}" to [${coords.lng}, ${coords.lat}]`);
                        } else {
                            console.warn("Invalid coordinates received:", coords);
                            req.flash("error", `Invalid geocoding response for "${newListing.location}". Listing created but map may not be available.`);
                        }
                    } else {
                        console.warn("Geocoding failed:", data.status, data.error_message || "Unknown error");
                        req.flash("error", `Could not geocode location "${newListing.location}". Listing created but map may not be available.`);
                        // Don't set geometry if geocoding fails
                        newListing.geometry = undefined;
                    }
                } catch (fetchError) {
                    console.error("Error during geocoding:", fetchError.message);
                    console.error("Stack:", fetchError.stack);
                    req.flash("error", "Error geocoding location. Listing created but map may not be available.");
                    // Don't set geometry if geocoding fails
                    newListing.geometry = undefined;
                }
            }
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listing");
    } catch (err) {
        next(err);
    }
};



module.exports.editedListing = async(req, res, next) => {
    try {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listing");
        }
        let originalImageUrl = listing.image?.url;
        if(originalImageUrl){
            originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_300");
        }
        res.render("listing/edit.ejs", { listing , originalImageUrl});
    } catch (err) {
        next(err);
    }
};

module.exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body.listing };

        // If location was changed (or exists), geocode it
        if (updateData.location && updateData.location.trim().length > 0) {
            const key = process.env.MAP_API_KEY;
            
            if (!key) {
                console.error("MAP_API_KEY is not set in environment variables");
                req.flash("error", "Map API key is missing. Listing updated but location not geocoded.");
            } else {
                try {
                    // Build address string with location and country if available
                    let addressString = updateData.location.trim();
                    if (updateData.country && updateData.country.trim().length > 0) {
                        addressString += `, ${updateData.country.trim()}`;
                    }
                    const address = encodeURIComponent(addressString);
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;
                    
                    const resp = await fetch(url);
                    
                    // Check if response is OK before parsing
                    if (!resp.ok) {
                        throw new Error(`HTTP error! status: ${resp.status}`);
                    }
                    
                    const data = await resp.json();
                    
                    // Check for API errors
                    if (data.error_message || (data.status && data.status !== "OK")) {
                        const errorMsg = data.error_message || `API returned status: ${data.status}`;
                        console.error("Geocoding API error:", errorMsg, "Status:", data.status);
                        
                        // Provide helpful error messages for common issues
                        let userFriendlyMsg = errorMsg;
                        if (errorMsg.includes("not authorized") || errorMsg.includes("API project is not authorized")) {
                            userFriendlyMsg = "Geocoding API is not enabled. Please enable 'Geocoding API' in Google Cloud Console and ensure billing is enabled.";
                        } else if (errorMsg.includes("REQUEST_DENIED")) {
                            userFriendlyMsg = "Geocoding API access denied. Check API key restrictions and ensure Geocoding API is enabled.";
                        } else if (errorMsg.includes("OVER_QUERY_LIMIT")) {
                            userFriendlyMsg = "Geocoding API quota exceeded. Please check your usage limits.";
                        } else if (errorMsg.includes("INVALID_REQUEST")) {
                            userFriendlyMsg = "Invalid geocoding request. Please check the location format.";
                        }
                        
                        req.flash("error", `${userFriendlyMsg} Listing updated but map may not be available.`);
                        // Don't set geometry if geocoding fails - remove it from updateData
                        delete updateData.geometry;
                    } else if (data.status === "OK" && data.results && data.results.length > 0) {
                        const coords = data.results[0].geometry.location;
                        if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
                            updateData.geometry = {
                                type: "Point",
                                coordinates: [coords.lng, coords.lat]
                            };
                            console.log(`Geocoded "${addressString}" to [${coords.lng}, ${coords.lat}]`);
                        } else {
                            console.warn("Invalid coordinates received:", coords);
                            req.flash("error", `Invalid geocoding response for "${updateData.location}". Listing updated but map may not be available.`);
                        }
                    } else {
                        console.warn("Geocoding failed:", data.status, data.error_message || "Unknown error");
                        req.flash("error", `Could not geocode location "${updateData.location}". Listing updated but map may not be available.`);
                        // Don't set geometry if geocoding fails - remove it from updateData
                        delete updateData.geometry;
                    }
                } catch (fetchError) {
                    console.error("Error during geocoding:", fetchError.message);
                    console.error("Stack:", fetchError.stack);
                    req.flash("error", "Error geocoding location. Listing updated but map may not be available.");
                    // Don't set geometry if geocoding fails - remove it from updateData
                    delete updateData.geometry;
                }
            }
        }

        // Update the listing
        let listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });

        // file upload handling (if new image uploaded)
        if (typeof req.file !== "undefined") {
            listing.image = { url: req.file.path, filename: req.file.filename };
            await listing.save();
        }

        req.flash("success", "Listing Updated!");
        res.redirect(`/listing/${id}`);
    } catch (err) {
        next(err);
    }
};



module.exports.deleteListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        if(!deletedListing){
            req.flash("error", "Listing not found");
            return res.redirect("/listing");
        }
        console.log(deletedListing);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listing");
    } catch (err) {
        next(err);
    }
};