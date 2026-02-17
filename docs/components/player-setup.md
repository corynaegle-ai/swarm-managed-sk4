# PlayerSetup Component

## Overview
The `PlayerSetup` component provides a comprehensive form interface for creating and editing player profiles. It includes form validation, file upload capabilities, and integration with the player management API.

## Import
```javascript
import { PlayerSetup } from '@/components/PlayerSetup';
```

## Basic Usage

### Create New Player
```javascript
import React from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';

function CreatePlayer() {
  const handlePlayerCreated = (playerData) => {
    console.log('Player created:', playerData);
    // Redirect to player profile or show success message
  };

  const handleError = (error) => {
    console.error('Player creation failed:', error);
    // Show error message to user
  };

  return (
    <PlayerSetup
      mode="create"
      onSuccess={handlePlayerCreated}
      onError={handleError}
    />
  );
}
```

### Edit Existing Player
```javascript
import React from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';

function EditPlayer({ playerId, initialData }) {
  const handlePlayerUpdated = (playerData) => {
    console.log('Player updated:', playerData);
    // Show success message or redirect
  };

  return (
    <PlayerSetup
      mode="edit"
      playerId={playerId}
      initialData={initialData}
      onSuccess={handlePlayerUpdated}
      onError={(error) => console.error(error)}
    />
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `mode` | `'create' \| 'edit'` | Determines whether the component is creating a new player or editing an existing one |
| `onSuccess` | `(player: Player) => void` | Callback function called when player is successfully created/updated |
| `onError` | `(error: Error) => void` | Callback function called when an error occurs |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `playerId` | `string` | `undefined` | Player ID for edit mode (required when mode is 'edit') |
| `initialData` | `Partial<PlayerFormData>` | `{}` | Initial form data for pre-populating fields |
| `className` | `string` | `''` | Additional CSS classes to apply to the container |
| `showAvatar` | `boolean` | `true` | Whether to show the avatar upload section |
| `allowedPositions` | `string[]` | `['goalkeeper', 'defender', 'midfielder', 'forward']` | Array of allowed positions |
| `allowedSkillLevels` | `string[]` | `['beginner', 'intermediate', 'advanced', 'professional']` | Array of allowed skill levels |
| `onCancel` | `() => void` | `undefined` | Callback for cancel action (shows cancel button if provided) |
| `submitButtonText` | `string` | `'Save Player'` (create) / `'Update Player'` (edit) | Custom text for submit button |
| `validateOnChange` | `boolean` | `true` | Whether to validate fields on change or only on submit |
| `apiEndpoint` | `string` | `'/api/v1/players'` | Custom API endpoint for player operations |

### TypeScript Interfaces

```typescript
interface PlayerFormData {
  name: string;
  email: string;
  username: string;
  dateOfBirth: string;
  position: string;
  skillLevel: string;
  preferredFoot?: 'left' | 'right' | 'both';
  height?: number;
  weight?: number;
  bio?: string;
  avatar?: File;
}

