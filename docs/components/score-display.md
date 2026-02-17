# ScoreDisplay Component Documentation

## Overview

The `ScoreDisplay` component is a flexible React component designed to display scores and statistics in a visually appealing format. It supports responsive design, customizable styling, and multiple display modes to accommodate various screen sizes and use cases.

## Component API

### Props Interface

```typescript
interface ScoreDisplayProps {
  /** Primary score value to display */
  score: number;
  
  /** Maximum possible score (optional, defaults to 100) */
  maxScore?: number;
  
  /** Label text to display above or alongside the score */
  label?: string;
  
  /** Additional secondary text or subtitle */
  subtitle?: string;
  
  /** Display variant */
  variant?: 'default' | 'compact' | 'minimal' | 'detailed';
  
  /** Size of the component */
  size?: 'small' | 'medium' | 'large';
  
  /** Color theme */
  theme?: 'light' | 'dark' | 'auto';
  
  /** Whether to show percentage format */
  showPercentage?: boolean;
  
  /** Whether to animate score changes */
  animated?: boolean;
  
  /** Duration of animation in milliseconds */
  animationDuration?: number;
  
  /** Custom CSS class name */
  className?: string;
  
  /** Custom inline styles */
  style?: React.CSSProperties;
  
  /** Callback fired when score animation completes */
  onAnimationComplete?: () => void;
}
```

### Default Props

```typescript
const defaultProps: Partial<ScoreDisplayProps> = {
  maxScore: 100,
  variant: 'default',
  size: 'medium',
  theme: 'auto',
  showPercentage: false,
  animated: true,
  animationDuration: 1000,
};
```

## Usage Examples

### Basic Usage

```jsx
import { ScoreDisplay } from '@/components/ScoreDisplay';

// Simple score display
<ScoreDisplay score={85} label="Test Score" />

// With percentage
<ScoreDisplay 
  score={42} 
  maxScore={50} 
  label="Quiz Results" 
  showPercentage 
/>
```

### Variants

```jsx
// Default variant - full featured display
<ScoreDisplay 
  score={92} 
  label="Overall Performance" 
  subtitle="Last 30 days" 
  variant="default" 
/>

// Compact variant - reduced spacing and smaller text
<ScoreDisplay 
  score={78} 
  label="Speed" 
  variant="compact" 
  size="small" 
/>

// Minimal variant - score only
<ScoreDisplay 
  score={95} 
  variant="minimal" 
/>

// Detailed variant - includes progress bar and additional metrics
<ScoreDisplay 
  score={87} 
  maxScore={100}
  label="Accuracy Rating"
  subtitle="Based on 150 attempts"
  variant="detailed"
  animated
/>
```

### Different Sizes

```jsx
// Small - ideal for cards or sidebars
<ScoreDisplay score={75} label="Rating" size="small" />

// Medium - default size for most use cases
<ScoreDisplay score={88} label="Performance" size="medium" />

// Large - prominent displays or dashboards
<ScoreDisplay score={94} label="Success Rate" size="large" />
```

## Responsive Behavior

The ScoreDisplay component adapts to different screen sizes using CSS media queries and responsive design principles.

### Breakpoints

```css
/* Mobile devices - up to 768px */
@media (max-width: 768px) {
  .score-display {
    font-size: clamp(1rem, 4vw, 1.5rem);
    padding: 0.75rem;
  }
}

/* Tablet devices - 768px to 1024px */
@media (min-width: 769px) and (max-width: 1024px) {
  .score-display {
    font-size: clamp(1.25rem, 3vw, 2rem);
    padding: 1rem;
  }
}

/* Desktop devices - 1024px and up */
@media (min-width: 1025px) {
  .score-display {
    font-size: clamp(1.5rem, 2.5vw, 2.5rem);
    padding: 1.5rem;
  }
}
```

### Mobile Layout Examples

```jsx
// Mobile-optimized stacked layout
<div className="mobile-score-container">
  <ScoreDisplay 
    score={89} 
    label="Score" 
    variant="compact" 
    size="small"
  />
</div>

// Mobile grid layout for multiple scores
<div className="score-grid-mobile">
  <ScoreDisplay score={92} label="Math" variant="minimal" />
  <ScoreDisplay score={85} label="Science" variant="minimal" />
  <ScoreDisplay score={78} label="Reading" variant="minimal" />
</div>
```

### Responsive Container Queries

```jsx
// Using container queries for adaptive sizing
<div className="dashboard-widget">
  <ScoreDisplay 
    score={76} 
    label="Completion Rate"
    className="responsive-score"
  />
</div>
```

## Styling Customization

### CSS Custom Properties

The component uses CSS custom properties for easy theming and customization:

