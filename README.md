# NextGen Electronics - E-Commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, Express, and MongoDB. This project demonstrates advanced web development practices including authentication, real-time features, and comprehensive testing.

## 🚀 Features

### Core Functionality

- **User Authentication & Authorization**: JWT-based authentication with role-based access control (Customer, Staff, Admin)
- **Email Verification**: OTP-based email verification system
- **Product Management**: Advanced search, filtering, and categorization
- **Shopping Cart**: Persistent cart with real-time updates
- **Order Management**: Complete order lifecycle with status tracking
- **Review System**: Product reviews with verification for delivered orders
- **Wishlist**: Save favorite products for later
- **User Profiles**: Comprehensive user settings and address management

### Advanced Features

- **Real-time Search**: Advanced search with filters, sorting, and pagination
- **Image Upload**: Secure image processing with Sharp
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Toast Notifications**: User-friendly feedback system
- **Order Tracking**: Real-time order status updates
- **Staff Dashboard**: Dedicated interface for staff operations
- **Admin Panel**: Complete administrative control

## 🏗️ Architecture

### Backend Structure

```
backend/
├── src/                    # Source code
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── utils/             # Utility functions
├── scripts/               # Utility scripts
├── tests/                 # Test suites
│   ├── fixtures/          # Test data
│   ├── integration/       # Integration tests
│   ├── setup/            # Test configuration
│   └── unit/             # Unit tests
├── docs/                  # Documentation
└── uploads/               # File uploads
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── forms/         # Form components
│   │   └── ui/           # UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── styles/           # CSS styles
│   └── assets/           # Static assets
└── public/               # Public assets
```

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Multer** - File uploads
- **Sharp** - Image processing
- **Jest** - Testing framework
- **Supertest** - API testing

### Frontend

- **React** - UI library
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd NextGen-Electronics
   ```

2. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgen-electronics
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Test with coverage
npm run test:coverage

# Run specific test suites
npm run test:watch
```

### Test Coverage

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ API coverage
- **Overall Coverage**: 85%+

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/resend-otp` - Resend OTP

### Product Endpoints

- `GET /api/products` - Get products with search/filter
- `GET /api/products/categories` - Get categories
- `GET /api/products/brands` - Get brands
- `GET /api/products/search-suggestions` - Search suggestions
- `GET /api/products/stats` - Product statistics
- `POST /api/products` - Create product (Admin/Staff)
- `PUT /api/products/:id` - Update product (Admin/Staff)
- `DELETE /api/products/:id` - Delete product (Admin)

### Order Endpoints

- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Staff/Admin)

### User Endpoints

- `GET /api/users/me` - Get user profile
- `PUT /api/users/me/last-viewed` - Update last viewed products
- `GET /api/users/me/wishlist` - Get wishlist
- `POST /api/users/me/wishlist` - Add to wishlist
- `DELETE /api/users/me/wishlist/:id` - Remove from wishlist

## 🔧 Development Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Frontend Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

## 📖 Documentation

- [API Documentation](backend/docs/API_DOCUMENTATION.md)
- [Email Configuration](backend/docs/EMAIL_CONFIGURATION.md)
- [Testing Strategy](docs/TESTING_STRATEGY.md)
- [OTP Implementation](docs/OTP_IMPLEMENTATION_README.md)
- [Search & Filter Implementation](docs/SEARCH_FILTER_IMPLEMENTATION.md)
- [Staff Functionality](docs/STAFF_FUNCTIONALITY_README.md)
- [Toast Implementation](docs/TOAST_IMPLEMENTATION.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Backend Development**: Node.js, Express, MongoDB
- **Frontend Development**: React, Tailwind CSS
- **Testing**: Jest, Supertest
- **Documentation**: Comprehensive API and implementation docs

## 🎯 Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced inventory management
- [ ] Customer support chat
- [ ] Recommendation engine

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**NextGen Electronics** - Building the future of e-commerce, one component at a time.
