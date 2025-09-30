# Initial Onboarding Form - Test Plan

## Test Objectives
Ensure the progressive multi-step intake form functions correctly across all devices and browsers, with proper state management, validation, and user experience.

## Test Categories

### 1. Functional Testing

#### 1.1 Form Navigation
- [ ] **Step Progression**: Verify each step advances to the next question
- [ ] **Step Regression**: Verify back navigation works correctly
- [ ] **Progress Indicator**: Confirm step counter updates (Step X of Y)
- [ ] **Summary Cards**: Verify completed steps show as summary cards
- [ ] [ ] **Required Field Validation**: Ensure mandatory fields are validated
- [ ] **Step Skipping**: Prevent skipping steps without completing required fields

#### 1.2 Data Capture
- [ ] **Service Needs**
  - [ ] Service type selection (White box, Gray box, Black box, All)
  - [ ] Expected outcomes (multiple selection)
  - [ ] Current challenges (text input)
- [ ] **Timing & Urgency**
  - [ ] Service start timeline selection
  - [ ] Decision timeline selection
- [ ] **Budget**
  - [ ] Budget allocation (Yes/No)
  - [ ] Currency selection (auto-detect from country)
  - [ ] Budget range selection
- [ ] **Decision Process**
  - [ ] Project lead name input
  - [ ] Decision factors (multiple selection)
- [ ] **Source**
  - [ ] How they heard about us selection

#### 1.3 State Management
- [ ] **Data Persistence**: Verify form data persists across step navigation
- [ ] **State Updates**: Confirm state updates correctly for each field
- [ ] **Data Validation**: Ensure data integrity throughout form completion

#### 1.4 Summary & Review
- [ ] **Summary Display**: All responses shown in organized cards
- [ ] **Edit Functionality**: Edit buttons work for each section
- [ ] **Data Accuracy**: Summary matches entered data
- [ ] **Submit Function**: Console.log outputs correct JSON data

### 2. Integration Testing

#### 2.1 URL Parameter Integration
- [ ] **Email Pre-population**: Email from URL parameters populates correctly
- [ ] **Country Detection**: Country parameter detection works
- [ ] **Currency Auto-detection**: Currency symbol updates based on country
- [ ] **Parameter Validation**: Invalid parameters handled gracefully

#### 2.2 Header Integration
- [ ] **Header Display**: NeedsAssessmentHeader renders correctly
- [ ] **Logo Navigation**: Logo click navigates to homepage
- [ ] **Responsive Header**: Header adapts to mobile/desktop

### 3. User Experience Testing

#### 3.1 Progressive Disclosure
- [ ] **One Question Display**: Only one question visible at a time
- [ ] **Smooth Transitions**: Animations work smoothly between steps
- [ ] **Summary Collapse**: Completed questions collapse into summary cards
- [ ] **Visual Hierarchy**: Clear visual distinction between current and completed steps

#### 3.2 Mobile Responsiveness
- [ ] **Mobile Layout**: Form displays correctly on mobile devices
- [ ] **Touch Interactions**: Touch targets are appropriately sized
- [ ] **Keyboard Navigation**: Tab navigation works correctly
- [ ] **Viewport Adaptation**: Form adapts to different screen sizes

#### 3.3 Accessibility
- [ ] **Screen Reader**: Form is accessible to screen readers
- [ ] **Keyboard Navigation**: All interactions work with keyboard only
- [ ] **Focus Management**: Focus moves appropriately between steps
- [ ] **ARIA Labels**: Proper ARIA labels for form elements

### 4. Performance Testing

#### 4.1 Load Performance
- [ ] **Initial Load**: Form loads quickly on first visit
- [ ] **Step Transitions**: Smooth animations without lag
- [ ] **Memory Usage**: No memory leaks during form interaction

#### 4.2 Browser Compatibility
- [ ] **Chrome**: Full functionality in latest Chrome
- [ ] **Firefox**: Full functionality in latest Firefox
- [ ] **Safari**: Full functionality in latest Safari
- [ ] **Edge**: Full functionality in latest Edge

### 5. Error Handling Testing

#### 5.1 Validation Errors
- [ ] **Required Fields**: Clear error messages for missing required fields
- [ ] **Invalid Input**: Appropriate error handling for invalid data
- [ ] **Network Errors**: Graceful handling of network issues

#### 5.2 Edge Cases
- [ ] **Empty Form Submission**: Prevents submission of empty forms
- [ ] **Browser Back Button**: Handles browser navigation correctly
- [ ] **Page Refresh**: Form state persists or recovers appropriately

### 6. Data Testing

#### 6.1 Form Submission
- [ ] **JSON Output**: Console.log outputs properly formatted JSON
- [ ] **Data Completeness**: All captured data included in output
- [ ] **Data Format**: JSON structure matches expected format

#### 6.2 Field Validation
- [ ] **Text Input**: Text fields accept appropriate input
- [ ] **Selection Fields**: Radio and checkbox selections work correctly
- [ ] **Textarea**: Multi-line text input functions properly

## Test Data

### Valid Test Cases
- Complete form with all fields filled
- Form with minimal required fields only
- Form with maximum character limits
- Form with special characters in text fields

### Invalid Test Cases
- Empty required fields
- Invalid email formats
- Extremely long text inputs
- Special characters in inappropriate fields

## Test Environment
- **Desktop**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Tablet**: iPad Safari, Chrome Tablet
- **Screen Sizes**: 320px, 768px, 1024px, 1440px, 1920px

## Success Criteria
- All functional tests pass
- Form works across all target browsers
- Mobile experience is smooth and intuitive
- Data capture is accurate and complete
- Performance meets acceptable standards
- Accessibility requirements are met
