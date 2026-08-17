const THEMES = ["rhyolite", "campfire", "bolt"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const TRIPS = [
  { start: "2026-10-08", end: "2026-10-11", status: "booked" },
  { start: "2026-10-15", end: "2026-10-18", status: "open" },
  { start: "2026-10-22", end: "2026-10-25", status: "open" },
  { start: "2026-10-29", end: "2026-11-01", status: "booked" },
  { start: "2026-11-05", end: "2026-11-08", status: "open" },
  { start: "2026-11-12", end: "2026-11-15", status: "booked" },
  { start: "2026-11-19", end: "2026-11-22", status: "open" },
  { start: "2026-11-26", end: "2026-11-29", status: "open" },
  { start: "2026-12-03", end: "2026-12-06", status: "booked" },
  { start: "2026-12-10", end: "2026-12-13", status: "open" },
  { start: "2026-12-17", end: "2026-12-20", status: "booked" },
  { start: "2026-12-27", end: "2026-12-31", status: "open" },
  { start: "2027-01-07", end: "2027-01-10", status: "booked" },
  { start: "2027-01-14", end: "2027-01-17", status: "open" },
  { start: "2027-01-21", end: "2027-01-24", status: "open" },
  { start: "2027-01-28", end: "2027-01-31", status: "booked" },
  { start: "2027-02-04", end: "2027-02-07", status: "open" },
  { start: "2027-02-11", end: "2027-02-14", status: "booked" },
  { start: "2027-02-18", end: "2027-02-21", status: "open" },
  { start: "2027-02-25", end: "2027-02-28", status: "open" },
  { start: "2027-03-04", end: "2027-03-07", status: "open" },
  { start: "2027-03-11", end: "2027-03-14", status: "booked" },
  { start: "2027-03-18", end: "2027-03-21", status: "open" },
  { start: "2027-03-25", end: "2027-03-28", status: "open" },
  { start: "2027-04-01", end: "2027-04-04", status: "open" },
  { start: "2027-04-08", end: "2027-04-11", status: "booked" },
  { start: "2027-04-15", end: "2027-04-18", status: "open" }
];

const KINLOCH = [-38.6684, 175.9228];
const CAMP = [-38.6701, 175.8679];
const CLIFFS = [-38.6692, 175.8724];
const LOOKOUT = [-38.6617, 175.8788];
const TRACK = [
  KINLOCH,
  [-38.66720, 175.92080],
  [-38.66580, 175.91860],
  [-38.66390, 175.91640],
  [-38.66150, 175.91480],
  [-38.65925, 175.91291],
  [-38.65843, 175.91097],
  [-38.65721, 175.90995],
  [-38.65698, 175.90921],
  [-38.65763, 175.90867],
  [-38.65768, 175.90776],
  [-38.65762, 175.90672],
  [-38.65867, 175.90521],
  [-38.65834, 175.90353],
  [-38.65687, 175.90333],
  [-38.65758, 175.90204],
  [-38.65726, 175.90041],
  [-38.65708, 175.89871],
  [-38.65743, 175.89753],
  [-38.65751, 175.89596],
  [-38.65687, 175.89588],
  [-38.65778, 175.89413],
  [-38.65885, 175.89282],
  [-38.65972, 175.89131],
  [-38.66055, 175.88988],
  [-38.66077, 175.88810],
  [-38.66061, 175.88642],
  [-38.65967, 175.88558],
  [-38.65932, 175.88440],
  [-38.65934, 175.88264],
  [-38.66024, 175.88136],
  [-38.66096, 175.87968],
  LOOKOUT,
  [-38.66148, 175.87859],
  [-38.66081, 175.87824],
  [-38.66049, 175.87786],
  [-38.66200, 175.87718],
  [-38.66229, 175.87626],
  [-38.66284, 175.87564],
  [-38.66237, 175.87477],
  [-38.66166, 175.87421],
  [-38.66257, 175.87290],
  [-38.66321, 175.87197],
  [-38.66437, 175.87121],
  [-38.66550, 175.87067],
  [-38.66465, 175.86958],
  [-38.66403, 175.86929],
  [-38.66580, 175.86960],
  [-38.66760, 175.86880],
  CAMP
];

const TILES = {
  rhyolite: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attr: "&copy; OpenStreetMap &copy; CARTO"
  },
  campfire: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attr: "&copy; OpenStreetMap &copy; CARTO"
  },
  bolt: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attr: "&copy; OpenStreetMap &copy; CARTO"
  }
};

const AUCKLAND = [-36.8485, 174.7633];
const WELLINGTON = [-41.2865, 174.7762];
const CHRISTCHURCH = [-43.5321, 172.6362];
const NZ_BOUNDS = [[-34.5, 166.3], [-47.3, 178.8]];

let viewYear = 2026;
let viewMonth = 9; // October
let selectedTrip = null;
let map, tileLayer, trackLine, markers = [];
let mapNz, tileLayerNz, nzMarkers = [];

