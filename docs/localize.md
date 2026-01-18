# Multi-Language Support Documentation

## Overview

TipMate implements a comprehensive multi-language localization system using **i18next** and **react-i18next**. The app currently supports 5 languages with infrastructure for easy expansion, including RTL (Right-to-Left) language support and custom font integration.

### Current Language Support

| Language | Code | Native Name | Special Features |
|----------|------|-------------|------------------|
| English | `en` | English | Default/Fallback |
| Spanish | `es` | Español | - |
| French | `fr` | Français | - |
| Sinhala | `si` | සිංහල | Custom Font (NotoSansSinhala) |
| Arabic | `ar` | العربية | RTL Support |

## Architecture

### Initialization Flow

```
App Start
    ↓
Load AsyncStorage
    ↓
Language Stored?
    ├─→ YES: Load Stored Language
    │           ↓
    └─→ NO: Detect Device Language
                ↓
            Supported Language?
                ├─→ YES: Use Detected Language
                │           ↓
                └─→ NO: Use Default (English)
                            ↓
                    Apply RTL Settings
                            ↓
                    Initialize i18next
                            ↓
                        Render App
```

### Language Selection Flow

```
User Selects Language
        ↓
    RTL Language?
        ├─→ YES: Show Restart Alert
        │            ↓
        │        User Confirms
        │            ↓
        │      Apply RTL Settings
        │            ↓
        └─→ NO: Update App State
                    ↓
                Update i18next
                    ↓
            Save to AsyncStorage
                    ↓
                Update UI
                    ↓
              RTL Changed?
                ├─→ YES: Restart Required
                └─→ NO: Complete
```

### File Structure

```
app/localization/
├── index.ts                      # Main exports
├── i18n.ts                       # i18next configuration
├── localizationConfig.ts         # Language definitions & helpers
├── useRTL.ts                     # RTL state management hook
└── locales/                      # Translation files
    ├── en.json                   # English (default)
    ├── es.json                   # Spanish
    ├── fr.json                   # French
    ├── si.json                   # Sinhala
    └── ar.json                   # Arabic
```

## Translation Key Organization

Translation keys follow a hierarchical dot-notation structure:

```
Root
├── common
├── screens
│   ├── home
│   ├── savedTips
│   ├── settings
│   └── appInfo
├── components
│   ├── billBox
│   ├── tipInput
│   ├── currencySelector
│   └── languageSelector
├── navigation
├── messages
└── accessibility
```

### Key Categories

- **common**: Shared UI elements (`save`, `delete`, `cancel`, `close`, `reset`, etc.)
- **screens**: Screen-specific content (titles, descriptions, placeholders)
- **components**: Reusable component labels and messages
- **navigation**: Navigation labels and drawer items
- **messages**: User feedback messages (success, error, warnings)
- **accessibility**: Screen reader labels
- **buttons**: Action button labels
- **currencies**: Currency name translations (41+ currencies)

### Naming Conventions

```
Format: <category>.<subcategory>.<key>

Examples:
  screens.home.title
  components.billBox.totalAmount
  common.save
  messages.success.tipSaved
  accessibility.labels.currencyButton
```

## Adding a New Language

### Step 1: Create Translation File

Create a new JSON file in `app/localization/locales/`:

```json
// app/localization/locales/<languageCode>.json
{
  "common": {
    "save": "...",
    "delete": "...",
    "cancel": "..."
  },
  "screens": {
    "home": {
      "title": "..."
    }
  },
  // ... (copy structure from en.json)
}
```

**Best Practice**: Use `en.json` as your template to ensure all keys are present.

### Step 2: Update Language Configuration

Add the new language to `app/localization/localizationConfig.ts`:

```typescript
// In SUPPORTED_LANGUAGES array
export const SUPPORTED_LANGUAGES: LanguageItem[] = [
  // ... existing languages
  {
    code: 'de',                    // ISO 639-1 language code
    name: 'German',                // English name
    nativeName: 'Deutsch',         // Native name
    isRTL: false,                  // RTL flag
    fontFamily: undefined          // Custom font (if needed)
  }
];
```

### Step 3: Import Translation File

Update `app/localization/i18n.ts`:

```typescript
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';  // Add import

const resources = {
  en: { translation: en },
  es: { translation: es },
  de: { translation: de }           // Add resource
};
```

### Step 4: Test the Implementation

1. **Device Language Detection**: Change device language settings
2. **Language Selector**: Verify language appears in selector modal
3. **UI Translation**: Navigate through all screens to verify translations
4. **State Persistence**: Close and reopen app to verify language persists
5. **Missing Keys**: Check console for missing translation warnings

## RTL Language Support

### Overview

