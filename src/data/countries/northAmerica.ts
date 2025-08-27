export interface CountryData {
  code: string;
  name: string;
  phonePrefix: string;
  phoneFormat: string;
  phoneValidation: RegExp;
  flag?: string;
}

export const northAmericanCountries: CountryData[] = [
  { code: 'US', name: 'United States', phonePrefix: '+1', phoneFormat: '### ### ####', phoneValidation: /^\+1\s?\d{3}\s?\d{3}\s?\d{4}$/, flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', phonePrefix: '+1', phoneFormat: '### ### ####', phoneValidation: /^\+1\s?\d{3}\s?\d{3}\s?\d{4}$/, flag: '🇨🇦' }
];