function parseDay(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function iso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function inRange(date, start, end) {
  const t = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return t >= parseDay(start).getTime() && t <= parseDay(end).getTime();
}

function isSeason(date) {
  const m = date.getMonth();
  return m >= 9 || m <= 3; // Oct–Apr
}

const HERO = {
  rhyolite: {
    src: "images/rappel.jpg",
    alt: "Rappelling a high cliff with the valley and lake country below"
  },
  campfire: {
    src: "images/camp-sunset-path.jpg",
    alt: "Sunset over the lake from camp at Kawakawa Bay"
  },
  bolt: {
    src: "images/lake-quickdraws.jpg",
    alt: "Quickdraws on the cliff framing the lake"
  }
};

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  localStorage.setItem("jims-theme", name);
  document.querySelectorAll("[data-theme-set]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.themeSet === name);
  });
  const hero = document.getElementById("hero-img");
  if (hero && HERO[name]) {
    hero.src = HERO[name].src;
    hero.alt = HERO[name].alt;
  }
  if (map) swapTiles(name);
  if (mapNz) swapNzTiles(name);
}

function accentColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#e8943a";
}

function swapTiles(name) {
  const spec = TILES[name] || TILES.rhyolite;
  if (tileLayer) map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(spec.url, { attribution: spec.attr, maxZoom: 18 }).addTo(map);
  if (trackLine) trackLine.setStyle({ color: accentColor() });
  if (markers.length) {
    markers.forEach((m) => map.removeLayer(m));
    markers = [];
    addPins();
  }
}

function seasonHeat(monthIndex, year) {
  const trips = TRIPS.filter((t) => {
    const s = parseDay(t.start);
    return s.getMonth() === monthIndex && s.getFullYear() === year;
  });
  if (!trips.length) return "off";
  if (trips.some((t) => t.status === "open")) return "on";
  return "hot";
}

function renderSeason() {
  const wrap = document.getElementById("season-strip");
  wrap.innerHTML = "";
  const start = new Date(2026, 4, 1); // May 2026
  for (let i = 0; i < 12; i += 1) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const btn = document.createElement("button");
    const heat = seasonHeat(d.getMonth(), d.getFullYear());
    btn.className = heat;
    if (d.getMonth() === viewMonth && d.getFullYear() === viewYear) btn.classList.add("is-current");
    btn.type = "button";
    btn.innerHTML = `<span>${MONTHS[d.getMonth()]}</span><span>${String(d.getFullYear()).slice(2)}</span>`;
    btn.addEventListener("click", () => {
      viewYear = d.getFullYear();
      viewMonth = d.getMonth();
      renderSeason();
      renderCalendar();
    });
    wrap.appendChild(btn);
  }
}

function formatRange(start, end) {
  const a = parseDay(start);
  const b = parseDay(end);
  const sameMonth = a.getMonth() === b.getMonth();
  if (sameMonth) {
    return `${a.getDate()}–${b.getDate()} ${MONTHS_LONG[a.getMonth()]} ${a.getFullYear()}`;
  }
  return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
}

function renderCalendar() {
  const root = document.getElementById("calendar");
  const title = document.getElementById("cal-title");
  title.textContent = `${MONTHS_LONG[viewMonth]} ${viewYear}`;
  root.innerHTML = "";

  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((d) => {
    const el = document.createElement("div");
    el.className = "dow";
    el.textContent = d;
    root.appendChild(el);
  });

  const first = new Date(viewYear, viewMonth, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let i = 0; i < startDow; i += 1) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    root.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(viewYear, viewMonth, day);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "day";
    btn.textContent = String(day);

    const trip = TRIPS.find((t) => inRange(new Date(date), t.start, t.end));
    if (!isSeason(date) && !trip) {
      btn.classList.add("off");
    } else if (trip) {
      btn.classList.add(trip.status);
      if (iso(date) === trip.start) btn.classList.add("start");
      if (iso(date) === trip.end) btn.classList.add("end");
      if (selectedTrip && selectedTrip.start === trip.start) btn.classList.add("in-trip");
      if (trip.status === "open") {
        btn.title = `Open · ${formatRange(trip.start, trip.end)}`;
        btn.addEventListener("click", () => selectTrip(trip));
      } else {
        btn.title = `Booked · ${formatRange(trip.start, trip.end)}`;
      }
    } else if (isSeason(date)) {
      btn.classList.add("off");
      btn.title = "Between trips — ask Jim about a custom window";
    }

    root.appendChild(btn);
  }
}

function selectTrip(trip) {
  selectedTrip = trip;
  const field = document.getElementById("dates-field");
  field.value = formatRange(trip.start, trip.end);
  document.getElementById("cal-hint").textContent = `${formatRange(trip.start, trip.end)} held on your enquiry.`;
  renderCalendar();
  document.getElementById("book").scrollIntoView({ behavior: "smooth" });
}

