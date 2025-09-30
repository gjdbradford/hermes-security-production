# Initial Onboarding Form - Build Plan

## Overview
Build a progressive multi-step intake form for capturing initial needs assessment information from prospective clients. The form will be clean, modern, mobile-friendly, and easy to use.

## Technical Requirements

### Core Features
1. **Progressive Disclosure**: One question at a time with collapsing summary cards
2. **Progress Tracking**: Visual progress indicator (Step X of Y)
3. **State Management**: All responses stored in React state
4. **Summary Review**: Final step shows complete summary with edit capabilities
5. **Email Integration**: Pre-populate email from URL parameters
6. **Country/Currency Integration**: Auto-detect currency based on country

### Form Structure
- **Step 1**: Service Needs (RadioGroup + CheckboxGroup + Textarea)
- **Step 2**: Timing & Urgency (2 RadioGroups)
- **Step 3**: Budget (Yes/No + Currency + Range)
- **Step 4**: Decision Process (Input + CheckboxGroup)
- **Step 5**: Source (RadioGroup)
- **Step 6**: Summary & Review

### Technical Stack
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- Framer Motion for animations
- React Router for navigation

## Implementation Steps

### Phase 1: Setup & Structure
1. Create `InitialOnboardingForm.tsx` component
2. Add routing in `App.tsx`
3. Set up form state management
4. Implement progress indicator

### Phase 2: Form Steps
1. **Service Needs Step**
   - Service type selection (White box, Gray box, Black box, All)
   - Expected outcomes (checkbox group)
   - Current challenges (textarea)

2. **Timing & Urgency Step**
   - Service start timeline
   - Decision timeline

3. **Budget Step**
   - Budget allocation (Yes/No)
   - Currency selection (auto-detect from country)
   - Budget range selection

4. **Decision Process Step**
   - Project lead input
   - Decision factors (checkbox group)

5. **Source Step**
   - How they heard about us (radio group)

### Phase 3: Summary & Submission
1. **Summary Step**
   - Display all responses in cards
   - Edit buttons for each section
   - Submit functionality (console.log for now)

### Phase 4: Integration
1. Use existing `NeedsAssessmentHeader` component
2. Email parameter extraction from URL
3. Country/currency detection
4. Responsive design implementation

## File Structure
```
src/
├── pages/
│   └── InitialOnboardingForm.tsx
├── components/
│   └── InitialOnboardingForm/
│       ├── FormStep.tsx
│       ├── SummaryCard.tsx
│       └── ProgressIndicator.tsx
└── types/
    └── onboarding.ts
```

## Dependencies
- Existing shadcn/ui components
- Framer Motion for animations
- React Router for navigation
- URL parameter parsing for email/country

## Success Criteria
- Form displays one question at a time
- Smooth animations between steps
- All data captured in state
- Summary review functionality
- Mobile-responsive design
- Email pre-population from URL
- Currency auto-detection
