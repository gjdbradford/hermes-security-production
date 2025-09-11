export interface CountryData {
  code: string;
  name: string;
  phonePrefix: string;
  phoneFormat: string;
  phoneValidation: RegExp;
  flag?: string;
}

export const asianCountries: CountryData[] = [
  { code: 'AF', name: 'Afghanistan', phonePrefix: '+93', phoneFormat: '### ### ####', phoneValidation: /^\+93\s?\d{3}\s?\d{3}\s?\d{4}$/, flag: '🇦🇫' },
  { code: 'AM', name: 'Armenia', phonePrefix: '+374', phoneFormat: '## ### ###', phoneValidation: /^\+374\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇦🇲' },
  { code: 'AZ', name: 'Azerbaijan', phonePrefix: '+994', phoneFormat: '## ### ####', phoneValidation: /^\+994\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇦🇿' },
  { code: 'BH', name: 'Bahrain', phonePrefix: '+973', phoneFormat: '#### ####', phoneValidation: /^\+973\s?\d{4}\s?\d{4}$/, flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', phonePrefix: '+880', phoneFormat: '## ### ###', phoneValidation: /^\+880\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇧🇩' },
  { code: 'BT', name: 'Bhutan', phonePrefix: '+975', phoneFormat: '## ### ###', phoneValidation: /^\+975\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇧🇹' },
  { code: 'BN', name: 'Brunei', phonePrefix: '+673', phoneFormat: '### ####', phoneValidation: /^\+673\s?\d{3}\s?\d{4}$/, flag: '🇧🇳' },
  { code: 'KH', name: 'Cambodia', phonePrefix: '+855', phoneFormat: '## ### ###', phoneValidation: /^\+855\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇰🇭' },
  { code: 'CN', name: 'China', phonePrefix: '+86', phoneFormat: '### #### ####', phoneValidation: /^\+86\s?\d{3}\s?\d{4}\s?\d{4}$/, flag: '🇨🇳' },
  { code: 'HK', name: 'Hong Kong', phonePrefix: '+852', phoneFormat: '#### ####', phoneValidation: /^\+852\s?\d{4}\s?\d{4}$/, flag: '🇭🇰' },
  { code: 'IN', name: 'India', phonePrefix: '+91', phoneFormat: '##### #####', phoneValidation: /^\+91\s?\d{5}\s?\d{5}$/, flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', phonePrefix: '+62', phoneFormat: '## ### ####', phoneValidation: /^\+62\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇮🇩' },
  { code: 'IR', name: 'Iran', phonePrefix: '+98', phoneFormat: '### ### ####', phoneValidation: /^\+98\s?\d{3}\s?\d{3}\s?\d{4}$/, flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', phonePrefix: '+964', phoneFormat: '### ### ####', phoneValidation: /^\+964\s?\d{3}\s?\d{3}\s?\d{4}$/, flag: '🇮🇶' },
  { code: 'IL', name: 'Israel', phonePrefix: '+972', phoneFormat: '## ### ####', phoneValidation: /^\+972\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇮🇱' },
  { code: 'JP', name: 'Japan', phonePrefix: '+81', phoneFormat: '## #### ####', phoneValidation: /^\+81\s?\d{2}\s?\d{4}\s?\d{4}$/, flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan', phonePrefix: '+962', phoneFormat: '## ### ####', phoneValidation: /^\+962\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', phonePrefix: '+7', phoneFormat: '### ### ####', phoneValidation: /^\+7\s?\d{3}\s?\d{3}\s?\d{4}$/, flag: '🇰🇿' },
  { code: 'KW', name: 'Kuwait', phonePrefix: '+965', phoneFormat: '#### ####', phoneValidation: /^\+965\s?\d{4}\s?\d{4}$/, flag: '🇰🇼' },
  { code: 'KG', name: 'Kyrgyzstan', phonePrefix: '+996', phoneFormat: '### ### ###', phoneValidation: /^\+996\s?\d{3}\s?\d{3}\s?\d{3}$/, flag: '🇰🇬' },
  { code: 'LA', name: 'Laos', phonePrefix: '+856', phoneFormat: '## ### ###', phoneValidation: /^\+856\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇱🇦' },
  { code: 'LB', name: 'Lebanon', phonePrefix: '+961', phoneFormat: '## ### ###', phoneValidation: /^\+961\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇱🇧' },
  { code: 'MO', name: 'Macau', phonePrefix: '+853', phoneFormat: '#### ####', phoneValidation: /^\+853\s?\d{4}\s?\d{4}$/, flag: '🇲🇴' },
  { code: 'MY', name: 'Malaysia', phonePrefix: '+60', phoneFormat: '## ### ####', phoneValidation: /^\+60\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇲🇾' },
  { code: 'MV', name: 'Maldives', phonePrefix: '+960', phoneFormat: '### ####', phoneValidation: /^\+960\s?\d{3}\s?\d{4}$/, flag: '🇲🇻' },
  { code: 'MM', name: 'Myanmar', phonePrefix: '+95', phoneFormat: '## ### ###', phoneValidation: /^\+95\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇲🇲' },
  { code: 'NP', name: 'Nepal', phonePrefix: '+977', phoneFormat: '## ### ###', phoneValidation: /^\+977\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇳🇵' },
  { code: 'OM', name: 'Oman', phonePrefix: '+968', phoneFormat: '#### ####', phoneValidation: /^\+968\s?\d{4}\s?\d{4}$/, flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', phonePrefix: '+92', phoneFormat: '## ### ####', phoneValidation: /^\+92\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇵🇰' },
  { code: 'PH', name: 'Philippines', phonePrefix: '+63', phoneFormat: '## ### ####', phoneValidation: /^\+63\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇵🇭' },
  { code: 'QA', name: 'Qatar', phonePrefix: '+974', phoneFormat: '#### ####', phoneValidation: /^\+974\s?\d{4}\s?\d{4}$/, flag: '🇶🇦' },
  { code: 'SA', name: 'Saudi Arabia', phonePrefix: '+966', phoneFormat: '## ### ####', phoneValidation: /^\+966\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', phonePrefix: '+65', phoneFormat: '#### ####', phoneValidation: /^\+65\s?\d{4}\s?\d{4}$/, flag: '🇸🇬' },
  { code: 'LK', name: 'Sri Lanka', phonePrefix: '+94', phoneFormat: '## ### ####', phoneValidation: /^\+94\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇱🇰' },
  { code: 'SY', name: 'Syria', phonePrefix: '+963', phoneFormat: '## ### ####', phoneValidation: /^\+963\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇸🇾' },
  { code: 'TW', name: 'Taiwan', phonePrefix: '+886', phoneFormat: '## ### ####', phoneValidation: /^\+886\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇹🇼' },
  { code: 'TJ', name: 'Tajikistan', phonePrefix: '+992', phoneFormat: '## ### ####', phoneValidation: /^\+992\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇹🇯' },
  { code: 'TH', name: 'Thailand', phonePrefix: '+66', phoneFormat: '## ### ####', phoneValidation: /^\+66\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇹🇭' },
  { code: 'TL', name: 'Timor-Leste', phonePrefix: '+670', phoneFormat: '### ####', phoneValidation: /^\+670\s?\d{3}\s?\d{4}$/, flag: '🇹🇱' },
  { code: 'TR', name: 'Turkey', phonePrefix: '+90', phoneFormat: '## ### ####', phoneValidation: /^\+90\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇹🇷' },
  { code: 'TM', name: 'Turkmenistan', phonePrefix: '+993', phoneFormat: '## ### ###', phoneValidation: /^\+993\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇹🇲' },
  { code: 'AE', name: 'United Arab Emirates', phonePrefix: '+971', phoneFormat: '## ### ####', phoneValidation: /^\+971\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇦🇪' },
  { code: 'UZ', name: 'Uzbekistan', phonePrefix: '+998', phoneFormat: '## ### ####', phoneValidation: /^\+998\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇺🇿' },
  { code: 'VN', name: 'Vietnam', phonePrefix: '+84', phoneFormat: '## ### ####', phoneValidation: /^\+84\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇻🇳' },
  { code: 'YE', name: 'Yemen', phonePrefix: '+967', phoneFormat: '## ### ###', phoneValidation: /^\+967\s?\d{2}\s?\d{3}\s?\d{3}$/, flag: '🇾🇪' }
];
