export interface CountryData {
  code: string;
  name: string;
  phonePrefix: string;
  phoneFormat: string;
  phoneValidation: RegExp;
  flag?: string;
}

export const africanCountries: CountryData[] = [
  { code: 'DZ', name: 'Algeria', phonePrefix: '+213', phoneFormat: '### ### ###', phoneValidation: /^\+213\s?\d{3}\s?\d{3}\s?\d{3}$/, flag: '🇩🇿' },
  { code: 'AO', name: 'Angola', phonePrefix: '+244', phoneFormat: '### ### ###', phoneValidation: /^\+244\s?\d{3}\s?\d{3}\s?\d{3}$/ },
  { code: 'BJ', name: 'Benin', phonePrefix: '+229', phoneFormat: '## ### ###', phoneValidation: /^\+229\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'BW', name: 'Botswana', phonePrefix: '+267', phoneFormat: '## ### ###', phoneValidation: /^\+267\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'BF', name: 'Burkina Faso', phonePrefix: '+226', phoneFormat: '## ### ###', phoneValidation: /^\+226\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'BI', name: 'Burundi', phonePrefix: '+257', phoneFormat: '## ### ###', phoneValidation: /^\+257\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'CM', name: 'Cameroon', phonePrefix: '+237', phoneFormat: '## ### ###', phoneValidation: /^\+237\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'CV', name: 'Cape Verde', phonePrefix: '+238', phoneFormat: '### ####', phoneValidation: /^\+238\s?\d{3}\s?\d{4}$/ },
  { code: 'CF', name: 'Central African Republic', phonePrefix: '+236', phoneFormat: '## ### ###', phoneValidation: /^\+236\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'TD', name: 'Chad', phonePrefix: '+235', phoneFormat: '## ### ###', phoneValidation: /^\+235\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'KM', name: 'Comoros', phonePrefix: '+269', phoneFormat: '## ### ###', phoneValidation: /^\+269\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'CG', name: 'Congo', phonePrefix: '+242', phoneFormat: '## ### ###', phoneValidation: /^\+242\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'CD', name: 'Democratic Republic of the Congo', phonePrefix: '+243', phoneFormat: '## ### ###', phoneValidation: /^\+243\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'DJ', name: 'Djibouti', phonePrefix: '+253', phoneFormat: '## ### ###', phoneValidation: /^\+253\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'EG', name: 'Egypt', phonePrefix: '+20', phoneFormat: '## ### ####', phoneValidation: /^\+20\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'GQ', name: 'Equatorial Guinea', phonePrefix: '+240', phoneFormat: '## ### ###', phoneValidation: /^\+240\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'ER', name: 'Eritrea', phonePrefix: '+291', phoneFormat: '## ### ###', phoneValidation: /^\+291\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'ET', name: 'Ethiopia', phonePrefix: '+251', phoneFormat: '## ### ####', phoneValidation: /^\+251\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'GA', name: 'Gabon', phonePrefix: '+241', phoneFormat: '## ### ###', phoneValidation: /^\+241\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'GM', name: 'Gambia', phonePrefix: '+220', phoneFormat: '### ####', phoneValidation: /^\+220\s?\d{3}\s?\d{4}$/ },
  { code: 'GH', name: 'Ghana', phonePrefix: '+233', phoneFormat: '## ### ####', phoneValidation: /^\+233\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'GN', name: 'Guinea', phonePrefix: '+224', phoneFormat: '## ### ###', phoneValidation: /^\+224\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'GW', name: 'Guinea-Bissau', phonePrefix: '+245', phoneFormat: '### ####', phoneValidation: /^\+245\s?\d{3}\s?\d{4}$/ },
  { code: 'CI', name: 'Ivory Coast', phonePrefix: '+225', phoneFormat: '## ### ###', phoneValidation: /^\+225\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'KE', name: 'Kenya', phonePrefix: '+254', phoneFormat: '## ### ####', phoneValidation: /^\+254\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'LS', name: 'Lesotho', phonePrefix: '+266', phoneFormat: '## ### ###', phoneValidation: /^\+266\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'LR', name: 'Liberia', phonePrefix: '+231', phoneFormat: '## ### ###', phoneValidation: /^\+231\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'LY', name: 'Libya', phonePrefix: '+218', phoneFormat: '## ### ####', phoneValidation: /^\+218\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'MG', name: 'Madagascar', phonePrefix: '+261', phoneFormat: '## ### ###', phoneValidation: /^\+261\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'MW', name: 'Malawi', phonePrefix: '+265', phoneFormat: '## ### ###', phoneValidation: /^\+265\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'ML', name: 'Mali', phonePrefix: '+223', phoneFormat: '## ### ###', phoneValidation: /^\+223\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'MR', name: 'Mauritania', phonePrefix: '+222', phoneFormat: '## ### ###', phoneValidation: /^\+222\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'MU', name: 'Mauritius', phonePrefix: '+230', phoneFormat: '### ####', phoneValidation: /^\+230\s?\d{3}\s?\d{4}$/ },
  { code: 'MA', name: 'Morocco', phonePrefix: '+212', phoneFormat: '## ### ####', phoneValidation: /^\+212\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'MZ', name: 'Mozambique', phonePrefix: '+258', phoneFormat: '## ### ###', phoneValidation: /^\+258\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'NA', name: 'Namibia', phonePrefix: '+264', phoneFormat: '## ### ####', phoneValidation: /^\+264\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'NE', name: 'Niger', phonePrefix: '+227', phoneFormat: '## ### ###', phoneValidation: /^\+227\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'NG', name: 'Nigeria', phonePrefix: '+234', phoneFormat: '## ### ####', phoneValidation: /^\+234\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'RW', name: 'Rwanda', phonePrefix: '+250', phoneFormat: '## ### ###', phoneValidation: /^\+250\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'ST', name: 'São Tomé and Príncipe', phonePrefix: '+239', phoneFormat: '### ####', phoneValidation: /^\+239\s?\d{3}\s?\d{4}$/ },
  { code: 'SN', name: 'Senegal', phonePrefix: '+221', phoneFormat: '## ### ###', phoneValidation: /^\+221\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'SC', name: 'Seychelles', phonePrefix: '+248', phoneFormat: '### ###', phoneValidation: /^\+248\s?\d{3}\s?\d{3}$/ },
  { code: 'SL', name: 'Sierra Leone', phonePrefix: '+232', phoneFormat: '## ### ###', phoneValidation: /^\+232\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'SO', name: 'Somalia', phonePrefix: '+252', phoneFormat: '## ### ###', phoneValidation: /^\+252\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'ZA', name: 'South Africa', phonePrefix: '+27', phoneFormat: '## ### ####', phoneValidation: /^\+27\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'SS', name: 'South Sudan', phonePrefix: '+211', phoneFormat: '## ### ####', phoneValidation: /^\+211\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'SD', name: 'Sudan', phonePrefix: '+249', phoneFormat: '## ### ####', phoneValidation: /^\+249\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'TZ', name: 'Tanzania', phonePrefix: '+255', phoneFormat: '## ### ####', phoneValidation: /^\+255\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'TG', name: 'Togo', phonePrefix: '+228', phoneFormat: '## ### ###', phoneValidation: /^\+228\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'TN', name: 'Tunisia', phonePrefix: '+216', phoneFormat: '## ### ###', phoneValidation: /^\+216\s?\d{2}\s?\d{3}\s?\d{3}$/ },
  { code: 'UG', name: 'Uganda', phonePrefix: '+256', phoneFormat: '## ### ####', phoneValidation: /^\+256\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'ZM', name: 'Zambia', phonePrefix: '+260', phoneFormat: '## ### ####', phoneValidation: /^\+260\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  { code: 'ZW', name: 'Zimbabwe', phonePrefix: '+263', phoneFormat: '## ### ####', phoneValidation: /^\+263\s?\d{2}\s?\d{3}\s?\d{4}$/ }
];
