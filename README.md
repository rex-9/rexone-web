# meritbox-web

<a name="readme-top"></a>

<div align="center">
  <h3><b>Meritbox Web</b></h3>
</div>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [meritbox-web](#meritbox-web)
- [📗 Table of Contents](#-table-of-contents)
- [📖 Meritbox Web ](#-meritbox-web-)
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
  - [🛠 Built With ](#-built-with-)
    - [Tech Stack ](#tech-stack-)
  - [💻 Getting Started ](#-getting-started-)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Environment Variables](#environment-variables)
    - [Run](#run)
    - [Build for Production](#build-for-production)
    - [Preview Production Build](#preview-production-build)
  - [📁 Project Structure](#-project-structure)
- [☕ Support ](#-support-)
  - [👤 Author](#-author)

<!-- PROJECT DESCRIPTION -->

# 📖 Meritbox Web <a name="about-project"></a>

**Meritbox Web** is a robust frontend framework for authenticated web applications, offering a solid foundation for diverse product development needs. This repository also serves as an excellent learning resource for anyone looking to master frontend web development. It emphasizes best practices on the client side, enabling developers to write simple yet clean code.

**Related Repositories:**

- **Backend API**: [Meritbox API](https://github.com/rex-9/meritbox-api)
- **Mobile App**: [Auth Service Mobile](https://github.com/rex-9/auth_service_mobile)

## 🚀 Featuring!

### 🌟 Modern Tech Stack

- **React with TypeScript**: Enjoy the benefits of a strongly-typed language for building robust and scalable applications.
- **TailwindCSS for UI**: Rapidly build modern and responsive user interfaces with utility-first CSS.
- **Vite for Hosting**: Experience fast and efficient development with Vite's lightning-fast build tool.

### 🗃️ State Management & Storage

- **Jotai**: Simplify state management and local storage with Jotai's atomic state management library.
- **Local Storage Integration**: Persistent user preferences and session management.

### 🏗️ Design Patterns & Architecture

- **MVC Design Pattern**: Maintain a clean separation of concerns with the Model-View-Controller design pattern.
- **Dockerized**: Easily deploy and manage your application with Docker.
- **Clean Architecture**: Ensure maintainability and scalability with a clean and modular architecture.
- **Component-Based Architecture**: Reusable and maintainable UI components with Atomic Design System.

### 🔐 Authentication & Security

- **Email-Password Authentication**: Securely authenticate users with email and password.
- **Google Authentication**: Provide a seamless sign in experience with Google OAuth.
- **Forgot Password & Reset Password**: Allow users to recover their accounts with ease.
- **Email Confirmation**: Verify user email addresses to enhance security.
- **Protected Routes**: Role-based access control for different user types.

### 🔌 Integrated Services

The web application seamlessly integrates with various backend services:

#### 📧 Email Services

- Transactional emails for verification and notifications
- Password reset and account recovery workflows
- Welcome emails and user onboarding

#### 🔔 Real-time Updates

- WebSocket connections via Action Cable
- Live notifications and real-time data updates
- Instant feedback for user actions

#### 💳 Payment Integration

- Stripe payment processing
- Subscription management
- Secure checkout experience

#### 📁 Media & File Management

- Cloudinary image optimization
- AWS S3 file storage
- Drag-and-drop upload support

#### 🤖 AI Features

- DeepSeek AI integration
- Smart content generation
- AI-powered recommendations

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Frontend</summary>
  <ul>
    <li><a href="https://react.dev/">React 18</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://vitejs.dev/">Vite</a></li>
    <li><a href="https://jotai.org/">Jotai</a></li>
  </ul>
</details>

<details>
  <summary>Backend Integration</summary>
  <ul>
    <li><a href="https://rubyonrails.org/">Ruby on Rails API</a></li>
    <li><a href="https://stripe.com/">Stripe</a> (Payments)</li>
    <li><a href="https://onesignal.com/">OneSignal</a> (Notifications)</li>
    <li><a href="https://cloudinary.com/">Cloudinary</a> (Images)</li>
    <li><a href="https://aws.amazon.com/s3/">AWS S3</a> (Storage)</li>
    <li><a href="https://deepseek.com/">DeepSeek</a> (AI Services)</li>
  </ul>
</details>

<details>
  <summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need download [Node](https://nodejs.org/en) and [yarn](https://yarnpkg.com/):

Check your node installation is complete.

```sh
  node --version && yarn --version
```

### Setup

Clone this repository or download as a zip file to your desired folder:

```sh
  cd my-folder
  git clone git@github.com:rex-9/meritbox-web.git
```

Enter the Root level of the project

```sh
  cd meritbox-web
```

Install the dependencies using yarn or npm:

```sh
> yarn install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_REACT_APP_SERVER_BASE_URL=http://localhost:3000
VITE_REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### Run

run the app.

```sh
> sh run_dev.sh
```

This will start the development server at `http://localhost:5173`

### Build for Production

```sh
> yarn build
```

### Preview Production Build

```sh
> yarn preview
```

## 📁 Project Structure

```
meritbox-web/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── hooks/         # Custom React hooks
│   ├── store/         # Jotai state management
│   ├── services/      # API service integrations
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   └── styles/        # Global styles and Tailwind config
├── public/            # Static assets
```

# ☕ Support <a name="support"></a>

If you like this project, please consider giving it a star on GitHub and buying me a coffee to support its development: 🌟

[![GitHub Stars](https://img.shields.io/github/stars/rex-9/meritbox-web.svg?style=social&label=Star)](https://github.com/rex-9/meritbox-web)

<div align="center">
  <a href="https://buymeacoffee.com/rex9" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
  </a>
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 👤 Author

**Rex (Rex9)**

- GitHub: [@rex-9](https://github.com/rex-9)
- Portfolio: [rex9.vercel.app](https://rex9.vercel.app)
- Linkedin: [rex9](https://www.linkedin.com/in/rex9/)

_Built with ❤️ by Rex9_
