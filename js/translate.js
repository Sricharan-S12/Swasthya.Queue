/**
 * Multilingual Google Translate API Wrapper & Selector Controller
 */

export function changeLanguage(lang) {
  const interval = setInterval(() => {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
      clearInterval(interval);
    }
  }, 500);
}

export function initGoogleTranslate() {
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,hi,ta,te,kn',
      autoDisplay: false
    }, 'google_translate_element');
  };

  // Banner removal loop
  setInterval(() => {
    const banner = document.querySelector('.goog-te-banner-frame');
    if (banner) {
      banner.style.display = 'none';
    }
    document.body.style.top = '0px';
  }, 300);
}
