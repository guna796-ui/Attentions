# Leave Type Customization System

## Overview
The attendance system now supports **fully customizable leave types**. Employers can define their own leave categories with custom names, codes, balances, and colors according to their company policies.

## Features

### For Administrators
- **Create Custom Leave Types**: Add new leave categories (e.g., Maternity Leave, Paternity Leave, Study Leave)
- **Edit Existing Types**: Modify names, codes, default balances, and colors
- **Delete Leave Types**: Remove unused leave categories
- **Color Coding**: Assign visual colors for easy identification
- **Active/Inactive Status**: Enable or disable leave types without deletion

### For Employees
- **Dynamic Leave Application**: Leave types automatically populate from admin configuration
- **Visual Leave Balance**: Color-coded balance cards matching admin settings
- **Real-time Updates**: Changes to leave types reflect immediately

## How to Use

### Initial Setup (First Time)

1. **Seed Default Leave Types**:
   ```bash
   cd backend
   node seedLeaveTypes.js
   ```
   This creates 4 default leave types:
   - Sick Leave (12 days)
   - Casual Leave (12 days)
   - Earned Leave (15 days)
   - Optional Leave (3 days)

2. **Restart Backend** (if running):
   The backend will automatically pick up the new leave types.

### Managing Leave Types (Admin)

1. **Access Leave Types Management**:
   - Login as Admin
   - Navigate to **Admin Dashboard** → **Leave Types** (⚙️ icon in sidebar)

2. **Add New Leave Type**:
   - Click **"Add Leave Type"** button
   - Fill in the form:
     - **Name**: Display name (e.g., "Maternity Leave")
     - **Code**: Unique identifier in UPPERCASE (e.g., "MATERNITY")
     - **Default Days**: Annual balance per employee (e.g., 180)
     - **Color Theme**: Visual color for UI (blue, green, purple, yellow, red, indigo, pink, gray)
     - **Description**: Optional explanation
   - Click **"Create"**

3. **Edit Leave Type**:
   - Click the **Edit** (✏️) icon on any leave type card
   - Modify fields as needed
   - Click **"Update"**

4. **Delete Leave Type**:
   - Click the **Delete** (🗑️) icon
   - Confirm deletion
   - **Warning**: This will affect existing employee balances

### Employee Experience

When employees apply for leave:
1. The **Leave Type** dropdown automatically shows all active leave types
2. The **Leave Balance** section displays color-coded cards for each type
3. Balances update in real-time after leave approval/rejection

## Technical Details

### Database Schema

**LeaveType Model**:
```javascript
{
  name: String,        // Display name
  code: String,        // Unique code (UPPERCASE)
  description: String, // Optional description
  defaultDays: Number, // Default annual balance
  color: String,       // UI color theme
  isActive: Boolean    // Enable/disable status
}
```

**User Model** (Updated):
```javascript
{
  leaveBalance: Map<String, Number>
  // Example: { "SICK": 12, "CASUAL": 10, "MATERNITY": 180 }
}
```

### API Endpoints

- `GET /api/leave-types` - Get all active leave types (All users)
- `GET /api/leave-types/all` - Get all leave types including inactive (Admin)
- `POST /api/leave-types` - Create new leave type (Admin)
- `PUT /api/leave-types/:id` - Update leave type (Admin)
- `DELETE /api/leave-types/:id` - Delete leave type (Admin)

### New Employee Registration

When admins create a new employee:
1. System fetches all active leave types
2. Automatically assigns default balance for each type
3. Employee starts with full balance as per company policy

## Best Practices

1. **Use Clear Codes**: Keep codes short and descriptive (e.g., "SICK", "CASUAL", "MATERNITY")
2. **Consistent Naming**: Use standard naming conventions across your organization
3. **Color Coding**: Assign colors logically (e.g., red for urgent, green for casual)
4. **Don't Delete Active Types**: Instead, set `isActive: false` to preserve historical data
5. **Review Balances**: After adding new leave types, manually update existing employee balances if needed

## Migration from Fixed Leave Types

If you're upgrading from the previous version with fixed leave types (sick, casual, earned, optional):

1. Run the seed script to create default types
2. Existing employees will need their balances migrated
3. The system will automatically handle new leave applications

## Customization Examples

### Example 1: Tech Startup
```javascript
- Sick Leave: 12 days (Blue)
- Casual Leave: 15 days (Green)
- Work From Home: 24 days (Purple)
- Mental Health Day: 6 days (Indigo)
```

### Example 2: Manufacturing Company
```javascript
- Sick Leave: 10 days (Blue)
- Casual Leave: 8 days (Green)
- Annual Leave: 20 days (Purple)
- Compensatory Off: 12 days (Yellow)
```

### Example 3: Educational Institution
```javascript
- Sick Leave: 15 days (Blue)
- Casual Leave: 10 days (Green)
- Study Leave: 30 days (Indigo)
- Sabbatical: 90 days (Purple)
```

## Troubleshooting

**Issue**: Leave types not showing in employee dropdown
- **Solution**: Ensure leave types are marked as `isActive: true`

**Issue**: New employees don't have leave balance
- **Solution**: Run seed script first, then create employees

**Issue**: Colors not displaying correctly
- **Solution**: Use only supported colors: blue, green, purple, yellow, red, indigo, pink, gray

## Support

For questions or issues, contact your system administrator.