interface Player extends PlayerFormData {
  id: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlayerSetupProps {
  mode: 'create' | 'edit';
  onSuccess: (player: Player) => void;
  onError: (error: Error) => void;
  playerId?: string;
  initialData?: Partial<PlayerFormData>;
  className?: string;
  showAvatar?: boolean;
  allowedPositions?: string[];
  allowedSkillLevels?: string[];
  onCancel?: () => void;
  submitButtonText?: string;
  validateOnChange?: boolean;
  apiEndpoint?: string;
}
```

## Advanced Usage Examples

### With Custom Validation
```javascript
import React from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';

function CustomPlayerSetup() {
  const customPositions = ['midfielder', 'forward']; // Only allow certain positions
  const customSkillLevels = ['intermediate', 'advanced']; // Restrict skill levels

  return (
    <PlayerSetup
      mode="create"
      allowedPositions={customPositions}
      allowedSkillLevels={customSkillLevels}
      validateOnChange={false} // Only validate on submit
      onSuccess={(player) => {
        // Custom success handling
        window.location.href = `/players/${player.id}`;
      }}
      onError={(error) => {
        // Custom error handling
        alert(`Error: ${error.message}`);
      }}
    />
  );
}
```

### Modal Integration
```javascript
import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { PlayerSetup } from '@/components/PlayerSetup';

function PlayerModal({ isOpen, onClose, mode = 'create', player = null }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = (playerData) => {
    setIsLoading(false);
    onClose();
    // Refresh player list or navigate
  };

  const handleError = (error) => {
    setIsLoading(false);
    console.error('Player operation failed:', error);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode} Player`}>
      <PlayerSetup
        mode={mode}
        playerId={player?.id}
        initialData={player}
        onSuccess={handleSuccess}
        onError={handleError}
        onCancel={onClose}
        className="modal-content"
      />
    </Modal>
  );
}
```

### With Form State Management
```javascript
import React, { useState, useEffect } from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';

function PlayerSetupWithState() {
  const [formData, setFormData] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Warn user about unsaved changes
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleFormChange = (data) => {
    setFormData(data);
    setIsDirty(true);
  };

  const handleSuccess = (player) => {
    setIsDirty(false);
    // Handle success
  };

  return (
    <PlayerSetup
      mode="create"
      onSuccess={handleSuccess}
      onError={(error) => console.error(error)}
      onFormChange={handleFormChange} // Custom prop for tracking changes
    />
  );
}
```

## Form Fields

### Required Fields
- **Name**: Text input for player's full name
- **Email**: Email input with validation
- **Username**: Text input with uniqueness validation
- **Date of Birth**: Date picker with age validation
- **Position**: Dropdown selection
- **Skill Level**: Radio buttons or dropdown

### Optional Fields
- **Preferred Foot**: Radio buttons (Left, Right, Both)
- **Height**: Number input with unit display (cm)
- **Weight**: Number input with unit display (kg)
- **Bio**: Textarea for player description
- **Avatar**: File upload with image preview

## Validation

### Client-side Validation
The component includes comprehensive client-side validation:

```javascript
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/ // Letters and spaces only
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Valid email format
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/, // Alphanumeric and underscores
    async: true // Checks uniqueness via API
  },
  dateOfBirth: {
    required: true,
    validate: (date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 13; // Minimum age requirement
    }
  },
  height: {
    min: 100,
    max: 250
  },
  weight: {
    min: 30,
    max: 200
  },
  bio: {
    maxLength: 500
  }
};
```

### Error Display
```javascript
// Error states are automatically managed and displayed
const errorMessages = {
  'name.required': 'Name is required',
  'name.minLength': 'Name must be at least 2 characters',
  'email.pattern': 'Please enter a valid email address',
  'username.unique': 'Username is already taken',
  'dateOfBirth.age': 'Player must be at least 13 years old'
};
```

## Styling

### Default Classes
The component uses the following CSS classes for styling:

```css
.player-setup-container {
  /* Main container */
}

.player-setup-form {
  /* Form element */
}

.player-setup-section {
  /* Form sections (personal info, physical attributes, etc.) */
}

.player-setup-field {
  /* Individual form fields */
}

.player-setup-field--error {
  /* Fields with validation errors */
}

.player-setup-avatar {
  /* Avatar upload section */
}

.player-setup-actions {
  /* Button container */
}

.player-setup-submit {
  /* Submit button */
}

.player-setup-cancel {
  /* Cancel button */
}
```

### Custom Styling
```javascript
<PlayerSetup
  className="custom-player-setup"
  mode="create"
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

```css
.custom-player-setup {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
}

.custom-player-setup .player-setup-field {
  margin-bottom: 1.5rem;
}
```

## Integration Guide

### Complete Player Setup Flow

#### 1. Basic Integration
```javascript
import React, { useState } from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function PlayerRegistration() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayerCreated = async (playerData) => {
    setIsLoading(false);
    
    // Show success message
    toast.success('Player profile created successfully!');
    
    // Navigate to player dashboard
    navigate(`/players/${playerData.id}`);
  };

  const handleError = (error) => {
    setIsLoading(false);
    
    if (error.status === 400) {
      // Handle validation errors
      toast.error('Please check your input and try again');
    } else if (error.status === 409) {
      // Handle duplicate username/email
      toast.error('Username or email already exists');
    } else {
      // Handle other errors
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="registration-page">
      <h1>Create Your Player Profile</h1>
      <PlayerSetup
        mode="create"
        onSuccess={handlePlayerCreated}
        onError={handleError}
        showAvatar={true}
        submitButtonText="Create Profile"
      />
    </div>
  );
}
```

#### 2. Multi-step Wizard Integration
```javascript
import React, { useState } from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';
import { Stepper } from '@/components/Stepper';

function PlayerSetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [playerData, setPlayerData] = useState(null);

  const steps = [
    { id: 1, label: 'Basic Info' },
    { id: 2, label: 'Player Details' },
    { id: 3, label: 'Complete Setup' }
  ];

  const handleStepComplete = (data) => {
    setPlayerData(data);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="setup-wizard">
      <Stepper steps={steps} currentStep={currentStep} />
      
      {currentStep === 1 && (
        <PlayerSetup
          mode="create"
          fields={['name', 'email', 'username']} // Only show basic fields
          onSuccess={handleStepComplete}
          onError={(error) => console.error(error)}
          submitButtonText="Next Step"
        />
      )}
      
      {currentStep === 2 && (
        <PlayerSetup
          mode="create"
          initialData={playerData}
          fields={['position', 'skillLevel', 'dateOfBirth']} // Show player-specific fields
          onSuccess={handleStepComplete}
          onError={(error) => console.error(error)}
          submitButtonText="Next Step"
        />
      )}
      
      {currentStep === 3 && (
        <PlayerSetup
          mode="create"
          initialData={playerData}
          onSuccess={(player) => {
            // Final step - create the player
            navigate(`/players/${player.id}`);
          }}
          onError={(error) => console.error(error)}
          submitButtonText="Complete Setup"
        />
      )}
    </div>
  );
}
```

#### 3. Admin Panel Integration
```javascript
import React, { useState, useEffect } from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';
import { DataTable } from '@/components/DataTable';
import { Modal } from '@/components/Modal';

function PlayerManagement() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');

