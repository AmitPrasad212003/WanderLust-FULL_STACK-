const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "A lovely cottage right on the beach, perfect for a relaxing getaway.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1680090628003-6ad0e8cc37c6?q=80&w=1528&auto=format&fit=crop"
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    geometry: { type: "Point", coordinates: [-118.7798, 34.0259] }
  },
  {
    title: "Modern Loft in Downtown",
    description: "Experience city living in this modern loft located in the heart of downtown.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=1375&auto=format&fit=crop"
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    geometry: { type: "Point", coordinates: [-74.0060, 40.7128] }
  },
  {
    title: "Mountain Retreat Cabin",
    description: "A quiet retreat in the mountains, surrounded by nature.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1680019895755-d592a95a502f?q=80&w=1528&auto=format&fit=crop"
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    geometry: { type: "Point", coordinates: [-106.8183, 39.1911] }
  },
  {
    title: "Beach House Escape",
    description: "Enjoy ocean views and salty breezes from this charming beach house.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1374&auto=format&fit=crop"
    },
    price: 1800,
    location: "Miami",
    country: "United States",
    geometry: { type: "Point", coordinates: [-80.1918, 25.7617] }
  },
  {
    title: "Rustic Farmhouse",
    description: "A peaceful farmhouse surrounded by rolling hills and open fields.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1678297272130-fa1ec81c8a87?q=80&w=1374&auto=format&fit=crop"
    },
    price: 900,
    location: "Nashville",
    country: "United States",
    geometry: { type: "Point", coordinates: [-86.7816, 36.1627] }
  },
  {
    title: "Luxury Villa with Pool",
    description: "This villa offers luxurious living with a private pool and stunning views.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1661963218190-e143d5470160?q=80&w=1528&auto=format&fit=crop"
    },
    price: 2500,
    location: "Los Angeles",
    country: "United States",
    geometry: { type: "Point", coordinates: [-118.2437, 34.0522] }
  },
  {
    title: "Charming Cottage",
    description: "A cozy cottage in a quiet neighborhood, perfect for a weekend getaway.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1677437410157-dc79fecfbaa3?q=80&w=1528&auto=format&fit=crop"
    },
    price: 800,
    location: "Portland",
    country: "United States",
    geometry: { type: "Point", coordinates: [-122.6765, 45.5231] }
  },
  {
    title: "Ski-in/Ski-out Condo",
    description: "Perfect for ski lovers! Ski directly from your door to the slopes.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1680019895733-b89c4c2b2c4d?q=80&w=1528&auto=format&fit=crop"
    },
    price: 2000,
    location: "Vail",
    country: "United States",
    geometry: { type: "Point", coordinates: [-106.3742, 39.6403] }
  },
  {
    title: "Lakeside Lodge",
    description: "A tranquil lodge by the lake, great for fishing and nature walks.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1680090627834-c9f64f9c6046?q=80&w=1528&auto=format&fit=crop"
    },
    price: 1700,
    location: "Lake Tahoe",
    country: "United States",
    geometry: { type: "Point", coordinates: [-120.0324, 39.0968] }
  },
  {
    title: "Urban Apartment",
    description: "A modern apartment located in the heart of the city.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1661930868821-259a3debb233?q=80&w=1374&auto=format&fit=crop"
    },
    price: 1300,
    location: "Chicago",
    country: "United States",
    geometry: { type: "Point", coordinates: [-87.6298, 41.8781] }
  },

  {
    title: 'Eco Bamboo Retreat',
    description: 'A peaceful bamboo cottage surrounded by rice terraces.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1558981033-0f11d0a4f96a' },
    price: 1800,
    location: 'Ubud',
    country: 'Indonesia',
    category: 'Rooms',
    geometry: { type: 'Point', coordinates: [115.2625, -8.5069] }
  },
  {
    title: 'Desert Luxury Camp',
    description: 'A unique glamping experience in the Sahara desert.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1548783300-17df9b5e5a1a' },
    price: 3500,
    location: 'Merzouga',
    country: 'Morocco',
    category: 'Camping',
    geometry: { type: 'Point', coordinates: [-4.0108, 31.0998] }
  },
  {
    title: 'Modern Riverside Loft',
    description: 'A stylish loft by the river.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' },
    price: 2700,
    location: 'Bangkok',
    country: 'Thailand',
    category: 'Rooms',
    geometry: { type: 'Point', coordinates: [100.5231, 13.7367] }
  },
  {
    title: 'Rocky Mountain Cabin',
    description: 'A cozy wooden cabin in the Rocky Mountains.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1' },
    price: 3100,
    location: 'Denver',
    country: 'USA',
    category: 'Cabins',
    geometry: { type: 'Point', coordinates: [-104.9903, 39.7392] }
  },
  {
    title: 'Tropical Beach Shack',
    description: 'A colorful beach hut near crystal-clear waters.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' },
    price: 1900,
    location: 'Goa',
    country: 'India',
    category: 'Beach',
    geometry: { type: 'Point', coordinates: [73.9855, 15.2993] }
  },
  {
    title: 'Alpine Snow Suite',
    description: 'A stylish winter suite in the Alps.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' },
    price: 4200,
    location: 'Zermatt',
    country: 'Switzerland',
    category: 'Rooms',
    geometry: { type: 'Point', coordinates: [7.7491, 46.0207] }
  },
  {
    title: 'Urban Tech Apartment',
    description: 'A modern smart home with automated lighting.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85' },
    price: 3400,
    location: 'Tokyo',
    country: 'Japan',
    category: 'Rooms',
    geometry: { type: 'Point', coordinates: [139.6917, 35.6895] }
  },
  {
    title: 'Seaside Cliff House',
    description: 'A luxurious clifftop ocean-view property.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae' },
    price: 5000,
    location: 'Santorini',
    country: 'Greece',
    category: 'Beach',
    geometry: { type: 'Point', coordinates: [25.4615, 36.3932] }
  },
  {
    title: 'Rajasthan Heritage Stay',
    description: 'Stay like royalty in a traditional haveli.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1549921296-3df4b8679a4a' },
    price: 2600,
    location: 'Jodhpur',
    country: 'India',
    category: 'Rooms',
    geometry: { type: 'Point', coordinates: [73.0243, 26.2389] }
  },
  {
    title: 'Nordic Minimal House',
    description: 'A bright and minimal Scandinavian home.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb' },
    price: 3800,
    location: 'Oslo',
    country: 'Norway',
    category: 'Rooms',
    geometry: { type: 'Point', coordinates: [10.7522, 59.9139] }
  },
  {
    title: 'Floating Lake Villa',
    description: 'A serene villa built on a tranquil lake.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511' },
    price: 3300,
    location: 'Pokhara',
    country: 'Nepal',
    category: 'Houses',
    geometry: { type: 'Point', coordinates: [83.9856, 28.2096] }
  },
  {
    title: 'Countryside Family Farmhouse',
    description: 'A spacious farmhouse perfect for families.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae' },
    price: 2100,
    location: 'Nashik',
    country: 'India',
    category: 'Houses',
    geometry: { type: 'Point', coordinates: [73.7898, 19.9975] }
  },
  {
    title: 'Ancient City Rooftop Stay',
    description: 'A rooftop home in the heart of the old city.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb' },
    price: 1700,
    location: 'Kathmandu',
    country: 'Nepal',
    category: 'Rooms',
    geometry: { type: 'Point', coordinates: [85.3240, 27.7172] }
  },
  {
    title: 'Clifftop Forest Retreat',
    description: 'A retreat surrounded by dense forests.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1528318193279-ce9c7122a43c' },
    price: 2900,
    location: 'Shillong',
    country: 'India',
    category: 'Camping',
    geometry: { type: 'Point', coordinates: [91.8933, 25.5788] }
  },
  {
    title: 'City Center Capsule Stay',
    description: 'A futuristic capsule stay with modern amenities.',
    image: { filename: 'listingimage', url: 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c' },
    price: 1200,
    location: 'Singapore',
    country: 'Singapore',
    category: 'Rooms',
    geometry: { type: 'Point', coordinates: [103.8198, 1.3521] }
  }
];

module.exports = { sampleListings };
