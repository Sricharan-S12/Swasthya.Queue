/**
 * Digital Tele-Prescription Builder Module
 */

import { Toast } from './toast.js';

class PrescriptionEngine {
  constructor() {
    this.prescriptions = new Map();
  }

  openBuilder(patientName) {
    const modal = document.getElementById('rx-modal');
    const pName = document.getElementById('rx-patient-name');
    if (pName) pName.innerText = `Write e-Prescription — ${patientName}`;
    if (modal) modal.classList.add('active');
  }

  closeBuilder() {
    const modal = document.getElementById('rx-modal');
    if (modal) modal.classList.remove('active');
  }

  addMedicationRow() {
    const container = document.getElementById('rx-med-list');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'grid-3 rx-med-row';
    row.style.cssText = 'gap: 8px; margin-bottom: 8px; align-items: center;';
    row.innerHTML = `
      <input type="text" class="input-field rx-med-name" placeholder="Medication (e.g. Paracetamol 500mg)" required>
      <input type="text" class="input-field rx-med-dose" placeholder="Dosage (1-0-1 after food)" required>
      <div style="display:flex; gap:6px;">
        <input type="text" class="input-field rx-med-dur" placeholder="Duration (5 days)">
        <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.parentElement.remove()" style="padding: 0 10px;">✕</button>
      </div>
    `;
    container.appendChild(row);
  }

  issuePrescription() {
    const pName = document.getElementById('rx-patient-name')?.innerText || 'Patient';
    const notes = document.getElementById('rx-notes')?.value || 'Take rest and drink plenty of warm water.';

    const rows = document.querySelectorAll('.rx-med-row');
    const meds = [];
    rows.forEach(r => {
      const name = r.querySelector('.rx-med-name')?.value;
      const dose = r.querySelector('.rx-med-dose')?.value;
      const dur = r.querySelector('.rx-med-dur')?.value;
      if (name) meds.push({ name, dose, dur });
    });

    if (meds.length === 0) {
      Toast.show("Prescription Empty", "Please add at least one medication before issuing.", "info");
      return;
    }

    const rxId = 'RX-' + Math.floor(1000 + Math.random() * 9000);
    this.prescriptions.set(pName, { rxId, meds, notes, date: new Date().toLocaleDateString() });

    Toast.show("e-Prescription Issued ✓", `Digital prescription ${rxId} sent to patient mobile & pharmacy system.`, "success");
    this.closeBuilder();
  }
}

export const Prescription = new PrescriptionEngine();
