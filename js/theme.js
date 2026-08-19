/**
 * Theme & Connectivity Controller — Dark Mode & Offline Status Handler
 */

export function initThemeController() {
  const darkModeBtn = document.getElementById("darkModeToggle");

  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.innerHTML = "☀️ Light Mode";
      } else {
        darkModeBtn.innerHTML = "🌙 Dark Mode";
      }
    });
  }

  function updateOnlineStatus() {
    const status = document.getElementById("offline-status");
    if (!status) return;

    if (navigator.onLine) {
      status.textContent = "🟢 Online";
    } else {
      status.textContent = "🔴 Offline Mode";
    }
  }

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();
}
