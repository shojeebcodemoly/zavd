# Cheese Project

Medical product catalog website built with Next.js 16, React 19, and MongoDB.

## Tech Stack

- **Frontend:** Next.js 16 + React 19 + Tailwind CSS 4
- **UI Components:** Radix UI + Framer Motion
- **Backend:** Next.js API Routes
- **Database:** MongoDB (Atlas or Local)
- **Authentication:** Better Auth + bcrypt
- **Language:** TypeScript 5

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### 3. Database Setup

**Option A: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cheese-db
MONGODB_DB=cheese-db
```

**Option B: Local MongoDB (Docker)**
```bash
docker run -d --name cheese-mongodb -p 27017:27017 -v cheese-mongodb-data:/data/db mongo:7
```
```env
MONGODB_URI=mongodb://127.0.0.1:27017/cheese-db
MONGODB_DB=cheese-db
```

### 4. Create Admin User

```bash
npm run seed:admin
```

**Default Admin Credentials:**
| Field | Value |
|-------|-------|
| Email | `admin@cheese.se` |
| Password | `Admin@123` |

> Password requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char (@$!%*?&#)

**Or use environment variables:**
```bash
SEED_ADMIN_EMAIL=admin@cheese.se SEED_ADMIN_NAME="Admin User" SEED_ADMIN_PASSWORD="Admin@123" npm run seed:admin
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Dashboard

Access the admin panel at `/login` with your admin credentials.

## Project Structure

```
cheese/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Authentication pages
│   ├── (client)/        # Public pages
│   ├── (dashboard)/     # Admin dashboard
│   └── api/             # API routes
├── components/          # React components
├── lib/                 # Utilities & services
├── models/              # MongoDB schemas
├── public/storage/      # Media files (not in git)
└── scripts/             # Utility scripts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed:admin` | Create admin user |

## License

Private - All rights reserved.
