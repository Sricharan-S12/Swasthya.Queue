/**
 * Printable PDF Referral Slip Exporter Module
 */

import { Toast } from './toast.js';

export function exportReferralPDF() {
  const patientName = "Ramesh Kumar";
  const token = "P-007";
  const hosp = document.getElementById('mm-to')?.textContent || "District Hospital Barwani";
  const ambu = document.getElementById('mm-ambu')?.textContent || "AMB-108-BW04";
  const msg = document.getElementById('ref-msg')?.innerText || "Critical cardiac emergency referral.";

  const printWin = window.open('', '_blank', 'width=800,height=900');
  if (!printWin) {
    Toast.show("Popup Blocked", "Please allow popup windows to open official referral slip.", "info");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Referral Slip — PHC Barwani (${token})</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1E293B; background: #fff; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px double #0D9488; padding-bottom: 20px; margin-bottom: 30px; }
        .govt-logo { font-size: 28px; font-weight: 800; color: #0F766E; text-transform: uppercase; letter-spacing: -0.5px; }
        .govt-sub { font-size: 12px; color: #64748B; font-weight: 600; text-transform: uppercase; }
        .badge-red { background: #FFE4E6; color: #BE123C; font-weight: 800; padding: 6px 16px; border-radius: 20px; font-size: 14px; display: inline-block; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 8px; }
        .box-title { font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; margin-bottom: 6px; }
        .box-val { font-size: 16px; font-weight: 700; color: #0F172A; }
        .vitals-bar { display: flex; justify-content: space-between; background: #EEF2FF; border-left: 4px solid #6366F1; padding: 16px; border-radius: 6px; margin-bottom: 30px; }
        .vital-item { text-align: center; }
        .vital-num { font-size: 18px; font-weight: 800; color: #3730A3; }
        .vital-lbl { font-size: 10px; text-transform: uppercase; color: #4338CA; font-weight: 700; }
        .notice-pre { background: #F1F5F9; border: 1px solid #CBD5E1; padding: 16px; font-family: monospace; font-size: 12px; border-radius: 6px; white-space: pre-wrap; margin-bottom: 40px; }
        .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #E2E8F0; padding-top: 20px; font-size: 12px; color: #64748B; }
        .stamp-box { border: 2px dashed #0D9488; color: #0D9488; padding: 12px 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; border-radius: 8px; text-align: center; display: inline-block; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="govt-sub">National Health Mission · Madhya Pradesh</div>
          <div class="govt-logo">Primary Health Centre Barwani</div>
          <div style="font-size:13px; font-weight:600; color:#0D9488; margin-top:4px;">OFFICIAL EMERGENCY REFERRAL SLIP</div>
        </div>
        <div style="text-align:right;">
          <span class="badge-red">🔴 RED CRITICAL</span>
          <div style="font-size:12px; color:#64748B; margin-top:6px;">Token: <b>${token}</b></div>
          <div style="font-size:11px; color:#94A3B8;">Date: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div class="grid">
        <div class="box">
          <div class="box-title">Patient Details</div>
          <div class="box-val">${patientName} · 62M</div>
          <div style="font-size:12px; color:#64748B;">Village Barwani · Contact Registered</div>
        </div>
        <div class="box">
          <div class="box-title">Referred Destination</div>
          <div class="box-val">${hosp}</div>
          <div style="font-size:12px; color:#0D9488;">Transport: 108 Ambulance (${ambu})</div>
        </div>
      </div>

      <div class="vitals-bar">
        <div class="vital-item"><div class="vital-num">160/100</div><div class="vital-lbl">BP (mmHg)</div></div>
        <div class="vital-item"><div class="vital-num">91%</div><div class="vital-lbl">SpO2</div></div>
        <div class="vital-item"><div class="vital-num">112</div><div class="vital-lbl">Heart Rate</div></div>
        <div class="vital-item"><div class="vital-num">11/20</div><div class="vital-lbl">Triage Score</div></div>
      </div>

      <div class="notice-pre">${msg}</div>

      <div class="footer">
        <div>
          <div class="stamp-box">✓ VERIFIED BY SWASTHYA QUEUE OS</div>
          <div style="margin-top:8px; font-size:10px;">Verification Code: SQ-REF-${Math.floor(100000 + Math.random()*900000)}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700; color:#0F172A;">Dr. A. Sharma, M.D.</div>
          <div>Medical Officer In-Charge</div>
          <div>PHC Barwani Sector</div>
        </div>
      </div>

      <div style="margin-top:30px; text-align:center;" class="no-print">
        <button onclick="window.print()" style="background:#0D9488; color:#fff; border:none; padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer; font-size:14px;">🖨️ Print / Download PDF</button>
      </div>
    </body>
    </html>
  `;

  printWin.document.write(html);
  printWin.document.close();
  Toast.show("Referral Slip Exported ✓", "Official printable PDF referral slip generated.", "success");
}
