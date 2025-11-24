# CodifyMe - AI-Powered Placement Preparation Platform

![CodifyMe](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

CodifyMe is a comprehensive AI-powered platform designed to help students and professionals prepare for technical placements. It features personalized roadmap generation, AI-powered interview simulation, CrackScore algorithm, and company intelligence.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system
- **AI Roadmap Generator**: Personalized learning paths powered by Google Gemini AI
- **CrackScore Algorithm**: Quantifies user readiness based on multiple factors
- **Interactive AI Interview Simulator**: Practice interviews with real-time AI feedback
- **Company Intelligence Module**: Browse and search 30+ top tech companies
- **Daily Task Management**: Track progress with daily tasks and completion metrics
- **Neo-Brutalism UI**: Modern, bold design with excellent UX

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codifyme.git
cd codifyme
```

### 2. Database Setup

#### Create MySQL Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE codifyme;
USE codifyme;
```

#### Run Schema

```bash
mysql -u root -p codifyme < database/schema.sql
```

#### Seed Company Data (Optional)

```bash
mysql -u root -p codifyme < database/seed_companies.sql
```

### 3. Backend Setup

#### Navigate to Backend Directory

```bash
cd backend
```

#### Update Configuration

The `application.properties` file is already configured with your credentials:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/codifyme?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=Opendear@123

# Gemini AI Configuration
gemini.api.key=AIzaSyASB9tM1uza8XK_9a65Z6tBQ9eVGMAELoI
```

#### Install Dependencies & Build

```bash
mvn clean install
```

#### Run Backend Server

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

#### Navigate to Frontend Directory

```bash
cd ../frontend
```

#### Install Dependencies

```bash
npm install
```

#### Run Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🎯 Usage

### 1. Create an Account

1. Navigate to `http://localhost:5173`
2. Click "Get Started"
3. Fill in your details in the onboarding form
4. Click "Create Account"

### 2. Login

1. After registration, you'll be redirected to the login page
2. Enter your email and password
3. Click "Login"

### 3. Explore Features

#### Dashboard
- View your CrackScore
- See active roadmaps
- Check recent interviews
- Access quick actions

#### Roadmap
- Create personalized learning roadmaps
- Track daily tasks
- Mark tasks as complete

#### Interview Simulator
- Practice with AI-powered interviews
- Get real-time feedback
- View interview history

#### Company Intelligence
- Browse 30+ tech companies
- Filter by difficulty level
- Search for specific companies

## 📁 Project Structure

```
codifyme/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/codifyme/
│   │   ├── controller/        # REST Controllers
│   │   ├── model/             # JPA Entities
│   │   ├── repository/        # Data Repositories
│   │   ├── service/           # Business Logic
│   │   ├── security/          # Security Configuration
│   │   └── payload/           # DTOs
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React Components
│   │   ├── context/           # Context Providers
│   │   ├── services/          # API Services
│   │   └── App.jsx
│   ├── .env.development
│   └── package.json
└── database/                   # Database Scripts
    ├── schema.sql
    └── seed_companies.sql
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/crackscore` - Get CrackScore details

### Roadmap
- `GET /api/roadmap/my-roadmaps` - Get user roadmaps
- `POST /api/roadmap/create` - Create roadmap
- `POST /api/roadmap/generate` - Generate AI roadmap

### Tasks
- `GET /api/tasks/roadmap/{id}` - Get roadmap tasks
- `PUT /api/tasks/{id}/complete` - Update task completion

### Interviews
- `POST /api/interviews/submit` - Submit interview
- `GET /api/interviews/history` - Get interview history
- `GET /api/interviews/{id}` - Get interview details

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/search?name={name}` - Search companies
- `GET /api/companies/{id}` - Get company details

## 🤖 AI Integration

CodifyMe uses **Google Gemini AI** for:

1. **Roadmap Generation**: Creates personalized learning paths based on job descriptions
2. **Interview Feedback**: Analyzes interview transcripts and provides detailed feedback

The AI service includes fallback responses if the API is unavailable.

## 🎨 Design System

CodifyMe uses a **Neo-Brutalism** design approach:

- Bold, thick borders
- High contrast colors
- Prominent shadows
- Clear typography
- Minimalist layouts

### Color Palette
- **Primary**: `#FFD93D` (Yellow)
- **Accent**: `#6BCF7F` (Green)
- **Background**: `#F5F5F5` (Light Gray)
- **Text**: `#000000` (Black)

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment

1. Build production JAR:
```bash
mvn clean package
```

2. Run JAR:
```bash
java -jar target/codifyme-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment

1. Build production bundle:
```bash
npm run build
```

2. Deploy `dist/` folder to your hosting service (Vercel, Netlify, etc.)

## 🔒 Security

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration
- SQL injection protection with JPA
- XSS protection

## 📊 CrackScore Algorithm

The CrackScore is calculated using:

- **40%** Roadmap Completion
- **40%** Interview Performance
- **20%** Consistency (Activity frequency)

Score ranges:
- **80-100**: Excellent - Ready to apply
- **60-79**: Good Progress
- **40-59**: Keep Going
- **0-39**: Just Started

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials in `application.properties`
- Ensure port 8080 is available

### Frontend won't connect to backend
- Verify backend is running on port 8080
- Check `.env.development` has correct API URL
- Clear browser cache

### AI features not working
- Verify Gemini API key is correct
- Check internet connection
- Fallback responses will be used if API fails

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Google Gemini AI for AI capabilities
- Spring Boot team
- React team
- All open-source contributors

## 📧 Support

For support, email support@codifyme.com or open an issue in the repository.

---

**Made with ❤️ by the CodifyMe Team**
