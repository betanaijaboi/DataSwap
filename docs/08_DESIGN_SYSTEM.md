# Design System / Style Guide
## DataSwap — Nigerian Data & Airtime Marketplace
**Version:** 1.0  |  **Date:** June 2026

> This document defines every reusable visual token and component in the DataSwap design system. All values are sourced from `src/utils/constants.js`. React Native implementation is the source of truth.

---

## 1. Brand Identity

**Product Name:** DataSwap  
**Tagline:** Nigeria's Data & Airtime Marketplace  
**App Icon:** ⚡ (lightning bolt — speed, energy, instant transactions)  
**Brand Personality:** Trustworthy, Fast, Nigerian, Modern, Secure

---

## 2. Color System

### Primary Palette
```
PRIMARY        #1565C0  ████  Deep Nigerian Blue — buttons, links, focus
PRIMARY DARK   #0D47A1  ████  Header gradient, pressed states
PRIMARY LIGHT  #42A5F5  ████  Hover highlights
PRIMARY FAINT  #EBF2FF  ████  Demo banner bg, selected row bg
PRIMARY BORDER #C5D8FF  ████  Demo banner border
```

### Semantic Colors
```
SUCCESS        #10B981  ████  Credit amounts, verified badge, success state
SUCCESS BG     #D1FAE5  ████  Success alert background
WARNING        #F59E0B  ████  KYC pending badge, low balance
WARNING BG     #FEF3C7  ████  Warning alert background
ERROR          #EF4444  ████  Validation errors, rejected KYC, debit badge
ERROR BG       #FEE2E2  ████  Error alert background
INFO           #3B82F6  ████  Informational messages
```

### Neutral Palette (Grayscale)
```
WHITE          #FFFFFF  ████  Card backgrounds, button text
GRAY-50        #F9FAFB  ████  Disabled input background
GRAY-100       #F3F4F6  ████  Chip/tag background
GRAY-200       #E5E7EB  ████  Dividers, borders
GRAY-300       #D1D5DB  ████  Default input border
GRAY-400       #9CA3AF  ████  Divider text ("OR"), footnotes
GRAY-500       #6B7280  ████  Placeholders, subtitles, icons
GRAY-600       #4B5563  ████  Secondary body text
GRAY-700       #374151  ████  Secondary headings
GRAY-900       #111827  ████  Primary body text, headings
BACKGROUND     #F8FAFC  ████  Screen background (very light gray-blue)
```

### Network Brand Colors (for network chips)
```
MTN            #FFCC00  ████  MTN Yellow
AIRTEL         #FF0000  ████  Airtel Red
GLO            #00843D  ████  Glo Green
9MOBILE        #006F3C  ████  9Mobile Green
```

