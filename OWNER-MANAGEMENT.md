# Owner Management System

## Overview

The Owner Management System handles business operations for court owners in the Sports Booking platform. It manages owner profiles, approvals, suspensions, analytics, payments, and integrations with courts and bookings.

---

## Model: Owner

### Schema Fields

#### Basic Information

- **userId** (ObjectId, required, unique): Reference to User model
- **businessName** (String, required): Name of the business
- **businessRegistration** (String, required, unique): Business registration number
- **taxId** (String, optional): Tax identification number
- **approvalStatus** (String): 'Pending', 'Approved', 'Rejected', 'Under Review'

#### Business Documents

- **businessLicense**: Document verification object
  - `url`: License document URL
  - `verifiedAt`: Verification timestamp
  - `isVerified`: Boolean flag
- **documents[]**: Array of uploaded documents
  - `type`: Document type
  - `url`: Document URL
  - `uploadedAt`: Upload date
  - `verifiedAt`: Verification date
  - `isVerified`: Verification status

#### Location Information

- **location**: Business location details
  - `address`: Street address
  - `city`: City name
  - `governorate`: Governorate/State
  - `zipCode`: Postal code
  - `coordinates`: GPS coordinates (latitude, longitude)

#### Contact & Personnel

- **contactPersons[]**: Array of contact people
  - `name`: Person's name
  - `phoneNumber`: Contact phone
  - `email`: Contact email
  - `position`: Job title/position

#### Court & Booking Information

- **courts[]** (ObjectId[], references Court): Array of owned courts
- **totalCourts** (Number): Count of owned courts
- **totalBookings** (Number): Total bookings across all courts
- **totalRevenue** (Number): Cumulative revenue

#### Ratings & Reviews

- **averageRating** (Number): Average rating (0-5)
- **rating**: Rating aggregation
  - `total`: Sum of all ratings
  - `count`: Number of ratings

#### Bank & Payment Details

- **bankDetails**: Bank account information
  - `accountHolderName`: Account holder name
  - `accountNumber`: Bank account number
  - `bankName`: Bank name
  - `routingNumber`: Bank routing number
  - `currency`: Account currency ('EGP', 'USD', 'EUR')
  - `isVerified`: Account verification status

#### Payment & Subscription

- **paymentSettings**: Payment configuration
  - `paymentMethod`: 'Bank Transfer', 'Wallet', 'Check'
  - `payoutFrequency`: 'Weekly', 'BiWeekly', 'Monthly'
  - `lastPayoutDate`: Last payout date
  - `nextPayoutDate`: Next scheduled payout
  - `pendingBalance`: Amount waiting for payout
- **commissionRate** (Number): Platform commission percentage (0-100)

#### Subscription & Features

- **subscriptionPlan**: 'Free', 'Basic', 'Premium', 'Enterprise'
- **subscriptionStatus**: 'Active', 'Inactive', 'Suspended', 'Expired'
- **subscriptionStartDate**: Plan start date
- **subscriptionEndDate**: Plan expiration date
- **features**: Feature access control
  - `maxCourts`: Maximum courts allowed
  - `analyticsAccess`: Boolean
  - `customBranding`: Boolean
  - `advancedReporting`: Boolean
  - `mobileApp`: Boolean
  - `apiAccess`: Boolean

#### Analytics & Statistics

- **stats**: Detailed statistics object
  - `weeklyBookings[]`: Array of weekly booking data
  - `monthlyRevenue[]`: Array of monthly revenue data
  - `topCourts[]`: Top performing courts
  - `peakHours[]`: Peak booking hours

#### Account Status

- **isActive** (Boolean): Account active status
- **isSuspended** (Boolean): Suspension flag
- **suspensionReason** (String): Reason for suspension
- **suspensionDate** (Date): When suspended
- **approvedAt** (Date): Approval timestamp
- **approvedBy** (ObjectId): Admin who approved
- **timestamps**: createdAt, updatedAt

---

## CRUD Operations

### 1. CREATE - Register as Owner

**Endpoint:** `POST /api/owners/register`
**Access:** Private (Authenticated users)

**Request Body:**

```json
{
  "businessName": "Elite Sports Courts",
  "businessRegistration": "REG-123456",
  "taxId": "TAX-789456",
  "location": {
    "address": "123 Sports St",
    "city": "Cairo",
    "governorate": "Cairo",
    "zipCode": "11111"
  },
  "contactPersons": [
    {
      "name": "Ahmed Hassan",
      "phoneNumber": "+201001234567",
      "email": "contact@sports.com",
      "position": "Manager"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Owner registration submitted for approval",
  "data": {
    /* owner object */
  }
}
```

**Business Logic:**

- Creates new Owner profile
- Sets approval status to 'Pending'
- Updates user role to 'CourtOwner'
- Validates unique business registration

---

