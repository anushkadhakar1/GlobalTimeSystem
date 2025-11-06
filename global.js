


document.addEventListener('DOMContentLoaded', () => {
  const selected = document.getElementById('selected-country');
  const dropdown = document.getElementById('dropdown-list');
  const timeDisplay = document.getElementById('current-time');
  const dateDisplay = document.getElementById('date');
  const greeting = document.getElementById('greeting');
  const hourHand = document.getElementById('hour-hand');
  const minuteHand = document.getElementById('minute-hand');
  const secondHand = document.getElementById('second-hand');
  const themeToggle = document.getElementById('theme-toggle');

  // Create & insert search input at the top of dropdown
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search country...';
  searchInput.style.width = '90%';
  searchInput.style.margin = '10px 5%';
  searchInput.style.padding = '5px';
  searchInput.style.borderRadius = '4px';
  searchInput.style.border = '1px solid #ccc';
  dropdown.prepend(searchInput);

  const timeZones = {
    India: 'Asia/Kolkata',
    'South Africa': 'Africa/Johannesburg',
    USA: 'America/New_York',
    'United Kingdom': 'Europe/London',
    Russia: 'Europe/Moscow',
    China: 'Asia/Shanghai',
    Canada: 'America/Toronto',
    Australia: 'Australia/Sydney',
    Germany: 'Europe/Berlin',
    France: 'Europe/Paris',
    Brazil: 'America/Sao_Paulo',
    Japan: 'Asia/Tokyo',
    Italy: 'Europe/Rome',
    Mexico: 'America/Mexico_City',
    'Saudi Arabia': 'Asia/Riyadh',
    'New Zealand': 'Pacific/Auckland'
  };

  const getTimeInZone = (timeZone) => {
    const now = new Date();
    return new Date(now.toLocaleString("en-US", { timeZone }));
  };

  const updateTime = () => {
    const country = selected.querySelector('span').textContent;
    const timeZone = timeZones[country];
    const now = getTimeInZone(timeZone);

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Digital Time
    timeDisplay.textContent = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Date
    dateDisplay.textContent = now.toDateString();

    // Greeting
    if (hours < 12) greeting.textContent = "Good Morning!";
    else if (hours < 18) greeting.textContent = "Good Afternoon!";
    else greeting.textContent = "Good Evening!";

    // Analog Clock
    hourHand.style.transform = `rotate(${30 * hours + 0.5 * minutes}deg)`;
    minuteHand.style.transform = `rotate(${6 * minutes}deg)`;
    secondHand.style.transform = `rotate(${6 * seconds}deg)`;
  };

  updateTime();
  setInterval(updateTime, 1000);

  // Dropdown toggle
  selected.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    if (dropdown.style.display === 'block') {
      searchInput.focus(); // Focus search input when dropdown opens
    }
  });

  // Search filter
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const items = dropdown.querySelectorAll('li');

    items.forEach(li => {
      const country = li.getAttribute('data-country').toLowerCase();
      if (country.includes(filter)) {
        li.style.display = '';
      } else {
        li.style.display = 'none';
      }
    });
  });

  // Country selection
  dropdown.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li) {
      const flag = li.getAttribute('data-flag');
      const country = li.getAttribute('data-country');

      selected.innerHTML = `
        <img src="https://flagcdn.com/48x36/${flag}.png" class="flag-icon">
        <span>${country}</span>
      `;

      // Animate flag
      const img = selected.querySelector('img');
      img.style.transform = 'scale(1.3)';
      setTimeout(() => img.style.transform = 'scale(1)', 200);

      dropdown.style.display = 'none';
      searchInput.value = ''; // Clear search input after selection
      // Reset all list items to visible after search clears
      dropdown.querySelectorAll('li').forEach(li => li.style.display = '');

      updateTime();
    }
  });

  // Close dropdown on outside click
  window.addEventListener('click', (e) => {
    if (!document.querySelector('.dropdown-wrapper').contains(e.target)) {
      dropdown.style.display = 'none';
      searchInput.value = '';
      dropdown.querySelectorAll('li').forEach(li => li.style.display = '');
    }
  });

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
});