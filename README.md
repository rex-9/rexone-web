<a name="readme-top"></a>

<div align="center">
  <h3><b>Rexone Web</b></h3>
</div>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📗 Table of Contents](#-table-of-contents)
- [📖 Rexone Web](#-rexone-web)
  - [🚀 Featuring!](#-featuring)
    - [🌟 Modern Tech Stack](#-modern-tech-stack)
    - [🗃️ State Management \& Storage](#️-state-management--storage)
    - [🏗️ Design Patterns \& Architecture](#️-design-patterns--architecture)
    - [🔐 Authentication \& Security](#-authentication--security)
    - [🔌 Integrated Services](#-integrated-services)
      - [📧 Email Services](#-email-services)
      - [🔔 Real-time Updates](#-real-time-updates)
      - [💳 Payment Integration](#-payment-integration)
      - [📁 Media \& File Management](#-media--file-management)
      - [🤖 AI Features](#-ai-features)
  - [🛠 Built With](#-built-with)
    - [Tech Stack](#tech-stack)
  - [💻 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Environment Variables](#environment-variables)
    - [Run](#run)
    - [Build for Production](#build-for-production)
    - [Preview Production Build](#preview-production-build)
  - [📁 Project Structure](#-project-structure)
- [☕ Support](#-support)
  - [👤 Author](#-author)

# 📖 Rexone Web

**Rexone Web** is a production-ready React web foundation designed for building modern authenticated applications and administrative dashboards. It provides a structured client-side architecture with clear separation between presentation, application logic, state management, and backend communication.

The project is designed to work as part of the **Rexone ecosystem**, providing a reusable foundation that can be extended across multiple products and platforms.

**Related Repositories:**

- **Core API**: [Rexone Core](https://github.com/rex-9/rexone-core)
- **Mobile App**: [Rexone Mobile](https://github.com/rex-9/rexone-mobile)

## 🚀 Featuring!

### 🌟 Modern Tech Stack

- **React with TypeScript**: Build scalable and maintainable interfaces with strong static typing.
- **Vite**: Fast development server and optimized production builds.
- **TailwindCSS**: Utility-first styling for responsive and consistent UI development.
- **DaisyUI**: Reusable UI components and theme support built on top of TailwindCSS.
- **React Router**: Client-side routing and protected application navigation.

### 🗃️ State Management & Storage

- **Jotai**: Lightweight atomic state management for application and user state.
- **Local Storage**: Persistent client-side storage for appropriate application preferences and session-related data.
- **Centralized State Architecture**: Keeps shared application state predictable and separated from presentation logic.

### 🏗️ Design Patterns & Architecture

- **MVC-inspired Client Architecture**: Clear separation between Models, Controllers, Services, and Views.
- **Controller Layer**: Handles API success and failure responses before exposing data to UI components.
- **Service Layer**: Centralizes communication with the Rexone Core API.
- **Model Layer**: Strongly typed API responses, envelopes, resources, and application data structures.
- **Component-Based Architecture**: Reusable UI components organized for maintainability and consistency.
- **Clean Architecture Principles**: Separates responsibilities to keep the application easy to extend and maintain.
- **Dockerized Development**: Supports a consistent and reproducible development environment.

### 🔐 Authentication & Security

- **Email-Password Authentication**: Secure user authentication through the Rexone Core API.
- **Google Authentication**: OAuth-based sign-in support.
- **Email Confirmation**: User email verification workflows.
- **Forgot Password & Reset Password**: Account recovery workflows.
- **Protected Routes**: Restrict authenticated application areas.
- **Role-Based Access Control**: Support different application capabilities based on user roles and permissions.
- **Centralized API Authentication**: Authentication and authorization are handled through the Core API.

### 🔌 Integrated Services

The web application is designed to integrate with the Rexone Core API and its surrounding services.

#### 📧 Email Services

- Email confirmation workflows
- Password reset and account recovery
- Transactional notifications
- User onboarding communication

#### 🔔 Real-time Updates

- Real-time communication with backend services
- Live notifications and application updates
- Support for event-driven application experiences

#### 💳 Payment Integration

- Stripe payment processing through the backend
- Subscription and payment workflows
- Secure checkout experiences
- Payment status and transaction handling

#### 📁 Media & File Management

- Image and file upload workflows
- Cloudinary integration where required
- AWS S3-compatible storage support
- Client-side upload interfaces and previews

#### 🤖 AI Features

- Integration with AI-powered backend services
- AI-assisted application workflows
- Support for AI-generated content and recommendations
- Centralized AI communication through the Core API

## 🛠 Built With

### Tech Stack

<details>
  <summary>Web Client</summary>
  <ul>
    <li><a href="https://react.dev/">ReactJS</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://daisyui.com/">DaisyUI</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://vitejs.dev/">Vite</a></li>
    <li><a href="https://jotai.org/">Jotai</a></li>
    <li><a href="https://www.docker.com/">Docker</a></li>
  </ul>
</details>

## 💻 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need to install [Node.js](https://nodejs.org/en) and [Yarn](https://yarnpkg.com/).

Check your installation:

```sh
  node --version && yarn --version
```

### Setup

Clone this repository or download it to your desired folder:

```sh
  cd my-folder
  git clone git@github.com:rex-9/rexone-web.git
```

Enter the root level of the project:

```sh
  cd rexone-web
```

Install the dependencies:

```sh
  yarn install
```

### Environment Variables

Create a `.env` file in the root directory with the required environment variables:

```env
VITE_REACT_APP_SERVER_BASE_URL=http://localhost:3000
VITE_REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

> Environment variables should be configured according to the target environment. Never commit secrets or sensitive credentials to the repository.

### Run

Start the development application:

```sh
  sh run_dev.sh
```

The web application will be available at:

```text
http://localhost:5173
```

The development application communicates with the local **Rexone Core API**.

### Build for Production

Create an optimized production build:

```sh
  yarn build
```

The production assets will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```sh
  yarn preview
```

## 📁 Project Structure

```text
rexone-web/
├── src/
│   ├── assets/         # Images, icons, videos, and static application assets
│   ├── contexts/       # Contexts and Providers
│   ├── design/         # Atomic Design System
│   ├── controllers/    # Application-level API response handling
│   ├── hooks/          # Reusable React hooks
│   ├── models/         # TypeScript models and API types
│   ├── helpers/        # Shared utilities and helpers
│   ├── services/       # Backend API communication
│   ├── atoms.ts        # Jotai state management
│   └── ...
```

# ☕ Support

If you like this project, please consider giving it a star on GitHub and buying me a coffee to support its development: 🌟

[![GitHub Stars](https://img.shields.io/github/stars/rex-9/rexone-web.svg?style=social&label=Star)](https://github.com/rex-9/rexone-web)

<!-- <div align="center">
  <a href="https://buymeacoffee.com/rex9" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
  </a>
</div> -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 👤 Author

**Rex (Rex9)**

- GitHub: [@rex-9](https://github.com/rex-9)
- Portfolio: [rex9.vercel.app](https://rex9.vercel.app)
- Linkedin: [rex9](https://www.linkedin.com/in/rex9/)

_Built with ❤️ by Rex9_
