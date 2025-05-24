# Project Alpha - Multi-Tenant Platform

This project establishes the multi-tenant foundation for the entire platform. It implements subdomain-based routing, tenant resolution middleware, and base layouts. This scaffolding guarantees that all subsequent features inherit correct tenant isolation and shared styling.

## Tech Stack

- Next.js
- Convex
- TypeScript
- ShadCN UI
- TailwindCSS

## 🚀 Features

- **Multi-Tenant Architecture**: Subdomain and path-based tenant routing
- **Tenant Isolation**: Complete data and UI isolation between tenants
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript support with strict typing
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark Mode**: Built-in theme switching support
- **Logging System**: Structured logging with future observability support
- **Sidebar Navigation**: Collapsible sidebar with tenant-specific navigation

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Git

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-org/project-alpha.git
cd project-alpha
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Update the `.env.local` file with your configuration:
\`\`\`
NEXT_PUBLIC_APP_URL=http://localhost:3000
CONVEX_DEPLOYMENT=your-convex-deployment
CONVEX_URL=your-convex-url
\`\`\`

4. Install shadcn/ui components:
\`\`\`bash
npx shadcn@latest init
npx shadcn@latest add button card dropdown-menu input label separator sidebar skeleton tabs tooltip
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

## Multi-Tenant Architecture

The platform supports multi-tenancy through:

1. **Subdomain Routing**: Access tenants via `tenant.example.com`
2. **Path-Based Routing**: Access tenants via `example.com/tenant`
3. **Middleware**: Extracts tenant information and injects it into requests
4. **Context API**: Provides tenant information to components

## 🏗️ Project Structure

\`\`\`
project-alpha/
├── app/
│   ├── middleware.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── global-components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Loading.tsx
│   └── [tenant]/
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   └── TenantLayout.tsx
├── lib/
│   ├── tenantContext.ts
│   └── logger.ts
├── public/
│   └── favicon.ico
├── next.config.js
├── tsconfig.json
└── README.md
\`\`\`

## 🌐 Multi-Tenant Setup

### Local Development

To test multi-tenant functionality locally, you have two options:

#### Option 1: Path-based routing (Recommended for development)
Access tenants via paths:
- http://localhost:3000/demo
- http://localhost:3000/acme

#### Option 2: Subdomain routing
1. Add entries to your hosts file:
   - Mac/Linux: `/etc/hosts`
   - Windows: `C:\Windows\System32\drivers\etc\hosts`

\`\`\`
127.0.0.1 demo.localhost
127.0.0.1 acme.localhost
\`\`\`

2. Access tenants via subdomains:
   - http://demo.localhost:3000
   - http://acme.localhost:3000

### Production Deployment

In production, configure your DNS to point wildcard subdomains to your application:
\`\`\`
*.yourdomain.com → your-app-server
\`\`\`

## Testing Tenants

To test different tenants locally:

1. Add entries to your hosts file:
   \`\`\`
   127.0.0.1 tenant1.localhost
   127.0.0.1 tenant2.localhost
   \`\`\`

2. Access the tenants via:
   - http://tenant1.localhost:3000
   - http://tenant2.localhost:3000

Alternatively, you can use path-based routing:
   - http://localhost:3000/tenant1
   - http://localhost:3000/tenant2

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

### Customizing Tenant Features

Control feature access per tenant in `tenant-utils.ts`:
\`\`\`typescript
features: ["dashboard", "analytics", "projects", "team", "settings", "api"]
\`\`\`

### Tenant Branding

Customize tenant appearance:
\`\`\`typescript
branding: {
  primaryColor: "#3b82f6",
  logo: "/logos/tenant-logo.png",
  favicon: "/favicons/tenant-favicon.ico"
}
\`\`\`

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
| `CONVEX_DEPLOYMENT` | Convex deployment identifier | Yes |
| `CONVEX_URL` | Convex API URL | Yes |

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
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library
\`\`\`

Let's create environment example file:
