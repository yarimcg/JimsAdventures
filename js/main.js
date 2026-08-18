const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Ministry of Education term breaks:
// https://www.education.govt.nz/school/school-terms-and-holiday-dates
// Summer windows use the latest Term 4 close through the day before the latest Term 1 start.
const SCHOOL_HOLIDAYS = [
  { start: "2026-04-03", end: "2026-04-19" },
  { start: "2026-07-04", end: "2026-07-19" },
  { start: "2026-09-26", end: "2026-10-11" },
  { start: "2026-12-19", end: "2027-02-02" },
  { start: "2027-03-26", end: "2027-03-30" }, // Easter + Easter Tuesday, in term
  { start: "2027-04-10", end: "2027-04-26" },
  { start: "2027-07-03", end: "2027-07-18" },
  { start: "2027-09-25", end: "2027-10-10" },
  { start: "2027-12-18", end: "2028-02-07" }
];

// Employment NZ national days (actual + observed) plus Easter Tuesday and
// Auckland Anniversary (Taupō / Waikato observance):
// https://www.employment.govt.nz/leave-and-holidays/public-holidays/public-holidays-and-anniversary-dates
const PUBLIC_HOLIDAYS = [
  "2026-01-01", "2026-01-02", "2026-01-26", "2026-02-06",
  "2026-04-03", "2026-04-06", "2026-04-07", "2026-04-25", "2026-04-27",
  "2026-06-01", "2026-07-10", "2026-10-26",
  "2026-12-25", "2026-12-26", "2026-12-28",
  "2027-01-01", "2027-01-02", "2027-01-04", "2027-02-01", "2027-02-06", "2027-02-08",
  "2027-03-26", "2027-03-29", "2027-03-30", "2027-04-25", "2027-04-26",
  "2027-06-07", "2027-06-25", "2027-10-25",
  "2027-12-25", "2027-12-26", "2027-12-27", "2027-12-28"
];

const KINLOCH = [-38.6627, 175.9211];
const CAMP = [-38.66641, 175.87003];
const LOOKOUT = [-38.66184, 175.87836];
const TRACK = [
  KINLOCH,
  [-38.66293, 175.91978],
  [-38.66246, 175.91862],
  [-38.66160, 175.91736],
  [-38.66094, 175.91621],
  [-38.66043, 175.91519],
  [-38.65995, 175.91428],
  [-38.65937, 175.91310],
  [-38.65894, 175.91209],
  [-38.65850, 175.91112],
  [-38.65792, 175.91007],
  [-38.65712, 175.90982],
  [-38.65764, 175.90896],
  [-38.65768, 175.90776],
  [-38.65762, 175.90672],
  [-38.65817, 175.90582],
  [-38.65877, 175.90500],
  [-38.65849, 175.90398],
  [-38.65785, 175.90331],
  [-38.65701, 175.90353],
  [-38.65751, 175.90266],
  [-38.65789, 175.90169],
  [-38.65751, 175.90067],
  [-38.65710, 175.89970],
  [-38.65723, 175.89866],
  [-38.65646, 175.89822],
  [-38.65738, 175.89763],
  [-38.65745, 175.89654],
  [-38.65766, 175.89552],
  [-38.65687, 175.89588],
  [-38.65748, 175.89513],
  [-38.65778, 175.89413],
  [-38.65864, 175.89335],
  [-38.65924, 175.89234],
  [-38.65972, 175.89131],
  [-38.65951, 175.89024],
  [-38.66055, 175.88988],
  [-38.66063, 175.88868],
  [-38.66092, 175.88771],
  [-38.66069, 175.88664],
  [-38.66006, 175.88569],
  [-38.65935, 175.88492],
  [-38.65952, 175.88382],
  [-38.65928, 175.88274],
  [-38.65997, 175.88203],
  [-38.66031, 175.88099],
  [-38.66068, 175.88006],
  [-38.66121, 175.87908],
  LOOKOUT,
  [-38.66094, 175.87823],
  [-38.65997, 175.87831],
  [-38.66064, 175.87770],
  [-38.66152, 175.87723],
  [-38.66238, 175.87714],
  [-38.66249, 175.87610],
  [-38.66190, 175.87534],
  [-38.66253, 175.87463],
  [-38.66178, 175.87417],
  [-38.66219, 175.87323],
  [-38.66303, 175.87283],
  [-38.66324, 175.87183],
  [-38.66396, 175.87111],
  [-38.66478, 175.87125],
  [-38.66550, 175.87067],
  [-38.66500, 175.86975],
  [-38.66419, 175.86927],
  CAMP
];

