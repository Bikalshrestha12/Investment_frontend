# Nexas Investment — Frontend

React + Vite frontend for the Nexas investment website and its admin dashboard. Styling is Tailwind CSS v4; data comes from the Express/MongoDB API in [`../server`](../server).

## Getting started

Start the backend first, then the frontend:

```bash
# 1. Backend (from ../server) — runs on http://localhost:5000
npm install
npm run dev

# 2. Frontend (from this folder) — runs on http://localhost:5173
npm install
npm run dev
```

Open the site at **http://localhost:5173**. The server's CORS setting only allows that origin, so `127.0.0.1` or a network IP will be blocked.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Which backend is used

The API URL is chosen in [`src/contexts/AxiosWithAuth.jsx`](src/contexts/AxiosWithAuth.jsx):

| Mode | API |
| --- | --- |
| `npm run dev` | `http://<current hostname>:5000` (your local server) |
| `npm run build` | `https://investment-backend-p8j8.onrender.com` |

The same module also:

- attaches the login token (`localStorage.token`) as `Authorization: Bearer …` to every request, which the server's protected routes require;
- ends the session in every tab when the API rejects that token (expired or invalid JWT), see [Login session and inactivity logout](#login-session-and-inactivity-logout);
- times requests out after 60 seconds, so a dead backend shows an error instead of loading forever;
- exports `resolveImage(image)`, which turns a stored image value (full URL or upload path) into a usable URL.

## Project structure

```
src/
├── admin/                  Admin dashboard (/dashboard)
│   ├── AdminLayout.jsx     Sidebar, top bar and page outlet for all dashboard routes
│   ├── ui.jsx              Shared dashboard components and hooks
│   ├── Dashboard.jsx       Overview page
│   ├── chart/BarChart.jsx  Registration and role charts
│   ├── blogs/ projects/ services/ team/ testimonial/ FQA/
│   │                       List page + add form + edit form per section
│   ├── profile/            Admin profile page (/dashboard/profile)
│   └── totaluser/          Registered users
├── auth/                   Login session and 15-minute inactivity logout
│   ├── session.js          Session storage, cross-tab sync, inactivity manager (no React)
│   └── SessionProvider.jsx Mounts the manager once for the whole app; useSession() hook
├── components/             Public site sections (Navbar, Hero, …) and ProtectedRoute
├── pages/                  Public site pages
├── contexts/               API client and InvestmentContext (projects, cart)
└── routes/                 PublicRoute (keeps signed-in users away from /login)
```

## Admin dashboard

Only logged-in users with the `admin` role can open `/dashboard`. All dashboard routes are nested under `AdminLayout` in [`src/App.jsx`](src/App.jsx), and the public navbar and footer are hidden there.

| Route | Page |
| --- | --- |
| `/dashboard` | Overview: live counts, charts, recent projects and posts |
| `/dashboard/services` · `servicesform` · `servicesformedit/:id` | Services |
| `/dashboard/projects` · `projectform` · `projectformedit/:id` · `projectdetailpage/:id` | Projects |
| `/dashboard/blogs` · `blogform` · `blogformedit/:id` | Blog posts |
| `/dashboard/teams` · `teamsform` · `teamsformedit/:id` | Team |
| `/dashboard/testimonials` · `testimonialsform` · `testimonialsformedit/:id` | Testimonials |
| `/dashboard/faqs` · `faqsform` · `faqsformedit/:id` | FAQs |
| `/dashboard/totalUser` | Registered users |
| `/dashboard/profile` | Your profile and password |

### Building a dashboard page

Use the shared pieces in [`src/admin/ui.jsx`](src/admin/ui.jsx) so new pages match the rest:

| Export | Use |
| --- | --- |
| `useAdminList(endpoint, noun)` | Fetches a collection; `remove(id, label)` deletes with a confirmation and toast |
| `useListControls(items, fields, perPage)` | Client-side search and pagination |
| `PageHeader`, `Card`, `SearchInput`, `Table`, `Td`, `Pagination` | List page layout |
| `SkeletonRows`, `EmptyRow`, `ErrorBanner` | Loading, empty and error states |
| `Thumb`, `Badge`, `ActionButton` | Image thumbnails, labels, row actions |
| `FormPage` | Frame for add/edit forms (back link, title, card) |

A list page is roughly:

```jsx
const { items, loading, error, remove } = useAdminList('/api/v1/faqs', 'FAQ');
const { search, setSearch, page, setPage, totalPages, filtered, pageItems } =
    useListControls(items, ['question', 'answer']);
```

To add a section to the sidebar, add an entry to `adminNav` in [`AdminLayout.jsx`](src/admin/AdminLayout.jsx).

## Login session and inactivity logout

A signed-in user is logged out after **15 minutes without any activity in any tab** of the site. Everything lives in [`src/auth/`](src/auth/).

### How it works

- **One session, stored in localStorage** so it is shared by every tab and survives refreshes:

  | Key | Meaning |
  | --- | --- |
  | `token` | JWT from the API |
  | `user` | Cached user object |
  | `lastActivity` | Time of the last interaction in any tab (epoch ms) |

- **Activity:** mouse movement, clicks, key presses, scrolling, wheel and touch/pointer events update `lastActivity` (at most once every 5 seconds, so mouse movement doesn't flood localStorage).
- **One manager per page load.** [`SessionProvider`](src/auth/SessionProvider.jsx) wraps the app in [`main.jsx`](src/main.jsx) and starts `startInactivityManager()` once. It is never restarted on route changes, so navigating never adds timers or listeners. Pages have no timers of their own.
- **The timer never decides alone.** Each tab keeps one `setTimeout` set for the moment the shared session could expire (`lastActivity + 15 min`, or the JWT's `exp` if that is sooner). When it fires, it re-reads the shared `lastActivity`. If another tab was active in the meantime, it simply reschedules. A tab nobody is using therefore never logs out a session that another tab is using.
- **Cross-tab sync:** when a tab ends the session it removes the keys and posts `{ type: 'logout', reason }` on the `nexas-auth` BroadcastChannel. Other tabs react to that message, or to the localStorage `storage` event as a fallback, and each tab handles it only once. Tabs on protected pages (`/dashboard/*`, `/carts`, `/investment_start`) redirect to `/login`. Tabs on public pages stay put and switch to the logged-out view. Browsers do not allow a site to close tabs it didn't open, so tabs are redirected rather than closed.
- **Idempotent logout:** `endSession()` only acts if a token is still stored. Timers in several tabs, repeated 401s or double clicks can't log out twice.
- **Refresh and stale sessions:** on load the stored `lastActivity` is checked before anything else. An idle or expired session is ended straight away, and user activity is never allowed to refresh an already-expired timestamp. A token without a `lastActivity` counts as idle.
- **Backend expiry wins.** The client timer never extends a login. The JWT's own `exp` is enforced, and if the API answers `401` for the token (e.g. "Invalid or expired token"), the session ends in all tabs. Other 401s, such as a wrong current password, do not log you out.
- `/login` explains why you were sent there (inactivity, expired session, or logged out in another tab), and after logging in you return to the page you were on.

### Using it in code

```jsx
import { useSession } from '../auth/SessionProvider';

const { isAuthenticated, user, login, logout, updateUser } = useSession();
```

Always log in with `login(token, user)`, log out with `logout()`, and update the cached user with `updateUser(user)`. Don't write `token` or `user` to localStorage directly, because other tabs and the inactivity clock wouldn't be notified. Guard new private routes with `<ProtectedRoute allowedRoles={[...]}>`, and add their path prefix to `PROTECTED_PREFIXES` in `SessionProvider.jsx`.

### Testing without waiting 15 minutes

In development only, you can shorten the timeout from the browser console on the site, then reload:

```js
localStorage.setItem('debug:idleTimeoutMs', '20000'); // 20 seconds
localStorage.removeItem('debug:idleTimeoutMs');       // back to 15 minutes
```

Production builds ignore this key; the code is removed at build time.

### Limitation

Logout is client-side: the server has no logout endpoint or token blacklist, so a JWT copied out of the browser stays valid on the API until its own `JWT_EXPIRE`. To enforce inactivity on the server as well, issue short-lived tokens (e.g. 15 minutes) with a refresh endpoint, or add server-side sessions.

## News, Notices and Gallery

Three content sections managed from the dashboard and loaded from the API (routes, file handling and security are described in [`../server/README.md`](../server/README.md)).

| Public route | Page |
| --- | --- |
| `/news` · `/news/:slug` | News list (featured article, search, category, tag, date sort, pagination) and article page (share buttons, related news) |
| `/notices` · `/notices/:slug` | Notice board and notice page (PDF view/download, related notices) |
| `/gallery` · `/gallery/:slug` | Albums (search, year) and album page with a lightbox (arrows, Esc, swipe) |

The home page shows Latest News, Latest Notices and Gallery through [`HomeContent`](src/components/home/HomeContent.jsx). They come from one request that only starts when the visitor scrolls near them, and the sections are left out when nothing is published.

| Dashboard route | Page |
| --- | --- |
| `/dashboard/news` · `newsform` · `newsformedit/:id` | News |
| `/dashboard/notices` · `noticeform` · `noticeformedit/:id` | Notices |
| `/dashboard/gallery` · `galleryform` · `galleryformedit/:id` | Albums; photos are managed on the edit page (multi-upload, captions, drag to reorder, cover) |
| `/dashboard/media` | Media Library: every uploaded image and PDF |
| `/dashboard/settings` | Site Settings: site name and description for SEO, contact details and social links for the footer |

Where things live:

```
src/
├── api/content.js            API calls, 60-second cache for public reads, URL/date helpers
├── hooks/                    useAsync, useListParams (filters kept in the URL), useSeo
├── components/common/        Skeleton, LazyImage, RichText, PageParts (banner, empty/error states, pagination, filters)
├── components/news|notices|gallery|home/
├── pages/news|notices|gallery/
└── admin/
    ├── content/              Shared by the new dashboard pages: hooks, form fields, upload fields,
    │                         media picker, rich text editor, confirm dialog
    └── news|notices|gallery|media|settings/
```

### Loading: lazy loading and skeletons

- **Pages are code-split.** Every route except the home page is loaded with `React.lazy` in [`src/App.jsx`](src/App.jsx), so visitors only download the pages they open. The rich text editor is a separate file that loads only when an admin opens a news, notice or team form.
- **Skeletons instead of spinners.** While a page file or its data is loading, a skeleton of that page is shown ([`Skeleton.jsx`](src/components/common/Skeleton.jsx)): cards, notice rows, album covers, article and photo grids, and table rows in the dashboard.
- **Images load lazily.** [`LazyImage`](src/components/common/LazyImage.jsx) uses native lazy loading, shows a skeleton until the image arrives and a placeholder if it is missing. Uploaded images have a 640px and a 1920px version; `srcSet` lets phones download the small one.

### SEO

`useSeo({ title, description, image, type })` sets the page title, meta description, canonical link and Open Graph/Twitter tags, using the site name from Site Settings. News, notice and album pages fill these from their own content; missing items are marked `noindex`.

Because this is a client-rendered app, the tags are set in the browser. Google reads them; link previews on Facebook, LinkedIn or WhatsApp do not run JavaScript and will show the defaults from `index.html`. Per-article previews there need server-side rendering or a prerender service.

### API address

`VITE_API_URL` overrides the API address for both `npm run dev` and `npm run build`. Without it the behaviour is unchanged (local server in dev, Render in production builds).

## Changelog

### 2026-10-05 — Services: "Add Service" failed with 400 (Bad Request)

**Fixed**

- **Saving a service without an image returned 400 and only said "Failed to save service".** The server requires an image for a service, and the form sent an empty one. The form now marks the image as required and shows "Image is required" before anything is sent. Other server errors show the server's own message.
- **Saving a service with an image could not work either.** The image was uploaded to an old Netlify address instead of the API. It now goes to the same API as everything else.
- **Editing a service could not be saved.** The form required a Date, but services have no date on the server, so the field was empty on every edit. The Date field is removed; it was never stored.

**Changed**

- Add and edit now use one form, [`ServicesFrom.jsx`](src/admin/services/ServicesFrom.jsx); `ServicesFormEdit.jsx` re-exports it, so the routes are unchanged. Both have the rich text editor for the description.
- The description is stored as HTML. The service detail page shows it with its formatting; the service cards (home page and Services page) and the dashboard table show it as plain text.

**Tested**

- `npm run build` succeeds; ESLint reports no errors in the service dashboard files. The Service model was checked directly: an empty image is rejected with "Path `image` is required", a service with an image is accepted. The form was not clicked through in a browser.

### 2026-10-05 — Team: drag and drop order

**Added**

- **Team order.** On `/dashboard/teams`, drag a row (or use the up/down arrows in the new Order column) to put members in the order you want. The order is saved as soon as you drop and a "Team order saved" message appears. If saving fails, the list goes back to the previous order.
- The saved order is used everywhere team members are shown: the public Team page (`/team`), the home page Team section (which shows the first four) and the dashboard table.
- A new member is added at the end of the list.

**Changed**

- The dashboard Team table now shows all members on one page instead of 8 per page, so a row can be dragged to any position.
- Ordering is switched off while a search is active, because a search result is only part of the list. The Order column shows each member's position number instead.
- `useAdminList` in [`src/admin/ui.jsx`](src/admin/ui.jsx) now also returns `setItems`.

**Tested**

- `npm run build` succeeds; ESLint reports no errors in the changed dashboard files. The server side is covered by `npm test` in `../server` (46 passed). Dragging was not tried in a browser.

Until the order is changed for the first time, members appear as before (newest first). The server part is described in [`../server/README.md`](../server/README.md#changelog).

### 2026-10-05 — Team: "Add Team Member" did nothing

**Fixed**

- **Clicking "Add Team Member" did nothing.** The form required a `description`, but the text editor saved what you typed into a field named `content`. The description was therefore always empty, the form refused to submit, and no error was shown because the message was attached to the wrong field. The editor now fills `description` and shows "Description is required" when it is empty.
- **The editor lost its text and focus while typing.** It was re-created on every change to the form. It is now created once.
- **Editing a team member could not be saved.** The form required a Date, but team members have no date on the server, so the field was empty on every edit and blocked saving. The Date field is removed; it was never stored.
- **A team member could not be saved without a photo.** The server required an image and the form only said "Error saving team member". The image is now optional, in the form and in the server's Team model ([`../server/models/Team.js`](../server/models/Team.js)). Other server errors now show the server's own message.
- **A member without a photo would have crashed the public Team page and the home page Team section.** Both fell back to an undefined `assets` variable. They now show the default picture (`assets.projectdefaul`).

**Changed**

- Add and edit now use one form, [`TeamForm.jsx`](src/admin/team/TeamForm.jsx); `TeamFromEdit.jsx` re-exports it, so the routes are unchanged. Both have the rich text editor for the description.
- The description is now stored as HTML. The public Team page and the dashboard Team table show it as plain text, using the new `htmlToText` helper in [`RichText.jsx`](src/components/common/RichText.jsx).

**Tested**

- `npm run build` succeeds and ESLint reports no errors in the dashboard team files. The form was not clicked through in a browser, to avoid adding test members to the live database.

### 2026-10-04 — News, Notices, Gallery, Media Library and Site Settings

**Added**

- Public pages `/news`, `/news/:slug`, `/notices`, `/notices/:slug`, `/gallery`, `/gallery/:slug` ([details](#news-notices-and-gallery)): search, filters, pagination, empty/error/not-found states, PDF download, photo lightbox.
- Home page sections: Latest News, Latest Notices and Gallery, loaded from the API when scrolled near.
- Dashboard pages for News, Notices, Gallery (with photo upload, captions, reorder, cover), Media Library and Site Settings; totals and recent activity on the dashboard overview; sidebar grouped into Content / Media / Manage / Settings.
- Rich text editor (TipTap) for news and notice content, confirmation dialogs before deleting, upload progress bars, image and PDF previews.
- SEO tags (`useSeo`) on the new pages and the home page; default title and description in `index.html`.
- `VITE_API_URL` to override the API address.
- New packages: `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `dompurify`; dev: `eslint-plugin-react`.

**Changed and fixed**

- The main menu now has Home, About, Services, Projects, Team, Gallery, Notices, News and Contact; the other pages stay under "Pages". The full menu shows from 1280px wide, the mobile menu below that.
- **The mobile menu opened out of sight when the page was scrolled.** It was placed at the top of the page instead of under the sticky header. It is now part of the header and closes after navigating.
- Menu links are highlighted on sub-pages too (for example `/news/some-article` highlights News).
- Footer "Explore" links were all `#`; they now go to their pages.
- All routes are lazy-loaded with skeleton fallbacks ([details](#loading-lazy-loading-and-skeletons)).
- ESLint counted variables used only in JSX (such as `motion`) as unused. Adding the `react/jsx-uses-vars` rule removed 23 false errors. The stray `<link>` tag in `App.jsx` is gone.
- `resolveImage` now also handles media library paths (`/uploads/media/...`).

**Tested**

- Headless Chrome against an isolated test API: 134 public checks and 87 dashboard checks pass, at 1920, 1440, 1024, 768, 480 and 375px.
- `npm run build` succeeds. `npm run lint`: no errors in the new files; 69 errors remain in older files (92 before).

**Backend changes of the same day** are listed in [`../server/README.md`](../server/README.md#changelog).

### 15-minute inactivity logout

- Added the shared session layer in `src/auth/` ([details](#login-session-and-inactivity-logout)): one inactivity manager per tab, mounted at the app root; shared `lastActivity` in localStorage; BroadcastChannel and `storage`-event sync between tabs; idempotent logout; JWT `exp` and API 401s respected.
- Login, the Navbar, the dashboard header and the profile page now use the session through `useSession()` instead of reading and writing localStorage themselves, so the Navbar and cart update immediately when any tab logs in or out.
- `ProtectedRoute` now checks for a valid session (token present, not expired, not idle) rather than just a cached user. `/carts` and `/investment_start` are now protected too.
- `PublicRoute` sends signed-in admins to `/dashboard` and other users to `/`.
- Removed `src/routes/ProtectedRoute.jsx`, an unused duplicate of the route guard.
- Verified in headless Chrome with a 20-second timeout and mocked API responses. These scenarios all pass:
  - an idle dashboard logs out;
  - activity resets the timer;
  - 30 rapid page changes add no listeners;
  - activity in one tab keeps an untouched tab logged in;
  - two idle tabs both log out;
  - manual logout is synced across several tabs;
  - a refresh neither resets nor loses the clock;
  - a stale session logs out on load;
  - `/dashboard` and `/carts` require login after logout;
  - an expired JWT is rejected;
  - an API 401 logs out every tab.

### Profile page (now at `/dashboard/profile`)

- **Edit Profile opened with empty fields.** Loading a profile without a photo crashed on an undefined `assets` variable. The profile now loads for every account, and a user without a photo gets an initial-letter avatar.
- **Save Changes did nothing for new accounts.** The page required phone and address, which new accounts don't have, and showed no error text. Both are now optional (as on the server), phone is checked for a valid format, and every field shows its error message.
- **Email looked editable but was never saved** (the server ignores it). It is now read-only.
- **Saving could break the profile photo.** A photo saved as a full URL was rewritten into a local upload path. The stored value is now kept, and new uploads are checked for type and a 5 MB limit.
- **Change Password never showed server errors** such as "Incorrect current password": the page read `message`, but the server sends `error`. The success message was also hidden because the form closed at the same moment. Results now appear as a toast, and errors show inside the form.
- The new token returned after a password change is saved, the Navbar's stored user is refreshed after a profile update, and Logout also clears the stored user.
- The page is split into a profile card and a password card, with labelled fields.

### Broken image icons

- Two projects ("Global Real Estate Ventures", "Crypto & Forex Portfolio Management") have an icon link through `imgs.search.brave.com` that now returns **405 Method Not Allowed**. Public pages hide an icon that fails to load instead of showing a broken image, and the dashboard shows a placeholder. To clear the console error, edit those projects and use the original image link: `https://cdn.vectorstock.com/i/preview-1x/37/86/career-growth-flat-line-icon-outline-vector-35803786.jpg`.

### Admin dashboard redesign

- New `AdminLayout`: a fixed dark sidebar with icons and an active state, a slide-in menu on mobile, and a top bar with breadcrumb, current user and Logout. It replaces the old toggle sidebar (`Sidbar.jsx` and `sortcomponent/Dropdown.jsx` were removed).
- The Overview page shows real counts for users, projects, services, blogs, team, testimonials and FAQs instead of placeholder figures, plus quick-add buttons, restyled charts, recent projects and the latest blog posts.
- Services, Projects, Blogs, Team, Testimonials, FAQs and Users list pages were rebuilt on shared components with search, pagination, loading skeletons and empty states. The Team table no longer auto-scrolls.
- All 12 add/edit forms use the shared `FormPage` frame. The FAQ forms' wrong "Add New Services" title is fixed.
- The project detail page was redesigned.

### Bug fixes

- **Deleting items did nothing.** Protected API routes need a Bearer token, which the list pages never sent. The API client now adds it to every request.
- **FAQ delete crashed** (`AxiosWithAuth.delete` was called without `()`), and **Testimonial delete used a wrong URL** (`/v1/...` instead of `/api/v1/...`).
- **Search only covered the current page, and pagination showed "Page 1 of undefined".** The API returns every record, so search and paging now run on the client.
- **The home page was blocked by a full-screen loader.** Every section drew its own opaque overlay until the slowest request finished. `Loading` is now an inline spinner per section, with an optional `fullScreen` prop.
- **Services showed "No Services available" while still loading.** The loading check now runs first.
- **Requests could hang forever.** A 60-second timeout was added.
- **Local development called the production API.** Dev mode now uses the local server; see [Which backend is used](#which-backend-is-used).

## Known issues

- **The production backend on Render is not responding.** It accepts connections but never replies, so the deployed site times out. Check the service logs on Render. A likely cause is a failed MongoDB connection: [`server/config/db.js`](../server/config/db.js) exits the process on failure. Make sure `MONGO_URI` is set on Render and that MongoDB Atlas allows connections from Render.
- `npm run lint` still reports 69 errors in files that existed before the News/Notices/Gallery work (mostly unused imports and undefined `assets` in older pages). The new files are clean.
- On phones, the About, Services and Projects pages scroll a few pixels sideways.
- Most seeded images are `imgs.search.brave.com` links, which can stop working at any time (see [Broken image icons](#broken-image-icons)). Upload images through the dashboard or use the original image URLs.
- The home page Projects section and the Projects page render `project.icon` as an icon-font class (`<i className={project.icon}>`), but the field holds an image URL, so no icon appears there.
- The `atomic-spinner` package is no longer used and can be removed with `npm uninstall atomic-spinner`.
