

const cityNameMap = {
  "Asia/Kolkata": "India (Kolkata)",
  "America/New_York": "USA (New York)",
  "Europe/London": "UK (London)",
  "Asia/Tokyo": "Japan (Tokyo)",
  "Australia/Sydney": "Australia (Sydney)",
  "Africa/Nairobi": "Kenya (Nairobi)"
};

function compareTimezones() {
  const city1 = document.getElementById('city1').value;
  const city2 = document.getElementById('city2').value;
  const resultDiv = document.getElementById('result');

  if (!city1 || !city2) {
    resultDiv.innerHTML = `<p>Please select both cities.</p>`;
    return;
  }

  const time1 = new Date().toLocaleString('en-US', { timeZone: city1 });
  const time2 = new Date().toLocaleString('en-US', { timeZone: city2 });

  const date1 = new Date(time1);
  const date2 = new Date(time2);

  const diffMs = Math.abs(date1 - date2);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

  resultDiv.innerHTML = `
    <p><strong>${cityNameMap[city1]}</strong>: ${date1.toLocaleTimeString()}<br>
    <strong>${cityNameMap[city2]}</strong>: ${date2.toLocaleTimeString()}</p>
    <p>🕑 Time Difference: <strong>${diffHours} hour(s) and ${diffMinutes} minute(s)</strong></p>
  `;
}

