# 🍔 MAC's Franchise Management Portal

> A complete full-stack franchise management system for restaurant chains – built with **React + Spring Boot**.

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=flat&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=jsonwebtokens&logoColor=white)
## 📌 Project Overview

**MAC's Franchise Management Portal** is a comprehensive web application designed for restaurant franchise chains. It serves two main purposes:

- **Public Website** – Customers can view menu, locations, careers, and submit franchise applications
- **Private Portal** – Franchise owners and Super Admins manage operations, jobs, feedback, and inventory

### 👥 User Roles

| Role                      | Access                                                                |
|---------------------------|-----------------------------------------------------------------------|
| **Super Admin**           | Full system control – manage franchises, users, menu, applications    |
| **Franchise Owner**       | Manage own franchise: jobs, applications, feedback, profile           |
| **Customer / Job Seeker** | Public access: view menu, apply for jobs, submit feedback             |

---

## 🛠️ Tech Stack

### Frontend
| Technology        | Purpose                                           |
|-------------------|---------------------------------------------------|
| React 18          | UI framework                                      |
| Vite              | Build tool                                        |
| React Router v6   | Navigation                                        |
| Context API       | State management                                  |
| Axios             | API calls                                         |
| Plain CSS         | Styling (NO frameworks – custom BEM + animations) |

### Backend
| Technology            | Purpose                        |
|-----------------------|--------------------------------|
| Java 17               | Core language                  |
| Spring Boot 3.2.0     | Backend framework              |
| Spring Security + JWT | Authentication & Authorization |
| Spring Data JPA       | Database operations            |
| MySQL                 | Relational database            |
| Maven                 | Dependency management          |

### External APIs
| API                       | Purpose                                               |
|---------------------------|-------------------------------------------------------|
| Google Maps API           | Interactive location maps, markers, directions        |
| Country State City API    | Real-time state/city data for franchise applications  |

---

## 📁 Project Structure
```plaintext
FranchiCore/
├── src/                           # Frontend React application
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Page components (Admin, Owner, Public)
│   ├── services/                 # API service layer
│   ├── context/                  # React Context (Auth, Theme)
│   ├── styles/                   # Global CSS, variables, animations
│   └── utils/                    # Helpers (formatters, validators, constants)
│
├── MacsFranchisePortalBackend1.1/ # Spring Boot backend
│   ├── src/main/java/            # Java source code
│   │   └── com/macs/franchise/
│   │       ├── controller/       # REST API endpoints
│   │       ├── service/          # Business logic
│   │       ├── repository/       # JPA data access
│   │       ├── model/            # Entity classes
│   │       ├── dto/              # Data transfer objects
│   │       ├── config/           # Security & app config
│   │       └── security/         # JWT & UserDetails
│   └── src/main/resources/       # Email templates
│
├── package.json
├── vite.config.js
└── pom.xml
```


---

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v18+)
- Java 17
- MySQL 8.0
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/SumitrajSadafule/FranchiCore.git
cd FranchiCore
```

### Step 2: Setup Backend

```bash
cd MacsFranchisePortalBackend1.1
```

Create `application.properties` in `src/main/resources/`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/macs_franchise_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

jwt.secret=YOUR_SECRET_KEY
jwt.expiration.ms=86400000

# Email configuration (for notifications)
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
```

**Run the backend:**

```bash
./mvnw spring-boot:run   # Windows
# or
mvn spring-boot:run
```

> Backend runs on `http://localhost:8080/api`

### Step 3: Setup Frontend

```bash
cd ../   # Back to root
```

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME="MAC's Franchise Portal"
VITE_APP_VERSION=1.0.0
VITE_CSC_API_KEY=YOUR_COUNTRY_STATE_CITY_API_KEY
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

**Install dependencies and run:**

```bash
npm install
npm run dev
```

> Frontend runs on `http://localhost:5173`

### Step 4: Database Setup

- Create MySQL database named `macs_franchise_db`
- The application will auto-create tables on first run
- Sample data is auto-loaded (franchises, menu items, admin user)

### Step 5: Login Credentials (Demo)

| Role                  | Username | Password   |
|-----------------------|----------|------------|
| **Super Admin**       | `admin`  | `admin123` |
| **Franchise Owner**   | `owner`  | `owner123` |

## 🚀 Key Features

### Public Website

| Feature               | Description                                                   |
|-----------------------|---------------------------------------------------------------|
| 🏠 Homepage           | Promotions, featured menu, statistics                         |
| 🍔 Menu               | Categories, search, filters, price range                      |
| 📍 Locations          | Search by city, interactive Google Map                        |
| 💼 Careers            | Browse jobs, filter by type/location, apply online            |
| 📝 Own a Franchise    | Detailed application form (financials, experience, documents) |
| 💬 Contact & Feedback | Submit feedback with ratings, franchise selection             |

