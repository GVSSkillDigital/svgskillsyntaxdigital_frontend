# GVS Digital Trainings Frontend

The frontend for the SVG Digital Board website. It is a single-page application built with Angular 17 and TypeScript. The site includes home, about, services, courses, blogs, registration, login, and student dashboard pages.

## Technology

- Angular 17
- TypeScript 5.2
- RxJS 7
- Tailwind CSS, loaded from its CDN in `src/index.html`
- npm for dependency installation and scripts

## Prerequisites

- Node.js 18.13+ or 20.9+ (Node.js 20 LTS is recommended for Angular 17)
- npm, which is included with Node.js
- Git
- The training backend, if you want to load course data or submit registrations

Check your local versions:

```bash
node --version
npm --version
git --version
```

## Setup

Clone this repository and install the locked dependencies:

```bash
git clone https://github.com/GVSSkillDigital/svgskillsyntaxdigital_frontend.git
cd svgskillsyntaxdigital_frontend
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`. You do not need to install Angular CLI globally; the project uses its local CLI.

## Run locally

Start the Angular development server:

```bash
npm start
```

Then open [http://localhost:4200](http://localhost:4200). The Angular CLI rebuilds the app when source files change. You can also use `npm run start`.

On Windows PowerShell, if script execution policy prevents `npm` from running, use the Windows command shim:

```powershell
npm.cmd ci
npm.cmd start
```

## Backend API

The frontend expects the training API at `http://localhost:8080/api` (configured in `src/app/services/training.service.ts`). It calls:

- `GET /courses` to load course listings
- `POST /auth/register` to submit a student registration with `fullName`, `email`, `password`, `phone`, `courseCode`, and `educationLevel`
- `POST /auth/login` to authenticate with `email` and `password`; the returned access token and profile are kept in the current browser session

Run the compatible backend separately and make sure it allows requests from the frontend origin (`http://localhost:4200`). The backend is not part of this frontend repository. The frontend server can start without it, but course data and registration require the API to be available. The API URL is currently hard-coded; no frontend `.env` file is used.

## Build

Create a production build:

```bash
npm run build
```

The Angular CLI writes build output under `dist/GVDigitalTrainings/`.

## Application routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/services` | Services |
| `/courses` | Courses (loads data from the backend API) |
| `/blogs` | Blogs |
| `/register` | Student registration (uses the backend API) |
| `/login` | Student sign-in |
| `/dashboard` | Authenticated student dashboard |
| `/login` | Login |

Unknown routes redirect to the home page.

## Project structure

```text
src/
  app/
    components/   Shared header and footer
    pages/        Page components
    services/     HTTP/API services
    app.routes.ts Application routes
  assets/         Static assets
  main.ts         Application entry point
  styles.css      Global styles
```

## Available npm scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the local Angular development server |
| `npm run build` | Build the application |
| `npm run ng -- <command>` | Run another Angular CLI command, for example `npm run ng -- version` |
