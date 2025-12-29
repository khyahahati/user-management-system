# Mini User Management Frontend

React + Vite single page application scaffold for the Mini User Management System. The UI consumes the REST APIs provided by the upcoming Node + Express backend and wires together authentication, protected routing, and basic user management screens.
## Getting Started

1. Copy the environment template and set the API base URL:
	```bash
	cp .env.example .env
	# edit .env and set VITE_API_URL to your backend URL (e.g. http://localhost:5000/api)
2. Install dependencies:

	```bash
	npm install

3. Start the dev server:
	```bash
	npm run dev
	```
The app is available at http://localhost:5173 by default.

## Available Scripts
- `npm run dev` – start the Vite development server with HMR.
- `npm run build` – generate a production build in `dist`.
- `npm run preview` – preview the production build locally.
## Project Structure

```
src/
├── api/           # Axios API clients for auth, user, admin endpoints
├── components/    # Reusable UI components (navbar, table, modal)
├── context/       # AuthContext with token persistence
├── pages/         # Login, Signup, Dashboard, Profile screens
├── routes/        # Route guards (PrivateRoute, AdminRoute)
├── utils/         # Shared utilities (axios instance)
├── App.jsx        # App shell and route definitions
└── main.jsx       # Entry point
## Features

- Global Axios instance with JWT injection from `localStorage`.
- AuthContext handling login, signup, logout, and current user hydration.
- Protected routes for authenticated users and admins.
- Responsive, minimal UI with loading and error states.
- Forms with client-side validation tied to the provided API contract.
## Next Steps

- Connect the frontend to the Node + Express backend once available.
- Extend pages with real data handling for admin-only features as backend endpoints mature.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
