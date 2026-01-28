# HealthLensNaija Frontend Refactoring Guide

## Session Summary
This document captures critical learnings from the frontend refactoring session on January 28, 2026. It serves as a reference guide for future modifications to the codebase.

---

## 1. Vite TypeScript Configuration

### Critical Issue Discovered
**Problem**: `.tsx` files with TypeScript generics (e.g., `React.forwardRef<Type1, Type2>`) were being treated as `.jsx` files, causing esbuild errors like:
```
ERROR: Expected identifier but found "<"
```

### Solution
Update `vite.config.js` to explicitly detect and handle `.tsx` files:

```javascript
export default defineConfig({
  plugins: [
    {
      name: "pre-transform-js-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!id.includes('src/') || (!id.endsWith('.jsx') && !id.endsWith('.tsx'))) return null;
        const isTsx = id.endsWith('.tsx');
        return transformWithEsbuild(code, id, {
          loader: isTsx ? "tsx" : "jsx",
          jsx: "automatic",
        });
      },
    },
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
        ".tsx": "tsx",  // ✅ Critical: Add tsx loader
      },
    },
  },
});
```

### Key Takeaway
Always ensure `.tsx` files use the `tsx` loader in Vite, not `jsx`.

---

## 2. Lucide React Icon Library

### Critical Rule
**NOT all icons exist in lucide-react**. Common mistakes:
- ❌ `Question` → ✅ Use `HelpCircle`
- ❌ `UserShield` → ✅ Use `Shield`
- ❌ `SignOut` → ✅ Use `LogOut`

### Resolution
- Always check lucide-react documentation before importing icons
- When replacing icons, verify they exist in the library
- Use meaningful icon names from the official lucide-react export list

### Valid Icons Used in This Project
`Home, PenTool, Shield, BarChart, Users, File, Bot, MessageCircle, List, HelpCircle, Mail, Wrench, ChevronLeft, Cog, Book, LogOut, Menu`

---

## 3. CSS to Tailwind Migration

### Rule: Zero Custom CSS in Component Files
**ALL styling must use Tailwind utility classes**. Custom CSS causes:
- Compilation issues
- Inconsistent styling
- Hard-to-maintain code

### Implementation Strategy
Replace custom CSS classes with Tailwind equivalents:

```javascript
// ❌ OLD (BAD)
className="sidebar-item sidebar-item-wrapper"

// ✅ NEW (GOOD)
className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
```

### Key Tailwind Patterns Used
1. **Flexbox layouts**: `flex flex-col items-center justify-between`
2. **Spacing**: `p-4 px-3 gap-3 space-y-2`
3. **Colors**: `bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300`
4. **Hover states**: `hover:bg-gray-100 dark:hover:bg-gray-800`
5. **Transitions**: `transition-colors duration-300`
6. **Responsive**: `md:hidden md:flex hidden lg:block`

### index.css Rules
- Remove all custom class definitions
- Keep only:
  - `@tailwind` directives
  - CSS variables in `@layer base`
  - Global animations (keyframes)
  - Custom scrollbar styles
  - Utility-specific tweaks

---

## 4. Layout Structure: Flexbox & Viewport Height

### The Fixed Sidebar Problem
**Issue**: Sidebar scrolled with main content instead of staying fixed.

### Solution
Use proper flex hierarchy with `h-screen` and `overflow-hidden`:

```jsx
// Main container
<div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
  {/* Sidebar - fixed height */}
  <Sidebar />

  {/* Main content area - flex column with scrollable content */}
  <div className="flex-1 flex flex-col h-screen overflow-hidden">
    {/* Content header - fixed height */}
    <Header />

    {/* Scrollable content area - only this scrolls */}
    <main className="flex-1 overflow-y-auto p-4">
      <Outlet />
    </main>
  </div>
</div>
```

### Critical Classes
- `h-screen` - Full viewport height
- `overflow-hidden` - Prevent container from scrolling
- `flex-1` - Fill remaining space
- `overflow-y-auto` - Allow internal scrolling only

### Sidebar Pinning Pattern
```jsx
{/* Footer sections - pinned to bottom */}
<div className="mt-auto flex flex-col">
  {/* These sections stay at bottom */}
  <Footer />
  <Theme />
  <UserProfile />
</div>
```

The `mt-auto` class pushes content to the bottom in a flex container.

---

## 5. Dark Mode Theme System

