/**
 * Role-Based Authentication & Session Controller
 */

export let currentUser = null;
let pendingTab = null;

export function openAuthModal(targetTab, requiredRole) {
  pendingTab = targetTab;
  const modal = document.getElementById('auth-modal');
  const prompt = document.getElementById('auth-prompt');
  
  if (modal) modal.classList.add('active');
  if (prompt) {
    prompt.innerText = targetTab === 'doctor' 
      ? "Please sign in as Doctor to view Dashboard" 
      : "Please sign in as Dispatch Admin to access Command Center";
  }
  setTimeout(() => {
    const userInp = document.getElementById('auth-user');
    if (userInp) userInp.focus();
  }, 100);
}

export function cancelLogin() {
  const modal = document.getElementById('auth-modal');
  const err = document.getElementById('auth-error');
  const form = document.getElementById('auth-form');

  if (modal) modal.classList.remove('active');
  if (err) err.style.display = 'none';
  if (form) form.reset();
}

export function togglePasswordVisibility() {
  const passwordInput = document.getElementById('auth-pass');
  const eyeIcon = document.getElementById('eye-icon');
  const eyeOffIcon = document.getElementById('eye-off-icon');

  if (passwordInput && eyeIcon && eyeOffIcon) {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.style.display = 'none';
      eyeOffIcon.style.display = 'block';
    } else {
      passwordInput.type = 'password';
      eyeIcon.style.display = 'block';
      eyeOffIcon.style.display = 'none';
    }
  }
}

export function handleLogin(switchTabFn) {
  const u = document.getElementById('auth-user').value.trim();
  const p = document.getElementById('auth-pass').value;
  const err = document.getElementById('auth-error');

  if (err) err.style.display = 'none';

  if (pendingTab === 'doctor' && u === 'doctor' && p === 'doctor123') {
    currentUser = { username: u, role: 'doctor', fullName: 'Dr. Sharma' };
  } else if (pendingTab === 'dispatch' && u === 'admin' && p === 'admin123') {
    currentUser = { username: u, role: 'admin', fullName: 'Dispatch Supervisor' };
  } else {
    if (err) {
      err.style.display = 'block';
      err.innerText = "Invalid credentials for requested module.";
    }
    return;
  }

  const userInfo = document.getElementById('user-info');
  const userNameDisp = document.getElementById('user-name-display');

  if (userInfo) userInfo.style.display = 'flex';
  if (userNameDisp) userNameDisp.innerText = currentUser.fullName;

  if (pendingTab === 'doctor') {
    document.getElementById('main-nav').style.display = 'block';
    document.getElementById('tab-patient').style.display = 'none';
    document.getElementById('tab-dispatch').style.display = 'none';
    document.getElementById('tab-about').style.display = 'inline-flex';
    document.getElementById('tab-doctor').style.display = 'inline-flex';
  }

  cancelLogin();
  if (switchTabFn && pendingTab) switchTabFn(pendingTab);
}

export function handleLogout(switchTabFn) {
  currentUser = null;
  const userInfo = document.getElementById('user-info');
  if (userInfo) userInfo.style.display = 'none';
  if (switchTabFn) switchTabFn('landing');
}
