








const cityNameMap = {
  "Asia/Kolkata": "India (Kolkata)",
  "America/New_York": "USA (New York)",
  "Europe/London": "UK (London)",
  "Asia/Tokyo": "Japan (Tokyo)",
  "Australia/Sydney": "Australia (Sydney)",
  "Africa/Nairobi": "Kenya (Nairobi)"
};

function addToFavorites() {
  const selectedCity = document.getElementById("bookmark-city").value;
  let favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];

  if (!favorites.includes(selectedCity)) {
    favorites.push(selectedCity);
    localStorage.setItem("favoriteCities", JSON.stringify(favorites));
  }

  updateFavoritesList();
}

function updateFavoritesList() {
  const favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];
  const list = document.getElementById("favorites-list");
  list.innerHTML = '';

  if (favorites.length === 0) {
    list.innerHTML = `<li>No cities bookmarked yet.</li>`;
    return;
  }

  favorites.forEach(city => {
    const time = new Date().toLocaleTimeString("en-US", { timeZone: city });
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span>${cityNameMap[city] || city}: <strong>${time}</strong></span>
      <button onclick="removeFavorite('${city}')" class="delete-btn">🗑</button>
    `;
    list.appendChild(listItem);
  });
}

function removeFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];
  favorites = favorites.filter(c => c !== city);
  localStorage.setItem("favoriteCities", JSON.stringify(favorites));
  updateFavoritesList();
}

// Refresh every second to update times
setInterval(updateFavoritesList, 1000);

updateFavoritesList();