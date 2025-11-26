# Leave Type Customization - Quick Start Guide

## ✅ What's Been Implemented

Your attendance system now has **fully customizable leave types**! Employers can create, edit, and manage their own leave categories instead of being stuck with fixed types.

## 🎯 Key Features

### Admin Features
- ✨ Create unlimited custom leave types
- ✏️ Edit existing leave types (name, code, balance, color)
- 🗑️ Delete unused leave types
- 🎨 Color-code leave types for visual organization
- ⚙️ Set default annual balance per leave type

### Employee Features
- 📋 Leave application form automatically shows all active leave types
- 📊 Leave balance cards dynamically display based on admin configuration
- 🎨 Color-coded balance display matching admin settings

## 🚀 How to Use

### For Admins

**Step 1: Access Leave Types Management**
1. Login as Admin
2. Go to **Admin Dashboard**
3. Click **"⚙️ Leave Types"** in the sidebar

**Step 2: View Default Leave Types**
You'll see 4 pre-configured types:
- **Sick Leave** (Blue) - 12 days
- **Casual Leave** (Green) - 12 days
- **Earned Leave** (Purple) - 15 days
- **Optional Leave** (Yellow) - 3 days

**Step 3: Add Custom Leave Type**
1. Click **"+ Add Leave Type"** button
2. Fill in the form:
   - **Name**: e.g., "Maternity Leave"
   - **Code**: e.g., "MATERNITY" (must be UPPERCASE and unique)
   - **Default Days**: e.g., 180
   - **Color**: Choose from 8 colors
   - **Description**: Optional explanation
3. Click **"Create"**

**Step 4: Edit Leave Type**
1. Click the **✏️ Edit** icon on any card
2. Modify fields
3. Click **"Update"**

**Step 5: Delete Leave Type**
1. Click the **🗑️ Delete** icon
2. Confirm deletion

### For Employees

**Applying for Leave:**
1. Go to **Leave Application** page
2. Select leave type from dropdown (shows all active types)
3. Fill in dates and reason
4. Submit

**Viewing Balance:**
- Leave balance cards automatically show all your leave types
- Each card displays the leave name and remaining days
- Colors match the admin configuration

## 📝 Example Use Cases

### Tech Company
```
- Sick Leave: 12 days (Blue)
- Casual Leave: 15 days (Green)
- Work From Home: 24 days (Purple)
- Mental Health: 6 days (Indigo)
```

### Manufacturing
```
- Sick Leave: 10 days (Blue)
- Casual Leave: 8 days (Green)
- Annual Leave: 20 days (Purple)
- Comp Off: 12 days (Yellow)
```

### Educational
```
- Sick Leave: 15 days (Blue)
- Casual Leave: 10 days (Green)
- Study Leave: 30 days (Indigo)
- Sabbatical: 90 days (Purple)
```

## 🔧 Technical Notes

- **Database**: Leave types are stored in MongoDB
- **Default Seeding**: Run `node seedLeaveTypes.js` to reset to defaults
- **New Employees**: Automatically get balances based on active leave types
- **Existing Employees**: May need manual balance updates after adding new types

## 📚 Files Modified/Created

### Backend
- `models/LeaveType.js` - Leave type schema
- `controllers/leaveTypeController.js` - CRUD operations
- `routes/leaveType.js` - API routes
- `seedLeaveTypes.js` - Seed script for defaults
- `models/User.js` - Updated to use Map for leave balance
- `controllers/authController.js` - Auto-populate leave balance on registration

### Frontend
- `components/admin/LeaveTypeManagement.jsx` - Admin UI for managing types
- `components/employee/LeaveApplication.jsx` - Updated to use dynamic types
- `components/admin/Dashboard.jsx` - Added Leave Types route
- `components/common/Navbar.jsx` - Added Leave Types link

### Documentation
- `LEAVE_TYPE_CUSTOMIZATION.md` - Full documentation
- `LEAVE_TYPE_QUICK_START.md` - This quick start guide

## 🎉 You're All Set!

The system is now running with customizable leave types. Admins can manage leave types at:
**http://localhost:5173/admin/leave-types**

Employees will automatically see the updated leave types in their leave application forms and balance displays.
