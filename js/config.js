/**
 * Global Configuration & Data Constants for Swasthya Queue
 */

export const SYMPTOMS_LIST = [
  'Chest pain',
  'Breathlessness',
  'Seizure',
  'Fever',
  'Headache',
  'Vomiting',
  'Abdominal pain',
  'Cold',
  'Injury'
];

export const SYMPTOM_ICONS = {
  'Chest pain': '🫀',
  'Breathlessness': '🫁',
  'Seizure': '⚡',
  'Fever': '🌡️',
  'Headache': '🧠',
  'Vomiting': '🤢',
  'Abdominal pain': '🫃',
  'Cold': '🤧',
  'Injury': '🩹'
};

export const USSD_TEXTS = {
  en: {
    welcome: "Swasthya Queue\n1. Register Patient\n2. Status\n3. Emergency",
    age: "Age of patient?",
    syms: "Chest pain or Breathlessness?\n1. Yes\n2. No",
    done: "✅ Triage Done\nToken: P-812\nPriority: HIGH\nWait: ~5m\nDoctor will call shortly.",
    status: "📋 Status\nToken: P-812\nEst. Wait: ~15m\nPriority: NORMAL",
    emergency: "🚨 Emergency\nAlert sent to Command Center.\n108 Ambulance dispatched."
  },
  hi: {
    welcome: "स्वास्थ्य कतार\n1. नया मरीज\n2. स्थिति\n3. आपातकालीन",
    age: "मरीज की उम्र?",
    syms: "सीने में दर्द या सांस लेने में तकलीफ?\n1. हाँ\n2. नहीं",
    done: "✅ ट्राइएज पूरा\nटोकन: P-812\nप्राथमिकता: उच्च\nप्रतीक्षा: ~5m\nडॉक्टर जल्द कॉल करेंगे।",
    status: "📋 स्थिति\nटोकन: P-812\nप्रतीक्षा: ~15m\nप्राथमिकता: सामान्य",
    emergency: "🚨 आपातकालीन\nकमांड सेंटर को अलर्ट भेजा गया।\n108 एम्बुलेंस रवाना।"
  },
  ta: {
    welcome: "ஸ்வஸ்த்யா கியூ\n1. புதிய நோயாளி\n2. நிலை\n3. அவசரம்",
    age: "நோயாளியின் வயது?",
    syms: "நெஞ்சு வலி அல்லது மூச்சுத் திணறலா?\n1. ஆம்\n2. இல்லை",
    done: "✅ மதிப்பீடு முடிந்தது\nடோக்கன்: P-812\nமுன்னுரிமை: உயர்\nகாத்திருப்பு: ~5நிமி\nமருத்துவர் அழைப்பார்.",
    status: "📋 நிலை\nடோக்கன்: P-812\nகாத்திருப்பு: ~15நிமி",
    emergency: "🚨 அவசரம்\n108 ஆம்புலன்ஸ் அழைக்கப்பட்டுள்ளது."
  },
  te: {
    welcome: "స్వాస్థ్య క్యూ\n1. కొత్త రోగి\n2. స్థితి\n3. అత్యవసరం",
    age: "రోగి వయస్సు?",
    syms: "ఛాతీ నొప్పి లేదా శ్వాస ఆడకపోవడమా?\n1. అవును\n2. కాదు",
    done: "✅ మదింపు పూర్తయింది\nటోకెన్: P-812\nప్రాధాన్యత: ఎక్కువ\nవేచి ఉండండి: ~5నిమి\nడాక్టర్ త్వరలో కాల్ చేస్తారు.",
    status: "📋 స్థితి\nటోకెన్: P-812\nవేచి ఉండండి: ~15నిమి",
    emergency: "🚨 అత్యవసరం\n108 అంぶలన్స్ పిలవబడింది."
  },
  kn: {
    welcome: "ಸ್ವಾಸ್ಥ್ಯ ಕ್ಯೂ\n1. ಹೊಸ ರೋಗಿ\n2. ಸ್ಥಿತಿ\n3. ತುರ್ತು",
    age: "ರೋಗಿಯ ವಯಸ್ಸು?",
    syms: "ಎದೆನೋವು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆಯೇ?\n1. ಹೌದು\n2. ಇಲ್ಲ",
    done: "✅ ವಿಂಗಡಣೆ ಮುಗಿದಿದೆ\nಟೋಕನ್: P-812\nಆದ್ಯತೆ: ಹೆಚ್ಚು\nಕಾಯುವಿಕೆ: ~5ನಿ\nವೈದ್ಯರು ಶೀಘ್ರದಲ್ಲೇ ಕರೆ ಮಾಡಲಿದ್ದಾರೆ.",
    status: "📋 ಸ್ಥಿತಿ\nಟೋಕನ್: P-812\nಕಾಯುವಿಕೆ: ~15ನಿ",
    emergency: "🚨 ತುರ್ತು\n108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆಯಲಾಗಿದೆ."
  }
};
