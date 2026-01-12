
# SkillBridge

SkillBridge is a full-stack online learning platform with course management, video streaming, and payment processing. Built using the MERN stack with modern UI components and real-time features.

## Features

- 🎓 Course creation and management system  
- 📹 Video content streaming with progress tracking  
- 🔐 Secure user authentication (Clerk Authentication)  
- 💳 Integrated payment processing (Stripe)  
- 👨‍🏫 Instructor dashboard with analytics  
- 📱 Fully responsive mobile-friendly UI


## Tech Stack

**Frontend:** React+Vite, TailwindCSS

**Backend:** Node, Express

**Database:** MongoDB + Mongoose

**Deployment:** Vercel


## Installation

Prerequisites Node.js (v18+)  
MongoDB Atlas account (or local MongoDB)  
Vite (for React frontend)

**Clone the Repository**
```bash
  git clone https://github.com/<your-username>/SkillBridge.git
  cd SkillBridge
```

**Setup**

Backend :-
```bash
  cd server
  npm install
```
Create a .env file:
```bash
  CURRENCY='USD'
  MONGODB_URI=<your_mongodb_uri>
  CLERK_WEBHOOK_SECRET=<your_clerk_webhook_secret> 
  CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
  CLERK_SECRET_KEY=<your_clerk_secret_key>
  CLOUDINARY_NAME=<your_cloudinary_name>
  CLOUDINARY_API_KEY=<your_cloudinary_api_key>
  CLOUDINARY_SECRET_KEY=<your_cloudinary_secret_key>
  STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
  STRIPE_SECRET_KEY=<your_stripe_secret_key>
  STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret_key>

```
Run the backend:
```bash
  npm run server
```

Frontend:-
```bash
  cd client
  npm install
```
Create a .env file in client/:
```bash
  VITE_CLERK_PUBLISHABLE_KEY=<your_vite_clerk_publishable_key>
  VITE_CURRENCY='$'
  VITE_BACKEND_URL=<your_backend_server_URL>

```
Run the frontend:
```bash
  npm run dev
```
## Contributing

Contributions are always welcomed!

1. Fork the repo  
2. Create your feature branch: git checkout -b feature/FeatureName  
3. Commit your changes: git commit -m 'Add FeatureName'  
4. Push to the branch: git push origin feature/FeatureName  
5. Open a pull request

