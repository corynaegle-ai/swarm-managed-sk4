# ScoreEntry Component Documentation

## Overview

The ScoreEntry component is a specialized input component designed for entering and validating numerical scores. It provides real-time validation, score calculation, and formatting capabilities with a user-friendly interface.

## Import

```javascript
import { ScoreEntry } from '@/components/ScoreEntry';
```

## Props Interface

```typescript
interface ScoreEntryProps {
  /** Current score value */
  value: number | string;
  
  /** Callback function called when score changes */
  onChange: (value: number) => void;
  
  /** Minimum allowed score (default: 0) */
  minScore?: number;
  
  /** Maximum allowed score (default: 100) */
  maxScore?: number;
  
  /** Number of decimal places allowed (default: 1) */
  decimalPlaces?: number;
  
  /** Whether the input is disabled */
  disabled?: boolean;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Label for the input field */
  label?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Input field ID */
  id?: string;
  
  /** Whether to show score as percentage */
  showAsPercentage?: boolean;
  
  /** Custom validation function */
  validator?: (value: number) => string | null;
  
  /** Whether to auto-format the score */
  autoFormat?: boolean;
}
```

## Basic Usage

### Simple Score Entry

```javascript
import React, { useState } from 'react';
import { ScoreEntry } from '@/components/ScoreEntry';

function BasicExample() {
  const [score, setScore] = useState(0);

  return (
    <ScoreEntry
      value={score}
      onChange={setScore}
      label="Student Score"
      placeholder="Enter score..."
    />
  );
}
```

### Score Entry with Custom Range

```javascript
function CustomRangeExample() {
  const [score, setScore] = useState(0);

  return (
    <ScoreEntry
      value={score}
      onChange={setScore}
      minScore={0}
      maxScore={50}
      label="Quiz Score (out of 50)"
      placeholder="0-50"
    />
  );
}
```

### Percentage Score Entry

```javascript
function PercentageExample() {
  const [score, setScore] = useState(0);

  return (
    <ScoreEntry
      value={score}
      onChange={setScore}
      showAsPercentage={true}
      label="Assignment Grade"
      placeholder="Enter percentage..."
    />
  );
}
```

### Score Entry with Custom Validation

```javascript
function CustomValidationExample() {
  const [score, setScore] = useState(0);

  const customValidator = (value) => {
    if (value % 5 !== 0) {
      return "Score must be a multiple of 5";
    }
    return null;
  };

  return (
    <ScoreEntry
      value={score}
      onChange={setScore}
      validator={customValidator}
      label="Bonus Points"
      placeholder="Enter score in increments of 5"
    />
  );
}
```

## Scoring Algorithm and Rules

### Score Calculation

The ScoreEntry component applies the following calculation process:

1. **Input Sanitization**: Removes non-numeric characters except decimal points
2. **Range Validation**: Ensures score falls within min/max bounds
3. **Decimal Precision**: Rounds to specified decimal places
4. **Format Application**: Applies percentage or standard formatting

### Calculation Examples

#### Standard Score (0-100 range)

```javascript
// Input: "85.67"
// minScore: 0, maxScore: 100, decimalPlaces: 1
// Output: 85.7

// Input: "105"
// minScore: 0, maxScore: 100
// Output: 100 (clamped to maximum)

// Input: "-5"
// minScore: 0, maxScore: 100
// Output: 0 (clamped to minimum)
```

#### Custom Range Score

```javascript
// Input: "42.8"
// minScore: 0, maxScore: 50, decimalPlaces: 1
// Output: 42.8

// Input: "55"
// minScore: 0, maxScore: 50
// Output: 50 (clamped to maximum)
```

#### Percentage Score

```javascript
// Input: "87.5" with showAsPercentage: true
// Display: "87.5%"
// Stored value: 87.5

// Input: "150" with showAsPercentage: true
// Display: "100%" (clamped)
// Stored value: 100
```

### Scoring Rules

1. **Range Enforcement**: Scores are automatically clamped to the specified min/max range
2. **Decimal Precision**: Values are rounded to the specified number of decimal places
3. **Input Filtering**: Only numeric input with decimal points is allowed
4. **Real-time Validation**: Validation occurs on every keystroke and blur event
5. **Error States**: Invalid inputs trigger error states with descriptive messages

## Validation Behavior

### Built-in Validation Rules

The component includes several built-in validation rules:

#### Numeric Validation
```javascript
// Valid inputs
"85"      // Integer
"85.5"    // Decimal
"0"       // Zero
"100.0"   // Decimal with trailing zero

// Invalid inputs (filtered out)
"85a"     // Contains letters
"85.5.5"  // Multiple decimal points
"--85"    // Multiple negative signs
```

