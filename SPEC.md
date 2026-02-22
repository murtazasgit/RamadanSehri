# Ramadan Sehri Coordination Portal - Specification

## 1. Project Overview

**Project Name:** Ramadan Sehri Coordination Portal  
**Type:** Full-stack Web Application (PWA-ready)  
**Core Functionality:** Collect Sehri food requests from PG residents in an organized manner  
**Target Users:** PG residents (for registration) and Administrators (for managing requests)

---

## 2. UI/UX Specification

### 2.1 Design Philosophy
- **Theme:** Islamic-inspired dark mode
- **Aesthetic:** Elegant, minimal, premium feel
- **Mobile-first:** Designed primarily for mobile users

### 2.2 Color Palette
```css
--primary: #065F46        /* Deep Emerald Green */
--primary-light: #10B981  /* Lighter green for hover */
--primary-dark: #064E3B   /* Darker green */
--accent: #F59E0B         /* Islamic Gold */
--accent-light: #FBBF24   /* Lighter gold */
--accent-glow: #FCD34D    /* Gold glow */
--background: #0F172A     /* Dark Navy */
--background-secondary: #1E293B /* Card backgrounds */
--background-tertiary: #334155 /* Input backgrounds */
--text-primary: #F8FAFC   /* Soft White */
--text-secondary: #94A3B8 /* Muted text */
--text-accent: #FEF3C7    /* Gold-tinted text */
--success: #22C55E        /* Green success */
--error: #EF4444          /* Red error */
--border: #475569         /* Subtle borders */
```

