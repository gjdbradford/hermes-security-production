import { asianCountries } from './asia';
import { africanCountries } from './africa';
import { otherCountries } from './otherCountries';
import { northAmericanCountriesComplete } from './northAmericaComplete';
import { southAmericanCountries } from './southAmerica';
import { europeanCountriesComplete } from './europeComplete';
import { oceaniaCountries } from './oceania';

export interface CountryData {
  code: string;
  name: string;
  phonePrefix: string;
  phoneFormat: string;
  phoneValidation: RegExp;
  flag?: string;
}

// Combine all countries
export const allCountries: CountryData[] = [
  ...northAmericanCountriesComplete,
  ...southAmericanCountries,
  ...europeanCountriesComplete,
  ...asianCountries,
  ...africanCountries,
  ...oceaniaCountries,
  ...otherCountries
];

// Helper functions
export const getCountryByCode = (code: string): CountryData | undefined => {
  return allCountries.find(country => country.code === code);
};

export const getCountryByName = (name: string): CountryData | undefined => {
  return allCountries.find(country => country.name.toLowerCase() === name.toLowerCase());
};

export const formatPhoneNumber = (phone: string, countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  if (!country) return phone;

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Apply country-specific formatting
  switch (countryCode) {
    case 'US':
    case 'CA':
      return `+1 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    case 'GB':
      return `+44 ${digits.slice(0, 4)} ${digits.slice(4, 10)}`;
    case 'DE':
      return `+49 ${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
    case 'FR':
      return `+33 ${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
    default:
      return `${country.phonePrefix} ${digits}`;
  }
};

// Export regional lists for specific use cases
export {
  northAmericanCountriesComplete,
  southAmericanCountries,
  europeanCountriesComplete,
  asianCountries,
  africanCountries,
  oceaniaCountries,
  otherCountries
};
