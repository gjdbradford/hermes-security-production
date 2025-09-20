# Countries Data Structure

This directory contains comprehensive country data organized by region for the
Hermes contact form.

## Files Created

### Regional Country Files

- `northAmericaComplete.ts` - Complete North America (24 countries)
- `southAmerica.ts` - South America (14 countries)
- `europeComplete.ts` - Complete Europe (39 countries)
- `oceania.ts` - Oceania/Pacific Islands (14 countries)

### Existing Files (Enhanced)

- `africa.ts` - Africa (54 countries)
- `asia.ts` - Asia (45 countries)
- `otherCountries.ts` - Other territories and dependencies

## Total Countries Coverage

- **North America**: 24 countries
- **South America**: 14 countries
- **Europe**: 39 countries
- **Asia**: 45 countries
- **Africa**: 54 countries
- **Oceania**: 14 countries
- **Other**: Various territories and dependencies

**Total: ~190+ countries and territories**

## Data Structure

Each country includes:

- `code`: ISO 2-letter country code
- `name`: Full country name
- `phonePrefix`: International dialing code
- `phoneFormat`: Display format for phone numbers
- `phoneValidation`: Regex pattern for validation
- `flag`: Unicode flag emoji (optional)

## Usage

Import the complete list:

```typescript
import { allCountries } from './countries';
```

Or import specific regions:

```typescript
import {
  northAmericanCountriesComplete,
  europeanCountriesComplete,
} from './countries';
```

## Integration

The `index.ts` file combines all regional lists into a single `allCountries`
array that can be used in your contact form dropdown.
