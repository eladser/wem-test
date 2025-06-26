# 🚀 WEM Energy Dashboard

<div align="center">

![WEM Dashboard](https://img.shields.io/badge/WEM-Dashboard-green?style=for-the-badge&logo=energy)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan?style=for-the-badge&logo=tailwindcss)

**A comprehensive energy management dashboard built with modern web technologies**

[Live Demo](https://wem-dashboard.vercel.app) • [Documentation](#documentation) • [Features](#features) • [Contributing](#contributing)

</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🔧 Development](#-development)
- [🎨 UI Components](#-ui-components)
- [📊 Performance](#-performance)
- [🌐 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🔒 Security](#-security)
- [⌨️ Keyboard Shortcuts](#️-keyboard-shortcuts)
- [🎭 Themes](#-themes)
- [📦 Export Functionality](#-export-functionality)
- [🔄 Real-time Features](#-real-time-features)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🏠 **Core Dashboard**
- **Real-time Energy Monitoring** - Live data updates via WebSocket
- **Multi-site Management** - Monitor multiple energy sites from one dashboard
- **Interactive Charts** - Beautiful, responsive data visualizations
- **Performance Metrics** - Comprehensive KPIs and efficiency tracking
- **Alert System** - Smart notifications for critical events

### 🎨 **User Experience**
- **Dark/Light Themes** - Automatic theme switching with system preference
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Power user navigation (⌘K for command palette)
- **Advanced Loading States** - Skeleton screens and progressive loading
- **Error Boundaries** - Graceful error handling with recovery options

### 📊 **Data & Analytics**
- **Export Functionality** - CSV, Excel, PDF, PNG, JSON formats
- **Real-time Updates** - Live data streaming with auto-reconnection
- **Performance Monitoring** - Built-in performance tracking and optimization
- **Advanced Filtering** - Search, sort, and filter across all data

### 🔧 **Developer Experience**
- **TypeScript** - Full type safety and IntelliSense
- **Modern React** - Hooks, Suspense, Error Boundaries
- **Performance Optimized** - Lazy loading, code splitting, memoization
- **Comprehensive Testing** - Unit, integration, and E2E tests

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ or **Bun** 1.0+
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/eladser/wem-test.git
cd wem-test

# Install dependencies (using Bun for faster installs)
bun install
# or with npm
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
bun dev
# or with npm
npm run dev
```

🎉 **Open [http://localhost:5173](http://localhost:5173) to view the dashboard!**

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun preview` | Preview production build |
| `bun lint` | Run ESLint |
| `bun test` | Run tests |

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── common/          # Common components (ErrorBoundary, etc.)
│   ├── theme/           # Theme provider and controls
│   └── notifications/   # Notification system
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services and utilities
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🎨 UI Components

Built with **shadcn/ui** components and **Tailwind CSS**:

- **Cards** - Data display containers
- **Charts** - Interactive data visualizations using Recharts
- **Tables** - Sortable, filterable data tables
- **Forms** - React Hook Form with Zod validation
- **Modals** - Accessible dialog components
- **Skeletons** - Loading state components

## 📊 Performance

### Optimization Features

- **Lazy Loading** - Components load only when needed
- **Code Splitting** - Automatic bundle splitting
- **Memoization** - Optimized re-renders
- **Service Worker** - Offline support and caching

### Performance Monitoring

Built-in performance monitoring tracks:
- Render times
- Memory usage
- Network requests
- Core Web Vitals

**Press `Ctrl+Shift+P` to toggle performance monitor in development**

## 🌐 Deployment

### Automated Deployment

The project includes GitHub Actions workflows for:
- **Quality Checks** - Linting, type checking, testing
- **Security Scanning** - Vulnerability detection
- **Multi-environment Deployment** - Staging and production
- **Performance Monitoring** - Lighthouse CI

### Manual Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build the project
bun build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

## 🔒 Security

### Security Features

- **Input Validation** - Zod schema validation
- **XSS Protection** - Sanitized user inputs
- **Secure Headers** - Security headers configuration
- **Dependency Scanning** - Automated vulnerability scanning

## ⌨️ Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘+K` / `Ctrl+K` | Open command palette |
| `⌘+H` / `Ctrl+H` | Go to dashboard |
| `⌘+A` / `Ctrl+A` | Go to analytics |
| `⌘+S` / `Ctrl+S` | Go to settings |
| `⌘+R` / `Ctrl+R` | Refresh data |
| `⌘+E` / `Ctrl+E` | Export data |
| `⌘+T` / `Ctrl+T` | Toggle theme |
| `Shift+?` | Show keyboard shortcuts |
| `Esc` | Close dialogs/modals |

## 🎭 Themes

### Built-in Themes

- **Dark Mode** - Default energy dashboard theme
- **Light Mode** - Clean, bright interface
- **System** - Follows system preference

## 📦 Export Functionality

### Supported Formats

- **CSV** - Comma-separated values
- **Excel (XLSX)** - Microsoft Excel format
- **PDF** - Formatted reports with charts
- **PNG** - Chart images
- **JSON** - Raw data format

## 🔄 Real-time Features

### WebSocket Connection

- **Auto-reconnection** - Handles connection drops
- **Message queuing** - Queues messages during disconnection
- **Heartbeat monitoring** - Keeps connection alive
- **Error handling** - Graceful degradation

### Live Data Updates

- Energy generation metrics
- System status monitoring
- Alert notifications
- Performance indicators

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **Conventional Commits** - Commit message format

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ by [eladser](https://github.com/eladser)**

[⭐ Star this repo](https://github.com/eladser/wem-test) if you find it helpful!

</div>