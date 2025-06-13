# Financial Tracker API

A comprehensive RESTful API built with NestJS for managing personal finances, including income, expenses, savings, investments, and budgets. This API provides a complete financial management solution with advanced analytics and reporting capabilities.

## 🚀 Features

### Core Financial Management

- **Transaction Management**: Record and categorize income, expenses, and transfers
- **Account Management**: Support for multiple account types (checking, savings, investment, credit cards)
- **Category Management**: Flexible categorization system with default and custom categories
- **Budget Management**: Set and track budgets with period-based monitoring
- **Goal Management**: Financial goal setting and progress tracking

### Advanced Analytics

- **Financial Health Metrics**: Comprehensive scoring system (0-100) based on multiple factors
- **Expense Analysis**: Detailed breakdown with trends and category insights
- **Income Analysis**: Source tracking and monthly trend analysis
- **Budget Analysis**: Budget vs actual spending with alerts and recommendations
- **Dashboard API**: Single endpoint for complete financial overview

### Security & Authentication

- **JWT Authentication**: Secure token-based authentication
- **User Management**: Registration, login, and profile management
- **Authorization**: Role-based access control for all endpoints
- **Data Privacy**: User-specific data isolation

### Developer Experience

- **Swagger Documentation**: Interactive API documentation
- **TypeScript**: Full type safety and IntelliSense support
- **Validation**: Comprehensive input validation with class-validator
- **Error Handling**: Structured error responses
- **Database Migrations**: Automated schema management

## 📋 Table of Contents

- [Installation](#-installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Financial Calculations](#financial-calculations)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL or SQLite database

### Clone the Repository

```bash
git clone <repository-url>
cd financial-tracker-api
```

### Install Dependencies

```bash
npm install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=financial_tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# API Configuration
API_PREFIX=api/v1
```

### Database Configuration

The application supports both MySQL and SQLite databases. For development, SQLite is configured by default for simplicity.

#### MySQL Configuration (Production)

Update `src/app.module.ts` for MySQL:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'financial_tracker',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
}),
```

#### SQLite Configuration (Development)

Current configuration in `src/app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'financial_tracker.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
}),
```

## 🗄️ Database Setup

### Automatic Schema Creation

The application uses TypeORM with `synchronize: true` in development mode, which automatically creates database tables based on entity definitions.

### Seed Default Data

Run the seeder to populate default categories:

```bash
npm run seed
```

This will create:

- 15 default expense categories (Food & Dining, Transportation, etc.)
- 10 default income categories (Salary, Freelance, etc.)

## 🚀 Running the Application

### Development Mode

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode

```bash
npm run build
npm run start:prod
```

### Watch Mode

```bash
npm run start:dev
```

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

The Swagger interface provides:

- Complete endpoint documentation
- Request/response schemas
- Interactive testing capabilities
- Authentication setup
- Example requests and responses

### API Base URL

All API endpoints are prefixed with `/api/v1`:

```
http://localhost:3000/api/v1
```

## 🔐 Authentication

### Registration

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

### Using JWT Token

Include the JWT token in the Authorization header for protected endpoints:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔗 API Endpoints

### Authentication Endpoints

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/auth/register` | Register a new user      |
| POST   | `/auth/login`    | Login user               |
| GET    | `/auth/profile`  | Get current user profile |

### Category Endpoints

| Method | Endpoint              | Description                         |
| ------ | --------------------- | ----------------------------------- |
| POST   | `/categories`         | Create a new category               |
| GET    | `/categories`         | Get all categories for current user |
| GET    | `/categories/expense` | Get all expense categories          |
| GET    | `/categories/income`  | Get all income categories           |
| GET    | `/categories/{id}`    | Get category by ID                  |
| PATCH  | `/categories/{id}`    | Update a category                   |
| DELETE | `/categories/{id}`    | Delete a category                   |

### Account Endpoints

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| POST   | `/accounts`              | Create a new account   |
| GET    | `/accounts`              | Get all accounts       |
| GET    | `/accounts/summary`      | Get account summary    |
| GET    | `/accounts/net-worth`    | Get total net worth    |
| GET    | `/accounts/type/{type}`  | Get accounts by type   |
| GET    | `/accounts/{id}`         | Get account by ID      |
| PATCH  | `/accounts/{id}`         | Update an account      |
| DELETE | `/accounts/{id}`         | Delete an account      |
| PATCH  | `/accounts/{id}/balance` | Update account balance |

