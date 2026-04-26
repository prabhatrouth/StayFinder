const btn = document.getElementById("locBtn");
const status = document.getElementById("locStatus");
const form = document.getElementById("listingForm");

const latInput = document.getElementById("lat");
const lngInput = document.getElementById("lng");
const locationInput = document.getElementById("locationInput");

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

let locationCaptured = false;

// IMAGE PREVIEW
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    preview.style.display = "block";
    reader.onload = () => preview.src = reader.result;
    reader.readAsDataURL(file);
  }
});

// LOCATION BUTTON
btn.addEventListener("click", () => {

  if (!navigator.geolocation) {
    status.innerText = "Geolocation not supported";
    return;
  }

  btn.classList.add("loading");
  status.innerText = "Capturing your exact location...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      latInput.value = lat;
      lngInput.value = lng;

      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAP_TOKEN}`
        );

        const data = await res.json();
        const place = data.features[0]?.place_name || "Location captured";

        locationInput.value = place;

      } catch {
        locationInput.value = `Lat: ${lat}, Lng: ${lng}`;
      }

      btn.classList.remove("loading");
      btn.classList.add("success");

      status.innerText = "✅ Location captured successfully";
      locationCaptured = true;

    },
    () => {
      btn.classList.remove("loading");
      status.innerText = "❌ Please allow location access";
    },
    { enableHighAccuracy: true }
  );

});

// BLOCK SUBMIT
form.addEventListener("submit", (e) => {
  if (!locationCaptured) {
    e.preventDefault();
    alert("Please capture your location first");
  }
});