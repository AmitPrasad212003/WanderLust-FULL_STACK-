async function initMap() {
  try {
    const mapEl = document.getElementById("map");
    if (!mapEl) return; // no map here, exit

    const lat = parseFloat(mapEl.dataset.lat);
    const lng = parseFloat(mapEl.dataset.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      console.warn("Invalid coordinates for map:", lat, lng);
      return;
    }

    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || !google.maps) {
      console.error("Google Maps API is not loaded");
      return;
    }

    const position = { lat, lng };

    // import map library
    const { Map } = await google.maps.importLibrary("maps");
    // import marker library if you need the new marker class, otherwise classic Marker is fine
    // const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const map = new Map(mapEl, {
      center: position,
      zoom: 12,
    });

    // classic marker
    const marker = new google.maps.Marker({
      position,
      map: map,
      title: mapEl.dataset.title || "Listing location",
    });

    // === Custom Popup Content ===
    const popupHTML = `
      <div style="
        display:flex;
        flex-direction:column;
        gap:4px;
        padding:8px 10px;
        border-radius:8px;
        box-shadow:0 2px 6px rgba(0,0,0,0.2);
        font-family:Arial;
        background-color:white;
        min-width:200px;
      ">
        <div style="font-size:16px; font-weight:bold; color:#333;">
          ${mapEl.dataset.title || 'Listing'}
        </div>
        <div style="font-size:14px; color:#444;">
          📍 ${mapEl.dataset.location || ''}, ${mapEl.dataset.country || ''}
        </div>
        <div style="font-size:14px; font-weight:600; color:#000;">
          💰 ₹${mapEl.dataset.price ? Number(mapEl.dataset.price).toLocaleString('en-IN') : 'N/A'}/night
        </div>
      </div>
    `;

    // === Create InfoWindow ===
    const infoWindow = new google.maps.InfoWindow({
      content: popupHTML,
    });

    // Open when marker is clicked
    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map,
      });
    });

    // Auto-open when map loads
    infoWindow.open({
      anchor: marker,
      map,
    });
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}

// Only initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