### Transaction Endpoints

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| POST   | `/transactions`         | Create a new transaction            |
| GET    | `/transactions`         | Get all transactions with filtering |
| GET    | `/transactions/summary` | Get transaction summary             |
| GET    | `/transactions/{id}`    | Get transaction by ID               |
| PATCH  | `/transactions/{id}`    | Update a transaction                |
| DELETE | `/transactions/{id}`    | Delete a transaction                |

### Budget Endpoints

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | `/budgets`         | Create a new budget |
| GET    | `/budgets`         | Get all budgets     |
| GET    | `/budgets/summary` | Get budget summary  |
| GET    | `/budgets/{id}`    | Get budget by ID    |
| PATCH  | `/budgets/{id}`    | Update a budget     |
| DELETE | `/budgets/{id}`    | Delete a budget     |

### Goal Endpoints

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| POST   | `/goals`               | Create a new goal    |
| GET    | `/goals`               | Get all goals        |
| GET    | `/goals/summary`       | Get goals summary    |
| GET    | `/goals/{id}`          | Get goal by ID       |
| PATCH  | `/goals/{id}`          | Update a goal        |
| DELETE | `/goals/{id}`          | Delete a goal        |
| PATCH  | `/goals/{id}/progress` | Update goal progress |

### Financial Analytics Endpoints

| Method | Endpoint                      | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| GET    | `/analytics/health-metrics`   | Get comprehensive financial health metrics |
| GET    | `/analytics/expense-analysis` | Get detailed expense analysis              |
| GET    | `/analytics/income-analysis`  | Get detailed income analysis               |
| GET    | `/analytics/budget-analysis`  | Get detailed budget analysis               |
| GET    | `/analytics/dashboard`        | Get comprehensive dashboard data           |

## 📊 Data Models

### User Entity

```typescript
{
  id: string;              // UUID
  firstName: string;       // User's first name
  lastName: string;        // User's last name
  email: string;          // Unique email address
  password: string;       // Hashed password
  dateOfBirth?: Date;     // Optional date of birth
  currency: string;       // Default currency (USD)
  timezone: string;       // User's timezone
  isActive: boolean;      // Account status
  createdAt: Date;        // Account creation date
  updatedAt: Date;        // Last update date
}
```

### Transaction Entity

