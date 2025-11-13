// public/js/map.js

document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("map");
  const listingDataElement = document.getElementById("listingData");

  // ✅ check if elements exist
  if (!mapContainer || !listingDataElement) {
    console.error("Map or listing data not found!");
    return;
  }

  // ✅ parse listing data
  const listing = JSON.parse(listingDataElement.textContent);
  const maptilerKey = maptilerKey || "<%= process.env.MAPTILER_API_KEY %>"; // fallback if needed

  console.log("Loaded listing:", listing);

  // ✅ create map
  const map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}`,
    center: listing.geometry.coordinates,
    zoom: 9,
  });

  // ✅ add marker
  new maplibregl.Marker()
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new maplibregl.Popup({ offset: 25 }).setHTML(
        `<h5>${listing.title}</h5><p>${listing.location}</p>`
      )
    )
    .addTo(map);
});