### Admin Dashboard (Super Admin)
| Feature                       | Description                                                       |
|-------------------------------|-------------------------------------------------------------------|
| 👥 User Management            |  Create/update/delete users, assign roles, enable/disable         |
| 🏪 Franchise Management       |  CRUD operations, status update, manager assignment               |
| 📋 Franchise Applications     |  Review, approve/reject, add notes, auto-create owner account     |
| 🍽️ Menu Management	         |  Add/edit/delete items, update availability, price, dietary info  |
| 💬 Feedback Management        |  View all feedback, reply, toggle public/private                  |
| 💼 Job Management	            |  View all jobs across franchises, close/reopen                    |

### Owner Dashboard (Franchise Owner)
| Feature                | Description                                                          |
|------------------------|----------------------------------------------------------------------|
| 📊 Dashboard	        |  Stats: jobs, applications, feedback, ratings                         |
| 💼 Job Management	    |  Post, edit, close, delete jobs                                       |
| 📝 Applications	    |  View applicants, update status (New → Interview → Accepted/Rejected) | 
| 💬 Feedback	        |  View customer feedback, reply publicly                               |
| 🏪 Franchise Details  |  View/edit franchise information                                      |
| 👤 Profile	        |  Update personal info, change password                                |

### 🔒 Security Highlights

- **JWT Authentication** – Stateless, secure token-based auth
- **Role-Based Access Control** – Admin, Owner, Customer roles
- **Multi-Tenant Data Isolation** – Owners see ONLY their franchise data
- **Passwords Encrypted** – BCrypt hashing
- **API Protection** – All endpoints except public ones require valid JWT
- **Environment Variables** – Secrets never committed to GitHub

### 📧 Email Notifications

The system sends automated emails for:
    Franchise application submission & status updates
    Franchise approval with login credentials
    Job application confirmation
    Job application status updates

### 🗺️ Google Maps Integration

Interactive map showing all franchise locations
Custom markers with info windows
"Get Directions" link to Google Maps
Filter locations by city, state, or distance

### 🌍 Country State City (CSC) API Integration

The franchise application form uses **CSC API** to provide real-time, dynamic location data.

| Feature               | Description                                            |
|-----------------------|--------------------------------------------------------|
| 🇮🇳 India Coverage     | Complete database of all Indian states and cities      |
| 📋 State Dropdown    | Users select their state first                         |
| 🏙️ Dynamic Cities    | Cities automatically load based on selected state      |
| 🔄 Real-time Updates | Always up-to-date with latest geographical data        |
| ⚡ Fast Performance  | Sub-100ms response time with automatic caching         |
| 🎯 151,000+ Cities   | Access to every city in India, not just a static list  |

#### How It Works

1. User selects a **state** from the dropdown
2. API fetches all cities in that state dynamically
3. User selects their **city** from the populated dropdown
4. No hardcoded lists – always accurate and complete

### 🎨 Design System

Brand Colors: Red #D62323 + Yellow #FFC72C
Custom CSS – No frameworks (Tailwind/Bootstrap NOT used)
BEM Naming Convention
Dark / Light Theme – Toggle with CSS variables
Keyframe Animations – Page transitions, hover effects, loading spinners
Mobile Responsive – Breakpoints for tablet, mobile

### 🧪 Testing

Backend API Testing (Postman)
| Endpoint	                            | Method    | Description                   |
|---------------------------------------|-----------|-------------------------------|
| /api/auth/login	                    | POST	    | Authenticate user             |
| /api/menu	                            | GET	    | Get all menu items            |
| /api/franchises	                    | GET	    | Get all franchises            |
| /api/jobs/open	                    | GET	    | Get open jobs                 |
| /api/franchise-applications/submit    | POST	    | Submit franchise application  |

Frontend Testing
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build

### 📈 Future Enhancements

Online ordering / cart system
Real-time order tracking
Payment gateway integration
Mobile app (React Native)
Advanced analytics dashboard
Chat support system
Multi-language support

## ⚠️ Deployment Status

- ✅ **Frontend (Vercel):** Live – [View Demo](https://franchicore.vercel.app)
- ⏳ **Backend:** Code on GitHub, not deployed yet (requires MySQL database)
- 🗺️ **Google Maps and API integration (CSC API):** Requires backend for location data – see GitHub for full implementation

> *The frontend demonstrates UI/UX, responsive design and animations. The complete full-stack application runs locally – see installation instructions above.*

# 👨‍💻 Author

## Sumitraj Sadafule
## GitHub: @SumitrajSadafule

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub!

Built with ❤️ for MAC's Franchise

---
