<div align="center">
  <h1>Restaurant Manager Frontend</h1>
  <p><strong>Modern, real‑time, themeable restaurant operations dashboard & ordering interface.</strong></p>
  <p>
    Built with <b>Next.js 15</b>, <b>React 19</b>, <b>Material UI v7</b>, <b>React Query v5</b>,
    <b>Redux Toolkit</b>, <b>Socket.IO</b>, <b>SCSS Modules</b>, and <b>Tailwind utilities</b>.
  </p>
  <p>
    <em>Supports dark / light mode, role‑based UX (Admin · Staff · Customer), live order flow, analytics & menu management.</em>
  </p>
</div>

---

## ✨ Core Features

### Roles & Capabilities

- **Admin**: Real‑time dashboards, revenue breakdowns, payment analytics, menu CRUD, user management, order lifecycle oversight.
- **Staff**: Create/manage table orders, mark items served, checkout with payment method tagging.
- **Customer**: Browse menu, place orders, see status (depending on deployment integration).

### Operational Tools

- 🔄 **Real‑time updates** via Socket.IO (order completion, served status, dashboard refresh).
- 📊 **Analytics**: Cash vs Online breakdown, time‑range filters (today, weekly, monthly, yearly, overall), charts (Pie / Bar / KPIs).
- 🧾 **Menu Management**: Add, edit, toggle availability, filter by category & status, search with debounced input UX.
- 🧑‍🤝‍🧑 **User Admin**: (Create / role assignment in admin panel components).
- ⚡ **Fast Data Layer**: React Query caching, background refetch & invalidations.

### UI / UX

- 🎨 **Unified theme gradient**: `linear-gradient(45deg, #ff9800, #ff5722)` with dark-mode tuned variants.
- 🌓 **Dark / Light Mode**: Context + MUI palette + CSS custom properties (`html[data-theme]`) for hybrid theming. Smooth transitions.
- 📱 **Responsive**: Mobile navigation (SpeedDial / drawers), adaptive grids, touch-friendly controls.
- ♿ **Accessibility-minded**: Semantic headings, focus styles preserved, high-contrast in dark mode.

### Reliability & Quality

- ✅ Error toasts & guarded mutations.
- 🔐 Auth persistence wrapper (`AuthPersistence`) + protected flows (backend JWT assumed).
- ♻ LocalStorage persistence for color mode & session-relevant metadata (e.g., table number).

---

## 🗂 Project Structure (Frontend)

```
app/
  layout.js                # Root providers (Theme, QueryClient, Redux, ColorMode)
  page.js                  # Landing / entry
  pages/...                # Route segment pages (legacy style for certain views)
  components/              # UI + feature components (navbar, admin panels, cards, etc.)
    adminComp/             # Admin dashboard modules (analytics, menu items, user access)
    ordersCards/           # Order detail cards
    itemCard/              # Menu listing item components
    signIn/, LoaderComp/, navbar/, DateAndTimeFormat/, etc.
  redux/                   # Redux Toolkit slices & store
  theme/                   # ColorMode context
  lib/                     # API helpers (auth, order queries)
  utils/                   # Migration / helper scripts
globals.css                # Global CSS variables & Tailwind layers
```

---

## 🌗 Theming Strategy

| Layer           | Purpose                      | Implementation                                                |
| --------------- | ---------------------------- | ------------------------------------------------------------- |
| MUI Palette     | High-level component theming | `createTheme({ palette.mode })`                               |
| CSS Variables   | Cross-SCSS + custom surfaces | `--bg-page`, `--bg-surface`, `--text-muted`, `--text-heading` |
| Context         | User toggle + persistence    | `ColorModeContext` + `localStorage`                           |
| Gradient Tokens | Brand identity               | Inline linear-gradient across buttons, chips, headers         |

Dark mode is applied by `<html data-theme="dark">` which flips CSS var values and MUI palette simultaneously for cohesive color sync.

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 20+ recommended
- Yarn or npm (examples use npm)
- Backend API (set in `next.config.mjs` `env` values)

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Dev Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Build & Start

```bash
npm run build
npm start
```

### 5. Lint (optional)

```bash
npm run lint
```

---

## 🔑 Environment Configuration

`next.config.mjs` exposes:

```
PROD_BACKEDN=https://resturant-mgr-backend.onrender.com
LOCAL_BACKEND=http://localhost:5000
ENV_MODE=development
```

