export interface CountryData {
  code: string;
  name: string;
  phonePrefix: string;
  phoneFormat: string;
  phoneValidation: RegExp;
  flag?: string;
}

export const oceaniaCountries: CountryData[] = [
  { code: 'AU', name: 'Australia', phonePrefix: '+61', phoneFormat: '### ### ###', phoneValidation: /^\+61\s?\d{3}\s?\d{3}\s?\d{3}$/, flag: '🇦🇺' },
  { code: 'FJ', name: 'Fiji', phonePrefix: '+679', phoneFormat: '### ####', phoneValidation: /^\+679\s?\d{3}\s?\d{4}$/, flag: '🇫🇯' },
  { code: 'KI', name: 'Kiribati', phonePrefix: '+686', phoneFormat: '### ####', phoneValidation: /^\+686\s?\d{3}\s?\d{4}$/, flag: '🇰🇮' },
  { code: 'MH', name: 'Marshall Islands', phonePrefix: '+692', phoneFormat: '### ####', phoneValidation: /^\+692\s?\d{3}\s?\d{4}$/, flag: '🇲🇭' },
  { code: 'FM', name: 'Micronesia', phonePrefix: '+691', phoneFormat: '### ####', phoneValidation: /^\+691\s?\d{3}\s?\d{4}$/, flag: '🇫🇲' },
  { code: 'NR', name: 'Nauru', phonePrefix: '+674', phoneFormat: '### ####', phoneValidation: /^\+674\s?\d{3}\s?\d{4}$/, flag: '🇳🇷' },
  { code: 'NZ', name: 'New Zealand', phonePrefix: '+64', phoneFormat: '## ### ####', phoneValidation: /^\+64\s?\d{2}\s?\d{3}\s?\d{4}$/, flag: '🇳🇿' },
  { code: 'PW', name: 'Palau', phonePrefix: '+680', phoneFormat: '### ####', phoneValidation: /^\+680\s?\d{3}\s?\d{4}$/, flag: '🇵🇼' },
  { code: 'PG', name: 'Papua New Guinea', phonePrefix: '+675', phoneFormat: '### ####', phoneValidation: /^\+675\s?\d{3}\s?\d{4}$/, flag: '🇵🇬' },
  { code: 'WS', name: 'Samoa', phonePrefix: '+685', phoneFormat: '### ####', phoneValidation: /^\+685\s?\d{3}\s?\d{4}$/, flag: '🇼🇸' },
  { code: 'SB', name: 'Solomon Islands', phonePrefix: '+677', phoneFormat: '### ####', phoneValidation: /^\+677\s?\d{3}\s?\d{4}$/, flag: '🇸🇧' },
  { code: 'TO', name: 'Tonga', phonePrefix: '+676', phoneFormat: '### ####', phoneValidation: /^\+676\s?\d{3}\s?\d{4}$/, flag: '🇹🇴' },
  { code: 'TV', name: 'Tuvalu', phonePrefix: '+688', phoneFormat: '### ####', phoneValidation: /^\+688\s?\d{3}\s?\d{4}$/, flag: '🇹🇻' },
  { code: 'VU', name: 'Vanuatu', phonePrefix: '+678', phoneFormat: '### ####', phoneValidation: /^\+678\s?\d{3}\s?\d{4}$/, flag: '🇻🇺' }
];
