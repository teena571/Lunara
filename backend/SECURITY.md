# Lunara API Security Documentation

Production-level security implementation for health data API.

## Security Features Implemented

### 1. JWT Authentication
- All health data routes require valid JWT token
- Token verification via `protect` middleware
- Automatic user attachment to request object
- Token expiration handling

### 2. Rate Limiting
Three-tier rate limiting strategy:

**General API Limiter** (100 req/15min)
- Applied to all `/api/` routes
- Prevents API abuse

**Strict Write Limiter** (30 req/15min)
- Applied to POST, PUT, DELETE operations
- Prevents data spam and abuse

**Auth Limiter** (5 req/15min)
- Applied to login/register endpoints
- Prevents brute force attacks
- Skips successful requests

### 3. Input Validation
- express-validator on all routes
- Type checking (string, int, date, enum)
- Range validation (min/max values)
- Format validation (ISO dates, email)
- Array validation
- Custom error messages

### 4. Data Isolation
- User-scoped queries: `{ user: req.user.id }`
- Prevents cross-user data access
- Ownership verification on all operations
- User field protection (cannot be modified)

### 5. NoSQL Injection Prevention
- express-mongo-sanitize middleware
- Removes MongoDB operators ($, .)
- Custom sanitization for query strings
- Input trimming and cleaning

### 6. Data Leak Prevention
- Password excluded by default (select: false)
- Sensitive fields not returned in responses
- Pagination to limit data exposure
- Field selection with `.select('-__v')`

### 7. Role-Based Access Control (RBAC)
- User roles: 'user', 'admin'
- `authorize()` middleware ready
- Admin routes separated
- Future-proof for admin features

## API Routes

### Cycle Routes
```
GET    /api/v1/cycles          - Get user's cycles (paginated)
GET    /api/v1/cycles/stats    - Get cycle statistics
GET    /api/v1/cycles/:id      - Get single cycle
POST   /api/v1/cycles          - Create cycle (rate limited)
PUT    /api/v1/cycles/:id      - Update cycle (rate limited)
DELETE /api/v1/cycles/:id      - Delete cycle (rate limited)
```

### Symptom Routes
```
GET    /api/v1/symptoms        - Get user's symptoms (paginated)
GET    /api/v1/symptoms/:id    - Get single symptom
POST   /api/v1/symptoms        - Create symptom (rate limited)
PUT    /api/v1/symptoms/:id    - Update symptom (rate limited)
DELETE /api/v1/symptoms/:id    - Delete symptom (rate limited)
```

## Security Best Practices

### Query Security
```javascript
// ✅ SECURE - User-scoped query
const cycles = await Cycle.find({ user: req.user.id });

// ❌ INSECURE - Exposes all data
const cycles = await Cycle.find({});
```

### Ownership Verification
```javascript
// ✅ SECURE - Verify ownership before update
const cycle = await Cycle.findOne({
  _id: req.params.id,
  user: req.user.id
});

// ❌ INSECURE - No ownership check
const cycle = await Cycle.findById(req.params.id);
```

### Field Protection
```javascript
// ✅ SECURE - Remove user field
delete req.body.user;
await Cycle.findByIdAndUpdate(id, req.body);

// ❌ INSECURE - User can change ownership
await Cycle.findByIdAndUpdate(id, req.body);
```

## Validation Examples

### Cycle Validation
```javascript
body('startDate').isISO8601()
body('cycleLength').isInt({ min: 20, max: 45 })
body('flow').isIn(['light', 'medium', 'heavy'])
body('symptoms').isArray()
body('notes').isLength({ max: 500 })
```

### Symptom Validation
```javascript
body('mood').isIn(['happy', 'sad', 'anxious', ...])
body('energy').isInt({ min: 1, max: 10 })
body('severity').isIn(['mild', 'moderate', 'severe'])
```

### Query Validation
```javascript
query('page').isInt({ min: 1 })
query('limit').isInt({ min: 1, max: 100 })
query('startDate').isISO8601()
```

## Rate Limiting Configuration

```javascript
// General API
windowMs: 15 * 60 * 1000  // 15 minutes
max: 100                   // 100 requests

// Write Operations
windowMs: 15 * 60 * 1000  // 15 minutes
max: 30                    // 30 requests

// Authentication
windowMs: 15 * 60 * 1000  // 15 minutes
max: 5                     // 5 attempts
skipSuccessfulRequests: true
```

## MongoDB Security

### Indexes for Performance
```javascript
// User-scoped queries
{ user: 1, date: -1 }
{ user: 1, createdAt: -1 }
```

### Schema Validation
- Required fields
- Min/max constraints
- Enum validation
- Custom validators
- Maxlength limits

## Testing Security

### Test Unauthorized Access
```bash
# Should fail without token
curl http://localhost:5000/api/v1/cycles

# Should succeed with token
curl http://localhost:5000/api/v1/cycles \
  -H "Authorization: Bearer TOKEN"
```

### Test Cross-User Access
```bash
# User A creates cycle
curl -X POST http://localhost:5000/api/v1/cycles \
  -H "Authorization: Bearer USER_A_TOKEN" \
  -d '{"startDate":"2024-01-01"}'

# User B tries to access User A's cycle (should fail)
curl http://localhost:5000/api/v1/cycles/CYCLE_ID \
  -H "Authorization: Bearer USER_B_TOKEN"
```

### Test Rate Limiting
```bash
# Make 6 rapid requests (6th should fail)
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/v1/auth/login \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### Test Input Validation
```bash
# Invalid cycle length (should fail)
curl -X POST http://localhost:5000/api/v1/cycles \
  -H "Authorization: Bearer TOKEN" \
  -d '{"startDate":"2024-01-01","cycleLength":100}'

# Invalid date format (should fail)
curl -X POST http://localhost:5000/api/v1/cycles \
  -H "Authorization: Bearer TOKEN" \
  -d '{"startDate":"invalid-date"}'
```

## Production Checklist

- [x] JWT authentication on all routes
- [x] Rate limiting (3-tier strategy)
- [x] Input validation with express-validator
- [x] User-scoped queries
- [x] Ownership verification
- [x] NoSQL injection prevention
- [x] Field protection
- [x] Pagination
- [x] MongoDB indexes
- [x] Schema validation
- [x] Error handling
- [x] RBAC ready

## Additional Recommendations

1. **HTTPS Only** - Enforce SSL in production
2. **CORS** - Configure specific origins
3. **Logging** - Log security events
4. **Monitoring** - Track failed auth attempts
5. **Backup** - Regular database backups
6. **Encryption** - Encrypt sensitive data at rest
7. **Audit Trail** - Log data modifications
8. **2FA** - Two-factor authentication for sensitive ops
9. **API Keys** - For third-party integrations
10. **Security Headers** - Already using Helmet

## Error Responses

All errors return consistent format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Rate limit errors:
```json
{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

Validation errors:
```json
{
  "success": false,
  "errors": [
    {
      "field": "cycleLength",
      "message": "Cycle length must be between 20 and 45 days"
    }
  ]
}
```
