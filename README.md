# takarabako

`takarabako` is a personal knowledge collection app for saving creators, learning resources, quotes, books, tools, and other things worth returning to.

The name comes from the Japanese word 「宝箱／たからばこ」, meaning “treasure box.”

---

## Overview

`takarabako` is designed as a quiet personal space for organizing knowledge sources and learning materials.

Instead of only saving links, the app helps collect different kinds of items, such as:

* creators and sources to follow
* essays and newsletters to read
* YouTube videos and podcasts to revisit
* books and quotes to keep
* tools and websites for learning or creation

The project is currently built as a frontend-only MVP using local browser storage.

---

## Features

* Add, edit, and delete saved items
* Organize items by type
* Add flexible tags
* Search and filter saved items
* Save quotes with author/source information
* Detect YouTube URLs and auto-fill basic video information
* Detect books.com.tw URLs as book items
* Store data locally with `localStorage`

Current item types include:

* Tool
* Essay
* Newsletter
* YouTube
* Podcast
* Course
* Website
* Book
* Quote

---

## Tech Stack

* React
* Vite
* TypeScript
* Tailwind CSS
* localStorage

---

## Getting Started

### Prerequisites

Please make sure you have the following installed:

* Node.js
* npm

### Clone the repository

```bash
git clone https://github.com/your-username/takarabako.git
cd takarabako
```

Replace the repository URL with your own fork or project URL if needed.

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:5173/
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Data Storage

This project currently uses browser `localStorage`.

No backend, account system, or cloud database is required for the current version. Data is stored locally in the user's browser, so it will not sync across devices or browsers.

---

## Project Structure

```text
src/
├── App.tsx
├── main.tsx
├── types.ts
├── components/
│   ├── layout/
│   ├── resource/
│   └── ui/
├── hooks/
└── utils/
```

Key areas:

* `App.tsx`: main app state and page structure
* `types.ts`: TypeScript types and item definitions
* `components/`: UI and feature components
* `hooks/`: reusable React hooks
* `utils/`: utility logic such as URL detection

---

## Current Limitations

* Data is stored locally and does not sync across devices
* General website metadata extraction is not fully supported yet
* No login or cloud database integration yet
* The project is still evolving as a learning-focused MVP

---

## Future Ideas

* Import / export JSON data
* Better source/work distinction
* More complete podcast and creator support
* Serverless metadata extraction for articles and websites
* Automated tests
* Optional cloud sync and authentication

---

## License

License information will be added later.
