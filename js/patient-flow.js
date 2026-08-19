/**
 * Patient Flow Controller — Web Triage Wizard, USSD Keypad State Machine, and SMS Chatbot Simulator
 */

import { SYMPTOMS_LIST, SYMPTOM_ICONS, USSD_TEXTS } from './config.js';
import { APIService } from './api.js';
import { Toast } from './toast.js';
import { VoiceInput } from './voice-input.js';

let currentSyms = new Set();
let currentSev = 3;

/* USSD State Machine Data */
const ussdState = { buffer: '', step: 0, lang: 'en', error: null };

/* SMS Flow Data */
const smsFlow = [
  { trigger: 'yes', resp: "Great! What is the patient's age?" },
  { trigger: '*', resp: "Does the patient have fever, chest pain, or trauma? Please list symptoms." },
  { trigger: '*', resp: "Noted. On a scale of 1-5, how severe is the pain/discomfort?" },
  { trigger: '*', resp: "✅ Registration complete. Token: P-404. Priority: MEDIUM. Wait time: ~15 mins. We will notify you when it's your turn. The doctor will review your case shortly." }
];
let smsStep = 0;

export function initPatientFlow(loadQueueFn) {
  const cont = document.getElementById('sym-container');
  if (cont) {
    cont.innerHTML = '';
    SYMPTOMS_LIST.forEach(s => {
      const btn = document.createElement('div');
      btn.className = 'sym-btn';
      btn.innerHTML = `<span style="font-size:18px;">${SYMPTOM_ICONS[s] || '🩺'}</span> ${s}`;
      btn.onclick = () => {
        if (currentSyms.has(s)) {
          currentSyms.delete(s);
          btn.classList.remove('active');
        } else {
          currentSyms.add(s);
          btn.classList.add('active');
        }
      };
      cont.appendChild(btn);
    });
  }
}

export function startVoiceDictation(targetId, btnId) {
  const langSel = document.getElementById('f-lang')?.value || 'hi';
  const speechLang = langSel === 'hi' ? 'hi-IN' : 'en-IN';
  VoiceInput.startListening(targetId, btnId, speechLang);
}

export function selectMode(m, el) {
  document.querySelectorAll('.access-card').forEach(c => c.classList.remove('selected'));
  if (el) el.classList.add('selected');

  document.getElementById('flow-web').style.display = 'none';
  document.getElementById('flow-ussd').style.display = 'none';
  document.getElementById('flow-sms').style.display = 'none';
  document.getElementById('flow-result').style.display = 'none';

  const target = document.getElementById(`flow-${m}`);
  if (target) target.style.display = 'block';
}

export function setSeverity(val, el) {
  currentSev = val;
  document.querySelectorAll('.sev-item').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
}

export function nextStep() {
  document.getElementById('reg-step-1').style.display = 'none';
  document.getElementById('reg-step-2').style.display = 'block';
}

export function prevStep() {
  document.getElementById('reg-step-2').style.display = 'none';
  document.getElementById('reg-step-1').style.display = 'block';
}

export async function submitTriage() {
  const btn = document.getElementById('btn-submit-triage');
  if (btn) btn.classList.add('loading');

  const data = {
    name: document.getElementById('f-name').value || 'Unk',
    age: parseInt(document.getElementById('f-age').value) || 30,
    syms: Array.from(currentSyms),
    sev: currentSev
  };

  try {
    const ticket = await APIService.submitTriage(data);

    document.getElementById('reg-step-2').style.display = 'none';
    document.getElementById('flow-result').style.display = 'block';

    document.getElementById('tk-no').textContent = ticket.id;
    document.getElementById('tk-name').textContent = ticket.name + ' • ' + ticket.age + 'y';
    document.getElementById('tk-score').textContent = ticket.score + ' / 20';
    document.getElementById('tk-prio').textContent = ticket.priority;
    document.getElementById('tk-time').textContent = ticket.time;
    document.getElementById('tk-wait').textContent = ticket.wait;

    const head = document.getElementById('tk-head');
    const wBox = document.getElementById('tk-wait-box');

    if (ticket.priority === 'RED') {
      head.style.background = 'var(--red-gradient)';
      document.getElementById('tk-no').style.color = '#FFF';
      wBox.style.background = 'var(--red-light)';
      document.getElementById('tk-wait').style.color = 'var(--red-dark)';
      Toast.show("🚨 CRITICAL PATIENT TRIAGED", `Priority RED token ${ticket.id} issued for ${ticket.name}. Alerting Command Center.`, "critical", 6000);
    } else if (ticket.priority === 'ORANGE') {
      head.style.background = 'var(--orange)';
      document.getElementById('tk-no').style.color = '#FFF';
      wBox.style.background = 'var(--orange-light)';
      document.getElementById('tk-wait').style.color = 'var(--orange-dark)';
      Toast.show("Urgent Triage Complete", `Token ${ticket.id} generated. Wait time: ~15m.`, "info");
    } else {
      head.style.background = 'var(--primary-gradient)';
      document.getElementById('tk-no').style.color = '#FFF';
      wBox.style.background = 'var(--primary-light)';
      document.getElementById('tk-wait').style.color = 'var(--primary-dark)';
      Toast.show("Triage Completed", `Routine Token ${ticket.id} issued successfully.`, "success");
    }
  } catch (e) {
    console.error(e);
  } finally {
    if (btn) btn.classList.remove('loading');
  }
}

