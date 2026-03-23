# YelpCamp Frontend SPA

> The newly rebuilt React application for YelpCamp featuring a dark-mode neon design system.

This frontend serves as a fast, decoupled Single Page Application. It leverages Vite for a blazing fast development server and optimized production build, `react-router-dom` for client-side routing, and `axios` to communicate with the Express API backend securely via cookies.

## 🎨 Design System

The application has been styled with **Tailwind CSS v4** featuring a customized $100M ARR enterprise SaaS premium "dark-mode neon" aesthetic. 

- **Primary Colors**: Deep Grays/Blacks (`base-800`, `base-900`) combined with `base-border` for panels.
- **Accents**: Striking `neon-blue`, `neon-purple`, and `neon-green` highlights.
- **Components**: Glassmorphism (`glass-panel`) combined with custom CSS glow utilities (e.g., `.glow-blue`, `.text-glow`).

## 🛠 Tech Stack

- **Core Engine**: React 19 via Vite
- **Styling**: Tailwind CSS & Vanilla CSS (for custom utility definitions)
- **Routing**: React Router DOM (v7)
- **Network**: Axios (configured with `withCredentials: true` to support persistent secure cookie sessions)
- **State Management**: React Context (`AuthContext.jsx`) globally manages and distributes authentication state, immediately propagating login/logout changes without page reloads.

## 🗂 Key Directories

- `/src/components`: Reusable layout and interactive UI elements (`Navbar.jsx`, `Layout.jsx`, `Footer.jsx`).
- `/src/pages`: Top-level navigational route components. Notable features include the `CampgroundDetail.jsx` which hosts a custom-built, interactive **Neon 5-Star Rating Component** supporting inline review edits and deletions.
- `/src/index.css`: Initialization of the Tailwind `@theme` directives and custom custom utility definitions (glows, custom scrollbars, animations).

## ▶️ Running the Application

Before starting the frontend, guarantee that your backend Express server is actively running on `http://localhost:3000`.

Install all Node modules:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The application will be accessible at [http://localhost:5173](http://localhost:5173).
