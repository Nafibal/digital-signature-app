# Digital Signature App

A modern, full-stack web application for creating, editing, and digitally signing PDF documents. Built with Next.js 15.5, React 19, TypeScript, and PostgreSQL.

## Features

- **Document Management**: Create documents from blank templates or upload existing PDFs
- **Digital Signatures**: Add professional digital signatures with drag-and-drop placement
- **Rich Text Editor**: Edit document content with TipTap editor (for blank documents)
- **PDF Generation**: Generate signed PDFs with embedded signatures using pdf-lib
- **Real-time Preview**: Live PDF preview using PDF.js
- **User Authentication**: Secure authentication with Better Auth
- **Four-Step Workflow**: Guided workflow for document preparation, review, and signing
- **Supabase Storage**: Secure file storage for PDFs and signature images
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend

- **Next.js 15.5**: React framework with App Router
- **React 19.1**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **TanStack Query 5**: Data fetching and caching
- **React Hook Form 7**: Form state management
- **TipTap 3**: Rich text editor
- **PDF.js 5**: PDF rendering and preview
- **Lucide React**: Icon library

### Backend

- **Next.js API Routes**: Server-side API endpoints
- **Prisma ORM 7**: Database ORM with PostgreSQL
- **Better Auth 1.4**: Authentication solution
- **Supabase Storage**: File storage for PDFs and signatures
- **pdf-lib**: PDF manipulation and signature embedding

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
│   │       ├── auth/          # Auth endpoints
│   │       ├── documents/     # Document endpoints
│   │       ├── upload/        # File upload
│   │       └── render-pdf/    # PDF rendering
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
│   │   │   │   ├── editor/     # TipTap editor components
│   │   │   │   ├── pdf/        # PDF preview components
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
│   │   ├── navigation/        # Navigation components (sidebar, header)
│   │   └── ui/               # Shadcn/ui components
│   │
│   ├── lib/                   # Cross-cutting utilities
│   │   ├── api-client.ts      # Base API client
│   │   ├── constants.ts       # App constants
│   │   ├── helpers.ts         # Helper functions
│   │   ├── validators.ts      # Zod schemas
│   │   ├── pdfjs.ts           # PDF.js configuration
│   │   ├── query-client.tsx    # TanStack Query setup
│   │   └── actions/           # Server actions
│   │
│   ├── hooks/                 # Global hooks
│   │   └── use-mobile.ts     # Mobile detection
│   │
│   └── server/                # Server-only code
│       ├── auth/              # Better Auth config
│       ├── db/                # Prisma client
│       ├── queries/           # Read operations
│       ├── mutations/         # Write operations
│       ├── services/          # Business logic (document, PDF, signature)
│       ├── storage/           # Supabase storage operations
│       └── utils/            # Server utilities
│
├── public/                   # Static assets
│   └── pdfjs/              # PDF.js library files
├── docs/                    # Documentation
├── prisma/                  # Database schema and migrations
└── tests/                   # Test files
    ├── unit/                # Unit tests
    ├── integration/         # Integration tests
    └── e2e/                # End-to-end tests (Playwright)
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
- Supabase account (for database and storage)
- PostgreSQL database (via Supabase)

### Supabase Setup

Follow these steps to set up your Supabase project for the Digital Signature App.

#### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in or create an account
2. Click **"New Project"**
3. Configure your project:
   - **Organization**: Select or create an organization
   - **Name**: Enter a project name (e.g., `digital-signature-app`)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose a region closest to your users
   - **Pricing Plan**: Select a plan (Free tier is sufficient for development)
4. Click **"Create new project"** and wait for the project to initialize (2-3 minutes)

#### 2. Get Database Connection Strings

Once your project is ready:

1. Navigate to **Project Settings** → **Database**
2. Scroll to **Connection String** section
3. Copy the **Connection pooling** connection string (for `DATABASE_URL`)
4. Copy the **Direct connection** connection string (for `DIRECT_URL`)

Replace `[YOUR-PASSWORD]` in both connection strings with your database password.

#### 3. Set Up Storage Buckets

The application requires two storage buckets for storing PDF documents and signature images.

##### Create the Documents Bucket

1. Navigate to **Storage** in your Supabase dashboard
2. Click **"New bucket"**
3. Configure the bucket:
   - **Name**: `documents`
   - **Public bucket**: Check
   - **File size limit**: Set to `10485760` (10MB) or leave empty for unlimited
4. Click **"Create bucket"**

##### Create the Signatures Bucket

1. Click **"New bucket"** again
2. Configure the bucket:
   - **Name**: `signatures`
   - **Public bucket**: Check
   - **File size limit**: Set to `5242880` (5MB) or leave empty
3. Click **"Create bucket"**

#### 4. Configure Storage Security (RLS Policies)

To ensure users can only access their own files, set up Row Level Security (RLS) policies.

##### Documents Bucket Policies

1. Navigate to **Storage** → **documents** → **Policies**
2. Click **"New policy"** → **"Get started quickly"**
3. Select **"Custom policy"**
4. Add the following policies:

**Policy 1: Allow authenticated users to upload documents**

```sql
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2: Allow users to view their own documents**

```sql
CREATE POLICY "Allow users to view their own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Allow users to delete their own documents**

```sql
CREATE POLICY "Allow users to delete their own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

##### Signatures Bucket Policies

1. Navigate to **Storage** → **signatures** → **Policies**
2. Add similar policies for the signatures bucket:

**Policy 1: Allow authenticated users to upload signatures**

```sql
CREATE POLICY "Allow authenticated users to upload signatures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'signatures'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2: Allow users to view their own signatures**

```sql
CREATE POLICY "Allow users to view their own signatures"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'signatures'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Allow users to delete their own signatures**

```sql
CREATE POLICY "Allow users to delete their own signatures"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'signatures'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### 5. Get Supabase API Credentials

1. Navigate to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 6. Configure Environment Variables

1. Create a `.env` file in your project root:

```bash
cp .env.example .env
```

2. Edit `.env` with your Supabase credentials:

```env
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-generate-a-random-string
BETTER_AUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-api-settings
```

**Important**: Replace the placeholders with your actual values:

- `[YOUR-PASSWORD]`: Your database password from step 2
- `[PROJECT-REF]`: Your project reference (found in your Supabase project URL)
- `your-secret-key-generate-a-random-string`: Generate a secure random string (you can use: `openssl rand -base64 32`)
- `your-anon-key-from-api-settings`: The anon public key from step 5

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

3. Set up environment variables (see Supabase Setup section above)

4. Run database migrations:

```bash
npx prisma migrate dev
```

This will create all the necessary tables in your Supabase database:

- `users`, `sessions`, `accounts`, `verifications` (authentication)
- `documents`, `document_contents`, `document_pdfs` (document management)
- `signatures` (digital signatures)

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Storage Structure

After setup, your Supabase Storage will be organized as follows:

```
documents/                    # PDF documents bucket
  └── {userId}/              # User-specific folders
      ├── 1234567890-abc-document.pdf
      └── 1234567891-xyz-contract.pdf

signatures/                  # Signature images bucket
  └── {userId}/              # User-specific folders
      ├── 1234567890-signature.png
      └── 1234567891-initials.png
```

Each user's files are stored in their own folder (`{userId}`), ensuring proper isolation and security through RLS policies.

## Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing

- `npm test` - Run all tests with Vitest
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run integration tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run Playwright tests with UI
- `npm run test:e2e:debug` - Debug Playwright tests
- `npm run test:e2e:headed` - Run Playwright tests in headed mode

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

### Environment Variables

Required environment variables for production:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

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
