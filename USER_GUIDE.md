# College Resource Dashboard - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Roles](#user-roles)
3. [Navigation](#navigation)
4. [Features Overview](#features-overview)
5. [Student Guide](#student-guide)
6. [Staff Guide](#staff-guide)
7. [Admin Guide](#admin-guide)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Dashboard
1. Open your web browser
2. Navigate to the dashboard URL (typically `http://localhost:3000` for development)
3. You'll see the login page

### First Time Login
**Default Admin Credentials:**
- Email: `admin@college.edu`
- Password: `admin123`

**⚠️ Important:** Change the default admin password immediately after first login.

### Registration
1. Click "Sign Up" on the login page
2. Fill in your details:
   - Full Name
   - College Email Address
   - Password (minimum 6 characters)
   - Role (Student/Staff - Admin accounts must be created by existing admins)
   - Department (optional)
3. Click "Register"
4. You'll be automatically logged in

---

## User Roles

### 🎓 Student
- Browse available resources
- Make bookings for approved resources
- View and manage their own bookings
- Cancel their own bookings

### 👨‍🏫 Staff
- All student privileges
- Add, edit, and delete resources
- View all bookings for their managed resources
- Approve or deny booking requests
- Access basic analytics

### 👨‍💼 Admin
- All staff privileges
- Full user management (create, edit, delete users)
- System-wide analytics and reporting
- System health monitoring
- Manage all resources and bookings

---

## Navigation

### Main Menu
The dashboard uses a sidebar navigation with the following sections:

1. **🏠 Dashboard** - Overview and quick actions
2. **📚 Resources** - Browse and manage resources
3. **📅 Bookings** - View and manage bookings
4. **📊 Analytics** - Data insights and reports (Staff/Admin)
5. **⚙️ Admin** - System administration (Admin only)

### User Menu
Located in the top-right corner:
- User profile information
- Logout option

---

## Features Overview

### 🔍 Advanced Search & Filtering
- **Search Bar**: Find resources by name, description, or location
- **Type Filter**: Filter by Equipment, Room, Vehicle, etc.
- **Location Filter**: Filter by building or area
- **Status Filter**: Available, Unavailable, Maintenance
- **Capacity Filter**: Small (1-5), Medium (6-20), Large (20+)
- **Sorting**: Sort by name, type, location, capacity, or availability

### 📊 Real-time Status Updates
- Live availability status
- Booking confirmations
- Conflict detection
- Maintenance schedules

### 📱 Responsive Design
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface
- Optimized for all screen sizes

---

## Student Guide

### Finding Resources

1. **Navigate to Resources**
   - Click "Resources" in the sidebar
   - Browse all available resources

2. **Search for Specific Resources**
   - Use the search bar to find specific items
   - Apply filters to narrow down results
   - Sort results by your preference

3. **View Resource Details**
   - Click on any resource card to see details
   - Check availability status
   - View capacity and location information

### Making a Booking

1. **Select a Resource**
   - Click "Book Now" on an available resource
   - Or navigate to Bookings → "New Booking"

2. **Choose Date and Time**
   - Select your desired date
   - Choose start and end times
   - The system will check for conflicts automatically

3. **Provide Booking Details**
   - Enter the purpose of your booking
   - Add any additional notes
   - Review booking details

4. **Submit Booking**
   - Click "Submit Booking"
   - You'll receive confirmation
   - Booking status may be "Pending" until approved

### Managing Your Bookings

1. **View Your Bookings**
   - Go to "Bookings" in the sidebar
   - See all your current and past bookings
   - Check booking status (Pending, Confirmed, Cancelled)

2. **Edit a Booking**
   - Click "Edit" on a pending booking
   - Modify date, time, or purpose
   - Submit changes for approval

3. **Cancel a Booking**
   - Click "Cancel" on any booking
   - Confirm cancellation
   - Resource becomes available for others

### Booking Status Guide

| Status | Meaning | Actions Available |
|--------|---------|-------------------|
| **Pending** | Waiting for staff approval | Edit, Cancel |
| **Confirmed** | Approved and confirmed | View details, Cancel |
| **Cancelled** | Booking was cancelled | View details only |
| **Completed** | Booking time has passed | View details only |

---

## Staff Guide

### Resource Management

1. **Adding New Resources**
   - Navigate to Resources
   - Click "Add Resource" button
   - Fill in resource details:
     - Name and description
     - Type (Equipment, Room, etc.)
     - Location
     - Capacity
     - Available quantity
   - Set initial status and availability

2. **Editing Resources**
   - Click "Edit" on any resource card
   - Update information as needed
   - Change status (Available, Maintenance, Unavailable)
   - Adjust capacity or availability

3. **Managing Resource Status**
   - **Available**: Ready for booking
   - **Maintenance**: Temporarily unavailable
   - **Unavailable**: Permanently unavailable

### Booking Management

1. **Review Booking Requests**
   - Go to Bookings section
   - Filter by "Pending" status
   - Review booking details and purpose

2. **Approve or Deny Bookings**
   - Click on pending bookings
   - Choose "Approve" or "Deny"
   - Add notes if necessary
   - Users receive automatic notifications

3. **Monitor Resource Usage**
   - View booking calendar
   - Check resource utilization
   - Identify popular resources

### Analytics Access

1. **Resource Analytics**
   - View usage statistics
   - Identify peak hours and days
   - Monitor resource popularity

2. **Booking Reports**
   - Track booking trends
   - Export usage data
   - Generate reports for administration

---

## Admin Guide

### User Management

1. **View All Users**
   - Navigate to Admin → User Management
   - See complete user list with roles and departments

2. **Edit User Information**
   - Click "Edit" next to any user
   - Change user role (Student, Staff, Admin)
   - Update department information
   - Modify permissions

3. **Create New Users**
   - Use the registration process
   - Or bulk import users (future feature)

4. **Delete Users**
   - Select users to remove
   - Confirm deletion (permanent action)
   - Note: Cannot delete your own admin account

### System Analytics

1. **Dashboard Overview**
   - Navigate to Admin → Analytics
   - View key performance indicators:
     - Total users, resources, bookings
     - Utilization rates
     - Popular resources
     - Recent activity

2. **Detailed Reports**
   - Filter by time ranges
   - Export data in various formats
   - Track system growth and usage patterns

3. **Resource Performance**
   - Identify most/least popular resources
   - Monitor capacity utilization
   - Plan resource allocation

### System Health Monitoring

1. **Server Status**
   - Monitor server uptime
   - Check memory usage
   - View Node.js version and platform info

2. **Database Health**
   - Monitor database connectivity
   - Check query performance
   - View database type (PostgreSQL/SQLite)

3. **Error Monitoring**
   - Review system logs
   - Monitor API response times
   - Track user activity

### Advanced Features

1. **Bulk Operations**
   - Mass update resource status
   - Bulk cancel bookings (if needed)
   - Export/import data

2. **System Configuration**
   - Adjust booking time limits
   - Set resource approval requirements
   - Configure notification settings

---

## Troubleshooting

### Common Issues

#### 🔐 Login Problems

**Problem**: "Invalid credentials" error
**Solution**: 
- Check email and password spelling
- Ensure caps lock is off
- Contact admin to reset password

**Problem**: Account locked
**Solution**:
- Wait 15 minutes before trying again
- Contact system administrator

#### 📅 Booking Issues

**Problem**: "Booking conflict" error
**Solution**:
- Choose different time slot
- Check resource calendar for availability
- Consider alternative resources

**Problem**: Booking status stuck on "Pending"
**Solution**:
- Contact staff member responsible for the resource
- Check if additional approval is required
- Verify booking details are complete

#### 🔍 Search Problems

**Problem**: Resource not showing in search
**Solution**:
- Clear all filters and try again
- Check resource name spelling
- Verify resource is available and not in maintenance

**Problem**: Slow loading times
**Solution**:
- Check internet connection
- Clear browser cache
- Try refreshing the page

### Getting Help

#### 📧 Contact Support
- **Email**: support@college.edu (replace with actual support email)
- **Phone**: (555) 123-4567 (replace with actual number)
- **Hours**: Monday-Friday, 8 AM - 5 PM

#### 🐛 Reporting Bugs
When reporting issues, please include:
- What you were trying to do
- What happened instead
- Your browser and operating system
- Screenshots if applicable
- Steps to reproduce the problem

#### 💡 Feature Requests
- Submit suggestions through the feedback form
- Contact system administrators
- Participate in user feedback sessions

---

## Best Practices

### 📋 For All Users

1. **Keep Information Updated**
   - Update your profile regularly
   - Use accurate booking descriptions
   - Cancel bookings you no longer need

2. **Be Respectful**
   - Only book resources you actually need
   - Cancel in advance if plans change
   - Report damaged equipment immediately

3. **Security**
   - Log out when finished
   - Don't share your credentials
   - Use strong passwords

### 👨‍🏫 For Staff

1. **Resource Management**
   - Keep resource information current
   - Respond to booking requests promptly
   - Update status for maintenance or repairs

2. **User Support**
   - Help students find appropriate resources
   - Provide clear feedback on booking decisions
   - Maintain fair booking policies

### 👨‍💼 For Admins

1. **System Maintenance**
   - Regular data backups
   - Monitor system performance
   - Keep software updated

2. **User Management**
   - Regular user access reviews
   - Prompt creation of new accounts
   - Maintain appropriate role assignments

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + /` | Open search |
| `Ctrl + N` | New booking (when in Bookings) |
| `Ctrl + R` | Refresh current page |
| `Esc` | Close dialogs/modals |
| `Tab` | Navigate between fields |

---

## Mobile Usage Tips

### 📱 Mobile-Specific Features

1. **Touch Navigation**
   - Swipe to navigate between sections
   - Tap and hold for context menus
   - Pinch to zoom on calendars

2. **Quick Actions**
   - Pull down to refresh
   - Swipe left on bookings to cancel
   - Long press on resources for quick booking

3. **Offline Capability**
   - View previously loaded data
   - Queue actions when offline
   - Sync when connection restored

---

*This user guide is regularly updated. Check for the latest version at [documentation URL] or contact your system administrator for assistance.*