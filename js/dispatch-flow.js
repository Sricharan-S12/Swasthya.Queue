/**
 * Dispatch & Referral Flow Controller — Hospital Bed Reservation, 108 Ambulance Dispatch & Leaflet OpenStreetMap
 */

let selHospId = 'hc1';

export function selHosp(id, name) {
  document.querySelectorAll('.h-card').forEach(c => c.classList.remove('sel'));
  const card = document.getElementById(id);
  if (card) card.classList.add('sel');

  ['hc1', 'hc2', 'hc3'].forEach(h => {
    const det = document.getElementById(h + '-detail');
    if (det) det.style.display = h === id ? 'block' : 'none';
  });

  selHospId = id;
  const mmTo = document.getElementById('mm-to');
  if (mmTo) mmTo.textContent = name;
}

export function dispatchAmbu(n) {
  const btn = document.getElementById('a' + n + '-btn');
  if (btn) {
    btn.textContent = 'Dispatched ✓';
    btn.classList.add('done');
    btn.disabled = true;
  }
  
  const mmAmbu = document.getElementById('mm-ambu');
  if (mmAmbu) {
    mmAmbu.textContent = n === 1 ? 'AMB-BW04 (ETA 4 min)' : 'AMB-BW07 (ETA 18 min)';
  }

  const dot = document.getElementById('tl-ambu-dot');
  const lbl = document.getElementById('tl-ambu-lbl');
  const time = document.getElementById('tl-ambu-time');

  if (dot) dot.className = 'tl-d tl-done-d';
  if (lbl) lbl.textContent = 'Ambulance dispatched — AMB-108-BW0' + [null, '4', '7'][n];
  if (time) time.textContent = 'Just now';
}

export function confirmBed(name) {
  const mmBed = document.getElementById('mm-bed');
  if (mmBed) mmBed.textContent = 'Reserved · ' + name;

  const dot = document.getElementById('tl-bed-dot');
  const lbl = document.getElementById('tl-bed-lbl');
  const time = document.getElementById('tl-bed-time');

  if (dot) dot.className = 'tl-d tl-done-d';
  if (lbl) lbl.textContent = 'Bed reserved — ' + name;
  if (time) time.textContent = 'Just now · Auto-confirmed';
}

export function sendReferral() {
  const el = document.getElementById('ref-status');
  if (el) {
    el.textContent = 'Sent ✓';
    el.className = 'pill pill-green';
  }

  const dot = document.getElementById('tl-ref-dot');
  const lbl = document.getElementById('tl-ref-lbl');
  const time = document.getElementById('tl-ref-time');

  if (dot) dot.className = 'tl-d tl-done-d';
  if (lbl) lbl.textContent = 'Referral sent — hospital notified';
  if (time) time.textContent = 'Just now · SMS + eReferral';
}

export function triggerFull() {
  dispatchAmbu(1);
  setTimeout(() => confirmBed('District Hospital Barwani'), 300);
  setTimeout(() => sendReferral(), 600);
}

export function triggerAmbuOnly() {
  dispatchAmbu(1);
}

export function triggerNotify() {
  sendReferral();
}

export function editMsg() {
  const m = document.getElementById('ref-msg');
  if (m) {
    m.contentEditable = 'true';
    m.focus();
    m.style.borderLeftColor = 'var(--purple)';
  }
}

export function initMap() {
  const mapElem = document.getElementById('osm-map');
  if (!mapElem || typeof L === 'undefined') return;

  var map = L.map('osm-map').setView([22.033, 74.91], 13);
  window.osmMap = map;
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var phcIcon = L.divIcon({
    className: '',
    html: '<div style="background:#C0392B; width:14px; height:14px; border-radius:50%; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.5);"></div>',
    iconSize: [14, 14]
  });

  var hospIcon = L.divIcon({
    className: '',
    html: '<div style="background:#2980B9; width:14px; height:14px; border-radius:50%; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.5);"></div>',
    iconSize: [14, 14]
  });

  var ambuIcon = L.divIcon({
    className: '',
    html: '<div style="font-size:20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🚑</div>',
    iconSize: [20, 20]
  });

  L.marker([22.035, 74.90], { icon: phcIcon }).addTo(map).bindPopup('<b>PHC Barwani</b><br>Currently full.');
  L.marker([22.030, 74.93], { icon: hospIcon }).addTo(map).bindPopup('<b>District Hospital Barwani</b><br>ICU Beds: 4 Available');

  var ambu = L.marker([22.034, 74.905], { icon: ambuIcon, zIndexOffset: 1000 }).addTo(map).bindPopup('<b>AMB-108-BW04</b><br>ETA 4 min');

  setInterval(() => {
    let latlng = ambu.getLatLng();
    let newLat = latlng.lat - 0.00005;
    let newLng = latlng.lng + 0.00015;
    if (newLng > 74.93) {
      newLng = 74.905;
      newLat = 22.034;
    }
    ambu.setLatLng([newLat, newLng]);
  }, 1000);
}
