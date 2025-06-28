# WEM Dashboard Login Credentials

## 🔑 **Demo Accounts**

The WEM Dashboard includes 3 demo accounts with different permission levels:

### **Administrator Account**
- **Email**: `admin@energyos.com`
- **Password**: `password`
- **Role**: Administrator
- **Permissions**: Full access to all features
- **Can Access**: All pages including Advanced Analytics, Real-time Monitoring, Settings

### **Operator Account**
- **Email**: `operator@energyos.com`
- **Password**: `password`
- **Role**: Operator
- **Permissions**: Read, Write, Export
- **Can Access**: Most features except admin-only pages

### **Viewer Account**
- **Email**: `viewer@energyos.com`
- **Password**: `password`
- **Role**: Viewer
- **Permissions**: Read only
- **Can Access**: Overview, basic analytics, and reporting features

## 🚀 **How to Login**

### **Quick Method**
1. Go to the login page
2. **Click on any demo account card** on the right side
3. Credentials will be automatically filled
4. Click "Sign In to Dashboard"

### **Manual Method**
1. Enter email and password manually
2. All accounts use the same password: `password`
3. Click "Sign In to Dashboard"

## 🔧 **Permission Differences**

### **Admin Users See:**
- All navigation items in sidebar
- Advanced Analytics
- Real-time Monitoring
- Settings page
- Admin Navigation section

### **Non-Admin Users See:**
- Limited navigation items
- Basic Overview and Analytics
- No Admin Navigation section
- Restricted access to advanced features

## 🔄 **Session Management**

- **Persistent Login**: Sessions are saved in localStorage
- **Auto-login**: If you have a valid session, you'll be automatically logged in
- **Logout**: Use the logout functionality to clear session

## 🛠️ **For Development**

To test different permission levels:
1. Login with different accounts
2. Notice how the sidebar changes based on user role
3. Try accessing admin-only features with different accounts

## 📝 **Notes**

- All demo accounts are predefined and work offline
- Password is the same for all accounts: `password`
- The authentication system is ready to be connected to a real backend API
- User roles and permissions are enforced throughout the UI

---

**Default Development Account**: If no authentication provider is set up, the system defaults to no authentication (logged out state).
