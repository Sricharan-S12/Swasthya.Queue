/**
 * Doctor Flow Controller — Queue Renderer, Vitals Sparklines, Tele-Prescription & Messaging Modals
 */

import { APIService } from './api.js';
import { Prescription } from './prescription.js';
import { exportReferralPDF } from './pdf-exporter.js';

export async function loadQueue(switchTabFn) {
  const qCont = document.getElementById('doctor-queue');
  if (!qCont) return;

  qCont.innerHTML = '<div style="text-align:center; padding: 40px; color:var(--text-muted);">Syncing live datastream...</div>';

  const qData = await APIService.getQueue();
  qCont.innerHTML = '';

  qData.forEach(p => {
    const cColor = p.priority === 'RED' ? 'red' : p.priority === 'ORANGE' ? 'orange' : 'primary';
    const init = p.name.substring(0, 2).toUpperCase();

    const html = `
      <div class="q-card" onclick="this.classList.toggle('expanded')">
        <div class="q-main">
          <div class="q-indicator" style="background: var(--${cColor});"></div>
          <div class="q-avatar" style="background: var(--${cColor}-light); color: var(--${cColor}-dark);">${init}</div>
          <div class="q-details">
            <div class="q-name">${p.name} <span class="pill pill-${p.priority === 'RED' ? 'red' : p.priority === 'ORANGE' ? 'orange' : 'green'}">${p.priority}</span></div>
            <div class="q-meta">${p.age}y • ${p.syms.join(', ')} • Arrived ${p.time}</div>
          </div>
          <div class="q-status">
            <div class="q-score" style="color: var(--${cColor}-dark);">${p.score}</div>
            <div class="q-wait">Wait: ${p.wait}</div>
          </div>
        </div>
        
        <div class="q-brief">
          <!-- Interactive Vitals Grid with SVG Sparklines -->
          <div class="vitals-grid">
            <div class="vital-box">
              <div class="vital-val val-danger">160/100</div>
              <div class="vital-lbl">BP (mmHg)</div>
              <svg width="100%" height="20" viewBox="0 0 100 20" style="margin-top:4px;">
                <path d="M0,15 L20,12 L40,18 L60,8 L80,14 L100,5" fill="none" stroke="#E11D48" stroke-width="2"/>
              </svg>
            </div>
            <div class="vital-box">
              <div class="vital-val val-danger">91%</div>
              <div class="vital-lbl">SpO₂</div>
              <svg width="100%" height="20" viewBox="0 0 100 20" style="margin-top:4px;">
                <path d="M0,8 L20,6 L40,10 L60,15 L80,14 L100,18" fill="none" stroke="#E11D48" stroke-width="2"/>
              </svg>
            </div>
            <div class="vital-box">
              <div class="vital-val val-warn">112</div>
              <div class="vital-lbl">Heart Rate</div>
              <svg width="100%" height="20" viewBox="0 0 100 20" style="margin-top:4px;">
                <path d="M0,10 L15,10 L20,2 L25,18 L30,10 L100,10" fill="none" stroke="#D97706" stroke-width="2"/>
              </svg>
            </div>
            <div class="vital-box">
              <div class="vital-val val-ok">98.2°F</div>
              <div class="vital-lbl">TEMP</div>
              <svg width="100%" height="20" viewBox="0 0 100 20" style="margin-top:4px;">
                <path d="M0,10 L20,10 L40,11 L60,9 L80,10 L100,10" fill="none" stroke="#0D9488" stroke-width="2"/>
              </svg>
            </div>
          </div>

          <div class="ai-summary">
            <p>✨ <b>AI Clinical Summary:</b> Patient presenting with acute chest discomfort and breathlessness starting recently. SpO2 critical and BP hypertensive. High likelihood of ACS. Immediate medical intervention advised.</p>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.startVideoCall('${p.name}')">🎥 Tele-Consultation</button>
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); window.openPrescriptionBuilder('${p.name}')">💊 Write e-Rx</button>
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); window.openMessageModal('${p.name}')">💬 Message Patient</button>
            <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); window.switchTab('dispatch')">🚨 Refer & Dispatch</button>
          </div>
        </div>
      </div>
    `;
    qCont.innerHTML += html;
  });
}

export function openPrescriptionBuilder(patientName) {
  Prescription.openBuilder(patientName);
}

export function closePrescriptionBuilder() {
  Prescription.closeBuilder();
}

export function addMedicationRow() {
  Prescription.addMedicationRow();
}

export function issuePrescription() {
  Prescription.issuePrescription();
}

export function exportPDF() {
  exportReferralPDF();
}

export function startVideoCall(patientName) {
  const modalName = document.getElementById('video-patient-name');
  const statusTxt = document.getElementById('video-status-text');
  const modal = document.getElementById('video-call-modal');

  if (modalName) modalName.innerText = "Connected to " + patientName;
  if (statusTxt) statusTxt.innerText = "Establishing E2E Connection to " + patientName + "...";
  if (modal) modal.classList.add('active');
}

export function endVideoCall() {
  const modal = document.getElementById('video-call-modal');
  if (modal) modal.classList.remove('active');
}

export function openMessageModal(patientName) {
  const modalName = document.getElementById('msg-patient-name');
  const modal = document.getElementById('message-modal');

  if (modalName) modalName.innerText = patientName;
  if (modal) modal.classList.add('active');
}

export function closeMessageModal() {
  const modal = document.getElementById('message-modal');
  if (modal) modal.classList.remove('active');
}

export function sendMessage() {
  const input = document.getElementById('msg-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const body = document.getElementById('msg-body');
  if (body) {
    const bounceStr = `<div class="chat-bubble chat-right">${text}</div>`;
    body.insertAdjacentHTML('beforeend', bounceStr);
    input.value = '';

    setTimeout(() => {
      const reply = `<div class="chat-bubble chat-left" style="background: var(--surface);">Dr. Sharma, the patient is ready to proceed.</div>`;
      body.insertAdjacentHTML('beforeend', reply);
      body.scrollTop = body.scrollHeight;
    }, 1000);

    body.scrollTop = body.scrollHeight;
  }
}