### 2. READ - Get All Owners

**Endpoint:** `GET /api/owners`
**Access:** Private (Admin only)
**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `approvalStatus`: Filter by approval status
- `isActive`: Filter by active status

**Response:**

```json
{
  "success": true,
  "message": "Owners retrieved successfully",
  "data": [
    /* array of owners */
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### 3. READ - Get Owner by ID

**Endpoint:** `GET /api/owners/:id`
**Access:** Private

**Response:**

```json
{
  "success": true,
  "message": "Owner retrieved successfully",
  "data": {
    /* owner object with populated references */
  }
}
```

---

### 4. READ - Get My Owner Profile

**Endpoint:** `GET /api/owners/me`
**Access:** Private (CourtOwner)

**Response:**

```json
{
  "success": true,
  "message": "Owner profile retrieved",
  "data": {
    /* current user's owner profile */
  }
}
```

---

### 5. UPDATE - Update Owner Profile

**Endpoint:** `PUT /api/owners/:id`
**Access:** Private (Owner or Admin)

**Request Body:**

```json
{
  "businessName": "New Business Name",
  "location": {
    "address": "456 New St",
    "city": "Alexandria"
  },
  "contactPersons": [
    {
      "name": "New Contact",
      "phoneNumber": "+201009876543",
      "email": "new@contacts.com"
    }
  ]
}
```

**Protected Fields (Cannot Update):**

- userId
- courts
- totalCourts
- totalBookings
- totalRevenue
- approvalStatus
- approvedAt
- approvedBy

---

### 6. APPROVE - Owner Application Approval

**Endpoint:** `PATCH /api/owners/:id/approve`
**Access:** Private (Admin only)

**Response:**

```json
{
  "success": true,
  "message": "Owner approved successfully",
  "data": {
    "approvalStatus": "Approved",
    "approvedAt": "2026-03-01T...",
    "approvedBy": "admin-user-id",
    "isActive": true
  }
}
```

---

### 7. REJECT - Owner Application Rejection

**Endpoint:** `PATCH /api/owners/:id/reject`
**Access:** Private (Admin only)

**Request Body:**

```json
{
  "reason": "Incomplete documentation"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Owner rejected successfully",
  "data": {
    "approvalStatus": "Rejected",
    "suspensionReason": "Incomplete documentation"
  }
}
```

---

### 8. SUSPEND - Suspend Owner Account

**Endpoint:** `PATCH /api/owners/:id/suspend`
**Access:** Private (Admin only)

**Request Body:**

```json
{
  "reason": "Violation of terms of service"
}
```

**Effects:**

- Sets `isSuspended` to true
- Records suspension reason and date
- Owner cannot create new bookings

---

### 9. UNSUSPEND - Restore Owner Account

**Endpoint:** `PATCH /api/owners/:id/unsuspend`
**Access:** Private (Admin only)

**Effects:**

- Sets `isSuspended` to false
- Clears suspension reason and date
- Owner can resume operations

---

### 10. DELETE - Remove Owner Profile

**Endpoint:** `DELETE /api/owners/:id`
**Access:** Private (Admin only)

**Side Effects:**

- Deletes owner profile
- Reverts user role back to 'User'
- Courts remain in database but are orphaned

---

## Advanced Operations

### Analytics

**Endpoint:** `GET /api/owners/:id/analytics`
**Access:** Private

**Response:**

```json
{
  "success": true,
  "data": {
    "totalCourts": 5,
    "totalBookings": 450,
    "totalRevenue": 45000,
    "averageRating": 4.5,
    "pendingBalance": 3000,
    "monthlyRevenue": [
      /* array */
    ],
    "weeklyBookings": [
      /* array */
    ],
    "topCourts": [
      /* array */
    ],
    "peakHours": [
      /* array */
    ]
  }
}
```

---

### Bank Details Management

**Endpoint:** `PATCH /api/owners/:id/bank-details`
**Access:** Private (Owner)

**Request Body:**

```json
{
  "accountHolderName": "Ahmed Hassan",
  "accountNumber": "1234567890",
  "bankName": "Egyptian Bank",
  "routingNumber": "987654",
  "currency": "EGP"
}
```

**Post-Update:**

- Bank details marked as unverified
- Admin must verify before payouts

---

## Model Methods

### Instance Methods

#### recordBooking()

Increments total bookings count.

```javascript
await owner.recordBooking();
```

#### addCourt(courtId)

Adds a court to owner's portfolio.

```javascript
await owner.addCourt(courtId);
```

#### removeCourt(courtId)

Removes a court from owner's portfolio.

```javascript
await owner.removeCourt(courtId);
```

#### updateRevenue(amount)

Updates total revenue and pending balance.

```javascript
await owner.updateRevenue(5000);
```

#### updateRating(newRating)

Updates average rating based on review.

```javascript
await owner.updateRating(4.5);
```

#### suspend(reason)

Suspends the owner account.

```javascript
await owner.suspend("Terms of service violation");
```

#### unsuspend()

Restores a suspended account.

```javascript
await owner.unsuspend();
```

#### approveBusiness(adminId)

Approves owner application.

```javascript
await owner.approveBusiness(adminIdObjectId);
```

#### rejectBusiness(adminId, reason)

Rejects owner application.

```javascript
await owner.rejectBusiness(adminIdObjectId, "Incomplete docs");
```

---

## Business Logic Integration

### With Bookings

When a booking is created:

1. Recording via `ownerService.recordOwnerBooking()`
2. Updates totalBookings
3. Updates totalRevenue
4. Updates monthly revenue statistics
5. Broadcasts notification to owner

### With Courts

When a court is created:

1. Owner linked via `ownerService.addCourtToOwner()`
2. totalCourts incremented
3. Court assignment validates owner approval status

### With Reviews

When a review is submitted:

1. Rating extracted via `ownerService.updateOwnerRating()`
2. Average rating recalculated
3. Rating statistics updated
4. Top courts list refreshed

### With Payments

Monthly payout process:

1. Calculate pendingBalance from monthly revenue
2. Commission rate applied
3. Bank details verified
4. Payout processed via `ownerService.processOwnerPayout()`
5. Next payout date scheduled
6. Notification sent to owner

---

## Utility Functions (ownerService.js)

```javascript
// Record booking and update owner stats
recordOwnerBooking(ownerId, courtId, amount);

