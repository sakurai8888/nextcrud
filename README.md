# NextCRUD - MongoDB CRUD Application

A modern full-stack CRUD application built with Next.js 15, MongoDB, TypeScript, and Tailwind CSS. Features authentication, role-based permissions, and dark mode.

## Features

- ✅ **Next.js 15** - Latest Next.js with App Router
- ✅ **MongoDB with Docker** - Easy database setup with Docker Compose
- ✅ **Authentication** - Secure JWT-based authentication
- ✅ **Role-Based Permissions** - Admin and Viewer roles
  - Admin: Full CRUD access (Create, Read, Update, Delete)
  - Viewer: Read-only access
- ✅ **Dark Mode** - Built-in dark theme
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Modern, responsive UI

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/sakurai8888/nextcrud.git
cd nextcrud
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB with Docker

```bash
docker-compose up -d
```

This will start a MongoDB container on `localhost:27017` with:
- Username: `admin`
- Password: `password123`
- Database: `nextcrud`

### 4. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

The default values should work with the Docker setup:

```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/nextcrud?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### First Time Setup

1. Register a new account (choose Admin or Viewer role during registration)
2. Login with your credentials

### User Roles

**Admin Users:**
- Can view all items
- Can create new items
- Can edit existing items
- Can delete items

**Viewer Users:**
- Can only view items
- Cannot create, edit, or delete items
- See a notification indicating view-only access

## Project Structure

```
nextcrud/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   └── me/
│   │   └── items/         # CRUD endpoints for items
│   ├── layout.tsx         # Root layout with dark mode provider
│   ├── page.tsx           # Main page component
│   ├── providers.tsx      # Theme provider
│   └── globals.css        # Global styles
├── components/
│   ├── Header.tsx         # App header with user info
│   ├── LoginForm.tsx      # Login/Register form
│   └── ItemList.tsx       # CRUD interface for items
├── lib/
│   ├── mongodb.ts         # MongoDB connection
│   └── auth.ts            # JWT utilities
├── middleware/
│   └── auth.ts            # Auth middleware for API routes
├── models/
│   ├── User.ts            # User model
│   └── Item.ts            # Item model
├── types/
│   └── mongoose.d.ts      # TypeScript definitions
├── docker-compose.yml     # MongoDB Docker configuration
├── .env.example           # Environment variables template
└── package.json           # Dependencies
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Items (CRUD)

- `GET /api/items` - Get all items (public)
- `POST /api/items` - Create item (admin only)
- `PUT /api/items` - Update item (admin only)
- `DELETE /api/items?id={id}` - Delete item (admin only)

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, next-themes
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with bcryptjs
- **Containerization:** Docker, Docker Compose

## Development

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Stop MongoDB

```bash
docker-compose down
```

### Reset MongoDB (delete all data)

```bash
docker-compose down -v
docker-compose up -d
```

## Security Notes

- Change `JWT_SECRET` in production
- Use strong passwords for MongoDB in production
- Consider using environment-specific MongoDB credentials
- The app uses httpOnly cookies for JWT tokens
- Passwords are hashed using bcrypt before storage

## License

MIT
