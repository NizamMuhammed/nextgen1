# Staff Order Management Functionality

This document describes the new staff role functionality that allows staff users to view and manage all orders with filtering capabilities for paid and delivered status.

## Overview

Staff users can now:

- View all orders in the system
- Filter orders by payment status (paid/unpaid)
- Filter orders by delivery status (delivered/not delivered)
- Filter orders by order status (pending, processing, shipped, delivered, cancelled)
- Update order statuses
- Mark orders as paid
- Mark orders as delivered

## User Roles

The system now supports three user roles:

1. **Customer** - Can view and manage their own orders
2. **Staff** - Can view and manage all orders with filtering capabilities
3. **Admin** - Full system access including user and product management

## Setup Instructions

### 1. Backend Changes

The backend has been updated with:

- New "staff" role in User model
- New `/api/orders/staff` endpoint for staff order management
- Updated middleware to allow staff access to order management
- Enhanced order status update functionality

### 2. Frontend Changes

New components and features:

- `StaffOrders.jsx` - Main staff order management interface
- Updated navigation with "Staff Orders" link for staff users
- Enhanced user role display in profile dropdown
- Staff-specific routing and access control

### 3. Creating a Staff User

#### Option 1: Use the provided script

```bash
cd backend
node create-staff-user.js
```

This will create a staff user with:

- Email: staff@nextgen.com
- Password: staff123

#### Option 2: Use the signup form

1. Go to the signup page
2. Fill in the form details
3. Select "Staff" from the role dropdown
4. Complete the signup process

#### Option 3: Update existing user in database

```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne({ email: "existing@email.com" }, { $set: { role: "staff" } });
```

## Usage

### Staff Login

1. Navigate to the login page
2. Use staff credentials to log in
3. You'll see a "Staff Orders" link in the navigation

### Managing Orders

1. Click on "Staff Orders" in the navigation
2. Use the filter options to view specific orders:
   - **Payment Status**: All, Paid Only, Unpaid Only
   - **Delivery Status**: All, Delivered Only, Not Delivered
   - **Order Status**: All, Pending, Processing, Shipped, Delivered, Cancelled

### Order Actions

For each order, staff can:

- **Mark as Paid**: Click "Mark as Paid" button for unpaid orders
- **Mark as Delivered**: Click "Mark as Delivered" button for undelivered orders
- **Update Status**: Use the dropdown to change order status

## API Endpoints

### Staff Orders

- **GET** `/api/orders/staff` - Get all orders with optional filtering
  - Query parameters:
    - `isPaid`: true/false (filter by payment status)
    - `isDelivered`: true/false (filter by delivery status)
    - `status`: order status (pending, processing, shipped, delivered, cancelled)

### Update Order Status

- **PUT** `/api/orders/:id/status` - Update order status (staff/admin only)
  - Body parameters:
    - `status`: new order status
    - `isPaid`: boolean for payment status
    - `isDelivered`: boolean for delivery status
    - `trackingNumber`: tracking number string
    - `estimatedDelivery`: delivery date

## Security

- Staff users can only access order management functionality
- Staff cannot access admin features (user management, product management)
- All staff actions are logged and require authentication
- Role-based access control is enforced at both frontend and backend

## Testing

1. Create a staff user using one of the methods above
2. Log in with staff credentials
3. Navigate to "Staff Orders"
4. Test filtering functionality
5. Test order status updates
6. Verify that staff cannot access admin-only features

## Troubleshooting

### Common Issues

1. **"Access Denied" error**: Ensure user has "staff" or "admin" role
2. **Orders not loading**: Check backend server and database connection
3. **Filters not working**: Verify query parameters are being sent correctly
4. **Status updates failing**: Check if order ID is valid and user has permissions

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify backend server logs for API errors
3. Confirm user role in database
4. Test API endpoints directly with tools like Postman

## Future Enhancements

Potential improvements for staff functionality:

- Order assignment to specific staff members
- Staff activity logging and audit trails
- Bulk order operations
- Advanced reporting and analytics
- Email notifications for status changes
- Mobile-responsive staff interface

## Support

For issues or questions about the staff functionality:

1. Check this documentation first
2. Review the code comments and error messages
3. Check the backend logs for detailed error information
4. Verify database connectivity and user permissions
