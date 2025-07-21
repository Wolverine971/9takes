# Security and Improvements Todo List

## 🔴 CRITICAL SECURITY FIXES

### 1. Rotate Credentials ⚠️ ACTION REQUIRED
- [ ] Generate new Supabase API keys
- [ ] Generate new OpenAI API key
- [ ] Generate new Stripe keys
- [ ] Generate new AWS credentials
- [ ] Generate new Elasticsearch API key
- [ ] Generate new Gmail OAuth credentials
- [ ] Update `.env` file with new credentials
- [ ] Update `.env.example` with placeholder values
- [ ] Ensure `.env` is in `.gitignore`

**See `CREDENTIAL_ROTATION_GUIDE.md` for detailed instructions**

### 2. Remove Hardcoded Credentials ✅ COMPLETED
- [x] Fix hardcoded Supabase URL in `src/hooks.server.ts`
- [x] Fix hardcoded Supabase keys in `src/lib/supabase.ts`
- [x] Scan for any other hardcoded credentials

### 3. Enable CSRF Protection ✅ COMPLETED
- [x] Enable CSRF in `svelte.config.js`
- [x] Test that the application still works with CSRF enabled

## 🟠 HIGH PRIORITY IMPROVEMENTS

### 4. Add Input Validation to API Endpoints ✅ COMPLETED
- [x] Created validation schemas in `/src/lib/validation/schemas.ts`
- [x] Added validation to `/comments` endpoint with Zod
- [x] Added proper error handling for validation errors
- [ ] `/api/questions` - Validate question data
- [ ] `/api/ai` endpoints - Validate prompts and parameters
- [ ] `/api/blog` endpoints - Validate blog operations
- [ ] `/api/notifications` - Validate notification data
- [ ] `/api/subscribe` - Validate email format
- [ ] `/api/user` endpoints - Validate user data

**Note: Install Zod with `pnpm add zod`**

### 5. Improve Logging ✅ COMPLETED
- [x] Create centralized logging utility (`/src/lib/utils/logger.ts`)
- [x] Add error logging to all catch blocks
- [x] Add request/response logging for APIs
- [x] Add performance logging for slow operations
- [x] Set up log levels (error, warn, info, debug)
- [x] Add user-friendly error messages

## 🟡 MEDIUM PRIORITY IMPROVEMENTS

### 6. Improve Loading States ✅ COMPLETED
- [x] Created reusable SkeletonLoader component
- [x] Created reusable LoadingButton component
- [x] Updated Comments component with skeleton loaders
- [x] Updated Questions page with Spinner component
- [x] Updated Login page with LoadingButton
- [ ] Add loading state to blog post pages
- [ ] Add loading state to search functionality
- [ ] Add loading state to admin panels
- [ ] Add error boundary components

## Implementation Order:
1. Security fixes (1-3)
2. Input validation (4)
3. Logging improvements (5)
4. Loading states (6)