/**
 * Main Application Orchestrator & Router — Swasthya Queue High-End Release
 */

import { initThemeController } from './theme.js';
import { changeLanguage, initGoogleTranslate } from './translate.js';
import { currentUser, openAuthModal, cancelLogin, togglePasswordVisibility, handleLogin, handleLogout } from './auth.js';
import { initPatientFlow, startVoiceDictation, selectMode, setSeverity, nextStep, prevStep, submitTriage, resetForm, ussdInput, ussdSend, sendSMS } from './patient-flow.js';
import { loadQueue, openPrescriptionBuilder, closePrescriptionBuilder, addMedicationRow, issuePrescription, exportPDF, startVideoCall, endVideoCall, openMessageModal, closeMessageModal, sendMessage } from './doctor-flow.js';
import { selHosp, dispatchAmbu, confirmBed, sendReferral, triggerFull, triggerAmbuOnly, triggerNotify, editMsg, initMap } from './dispatch-flow.js';
import { Toast } from './toast.js';

// Global registrations for HTML onclick/onsubmit attributes
window.changeLanguage = changeLanguage;
window.enterPortal = enterPortal;
window.switchTab = switchTab;
window.selectMode = selectMode;
window.setSeverity = setSeverity;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitTriage = submitTriage;
window.resetForm = resetForm;
window.startVoiceDictation = startVoiceDictation;

window.ussdInput = ussdInput;
window.ussdSend = () => ussdSend(() => loadQueue(switchTab));
window.sendSMS = () => sendSMS(() => loadQueue(switchTab));

window.openAuthModal = openAuthModal;
window.cancelLogin = cancelLogin;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleLogin = () => handleLogin(switchTab);
window.handleLogout = () => handleLogout(switchTab);

window.openPrescriptionBuilder = openPrescriptionBuilder;
window.closePrescriptionBuilder = closePrescriptionBuilder;
window.addMedicationRow = addMedicationRow;
window.issuePrescription = issuePrescription;
window.exportPDF = exportPDF;

window.startVideoCall = startVideoCall;
window.endVideoCall = endVideoCall;
window.openMessageModal = openMessageModal;
window.closeMessageModal = closeMessageModal;
window.sendMessage = sendMessage;

window.selHosp = selHosp;
window.dispatchAmbu = dispatchAmbu;
window.confirmBed = confirmBed;
window.sendReferral = sendReferral;
window.triggerFull = triggerFull;
window.triggerAmbuOnly = triggerAmbuOnly;
window.triggerNotify = triggerNotify;
window.editMsg = editMsg;

export function enterPortal(type) {
  if (type === 'clinic') {
    document.getElementById('main-nav').style.display = 'block';
    document.getElementById('tab-patient').style.display = 'inline-flex';
    document.getElementById('tab-dispatch').style.display = 'inline-flex';
    document.getElementById('tab-about').style.display = 'inline-flex';
    document.getElementById('tab-doctor').style.display = 'none';
    switchTab('patient');
    Toast.show("Clinic Portal Active", "Public patient triage & command center active.", "info");
  } else if (type === 'doctor-login') {
    openAuthModal('doctor', 'doctor');
  }
}

export function switchTab(id) {
  if (id === 'landing') {
    document.getElementById('main-nav').style.display = 'none';
  }

  if (id === 'doctor') {
    if (!currentUser || currentUser.role !== 'doctor') {
      openAuthModal(id, 'doctor');
      return;
    }
  }

  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  const tabs = document.querySelectorAll('.nav-tab');
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].getAttribute('onclick') && tabs[i].getAttribute('onclick').includes(`'${id}'`)) {
      tabs[i].classList.add('active');
      break;
    }
  }

  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');

  if (id === 'doctor') loadQueue(switchTab);
  if (id === 'dispatch' && window.osmMap) {
    setTimeout(() => window.osmMap.invalidateSize(), 200);
  }
}

// Service Worker Registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => console.log("[SwasthyaQueue] Service Worker Active"))
    .catch(err => console.error("SW registration failed:", err));
}

// Application Initialization
document.addEventListener("DOMContentLoaded", () => {
  initThemeController();
  initGoogleTranslate();
  initPatientFlow(() => loadQueue(switchTab));
  initMap();
});