### Setup: next-themes Provider
```jsx
// src/main.tsx
root.render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

### Critical: ThemeProvider Must Wrap All Components
Without proper wrapping, dark mode won't work.

### CSS Variables for Global Theming
```css
@layer base {
  :root {
    --primary: 136 54% 46%;      /* #3AB54A in HSL */
    --accent: 136 54% 46%;
    --secondary: 75 50% 52%;     /* #8CC43D in HSL */
  }
  .dark {
    --primary: 136 54% 46%;      /* Same in dark mode */
    --accent: 136 54% 46%;
  }
}
```

### Use HSL Format for Colors
- HSL works better with CSS variables than hex
- Format: `hue saturation% lightness%`
- Convert hex to HSL for consistency

---

## 6. Component-Level Dark Mode

### Icons Need Explicit Colors
```jsx
// ❌ OLD - Icons don't change in dark mode
<Sun className="h-5 w-5" />

// ✅ NEW - Icons explicitly colored
<Sun className="h-5 w-5 text-yellow-500" />
<Moon className="absolute h-5 w-5 text-blue-400" />
```

### Avatar Fallback Colors
```jsx
// ❌ OLD - Uses semantic color that doesn't have dark variant
className="bg-muted"

// ✅ NEW - Explicit light/dark colors
className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold"
```

### Rule: Always include dark: variants
Every color used must have a corresponding `dark:` variant.

---

## 7. Global Theme Colors

### The Green Theme (#3AB54A)
This is the primary brand color used throughout the app.

### CSS Variables Mapping
```
HSL: 136 54% 46%
RGB: 58, 181, 74
Hex: #3AB54A

Secondary: #8CC43D (75 50% 52% in HSL)
```

### Application Strategy
1. Set `--primary` and `--accent` to the green color in CSS variables
2. Use these variables in Tailwind config
3. All primary/accent variants automatically use the color
4. Update once in index.css, affects entire app

### How It Works
```css
:root {
  --primary: 136 54% 46%;        /* Green */
  --accent: 136 54% 46%;         /* Green */
}

/* Tailwind uses these in button defaults */
.btn-primary { color: hsl(var(--primary)); }
```

---

## 8. Sidebar Component Structure

### Two Sidebar Variants
1. **AdminSidebar**: Full admin navigation
2. **UserSidebar**: Limited user navigation

### Navigation Pattern
```jsx
{/* Navigation - flex-1 to take available space */}
<div className="flex-1 overflow-y-auto p-3 space-y-2">
  <SidebarItem to="/path" icon={<Icon />} label="Label" showExpanded={true} />
</div>

{/* Footer sections - mt-auto pushes to bottom */}
<div className="mt-auto flex flex-col">
  <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-2">
    {/* Links */}
  </div>
