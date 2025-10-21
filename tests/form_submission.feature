Feature: Form Submission (MDP-8)
  As a website visitor
  I want to submit a registration form with required personal details
  So that I can register for the service

  # ---------------------------
  # POSITIVE (Happy Path) Scenarios
  # ---------------------------

  Scenario: Successful submission with all required valid data
    Given the user is on the registration form
    When they enter "Alice" into the First Name field
    And they enter "Johnson" into the Last Name field
    And they enter "alice.johnson@example.com" into the Email field
    And they enter "+15551234567" into the Phone Number field
    And they enter "123 Market Street, Springfield" into the Address field
    And they select "USA" from the Country dropdown
    And they select "English" from the Preferred Language dropdown
    And they submit the form
    Then a confirmation message "Thank you for registering!" is displayed
    And the form data is sent to the backend (API 200 OK)

  Scenario Outline: Successful submission for each supported country and language combination
    Given the user is on the registration form
    When they enter "<firstName>" into the First Name field
    And they enter "<lastName>" into the Last Name field
    And they enter "<email>" into the Email field
    And they enter "<phone>" into the Phone Number field
    And they enter "<address>" into the Address field
    And they select "<country>" from the Country dropdown
    And they select "<language>" from the Preferred Language dropdown
    And they submit the form
    Then a confirmation message "Thank you for registering!" is displayed

    Examples:
      | firstName | lastName | email                      | phone         | address                      | country   | language |
      | Alice     | Smith    | alice.smith@example.com    | +15551234567  | 1 Main Street, Boston        | USA       | English  |
      | Brian     | Cole     | brian.cole@example.co.uk   | +447700900123 | 22 King Rd, London           | UK        | English  |
      | Camille   | Roy      | camille.roy@example.ca     | +15145550123  | 77 Rue Sainte-Catherine, QC  | Canada    | French   |
      | Diego     | Alvarez  | diego.alvarez@example.com  | +61123456789  | 10 Harbour St, Sydney        | Australia | Spanish  |

  # ---------------------------
  # NEGATIVE Scenarios (Validation & Required Fields)
  # ---------------------------

  Scenario: Submission fails when all fields are empty
    Given the user is on the registration form
    When they submit the form
    Then an error is shown for First Name "This field is required"
    And an error is shown for Last Name "This field is required"
    And an error is shown for Email "This field is required"
    And an error is shown for Phone Number "This field is required"
    And an error is shown for Address "This field is required"
    And an error is shown for Country "Selection required"
    And an error is shown for Preferred Language "Selection required"
    And no confirmation message is displayed

  Scenario: Submission fails when one required field (Email) is missing
    Given the user is on the registration form
    When they fill all fields with valid data except Email is left blank
    And they submit the form
    Then an error is shown for Email "This field is required"
    And the form is not submitted

  Scenario: Submission fails with invalid email format
    Given the user is on the registration form
    When they enter "user@@example..com" into the Email field
    And they fill the remaining fields with valid data
    And they submit the form
    Then an error is shown for Email "Enter a valid email address"
    And no confirmation message is displayed

  Scenario: Submission fails with invalid phone number format
    Given the user is on the registration form
    When they enter "ABC123PHONE" into the Phone Number field
    And they fill the remaining fields with valid data
    And they submit the form
    Then an error is shown for Phone Number "Enter a valid phone number"
    And no confirmation message is displayed

  Scenario: Submission fails when Country is not selected
    Given the user is on the registration form
    When they fill all fields with valid data
    And they do not select a Country
    And they submit the form
    Then an error is shown for Country "Selection required"

  Scenario: Submission fails when Preferred Language is not selected
    Given the user is on the registration form
    When they fill all fields with valid data
    And they do not select a Preferred Language
    And they submit the form
    Then an error is shown for Preferred Language "Selection required"

  Scenario: User attempts to bypass validation via disabled client-side checks
    Given the user disables form field 'required' attributes using browser dev tools
    When they submit the form with blank fields
    Then the server responds with validation errors
    And no confirmation message is displayed

  # ---------------------------
  # EDGE / BOUNDARY Scenarios
  # ---------------------------

  Scenario: Minimum plausible input lengths
    Given the user is on the registration form
    When they enter "A" into the First Name field
    And they enter "B" into the Last Name field
    And they enter "a@b.co" into the Email field
    And they enter "+1" into the Phone Number field
    And they enter "X" into the Address field
    And they select "USA" from the Country dropdown
    And they select "English" from the Preferred Language dropdown
    And they submit the form
    Then a confirmation message "Thank you for registering!" is displayed (if policy allows)

  Scenario: Extremely long input values (approaching max length)
    Given the user is on the registration form
    When they enter a 100-character First Name
    And they enter a 100-character Last Name
    And they enter a valid email with 64-char local part
    And they enter a 20-digit phone number "+1555123456789012345"
    And they enter a 255-character Address
    And they select "Canada" from the Country dropdown
    And they select "French" from the Preferred Language dropdown
    And they submit the form
    Then the form should either truncate or validate length
    And if accepted a confirmation message "Thank you for registering!" is displayed

  Scenario: Leading and trailing spaces are trimmed
    Given the user is on the registration form
    When they enter "  Alice  " into the First Name field
    And they enter "  Johnson " into the Last Name field
    And they enter " alice.johnson@example.com " into the Email field
    And they enter " +15551234567 " into the Phone Number field
    And they enter " 123 Market Street " into the Address field
    And they select "USA" from the Country dropdown
    And they select "English" from the Preferred Language dropdown
    And they submit the form
    Then the stored values exclude surrounding spaces
    And a confirmation message "Thank you for registering!" is displayed

  Scenario: Duplicate submission prevention (double click)
    Given the user is on the registration form
    When they fill all fields with valid data
    And they double click the submit button rapidly
    Then only one submission is processed
    And the confirmation message appears once

  Scenario: Refresh after successful submission
    Given the user has successfully submitted the form
    When they refresh the page
    Then the form should be cleared (or replaced by success state)
    And they should not accidentally resubmit on refresh

  Scenario: Back button after submission
    Given the user has successfully submitted the form
    When they navigate back using the browser back button
    Then either the form is cleared or re-validation is enforced on resubmit

  Scenario: Network failure during submission
    Given the user is on the registration form
    And they filled all fields with valid data
    When the network request fails with a 500 status
    Then an error message "An unexpected error occurred. Please try again." is displayed
    And no success confirmation is shown

  Scenario: Slow network / pending submission state
    Given the user is on the registration form
    And they filled all fields with valid data
    When the submission request is pending for more than 5 seconds
    Then a loading indicator is displayed
    And the submit button is disabled until completion

  Scenario: Re-submission after server-side validation error
    Given an earlier submission failed due to invalid email format
    When the user corrects the Email field
    And they resubmit the form
    Then a confirmation message "Thank you for registering!" is displayed

  # ---------------------------
  # SECURITY / DATA INTEGRITY
  # ---------------------------

  Scenario: HTML/script injection attempt
    Given the user is on the registration form
    When they enter "<script>alert('x')</script>" into the First Name field
    And they fill the remaining fields with valid data
    And they submit the form
    Then the input is escaped or sanitized
    And no script executes
    And (if invalid) a validation error is shown

  Scenario: SQL keyword injection attempt
    Given the user is on the registration form
    When they enter "Robert'); DROP TABLE Users;--" into the Last Name field
    And they fill the remaining fields with valid data
    And they submit the form
    Then the submission is safely handled without server error
    And data is stored or rejected per validation rules

  # ---------------------------
  # DATA SET (Reference)
  # ---------------------------
  # Valid Emails: alice.smith@example.com, brian.cole@example.co.uk, camille.roy@example.ca
  # Invalid Emails: user@@example..com, plainaddress, user@.invalid
  # Valid Phones: +15551234567, +447700900123, +15145550123
  # Invalid Phones: ABC123PHONE, 123, ++++
  # Countries: USA, UK, Canada, Australia
  # Languages: English, Spanish, French
  # Edge Lengths: First/Last 1 char, Address 1 char, Address 255 chars

  # ---------------------------
  # AD HOC / EXPLORATORY Scenarios
  # (Non-deterministic or beyond strict ACs; some may require manual validation.)
  # ---------------------------

  Scenario: Browser autofill populates fields and submission still validates
    Given the browser autofills First Name "Jane" Last Name "Doe" Email "jane.doe@example.com" Phone "+15559876543" Address "500 Auto Way"
    And the user selects "USA" from the Country dropdown
    And the user selects "English" from the Preferred Language dropdown
    When they submit the form
    Then a confirmation message "Thank you for registering!" is displayed

  Scenario: Mobile viewport layout preserves required indicators
    Given the user resizes the viewport to 375x812 (mobile)
    When they view the registration form
    Then each required field displays an asterisk or required hint
    And no field labels wrap in a way that hides meaning

  Scenario: Pasting multiline text into Address is normalized
    Given the user copies a multiline address to the clipboard
      """\n123 Multi Line St\nSuite 7\nSpringfield\n"""
    When they paste it into the Address field
    Then newlines are either preserved (if supported) or converted to spaces safely
    And the form can still be submitted after remaining fields are valid

  Scenario: Rapid toggling country and language before submit keeps last selection
    Given the user is on the registration form
    When they select "USA" then "UK" then "Canada" for Country
    And they select "English" then "French" for Preferred Language
    And they complete remaining fields with valid data
    And they submit the form
    Then the submission uses Country "Canada" and Language "French"

  Scenario: Navigating away mid-entry and returning clears sensitive data
    Given the user has partially filled the form with a valid Email and Phone
    When they navigate to another page
    And they return via the browser back button
    Then sensitive fields (Email, Phone) are cleared (if security policy) or flagged for revalidation

  Scenario: Clipboard contains script tag but paste is sanitized
    Given the clipboard contains "<script>alert('p')</script>"
    When the user pastes into the First Name field
    Then the value stored renders as escaped text
    And no script executes

  Scenario: Two parallel tabs submit the form simultaneously
    Given the user opens the registration form in two tabs
    When both tabs submit valid but identical data within 1 second
    Then either only one registration record is stored or duplicates are flagged

  Scenario: User changes preferred language after filling fields
    Given the user filled all form fields and selected Preferred Language "English"
    When they change Preferred Language to "Spanish" before submitting
    And they submit the form
    Then the stored record reflects Preferred Language "Spanish"

  Scenario: Accessibility - error messages announced by screen reader
    Given the user submits an empty form
    When error messages appear
    Then each invalid input has aria-invalid="true"
    And each error message is associated via aria-describedby

  Scenario: Performance under slow 3G still shows feedback quickly
    Given network throttling is set to slow 3G
    When the user submits a valid form
    Then a visual loading state appears within 500 ms
    And final confirmation appears within acceptable performance SLA (e.g., 5 s)

  Scenario: Duplicate email registration shows existing-user guidance
    Given the user previously registered with Email "alice.smith@example.com"
    When they submit the form again with the same email and other valid data
    Then an informational message "This email is already registered" is displayed
    And no duplicate record is created

  Scenario: International characters accepted in names
    Given the user enters "Łukasz" into the First Name field
    And they enter "García" into the Last Name field
    And they complete remaining fields with valid data
    When they submit the form
    Then a confirmation message "Thank you for registering!" is displayed
    And stored data preserves diacritics

  Scenario: Attempt to inject unsupported country value via dev tools
    Given the user alters the Country dropdown DOM value to "Mars"
    And they submit the form with otherwise valid data
    Then a validation error "Invalid country selection" is displayed
    And the submission is rejected

  Scenario: Session timeout while form is open
    Given the user keeps the form open beyond the session timeout threshold
    When they attempt to submit valid data afterward
    Then they are prompted to refresh or re-authenticate (if applicable)
    And no data is accepted until session is renewed

  # End AD HOC / EXPLORATORY