RTL (Right-to-Left) languages require special handling for layout direction. The app uses React Native's `I18nManager` for system-level RTL support.

### RTL Configuration

Mark RTL languages in `localizationConfig.ts`:

```typescript
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const SUPPORTED_LANGUAGES: LanguageItem[] = [
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    isRTL: true,              // Enable RTL
    fontFamily: undefined
  }
];
```

### RTL Behavior

```
RTL Language Selected
        ↓
Update I18nManager
        ↓
Store RTL State
        ↓
Show Restart Alert
        ↓
   User Action?
    ├─→ Restart Now: Force App Reload
    │                       ↓
    │           App Relaunches with RTL Layout
    │
    └─→ Later: Alert User on Next Launch
```

**Important**: Switching between RTL and LTR requires an app restart due to React Native's layout engine limitations.

### RTL Alert Flow

When users select an RTL language:

1. Alert shows explaining restart requirement
2. User can restart immediately or continue (restart needed on next launch)
3. `useRTL` hook manages RTL state synchronously before i18n initialization
4. Language selector displays "RTL" badge for RTL languages

## Custom Font Integration

### Overview

Languages with unique scripts may require custom fonts. Sinhala is implemented as a reference example.

### Implementation Steps

#### 1. Add Font Files

Place font files in `app/assets/fonts/`:

```
app/assets/fonts/
├── NotoSansSinhala-Regular.ttf
├── NotoSansSinhala-Medium.ttf
├── NotoSansSinhala-SemiBold.ttf
└── NotoSansSinhala-Bold.ttf
```

#### 2. Link Fonts (React Native)

The fonts are automatically linked to native projects. Verify in:

- **iOS**: `ios/TipCalculator/Info.plist`
- **Android**: `android/app/build.gradle`

#### 3. Configure Font Family

Update language configuration:

```typescript
{
  code: 'si',
  name: 'Sinhala',
  nativeName: 'සිංහල',
  isRTL: false,
  fontFamily: 'NotoSansSinhala'  // Specify custom font
}
```

#### 4. Font Selection Helper

The `getFontFamily()` helper automatically applies custom fonts:

```typescript
// Returns language-specific font or default app font
const fontFamily = getFontFamily(currentLanguage);
```

### Font Usage Pattern

```typescript
// Components automatically use language fonts via theme
const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.regular,  // Automatically uses custom font
  }
});
```

## Using Translations in Code

### Basic Usage

```typescript
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  
  return (
    <Text>{t('screens.home.title')}</Text>
  );
};
```

### With Interpolation

```typescript
// Translation file
{
  "messages": {
    "greeting": "Hello, {{name}}!"
  }
}

// Component
<Text>{t('messages.greeting', { name: userName })}</Text>
```

### With Pluralization

```typescript
// Translation file
{
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} items"
  }
}

// Component
<Text>{t('items.count', { count: itemCount })}</Text>
```

### With Context

```typescript
// Translation file
{
  "action": {
    "save_editing": "Update",
    "save_creating": "Create"
  }
}

// Component
<Text>{t('action.save', { context: isEditing ? 'editing' : 'creating' })}</Text>
```

### Accessing Current Language

```typescript
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { i18n } = useTranslation();
  
  const currentLanguage = i18n.language;  // e.g., 'en', 'es'
  
  return <Text>Current: {currentLanguage}</Text>;
};
```

## State Management Integration

### App Context Structure

```typescript
interface AppState {
  language: string;           // Current language code
  languageRTL: boolean;       // RTL flag
  // ... other state
}
```

### Language Actions

```typescript
// Action type
SET_LANGUAGE: 'SET_LANGUAGE'

// Dispatch
dispatch({
  type: 'SET_LANGUAGE',
  payload: {
    language: 'es',
    languageRTL: false
  }
});
```

### Persistence

Language preferences are automatically persisted to AsyncStorage and restored on app launch.

## Configuration Reference

### i18next Setup

```typescript
// Key configuration options
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',        // React Native compatibility
    resources: translationResources,
    lng: detectedLanguage,          // Initial language
    fallbackLng: 'en',             // Fallback to English
    interpolation: {
      escapeValue: false           // React handles XSS
    }
  });
```

### Device Language Detection

```typescript
import * as RNLocalize from 'react-native-localize';

// Find best available language
const findBestLanguage = RNLocalize.findBestLanguageTag(
  supportedLanguageCodes
);

// Returns: { languageTag: 'es-MX', isRTL: false }
```

## Troubleshooting

### Missing Translation Keys

**Symptom**: Key appears in UI instead of translated text (e.g., `screens.home.title`)

**Solutions**:

