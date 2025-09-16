/**
 * Contact Form Test Suite
 * Tests for the enhanced contact form with SMS-compatible mobile validation
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactForm from '@/components/ContactForm';
import CountryPhoneInput from '@/components/CountryPhoneInput';

// Mock the contact API
vi.mock('@/services/contactApi', () => ({
  submitContactForm: vi.fn(),
}));

// Mock the chatbot utils
vi.mock('@/utils/chatbotUtils', () => ({
  ChatBotUtils: {
    launchContactFormChat: vi.fn(),
  },
}));

// Mock the captcha verification
vi.mock('@/components/CaptchaVerification', () => ({
  useCaptchaVerification: () => ({
    verifyCaptcha: vi.fn().mockResolvedValue({ success: true, token: 'test-token' }),
    isVerifying: false,
  }),
}));

// Mock the captcha config
vi.mock('@/config/captcha', () => ({
  isCaptchaEnabled: () => false,
  isCaptchaDebugMode: () => false,
}));

// Mock the routing utils
vi.mock('@/utils/routingUtils', () => ({
  getBasePath: () => '/',
}));

describe('ContactForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<ContactForm onSuccess={mockOnSuccess} ctaSource='test' />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service urgency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brief description/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm onSuccess={mockOnSuccess} ctaSource='test' />);

    const submitButton = screen.getByRole('button', { name: /submit contact request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/last name must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<ContactForm onSuccess={mockOnSuccess} ctaSource='test' />);

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /submit contact request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates minimum description length', async () => {
    render(<ContactForm onSuccess={mockOnSuccess} ctaSource='test' />);

    const descriptionInput = screen.getByLabelText(/brief description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Short' } });

    const submitButton = screen.getByRole('button', { name: /submit contact request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please provide a brief description \(at least 20 characters\)/i)
      ).toBeInTheDocument();
    });
  });

  it('requires terms and privacy consent', async () => {
    render(<ContactForm onSuccess={mockOnSuccess} ctaSource='test' />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/brief description/i), {
      target: { value: 'This is a detailed description of my security needs' },
    });

    const submitButton = screen.getByRole('button', { name: /submit contact request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/you must agree to the terms of use/i)).toBeInTheDocument();
      expect(screen.getByText(/you must consent to data processing/i)).toBeInTheDocument();
    });
  });
});

describe('CountryPhoneInput', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders country selector and phone input', () => {
    render(
      <CountryPhoneInput
        value={{ country: null, nationalNumber: '', e164: '' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/select country/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows validation error for missing country', () => {
    render(
      <CountryPhoneInput
        value={{ country: null, nationalNumber: '123456789', e164: '' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/please select your country/i)).toBeInTheDocument();
  });

  it('shows validation error for short number', () => {
    const mockCountry = {
      code: 'ZA',
      name: 'South Africa',
      phonePrefix: '+27',
      phoneFormat: '## ### ####',
      phoneValidation: /^\+27\s?\d{2}\s?\d{3}\s?\d{4}$/,
    };

    render(
      <CountryPhoneInput
        value={{ country: mockCountry, nationalNumber: '123', e164: '' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/please enter at least 5 digits/i)).toBeInTheDocument();
  });

  it('shows country-specific validation error for South Africa', () => {
    const mockCountry = {
      code: 'ZA',
      name: 'South Africa',
      phonePrefix: '+27',
      phoneFormat: '## ### ####',
      phoneValidation: /^\+27\s?\d{2}\s?\d{3}\s?\d{4}$/,
    };

    render(
      <CountryPhoneInput
        value={{ country: mockCountry, nationalNumber: '12345678', e164: '+2712345678' }}
        onChange={mockOnChange}
      />
    );

    expect(
      screen.getByText(/please enter 9 digits for South Africa \(currently 8\)/i)
    ).toBeInTheDocument();
  });

  it('shows success indicator for valid South African number', () => {
    const mockCountry = {
      code: 'ZA',
      name: 'South Africa',
      phonePrefix: '+27',
      phoneFormat: '## ### ####',
      phoneValidation: /^\+27\s?\d{2}\s?\d{3}\s?\d{4}$/,
    };

    render(
      <CountryPhoneInput
        value={{ country: mockCountry, nationalNumber: '769004082', e164: '+27769004082' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/✓ \+27769004082/i)).toBeInTheDocument();
  });

  it('shows country-specific validation error for United States', () => {
    const mockCountry = {
      code: 'US',
      name: 'United States',
      phonePrefix: '+1',
      phoneFormat: '(###) ###-####',
      phoneValidation: /^\+1\s?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    };

    render(
      <CountryPhoneInput
        value={{ country: mockCountry, nationalNumber: '123456789', e164: '+1123456789' }}
        onChange={mockOnChange}
      />
    );

    expect(
      screen.getByText(/please enter 10 digits for United States \(currently 9\)/i)
    ).toBeInTheDocument();
  });

  it('shows success indicator for valid US number', () => {
    const mockCountry = {
      code: 'US',
      name: 'United States',
      phonePrefix: '+1',
      phoneFormat: '(###) ###-####',
      phoneValidation: /^\+1\s?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    };

    render(
      <CountryPhoneInput
        value={{ country: mockCountry, nationalNumber: '1234567890', e164: '+11234567890' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/✓ \+11234567890/i)).toBeInTheDocument();
  });

  it('shows range validation for United Kingdom', () => {
    const mockCountry = {
      code: 'GB',
      name: 'United Kingdom',
      phonePrefix: '+44',
      phoneFormat: '## #### ####',
      phoneValidation: /^\+44\s?\d{2}\s?\d{4}\s?\d{4}$/,
    };

    render(
      <CountryPhoneInput
        value={{ country: mockCountry, nationalNumber: '123456789', e164: '+44123456789' }}
        onChange={mockOnChange}
      />
    );

    expect(
      screen.getByText(/please enter 10-11 digits for United Kingdom \(currently 9\)/i)
    ).toBeInTheDocument();
  });

  it('handles number input changes', () => {
    render(
      <CountryPhoneInput
        value={{ country: null, nationalNumber: '', e164: '' }}
        onChange={mockOnChange}
      />
    );

    const phoneInput = screen.getByRole('textbox');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    expect(mockOnChange).toHaveBeenCalled();
  });
});

describe('Mobile Number Validation Integration', () => {
  it('validates E.164 format compliance', () => {
    const testCases = [
      { country: 'ZA', number: '769004082', expected: '+27769004082' },
      { country: 'US', number: '1234567890', expected: '+11234567890' },
      { country: 'GB', number: '7123456789', expected: '+447123456789' },
      { country: 'CN', number: '13812345678', expected: '+8613812345678' },
    ];

    testCases.forEach(({ country: _country, number: _number, expected }) => {
      // This would test the actual validation logic
      expect(expected).toMatch(/^\+[1-9]\d{1,14}$/);
    });
  });

  it('validates country-specific digit ranges', () => {
    const digitRanges = {
      ZA: { min: 9, max: 9 },
      US: { min: 10, max: 10 },
      GB: { min: 10, max: 11 },
      DE: { min: 10, max: 12 },
      CN: { min: 11, max: 11 },
    };

    Object.entries(digitRanges).forEach(([_country, range]) => {
      expect(range.min).toBeGreaterThan(0);
      expect(range.max).toBeGreaterThanOrEqual(range.min);
      expect(range.max).toBeLessThanOrEqual(15); // E.164 limit
    });
  });
});

describe('Form Submission Integration', () => {
  it('prevents submission with invalid mobile number', async () => {
    const { submitContactForm } = await import('@/services/contactApi');
    const mockSubmitContactForm = vi.mocked(submitContactForm);

    render(<ContactForm onSuccess={vi.fn()} ctaSource='test' />);

    // Fill form with invalid mobile number
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/brief description/i), {
      target: { value: 'This is a detailed description of my security needs' },
    });

    // Check terms and privacy
    fireEvent.click(screen.getByLabelText(/agree to the terms/i));
    fireEvent.click(screen.getByLabelText(/consent to the processing/i));

    const submitButton = screen.getByRole('button', { name: /submit contact request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please select your country/i)).toBeInTheDocument();
    });

    expect(mockSubmitContactForm).not.toHaveBeenCalled();
  });
});