#### Range Validation
```javascript
// With minScore: 0, maxScore: 100
const examples = [
  { input: "50", output: 50, valid: true },
  { input: "105", output: 100, valid: true, note: "Clamped to max" },
  { input: "-10", output: 0, valid: true, note: "Clamped to min" },
  { input: "abc", output: null, valid: false, error: "Invalid number" }
];
```

#### Decimal Places Validation
```javascript
// With decimalPlaces: 1
const examples = [
  { input: "85.67", output: 85.7, note: "Rounded to 1 decimal" },
  { input: "85.64", output: 85.6, note: "Rounded down" },
  { input: "85", output: 85.0, note: "Maintains decimal format" }
];
```

### Custom Validation

You can provide custom validation logic using the `validator` prop:

```javascript
const validateEvenNumbers = (value) => {
  if (value % 2 !== 0) {
    return "Score must be an even number";
  }
  return null; // No error
};

<ScoreEntry
  value={score}
  onChange={setScore}
  validator={validateEvenNumbers}
  label="Even Score Only"
/>
```

### Validation States

The component displays different states based on validation results:

- **Valid**: Normal appearance with green border (optional)
- **Invalid**: Red border with error message below input
- **Warning**: Yellow border for values at min/max bounds
- **Disabled**: Grayed out appearance when disabled prop is true

### Error Messages

Common error messages include:

- `"Score must be between {min} and {max}"` - Range validation
- `"Invalid number format"` - Non-numeric input
- `"Score cannot be empty"` - Required field validation
- Custom messages from validator function

## Advanced Examples

### Multi-Score Form

```javascript
function MultiScoreForm() {
  const [scores, setScores] = useState({
    homework: 0,
    quiz: 0,
    exam: 0
  });

  const updateScore = (field) => (value) => {
    setScores(prev => ({ ...prev, [field]: value }));
  };

  const totalScore = (scores.homework * 0.3) + 
                    (scores.quiz * 0.2) + 
                    (scores.exam * 0.5);

  return (
    <div className="score-form">
      <ScoreEntry
        value={scores.homework}
        onChange={updateScore('homework')}
        label="Homework (30%)"
        maxScore={100}
      />
      
      <ScoreEntry
        value={scores.quiz}
        onChange={updateScore('quiz')}
        label="Quiz (20%)"
        maxScore={100}
      />
      
      <ScoreEntry
        value={scores.exam}
        onChange={updateScore('exam')}
        label="Exam (50%)"
        maxScore={100}
      />
      
      <div className="total-score">
        Final Grade: {totalScore.toFixed(1)}%
      </div>
    </div>
  );
}
```

### Dynamic Score Ranges

```javascript
function DynamicRangeExample() {
  const [scoreType, setScoreType] = useState('percentage');
  const [score, setScore] = useState(0);

  const getScoreConfig = () => {
    switch (scoreType) {
      case 'percentage':
        return { min: 0, max: 100, decimal: 1, suffix: '%' };
      case 'gpa':
        return { min: 0, max: 4, decimal: 2, suffix: '' };
      case 'points':
        return { min: 0, max: 1000, decimal: 0, suffix: ' pts' };
      default:
        return { min: 0, max: 100, decimal: 1, suffix: '' };
    }
  };

  const config = getScoreConfig();

  return (
    <div>
      <select 
        value={scoreType} 
        onChange={(e) => setScoreType(e.target.value)}
      >
        <option value="percentage">Percentage</option>
        <option value="gpa">GPA</option>
        <option value="points">Points</option>
      </select>
      
      <ScoreEntry
        value={score}
        onChange={setScore}
        minScore={config.min}
        maxScore={config.max}
        decimalPlaces={config.decimal}
        label={`Score (${scoreType})`}
      />
    </div>
  );
}
```

## Accessibility Features

The ScoreEntry component includes built-in accessibility features:

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Error Announcements**: Screen reader compatible error messages

```javascript
<ScoreEntry
  id="student-score"
  label="Student Score"
  aria-describedby="score-help"
  value={score}
  onChange={setScore}
/>
```

## Styling and Customization

The component accepts custom CSS classes and follows a consistent design system:

```javascript
<ScoreEntry
  className="custom-score-input"
  value={score}
  onChange={setScore}
  // Custom styling will be applied
/>
```

Default CSS classes available for styling:
- `.score-entry` - Main container
- `.score-entry__input` - Input field
- `.score-entry__label` - Label element
- `.score-entry__error` - Error message
- `.score-entry--invalid` - Invalid state modifier
- `.score-entry--disabled` - Disabled state modifier

This documentation provides a complete guide to using the ScoreEntry component effectively in your applications.