```typescript
{
  id: string;              // UUID
  amount: number;          // Transaction amount (decimal)
  type: string;           // 'income', 'expense', 'transfer'
  date: Date;             // Transaction date
  description?: string;    // Optional description
  notes?: string;         // Optional notes
  location?: string;      // Optional location
  tags?: string[];        // Optional tags array
  isRecurring: boolean;   // Whether transaction repeats
  recurringPattern?: string; // Pattern for recurring transactions
  userId: string;         // Foreign key to User
  categoryId: string;     // Foreign key to Category
  accountId: string;      // Foreign key to Account
  toAccountId?: string;   // For transfer transactions
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Entity

```typescript
{
  id: string;              // UUID
  name: string;           // Category name
  description?: string;    // Optional description
  type: string;           // 'income' or 'expense'
  color?: string;         // Hex color code for UI
  icon?: string;          // Icon name or emoji
  isActive: boolean;      // Whether category is active
  isDefault: boolean;     // System default categories
  userId?: string;        // Foreign key to User (null for defaults)
  createdAt: Date;
  updatedAt: Date;
}
```

### Account Entity

```typescript
{
  id: string;              // UUID
  name: string;           // Account name
  type: string;           // 'checking', 'savings', 'investment', etc.
  balance: number;        // Current balance (decimal)
  initialBalance: number; // Starting balance
  currency: string;       // Account currency
  accountNumber?: string; // Optional account number
  bankName?: string;      // Optional bank name
  isActive: boolean;      // Whether account is active
  includeInNetWorth: boolean; // Include in net worth calculations
  userId: string;         // Foreign key to User
  createdAt: Date;
  updatedAt: Date;
}
```

### Budget Entity

```typescript
{
  id: string;              // UUID
  name: string;           // Budget name
  amount: number;         // Budget amount (decimal)
  period: string;         // 'weekly', 'monthly', 'quarterly', 'yearly'
  startDate: Date;        // Budget start date
  endDate: Date;          // Budget end date
  spent: number;          // Amount spent (calculated)
  remaining: number;      // Amount remaining (calculated)
  isActive: boolean;      // Whether budget is active
  isRecurring: boolean;   // Whether to create new budget for next period
  description?: string;    // Optional description
  alertThreshold?: number; // Percentage threshold for alerts
  alertEnabled: boolean;  // Whether alerts are enabled
  userId: string;         // Foreign key to User
  categoryId: string;     // Foreign key to Category
  createdAt: Date;
  updatedAt: Date;
}
```

### Goal Entity

```typescript
{
  id: string;              // UUID
  name: string;           // Goal name
  description?: string;    // Optional description
  type: string;           // 'savings', 'debt_payoff', 'investment', etc.
  targetAmount: number;   // Target amount (decimal)
  currentAmount: number;  // Current progress amount
  targetDate: Date;       // Target completion date
  startDate: Date;        // Goal start date
  status: string;         // 'active', 'completed', 'paused', 'cancelled'
  progressPercentage: number; // Calculated progress percentage
  monthlyContribution: number; // Suggested monthly contribution
  color?: string;         // Hex color code for UI
  icon?: string;          // Icon name or emoji
  isActive: boolean;      // Whether goal is active
  autoContribute: boolean; // Whether to automatically contribute
  linkedAccountId?: string; // Optional linked account for auto-contribution
  userId: string;         // Foreign key to User
  createdAt: Date;
  updatedAt: Date;
}
```

## 🧮 Financial Calculations

### Financial Health Score

The API calculates a comprehensive financial health score (0-100) based on multiple factors:

#### Scoring Components

1. **Savings Rate (25% weight)**

   - Formula: `(Total Income - Total Expenses) / Total Income * 100`
   - Excellent (90-100): >20% savings rate
   - Good (70-89): 10-20% savings rate
   - Fair (50-69): 5-10% savings rate
   - Poor (0-49): <5% savings rate

2. **Debt-to-Income Ratio (25% weight)**

   - Formula: `Total Debt Payments / Total Income * 100`
   - Excellent (90-100): <10% debt ratio
   - Good (70-89): 10-20% debt ratio
   - Fair (50-69): 20-30% debt ratio
   - Poor (0-49): >30% debt ratio

3. **Emergency Fund Ratio (20% weight)**

   - Formula: `Emergency Fund Balance / Monthly Expenses`
   - Excellent (90-100): >6 months of expenses
   - Good (70-89): 3-6 months of expenses
   - Fair (50-69): 1-3 months of expenses
   - Poor (0-49): <1 month of expenses

4. **Budget Utilization (15% weight)**

   - Formula: `Average Budget Adherence Across All Categories`
   - Excellent (90-100): 90-100% budget adherence
   - Good (70-89): 80-90% budget adherence
   - Fair (50-69): 70-80% budget adherence
   - Poor (0-49): <70% budget adherence

5. **Goal Progress (15% weight)**
   - Formula: `Average Progress Across All Active Goals`
   - Excellent (90-100): >80% average goal progress
   - Good (70-89): 60-80% average goal progress
   - Fair (50-69): 40-60% average goal progress
   - Poor (0-49): <40% average goal progress

### Expense Analysis

The API provides detailed expense analysis including:

- **Total Expenses**: Sum of all expense transactions
- **Average Monthly Expenses**: Total expenses divided by number of months
- **Top Categories**: Highest spending categories with amounts and percentages
- **Monthly Trends**: Month-over-month expense trends
- **Category Breakdown**: Detailed breakdown by category with visual percentages

### Income Analysis

Comprehensive income analysis features:

- **Total Income**: Sum of all income transactions
- **Average Monthly Income**: Total income divided by number of months
- **Income Sources**: Breakdown by income categories
- **Monthly Trends**: Month-over-month income trends
- **Growth Rate**: Income growth rate over time

### Budget Analysis

Advanced budget tracking and analysis:

- **Budget vs Actual**: Comparison of budgeted vs actual spending
- **Over Budget Categories**: Categories exceeding budget limits
- **Under Budget Categories**: Categories with remaining budget
- **Budget Utilization Rate**: Overall budget utilization percentage
- **Savings Opportunities**: Identification of potential savings areas

## 🔧 Advanced Features

### Transaction Filtering

The API supports advanced filtering for transactions:

```bash
GET /api/v1/transactions?type=expense&categoryId=uuid&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=10&sortBy=date&sortOrder=desc
```

Supported filters:

- `type`: Filter by transaction type (income, expense, transfer)
- `categoryId`: Filter by specific category
- `accountId`: Filter by specific account
- `startDate`: Filter transactions from date
- `endDate`: Filter transactions to date
- `minAmount`: Minimum transaction amount
- `maxAmount`: Maximum transaction amount
- `search`: Search in description and notes
- `page`: Page number for pagination
- `limit`: Number of results per page
- `sortBy`: Sort field (date, amount, description)
- `sortOrder`: Sort order (asc, desc)

### Recurring Transactions

Support for recurring transactions with patterns:

- Daily, Weekly, Monthly, Quarterly, Yearly
- Custom patterns with specific intervals
- Automatic transaction creation based on patterns

### Multi-Currency Support

The API is designed to support multiple currencies:

- User-level default currency setting
- Account-level currency specification
- Currency conversion capabilities (requires external service integration)

### Data Export

Export financial data in various formats:

- CSV export for transactions, budgets, and goals
- PDF reports for financial summaries
- JSON export for data migration

## 🚀 Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=3306
      - DB_USERNAME=root
      - DB_PASSWORD=password
      - DB_DATABASE=financial_tracker
      - JWT_SECRET=your-production-jwt-secret
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=financial_tracker
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - '3306:3306'

volumes:
  mysql_data:
```

