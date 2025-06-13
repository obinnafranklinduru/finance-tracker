# Financial Tracker API - Usage Guide

This guide provides practical examples of how to use the Financial Tracker API endpoints with real-world scenarios.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication Flow](#authentication-flow)
3. [Managing Categories](#managing-categories)
4. [Managing Accounts](#managing-accounts)
5. [Recording Transactions](#recording-transactions)
6. [Budget Management](#budget-management)
7. [Goal Tracking](#goal-tracking)
8. [Financial Analytics](#financial-analytics)
9. [Common Use Cases](#common-use-cases)
10. [Error Handling](#error-handling)

## Getting Started

### Base URL

```bash
  http://localhost:3000/api/v1
```

### Required Headers

```bash
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

## Authentication Flow

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "currency": "USD",
    "timezone": "UTC",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA1MzE0NjAwLCJleHAiOjE3MDU5MTk0MDB9.example-signature",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

### 3. Get User Profile

```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Managing Categories

### 1. Get All Categories

```bash
curl -X GET http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer <your-token>"
```

**Response:**

```json
[
  {
    "id": "cat-001",
    "name": "Food & Dining",
    "type": "expense",
    "icon": "🍽️",
    "color": "#FF6B6B",
    "description": "Restaurants, groceries, and food delivery",
    "isDefault": true,
    "isActive": true
  },
  {
    "id": "cat-002",
    "name": "Salary",
    "type": "income",
    "icon": "💰",
    "color": "#58D68D",
    "description": "Regular employment income",
    "isDefault": true,
    "isActive": true
  }
]
```

### 2. Create Custom Category

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cryptocurrency",
    "type": "income",
    "icon": "₿",
    "color": "#F7931A",
    "description": "Income from cryptocurrency trading"
  }'
```

### 3. Get Expense Categories Only

```bash
curl -X GET http://localhost:3000/api/v1/categories/expense \
  -H "Authorization: Bearer <your-token>"
```

## Managing Accounts

### 1. Create a Checking Account

```bash
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chase Checking",
    "type": "checking",
    "initialBalance": 5000.00,
    "currency": "USD",
    "bankName": "Chase Bank",
    "accountNumber": "****1234"
  }'
```

**Response:**

```json
{
  "id": "acc-001",
  "name": "Chase Checking",
  "type": "checking",
  "balance": 5000.0,
  "initialBalance": 5000.0,
  "currency": "USD",
  "bankName": "Chase Bank",
  "accountNumber": "****1234",
  "isActive": true,
  "includeInNetWorth": true,
  "createdAt": "2024-01-15T10:35:00.000Z"
}
```

### 2. Create a Savings Account

```bash
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Fund",
    "type": "savings",
    "initialBalance": 10000.00,
    "currency": "USD",
    "bankName": "Ally Bank"
  }'
```

### 3. Get Account Summary

```bash
curl -X GET http://localhost:3000/api/v1/accounts/summary \
  -H "Authorization: Bearer <your-token>"
```

**Response:**

```json
{
  "totalAccounts": 2,
  "totalBalance": 15000.0,
  "accountsByType": {
    "checking": {
      "count": 1,
      "totalBalance": 5000.0
    },
    "savings": {
      "count": 1,
      "totalBalance": 10000.0
    }
  },
  "netWorth": 15000.0
}
```

### 4. Get Net Worth

```bash
curl -X GET http://localhost:3000/api/v1/accounts/net-worth \
  -H "Authorization: Bearer <your-token>"
```

## Recording Transactions

### 1. Record an Expense Transaction

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 45.50,
    "type": "expense",
    "date": "2024-01-15",
    "description": "Lunch at Italian Restaurant",
    "notes": "Business lunch with client",
    "location": "Downtown",
    "categoryId": "cat-001",
    "accountId": "acc-001",
    "tags": ["business", "lunch"]
  }'
```

**Response:**

```json
{
  "id": "txn-001",
  "amount": 45.5,
  "type": "expense",
  "date": "2024-01-15T00:00:00.000Z",
  "description": "Lunch at Italian Restaurant",
  "notes": "Business lunch with client",
  "location": "Downtown",
  "tags": ["business", "lunch"],
  "categoryId": "cat-001",
  "accountId": "acc-001",
  "isRecurring": false,
  "createdAt": "2024-01-15T10:40:00.000Z"
}
```

### 2. Record an Income Transaction

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000.00,
    "type": "income",
    "date": "2024-01-15",
    "description": "Monthly Salary",
    "categoryId": "cat-002",
    "accountId": "acc-001"
  }'
```

### 3. Record a Transfer Between Accounts

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000.00,
    "type": "transfer",
    "date": "2024-01-15",
    "description": "Transfer to Emergency Fund",
    "accountId": "acc-001",
    "toAccountId": "acc-002"
  }'
```

### 4. Get Transactions with Filtering

```bash
curl -X GET "http://localhost:3000/api/v1/transactions?type=expense&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10&sortBy=date&sortOrder=desc" \
  -H "Authorization: Bearer <your-token>"
```

**Response:**

```json
{
  "data": [
    {
      "id": "txn-001",
      "amount": 45.5,
      "type": "expense",
      "date": "2024-01-15T00:00:00.000Z",
      "description": "Lunch at Italian Restaurant",
      "category": {
        "id": "cat-001",
        "name": "Food & Dining",
        "icon": "🍽️"
      },
      "account": {
        "id": "acc-001",
        "name": "Chase Checking"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 5. Get Transaction Summary

```bash
curl -X GET "http://localhost:3000/api/v1/transactions/summary?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <your-token>"
```

**Response:**

```json
{
  "totalIncome": 5000.0,
  "totalExpenses": 45.5,
  "netIncome": 4954.5,
  "transactionCount": 2,
  "averageTransaction": 2522.75,
  "byCategory": {
    "cat-001": {
      "name": "Food & Dining",
      "amount": 45.5,
      "count": 1,
      "percentage": 0.91
    },
    "cat-002": {
      "name": "Salary",
      "amount": 5000.0,
      "count": 1,
      "percentage": 99.09
    }
  },
  "byAccount": {
    "acc-001": {
      "name": "Chase Checking",
      "amount": 4954.5,
      "count": 2
    }
  }
}
```

## Budget Management

### 1. Create a Monthly Budget

```bash
curl -X POST http://localhost:3000/api/v1/budgets \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food & Dining Budget",
    "amount": 500.00,
    "period": "monthly",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "categoryId": "cat-001",
    "alertThreshold": 80,
    "alertEnabled": true,
    "isRecurring": true
  }'
```

**Response:**

```json
{
  "id": "budget-001",
  "name": "Food & Dining Budget",
  "amount": 500.0,
  "period": "monthly",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z",
  "spent": 0.0,
  "remaining": 500.0,
  "isActive": true,
  "isRecurring": true,
  "alertThreshold": 80,
  "alertEnabled": true,
  "categoryId": "cat-001",
  "createdAt": "2024-01-15T10:45:00.000Z"
}
```

### 2. Get Budget Summary

```bash
curl -X GET http://localhost:3000/api/v1/budgets/summary \
  -H "Authorization: Bearer <your-token>"
```

**Response:**

```json
{
  "totalBudgets": 1,
  "totalBudgeted": 500.0,
  "totalSpent": 45.5,
  "totalRemaining": 454.5,
  "utilizationRate": 9.1,
  "budgetsOverLimit": 0,
  "budgetsNearLimit": 0,
  "activeBudgets": 1
}
```

## Goal Tracking

### 1. Create a Savings Goal

```bash
curl -X POST http://localhost:3000/api/v1/goals \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Fund",
    "description": "Build 6 months of expenses as emergency fund",
    "type": "emergency_fund",
    "targetAmount": 30000.00,
    "currentAmount": 10000.00,
    "targetDate": "2024-12-31",
    "startDate": "2024-01-01",
    "monthlyContribution": 1667.00,
    "linkedAccountId": "acc-002",
    "autoContribute": true,
    "color": "#FF6B6B",
    "icon": "🛡️"
  }'
```

**Response:**

```json
{
  "id": "goal-001",
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses as emergency fund",
  "type": "emergency_fund",
  "targetAmount": 30000.0,
  "currentAmount": 10000.0,
  "targetDate": "2024-12-31T00:00:00.000Z",
  "startDate": "2024-01-01T00:00:00.000Z",
  "status": "active",
  "progressPercentage": 33.33,
  "monthlyContribution": 1667.0,
  "linkedAccountId": "acc-002",
  "autoContribute": true,
  "color": "#FF6B6B",
  "icon": "🛡️",
  "isActive": true,
  "createdAt": "2024-01-15T10:50:00.000Z"
}
```

### 2. Update Goal Progress

```bash
curl -X PATCH http://localhost:3000/api/v1/goals/goal-001/progress \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1500.00,
    "note": "Monthly contribution for January"
  }'
```

**Response:**

```json
{
  "id": "goal-001",
  "name": "Emergency Fund",
  "currentAmount": 11500.0,
  "progressPercentage": 38.33,
  "remainingAmount": 18500.0,
  "updatedAt": "2024-01-15T10:55:00.000Z"
}
```

### 3. Get Goals Summary

```bash
curl -X GET http://localhost:3000/api/v1/goals/summary \
  -H "Authorization: Bearer <your-token>"
```

**Response:**

```json
{
  "totalGoals": 1,
  "activeGoals": 1,
  "completedGoals": 0,
  "totalTargetAmount": 30000.0,
  "totalCurrentAmount": 11500.0,
  "overallProgress": 38.33,
  "totalRemainingAmount": 18500.0,
  "averageProgress": 38.33,
  "goalsOnTrack": 1,
  "goalsBehindSchedule": 0
}
```

## Financial Analytics

### 1. Get Financial Health Metrics

```bash
curl -X GET http://localhost:3000/api/v1/analytics/health-metrics \
  -H "Authorization: Bearer <your-token>"
```

**Response:**

```json
{
  "overallScore": 78,
  "scoreBreakdown": {
    "savingsRate": {
      "score": 85,
      "value": 15.2,
      "weight": 25,
      "description": "Excellent savings rate"
    },
    "debtToIncomeRatio": {
      "score": 90,
      "value": 5.0,
      "weight": 25,
      "description": "Low debt burden"
    },
    "emergencyFundRatio": {
      "score": 65,
      "value": 2.3,
      "weight": 20,
      "description": "Building emergency fund"
    },
    "budgetUtilization": {
      "score": 80,
      "value": 85.0,
      "weight": 15,
      "description": "Good budget adherence"
    },
    "goalProgress": {
      "score": 70,
      "value": 38.33,
      "weight": 15,
      "description": "Making progress on goals"
    }
  },
  "recommendations": [
    "Continue building your emergency fund to reach 6 months of expenses",
    "Consider increasing your monthly savings rate",
    "You're doing well with budget adherence - keep it up!"
  ]
}
```

### 2. Get Expense Analysis

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/expense-analysis?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <your-token>"
```

**Response:**

```json
{
  "totalExpenses": 1250.75,
  "averageMonthly": 1250.75,
  "topCategories": [
    {
      "categoryId": "cat-001",
      "categoryName": "Food & Dining",
      "amount": 450.25,
      "percentage": 36.0,
      "transactionCount": 15
    },
    {
      "categoryId": "cat-003",
      "categoryName": "Transportation",
      "amount": 300.5,
      "percentage": 24.0,
      "transactionCount": 8
    }
  ],
  "monthlyTrend": [
    {
      "month": "2024-01",
      "amount": 1250.75
    }
  ],
  "insights": [
    "Food & Dining is your largest expense category",
    "Transportation costs are significant - consider carpooling or public transit"
  ]
}
```

### 3. Get Comprehensive Dashboard

```bash
curl -X GET http://localhost:3000/api/v1/analytics/dashboard \
  -H "Authorization: Bearer <your-token>"
```

**Response:**

```json
{
  "financialHealth": {
    "overallScore": 78,
    "trend": "improving"
  },
  "accountSummary": {
    "totalBalance": 14749.25,
    "netWorth": 14749.25,
    "accountCount": 2
  },
  "monthlyOverview": {
    "income": 5000.0,
    "expenses": 1250.75,
    "netIncome": 3749.25,
    "savingsRate": 74.98
  },
  "budgetOverview": {
    "totalBudgeted": 1500.0,
    "totalSpent": 1250.75,
    "utilizationRate": 83.38,
    "budgetsOverLimit": 0
  },
  "goalProgress": {
    "activeGoals": 1,
    "averageProgress": 38.33,
    "totalTargetAmount": 30000.0,
    "totalCurrentAmount": 11500.0
  },
  "recentTransactions": [
    {
      "id": "txn-001",
      "amount": 45.5,
      "type": "expense",
      "description": "Lunch at Italian Restaurant",
      "date": "2024-01-15T00:00:00.000Z",
      "categoryName": "Food & Dining"
    }
  ],
  "upcomingBudgetAlerts": [],
  "goalMilestones": [
    {
      "goalId": "goal-001",
      "goalName": "Emergency Fund",
      "nextMilestone": 15000.0,
      "daysToMilestone": 45
    }
  ]
}
```

## Common Use Cases

### 1. Monthly Financial Review

```bash
# Get monthly transaction summary
curl -X GET "http://localhost:3000/api/v1/transactions/summary?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <your-token>"

# Get budget performance
curl -X GET http://localhost:3000/api/v1/budgets/summary \
  -H "Authorization: Bearer <your-token>"

# Get goal progress
curl -X GET http://localhost:3000/api/v1/goals/summary \
  -H "Authorization: Bearer <your-token>"

# Get financial health metrics
curl -X GET http://localhost:3000/api/v1/analytics/health-metrics \
  -H "Authorization: Bearer <your-token>"
```

### 2. Setting Up a New User

```bash
# 1. Register user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Smith","email":"jane@example.com","password":"SecurePass123!"}'

# 2. Login to get token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"SecurePass123!"}'

# 3. Create primary checking account
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Primary Checking","type":"checking","initialBalance":2500.00}'

# 4. Create savings account
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Savings Account","type":"savings","initialBalance":5000.00}'

# 5. Set up monthly budgets
curl -X POST http://localhost:3000/api/v1/budgets \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Food Budget","amount":600.00,"period":"monthly","categoryId":"cat-001","startDate":"2024-01-01","endDate":"2024-01-31"}'
```

### 3. Expense Tracking Workflow

```bash
# 1. Record grocery shopping
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":125.50,"type":"expense","date":"2024-01-15","description":"Weekly groceries","categoryId":"cat-001","accountId":"acc-001"}'

# 2. Record gas purchase
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":45.00,"type":"expense","date":"2024-01-15","description":"Gas station fill-up","categoryId":"cat-003","accountId":"acc-001"}'

# 3. Check budget status
curl -X GET http://localhost:3000/api/v1/budgets/summary \
  -H "Authorization: Bearer <token>"

# 4. View recent transactions
curl -X GET "http://localhost:3000/api/v1/transactions?limit=5&sortBy=date&sortOrder=desc" \
  -H "Authorization: Bearer <token>"
```

## Error Handling

### Common Error Responses

#### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "amount must be a positive number",
    "categoryId must be a valid UUID"
  ],
  "error": "Bad Request"
}
```

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "You don't have permission to access this resource",
  "error": "Forbidden"
}
```

#### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Transaction not found",
  "error": "Not Found"
}
```

#### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

#### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

### Error Handling Best Practices

1. **Always check status codes** before processing responses
2. **Handle authentication errors** by redirecting to login
3. **Validate input** before sending requests
4. **Implement retry logic** for temporary failures
5. **Log errors** for debugging purposes

### Example Error Handling (JavaScript)

```javascript
async function createTransaction(transactionData, token) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();

      switch (response.status) {
        case 400:
          throw new Error(`Validation error: ${errorData.message.join(', ')}`);
        case 401:
          throw new Error('Authentication required. Please log in again.');
        case 403:
          throw new Error("You don't have permission to perform this action.");
        case 404:
          throw new Error('Resource not found.');
        case 409:
          throw new Error('Conflict: Resource already exists.');
        default:
          throw new Error(`Server error: ${errorData.message}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Transaction creation failed:', error);
    throw error;
  }
}
```

---

This usage guide provides comprehensive examples for integrating with the Financial Tracker API. For more detailed information, refer to the interactive Swagger documentation at `http://localhost:3000/api/docs`.