const TILES = {
  url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  attr: "&copy; OpenStreetMap &copy; CARTO"
};

const AUCKLAND = [-36.8485, 174.7633];
const WELLINGTON = [-41.2865, 174.7762];
const CHRISTCHURCH = [-43.5321, 172.6362];
const NZ_BOUNDS = [[-34.5, 166.3], [-47.3, 178.8]];

let viewYear = 2026;
let viewMonth = 11; // December — summer
let selectedStart = null;
let selectedEnd = null;
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

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isHolidayOpen(date) {
  if (PUBLIC_HOLIDAYS.includes(iso(date))) return true;
  return SCHOOL_HOLIDAYS.some((block) => inRange(date, block.start, block.end));
}

function isUnavailable(date) {
  if (startOfDay(date) < startOfDay(new Date())) return true;
  return !isHolidayOpen(date);
}

function accentColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c45c26";
}

function swapTiles() {
  if (tileLayer) map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(TILES.url, { attribution: TILES.attr, maxZoom: 18 }).addTo(map);
  if (trackLine) trackLine.setStyle({ color: accentColor() });
  if (markers.length) {
    markers.forEach((m) => map.removeLayer(m));
    markers = [];
    addPins();
  }
}

function monthHasAvailable(monthIndex, year) {
  const days = new Date(year, monthIndex + 1, 0).getDate();
  for (let day = 1; day <= days; day += 1) {
    if (!isUnavailable(new Date(year, monthIndex, day))) return true;
  }
  return false;
}

function renderSeason() {
  const wrap = document.getElementById("season-strip");
  wrap.innerHTML = "";
  const start = new Date(2026, 7, 1); // August 2026
  for (let i = 0; i < 12; i += 1) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const btn = document.createElement("button");
    btn.className = monthHasAvailable(d.getMonth(), d.getFullYear()) ? "on" : "off";
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
  const a = start instanceof Date ? start : parseDay(start);
  const b = end instanceof Date ? end : parseDay(end);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  if (iso(a) === iso(b)) {
    return `${a.getDate()} ${MONTHS_LONG[a.getMonth()]} ${a.getFullYear()}`;
  }
  if (sameMonth) {
    return `${a.getDate()}–${b.getDate()} ${MONTHS_LONG[a.getMonth()]} ${a.getFullYear()}`;
  }
  return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
}

function isSelected(date) {
  if (!selectedStart) return false;
  const t = startOfDay(date).getTime();
  const a = startOfDay(selectedStart).getTime();
  const b = startOfDay(selectedEnd || selectedStart).getTime();
  return t >= Math.min(a, b) && t <= Math.max(a, b);
}

function rangeIsOpen(start, end) {
  const from = startOfDay(start);
  const to = startOfDay(end);
  const first = from < to ? from : to;
  const last = from < to ? to : from;
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    if (isUnavailable(d)) return false;
  }
  return true;
}

const TRIP_NIGHTS = 2;

function addDays(date, n) {
  const d = startOfDay(date);
  d.setDate(d.getDate() + n);
  return d;
}

function tripEndFrom(start) {
  return addDays(start, TRIP_NIGHTS);
}

function nightsHeld(start, end) {
  const a = startOfDay(start).getTime();
  const b = startOfDay(end).getTime();
  return Math.round(Math.abs(b - a) / 86400000);
}

