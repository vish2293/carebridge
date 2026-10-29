# Community Care Monorepo

This is an Nx monorepo workspace containing three applications:

- **frontend** - React application (port 3000)
- **admin** - React application (port 3001)
- **backend** - Express API server (port 5000)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run all apps in development mode:
```bash
npm run dev
```

Run specific apps:
```bash
npm run dev:frontend
npm run dev:admin
npm run dev:backend
```

### Build

Build all apps:
```bash
npm run build
```

Build specific app:
```bash
npm run build:frontend
npm run build:admin
npm run build:backend
```

### Testing

Run tests for all apps:
```bash
npm test
```

### Linting

Lint all apps:
```bash
npm run lint
```

### Affected Commands

Build only affected apps (changed since last commit):
```bash
npm run affected:build
```

Test only affected apps:
```bash
npm run affected:test
```

### Visualize Dependencies

View the dependency graph:
```bash
npm run graph
```

## Project Structure

```
community-care-mono/
├── packages/
│   ├── frontend/     # React app
│   ├── admin/        # React app
│   └── backend/      # Express API
├── package.json
└── nx.json
```

## Available Commands

- `nx dev <project>` - Run project in development mode
- `nx build <project>` - Build project
- `nx test <project>` - Run tests
- `nx lint <project>` - Lint project
- `nx show projects` - List all projects
- `nx show project <project>` - Show project details
