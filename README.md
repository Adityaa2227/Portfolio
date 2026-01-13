# <div align="center">Aditya Agarwal | Cinematic Developer Portfolio 🚀</div>

<div align="center">

![MERN Stack](https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge&logo=mongodb&logoColor=green)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![GSAP](https://img.shields.io/badge/GSAP-Animation-00Dfa2?style=for-the-badge&logo=greensock&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<h3 align="center">Where Engineering Meets Artistry</h3>

[View Live Demo](#) · [Report Bug](https://github.com/Adityaa2227/Portfolio/issues) · [Request Feature](https://github.com/Adityaa2227/Portfolio/issues)

</div>

---

## 📖 About The Project

This is not just a portfolio; it's a statement of work. Designed and engineered by **Aditya Agarwal**, this application represents the intersection of robust full-stack engineering and premium user experience design.

Built from scratch using the **MERN Stack**, it moves beyond static templates to offer a fully dynamic, administrative-controlled content management system paired with high-performance, cinematic frontend interactions.

### 🌟 Engineering Philosophy
*   **Performance First**: Optimized asset loading, code splitting, and efficient animation cycles.
*   **Interaction Design**: Using **GSAP ScrollTrigger** and **Framer Motion** to create "Punchy" yet smooth reveal effects that respond to user scrolling behavior.
*   **Scalability**: A modular backend architecture allowing for easy addition of new features (Blogs, Case Studies, etc.).
*   **Control**: A secure, comprehensive Admin Panel to manage every aspect of the public-facing site without touching a line of code.

---

## ✨ Key Features

### 🎨 Visual & Frontend
*   **Cinematic "Curtain Reveal" Loader**: A custom boot-sequence loader that seamlessly lifts to reveal the content only when backend health is confirmed.
*   **Premium Zig-Zag Project Layout**: A high-end showcase for featured work, utilizing large aspect-video visuals, 3D tilt hover effects, and directional scroll animations.
*   **GSAP Powered Scroll System**:
    *   *Smart Revealers*: Elements fade in/out based on scroll direction.
    *   *Staggered Lists*: Skills and experience items cascade elegantly.
    *   *Performance*: Animations are wrapped in `gsap.context` for safely handling React StrictMode and unmounts.
*   **Glassmorphism & Grainy Gradients**: Modern aesthetic choices including backdrop blurs and subtle noise overlays for depth.

### ⚙️ Backend & Admin (CMS)
*   **Full CRUD Admin Dashboard**:
    *   **Projects**: Create, Edit, Delete, and Toggle "Featured/Published" status.
    *   **Skills**: Manage technical skills and categorize them dynamically.
    *   **Experience**: Update timeline and work history.
    *   **Bio/Profile**: Update the "About Me" section text instantly.
*   **Secure Authentication**: JWT-based login system for the administrator.
*   **Image Management**: Multer integration for handling project screenshots and asset uploads.

---

## 🛠️ Technology Stack

### Frontend
| Tech | Purpose |
| :--- | :--- |
| **React 18** | UI Library (Vite Build Tool) |
| **GSAP** | Complex Scroll Animations & Timelines |
| **Framer Motion** | Component-level micro-interactions |
| **Tailwind CSS** | Styling System |
| **Lucide React** | Iconography |

### Backend
| Tech | Purpose |
| :--- | :--- |
| **Node.js & Express** | RESTful API & Server Logic |
| **MongoDB & Mongoose** | Database & Object Modeling |
| **JWT (JSON Web Tokens)** | Security & Authentication |
| **Multer** | File Upload Handling |

---

## � Getting Started

To run this portfolio locally on your machine, follow these steps.

### Prerequisites
*   Node.js (v16 or higher)
*   MongoDB installed locally or a MongoDB Atlas URI

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Adityaa2227/Portfolio.git
    cd Portfolio
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    ```
    *   Create a `.env` file in the `server` root:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_key
        # For production usage:
        # CLIENT_URL=https://your-domain.com
        ```
    *   *(Optional)* Seed initial data:
        ```bash
        node scripts/seedProjects.js
        ```

3.  **Setup Frontend**
    ```bash
    cd ../client
    npm install
    ```

4.  **Run Development Servers**
    *   **Backend** (from `/server`): `npm start`
    *   **Frontend** (from `/client`): `npm run dev`

5.  **Access Admin Panel**
    *   Navigate to `/admin` (e.g., `http://localhost:5173/admin`).
    *   Use the credentials configured in your user seeding script or database.

---

## 📂 Project Structure

```bash
/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable UI Components
│   │   ├── data/          # Static data fallbacks
│   │   ├── hooks/         # Custom Hooks (useScrollAnimations)
│   │   └── pages/         # Route Views (Public & Admin)
│
├── server/                 # Express Backend
│   ├── config/            # DB Connection
│   ├── controllers/       # Route Logic
│   ├── middleware/        # Auth & Upload Middleware
│   ├── models/            # Mongoose Schemas
│   └── routes/            # API Endpoints
└── ...
```

---

## 🤝 Contact

**Aditya Agarwal** - [Full Stack Web Developer]

*   [LinkedIn](https://linkedin.com/in/)
*   [GitHub](https://github.com/Adityaa2227)
*   [Email](mailto:your.email@example.com)

---

<div align="center">
    <i>Built with ❤️ & ☕ by Aditya Agarwal</i>
</div>
