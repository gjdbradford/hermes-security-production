export interface CountryData {
  code: string;
  name: string;
  phonePrefix: string;
  phoneFormat: string;
  phoneValidation: RegExp;
  flag?: string;
}

export const southAmericanCountries: CountryData[] = [
  {
    code: 'AR',
    name: 'Argentina',
    phonePrefix: '+54',
    phoneFormat: '### ###-####',
    phoneValidation: /^\+54\s?\d{3}\s?\d{3}[-.\s]?\d{4}$/,
    flag: '🇦🇷',
  },
  {
    code: 'BO',
    name: 'Bolivia',
    phonePrefix: '+591',
    phoneFormat: '### ### ####',
    phoneValidation: /^\+591\s?\d{3}\s?\d{3}\s?\d{4}$/,
    flag: '🇧🇴',
  },
  {
    code: 'BR',
    name: 'Brazil',
    phonePrefix: '+55',
    phoneFormat: '(##) #####-####',
    phoneValidation: /^\+55\s?\(?\d{2}\)?\s?\d{5}[-.\s]?\d{4}$/,
    flag: '🇧🇷',
  },
  {
    code: 'CL',
    name: 'Chile',
    phonePrefix: '+56',
    phoneFormat: '# #### ####',
    phoneValidation: /^\+56\s?\d{1}\s?\d{4}\s?\d{4}$/,
    flag: '🇨🇱',
  },
  {
    code: 'CO',
    name: 'Colombia',
    phonePrefix: '+57',
    phoneFormat: '### ### ####',
    phoneValidation: /^\+57\s?\d{3}\s?\d{3}\s?\d{4}$/,
    flag: '🇨🇴',
  },
  {
    code: 'EC',
    name: 'Ecuador',
    phonePrefix: '+593',
    phoneFormat: '## ### ####',
    phoneValidation: /^\+593\s?\d{2}\s?\d{3}\s?\d{4}$/,
    flag: '🇪🇨',
  },
  {
    code: 'FK',
    name: 'Falkland Islands',
    phonePrefix: '+500',
    phoneFormat: '#####',
    phoneValidation: /^\+500\s?\d{5}$/,
    flag: '🇫🇰',
  },
  {
    code: 'GF',
    name: 'French Guiana',
    phonePrefix: '+594',
    phoneFormat: '### ### ###',
    phoneValidation: /^\+594\s?\d{3}\s?\d{3}\s?\d{3}$/,
    flag: '🇬🇫',
  },
  {
    code: 'GY',
    name: 'Guyana',
    phonePrefix: '+592',
    phoneFormat: '### ####',
    phoneValidation: /^\+592\s?\d{3}\s?\d{4}$/,
    flag: '🇬🇾',
  },
  {
    code: 'PY',
    name: 'Paraguay',
    phonePrefix: '+595',
    phoneFormat: '### ### ###',
    phoneValidation: /^\+595\s?\d{3}\s?\d{3}\s?\d{3}$/,
    flag: '🇵🇾',
  },
  {
    code: 'PE',
    name: 'Peru',
    phonePrefix: '+51',
    phoneFormat: '### ### ###',
    phoneValidation: /^\+51\s?\d{3}\s?\d{3}\s?\d{3}$/,
    flag: '🇵🇪',
  },
  {
    code: 'SR',
    name: 'Suriname',
    phonePrefix: '+597',
    phoneFormat: '### ####',
    phoneValidation: /^\+597\s?\d{3}\s?\d{4}$/,
    flag: '🇸🇷',
  },
  {
    code: 'UY',
    name: 'Uruguay',
    phonePrefix: '+598',
    phoneFormat: '### ### ##',
    phoneValidation: /^\+598\s?\d{3}\s?\d{3}\s?\d{2}$/,
    flag: '🇺🇾',
  },
  {
    code: 'VE',
    name: 'Venezuela',
    phonePrefix: '+58',
    phoneFormat: '###-###-####',
    phoneValidation: /^\+58\s?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/,
    flag: '🇻🇪',
  },
];
