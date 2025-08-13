# User API Service

A simple Node.js REST API for user management with a complete CI/CD pipeline using GitHub Actions.

## 🚀 Features

- **CRUD Operations**: Create, Read, Update, Delete users
- **Health Check**: Monitor application status
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Centralized error management
- **Testing**: Unit and integration tests with Jest
- **Linting**: ESLint for code quality
- **Security**: Helmet.js for security headers
- **CI/CD**: Complete GitHub Actions pipeline

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Application health status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID  
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🛠️ Local Development

### Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher

### Setup
```bash
# Clone repository
git clone <repository-url>
cd user-api-service

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

## 🐳 Docker

```bash
# Build image
docker build -t user-api .

# Run container
docker run -p 3000:3000 user-api

# Check health
curl http://localhost:3000/api/health
```

## 🔄 CI/CD Pipeline

### Branching Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### Workflows

#### 1. CI Pipeline (`.github/workflows/ci.yml`)
**Triggers**: Push to main/develop, Pull requests
- **Test Matrix**: Node.js 18.x and 20.x
- **Steps**:
  - Code checkout
  - Dependency installation
  - Linting
  - Unit tests with coverage
  - Security scanning
  - Build artifacts

#### 2. CD Pipeline (`.github/workflows/cd.yml`)
**Triggers**: Push to main (staging), Releases (production)
- **Staging Deployment**:
  - Automated deployment to staging
  - Smoke tests
  - Team notifications
- **Production Deployment**:
  - Manual approval required
  - Full test suite
  - Docker image creation
  - Production deployment
  - Health checks

#### 3. PR Checks (`.github/workflows/pr-checks.yml`)
**Triggers**: Pull request events
- **Validation**:
  - Code quality checks
  - Test coverage analysis
  - Compatibility testing
  - Bundle size analysis
  - Auto-reviewer assignment

### Environments
- **Staging**: `staging` environment with manual approval
- **Production**: `production` environment with manual approval

## 📊 Code Quality

- **Coverage Threshold**: 80% minimum
- **Linting**: ESLint with recommended rules
- **Security**: npm audit + Snyk scanning
- **Node.js Compatibility**: Supports 16.x, 18.x, 20.x

## 🔐 Security

- Helmet.js for security headers
- Input validation and sanitization
- Dependency vulnerability scanning
- Regular security audits in CI

## 📝 Example Usage

```javascript
// Create user
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});

// Get all users
const users = await fetch('/api/users').then(r => r.json());

// Health check
const health = await fetch('/api/health').then(r => r.json());
```

## 🤝 Contributing

1. Create feature branch from `develop`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Create pull request to `develop`
6. Wait for CI checks and review
7. Merge after approval

## 📈 Monitoring

- Health endpoint: `/api/health`
- Application logs via console
- Performance metrics (implement APM in production)
- Error tracking (implement error reporting)

## 🚀 Deployment Process

### Development to Staging
1. Merge feature branch to `develop`
2. Create PR from `develop` to `main`
3. After approval, merge triggers staging deployment
4. Automatic smoke tests run
5. Team gets notified of deployment

### Staging to Production
1. Create release from `main` branch
2. Tag with semantic version (e.g., v1.0.0)
3. Release creation triggers production deployment
4. Manual approval required for production
5. Full test suite runs before deployment
6. Health checks verify successful deployment

## 🏗️ Architecture

```
src/
├── app.js           # Main application entry point
└── routes/
    ├── users.js     # User CRUD operations
    └── health.js    # Health check endpoint

tests/
└── api.test.js      # API integration tests

.github/workflows/
├── ci.yml           # Continuous Integration
├── cd.yml           # Continuous Deployment  
└── pr-checks.yml    # Pull Request validation
```

## 📦 Dependencies

### Production
- express: Web framework
- cors: CORS middleware
- helmet: Security middleware
- dotenv: Environment variables
- uuid: UUID generation

### Development
- jest: Testing framework
- supertest: HTTP testing
- eslint: Code linting
- nodemon: Development server

## 🔧 Environment Variables

```bash
NODE_ENV=development
PORT=3000
```

## 📋 TODO / Roadmap

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Authentication & Authorization
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Logging with Winston
- [ ] Caching with Redis
- [ ] Kubernetes deployment manifests
- [ ] Performance monitoring

## 📄 License

MIT License - see LICENSE file for details# simple-CI-CD-setup