### Usage Rules
- Never use PRIMARY on a PRIMARY background
- Error text must maintain 4.5:1 contrast ratio on its background
- Always pair WARNING (#F59E0B) with dark text (#111827), never white
- Network colors are decorative only — always pair with text labels (colorblind accessibility)

---

## 3. Typography

### Font Stack
```
React Native system fonts (no custom fonts in v1.0)
  Android: Roboto (system default)
  iOS: SF Pro (system default)
```

### Type Scale
| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `SIZES.xxl` | 28px | 900 | 34px | App name logo |
| `SIZES.xl` | 24px | 800 | 30px | Screen titles (H1) |
| `SIZES.lg` | 20px | 700 | 26px | Card titles, section H2 |
| `SIZES.md` | 16px | 400–600 | 22px | Body, labels, list items |
| `SIZES.sm` | 14px | 400 | 20px | Subtitles, helper text |
| `SIZES.xs` | 12px | 400 | 16px | Captions, timestamps, footnotes |

### Font Weight Reference
```
400 — Regular    — body text, placeholder
500 — Medium     — input labels, list items
600 — SemiBold   — section headers, link text
700 — Bold       — card titles, emphasized values
800 — ExtraBold  — screen titles
900 — Black      — logo, balance amount
```

### Text Color Guidelines
```
H1, H2, balance amounts:  COLORS.gray900  (#111827)
Body text:                COLORS.gray900  (#111827)
Subtitles, helpers:       COLORS.gray500  (#6B7280)
Links, primary action:    COLORS.primary  (#1565C0)
Error messages:           COLORS.error    (#EF4444)
Success messages:         COLORS.success  (#10B981)
Disabled text:            COLORS.gray400  (#9CA3AF)
White text (on primary):  #FFFFFF
```

---

## 4. Spacing System

All spacing uses an **8px base grid**.

| Token | Value | Usage |
|-------|-------|-------|
| `SIZES.xs` | 4px | Icon padding, tight gaps |
| `SIZES.sm` | 8px | Internal component spacing |
| `SIZES.md` | 12px | Form field gaps |
| `SIZES.padding` | 16px | Standard screen padding |
| `SIZES.paddingLg` | 24px | Card internal padding |
| `SIZES.section` | 32px | Between major sections |

### Layout Guidelines
- **Screen horizontal padding:** 16px (left + right)
- **Card internal padding:** 24px
- **Form field bottom margin:** 16px
- **Section header bottom margin:** 12px
- **Bottom tab height:** 60px

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `SIZES.radiusSm` | 8px | Error banners, chips, badges |
| `SIZES.radius` | 12px | Input fields, small cards |
| `SIZES.radiusLg` | 16px | Demo banner, action cards |
| `SIZES.radiusXl` | 24px | Main card panels |
| `SIZES.radiusFull` | 9999px | Pills, avatar circles, toggle |

---

## 6. Elevation / Shadow

**React Native shadow properties** (iOS) and `elevation` (Android):

| Level | Usage | Shadow |
|-------|-------|--------|
| 0 | Flat elements (input wrappers) | none |
| 2 | Subtle card lift | `shadow: {offset: {0,2}, opacity: 0.06, radius: 4}, elevation: 2` |
| 4 | Standard cards | `shadow: {offset: {0,4}, opacity: 0.08, radius: 12}, elevation: 4` |
| 8 | Modal overlays | `shadow: {offset: {0,8}, opacity: 0.12, radius: 20}, elevation: 8` |

> ⚠️ **Important:** Input component wrappers (`Animated.View` in `Input.js`) use **zero elevation** intentionally. Adding `elevation` to Input wrappers causes Android Fabric TextInput focus cascade bug. See `08_DESIGN_SYSTEM.md` — this is a permanent architectural decision.

---

## 7. Component Library

### 7.1 Button Component (`src/components/Button.js`)

#### Variants
```
primary   — filled blue, white text         [  LOG IN  ]
outline   — transparent, blue border/text   [ BIOMETRIC ]
danger    — filled red, white text          [ DELETE ]
ghost     — no border, blue text            [ Cancel ]
```

#### Sizes
```
default   — height 52px, paddingH 24px, font 16px (most CTAs)
small     — height 40px, paddingH 16px, font 14px (secondary actions)
```

#### States
```
default   — full opacity, pressable
loading   — ActivityIndicator replaces text, not pressable
disabled  — 50% opacity, not pressable
```

#### Props Interface
```js
Button({
  title: string,           // button label
  onPress: function,       // tap handler
  variant: 'primary' | 'outline' | 'danger' | 'ghost',  // default: 'primary'
  size: 'default' | 'small',  // default: 'default'
  loading: boolean,        // shows spinner
  disabled: boolean,       // greys out
  icon: ReactNode,         // optional left icon
  style: ViewStyle,        // override container
})
```

---

### 7.2 Input Component (`src/components/Input.js`)

#### Architecture Note
Uses `Animated.Value` (not `useState`) for focus state to avoid Android Fabric TextInput cascade bug. No `elevation` on wrapper.

#### Props Interface
```js
Input({
  label: string,           // field label above input
  value: string,           // controlled value
  onChangeText: function,  // change handler
  placeholder: string,     // placeholder text
  error: string,           // validation error (shows below)
  leftIcon: ReactNode,     // icon inside left of input
  secureTextEntry: boolean,// password field (shows eye toggle)
  keyboardType: string,    // 'default' | 'phone-pad' | 'numeric' | 'email-address'
  editable: boolean,       // default true
  multiline: boolean,      // text area mode
  numberOfLines: number,   // lines when multiline
  style: ViewStyle,        // override container
  autoFocus: boolean,      // always false (prevents cascade)
  onBlur: function,        // blur callback
  returnKeyType: string,   // 'next' | 'done' | 'go'
  onSubmitEditing: function,
})
```

#### Visual States
- **Default:** border `#E5E7EB`, 1px
- **Focused:** border animates to `#1565C0` over 180ms (`useNativeDriver: false`)
- **Error:** border `#EF4444`, error text below in red at 12px
- **Disabled:** background `#F9FAFB`, text `#9CA3AF`

---

### 7.3 Screen Header
```
height: 56px
backgroundColor: COLORS.white (or gradient for auth screens)
paddingHorizontal: 16px
Elements: back chevron (left) | title (center) | optional action (right)
```

---

### 7.4 Bottom Tab Bar
```
height: 60px + safe area inset
backgroundColor: COLORS.white
border-top: 1px solid COLORS.gray200
Tabs: Home | Data | Airtime | Profile
Active: COLORS.primary icon + label
Inactive: COLORS.gray400 icon + label
Tab icon size: 24px
Label font: 10px, 500 weight
```

---

### 7.5 Card
```
backgroundColor: COLORS.white
borderRadius: SIZES.radiusXl (24px)
padding: SIZES.paddingLg (24px)
margin: 16px
elevation: 4
shadowColor: #000
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.08
shadowRadius: 12
```

---

### 7.6 Badge / Status Chip
```
KYC Status badges:
  not_started  → gray bg (#F3F4F6), gray text
  pending      → amber bg (#FEF3C7), amber text (#D97706)
  verified     → green bg (#D1FAE5), green text (#059669)
  rejected     → red bg (#FEE2E2), red text (#DC2626)

Size: paddingH 10px, paddingV 4px, borderRadius 9999px, font 12px bold
```

---

### 7.7 Transaction Row
```
height: min 64px
layout: flexRow, alignItems center
leftIcon: 40×40 circle, colored bg, centered icon
content: flexColumn → type label (14px bold) + description (12px gray500)
rightContent: flexColumn aligned right → amount (14px bold) + status (12px)
amount color: green (#10B981) for credit, gray900 for debit
separator: 1px gray200 bottom border
```

---

### 7.8 Network Selection Chip
```
width: (screenWidth - 48) / 4 (equal quarters)
height: 56px
borderRadius: 12px
unselected: bg white, border gray200
selected: bg #EBF2FF, border primary
content: network logo or initial + name
```

---

## 8. Iconography

**Icon Library:** `@expo/vector-icons` — Ionicons

### Canonical Icon Map
| Use Case | Icon Name | Style |
|----------|-----------|-------|
| Phone / call | `call-outline` | outline |
| Lock / security | `lock-closed-outline` | outline |
| Email | `mail-outline` | outline |
| Person / user | `person-outline` | outline |
| **Fingerprint / biometric / NIN** | `finger-print-outline` | **outline (canonical)** |
| **Fingerprint (filled state)** | `finger-print` | **filled** |
| Eye (show password) | `eye-outline` | outline |
| Eye (hide password) | `eye-off-outline` | outline |
| Back arrow | `chevron-back` | — |
| Forward | `chevron-forward` | — |
| Shield / trust | `shield-checkmark-outline` | outline |
| Alert / warning | `alert-circle` | filled |
| Info | `information-circle-outline` | outline |
| Check / success | `checkmark-circle` | filled |
| Close / dismiss | `close-circle` | filled |
| Home | `home-outline` | outline |
| Data / signal | `cellular-outline` | outline |
| Wallet / money | `wallet-outline` | outline |
| Transactions | `list-outline` | outline |
| Arrow forward circle | `arrow-forward-circle` | filled |
| Notifications | `notifications-outline` | outline |
| Settings | `settings-outline` | outline |
| Logout | `log-out-outline` | outline |
| Document / ID | `document-text-outline` | outline |
| Camera / selfie | `camera-outline` | outline |
| Bank | `business-outline` | outline |
| Help | `help-circle-outline` | outline |

**Icon Sizes:**
- Navigation/tab bar: 24px
- Input field icons (left): 18px
- Inline text icons: 14px–16px
- Large decorative icons: 48px–64px

> **Permanent design rule** (saved to memory): `finger-print-outline` is the canonical fingerprint/biometric/NIN icon for ALL DataSwap UI and ALL future projects.

---

## 9. Motion & Animation

### Principles
- Fast, purposeful — no decorative animations
- `useNativeDriver: true` whenever possible (except color/border animations)
- Maximum duration 300ms for transitions

### Animation Tokens
| Name | Duration | Easing | Driver |
|------|----------|--------|--------|
| Input focus border | 180ms | linear | JS (color anim) |
| Button press feedback | 100ms | ease-in | native |
| Screen transition | 250ms | ease-in-out | native |
| Success checkmark | 600ms | spring | native |
| OTP shake (error) | 400ms | ease-out | native |
| Loading spinner | infinite | linear | native |

---

## 10. Accessibility

### Requirements
| Rule | Implementation |
|------|----------------|
| Minimum touch target | 44×44px on all interactive elements |
| Text contrast | 4.5:1 for body, 3:1 for large text (WCAG AA) |
| Color not sole indicator | Always pair color with text/icon |
| Screen reader support | `accessible`, `accessibilityLabel`, `accessibilityRole` props |
| Keyboard navigation | All inputs support `returnKeyType` + `onSubmitEditing` |
| Error identification | Error text always paired with red border (not just color) |

---

## 11. constants.js Reference

The design tokens are sourced from `src/utils/constants.js`:

```js
export const COLORS = {
  primary: '#1565C0',
  primaryDark: '#0D47A1',
  primaryLight: '#42A5F5',
  white: '#FFFFFF',
  background: '#F8FAFC',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 12,
  padding: 16,
  paddingLg: 24,
  section: 32,
  radiusSm: 8,
  radius: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,
  // Font sizes
  xs: 12,     // caption
  sm: 14,     // helper
  md: 16,     // body
  lg: 20,     // subtitle
  xl: 24,     // title
  xxl: 28,    // hero
};
```
