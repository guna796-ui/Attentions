# Attendance & Leave Management System

A comprehensive attendance and leave management system with mobile-friendly employee app and admin dashboard.

## Features

### Employee App (Mobile-Friendly)
- ✅ Login with phone/email + password
- ✅ Daily Punch In/Out with real-time timestamp
- ✅ Duplicate punch prevention
- ✅ GPS location capture (optional)
- ✅ Leave application (Government, Sick, Earned, Casual, Optional)
- ✅ Leave balance display
- ✅ Monthly attendance calendar view
- ✅ Profile management
- ✅ Salary period attendance summary

### Admin Dashboard
- ✅ Admin login & authentication
- ✅ Employee management (Add/Edit/Remove)
- ✅ Real-time attendance viewer
- ✅ Daily/Weekly/Monthly reports
- ✅ Custom payroll period (6th to 5th)
- ✅ Auto-calculate working days, presents, absents, late arrivals, overtime
- ✅ Leave approval workflow
- ✅ Government holidays management
- ✅ Export reports (Excel/PDF)
- ✅ Dashboard with charts and analytics

## Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: CSS3 with modern design system
- **Charts**: Chart.js
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Export**: xlsx, jsPDF

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator

### Additional Features
- RESTful API architecture
- Mobile-responsive design
- Real-time updates
- Secure authentication
- Role-based access control

## Project Structure

```
attendance-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── Leave.js
│   │   └── Holiday.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   ├── leave.js
│   │   ├── employee.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   └── adminController.js
│   ├── utils/
│   │   └── helpers.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── employee/
│   │   │   │   ├── PunchInOut.jsx
│   │   │   │   ├── LeaveApplication.jsx
│   │   │   │   ├── AttendanceCalendar.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── EmployeeManagement.jsx
│   │   │   │   ├── AttendanceReports.jsx
│   │   │   │   ├── LeaveApproval.jsx
│   │   │   │   └── HolidayManagement.jsx
│   │   │   ├── common/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Default Credentials

### Admin
- Email: admin@company.com
- Password: admin123

### Employee (Demo)
- Email: employee@company.com
- Password: employee123

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login user (employee or admin)
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/auth/register
Register new employee (admin only)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "employee",
  "department": "IT",
  "designation": "Developer"
}
```

### Attendance Endpoints

#### POST /api/attendance/punch-in
Punch in for the day
```json
{
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

#### POST /api/attendance/punch-out
Punch out for the day
```json
{
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

#### GET /api/attendance/my-attendance
Get current user's attendance records
Query params: `startDate`, `endDate`

#### GET /api/attendance/today
Get today's attendance status

### Leave Endpoints

#### POST /api/leave/apply
Apply for leave
```json
{
  "leaveType": "sick",
  "startDate": "2025-11-25",
  "endDate": "2025-11-26",
  "reason": "Medical appointment",
  "halfDay": false
}
```

#### GET /api/leave/my-leaves
Get current user's leave applications

#### GET /api/leave/balance
Get leave balance for current user

### Admin Endpoints

#### GET /api/admin/employees
Get all employees

#### POST /api/admin/employees
Create new employee

#### PUT /api/admin/employees/:id
Update employee details

#### DELETE /api/admin/employees/:id
Delete employee

#### GET /api/admin/attendance/all
Get all attendance records
Query params: `date`, `startDate`, `endDate`

#### GET /api/admin/reports/monthly
Get monthly attendance report
Query params: `month`, `year`, `employeeId`

#### PUT /api/admin/leave/:id/approve
Approve leave request

#### PUT /api/admin/leave/:id/reject
Reject leave request

#### POST /api/admin/holidays
Add government holiday

#### GET /api/admin/holidays
Get all holidays

## Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (employee/admin),
  department: String,
  designation: String,
  joiningDate: Date,
  leaveBalance: {
    government: Number,
    sick: Number,
    earned: Number,
    casual: Number,
    optional: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Collection
```javascript
{
  userId: ObjectId,
  date: Date,
  punchIn: Date,
  punchOut: Date,
  punchInLocation: {
    latitude: Number,
    longitude: Number
  },
  punchOutLocation: {
    latitude: Number,
    longitude: Number
  },
  workingHours: Number,
  status: String (present/absent/late/half-day),
  isLate: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Leave Collection
```javascript
{
  userId: ObjectId,
  leaveType: String,
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  halfDay: Boolean,
  reason: String,
  status: String (pending/approved/rejected),
  approvedBy: ObjectId,
  approvedAt: Date,
  rejectionReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Holiday Collection
```javascript
{
  name: String,
  date: Date,
  type: String (government/optional),
  description: String,
  createdAt: Date
}
```

## Deployment Instructions

### Backend Deployment (Heroku/Railway/Render)

1. Create account on your preferred platform
2. Create new project/app
3. Connect your repository
4. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
5. Deploy from main branch

### Frontend Deployment (Vercel/Netlify)

1. Create account on Vercel or Netlify
2. Import your repository
3. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Set environment variable:
   - `VITE_API_URL=your_backend_url/api`
5. Deploy

### MongoDB Atlas Setup

1. Create account on MongoDB Atlas
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update `MONGODB_URI` in backend

## Future Enhancements

1. **Biometric Integration**
   - Fingerprint scanner API integration
   - Face recognition for punch in/out
   - Device registration and management

2. **Advanced Features**
   - Shift management (day/night shifts)
   - Geofencing for location-based attendance
   - QR code-based attendance
   - Mobile app (React Native)
   - Push notifications
   - Email notifications
   - SMS alerts

3. **Reporting & Analytics**
   - Advanced analytics dashboard
   - Predictive analytics for attendance patterns
   - Department-wise reports
   - Custom report builder
   - Automated monthly reports

4. **HR Integration**
   - Payroll integration
   - Performance management
   - Employee self-service portal
   - Document management
   - Training management

5. **Technical Improvements**
   - Redis caching for better performance
   - WebSocket for real-time updates
   - Microservices architecture
   - Docker containerization
   - CI/CD pipeline
   - Automated testing

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