export function resetForm() {
  const form = document.getElementById('form-details');
  if (form) form.reset();
  currentSyms.clear();
  document.querySelectorAll('.sym-btn').forEach(b => b.classList.remove('active'));
  const defaultSev = document.querySelectorAll('.sev-item')[2];
  if (defaultSev) setSeverity(3, defaultSev);
  document.getElementById('flow-result').style.display = 'none';
  document.getElementById('reg-step-1').style.display = 'block';
}

/* USSD Functions */
export function ussdInput(char) {
  ussdState.buffer += char;
  renderUssdScreen();
}

export function renderUssdScreen() {
  const scr = document.getElementById('ussd-screen');
  if (!scr) return;
  let display = "";

  if (ussdState.error) {
    display += `[!] ${ussdState.error}\n\n`;
  }

  if (ussdState.step === 0 && !ussdState.buffer.includes('*599#') && !ussdState.error) {
    display += `Menu:\nType *599# and press Send.\n\n${ussdState.buffer}_`;
  } else if (ussdState.step === 0) {
    display += `Type *599# and press Send.\n\n${ussdState.buffer}_`;
  } else if (ussdState.step === 1) {
    display += `Language:\n1. Eng 2. हिंदी 3. தமிழ்\n4. తెలుగు 5. ಕನ್ನಡ\n\nInput: ${ussdState.buffer}_`;
  } else if (ussdState.step === 2) {
    display += `${USSD_TEXTS[ussdState.lang].welcome}\n\nInput: ${ussdState.buffer}_`;
  } else if (ussdState.step === 3) {
    display += `${USSD_TEXTS[ussdState.lang].age}\n\nInput: ${ussdState.buffer}_`;
  } else if (ussdState.step === 4) {
    display += `${USSD_TEXTS[ussdState.lang].syms}\n\nInput: ${ussdState.buffer}_`;
  } else if (ussdState.step === 5) {
    display += USSD_TEXTS[ussdState.lang].done;
  } else if (ussdState.step === 6) {
    display += USSD_TEXTS[ussdState.lang].status;
  } else if (ussdState.step === 7) {
    display += USSD_TEXTS[ussdState.lang].emergency;
  }

  scr.innerText = display;
}

export async function ussdSend(loadQueueFn) {
  let isValidInput = true;

  if (ussdState.step === 0) {
    if (ussdState.buffer === '*599#') {
      ussdState.step = 1;
      ussdState.buffer = '';
    } else {
      isValidInput = false;
    }
  } else if (ussdState.step === 1) {
    if (/^[1-5]$/.test(ussdState.buffer)) {
      const langMap = { '1': 'en', '2': 'hi', '3': 'ta', '4': 'te', '5': 'kn' };
      ussdState.lang = langMap[ussdState.buffer];
      ussdState.step = 2;
      ussdState.buffer = '';
    } else {
      isValidInput = false;
    }
  } else if (ussdState.step === 2) {
    if (ussdState.buffer === '1') {
      ussdState.step = 3;
      ussdState.buffer = '';
    } else if (ussdState.buffer === '2') {
      ussdState.step = 6;
      ussdState.buffer = '';
    } else if (ussdState.buffer === '3') {
      ussdState.step = 7;
      ussdState.buffer = '';
    } else {
      isValidInput = false;
    }
  } else if (ussdState.step === 3) {
    if (ussdState.buffer.length > 0 && !isNaN(ussdState.buffer)) {
      ussdState.step = 4;
      ussdState.buffer = '';
    } else {
      isValidInput = false;
    }
  } else if (ussdState.step === 4) {
    if (ussdState.buffer === '1' || ussdState.buffer === '2') {
      ussdState.step = 5;
      const severityInput = ussdState.buffer;
      ussdState.buffer = '';
      await APIService.submitTriage({
        name: "USSD User",
        age: 50,
        syms: severityInput === '1' ? ["Chest pain"] : ["Fever"],
        sev: 4
      });
      if (loadQueueFn) loadQueueFn();
      Toast.show("USSD Triage Completed", "Token P-812 issued via USSD network.", "success");
    } else {
      isValidInput = false;
    }
  }

  if (!isValidInput) {
    ussdState.error = "Invalid Input. Try again.";
    ussdState.buffer = '';
  } else {
    ussdState.error = null;
  }

  renderUssdScreen();
  ussdState.error = null;
}

/* SMS Functions */
export async function sendSMS(loadQueueFn) {
  const inp = document.getElementById('chat-input');
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) return;

  const body = document.getElementById('chat-body');
  if (body) {
    body.innerHTML += `<div class="chat-bubble chat-right">${val}</div>`;
    inp.value = '';
    body.scrollTop = body.scrollHeight;
  }

  setTimeout(async () => {
    let msg = "I didn't understand that.";
    if (smsStep < smsFlow.length) {
      msg = smsFlow[smsStep].resp;
      if (smsStep === smsFlow.length - 1) {
        await APIService.submitTriage({ name: "SMS User", age: 30, syms: ["Fever"], sev: 3 });
        if (loadQueueFn) loadQueueFn();
        Toast.show("SMS Triage Completed", "Token P-404 issued via WhatsApp bot.", "success");
      }
      smsStep++;
    }
    if (body) {
      body.innerHTML += `<div class="chat-bubble chat-left">${msg}</div>`;
      body.scrollTop = body.scrollHeight;
    }
  }, 1000);
}
