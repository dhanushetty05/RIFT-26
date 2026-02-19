# CI/CD Healing Agent - Frontend

Modern React frontend for the CI/CD Healing Agent with authentication and responsive design.

## 🚀 Tech Stack

- **React 18.3** - Functional components with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **React Router** - Client-side routing
- **Context API** - State management
- **Recharts** - Data visualization
- **Axios** - API communication

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx
│   ├── InputSection.tsx
│   ├── ProtectedRoute.tsx
│   └── ...
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   └── AgentContext.tsx # Agent pipeline state
├── pages/              # Route pages
│   ├── Landing.tsx     # Landing page
│   ├── Login.tsx       # Login/Signup page
│   ├── Dashboard.tsx   # Main dashboard (protected)
│   └── NotFound.tsx
├── types/              # TypeScript types
├── lib/                # Utilities
├── App.tsx             # App root with routing
└── main.tsx            # Entry point
```

## 🎨 Features

### Landing Page
- Modern, responsive design
- Feature showcase
- Tech stack display
- Call-to-action sections
- Mobile-optimized

### Authentication System
- Email-based authentication
- Email verification with 6-digit code
- Login and signup flows
- Protected routes
- Local storage persistence
- Logout functionality

### Dashboard
- CI/CD pipeline execution
- Real-time loading states
- Results visualization
- Score panel with charts
- Fixes table
- Timeline view
- JSON download

## 🔐 Authentication Flow

1. **Landing Page** (`/`)
   - Public page with product information
   - CTA buttons to login/signup

2. **Login/Signup** (`/login`)
   - Email input and validation
   - Toggle between login and signup modes
   - Email verification step

3. **Email Verification**
   - 6-digit code sent to console (simulated)
   - Code verification
   - Resend code option

4. **Dashboard** (`/dashboard`)
   - Protected route (requires authentication)
   - Full CI/CD agent functionality
   - User profile display
   - Logout option

## 🎯 State Management

### AuthContext
Manages authentication state:
- User data (email, verified status)
- Login/signup functions
- Email verification
- Logout
- Local storage sync

### AgentContext
Manages CI/CD pipeline state:
- Pipeline execution
- Results data
- Loading states
- Error handling

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📦 Build

```bash
# Production build
npm run build

# The build output will be in the 'dist' folder
```

## 🌐 Deployment

### Vercel
```bash
npm run build
# Deploy the 'dist' folder
```

### Netlify
```bash
npm run build
# Deploy the 'dist' folder with build command: npm run build
```

### Docker
```bash
# Build image
docker build -t cicd-healer-frontend .

# Run container
docker run -p 5173:5173 cicd-healer-frontend
```

## 🎨 Styling

- **TailwindCSS** for utility classes
- **CSS Variables** for theming
- **Custom animations** in index.css
- **Dark mode** by default
- **Glass morphism** effects
- **Gradient backgrounds**

## 🔧 Configuration

### Vite Config
- React SWC plugin for fast refresh
- Path aliases (@/ for src/)
- Build optimizations

### TypeScript Config
- Strict mode enabled
- Path mapping
- Modern ES features

### ESLint Config
- React hooks rules
- TypeScript rules
- Code quality checks

## 📝 Key Components

### ProtectedRoute
Wraps routes that require authentication. Redirects to login if not authenticated.

### AuthContext
Provides authentication state and methods throughout the app.

### AgentContext
Manages CI/CD pipeline state and API calls.

## 🔒 Security

- Client-side authentication (demo purposes)
- Local storage for persistence
- Protected routes
- Input validation
- XSS prevention

## 🎯 Best Practices

- Functional components with hooks
- TypeScript for type safety
- Context API for state management
- Responsive design patterns
- Accessibility considerations
- Code splitting
- Lazy loading
- Error boundaries

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- shadcn/ui for beautiful components
- TailwindCSS for styling
- Vite for fast development
- React team for amazing framework