### 2.3 Typography
- **Headings:** "Amiri" (Arabic-style serif) + "Playfair Display"
- **Body:** "Inter" or "DM Sans" (modern sans-serif)
- **Arabic text:** "Noto Naskh Arabic"
- **Sizes:**
  - Hero title: 3rem (48px)
  - Section headings: 2rem (32px)
  - Card titles: 1.25rem (20px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### 2.4 Spacing System
- Base unit: 4px
- Container padding: 16px (mobile), 24px (tablet), 32px (desktop)
- Card padding: 20px
- Section gaps: 48px
- Component gaps: 16px

### 2.5 Visual Effects
- **Background:** Dark navy with subtle Islamic geometric pattern (SVG overlay at 3% opacity)
- **Lantern glow:** Soft radial gradient animations in corners
- **Crescent moon:** Subtle SVG icon with gentle pulse
- **Card shadows:** 0 4px 24px rgba(6, 95, 70, 0.15)
- **Hover glow:** 0 0 20px rgba(245, 158, 11, 0.3)
- **Glass morphism:** backdrop-blur on modals

### 2.6 Animations
- **Page transitions:** Fade in with 0.3s ease
- **Card hover:** Scale 1.02 with glow
- **Button hover:** Background shift + subtle scale
- **Form reveal:** Slide up + fade in (staggered)
- **Success modal:** Scale from 0.9 to 1 with bounce
- **Countdown:** Flip animation style

---

## 3. Page Structure

### 3.1 Landing Page (`/`)
- Hero section with Islamic pattern background
- Crescent moon SVG with pulse animation
- Lantern glow effects in corners
- Main title and subtitle
- "Register for Sehri" CTA button

### 3.2 Registration Page (`/register`)
- Step indicator (breadcrumb style)
- PG selection grid (2 columns mobile, 3 tablet, 4 desktop)
- Form with validation
- Success modal on submission

### 3.3 Admin Dashboard (`/admin`)
- Login panel
- Statistics cards (Total Requests, Total Food, Today's Requests)
- PG-wise breakdown table
- Search and filter controls
- Export CSV button
- Delivery status toggle

---

## 4. Components

### 4.1 Core Components
- `Layout` - Main wrapper with background
- `Header` - Logo and navigation
- `Hero` - Landing page hero
- `PGCard` - Selectable PG option
- `RegistrationForm` - Main form component
- `OthersForm` - Extended form for unlisted PGs
- `Modal` - Success/Error modals
- `Input` - Styled form input
- `Button` - Primary/Secondary buttons
- `Countdown` - Sehri time countdown
- `DataTable` - Admin table with sorting
- `StatsCard` - Dashboard statistics

### 4.2 Background Components
- `IslamicPattern` - Geometric SVG background
- `LanternGlow` - Animated lantern effects
- `CrescentMoon` - Moon icon component

---

## 5. Database Schema (Supabase/Firebase ready)

### Table: `sehri_requests`
```sql
{
  id: string (UUID, primary key)
  pg_name: string
  full_name: string
  phone: string (unique)
  room_number: string (nullable)
  address: string
  people_count: number
  landmark: string (nullable)
  notes: string (nullable)
  is_others: boolean
  request_id: string (human-readable, e.g., "REQ-2026-001")
  delivered: boolean (default: false)
  created_at: timestamp
  updated_at: timestamp
}
```

### Table: `pg_config`
```sql
{
  id: string
  name: string
  address: string
  is_active: boolean
  display_order: number
}
```

---

## 6. Functionality Specification

### 6.1 Registration Flow
1. User lands on homepage
2. Clicks "Register for Sehri"
3. Selects their PG from grid
4. Fills form (fields vary by selection)
5. Submits → Validation → Success Modal
6. Gets request ID for reference

### 6.2 Validation Rules
- Phone: Exactly 10 digits
- Full Name: 2-50 characters
- People Count: 1-50
- PG Name (Others): Required, min 3 chars
- Address (Others): Required

### 6.3 Admin Features
- Login with password
- View all submissions
- Filter by PG name
- Filter by date range
- Search by phone
- Mark as delivered
- Export to CSV
- View statistics

### 6.4 Duplicate Prevention
- Check phone number before submission
- Show error if already registered

---

## 7. Predefined PG List

1. Manju PG
2. PG Street LMP PG
3. Yadavi PG
4. Sri Sai Ram Boys PG
5. Techies Nest
6. King PG - 1
7. King PG - 2
8. Maruti PG
9. Guest Hub PG
10. Shanuboganahalli Flat
11. Others

---

## 8. Technical Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Database:** LocalStorage (demo) / Supabase ready
- **Forms:** React Hook Form + Zod validation

---

## 9. Acceptance Criteria

### Landing Page
- [ ] Hero displays with Islamic pattern background
- [ ] Crescent moon visible with subtle animation
- [ ] Lantern glow effects in corners
- [ ] "Register for Sehri" button navigates to registration
- [ ] Responsive on mobile/tablet/desktop

### Registration
- [ ] All 11 PG options displayed in grid
- [ ] Cards have hover glow effect
- [ ] Selected card highlighted
- [ ] Form shows correct fields based on selection
- [ ] Validation works (phone 10 digits, required fields)
- [ ] Success modal shows with request ID
- [ ] Duplicate phone prevention works

### Admin Dashboard
- [ ] Login panel functional
- [ ] Statistics cards show correct totals
- [ ] Table displays all submissions
- [ ] Filter by PG works
- [ ] Search by phone works
- [ ] Mark delivered toggle works
- [ ] Export CSV downloads file

### Visual
- [ ] Dark mode by default
- [ ] Green + gold color scheme
- [ ] Smooth animations throughout
- [ ] Mobile-first responsive
- [ ] Clean typography

---

## 10. File Structure

```
ramadan-sehri-portal/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   └── api/
│       └── requests/
│           └── route.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Background.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   └── Countdown.tsx
│   ├── registration/
│   │   ├── PGSelector.tsx
│   │   ├── RegistrationForm.tsx
│   │   └── OthersForm.tsx
│   └── admin/
│       ├── StatsCards.tsx
│       ├── RequestsTable.tsx
│       └── Filters.tsx
├── lib/
│   ├── store.ts
│   ├── utils.ts
│   └── constants.ts
├── public/
│   └── images/
├── tailwind.config.ts
├── next.config.js
└── package.json
```