function pinIcon(letter) {
  const accent = accentColor();
  const ink = getComputedStyle(document.documentElement).getPropertyValue("--accent-ink").trim() || "#111";
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${accent};color:${ink};display:grid;place-items:center;font:700 12px Outfit,sans-serif;box-shadow:0 0 0 3px rgba(0,0,0,.25)">${letter}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function addPins() {
  markers = [
    L.marker(KINLOCH, { icon: pinIcon("A") }).addTo(map).bindPopup("<strong>Kinloch</strong><br>Trailhead. Park and walk the K2K."),
    L.marker(CAMP, { icon: pinIcon("B") }).addTo(map).bindPopup("<strong>Kawakawa camp</strong><br>Tents, swim, Jim’s kitchen."),
    L.marker(CLIFFS, { icon: pinIcon("C") }).addTo(map).bindPopup("<strong>The cliffs</strong><br>Lead, multi-pitch, trad."),
    L.marker(LOOKOUT, { icon: pinIcon("D") }).addTo(map).bindPopup("<strong>Codger’s Rock</strong><br>Lookout on the K2K walk in.")
  ];
}

function cityLabel(text, camp) {
  return L.divIcon({
    className: "",
    html: `<span class="map-label${camp ? " map-label-camp" : ""}">${text}</span>`,
    iconSize: [0, 0],
    iconAnchor: camp ? [-10, 10] : [-8, 8]
  });
}

function addNzPins() {
  nzMarkers = [
    L.circleMarker(CAMP, {
      radius: 9,
      color: accentColor(),
      weight: 3,
      fillColor: accentColor(),
      fillOpacity: 1
    }).addTo(mapNz).bindPopup("<strong>Kawakawa Bay</strong><br>Lake Taupō, North Island."),
    L.marker(CAMP, { icon: cityLabel("Kawakawa Bay", true) }).addTo(mapNz),
    L.marker(AUCKLAND, { icon: cityLabel("Auckland") }).addTo(mapNz),
    L.marker(WELLINGTON, { icon: cityLabel("Wellington") }).addTo(mapNz),
    L.marker(CHRISTCHURCH, { icon: cityLabel("Christchurch") }).addTo(mapNz)
  ];
}

function swapNzTiles(name) {
  const spec = TILES[name] || TILES.rhyolite;
  if (tileLayerNz) mapNz.removeLayer(tileLayerNz);
  tileLayerNz = L.tileLayer(spec.url, { attribution: spec.attr, maxZoom: 18 }).addTo(mapNz);
  if (nzMarkers.length) {
    nzMarkers.forEach((m) => mapNz.removeLayer(m));
    nzMarkers = [];
    addNzPins();
  }
}

function initMap() {
  map = L.map("leaflet-map", {
    scrollWheelZoom: false,
    zoomControl: true
  });

  swapTiles(document.documentElement.dataset.theme || "rhyolite");

  trackLine = L.polyline(TRACK, {
    color: accentColor(),
    weight: 5,
    opacity: 0.95,
    lineJoin: "round",
    lineCap: "round"
  }).addTo(map);

  addPins();
  map.fitBounds(trackLine.getBounds(), { padding: [28, 28] });
  setTimeout(() => {
    map.invalidateSize();
    map.fitBounds(trackLine.getBounds(), { padding: [28, 28] });
  }, 300);

  mapNz = L.map("leaflet-map-nz", {
    scrollWheelZoom: false,
    zoomControl: true
  }).fitBounds(NZ_BOUNDS, { padding: [24, 24] });

  swapNzTiles(document.documentElement.dataset.theme || "rhyolite");
  addNzPins();
  setTimeout(() => mapNz.invalidateSize(), 300);
}

function initTheme() {
  const saved = localStorage.getItem("jims-theme");
  const start = THEMES.includes(saved) ? saved : "rhyolite";
  setTheme(start);
  document.querySelectorAll("[data-theme-set]").forEach((btn) => {
    btn.addEventListener("click", () => setTheme(btn.dataset.themeSet));
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav a").forEach((a) => {
    a.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initCalNav() {
  document.getElementById("cal-prev").addEventListener("click", () => {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    renderSeason();
    renderCalendar();
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    renderSeason();
    renderCalendar();
  });
}

function initForm() {
  const form = document.getElementById("enquire-form");
  const status = document.getElementById("form-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Dates: ${data.dates || "flexible"}`,
      `Party: ${data.party}`,
      `Goal: ${data.goal}`,
      "",
      data.note || ""
    ].join("\n");
    const mailto = `mailto:jim@jimsadventures.nz?subject=${encodeURIComponent("Kawakawa Bay enquiry")}&body=${encodeURIComponent(body)}`;
    status.hidden = false;
    status.textContent = "Opening your email to Jim — if nothing pops, write jim@jimsadventures.nz.";
    window.location.href = mailto;
  });
}

function initLightbox() {
  const box = document.getElementById("lightbox");
  const img = box.querySelector("img");
  document.querySelectorAll(".gallery-grid button").forEach((btn) => {
    btn.addEventListener("click", () => {
      img.src = btn.dataset.full;
      img.alt = btn.querySelector("img").alt;
      box.hidden = false;
    });
  });
  box.querySelector(".lightbox-close").addEventListener("click", () => {
    box.hidden = true;
    img.src = "";
  });
  box.addEventListener("click", (e) => {
    if (e.target === box) {
      box.hidden = true;
      img.src = "";
    }
  });
}

initTheme();
initNav();
renderSeason();
renderCalendar();
initCalNav();
initForm();
initLightbox();
initMap();
