# Employee Collaboration Portal - Client

An Angular frontend application for the Employee Collaboration Portal that provides a modern, responsive interface for employee collaboration and content management.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Angular Material
- **User Authentication**: Login/logout with JWT token management
- **Role-Based Access**: Different interfaces for Admin and Employee roles
- **Post Management**: Create, edit, delete, and view posts with rich content
- **Interactive Comments**: Add, edit, and manage comments on posts
- **Like/Dislike System**: Engage with posts through likes and dislikes
- **Advanced Filtering**: Filter posts by author, sort by date or popularity
- **Dashboard**: Comprehensive metrics and user management
- **Trending Content**: Highlight popular posts with 5+ likes
- **Form Validation**: Real-time validation with user-friendly error messages

## 🛠️ Technology Stack

- **Angular 20+** - Frontend Framework
- **Angular Material** - UI Component Library
- **TypeScript** - Programming Language
- **RxJS** - Reactive Programming
- **Angular CLI** - Development Tools
- **SCSS** - Styling

## 📋 Prerequisites

- [Node.js 22.x or higher](https://nodejs.org/)
- [npm 10.x or higher](https://www.npmjs.com/)
- [Angular CLI](https://angular.io/cli)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Dileesha-Ekanayake/EmployeePortalFrontend.git
```

### 2. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

## 🔐 Default Admin Account:

- **Username**: Dileesha
- **Password**: Admin@1234

## For every other User Account:

- **Username**: The username of the User
- **Password**: {"Username"}@1234

## 🎨 UI Components & Features

### Dashboard

- Total users, posts, and comments metrics
- Interactive charts and statistics
- Quick actions for user management
- Trending posts overview

### Post Management

- Rich text editor for post creation
- Real-time post updates
- Edit/delete functionality for own post
- Author filtering and sorting options
- Like/dislike interactions with animations

### Comment System

- Threaded comment display
- Real-time comment addition
- Author and timestamp information

### User Management (Admin Only)

- Create new users with role assignment
- View all registered users
- User role management
- Account status controls

## 📁 Project Structure

```
EmployeePortalFrontend/
├── src/
│   ├── app/
│   │   ├── auth/                    # Authentication components & services
│   │   │   ├── authenticate.service.ts
│   │   │   ├── authorization-manager.service.ts
│   │   │   └── jwt-interceptor.ts
│   │   ├── entity/                  # Data models & interfaces
│   │   ├── service/                 # HTTP services
│   │   │   ├── api-endpoint.ts
│   │   │   └── data.service.ts
│   │   ├── util/                    # Utility functions & helpers
│   │   │   └── simple-response-handler.ts
│   │   ├── view/                    # Page components & views
│   │   │   ├── dashboard/           # Dashboard
│   │   │   ├── login/               # Authentication pages
│   │   │   ├── mainwindow/          # Main layout component
│   │   │   └── module/              # Feature modules
│   │   │       ├── post/            # Post Component
│   │   │       └── user/            # User Component
│   │   ├── app.config.ts            # App configuration
│   │   ├── app.html                 # Main app template
│   │   ├── app.routes.ts            # Application routing
│   │   ├── app.scss                 # Global app styles
│   │   ├── app.spec.ts              # App unit tests
│   │   └── app.ts                   # Root app component
│   ├── index.html                   # Main HTML file
│   ├── main.ts                      # Bootstrap file
│   └── styles.scss                  # Global styles
├── angular.json                     # Angular CLI configuration
├── package.json                     # npm dependencies
└── tsconfig.json                    # TypeScript configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request