  const handleCreatePlayer = () => {
    setSelectedPlayer(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditPlayer = (player) => {
    setSelectedPlayer(player);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handlePlayerSaved = (playerData) => {
    setIsModalOpen(false);
    // Refresh player list
    loadPlayers();
  };

  return (
    <div className="player-management">
      <div className="header">
        <h1>Player Management</h1>
        <button onClick={handleCreatePlayer}>Add New Player</button>
      </div>

      <DataTable
        data={players}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'position', label: 'Position' },
          { key: 'skillLevel', label: 'Skill Level' },
          { key: 'actions', label: 'Actions' }
        ]}
        onEdit={handleEditPlayer}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create Player' : 'Edit Player'}
      >
        <PlayerSetup
          mode={modalMode}
          playerId={selectedPlayer?.id}
          initialData={selectedPlayer}
          onSuccess={handlePlayerSaved}
          onError={(error) => console.error(error)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
```

## Error Handling

### Common Error Scenarios
```javascript
const handleError = (error) => {
  switch (error.status) {
    case 400:
      // Validation errors
      if (error.details) {
        error.details.forEach(detail => {
          showFieldError(detail.field, detail.message);
        });
      }
      break;
    
    case 401:
      // Authentication error
      redirectToLogin();
      break;
    
    case 409:
      // Conflict (duplicate username/email)
      showError('Username or email already exists');
      break;
    
    case 413:
      // File too large
      showError('Avatar image is too large (max 5MB)');
      break;
    
    case 422:
      // Unprocessable entity
      showError('Invalid data format');
      break;
    
    default:
      // Generic error
      showError('An unexpected error occurred');
  }
};
```

## Testing

### Unit Testing Example
```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlayerSetup } from '@/components/PlayerSetup';

describe('PlayerSetup Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    mockOnSuccess.mockClear();
    mockOnError.mockClear();
  });

  test('renders all required fields in create mode', () => {
    render(
      <PlayerSetup
        mode="create"
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/skill level/i)).toBeInTheDocument();
  });

  test('validates required fields on submit', async () => {
    render(
      <PlayerSetup
        mode="create"
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    const submitButton = screen.getByRole('button', { name: /save player/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test('calls onSuccess when player is created successfully', async () => {
    // Mock successful API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { id: 'player_123', name: 'Test Player' }
        })
      })
    );

    render(
      <PlayerSetup
        mode="create"
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Fill form and submit
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test Player' }
    });
    // ... fill other required fields

    fireEvent.click(screen.getByRole('button', { name: /save player/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        id: 'player_123',
        name: 'Test Player'
      });
    });
  });
});
```

## Accessibility

The PlayerSetup component includes comprehensive accessibility features:

- **Keyboard Navigation**: All form elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Logical tab order and focus indicators
- **Error Announcements**: Validation errors are announced to screen readers
- **High Contrast**: Compatible with high contrast themes

### ARIA Labels Example
```javascript
<input
  type="text"
  id="player-name"
  name="name"
  aria-label="Player full name"
  aria-required="true"
  aria-describedby="name-help name-error"
  aria-invalid={errors.name ? 'true' : 'false'}
/>
```

This comprehensive documentation covers all aspects of the PlayerSetup component, from basic usage to advanced integration patterns, ensuring developers can effectively implement and customize the player setup functionality in their applications.