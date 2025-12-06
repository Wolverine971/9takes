<!-- docs/development/css-style-guide.md -->

# 9takes Design System Style Guide

## Color Palette

### Primary Colors

- **Deep Dark**: `#1a1a2e` - Primary dark background
- **Charcoal**: `#2d3436` - Secondary dark tone
- **Dark Gray**: `#3d4447` - Hover state for dark elements
- **Purple Accent**: `#6c5ce7` - Primary brand color
- **Light Purple**: `#8c7ae6` - Secondary purple
- **Soft Purple**: `#a29bfe` - Accent highlights

### Text Colors

- **Primary Text**: `#2d3436` - Main body text
- **Secondary Text**: `#636e72` - Muted text
- **White Text**: `white` - On dark backgrounds
- **Light Text**: `rgba(255, 255, 255, 0.95)` - Softer white

## Typography

### Font Sizes

- **H1**: `2.5rem` - Main page titles
- **H2**: `1.875rem` - Section headers
- **H3**: `1.15rem` - Card titles
- **Body**: `0.9rem` - Regular text
- **Small**: `0.875rem` - Secondary text

### Font Weights

- **Bold**: `700` - Headers
- **Semibold**: `600` - Subheaders
- **Regular**: `400` - Body text

### Line Heights

- **Headers**: `1.3`
- **Card Titles**: `1.35`
- **Body Text**: `1.5-1.6`

## Card Styles

### Standard Card (with image)

```scss
aspect-ratio: 3 / 4;
border-radius: 12px;
background: white;
border: 1px solid rgba(0, 0, 0, 0.06);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

&:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 24px rgba(108, 92, 231, 0.15);
	border-color: rgba(108, 92, 231, 0.2);
}
```

### Dark Card (no image)

```scss
background: linear-gradient(135deg, #1a1a2e 0%, #2d3436 100%);
border: 1px solid rgba(255, 255, 255, 0.08);

&:hover {
	background: linear-gradient(135deg, #2d3436 0%, #3d4447 100%);
}
```

### Text Overlay

```scss
background: linear-gradient(
	to top,
	rgba(0, 0, 0, 0.9) 0%,
	rgba(0, 0, 0, 0.7) 60%,
	rgba(0, 0, 0, 0.2) 100%
);
padding: 1.5rem;
min-height: 60%;
```

## Grid Layouts

### Blog Grid

- **Desktop**: 4 columns
- **Tablet**: 3 columns
- **Mobile**: 1 column
- **Gap**: `1.5rem`
- **Max Width**: `1400px`

### Special Grids

- **Nine Types Grid**: 3 columns (all breakpoints)

## Spacing

### Section Spacing

- **Margin Bottom**: `4rem`
- **Padding**: `0 1.5rem`

### Card Content

- **Padding**: `1.5rem`
- **Gap**: `0.75rem`

## Animations

### Hover Transitions

- **Timing**: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- **Transform**: `translateY(-4px)`
- **Scale**: `1.02` (optional)

### Text Animations

- **Description Reveal**: Opacity 0 → 1, translateY(10px) → 0

## Components

### Authority Section

- **Background**: Dark gradient `#2d3436` → `#1a1a2e`
- **Border Radius**: `20px`
- **Padding**: `3rem`
- **Text Color**: White

### Navigation Cards

- **Background**: White
- **Border**: `1px solid rgba(0, 0, 0, 0.08)`
- **Hover**: Light purple tint background

### CTA Buttons

- **Primary**: Purple gradient with white text
- **Secondary**: Transparent with white border

## Responsive Breakpoints

- **Desktop**: > 1200px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px

## Text Truncation

- **Titles**: 3 lines max (4 for dark cards)
- **Descriptions**: 2 lines (3 for dark cards)
- **Method**: `-webkit-line-clamp` with ellipsis
