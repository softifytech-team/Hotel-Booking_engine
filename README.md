# SaaSBook - Hotel Booking Engine Admin Portal

Welcome to the **SaaSBook Admin Portal**, a complete, production-ready frontend template built with Next.js, Tailwind CSS, and Recharts.

---

## 1. Full UI Structure & Navigation Flow

1. **Global Shell Layout**
   - **Sidebar (Left):** Sticky role-aware navigation menu featuring the product branding.
   - **Topbar (Top):** Shows current user, notification bell, and a **Role Switcher** for testing purposes.
2. **Dashboard Overview (`/`)**
   - 4 Dynamic KPI Cards (Total Revenue, Bookings, Occupancy, Available Rooms). Revenue is hidden for Managers/Staff.
   - LineChart showing a 7-day booking and revenue trend.
   - Abstracted recent bookings table.
3. **Rooms Management (`/rooms`)**
   - Inventory table displaying mock room data.
   - Interactive "Add Room" Modal overlay capturing Name, Type, Price, and Image Upload placeholder.
4. **Bookings Management (`/bookings`)**
   - Full booking history with tabular layout.
   - Filter pills (All, Confirmed, Pending, Checked In, Checked Out, Cancelled) to dynamically sort the table data.
   - Search bar mock implementation.
5. **Pricing Management (`/pricing`)**
   - Split views into Base Pricing, Seasonal Pricing, and Discounts.
   - Shows active applied seasonal multipliers and UI indicating discounts.
6. **Users & Roles (`/users`)**
   - Detailed **Permissions Matrix Table** illustrating module access across Super Admin, Hotel Admin, Manager, and Staff.
   - Mock user directory list.
7. **Settings (`/settings`)**
   - Form inputs for master property details, simulated payment integrations (Stripe, PayPal), and drop-down for property policies.

---

## 2. Component Breakdown

- **`Sidebar`**: Connects to Next.js `usePathname` for active route highlights. Subscribes to `AuthContext` to filter visible routes.
- **`Topbar`**: Contains the dummy user profile and the fast role-switching `<select>` menu.
- **`Card` Family**: (`Card`, `CardHeader`, `CardTitle`, `CardContent`) completely reusable layout shells defining the aesthetic shadow/border radiuses.
- **`Table` Family**: Headless-inspired HTML table wrappers styled uniformly using `className` merging.
- **`Badge`**: Status chips with various mapped coloring options (`success`, `warning`, `destructive`).
- **`AuthContext`**: Global React Context API managing the current 'Role' state across the portal dynamically.

---

## 3. Folder Structure

```
d:\admin_portal_hotelbooking\
│
├── src/
│   ├── app/
│   │   ├── layout.jsx        (Main Next.js Layout + Wrapper)
│   │   ├── page.jsx          (Dashboard Route)
│   │   ├── globals.css       (Tailwind & SaaS Variables)
│   │   ├── rooms/page.jsx
│   │   ├── bookings/page.jsx
│   │   ├── pricing/page.jsx
│   │   ├── users/page.jsx
│   │   └── settings/page.jsx
│   │
│   ├── components/
│   │   ├── layout/           (Sidebar, Topbar)
│   │   └── ui/               (Card, Table, Badge Reusable Elements)
│   │
│   └── context/
│       └── AuthContext.jsx   (State & Role management)
│
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
└── next.config.mjs
```

---

## 4. How to Run Locally

Because the Next.js initialized code and components have already been fully generated for you in this directory, you simply need to install the dependencies and run it.

Open your terminal (PowerShell, Command Prompt, or VSCode Terminal), navigate to this directory, and run the following:

**Step 1. Install Node.js**
(If you don't already have it installed, download it from https://nodejs.org)

**Step 2. Install Project Dependencies**
```bash
npm install
```

**Step 3. Start the Development Server**
```bash
npm run dev
```

**Step 4. Open in Browser**
Navigate to `http://localhost:3000` in your web browser. 
*(Use the Topbar dropdown to change roles and instantly see the UI re-render restrictions!)*
