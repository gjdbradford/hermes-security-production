export interface CountryData {
  code: string;
  name: string;
  phonePrefix: string;
  phoneFormat: string;
  phoneValidation: RegExp;
  flag: string;
}

export const europeanCountries: CountryData[] = [
  { code: 'AL', name: 'Albania', phonePrefix: '+355', phoneFormat: '## ### ####', phoneValidation: /^\+355\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'AD', name: 'Andorra', phonePrefix: '+376', phoneFormat: '### ###', phoneValidation: /^\+376\s?\d{3}\s?\d{3}$/ },
  { code: 'AT', name: 'Austria', phonePrefix: '+43', phoneFormat: '### ### ####', phoneValidation: /^\+43\s?\d{3}\s?\d{3}\s?\d{4}$/ },
  { code: 'BY', name: 'Belarus', phonePrefix: '+375', phoneFormat: '## ### ####', phoneValidation: /^\+375\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'BE', name: 'Belgium', phonePrefix: '+32', phoneFormat: '### ### ###', phoneValidation: /^\+32\s?\d{3}\s?\d{3}\s?\d{3}$/ },
  { code: 'BA', name: 'Bosnia and Herzegovina', phonePrefix: '+387', phoneFormat: '## ### ###', phoneValidation: /^\+387\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'BG', name: 'Bulgaria', phonePrefix: '+359', phoneFormat: '## ### ###', phoneValidation: /^\+359\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'HR', name: 'Croatia', phonePrefix: '+385', phoneFormat: '## ### ####', phoneValidation: /^\+385\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'CY', name: 'Cyprus', phonePrefix: '+357', phoneFormat: '## ### ###', phoneValidation: /^\+357\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'CZ', name: 'Czech Republic', phonePrefix: '+420', phoneFormat: '### ### ###', phoneValidation: /^\+420\s?\d{3}\s?\d{3}\s?\d{3}$/ },
  { code: 'DK', name: 'Denmark', phonePrefix: '+45', phoneFormat: '#### ####', phoneValidation: /^\+45\s?\d{4}\s?\d{4}$/ },
  { code: 'EE', name: 'Estonia', phonePrefix: '+372', phoneFormat: '#### ####', phoneValidation: /^\+372\s?\d{4}\s?\d{4}$/ },
  { code: 'FI', name: 'Finland', phonePrefix: '+358', phoneFormat: '## ### ####', phoneValidation: /^\+358\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'FR', name: 'France', phonePrefix: '+33', phoneFormat: '# ## ## ## ##', phoneValidation: /^\+33\s?\d{1}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
  { code: 'DE', name: 'Germany', phonePrefix: '+49', phoneFormat: '### #### ####', phoneValidation: /^\+49\s?\d{3}\s?\d{4}\s?\d{4}$/ },
  { code: 'GR', name: 'Greece', phonePrefix: '+30', phoneFormat: '### ### ####', phoneValidation: /^\+30\s?\d{3}\s?\d{3}\s?\d{4}$/ },
  { code: 'HU', name: 'Hungary', phonePrefix: '+36', phoneFormat: '## ### ####', phoneValidation: /^\+36\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'IS', name: 'Iceland', phonePrefix: '+354', phoneFormat: '### ####', phoneValidation: /^\+354\s?\d{3}\s?\d{4}$/ },
  { code: 'IE', name: 'Ireland', phonePrefix: '+353', phoneFormat: '## ### ####', phoneValidation: /^\+353\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'IT', name: 'Italy', phonePrefix: '+39', phoneFormat: '### ### ####', phoneValidation: /^\+39\s?\d{3}\s?\d{3}\s?\d{4}$/ },
  { code: 'LV', name: 'Latvia', phonePrefix: '+371', phoneFormat: '## ### ###', phoneValidation: /^\+371\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'LT', name: 'Lithuania', phonePrefix: '+370', phoneFormat: '## ### ###', phoneValidation: /^\+370\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'LU', name: 'Luxembourg', phonePrefix: '+352', phoneFormat: '### ### ###', phoneValidation: /^\+352\s?\d{3}\s?\d{3}\s?\d{3}$/ },
  { code: 'MK', name: 'North Macedonia', phonePrefix: '+389', phoneFormat: '## ### ###', phoneValidation: /^\+389\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'MT', name: 'Malta', phonePrefix: '+356', phoneFormat: '#### ####', phoneValidation: /^\+356\s?\d{4}\s?\d{4}$/ },
  { code: 'ME', name: 'Montenegro', phonePrefix: '+382', phoneFormat: '## ### ###', phoneValidation: /^\+382\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'NL', name: 'Netherlands', phonePrefix: '+31', phoneFormat: '## ### ####', phoneValidation: /^\+31\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'NO', name: 'Norway', phonePrefix: '+47', phoneFormat: '### ## ###', phoneValidation: /^\+47\s?\d{3}\s?\d{2}\s?\d{3}$/ },
  { code: 'PL', name: 'Poland', phonePrefix: '+48', phoneFormat: '### ### ###', phoneValidation: /^\+48\s?\d{3}\s?\d{3}\s?\d{3}$/ },
  { code: 'PT', name: 'Portugal', phonePrefix: '+351', phoneFormat: '### ### ###', phoneValidation: /^\+351\s?\d{3}\s?\d{3}\s?\d{3}$/ },
  { code: 'RO', name: 'Romania', phonePrefix: '+40', phoneFormat: '## ### ####', phoneValidation: /^\+40\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'RU', name: 'Russia', phonePrefix: '+7', phoneFormat: '### ### ####', phoneValidation: /^\+7\s?\d{3}\s?\d{3}\s?\d{4}$/ },
  { code: 'RS', name: 'Serbia', phonePrefix: '+381', phoneFormat: '## ### ####', phoneValidation: /^\+381\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'SK', name: 'Slovakia', phonePrefix: '+421', phoneFormat: '### ### ###', phoneValidation: /^\+421\s?\d{3}\s?\d{3}\s?\d{3}$/ },
  { code: 'SI', name: 'Slovenia', phonePrefix: '+386', phoneFormat: '## ### ###', phoneValidation: /^\+386\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'ES', name: 'Spain', phonePrefix: '+34', phoneFormat: '### ### ###', phoneValidation: /^\+34\s?\d{3}\s?\d{3}\s?\d{3}$/ },
  { code: 'SE', name: 'Sweden', phonePrefix: '+46', phoneFormat: '## ### ####', phoneValidation: /^\+46\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'CH', name: 'Switzerland', phonePrefix: '+41', phoneFormat: '## ### ####', phoneValidation: /^\+41\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'UA', name: 'Ukraine', phonePrefix: '+380', phoneFormat: '## ### ####', phoneValidation: /^\+380\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'GB', name: 'United Kingdom', phonePrefix: '+44', phoneFormat: '#### ######', phoneValidation: /^\+44\s?\d{4}\s?\d{6}$/ }
];
