A complete backend system for a finance management application with Authentication, RBAC, Transactions, Analytics, Caching, Pagination, and Rate Limiting.

Features:-

Authentication:-
User Registration (admin, user, read-only)
Login with JWT token
Password hashing with BCrypt
Protected routes using middleware

Role-Based Access Control (RBAC):-
Admin → Full access
User → CRUD only on own transactions
Read-only → View-only (cannot add/update/delete)

Transactions Module:-
Add, update, delete transactions
Income/Expense type support
Category-based classification
Filtering (type/category/amount range)
Pagination support (page & limit)

Analytics Module:-
Summary: Total income vs expense
Monthly trends
Yearly trends
Category-wise report


Performance Optimization:-
Redis caching reduces database load by 80–90%
Query optimization
Rate limiting per route group

# Install Dependencies
npm install

# Start Server
npm run dev

# Demo credentials

Admin:-
email--> admin@test.com
pass--> 12345

user:-
email--> user@test.com
pass--> 12345

read-only:-
email--> viewer@test.com
pass--> 12345