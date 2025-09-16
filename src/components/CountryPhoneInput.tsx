import { useMemo, useState, useEffect, useCallback } from 'react';
import { allCountries, type CountryData } from '@/data/countries';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronDown } from 'lucide-react';

export interface CountryPhoneValue {
  country: CountryData | null;
  nationalNumber: string; // digits only
  e164: string; // +<country code><digits>
}

interface CountryPhoneInputProps {
  value?: CountryPhoneValue;
  onChange?: (value: CountryPhoneValue) => void;
  placeholder?: string;
}

const sortByName = (a: CountryData, b: CountryData) => a.name.localeCompare(b.name);

export default function CountryPhoneInput({
  value,
  onChange,
  placeholder,
}: CountryPhoneInputProps) {
  const countries = useMemo(() => [...allCountries].sort(sortByName), []);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CountryData | null>(value?.country || null);
  const [national, setNational] = useState<string>(value?.nationalNumber || '');
  const [isDetecting, setIsDetecting] = useState(false);

  // Auto-detect country on component mount
  useEffect(() => {
    if (!selected && !isDetecting) {
      setIsDetecting(true);
      detectUserCountry();
    }
  }, [selected, isDetecting, detectUserCountry]);

  const detectUserCountry = useCallback(async () => {
    try {
      // Method 1: Try to get country from browser's locale
      const locale = navigator.language || navigator.languages?.[0];
      if (locale) {
        const countryCode = locale.split('-')[1]?.toUpperCase();
        if (countryCode) {
          const detectedCountry = countries.find(c => c.code === countryCode);
          if (detectedCountry) {
            setSelected(detectedCountry);
            emitChange(detectedCountry, national);
            setIsDetecting(false);
            return;
          }
        }
      }

      // Method 2: Try IP-based geolocation (free service)
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        const countryCode = data.country_code;
        if (countryCode) {
          const detectedCountry = countries.find(c => c.code === countryCode);
          if (detectedCountry) {
            setSelected(detectedCountry);
            emitChange(detectedCountry, national);
          }
        }
      }
    } catch (error) {
      console.warn('Country detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  }, [countries, national, emitChange]);

  const e164 = useMemo(() => {
    if (!selected) return '';

    // Clean the national number - remove all non-digits and leading zeros
    const cleanDigits = national.replace(/\D/g, '').replace(/^0+/, '');

    // Get the country code from phone prefix
    const countryCode = selected.phonePrefix?.replace(/[^\d]/g, '') || '';

    // Ensure we have both country code and national number
    if (!countryCode || !cleanDigits) return '';

    // Return properly formatted E.164 number
    return `+${countryCode}${cleanDigits}`;
  }, [national, selected]);

  // Get expected digit count for each country (with SMS service flexibility)
  const getExpectedDigitCount = (country: CountryData): { min: number; max: number } => {
    const countryCode = country.code;

    // Define expected digit ranges for SMS compatibility
    const digitRanges: Record<string, { min: number; max: number }> = {
      // North America
      US: { min: 10, max: 10 },
      CA: { min: 10, max: 10 },
      MX: { min: 10, max: 10 },

      // Europe
      GB: { min: 10, max: 11 },
      DE: { min: 10, max: 12 },
      FR: { min: 9, max: 10 },
      IT: { min: 9, max: 11 },
      ES: { min: 9, max: 9 },
      NL: { min: 9, max: 9 },
      BE: { min: 8, max: 9 },
      CH: { min: 9, max: 9 },
      AT: { min: 10, max: 12 },
      SE: { min: 9, max: 9 },
      NO: { min: 8, max: 8 },
      DK: { min: 8, max: 8 },
      FI: { min: 9, max: 10 },
      PL: { min: 9, max: 9 },
      CZ: { min: 9, max: 9 },
      HU: { min: 8, max: 9 },
      RO: { min: 9, max: 9 },
      BG: { min: 8, max: 9 },
      HR: { min: 8, max: 9 },
      SI: { min: 8, max: 9 },
      SK: { min: 9, max: 9 },
      LT: { min: 8, max: 8 },
      LV: { min: 8, max: 8 },
      EE: { min: 7, max: 8 },
      IE: { min: 9, max: 9 },
      PT: { min: 9, max: 9 },
      GR: { min: 10, max: 10 },
      CY: { min: 8, max: 8 },
      MT: { min: 8, max: 8 },
      LU: { min: 9, max: 9 },
      IS: { min: 7, max: 7 },
      LI: { min: 7, max: 7 },
      MC: { min: 8, max: 9 },
      SM: { min: 6, max: 10 },
      VA: { min: 6, max: 10 },
      AD: { min: 6, max: 6 },
      BY: { min: 9, max: 9 },
      MD: { min: 8, max: 8 },
      UA: { min: 9, max: 9 },
      RU: { min: 10, max: 10 },
      TR: { min: 10, max: 10 },

      // Asia
      CN: { min: 11, max: 11 },
      JP: { min: 10, max: 11 },
      KR: { min: 10, max: 11 },
      IN: { min: 10, max: 10 },
      ID: { min: 9, max: 12 },
      TH: { min: 9, max: 9 },
      VN: { min: 9, max: 10 },
      MY: { min: 9, max: 10 },
      SG: { min: 8, max: 8 },
      PH: { min: 10, max: 10 },
      TW: { min: 9, max: 9 },
      HK: { min: 8, max: 8 },
      MO: { min: 8, max: 8 },
      BD: { min: 10, max: 10 },
      PK: { min: 10, max: 10 },
      LK: { min: 9, max: 9 },
      NP: { min: 10, max: 10 },
      BT: { min: 8, max: 8 },
      MV: { min: 7, max: 7 },
      AF: { min: 9, max: 9 },
      IR: { min: 10, max: 10 },
      IQ: { min: 10, max: 10 },
      SA: { min: 9, max: 9 },
      AE: { min: 9, max: 9 },
      QA: { min: 8, max: 8 },
      KW: { min: 8, max: 8 },
      BH: { min: 8, max: 8 },
      OM: { min: 8, max: 8 },
      YE: { min: 9, max: 9 },
      JO: { min: 9, max: 9 },
      LB: { min: 8, max: 8 },
      SY: { min: 9, max: 9 },
      IL: { min: 9, max: 9 },
      PS: { min: 9, max: 9 },
      KZ: { min: 10, max: 10 },
      UZ: { min: 9, max: 9 },
      KG: { min: 9, max: 9 },
      TJ: { min: 9, max: 9 },
      TM: { min: 8, max: 8 },
      MN: { min: 8, max: 8 },
      MM: { min: 8, max: 10 },
      LA: { min: 8, max: 10 },
      KH: { min: 8, max: 9 },
      BN: { min: 7, max: 7 },
      TL: { min: 8, max: 8 },
      AM: { min: 8, max: 8 },
      AZ: { min: 9, max: 9 },
      GE: { min: 9, max: 9 },

      // Africa
      ZA: { min: 9, max: 9 },
      NG: { min: 10, max: 11 },
      EG: { min: 10, max: 10 },
      KE: { min: 9, max: 9 },
      GH: { min: 9, max: 9 },
      MA: { min: 9, max: 9 },
      DZ: { min: 9, max: 9 },
      TN: { min: 8, max: 8 },
      ET: { min: 9, max: 9 },
      UG: { min: 9, max: 9 },
      TZ: { min: 9, max: 9 },
      ZW: { min: 9, max: 9 },
      ZM: { min: 9, max: 9 },
      BW: { min: 7, max: 8 },
      NA: { min: 9, max: 9 },
      MW: { min: 9, max: 9 },
      MZ: { min: 9, max: 9 },
      MG: { min: 9, max: 9 },
      MU: { min: 7, max: 8 },
      SC: { min: 7, max: 7 },
      RW: { min: 9, max: 9 },
      BI: { min: 8, max: 8 },
      SS: { min: 9, max: 9 },
      SD: { min: 9, max: 9 },
      LY: { min: 9, max: 9 },
      TD: { min: 8, max: 8 },
      NE: { min: 8, max: 8 },
      ML: { min: 8, max: 8 },
      BF: { min: 8, max: 8 },
      CI: { min: 8, max: 10 },
      GN: { min: 8, max: 9 },
      SL: { min: 8, max: 8 },
      LR: { min: 7, max: 8 },
      SN: { min: 9, max: 9 },
      GM: { min: 7, max: 7 },
      GW: { min: 7, max: 7 },
      'GN-B': { min: 7, max: 7 },
      CV: { min: 7, max: 7 },
      ST: { min: 7, max: 7 },
      GQ: { min: 9, max: 9 },
      GA: { min: 8, max: 8 },
      CG: { min: 9, max: 9 },
      CD: { min: 9, max: 9 },
      AO: { min: 9, max: 9 },
      CM: { min: 9, max: 9 },
      CF: { min: 8, max: 8 },
      ER: { min: 7, max: 7 },
      DJ: { min: 6, max: 8 },
      SO: { min: 7, max: 8 },
      KM: { min: 7, max: 7 },
      YT: { min: 9, max: 9 },
      RE: { min: 9, max: 9 },
      SH: { min: 4, max: 4 },

      // Oceania
      AU: { min: 9, max: 9 },
      NZ: { min: 8, max: 9 },
      FJ: { min: 7, max: 7 },
      PG: { min: 8, max: 8 },
      SB: { min: 7, max: 7 },
      VU: { min: 7, max: 7 },
      NC: { min: 6, max: 6 },
      PF: { min: 6, max: 6 },
      WS: { min: 7, max: 7 },
      TO: { min: 7, max: 7 },
      KI: { min: 5, max: 5 },
      TV: { min: 6, max: 6 },
      NR: { min: 7, max: 7 },
      PW: { min: 7, max: 7 },
      FM: { min: 7, max: 7 },
      MH: { min: 7, max: 7 },
      CK: { min: 5, max: 5 },
      NU: { min: 4, max: 4 },
      TK: { min: 4, max: 4 },
      WF: { min: 6, max: 6 },
      AS: { min: 10, max: 10 },
      GU: { min: 10, max: 10 },
      MP: { min: 10, max: 10 },
      VI: { min: 10, max: 10 },
      PR: { min: 10, max: 10 },

      // South America
      BR: { min: 10, max: 11 },
      AR: { min: 10, max: 10 },
      CL: { min: 8, max: 9 },
      CO: { min: 10, max: 10 },
      PE: { min: 9, max: 9 },
      VE: { min: 10, max: 10 },
      EC: { min: 9, max: 9 },
      BO: { min: 8, max: 8 },
      PY: { min: 9, max: 9 },
      UY: { min: 8, max: 8 },
      GY: { min: 7, max: 7 },
      SR: { min: 7, max: 7 },
      GF: { min: 9, max: 9 },
      FK: { min: 5, max: 5 },
    };

    // Return the range for the country, or a default range if not found
    return digitRanges[countryCode] || { min: 7, max: 15 };
  };

  // SMS/API compatible phone number validation
  const validatePhoneNumberForSMS = useCallback(
    (e164Number: string, country: CountryData): boolean => {
      // Basic E.164 format validation (starts with +, followed by 1-15 digits)
      const e164Regex = /^\+[1-9]\d{1,14}$/;
      if (!e164Regex.test(e164Number)) return false;

      // Country-specific digit length validation
      const expectedDigits = getExpectedDigitCount(country);
      const actualDigits = e164Number.replace(/^\+\d+/, '').length;

      // Allow some flexibility for SMS services (within reasonable range)
      return actualDigits >= expectedDigits.min && actualDigits <= expectedDigits.max;
    },
    [getExpectedDigitCount]
  );

  // Enhanced validation helper with SMS/API compatibility
  const isValidPhoneNumber = useMemo(() => {
    if (!selected || !national) return false;

    const cleanDigits = national.replace(/\D/g, '').replace(/^0+/, '');
    const countryCode = selected.phonePrefix?.replace(/[^\d]/g, '') || '';

    // Basic validation: must have country code and at least 5 digits
    if (countryCode.length === 0 || cleanDigits.length < 5) return false;

    // Create E.164 format for validation
    const e164Number = `+${countryCode}${cleanDigits}`;

    // Enhanced validation for SMS/API compatibility
    return validatePhoneNumberForSMS(e164Number, selected);
  }, [national, selected, validatePhoneNumberForSMS]);

  // Get validation error message with SMS compatibility
  const getValidationError = useMemo(() => {
    if (!selected || !national) return null;

    const cleanDigits = national.replace(/\D/g, '').replace(/^0+/, '');
    const countryCode = selected.phonePrefix?.replace(/[^\d]/g, '') || '';

    if (countryCode.length === 0) return 'Please select a country';
    if (cleanDigits.length < 5) return 'Please enter at least 5 digits';

    // SMS-compatible validation
    const e164Number = `+${countryCode}${cleanDigits}`;
    const expectedDigits = getExpectedDigitCount(selected);
    const actualDigits = cleanDigits.length;

    if (actualDigits < expectedDigits.min || actualDigits > expectedDigits.max) {
      if (expectedDigits.min === expectedDigits.max) {
        return `${actualDigits} of ${expectedDigits.min} digits required.`;
      } else {
        return `${actualDigits} of ${expectedDigits.min}-${expectedDigits.max} digits required.`;
      }
    }

    // Additional E.164 format validation
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(e164Number)) {
      return `Invalid international format for ${selected.name}`;
    }

    return null;
  }, [national, selected]);

  const emitChange = (country: CountryData | null, nationalNumber: string) => {
    const cleanDigits = nationalNumber.replace(/\D/g, '').replace(/^0+/, '');
    const countryCode = country?.phonePrefix?.replace(/[^\d]/g, '') || '';

    const newValue: CountryPhoneValue = {
      country,
      nationalNumber: cleanDigits,
      e164: country && countryCode && cleanDigits ? `+${countryCode}${cleanDigits}` : '',
    };
    onChange?.(newValue);
  };

  const handleSelect = (country: CountryData) => {
    setSelected(country);
    setOpen(false);
    emitChange(country, national);
  };

  const handleNationalChange = (val: string) => {
    // keep only digits; allow spaces typed by user but strip for value
    const cleaned = val.replace(/[^\d\s-]/g, '');
    setNational(cleaned);
    emitChange(selected, cleaned);
  };

  const exampleNational = useMemo(() => {
    if (!selected) return '';
    // Compact example with leading 0 and no spaces (e.g., 0769004082)
    const numDigits = (selected.phoneFormat.match(/#/g) || []).length;
    const sample = '7690040823456789'.slice(0, numDigits); // stable demo digits
    return `0${sample}`;
  }, [selected]);

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          className={`${selected ? 'w-[40px] justify-center px-2 h-12' : 'min-w-[180px] justify-start h-12'}`}
          onClick={() => setOpen(true)}
        >
          <span className='flex items-center gap-[5px]'>
            <span
              className='flag-emoji'
              style={{
                fontFamily:
                  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "EmojiSymbols", "EmojiOne Mozilla", "Twemoji Mozilla", "Segoe UI Symbol", sans-serif',
                position: 'relative',
                top: '2px',
                left: '5px',
              }}
            >
              {selected?.flag || '🏳️'}
            </span>
            <ChevronDown className='h-4 w-4' />
            {!selected && <span className='ml-1'>Select country</span>}
          </span>
        </Button>

        <div className='relative flex-1 h-12 flex items-center'>
          {selected && (
            <span className='pointer-events-none absolute left-[5px] flex items-center h-full text-foreground text-sm font-normal'>
              {selected.phonePrefix}
            </span>
          )}
          <Input
            type='tel'
            inputMode='numeric'
            value={national}
            onChange={e => handleNationalChange(e.target.value)}
            placeholder={placeholder || exampleNational || '0XX XXX XXXX'}
            className={`h-12 flex items-center ${selected ? 'pl-14' : ''}`}
          />
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <DialogTitle className='sr-only'>Select Country</DialogTitle>
          <DialogDescription className='sr-only'>
            Choose your country to set the correct phone number prefix
          </DialogDescription>
          <CommandInput placeholder='Search country or code...' />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup heading='Countries'>
              {countries.map(c => (
                <CommandItem key={c.code} onSelect={() => handleSelect(c)}>
                  <span className='mr-2' aria-hidden>
                    {c.flag || '🏳️'}
                  </span>
                  <span className='flex-1'>{c.name}</span>
                  <span className='text-muted-foreground'>{c.phonePrefix}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* Hidden E.164 output for forms if needed */}
        <input type='hidden' name='phone_e164' value={e164} readOnly />
      </div>

      {/* Validation status indicator */}
      {selected && national && (
        <div className='text-xs text-muted-foreground'>
          {isValidPhoneNumber ? (
            <span className='text-green-600'>✓ {e164}</span>
          ) : getValidationError ? (
            <span className='text-red-600'>{getValidationError}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
