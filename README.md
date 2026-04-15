# RailBook — Railway Ticket Reservation System

RailBook is a modern, high-performance web application designed for seamless railway ticket reservations. It features a professional **Midnight & Emerald** UI, providing a premium experience for both passengers and administrators.

---

## 🎨 Design Philosophy
RailBook utilizes a custom-crafted design system focused on:
- **Professional Aesthetics**: A high-contrast "Midnight Slate" and "Emerald Green" palette.
- **Micro-Animations**: Smooth transitions and interactive elements using Tailwind CSS.
- **Compact UI**: Optimized spacing for high information density without clutter.
- **Premium Typography**: Built with the **Outfit** font family for a modern, sleek feel.

---

## 🚀 Key Features

### For Passengers
- **Interactive Landing Page**: Modern hero section with live booking highlights.
- **Train Search**: Search for trains between stations with real-time availability.
- **Instant Booking**: Streamlined reservation process with SweetAlert2 confirmations.
- **User Dashboard**: Manage your journey history, view active tickets, and process cancellations.
- **Real-time Status**: Live labels for "On Time", "Boarding", and seat counts.

### For Administrators
- **Meticulous Dashboard**: System-wide analytics including total users, trains, and booking trends (powered by Recharts).
- **Train Management**: Add, update, or remove trains from the fleet.
- **User Control**: Manage registered users, including blocking/unblocking accounts.
- **Booking Ledger**: Comprehensive view of all system reservations with advanced filtering.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: SweetAlert2
- **Routing**: React Router DOM
- **API Client**: Axios

### Backend
- **Framework**: Spring Boot
- **Language**: Java
- **Database**: MySQL
- **Security**: JWT Authentication (Role-based: User & Admin)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- MySQL Server

### Backend Setup
1. Navigate to the `backend` directory.
2. Configure your MySQL credentials in `src/main/resources/application.properties`.
3. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```text
Railway_ticket_reservation/
├── backend/              # Spring Boot Application
│   ├── src/main/java/    # Java Source Code (Controllers, Models, Services)
│   └── src/main/res/     # Configuration Files
├── frontend/             # React Application
│   ├── src/components/   # Reusable UI Components (Navbar, Sidebar)
│   ├── src/pages/        # Application Pages (Home, Dashboard, Admin)
│   └── src/services/     # API Integration Layer
└── README.md             # Project Documentation
```

---

## 📄 License
This project is developed for educational purposes. All rights reserved.
