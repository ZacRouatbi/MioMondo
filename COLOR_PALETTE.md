# Mio Mondo Brand Colors - Technical Reference

## Color Palette Specifications

```
Primary Colors:
├── Light Gray/Off-white:  #F8F8F8  (RGB: 248, 248, 248)
├── Light Lavender:        #E6E6FA  (RGB: 230, 230, 250)
├── Gold/Amber:            #FFCA68  (RGB: 255, 202, 104)
└── Dark Navy Blue:        # bg-jet
```

## Usage Guidelines

### #F8F8F8 - Light Gray (Backgrounds)
**Used for:**
- Page background
- Header background
- Hero section background
- Clean, minimal backdrop for main content

**CSS:**
```css
background-color: #F8F8F8;
```

**Component Examples:**
```tsx
style={{ backgroundColor: '#F8F8F8' }}
```

---

### #E6E6FA - Light Lavender (Secondary Accents)
**Used for:**
- Category card backgrounds
- Search bar background
- Secondary button background
- Subtle accent areas

**CSS:**
```css
background-color: #E6E6FA;
```

**Component Examples:**
```tsx
style={{ backgroundColor: '#E6E6FA' }}
```

---

### #FFCA68 - Gold/Amber (Primary Accents & Highlights)
**Used for:**
- Primary call-to-action buttons
- Product price displays
- Active pagination indicators
- Logo accent text
- Cart badge background
- Hover states

**CSS:**
```css
background-color: #FFCA68;
color: #FFCA68;
```

**Component Examples:**
```tsx
style={{ backgroundColor: '#FFCA68', color: '#FFCA68' }}
```

---

### #202C39 - Dark Navy Blue (Text & Dark Sections)
**Used for:**
- Primary text and headings
- Navigation links
- Footer background
- Dark buttons
- Dark section backgrounds
- Logo text

**CSS:**
```css
color: #202C39;
background-color: #202C39;
```

**Component Examples:**
```tsx
style={{ color: '#202C39', backgroundColor: '#202C39' }}
```

---

## Component Color Matrix

### Header
```
Background:      #F8F8F8
Text/Links:      #202C39
Search BG:       #E6E6FA
Icons:           #202C39
Logo:            #202C39 (text) + #FFCA68 (subtitle)
Cart Badge:      #FFCA68
```

### Hero Section
```
Background:      #F8F8F8
Heading:         #202C39
Primary Button:  #FFCA68 (bg) + white (text)
Secondary Button: #E6E6FA (bg) + #202C39 (text)
```

### Shop by Category
```
Heading:         #202C39
Card Background: #E6E6FA
Text:            #202C39
```

### Best Sellers
```
Section Background: #202C39
Text:               white
Active Dot:         #FFCA68
Inactive Dot:       #666
Price:              #FFCA68
Add to Cart Button:  #202C39 (bg) + white (text)
```

### Footer
```
Background:      #202C39
Text:            white
Links:           white (hover: white with opacity)
```

---

## Color Combinations & Accessibility

### Text on Background
- #202C39 text on #F8F8F8 background ✓ (High contrast)
- White text on #202C39 background ✓ (High contrast)
- #FFCA68 text on white background ✓ (Readable)

### Buttons
- #FFCA68 button on white = Gold primary ✓
- #E6E6FA button with #202C39 text = Secondary ✓
- #202C39 button on white = Dark secondary ✓

---

## Implementation Checklist

- ✅ All buttons updated
- ✅ All text colors updated
- ✅ All backgrounds updated
- ✅ Header & navigation styled
- ✅ Footer styled
- ✅ Cards (Product & Category) styled
- ✅ Hero section styled
- ✅ Interactive elements (pagination, badges) styled

---

## Brand Color Harmony

Your palette creates a sophisticated, modern aesthetic:

1. **#F8F8F8 (Light Gray)** - Creates a clean, spacious feel
2. **#E6E6FA (Lavender)** - Adds elegance and softness
3. **#FFCA68 (Gold)** - Draws attention to important elements
4. **#202C39 (Navy)** - Provides strong contrast and readability

This combination suggests: **Premium, Elegant, Trustworthy, Contemporary**

---

## Export/Sharing Format

If you need to share these with designers or developers:

```
Mio Mondo Brand Palette
- Background: #F8F8F8
- Accent 1: #E6E6FA
- Primary: #FFCA68
- Dark: #202C39
```

Or in CSS variables:
```css
:root {
  --color-bg: #F8F8F8;
  --color-accent: #E6E6FA;
  --color-primary: #FFCA68;
  --color-dark: #202C39;
}
```

---

**All components now use your brand colors consistently! 🎨**
