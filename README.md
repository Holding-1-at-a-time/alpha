# Project Alpha - Multi-Tenant Platform

This project establishes the multi-tenant foundation for the entire platform. It implements subdomain-based routing, tenant resolution middleware, and base layouts. This scaffolding guarantees that all subsequent features inherit correct tenant isolation and shared styling.

## Tech Stack

- Next.js
- Convex
- TypeScript
- ShadCN UI
- TailwindCSS
- Authentication with Convex Auth

## 🚀 Features

- **Multi-Tenant Architecture**: Subdomain and path-based tenant routing
- **Tenant Isolation**: Complete data and UI isolation between tenants
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript support with strict typing
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark Mode**: Built-in theme switching support
- **Logging System**: Structured logging with future observability support
- **Sidebar Navigation**: Collapsible sidebar with tenant-specific navigation
- **Authentication & Authorization**: Secure access control with Convex Auth
- **Protected Routes**: HOC for route protection with role-based access control

## 🔐 Authentication System

The platform includes a comprehensive authentication and authorization system:

- **User Authentication**: Email/password and OAuth provider support
- **Role-Based Access Control**: Restrict access based on user roles
- **Tenant Isolation**: Users can only access their assigned tenants
- **Protected Routes**: Higher-order component for route protection
- **Auth Context**: Global auth state management with React Context
- **Convex Integration**: Secure backend access with Convex Auth

### Authentication Flow

1. User signs in via the login form or OAuth provider
2. Auth provider validates credentials and returns a token
3. Token is stored in localStorage and used for API requests
4. Convex client is initialized with the auth token
5. Protected routes check for valid authentication before rendering
6. API calls include tenant ID to ensure data isolation

### Role-Based Access Control

The platform supports the following roles:

- **Admin**: Full access to all features
- **Manager**: Access to team management and projects
- **User**: Basic access to dashboard and projects

Roles can be configured per tenant, allowing for flexible access control.