// Add court to owner's portfolio
addCourtToOwner(ownerId, courtId);

// Remove court from owner's portfolio
removeCourtFromOwner(ownerId, courtId);

// Update owner rating
updateOwnerRating(ownerId, ratingValue);

// Check if owner manages a court
ownerHasCourt(ownerId, courtId);

// Get owner by user ID
getOwnerByUserId(userId);

// Process payout
processOwnerPayout(ownerId, amount);
```

---

## Subscription Plans & Features

### Free Plan

- Max 1 court
- Basic analytics
- No custom branding
- Manual payouts

### Basic Plan

- Max 5 courts
- Advanced analytics
- Email support
- Bi-weekly payouts

### Premium Plan

- Max 20 courts
- Full analytics & reporting
- Custom branding
- Mobile app access
- Weekly payouts

### Enterprise Plan

- Unlimited courts
- Full feature access
- API access
- Dedicated support
- Custom integration

---

## Approval Workflow

```
Registration → Pending Review → Approved/Rejected
                    ↓
              Admin verifies docs
                    ↓
            [Email notification sent]
```

---

## Payment & Payout Flow

```
Booking Created
    ↓
Revenue recorded in pendingBalance
    ↓
Monthly collection date
    ↓
Commission calculated
    ↓
Bank details verified
    ↓
Payout processed
    ↓
Next payout scheduled
    ↓
Notification sent
```

---

## Error Handling

### Common Errors

| Code | Message                     | Cause                           |
| ---- | --------------------------- | ------------------------------- |
| 400  | Business already registered | Duplicate business registration |
| 403  | Not authorized              | User not owner or admin         |
| 404  | Owner not found             | Invalid owner ID                |
| 400  | Insufficient balance        | Payout exceeds pending balance  |
| 400  | Validation error            | Invalid input data              |

---

## Security Considerations

1. **Field Protection**: Cannot update critical fields (userId, courts, approvalStatus)
2. **Role Checks**: Endpoint access controlled by user role
3. **Ownership Verification**: Owner can only update own profile
4. **Bank Details**: Require separate verification by admin
5. **Suspension Logic**: Automatic blocking of operations when suspended

---

## Examples

### Register as Owner

```javascript
const response = await api.post("/api/owners/register", {
  businessName: "Court Masters",
  businessRegistration: "REG-001",
  location: {
    city: "Cairo",
    governorate: "Cairo",
  },
});
```

### Get My Profile

```javascript
const response = await api.get("/api/owners/me");
```

### Update Bank Details

```javascript
const response = await api.patch(`/api/owners/${ownerId}/bank-details`, {
  accountHolderName: "Ahmed",
  accountNumber: "123456789",
  bankName: "Bank of Egypt",
});
```

### Get Analytics

```javascript
const response = await api.get(`/api/owners/${ownerId}/analytics`);
```

---

## Testing Checklist

- [ ] Owner registration creates profile and sets approval status
- [ ] Admin can approve/reject/suspend owner
- [ ] Owner cannot update protected fields
- [ ] Courts are properly linked to owner
- [ ] Bookings update owner revenue and stats
- [ ] Ratings properly calculate average
- [ ] Payout process reduces pending balance
- [ ] Bank details verification works
- [ ] Analytics data aggregates correctly
- [ ] Suspended owners cannot operate