You can also create a `.env.local` if you prefer runtime overrides.

---

## 📡 Data & Real-time

- Queries: React Query with keys like `getAllMenuItems`, `getAdminData`.
- Mutations: Create / update / delete menu items, toggle availability, checkout order, etc.
- Real-time: Socket connection listens for `order-completed` and triggers query invalidation.

---

## 🧱 Key Components

| Component          | Purpose                                                            |
| ------------------ | ------------------------------------------------------------------ |
| `Navbar`           | Role-based navigation + theme toggle (desktop + mobile)            |
| `MenuItems`        | Filtering, searching, adding menu items (admin)                    |
| `MenuItemCard`     | Individual menu item card with availability switch & modal editing |
| `OrderCard`        | Active order detail: items, served status, subtotal, actions       |
| `DataVisualize`    | Analytics dashboard: time-range filters, charts                    |
| `AuthPersistence`  | Maintains user/session state between reloads                       |
| `ColorModeContext` | Provides `toggleColorMode`                                         |

---

## 🎨 Dark Mode Coverage

Implemented for: Navbar, home, orders (allOrder), loader, item cards, admin menu management, analytics panels, modals, and availability sections. Remaining refinements may include polishing any legacy hardcoded light gradients inside less-used modals.

---

## 🧪 Extending & Testing Ideas

While no explicit test suite is included yet, recommended next steps:

- Add Jest + React Testing Library for component snapshot & interaction tests.
- Integrate Playwright for admin workflow (create menu item → toggle availability → see in list).
- Add React Query Devtools in development for cache inspection.

---

## ♻ Performance Notes

- React Query keeps network usage lean with stale-time tuning.
- CSS variable theming avoids re-renders for most pure style changes.
- Socket.IO events only refetch targeted keys.

---

## 🔐 Security Considerations

- Assumes HTTP-only JWT cookie auth server-side.
- Avoids storing sensitive tokens in localStorage (only UI prefs like theme).
- Recommend enabling CORS restrictions + rate limiting on backend.

---

## 🛠 Common Commands

| Action       | Command         |
| ------------ | --------------- |
| Dev          | `npm run dev`   |
| Build        | `npm run build` |
| Start (prod) | `npm start`     |
| Lint         | `npm run lint`  |

---

## 🤝 Contributing

1. Fork & branch: `feat/<feature-name>`
2. Maintain stylistic consistency (SCSS modules + gradient brand where relevant)
3. Ensure dark mode styles are variable-based (`var(--bg-surface)`, etc.)
4. Open PR with concise description & screenshots (light + dark)

### Suggested Future Enhancements

- Offline queue for order submissions
- Role-based route guards in middleware
- Multi-language / i18n support
- Revenue trend forecasting widget
- Export analytics (CSV / PDF)

---

## 📷 UI Previews

<p align="center">
  <img width="1413" height="829" alt="image" src="https://github.com/user-attachments/assets/d1e90a14-2d34-4f73-9a6b-4934320c5c96" />

  <img width="800" src="https://github.com/user-attachments/assets/9112812f-dbe8-41c2-a5fb-1ba35395bf6b" />
<img width="1910" height="662" alt="7" src="https://github.com/user-attachments/assets/4ddf44ec-fefd-4fe9-a684-2917baf35c38" />
<img width="1908" height="945" alt="8" src="https://github.com/user-attachments/assets/dc2617a6-6cce-4721-a12c-0ce2c5d4d23b" />
 <img width="800" src="https://github.com/user-attachments/assets/f507c5e9-6ca6-4472-868c-464e230fd90b" />
  <img width="800" src="https://github.com/user-attachments/assets/593634b9-77ba-45f4-b3e1-964c34aa5af7" />
  <img width="800" src="https://github.com/user-attachments/assets/fa3074f1-be2b-4715-804d-5dc8cbe32da0" />
  <img width="800" src="https://github.com/user-attachments/assets/cc111af6-f815-4272-9776-8c48cbe14958" />
  <img width="800" src="https://github.com/user-attachments/assets/137c400a-b59e-4259-a939-9ed10a22965c" />
</p>

---

## 📝 License

Currently proprietary / unspecified. Add a LICENSE file if distributing.

---

## 🙌 Acknowledgements

- Material UI team for robust component system.
- TanStack Query for painless async state.
- Socket.IO for real-time simplicity.
- Community OSS inspiration for dashboard UX patterns.

---

Made with passion for smoother restaurant operations.
