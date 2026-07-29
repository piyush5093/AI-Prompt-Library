# AI Prompt Library 🚀

A modern, highly-polished web application for creating, managing, and organizing your AI prompts. Built with a premium UI, powerful filtering, and local-first architecture with cloud synchronization.

## ✨ Key Features

### 📊 Comprehensive Dashboard
- **Live Metrics:** Instantly view Total Prompts, Favorite Prompts, Active Categories, and Recently Added Prompts (last 7 days).
- **Responsive Layout:** A clean, grid-based dashboard that adapts perfectly to desktop and mobile environments.

### 📝 Advanced Prompt Management
- **Full CRUD:** Create, Edit, Delete (with safety confirmations), and Duplicate prompts.
- **Rich Data Model:** Each prompt stores a Title, Content, Category, Tags array, detailed Description, Creation Date, and Last Updated Date.
- **Drag & Drop Reordering:** Fully interactive drag-and-drop interface (powered by `@dnd-kit`) to organize your prompts exactly how you want them.
- **Quick Actions:** One-click "Copy to Clipboard", "Pin to Top", and "Favorite" toggles.

### 🔍 Powerful Search & Filters
- **Deep Search:** Instantly search through prompt titles, content, *and* individual tags.
- **Category Filtering:** Filter by 10 strictly enforced categories (e.g., *Coding, Marketing, SQL, Productivity*).
- **Favorites Filter:** Isolate your most-used prompts with a single click.
- **Sorting Options:** Sort by Newest, Oldest, A-Z, Z-A, or your own Custom Drag-and-Drop order.

### 🌙 Premium UI & Theming
- **Dark & Light Mode:** Seamlessly switch between themes. Your preference is persisted across reloads.
- **Custom Design System:** Features a bespoke, text-based typographic logo, amber accents (`#f59e0b`), glassmorphic modals, and micro-animations for a highly premium feel.
- **Custom Toast Notifications:** Non-intrusive, auto-dismissing, stackable floating toast notifications for success/error feedback.

### 💾 Local-First & Cloud Sync (Storage)
- **Instant LocalStorage:** All actions are instantly saved to LocalStorage for zero-latency UI updates and full offline support.
- **Backend API:** Built-in integration with a Node/Express backend that silently synchronizes your CRUD operations to the database in the background.

### 🔄 Import & Export
- **JSON Export:** Download your entire library instantly as a formatted `.json` file for backup or sharing.
- **Strict JSON Import:** Upload a `.json` file to merge prompts into your library. Includes rigorous validation to ensure data integrity and category strictness.

---

## 🛠️ Technology Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **State Management:** React Context API (`PromptContext`, `ThemeContext`, `ToastContext`)
- **Drag & Drop:** `@dnd-kit/core` & `@dnd-kit/sortable`
- **Icons:** `lucide-react`
- **Backend:** Node.js, Express (API endpoints for CRUD operations)

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
*(Ensure you have configured your environment variables in `.env` based on `.env.example` if applicable).*

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

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/piyush5093/AI-Prompt-Library/issues).

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
