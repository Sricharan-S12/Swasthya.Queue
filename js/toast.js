/**
 * Toast Notification & Audio Alert Engine
 */

class ToastEngine {
  constructor() {
    this.container = null;
    this.audioCtx = null;
  }

  initContainer() {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 380px;
          pointer-events: none;
        `;
        document.body.appendChild(this.container);
      }
    }
  }

  playAlertSound(type) {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'critical') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.3);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, this.audioCtx.currentTime + 0.2); // E5
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn("AudioContext playback ignored:", e);
    }
  }

  show(title, message, type = 'info', duration = 4000) {
    this.initContainer();

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.style.cssText = `
      background: ${type === 'critical' ? '#FFF1F2' : type === 'success' ? '#F0FDF4' : '#F8FAFC'};
      border-left: 4px solid ${type === 'critical' ? '#E11D48' : type === 'success' ? '#0D9488' : '#2563EB'};
      color: #0F172A;
      padding: 14px 18px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
      border-top: 1px solid rgba(226, 232, 240, 0.8);
      border-right: 1px solid rgba(226, 232, 240, 0.8);
      border-bottom: 1px solid rgba(226, 232, 240, 0.8);
      font-size: 13px;
      pointer-events: auto;
      animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transition: all 0.3s ease;
    `;

    toast.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
        <div style="font-weight:700; font-size:14px; color:${type === 'critical' ? '#BE123C' : type === 'success' ? '#0F766E' : '#1D4ED8'};">
          ${type === 'critical' ? '🚨 ' : type === 'success' ? '✅ ' : 'ℹ️ '} ${title}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="border:none; background:transparent; cursor:pointer; color:#64748B; font-size:14px;">✕</button>
      </div>
      <div style="margin-top:4px; color:#475569; font-weight:500;">${message}</div>
    `;

    this.container.appendChild(toast);
    this.playAlertSound(type);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

export const Toast = new ToastEngine();
