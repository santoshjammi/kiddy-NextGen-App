# Kiddy Learning Hub - Next.js

An interactive educational platform for children ages 3-6, built with Next.js 15, Firebase, and Tailwind CSS.

## Features

- 🎓 **Interactive Learning Games**: Alphabet, Numbers, Shapes, and Colors
- 🔐 **Firebase Authentication**: User registration and login
- 📊 **Progress Tracking**: Monitor learning progress with Firestore
- 🎯 **Achievement System**: Celebrate milestones and completed games
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Kid-Friendly UI**: Colorful and engaging interface

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kiddy-learning-hub-next
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:

   a. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

   b. Enable Authentication with Email/Password provider

   c. Create a Firestore database

   d. Copy your Firebase config and update `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard
│   ├── login/            # Authentication page
│   ├── alphabet/         # Alphabet learning game
│   ├── numbers/          # Numbers learning game
│   ├── shapes/           # Shapes learning game
│   ├── colors/           # Colors learning game
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable UI components
│   ├── Header.tsx        # Site header
│   ├── AppCard.tsx       # Learning app cards
│   ├── Footer.tsx        # Site footer
│   └── ProtectedRoute.tsx # Route protection
├── contexts/            # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                 # Utility functions
│   ├── firebase.ts       # Firebase configuration
│   ├── firestore.ts      # Firestore operations
│   └── learningApps.ts   # App configuration
└── types/               # TypeScript type definitions
    └── index.ts          # Shared types
```

## Firebase Data Structure

### Users Collection
```
users/{uid}/
├── profile: {
│   uid: string
│   name: string
│   email: string
│   age?: number
│   totalPoints: number
│   }
└── learningPaths/{pathId}/: {
    id: string
    title: string
    currentStep: number
    isCompleted: boolean
    lastAccessed: Date
    totalSteps: number
    }
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your Firebase environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to set the Firebase environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub.
