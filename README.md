# Project Alpha - Multi-Tenant Platform

This project establishes the multi-tenant foundation for the entire platform. It implements subdomain-based routing, tenant resolution middleware, and base layouts. This scaffolding guarantees that all subsequent features inherit correct tenant isolation and shared styling.

## Tech Stack

- Next.js
- Convex
- TypeScript
- ShadCN UI
- TailwindCSS
- Authentication with Auth.js (formerly NextAuth.js)

## 🚀 Features

- **Multi-Tenant Architecture**: Subdomain and path-based tenant routing
- **Tenant Isolation**: Complete data and UI isolation between tenants
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript support with strict typing
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark Mode**: Built-in theme switching support
- **Logging System**: Structured logging with future observability support
- **Sidebar Navigation**: Collapsible sidebar with tenant-specific navigation
- **Authentication & Authorization**: Secure access control with Auth.js
- **Protected Routes**: HOC for route protection with role-based access control
- **User Management**: Invite and manage team members with different roles
- **Profile Management**: User profile settings and password management

## 🔐 Authentication System

The platform includes a comprehensive authentication and authorization system:

- **User Authentication**: Email/password and OAuth provider support
- **Role-Based Access Control**: Restrict access based on user roles
- **Tenant Isolation**: Users can only access their assigned tenants
- **Protected Routes**: Higher-order component for route protection
- **Auth Context**: Global auth state management with React Context
- **Convex Integration**: Secure backend access with Auth.js
- **User Invitations**: Invite team members to join your tenant
- **Session Management**: Secure session handling with automatic expiration
- **Profile Management**: User profile settings and password management

### Authentication Flow

1. User signs in via the login form or OAuth provider
2. Auth.js validates credentials and returns a token
3. Token is stored securely and used for API requests
4. Convex client is initialized with the auth token
5. Protected routes check for valid authentication before rendering
6. API calls include tenant ID to ensure data isolation

### Role-Based Access Control

The platform supports the following roles:

- **Admin**: Full access to all features and user management
- **Manager**: Access to team management and projects
- **User**: Basic access to dashboard and projects

Roles can be configured per tenant, allowing for flexible access control.

### User Management

Administrators can:

- Invite new users to join their tenant
- Assign roles to users
- Remove users from their tenant
- View user activity and last login time

### Security Features

- **Password Hashing**: Secure password storage with bcrypt
- **CSRF Protection**: Protection against cross-site request forgery
- **Session Expiration**: Automatic session expiration after inactivity
- **Rate Limiting**: Protection against brute force attacks
- **Error Handling**: Secure error handling to prevent information leakage

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Git
- Convex account

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

Then, set up your environment variables:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update the `.env.local` file with your configuration:
\`\`\`
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=your-convex-url
AUTH_SECRET=your-auth-secret
\`\`\`

Generate a secure AUTH_SECRET:

\`\`\`bash
npx auth secret
\`\`\`

Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Setting Up Authentication

1. Create a Convex account at [convex.dev](https://convex.dev)
2. Set up a new Convex project
3. Deploy the Convex schema:
   \`\`\`bash
   npx convex dev
   \`\`\`
4. Add your Convex URL to your environment variables
5. (Optional) Set up OAuth providers:
   - Create accounts with Google and GitHub
   - Set up OAuth applications
   - Configure the callback URLs
   - Add OAuth credentials to your environment variables

## 🔧 Configuration

### Adding New Tenants

1. Update the mock data in `lib/tenant-utils.ts`:
\`\`\`typescript
const mockTenants: Record<string, TenantConfig> = {
  "new-tenant": {
    id: "new-tenant",
    name: "New Tenant Inc",
    subdomain: "new-tenant",
    features: ["dashboard", "analytics", "projects"],
    // ... other config
  }
}
\`\`\`

2. In production, replace mock data with database queries.

### Customizing Authentication

You can customize the authentication system by:

1. Modifying the `auth.ts` configuration
2. Updating the Convex auth functions
3. Customizing the login and registration forms
4. Adding additional OAuth providers

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- AWS Amplify
- Netlify
- Railway
- Self-hosted with Docker

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APP_URL` | Base URL of your application | Yes |
| `NEXT_PUBLIC_CONVEX_URL` | Convex API URL | Yes |
| `AUTH_SECRET` | Secret key for Auth.js | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | For Google Auth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | For Google Auth |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | For GitHub Auth |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | For GitHub Auth |

## 🧪 Testing

Run type checking:
\`\`\`bash
npm run type-check
\`\`\`

Run linting:
\`\`\`bash
npm run lint
\`\`\`

Format code:
\`\`\`bash
npm run format
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Convex](https://convex.dev/) - Backend platform
- [Auth.js](https://authjs.dev/) - Authentication for the Web
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library
