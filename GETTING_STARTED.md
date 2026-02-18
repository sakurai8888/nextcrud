# Getting Started with NextCRUD

This guide will help you get the application up and running.

## Prerequisites

Make sure you have the following installed:
- Node.js 20 or higher
- npm (comes with Node.js)
- Docker and Docker Compose

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/sakurai8888/nextcrud.git
cd nextcrud
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start MongoDB Database

```bash
docker compose up -d
```

This will start MongoDB in a Docker container on port 27017.

To verify MongoDB is running:
```bash
docker ps
```

You should see a container named `nextcrud-mongodb`.

### 4. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

**Important**: Edit `.env.local` and set a strong JWT_SECRET:
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/nextcrud?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## First Time Usage

### Creating Your First User

1. Visit http://localhost:3000
2. Click "Don't have an account? Register"
3. Enter your email and password
4. Select a role:
   - **Admin**: Full access to create, edit, and delete items
   - **Viewer**: Can only view items (read-only)
5. Click "Register"

### Testing the Application

#### As an Admin User:
- Create an admin account
- Click "Add Item" to create new items
- Edit existing items using the "Edit" button
- Delete items using the "Delete" button

#### As a Viewer User:
- Create a viewer account
- View all items
- Notice that "Add Item", "Edit", and "Delete" buttons are not available
- See the notification "You are logged in as a viewer. You can only view data."

## Production Deployment

### Security Checklist

Before deploying to production:

1. ✅ Change `JWT_SECRET` to a strong, random secret
2. ✅ Update MongoDB credentials in docker-compose.yml
3. ✅ Use Docker secrets or environment variables for sensitive data
4. ✅ Enable HTTPS/TLS
5. ✅ Set `NODE_ENV=production`
6. ✅ Review and update CORS settings if needed
7. ✅ Configure proper backup strategy for MongoDB

### Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### MongoDB Connection Issues

If you can't connect to MongoDB:
```bash
# Check if MongoDB is running
docker ps

# View MongoDB logs
docker logs nextcrud-mongodb

# Restart MongoDB
docker compose restart
```

### Port Already in Use

If port 3000 or 27017 is already in use:
```bash
# Find the process using the port
lsof -i :3000
lsof -i :27017

# Kill the process or change the port in the configuration
```

### Application Won't Start

If the app won't start:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Stopping the Application

### Stop Development Server
Press `Ctrl+C` in the terminal running `npm run dev`

### Stop MongoDB
```bash
docker compose down
```

### Stop and Remove All Data
```bash
docker compose down -v
```

## Additional Commands

```bash
# View MongoDB data
docker exec -it nextcrud-mongodb mongosh -u admin -p password123

# Backup MongoDB
docker exec nextcrud-mongodb mongodump -u admin -p password123 -o /backup

# View application logs (production)
pm2 logs nextcrud
```

## Support

For issues or questions, please open an issue on GitHub.
