/**
 * APIService Engine — Simulates backend API, START Triage algorithm, and data store
 */
class APIServiceEngine {
  constructor() {
    this.patients = [];
  }

  async delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async submitTriage(data) {
    await this.delay(1200); // Simulate ML inference + network latency

    let score = 0;
    const critSyms = ['Chest pain', 'Breathlessness', 'Seizure'];
    const modSyms = ['Fever', 'Headache', 'Injury'];

    data.syms.forEach(s => {
      if (critSyms.includes(s)) score += 4;
      else if (modSyms.includes(s)) score += 2;
      else score += 1;
    });

    score += data.sev;
    if (data.age > 60 || data.age < 5) score = Math.floor(score * 1.5);

    let priority = 'GREEN';
    if (score >= 8) priority = 'RED';
    else if (score >= 4) priority = 'ORANGE';

    const token = 'P-' + Math.floor(100 + Math.random() * 900);

    const newPatient = {
      id: token,
      name: data.name,
      age: data.age,
      priority: priority,
      score: score,
      syms: data.syms,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      wait: priority === 'RED' ? '2m' : priority === 'ORANGE' ? '15m' : '40m'
    };

    this.patients.push(newPatient);
    this.patients.sort((a, b) => b.score - a.score); // Dynamic priority sorting

    return newPatient;
  }

  async getQueue() {
    return [
      { id: 'P-042', name: 'Ramesh Kumar', age: 62, priority: 'RED', score: 12, syms: ['Chest pain', 'Breathlessness'], time: '10:30 AM', wait: '0m' },
      { id: 'P-101', name: 'Savita Devi', age: 35, priority: 'RED', score: 9, syms: ['Seizure', 'Headache'], time: '10:15 AM', wait: '5m' },
      { id: 'P-212', name: 'Mohanlal', age: 55, priority: 'ORANGE', score: 6, syms: ['Fever', 'Abdominal pain'], time: '09:40 AM', wait: '12m' },
      { id: 'P-088', name: 'Kamla Bai', age: 70, priority: 'ORANGE', score: 5, syms: ['Cold', 'Body ache'], time: '09:20 AM', wait: '25m' },
      ...this.patients
    ].sort((a, b) => b.score - a.score);
  }

  async triggerReferralSync() {
    await this.delay(1500); // Simulate 3-way API sync (Ambulance + Hospital + eSanjeevani)
    return true;
  }
}

export const APIService = new APIServiceEngine();
