# Mission Track System

A modern web app that streamlines employee business trip ("mission") requests by replacing paper/email processes with a transparent, efficient workflow.



# Features
Digitize Requests: Employees submit missions via a simple form (destination, purpose, dates, budget, attachments).

Real-Time Tracking: Live status updates (Pending → Approved/Rejected requests).

Manager Dashboard: Review, approve/reject, and allocate budgets quickly.

Finance Visibility: Track departmental spending, validate expenses, and export reports.

Centralized Records: All requests, approvals, and expenses stored in one searchable database.

Analytics & Reporting: Automated insights (frequent destinations, top costs, approval timelines).



👤 User Roles

Employee: Submit requests, track status, upload expenses.

Manager: Approve/reject with notes, set budgets.

Finance: Monitor spending, validate expenses, export reports.

Admin: Configure workflows, roles, and policies.


🛠️ Tech Stack
Backend

Node.js (Express) + TypeScript

PostgreSQL (with Sequelize ORM)

Redis (for caching/sessions)

JWT + role-based access control

Dev Tools

Docker & Docker Compose

Jest + NYC for testing/coverage

ESLint + Prettier for code quality



⚡ Getting Started

1. Clone the Repository

git clone https://github.com/Solvit-Africa-Training-Center/MissionTrack-Backend.git

cd SolvitAfrica-mission-management

2. Run with Docker
Make sure you have Docker & Docker Compose installed.

npm run docker:build   # build all services
npm run docker:up      # start app + db + redis

To stop:
npm run docker:stop

3. Run Backend (without Docker)
cd backend
npm install
npm run dev

4. create your .env 

example:

Environment Configuration

NODE_ENV=DEV

PORT=5000

Database Configuration (DEV)

DEV_USERNAME=your_database_username

DEV_DATABASE=your_database_name

DEV_PASSWORD=your_database_password

DEV_HOST=localhost

DEV_PORT=5432

Redis Configuration

REDIS_HOST=your_redis_host

REDIS_PORT=your_redis_port

REDIS_PASSWORD=your_redis_password

REDIS_DB=your_redis_database

JWT Configuration

JWT_SECRET=your-super-secret-jwt-key-change-in-production

CLOUDINARY_API_KEY=your-cloudinary-api-key

CLOUDINARY_API_SECRET=your-cloudinary-api-secret

CLOUDINARY_CLOUD_NAME=your-cloudinary-api-name



To Run migrations & seeders:

npm run db:migrate

npm run db:seed


🧪 Testing

Run backend tests with coverage:

npm test


