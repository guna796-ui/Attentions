# Auto Punch-Out Feature Documentation

## Overview
The Auto Punch-Out feature automatically punches out employees who forgot to punch out at the end of the day.

## Features

### 1. Automated Daily Job
- **Schedule**: Runs every day at 11:30 PM IST
- **Action**: Automatically punches out all employees who:
  - Have punched in today
  - Have NOT punched out yet
- **Punch-Out Time**: Set to 11:30 PM
- **Working Hours**: Automatically calculated
- **Flag**: Records are marked with `isAutoPunchOut: true`

### 2. Manual Trigger (Admin Only)
- **Access**: Admin Dashboard → Auto Punch-Out
- **Purpose**: Test the auto punch-out without waiting until 11:30 PM
- **Endpoint**: `POST /api/admin/trigger-auto-punchout`
- **Response**: Returns count of employees auto punched-out

## How It Works

### Backend (Cron Job)
1. Job runs at 11:30 PM daily (configured in `backend/jobs/autoPunchOut.js`)
2. Searches for attendance records where:
   - Date is today
   - `punchIn` exists
   - `punchOut` is null
3. For each record:
   - Sets `punchOut` to 11:30 PM
   - Sets `punchOutLocation.address` to "Auto punch-out"
   - Sets `isAutoPunchOut` to `true`
   - Calculates working hours
   - Saves the record

### Frontend (Admin UI)
- **Location**: Admin Dashboard → Auto Punch-Out
- **Features**:
  - View job schedule and status
  - Manually trigger auto punch-out
  - See results (number of employees affected)

## Files Modified/Created

### Backend
- `backend/jobs/autoPunchOut.js` - Cron job implementation
- `backend/models/Attendance.js` - Added `isAutoPunchOut` field
- `backend/controllers/adminController.js` - Added manual trigger endpoint
- `backend/routes/admin.js` - Added route for manual trigger
- `backend/server.js` - Initialize cron job on startup

### Frontend
- `frontend/src/components/admin/AutoPunchOut.jsx` - Admin UI component
- `frontend/src/components/admin/Dashboard.jsx` - Added navigation and route

## Configuration

### Change Auto Punch-Out Time
Edit `backend/jobs/autoPunchOut.js`:
```javascript
// Line 6: Change the cron schedule
// Format: 'minute hour * * *'
// Current: '30 23 * * *' (11:30 PM)
// Example: '0 22 * * *' (10:00 PM)
const autoPunchOutJob = cron.schedule('30 23 * * *', async () => {
```

### Change Timezone
Edit `backend/jobs/autoPunchOut.js`:
```javascript
// Line 48: Change timezone
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Change to your timezone
});
```

## Testing

### Test Auto Punch-Out Manually
1. Log in as admin (admin@company.com / admin123)
2. Navigate to Admin Dashboard → Auto Punch-Out
3. Click "🔄 Trigger Auto Punch-Out Now"
4. Confirm the action
5. View the result showing how many employees were auto punched-out

### Verify in Database
Check the `attendances` collection:
```javascript
db.attendances.find({ isAutoPunchOut: true })
```

## Logs
The cron job logs to console:
- On startup: "Auto punch-out job scheduled for 11:30 PM daily"
- On execution: "Running auto punch-out job at 11:30 PM..."
- On completion: "Auto punched-out X employees at 11:30 PM"

## Security
- Manual trigger endpoint requires admin authentication
- Only admin role can access the Auto Punch-Out page
- Confirmation dialog before manual trigger

## Future Enhancements
- Email notifications to employees when auto punched-out
- Configurable auto punch-out time via admin UI
- Auto punch-out history/logs page
- Slack/Teams notifications
