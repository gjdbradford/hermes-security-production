export interface CountryData {
  code: string;
  name: string;
  phonePrefix: string;
  phoneFormat: string;
  phoneValidation: RegExp;
  flag?: string;
}

export const otherCountries: CountryData[] = [
  // No additional countries needed - all countries are covered by regional files
];
