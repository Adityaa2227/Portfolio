# 🚀 Premium Developer Portfolio

A high-performance, cinematic developer portfolio built with the MERN stack (MongoDB, Express, React, Node.js). features premium GSAP animations, a custom admin panel, and dynamic content management.

## ✨ Features

- **Cinematic Experience**:
  - **GSAP ScrollTrigger** for premium, performance-optimized scroll animations.
  - **Custom Loader** with "System Boot" sequence and seamless "curtain reveal" transition.
  - **Interactive Hero** with 3D-style elements and grainy gradients.
  
- **Dynamic Content**:
  - **Projects Showcase**: "Zig-Zag" premium layout with hover perspective effects.
  - **Skills & Experience**: Staggered animations and categorization.
  - **Admin Panel**: Fully functional dashboard to manage Projects, Skills, Experience, and Bio without touching code.

- **Tech Stack**:
  - **Frontend**: React (Vite), TailwindCSS, Framer Motion, GSAP.
  - **Backend**: Node.js, Express, MongoDB, Mongoose.
  - **Security**: JWT Authentication for Admin routes.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Client_URL=http://localhost:5173
```
Start the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Start the development server:
```bash
npm run dev
```

## 📂 Project Structure

- **/client**: React frontend application.
  - **/src/components**: Reusable UI components (Public & Admin).
  - **/src/hooks**: Custom hooks (e.g., `useScrollAnimations` for GSAP).
  - **/src/pages**: Page views.
- **/server**: Node.js/Express API.
  - **/models**: Mongoose schemas (Project, Skill, Experience, User).
  - **/routes**: API endpoints.

## 🎨 Customization

- **Animations**: Tweak `client/src/hooks/useScrollAnimations.js` to adjust timing and easing.
- **Theme**: Modified via Tailwind config and `index.css` variables.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