1. Verify key exists in all locale JSON files
2. Check key path is correct (case-sensitive)
3. Ensure JSON is valid (no trailing commas, proper quotes)
4. Restart bundler after adding new translations

### RTL Layout Issues

**Symptom**: Layout doesn't flip when selecting RTL language

**Solutions**:

1. Verify `isRTL: true` in language configuration
2. Ensure language code is in `RTL_LANGUAGES` array
3. **Restart the app** (RTL changes require restart)
4. Check `I18nManager.isRTL` is being set correctly

### Custom Font Not Displaying

**Symptom**: Text shows default font instead of custom font

**Solutions**:

1. Verify font files are in `app/assets/fonts/`
2. Check font family name matches file name (without extension)
3. Rebuild native apps (`npm run android` or `npm run ios`)
4. Verify font linking in native project files
5. Check `fontFamily` property in language config

### Language Not Persisting

**Symptom**: App reverts to default language on restart

**Solutions**:

1. Check AsyncStorage permissions
2. Verify reducer handles `SET_LANGUAGE` action
3. Ensure `usePersistedReducer` is working correctly
4. Clear app data and test again

### Translation Not Updating

**Symptom**: UI shows old translation after changing locale file

**Solutions**:

1. Clear Metro bundler cache: `npm start -- --reset-cache`
2. Reload app (`r` in Metro or shake device → Reload)
3. Verify correct locale file is being imported
4. Check for caching in i18next configuration

## Best Practices

### Translation File Management

✅ **Do**:

- Use `en.json` as the master template
- Keep all locale files in sync (same keys across all files)
- Use descriptive, hierarchical key names
- Group related translations together
- Add comments in documentation, not in JSON files

❌ **Don't**:

- Hard-code text strings in components
- Use abbreviations in key names
- Nest keys more than 3-4 levels deep
- Include HTML or JSX in translation strings
- Copy-paste machine translations without review

### Key Naming

```typescript
// Good
screens.savedTips.emptyState.title
components.billBox.totalAmount.label
messages.error.networkTimeout

// Avoid
screen1.text1
comp.lbl
msg
```

### Adding New Keys

When adding new translatable content:

1. **Choose appropriate category** (screens, components, common, etc.)
2. **Add to `en.json` first** with clear, concise English text
3. **Add to all other locale files** (use English as placeholder if needed)
4. **Mark untranslated keys** with `[TODO]` prefix for tracking
5. **Update documentation** if adding new category or significant keys

### Testing New Languages

**Checklist**:

- [ ] All screens display correctly
- [ ] No missing translation keys in console
- [ ] Text fits in UI components (no overflow)
- [ ] Special characters render correctly
- [ ] Currency and number formatting is correct
- [ ] Date/time formatting follows locale conventions
- [ ] Pluralization works for all count scenarios
- [ ] RTL layout (if applicable) displays correctly
- [ ] Language persists after app restart
- [ ] Language selector shows new language
- [ ] Device language detection works

### Performance Considerations

- Translation files are loaded synchronously on app start
- Keep translation files reasonably sized (<500KB per file)
- Avoid dynamic translation key construction (hurts tree-shaking)
- Use translation caching (enabled by default in i18next)
- Pre-load commonly used translations in critical paths

## Maintenance

### Regular Updates

1. **Review Translation Coverage**: Periodically check all locale files have matching keys
2. **Update Dependencies**: Keep i18next and related packages up to date
3. **Add Missing Translations**: Track and fill in `[TODO]` placeholder translations
4. **Deprecate Unused Keys**: Remove obsolete translation keys from all files

### Version Control

- Commit translation files separately from code changes
- Use descriptive commit messages: `i18n: Add German translations for settings screen`
- Review translation changes carefully (they affect all language users)

### Community Contributions

When accepting translation contributions:

1. Verify all keys from `en.json` are present
2. Check for cultural appropriateness
3. Test in app before merging
4. Credit translators in commit messages or CONTRIBUTORS file

## References

### Key Files

- [i18n.ts](../app/localization/i18n.ts) - i18next configuration
- [localizationConfig.ts](../app/localization/localizationConfig.ts) - Language definitions
- [useRTL.ts](../app/localization/useRTL.ts) - RTL state management
- [AppContext.tsx](../app/context/AppContext.tsx) - Global language state
- [StyledLanguageSelector](../app/components/StyledLanguageSelector/) - Language selection UI

### Dependencies

```json
{
  "i18next": "^25.6.3",
  "react-i18next": "^16.3.5",
  "react-native-localize": "^3.6.0"
}
```

### External Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [React Native Localization Guide](https://reactnative.dev/docs/localization)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

---

**Document Version**: 1.0  
**Last Updated**: January 18, 2026  
**Maintained by**: TipMate Development Team
