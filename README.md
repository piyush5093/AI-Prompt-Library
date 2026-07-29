# AI Prompt Library 🚀

A modern, highly-polished full-stack web application for creating, managing, and organizing your AI prompts. Built with a premium UI, powerful filtering, and local-first architecture with cloud synchronization.

---

## ✨ Features Overview (All Mandatory Requirements Met)

### 1. 📊 Comprehensive Dashboard
- **Live Metrics:** Instantly view Total Prompts, Favorite Prompts, Active Categories Count, and Recently Added Prompts (last 7 days).
- **Responsive Layout:** A clean, grid-based dashboard that adapts perfectly to desktop, tablet, and mobile environments.

### 2. 📝 Advanced Prompt Management
- **Full CRUD Operations:** Create, Edit, Delete (with safety confirmations), and Duplicate prompts seamlessly.
- **Rich Data Model:** Each prompt stores a Title, Prompt Content, Category, Tags array, detailed Description, Creation Date, and Last Updated Date.
- **Drag & Drop Reordering:** Fully interactive drag-and-drop interface (powered by `@dnd-kit`) to organize your prompt cards exactly how you want them.
- **Quick Actions:**
  - One-click **Copy to Clipboard**.
  - **Pin** important prompts to the absolute top.
  - **Favorite / Unfavorite** toggles.

### 3. 🔍 Powerful Search & Filters
- **Deep Search:** Instantly search through prompt titles and prompt content.
- **Category Filtering:** Filter by the exact 10 mandatory categories.
- **Favorites Filter:** Isolate your most-used prompts with a single checkbox.
- **Sorting Options:** Sort your library by Newest, Oldest, A→Z, and Z→A.

### 4. 🗂️ Categories
Strictly enforced to exactly 10 mandatory categories:
- Coding, Marketing, Content Writing, Email, Resume, SQL, Design, Social Media, Productivity, Others.

### 5. 🔄 Import & Export
- **JSON Export:** Export all your prompts instantly as a formatted `.json` file for backup or sharing.
- **Strict JSON Import:** Import prompts from a `.json` file. Includes rigorous data validation to ensure data integrity and category strictness before merging.

### 6. 🌙 Premium UI & Theming
- **Dark / Light Mode:** Seamlessly switch between themes. Your preference is persisted across reloads.
- **Custom Design System:** Features a bespoke, text-based typographic logo, amber accents (`#f59e0b`), glassmorphic modals, and micro-animations for a highly premium feel.
- **Custom Toast Notifications:** Non-intrusive, auto-dismissing, stackable floating toast notifications for success/error feedback.

### 7. ⚛️ State Management
- Built entirely on the **React Context API** (`PromptContext`, `ThemeContext`, `ToastContext`) for robust global state management without prop-drilling.

### 8. 💾 Storage (Local-First)
- **Instant LocalStorage:** All prompts and actions are instantly persisted using `LocalStorage` for zero-latency UI updates and full offline support.

### 9. 🌐 Backend API & Database
- Built-in integration with a **Node.js/Express Backend** connected to a **MongoDB** database.
- **RESTful Endpoints:** The frontend calls the API endpoints to dynamically store (POST), fetch (GET), update (PUT), and delete (DELETE) prompts, silently syncing your local changes to the cloud.

### ⌨️ Technical Additions & Keyboard Shortcuts
- **Keyboard Shortcuts:** Press `Alt + N` to quickly open the "New Prompt" modal without touching your mouse! Use `Escape` to close any open dialogs.
- **Clipboard API:** Native integration for seamless one-click copying.
- **Performance:** Optimized with custom hooks like `useDebounce` to prevent lag during rapid searching.
- **Meaningful Git Commits:** The repository features incremental, well-documented commits.

---

## 🛠️ Technology Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **State Management:** React Context API
- **Drag & Drop:** `@dnd-kit/core` & `@dnd-kit/sortable`
- **Icons:** `lucide-react`
- **Backend:** Node.js, Express, MongoDB (Mongoose)

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/piyush5093/AI-Prompt-Library.git
cd AI-Prompt-Library
```

### 2. Backend Setup (Server)
Navigate to the server directory, install dependencies, and start the development server.
```bash
cd server
npm install
npm run dev
```
*(Ensure you have configured your environment variables in `.env` based on `.env.example`. You will need a `MONGODB_URI` connection string).*

### 3. Frontend Setup (Client)
Open a new terminal window, navigate to the client directory, install dependencies, and start the Vite development server.
```bash
cd client
npm install
npm run dev
```

### 4. Open the Application
Navigate to `http://localhost:5173` (or the port provided by Vite) in your browser. You're ready to start building your Prompt Library!

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