```css
.score-display {
  /* Colors */
  --score-primary-color: #2563eb;
  --score-secondary-color: #64748b;
  --score-background-color: #ffffff;
  --score-border-color: #e2e8f0;
  --score-text-color: #1e293b;
  --score-label-color: #64748b;
  
  /* Typography */
  --score-font-family: 'Inter', system-ui, sans-serif;
  --score-font-weight-normal: 400;
  --score-font-weight-bold: 600;
  --score-font-size-small: 0.875rem;
  --score-font-size-medium: 1rem;
  --score-font-size-large: 1.25rem;
  --score-number-size: 2.5rem;
  
  /* Spacing */
  --score-padding-small: 0.75rem;
  --score-padding-medium: 1rem;
  --score-padding-large: 1.5rem;
  --score-gap: 0.5rem;
  --score-border-radius: 0.5rem;
  
  /* Animation */
  --score-transition-duration: 0.3s;
  --score-animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Progress bar (for detailed variant) */
  --score-progress-height: 0.5rem;
  --score-progress-background: #f1f5f9;
  --score-progress-fill: var(--score-primary-color);
}
```

### Theme Variations

```css
/* Dark theme */
.score-display[data-theme="dark"] {
  --score-primary-color: #3b82f6;
  --score-background-color: #1e293b;
  --score-border-color: #334155;
  --score-text-color: #f8fafc;
  --score-label-color: #cbd5e1;
  --score-progress-background: #334155;
}

/* Light theme */
.score-display[data-theme="light"] {
  --score-primary-color: #2563eb;
  --score-background-color: #ffffff;
  --score-border-color: #e2e8f0;
  --score-text-color: #1e293b;
  --score-label-color: #64748b;
  --score-progress-background: #f1f5f9;
}
```

### Custom Styling Examples

```jsx
// Custom color scheme
<ScoreDisplay 
  score={91}
  label="Customer Satisfaction"
  style={{
    '--score-primary-color': '#10b981',
    '--score-background-color': '#f0fdf4',
    '--score-border-color': '#bbf7d0'
  }}
/>

// Custom typography
<ScoreDisplay 
  score={87}
  label="Performance"
  className="custom-font"
  style={{
    '--score-font-family': '"Roboto Mono", monospace',
    '--score-number-size': '3rem'
  }}
/>

// Gradient background
<ScoreDisplay 
  score={95}
  label="Excellence Rating"
  className="gradient-bg"
/>
```

```css
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  --score-text-color: white;
  --score-label-color: rgba(255, 255, 255, 0.8);
}

.custom-font {
  --score-font-family: "Roboto Mono", monospace;
}
```

## Integration Patterns

### With State Management

```jsx
import { useSelector } from 'react-redux';
import { ScoreDisplay } from '@/components/ScoreDisplay';

const DashboardScore = () => {
  const userScore = useSelector(state => state.user.currentScore);
  const isLoading = useSelector(state => state.user.loading);
  
  if (isLoading) {
    return <ScoreDisplay score={0} label="Loading..." animated={false} />;
  }
  
  return (
    <ScoreDisplay 
      score={userScore} 
      label="Your Current Score"
      variant="detailed"
      onAnimationComplete={() => {
        // Track score display completion
        analytics.track('score_displayed', { score: userScore });
      }}
    />
  );
};
```

### With Form Validation

```jsx
import { ScoreDisplay } from '@/components/ScoreDisplay';

const FormWithScore = () => {
  const [validationScore, setValidationScore] = useState(0);
  
  const calculateValidationScore = (formData) => {
    // Custom validation logic
    let score = 0;
    if (formData.email) score += 25;
    if (formData.password?.length >= 8) score += 25;
    if (formData.confirmPassword === formData.password) score += 25;
    if (formData.terms) score += 25;
    return score;
  };
  
  return (
    <form>
      {/* Form fields */}
      <ScoreDisplay 
        score={validationScore}
        label="Form Completion"
        variant="compact"
        size="small"
        showPercentage
      />
    </form>
  );
};
```

### With Real-time Updates

```jsx
import { useEffect, useState } from 'react';
import { ScoreDisplay } from '@/components/ScoreDisplay';

const LiveScoreTracker = ({ gameId }) => {
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    const ws = new WebSocket(`/api/games/${gameId}/score`);
    
    ws.onmessage = (event) => {
      const newScore = JSON.parse(event.data).score;
      setScore(newScore);
    };
    
    return () => ws.close();
  }, [gameId]);
  
  return (
    <ScoreDisplay 
      score={score}
      label="Live Score"
      animated
      animationDuration={500}
    />
  );
};
```

### Accessibility Features

The ScoreDisplay component includes built-in accessibility features:

```jsx
// Semantic HTML and ARIA attributes
<ScoreDisplay 
  score={88}
  label="Test Results"
  // Automatically includes:
  // - role="img"
  // - aria-label="Test Results: 88 out of 100"
  // - aria-describedby for additional context
/>

// Custom accessibility
<ScoreDisplay 
  score={92}
  label="Performance Rating"
  aria-label="Excellent performance rating of 92 percent"
  aria-describedby="score-context"
/>
```

## Performance Considerations

- Uses `React.memo` for preventing unnecessary re-renders
- Leverages CSS animations for smooth transitions
- Implements lazy loading for large datasets
- Optimizes font loading with `font-display: swap`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+

## Migration Guide

### From v1.x to v2.x

```jsx
// v1.x
<ScoreDisplay value={85} title="Score" />

// v2.x
<ScoreDisplay score={85} label="Score" />
```

Key changes:
- `value` prop renamed to `score`
- `title` prop renamed to `label`
- Added `variant` prop for different display modes
- Improved responsive behavior
- Enhanced accessibility features