</div>
```

### Active Link Styling
```jsx
className={({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
    isActive
      ? 'bg-accent/10 text-accent font-medium'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`
}
```

Use CSS variables (`bg-accent/10`, `text-accent`) instead of hardcoded colors.

---

## 9. Route Management

### Route Naming Convention
- Keep routes consistent across files
- Update routes in:
  1. `App.tsx` / `App.jsx` - Route definitions
  2. Sidebar navigation components
  3. Navigation redirects (`navigate()`)
  4. Allowed redirects lists
  5. Protected route configurations

### Key Routes
- `/dashboard` - Main authenticated page
- `/resources` - Resources page
- `/admin/*` - Admin pages
- `/settings` - User settings
- `/help-center` - Help center

### Migration Pattern
When renaming `/generate-story` → `/dashboard`:
1. Update App.tsx route definition
2. Update Sidebar navigation links
3. Update all `navigate()` calls
4. Update allowedRedirects array
5. Update query parameters if used
6. Search entire codebase for old route

---

## 10. Component Props Cleanup

### Avoid Unused Props
**REMOVE**: Props passed but not used (e.g., `collapsed`, `showExpanded` when fixed)

### Keep Props That Affect Behavior
- Props that change rendering: Keep
- Props that affect styling conditionally: Keep
- Props passed but never used: Remove

### Example
```jsx
// ❌ OLD - Many unused props
<SidebarItem 
  to="/path" 
  collapsed={collapsed && !isMobile} 
  showExpanded={showExpanded}
  onClick={onMobileLinkClick}
  icon={icon}
  label={label}
/>

// ✅ NEW - Simplified, props only used if needed
<SidebarItem 
  to="/path" 
  icon={icon}
  label={label}
  showExpanded={true}
/>
```

---

## 11. Common Patterns & Anti-Patterns

### ✅ DO

1. **Use Flexbox for layouts**
   ```jsx
   <div className="flex flex-col h-screen">
     <header className="flex-shrink-0" />
     <main className="flex-1 overflow-auto" />
   </div>
   ```

2. **Group related elements**
   ```jsx
   <div className="space-y-2">
     <Item />
     <Item />
   </div>
   ```

3. **Use semantic HTML with Tailwind**
   ```jsx
   <nav className="flex items-center gap-4 border-b">
   <button className="px-4 py-2 rounded hover:bg-gray-100">
   ```

4. **Separate concerns**
   - Component structure: JSX
   - Styling: Tailwind classes
   - State: React hooks
   - API: Separate service files

### ❌ DON'T

1. **Don't mix custom CSS with Tailwind**
   ```jsx
   // ❌ BAD
   <div className="custom-class" />
   <style>.custom-class { /* custom CSS */ }</style>
   ```

2. **Don't hardcode colors**
   ```jsx
   // ❌ BAD
   className="bg-green-500"
   
   // ✅ GOOD
   className="bg-accent"
   ```

3. **Don't forget dark mode variants**
   ```jsx
   // ❌ BAD
   className="bg-white text-black"
   
   // ✅ GOOD
   className="bg-white dark:bg-gray-950 text-black dark:text-white"
   ```

4. **Don't use deprecated React patterns**
   - Always use latest React hooks
   - Prefer functional components
   - Use proper dependency arrays

---

## 12. Performance Considerations

### Code Splitting
- Protected routes are lazy-loaded
- Use `React.lazy()` for large components
- Keep component bundles small

### State Management
- Use local state when possible
- Context API for global state
- Avoid prop drilling beyond 2-3 levels

### Rendering Optimization
- Remove unnecessary re-renders with `useCallback`, `useMemo`
- Memoize expensive computations
- Use keys in lists properly

---

## 13. Testing & Debugging

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| TypeScript errors in .tsx | Wrong esbuild loader | Configure tsx loader in vite.config.js |
| Icons not found | Icon name doesn't exist | Check lucide-react export names |
| Dark mode not working | ThemeProvider not wrapping app | Ensure ThemeProvider wraps entire app in main.tsx |
| Sidebar scrolls with content | Missing overflow-hidden on parent | Add `overflow-hidden` and `h-screen` to layout container |
| Colors not changing globally | Hardcoded colors instead of CSS vars | Replace with CSS variable references |
| Active link styling wrong | Using wrong color classes | Use CSS variables like `bg-accent/10` |

---

## 14. File Structure Reference

### Key Files Modified
```
Frontend/
├── src/
│   ├── main.tsx                 # ThemeProvider setup
│   ├── index.css                # Global styles & CSS variables
│   ├── App.tsx                  # Route definitions
│   ├── components/
│   │   ├── Dashboard/
│   │   │   └── Sidebar.tsx      # Navigation sidebar
│   │   ├── theme-toggle.tsx     # Dark mode toggle
│   │   ├── ui/
│   │   │   ├── avatar.tsx       # Avatar component
│   │   │   └── button.tsx       # Button component
│   │   └── AuthenticatedLayout.tsx # Main layout wrapper
│   └── pages/
│       ├── Dashboard/
│       │   ├── GenerateStory.tsx
│       │   ├── AIChat.tsx
│       │   └── UploadData.tsx
│       ├── SignIn.tsx
│       ├── VerifyEmail.tsx
│       └── OAuthCallback.tsx
├── vite.config.js               # Build configuration
└── tailwind.config.js           # Tailwind configuration
```

---

## 15. Checklist for Future Refactoring

When making changes to this codebase, verify:

- [ ] All `.tsx` files compile without TypeScript errors
- [ ] No custom CSS classes in component files
- [ ] All components using Tailwind utilities only
- [ ] Dark mode variants included for all colors
- [ ] Routes updated in all 5 places (App, Sidebar, navigate calls, etc.)
- [ ] No hardcoded colors (use CSS variables)
- [ ] Sidebar/layout uses proper flex/h-screen structure
- [ ] Icons are from lucide-react and exist in the library
- [ ] ThemeProvider wraps entire app
- [ ] No unused props passed to components
- [ ] Navigation follows consistent naming convention

---

## 16. References & Commands

### Useful Commands
```bash
# Start dev server
npm run dev

# Build for production
npm build

# Check for TypeScript errors
npm run type-check

# Format code
npm run format

# Install a shadcn component
npx shadcn@latest add [component-name] --yes
```

### Documentation Links
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react Icons](https://lucide.dev/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

---

## 17. Summary of Key Learnings

1. **Configuration matters**: Vite config directly impacts TypeScript compilation
2. **Icon libraries have limits**: Always verify icon exists before importing
3. **CSS migration is critical**: Complete switch to Tailwind required for consistency
4. **Layout fundamentals**: Flexbox + viewport height + overflow = proper scrolling
5. **Theme system is centralized**: CSS variables in one place affect entire app
6. **Dark mode is pervasive**: Every color needs light/dark variants
7. **Routes must sync everywhere**: Changing a route requires updates in 5+ places
8. **Performance requires planning**: Proper component structure prevents re-renders
9. **Component simplification**: Remove unused props and complexity
10. **Consistency is key**: Follow patterns established in the codebase

---

## Document Version
- **Created**: January 28, 2026
- **Last Updated**: January 28, 2026
- **Status**: Active Reference Guide
- **Applies To**: HealthLensNaija Frontend