### Cloud Deployment

#### Heroku Deployment

1. Install Heroku CLI
2. Create a new Heroku app:

   ```bash
   heroku create financial-tracker-api
   ```

3. Set environment variables:

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-production-jwt-secret
   ```

4. Add MySQL addon:

   ```bash
   heroku addons:create cleardb:ignite
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

#### AWS Deployment

Deploy using AWS Elastic Beanstalk:

1. Install EB CLI
2. Initialize EB application:

   ```bash
   eb init
   ```

3. Create environment:

   ```bash
   eb create production
   ```

4. Set environment variables in AWS console
5. Deploy:
   ```bash
   eb deploy
   ```

### Environment-Specific Configuration

#### Production Environment

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USERNAME=your-db-username
DB_PASSWORD=your-secure-db-password
DB_DATABASE=financial_tracker
JWT_SECRET=your-very-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
```

#### Staging Environment

```env
NODE_ENV=staging
PORT=3000
DB_HOST=your-staging-db-host
DB_PORT=3306
DB_USERNAME=staging_user
DB_PASSWORD=staging_password
DB_DATABASE=financial_tracker_staging
JWT_SECRET=your-staging-jwt-secret
JWT_EXPIRES_IN=1d
```

## 🧪 Testing

### Unit Tests

Run unit tests:

```bash
npm run test
```

### Integration Tests

Run integration tests:

```bash
npm run test:e2e
```

### Test Coverage

Generate test coverage report:

```bash
npm run test:cov
```

### API Testing with Postman

Import the Postman collection for comprehensive API testing:

1. Export OpenAPI specification from Swagger UI
2. Import into Postman
3. Set up environment variables for authentication
4. Run automated test suites

## 📈 Performance Optimization

### Database Optimization

- **Indexing**: Strategic indexes on frequently queried fields
- **Query Optimization**: Efficient queries with proper joins
- **Connection Pooling**: Optimized database connection management
- **Caching**: Redis caching for frequently accessed data

### API Performance

- **Pagination**: Efficient pagination for large datasets
- **Filtering**: Server-side filtering to reduce data transfer
- **Compression**: GZIP compression for API responses
- **Rate Limiting**: Protection against API abuse

## 🔒 Security Best Practices

### Authentication Security

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Token Expiration**: Configurable token expiration times
- **Refresh Tokens**: Secure token refresh mechanism

### Data Security

- **Input Validation**: Comprehensive input validation and sanitization
- **SQL Injection Protection**: TypeORM query builder protection
- **XSS Protection**: Cross-site scripting prevention
- **CORS Configuration**: Proper cross-origin resource sharing setup

### API Security

- **Rate Limiting**: Request rate limiting to prevent abuse
- **HTTPS Only**: Force HTTPS in production environments
- **Security Headers**: Proper security headers configuration
- **Error Handling**: Secure error messages without sensitive information

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/your-username/financial-tracker-api.git
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Make your changes and commit:

   ```bash
   git commit -m "Add your feature description"
   ```

6. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Document all public APIs with JSDoc comments

### Commit Guidelines

Follow conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or updates
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [API Documentation](http://localhost:3000/api/docs) - Interactive Swagger documentation
- [GitHub Issues](https://github.com/your-repo/issues) - Bug reports and feature requests

### Community

- [Discord Server](https://discord.gg/your-server) - Community discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/financial-tracker-api) - Technical questions

### Professional Support

For enterprise support and custom development:

- Email: support@your-domain.com
- Website: https://your-website.com

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeORM](https://typeorm.io/) - Object-relational mapping
- [Swagger](https://swagger.io/) - API documentation
- [JWT](https://jwt.io/) - JSON Web Tokens
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing

---

### Built with ❤️ by Obinna Franklin Duru
