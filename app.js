/* ─── State ──────────────────────────────────────────────────────────────── */

let selectedDriveHours = 3;
let selectedWhen = 'weekend';
let selectedVibes = new Set();
let resultsVisible = false;
let deferredInstallPrompt = null;

/* ─── DOM ────────────────────────────────────────────────────────────────── */

const driveSelector  = document.getElementById('drive-selector');
const vibeSelector   = document.getElementById('vibe-selector');
const whenSelector   = document.getElementById('when-selector');
const showButton     = document.getElementById('show-button');
const resultsSection = document.getElementById('results');

/* ─── Selectors ──────────────────────────────────────────────────────────── */

function initSelectors() {
  driveSelector.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    driveSelector.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedDriveHours = parseFloat(pill.dataset.value);
    if (resultsVisible) renderResults();
  });

  vibeSelector.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    const value = pill.dataset.value;
    if (value === 'all') {
      selectedVibes.clear();
    } else {
      selectedVibes.has(value) ? selectedVibes.delete(value) : selectedVibes.add(value);
    }
    syncVibePills();
    if (resultsVisible) renderResults();
  });

  whenSelector.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    whenSelector.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedWhen = pill.dataset.value;
    if (resultsVisible) renderResults();
  });

  showButton.addEventListener('click', () => {
    const wasVisible = resultsVisible;
    resultsVisible = true;
    renderResults();
    if (!wasVisible) {
      showButton.textContent = 'Try somewhere else →';
      setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  });
}

/* ─── Vibe Pills Build ───────────────────────────────────────────────────── */

function buildVibePills() {
  const vibes = [...new Set(DESTINATIONS.flatMap(d => d.vibes))].sort();
  vibeSelector.innerHTML =
    '<button class="pill active" data-value="all">All</button>' +
    vibes.map(v => `<button class="pill" data-value="${v.toLowerCase()}">${v}</button>`).join('');
}

/* ─── Vibe Pills Sync ────────────────────────────────────────────────────── */

function syncVibePills() {
  vibeSelector.querySelectorAll('.pill').forEach(pill => {
    const v = pill.dataset.value;
    pill.classList.toggle('active',
      v === 'all' ? selectedVibes.size === 0 : selectedVibes.has(v)
    );
  });
}

/* ─── Filter Logic ───────────────────────────────────────────────────────── */

function getFilteredDestinations() {
  return DESTINATIONS.filter(d => {
    if (d.driveHours > selectedDriveHours) return false;
    if (selectedVibes.size === 0) return true;
    return d.vibes.some(v => selectedVibes.has(v.toLowerCase()));
  });
}

/* ─── Formatting ─────────────────────────────────────────────────────────── */

function formatDriveTime(hours) {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  const whole = Math.floor(hours);
  const remainder = hours - whole;
  if (remainder === 0) return `${whole} hr${whole !== 1 ? 's' : ''}`;
  return `${whole}.5 hrs`;
}

function buildBookingUrl(dest) {
  const query = encodeURIComponent(`${dest.name} ${dest.state}`);
  return `https://www.booking.com/searchresults.html?ss=${query}`;
}

/* ─── Card Builder ───────────────────────────────────────────────────────── */

function createCard(dest) {
  const card = document.createElement('article');
  card.className = 'destination-card';
  card.setAttribute('data-primary-vibe', dest.vibes[0].toLowerCase());

  const vibeTagsHTML = dest.vibes
    .map(v => `<span class="vibe-tag vibe-${v.toLowerCase()}">${v}</span>`)
    .join('');

  card.innerHTML = `
    <div class="card-photo">
      <img src="${dest.photo}" alt="${dest.name}, ${dest.state}" loading="lazy" decoding="async">
      <div class="card-photo-gradient"></div>
      <div class="card-photo-meta">
        <div>
          <h2 class="destination-name">${dest.name}</h2>
          <span class="destination-state">${dest.state}</span>
        </div>
        <div class="drive-badge">
          <span class="drive-icon" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5.75" stroke="currentColor" stroke-width="1.25"/>
              <path d="M6.5 2.5 L8.5 6.5 L6.5 5.5 L4.5 6.5 Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="drive-time">${formatDriveTime(dest.driveHours)}</span>
        </div>
      </div>
    </div>
    <div class="card-accent-bar"></div>
    <div class="card-body">
      <div class="anchor-attraction">
        <span class="anchor-label">Built around</span>
        <span class="anchor-name">${dest.anchor}</span>
      </div>

      <p class="destination-description">${dest.description}</p>

      <div class="card-footer">
        <div class="vibe-tags" aria-label="Vibes">${vibeTagsHTML}</div>
        <a
          class="stay-button"
          href="${buildBookingUrl(dest)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Find a place to stay in ${dest.name}"
        >Find a stay ↗</a>
      </div>
    </div>
  `;

  return card;
}

/* ─── Render ─────────────────────────────────────────────────────────────── */

function renderResults() {
  const destinations = getFilteredDestinations();
  resultsSection.innerHTML = '';

  if (destinations.length === 0) {
    resultsSection.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">Nothing nearby.</p>
        <p class="empty-sub">Push the drive time up a bit and let's see what opens up.</p>
      </div>
    `;
    return;
  }

  const whenLabel = {
    tonight: 'tonight',
    weekend: 'this weekend',
    flexible: "whenever you're ready",
  }[selectedWhen];

  const header = document.createElement('div');
  header.className = 'results-header';
  header.innerHTML = `
    <p class="results-count">${destinations.length} place${destinations.length !== 1 ? 's' : ''} within ${formatDriveTime(selectedDriveHours)}</p>
    <p class="results-when">Going ${whenLabel} — from Fort Wayne</p>
  `;
  resultsSection.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'cards-grid';

  destinations.forEach((dest, i) => {
    const card = createCard(dest);
    card.style.transitionDelay = `${i * 55}ms`;
    grid.appendChild(card);
  });

  resultsSection.appendChild(grid);

  // Staggered entrance animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      grid.querySelectorAll('.destination-card').forEach(card => {
        card.classList.add('card-visible');
      });
    });
  });
}

/* ─── PWA Install Prompt ─────────────────────────────────────────────────── */

function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallBanner();
  });
}

function showInstallBanner() {
  if (document.querySelector('.install-banner')) return;

  const banner = document.createElement('div');
  banner.className = 'install-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Install app');
  banner.innerHTML = `
    <p><strong>Add to Home Screen</strong> for the full road-trip experience.</p>
    <button class="install-accept">Install</button>
    <button class="install-dismiss" aria-label="Dismiss">✕</button>
  `;

  banner.querySelector('.install-accept').addEventListener('click', async () => {
    banner.remove();
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      console.log('Install prompt outcome:', outcome);
    }
  });

  banner.querySelector('.install-dismiss').addEventListener('click', () => {
    banner.remove();
  });

  document.body.appendChild(banner);
}

/* ─── Service Worker ─────────────────────────────────────────────────────── */

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  }
}

/* ─── Init ───────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  buildVibePills();
  initSelectors();
  initInstallPrompt();
  registerServiceWorker();
});
