# Digital Signature App

A modern, full-stack web application for creating, editing, and digitally signing PDF documents. Built with Next.js 15, React 19, TypeScript, and PostgreSQL.

## Features

- **Document Management**: Create, edit, and manage PDF documents
- **Digital Signatures**: Add professional digital signatures to documents
- **Rich Text Editor**: Edit document content with a modern WYSIWYG editor
- **PDF Generation**: Generate signed PDFs with embedded signatures
- **Real-time Preview**: Live preview of document changes
- **User Authentication**: Secure authentication with Better Auth
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **TanStack Query**: Data fetching and caching
- **React Hook Form**: Form state management
- **TipTap**: Rich text editor
- **PDF.js**: PDF rendering and manipulation

### Backend

- **Next.js API Routes**: Server-side API endpoints
- **Prisma ORM**: Database ORM with PostgreSQL
- **Better Auth**: Authentication solution
- **Supabase Storage**: File storage for PDFs

### Database

- **PostgreSQL**: Relational database
- **Prisma**: Type-safe database access

## Project Structure

```
digital-signature-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── dashboard/      # Dashboard home
│   │   │   ├── document/        # Document workflow
│   │   │   └── profile/        # User profile
│   │   └── api/               # API route handlers
│   │
│   ├── features/               # Feature-based modules
│   │   ├── auth/              # Authentication feature
│   │   │   ├── components/      # Auth components
│   │   │   ├── hooks/          # Auth hooks
│   │   │   ├── services.ts      # Auth API client
│   │   │   └── types.ts       # Auth types
│   │   │
│   │   ├── document/           # Document feature
│   │   │   ├── components/      # Document components
│   │   │   │   ├── dashboard/  # Dashboard components
│   │   │   │   ├── editor/     # Editor components
│   │   │   │   ├── pdf/        # PDF components
│   │   │   │   ├── step-*/     # Workflow step components
│   │   │   │   └── workflow/    # Workflow components
│   │   │   ├── hooks/          # Document hooks
│   │   │   ├── services.ts      # Document API client
│   │   │   └── types.ts       # Document types
│   │   │
│   │   ├── user/               # User feature
│   │   └── workflow/           # Workflow domain logic
│   │
│   ├── components/             # Shared components
│   │   ├── feedback/          # Loading, error, status components
│   │   ├── layout/            # Layout components
│   │   ├── navigation/        # Navigation components
│   │   └── ui/               # Shadcn/ui components
│   │
│   ├── lib/                   # Cross-cutting utilities
│   │   ├── api-client.ts      # Base API client
│   │   ├── constants.ts       # App constants
│   │   ├── helpers.ts         # Helper functions
│   │   ├── validators.ts      # Zod schemas
│   │   └── error-handler.ts   # Error handling
│   │
│   ├── hooks/                 # Global hooks
│   │   └── use-mobile.ts     # Mobile detection
│   │
│   └── server/                # Server-only code
│       ├── auth/              # Auth config
│       ├── db/                # Database client
│       ├── queries/           # Read operations
│       ├── mutations/         # Write operations
│       ├── services/          # Business logic
│       ├── storage/           # Storage operations
│       └── utils/            # Server utilities
│
├── public/                   # Static assets
├── docs/                    # Documentation
├── prisma/                  # Database schema and migrations
└── tests/                   # Test files
    ├── unit/                # Unit tests
    ├── integration/         # Integration tests
    └── e2e/                # End-to-end tests
```

## Architecture

### Feature-Based Architecture

The application follows a **feature-based architecture** pattern, where code is organized by business domain (features) rather than by technical layer. This approach provides:

- **Clear Boundaries**: Each feature is self-contained with its own components, hooks, services, and types
- **Easy Navigation**: Related code is grouped together
- **Better Scalability**: New features can be added without affecting existing ones
- **Team Collaboration**: Multiple developers can work on different features simultaneously

### Server-Client Separation

The application maintains clear separation between server-only and client code:

- **Server Code (`src/server/`)**: Database access, business logic, server utilities
- **Client Code (`src/features/`, `src/components/`)**: UI components, client-side logic
- **API Routes (`src/app/api/`)**: Bridge between client and server

### Key Patterns

1. **Vertical Slicing**: Each feature contains all related code (components, hooks, services, types)
2. **Service Layer**: Business logic is encapsulated in service functions
3. **React Query**: Data fetching with caching and optimistic updates
4. **Error Boundaries**: Graceful error handling at component boundaries
5. **Performance Optimization**: React.memo, useCallback, useMemo for expensive components

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Supabase account (for storage)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd digital-signature-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="..."
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Documentation

- [Overview](docs/00-overview.md) - Project overview
- [PRD](docs/01-prd.md) - Product requirements
- [Requirements](docs/02-requirements.md) - Technical requirements
- [Architecture](docs/03-architecture.md) - Detailed architecture
- [Database](docs/04-database.md) - Database schema
- [API](docs/05-api.md) - API endpoints
- [Testing](docs/07-testing.md) - Testing strategy
- [Library](docs/08-library.md) - Third-party libraries

## Development Workflow

### Adding a New Feature

1. Create feature directory: `src/features/your-feature/`
2. Add subdirectories: `components/`, `hooks/`, `services.ts`, `types.ts`
3. Implement components, hooks, and services
4. Create barrel export in `index.ts`
5. Add routes in `src/app/`
6. Update documentation

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Write JSDoc comments for complex functions
- Use absolute imports with `@/` alias
- Keep components small and focused

### Performance Guidelines

- Use `React.memo` for expensive components
- Use `useCallback` for event handlers
- Use `useMemo` for expensive calculations
- Implement code splitting with dynamic imports
- Add loading states and error boundaries

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