function tripFitsStay(start, end) {
  return nightsHeld(start, end) === TRIP_NIGHTS;
}

function canStartTrip(date) {
  if (isUnavailable(date)) return false;
  return rangeIsOpen(date, tripEndFrom(date));
}

function holdDates() {
  const field = document.getElementById("dates-field");
  const hint = document.getElementById("cal-hint");
  if (!selectedStart || !selectedEnd) {
    field.value = "";
    hint.textContent = "Tap a day to hold two nights from that morning.";
    return;
  }
  const label = formatRange(selectedStart, selectedEnd);
  field.value = label;
  hint.textContent = `${label} held on your enquiry.`;
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

    if (isUnavailable(date)) {
      btn.classList.add("unavailable");
      btn.title = "Unavailable";
      btn.disabled = true;
    } else if (!canStartTrip(date)) {
      btn.classList.add("available");
      btn.title = "A two-night trip from this day hits unavailable dates";
      btn.disabled = true;
      if (isSelected(date)) btn.classList.add("selected");
    } else {
      btn.classList.add("available");
      btn.title = "Available";
      if (isSelected(date)) btn.classList.add("selected");
      btn.addEventListener("click", () => selectDay(date));
    }

    root.appendChild(btn);
  }
}

function selectDay(date) {
  const picked = startOfDay(date);
  const end = tripEndFrom(picked);
  if (selectedStart && iso(picked) === iso(selectedStart)) {
    selectedStart = null;
    selectedEnd = null;
  } else if (!rangeIsOpen(picked, end)) {
    selectedStart = null;
    selectedEnd = null;
    renderCalendar();
    holdDates();
    document.getElementById("cal-hint").textContent =
      "That two-night stay includes unavailable days. Pick another start.";
    return;
  } else {
    selectedStart = picked;
    selectedEnd = end;
  }

  holdDates();
  renderCalendar();
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
    L.marker(KINLOCH, { icon: pinIcon("A") }).addTo(map).bindPopup("<strong>Kinloch</strong><br>Carpark by Little Harbour. Café at the finish."),
    L.marker(CAMP, { icon: pinIcon("B") }).addTo(map).bindPopup("<strong>Kawakawa camp</strong><br>Tents, swim, Jim’s kitchen."),
    L.marker(LOOKOUT, { icon: pinIcon("C") }).addTo(map).bindPopup("<strong>Codger’s Rock</strong><br>Lookout on the K2K walk in.")
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

function swapNzTiles() {
  if (tileLayerNz) mapNz.removeLayer(tileLayerNz);
  tileLayerNz = L.tileLayer(TILES.url, { attribution: TILES.attr, maxZoom: 18 }).addTo(mapNz);
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

  swapTiles();

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

  swapNzTiles();
  addNzPins();
  setTimeout(() => mapNz.invalidateSize(), 300);
}

function goHome(event) {
  event.preventDefault();
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initNav() {
  document.querySelectorAll("a.brand, a.nav-home").forEach((link) => {
    link.addEventListener("click", goHome);
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
    if (!selectedStart || !selectedEnd || !rangeIsOpen(selectedStart, selectedEnd) || !tripFitsStay(selectedStart, selectedEnd)) {
      status.hidden = false;
      status.textContent = "Pick two nights of open dates from the calendar.";
      return;
    }
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Dates: ${data.dates || "flexible"}`,
      `Party: ${data.party}`,
      `Airport pick-up: ${data.pickup}`,
      `Goal: ${data.goal}`,
      "",
      data.note || ""
    ].join("\n");
    const subject = data.dates
      ? `Kawakawa Bay enquiry — ${data.dates}`
      : "Kawakawa Bay enquiry";
    const mailto = `mailto:jameshagger388@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.hidden = false;
    status.textContent = "Opening your email to Jim — if nothing pops, write jameshagger388@gmail.com.";
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

initNav();
renderSeason();
renderCalendar();
initCalNav();
initForm();
initLightbox();
initMap();
