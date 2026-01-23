# 🏗️ Sports Booking System - Complete Project Architecture Map

**Created Date:** 2026-01-23  
**Purpose:** Complete documentation for converting .NET project to MERN Stack  
**Current Stack:** .NET 9.0 + MySQL + ASP.NET Core Identity + SignalR  
**Target Stack:** MongoDB + Express.js + React + Node.js

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Current Architecture](#current-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Entity Models](#entity-models)
7. [Enums & Constants](#enums--constants)
8. [API Endpoints](#api-endpoints)
9. [Authentication & Authorization](#authentication--authorization)
10. [Real-time Features](#real-time-features)
11. [Payment Integration](#payment-integration)
12. [File Management](#file-management)
13. [Business Logic](#business-logic)
14. [Configuration](#configuration)
15. [MERN Conversion Guide](#mern-conversion-guide)

---

## 1. PROJECT OVERVIEW

### System Description
A comprehensive sports facility booking platform enabling users to:
- **Book courts** for various sports (Tennis, Football, Basketball, Paddle)
- **Create and join matches** with other players
- **Real-time chat** within matches using SignalR
- **Payment processing** with Stripe, PayPal, Apple Pay, Google Pay
- **QR code generation** for booking verification
- **Multi-language support** (Arabic/English)
- **Notifications** via Email, SMS, and Push

### Target Market
- **Primary Region:** Egypt
- **Default Language:** Arabic (with English support)
- **Default Currency:** EGP (Egyptian Pound)
- **Operating Hours:** 6:00 AM - 11:00 PM

### User Roles
1. **User (Player):** Book courts, join matches, chat, review
2. **Court Owner:** Manage courts, view analytics, handle bookings
3. **Admin:** Full system access, user management, reports

---

## 2. CURRENT ARCHITECTURE

### Architecture Pattern
**Clean Architecture** with 4 layers:

```
├── SportsBookingSystem.API          (Presentation Layer)
│   ├── Controllers                  (REST API endpoints)
│   ├── Program.cs                   (Startup configuration)
│   └── appsettings.json             (Configuration)
│
├── SportsBookingSystem.Core         (Domain Layer)
│   ├── Entities                     (Domain models)
│   └── Enums                        (Enumerations)
│
├── SportsBookingSystem.Infrastructure (Data Layer)
│   ├── Data                         (DbContext)
│   └── Migrations                   (EF Core migrations)
│
└── SportsBookingSystem.Web          (UI Layer - Razor Pages)
    ├── Pages                        (UI views)
    └── wwwroot                      (Static files)
```

### Design Principles Applied
- **Separation of Concerns:** Each layer has distinct responsibility
- **Dependency Inversion:** Core has no dependencies, outer layers depend on inner
- **Domain-Driven Design:** Rich domain models with business logic
- **Repository Pattern:** Abstract data access (planned, not implemented yet)
- **CQRS:** Separation of read/write operations (planned)

---

## 3. TECHNOLOGY STACK

### Backend (.NET)
| Technology | Version | Purpose |
|------------|---------|---------|
| .NET | 9.0 | Runtime framework |
| C# | 14 | Programming language |
| ASP.NET Core | 9.0 | Web API framework |
| Entity Framework Core | 9.0 | ORM |
| MySQL | 9.5.0 | Database |
| Pomelo.EntityFrameworkCore.MySql | 9.0.0 | MySQL provider for EF Core |

### Authentication & Security
| Package | Version | Purpose |
|---------|---------|---------|
| Microsoft.AspNetCore.Identity | 9.0.0 | User management |
| Microsoft.AspNetCore.Authentication.JwtBearer | 9.0.0 | JWT tokens |
| Microsoft.AspNetCore.Authentication.Google | 9.0.0 | Google OAuth |
| Microsoft.AspNetCore.Authentication.Facebook | 9.0.0 | Facebook OAuth |

### Real-time & Communication
| Package | Version | Purpose |
|---------|---------|---------|
| SignalR | Built-in | Real-time chat, notifications |
| MailKit | 4.14.1 | Email notifications |

### Payment & QR
| Package | Version | Purpose |
|---------|---------|---------|
| Stripe.net | 50.2.0 | Payment processing |
| QRCoder | 1.7.0 | QR code generation |

### Development Tools
| Package | Version | Purpose |
|---------|---------|---------|
| Swashbuckle.AspNetCore | 6.9.0 | Swagger/OpenAPI documentation |
| Microsoft.EntityFrameworkCore.Design | 9.0.0 | EF Core CLI tools |
| Microsoft.EntityFrameworkCore.Tools | 9.0.0 | Migration tools |

---

## 4. PROJECT STRUCTURE

### Directory Tree
```
Sport-Booking/
│
├── .git/                              # Git repository
├── .vs/                               # Visual Studio files
├── .gitignore                         # Git ignore rules
│
├── README.md                          # Project overview
├── Spec.md                            # Complete specification (71 KB)
├── SportsBookingSystem.sln            # Solution file (4 projects)
│
├── Documentations/                    # Documentation files
│   ├── GETTING_STARTED.md
│   ├── match-bookings-ui.md
│   ├── match-details-aesthetic.md
│   ├── SQL-Schema_file.md             # Database schema documentation
│   ├── STATUS.md
│   └── ui.md
│
├── UI/                                # UI mockups/screenshots
│   ├── Bookings-1.png
│   ├── Bookings.png
│   ├── Edit profile.png
│   ├── Explore-1.png
│   ├── Explore.png
│   ├── Home.png
│   ├── Join (All).png
│   ├── Join (My Matches).png
│   ├── Match overview (All).png
│   ├── Match overview (joined).png
│   ├── Match overview (My Matches).png
│   ├── My Bookings.png
│   ├── Notification (first time).png
│   ├── Notification Settigns.png
│   ├── Notification.png
│   ├── password.png
│   ├── result/
│   ├── Search-1.png
│   ├── Search-2.png
│   └── Search.png
│
├── SportsBookingSystem.API/           # Web API project
│   ├── Controllers/
│   │   └── HealthController.cs        # Health check endpoint
│   ├── Properties/
│   ├── appsettings.json               # Configuration
│   ├── appsettings.Development.json   # Dev configuration
│   ├── Program.cs                     # Application entry point
│   ├── SportsBookingSystem.API.csproj # Project file
│   └── SportsBookingSystem.API.http   # HTTP test requests
│
├── SportsBookingSystem.Core/          # Domain layer
│   ├── Entities/                      # Domain models (13 entities)
│   │   ├── Booking.cs
│   │   ├── ChatMessage.cs
│   │   ├── Court.cs
│   │   ├── CourtImage.cs
│   │   ├── Match.cs
│   │   ├── MatchParticipant.cs
│   │   ├── Notification.cs
│   │   ├── NotificationSettings.cs
│   │   ├── Payment.cs
│   │   ├── Review.cs
│   │   ├── SearchHistory.cs
│   │   ├── SportTypeEntity.cs
│   │   └── User.cs
│   ├── Enums/                         # Enumerations (10 enums)
│   │   ├── BookingStatus.cs
│   │   ├── Currency.cs
│   │   ├── Language.cs
│   │   ├── MatchStatus.cs
│   │   ├── MatchType.cs
│   │   ├── NotificationType.cs
│   │   ├── PaymentMethod.cs
│   │   ├── PaymentStatus.cs
│   │   ├── SportType.cs
│   │   └── UserRole.cs
│   ├── Class1.cs                      # Placeholder file
│   └── SportsBookingSystem.Core.csproj
│
├── SportsBookingSystem.Infrastructure/ # Data layer
│   ├── Data/
│   │   ├── ApplicationDbContext.cs    # EF Core DbContext (277 lines)
│   │   └── ApplicationDbContextFactory.cs # Design-time factory
│   ├── Migrations/
│   │   ├── 20260118184315_InitialCreate.cs
│   │   ├── 20260118184315_InitialCreate.Designer.cs
│   │   └── ApplicationDbContextModelSnapshot.cs
│   ├── Class1.cs                      # Placeholder file
│   └── SportsBookingSystem.Infrastructure.csproj
│
└── SportsBookingSystem.Web/           # UI layer (Razor Pages)
    ├── Pages/                         # Razor pages
    ├── Properties/
    ├── wwwroot/                       # Static files
    ├── appsettings.json
    ├── appsettings.Development.json
    ├── Program.cs
    └── SportsBookingSystem.Web.csproj
```

---

## 5. DATABASE SCHEMA

### Overview
- **Total Tables:** 19 (13 custom + 6 ASP.NET Identity)
- **Database Engine:** MySQL 9.5.0
- **ORM:** Entity Framework Core 9.0
- **Migration Status:** ✅ Up to date (InitialCreate applied)

### Table Categories
1. **Authentication & Identity (6 tables):** ASP.NET Core Identity tables
2. **Courts Management (2 tables):** Courts, CourtImages
3. **Booking System (2 tables):** Bookings, Payments
4. **Match/Tournament (2 tables):** Matches, MatchParticipants
5. **Communication (1 table):** ChatMessages
6. **User Engagement (3 tables):** Reviews, Notifications, NotificationSettings
7. **Analytics (1 table):** SearchHistories
8. **Reference Data (1 table):** SportTypes
9. **System (1 table):** __EFMigrationsHistory

### Entity Relationship Diagram (ERD)

```
┌─────────────┐
│   Users     │◄──────────┐
└──────┬──────┘           │
       │                  │
       │ 1:N              │ 1:N
       ▼                  │
┌─────────────┐           │
│   Courts    │           │
└──────┬──────┘           │
       │                  │
       │ 1:N              │
       ▼                  │
┌─────────────┐           │
│ CourtImages │           │
└─────────────┘           │
                          │
┌─────────────┐           │
│  Bookings   │◄──────────┤
└──────┬──────┘           │
       │                  │
       │ 1:1              │
       ▼                  │
┌─────────────┐           │
│  Matches    │◄──────────┤
└──────┬──────┘           │
       │                  │
       │ 1:N              │
       ▼                  │
┌─────────────┐           │
│MatchParti- │◄──────────┤
│  cipants    │           │
└─────────────┘           │
                          │
┌─────────────┐           │
│ChatMessages │◄──────────┤
└─────────────┘           │
                          │
┌─────────────┐           │
│  Payments   │◄──────────┤
└─────────────┘           │
                          │
┌─────────────┐           │
│   Reviews   │◄──────────┤
└─────────────┘           │
                          │
┌─────────────┐           │
│Notifications│◄──────────┤
└─────────────┘           │
                          │
┌─────────────┐           │
│Notification │◄──────────┘
│  Settings   │ 1:1
└─────────────┘

┌─────────────┐
│SearchHistory│◄─────── Users (1:N)
└─────────────┘

┌─────────────┐
│ SportTypes  │ (Reference table)
└─────────────┘
```

### Database Connection
**Connection String:**
```
Server=localhost;Port=3306;Database=SportsBookingDB;User=root;Password=Sports@2026;
```

**Docker Container:**
- Container Name: `mysql-sports-booking`
- Image: `mysql:latest` (MySQL 9.5.0)
- Port Mapping: `3306:3306`

---

## 6. ENTITY MODELS

### 6.1 User (extends IdentityUser)
**Namespace:** `SportsBookingSystem.Core.Entities`  
**Base Class:** `IdentityUser<Guid>`

**Properties:**
```csharp
public class User : IdentityUser<Guid>
{
    // Profile
    public string FullName { get; set; } = string.Empty;          // Required, max 100
    public DateTime? DateOfBirth { get; set; }                    // Optional
    public string Country { get; set; } = "Egypt";                // Default: Egypt, max 50
    public string? ProfilePictureUrl { get; set; }                // Max 500
    
    // Preferences
    public Language PreferredLanguage { get; set; } = Language.Arabic;  // Enum
    public Currency PreferredCurrency { get; set; } = Currency.EGP;     // Enum
    
    // Authorization
    public UserRole Role { get; set; } = UserRole.User;           // Enum
    public bool IsActive { get; set; } = true;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public virtual ICollection<Court> OwnedCourts { get; set; }
    public virtual ICollection<Booking> Bookings { get; set; }
    public virtual ICollection<Match> OrganizedMatches { get; set; }
    public virtual ICollection<MatchParticipant> MatchParticipations { get; set; }
    public virtual ICollection<Review> Reviews { get; set; }
    public virtual ICollection<Notification> Notifications { get; set; }
    public virtual ICollection<ChatMessage> ChatMessages { get; set; }
    public virtual ICollection<SearchHistory> SearchHistories { get; set; }
    public virtual NotificationSettings? NotificationSettings { get; set; }  // 1:1
}
```

**Inherited from IdentityUser:**
- `Id` (Guid)
- `UserName` (string, max 256)
- `Email` (string, max 256, indexed, unique)
- `EmailConfirmed` (bool)
- `PasswordHash` (string)
- `PhoneNumber` (string, indexed)
- `PhoneNumberConfirmed` (bool)
- `TwoFactorEnabled` (bool)
- `LockoutEnd` (DateTimeOffset?)
- `LockoutEnabled` (bool)
- `AccessFailedCount` (int)

**Database Configuration:**
```csharp
entity.ToTable("Users");
entity.Property(e => e.FullName).HasMaxLength(100).IsRequired();
entity.Property(e => e.Country).HasMaxLength(50).HasDefaultValue("Egypt");
entity.Property(e => e.ProfilePictureUrl).HasMaxLength(500);
entity.Property(e => e.PreferredLanguage).HasConversion<string>();
entity.Property(e => e.PreferredCurrency).HasConversion<string>();
entity.Property(e => e.Role).HasConversion<string>();
entity.HasIndex(e => e.Email).IsUnique();
entity.HasIndex(e => e.PhoneNumber);
```

---

### 6.2 Court
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class Court
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Ownership
    public Guid OwnerId { get; set; }                             // FK to Users
    
    // Basic Info
    public string Name { get; set; } = string.Empty;              // Required, max 200
    public string? Description { get; set; }                      // Text
    
    // Location
    public string Address { get; set; } = string.Empty;           // Required, max 500
    public decimal Latitude { get; set; }                         // Precision(10,8)
    public decimal Longitude { get; set; }                        // Precision(11,8)
    
    // Court Details
    public SportType SportType { get; set; }                      // Enum
    public decimal PricePerHour { get; set; }                     // Precision(10,2)
    public TimeSpan OperatingHoursStart { get; set; } = new TimeSpan(6, 0, 0);   // Default 6 AM
    public TimeSpan OperatingHoursEnd { get; set; } = new TimeSpan(23, 0, 0);    // Default 11 PM
    public int Capacity { get; set; }                             // Maximum players
    
    // Rating
    public decimal Rating { get; set; } = 0;                      // Precision(3,2), 0-5 stars
    public int TotalReviews { get; set; } = 0;
    
    // Additional
    public string? Amenities { get; set; }                        // JSON: parking, wifi, etc.
    public bool IsActive { get; set; } = true;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public virtual User Owner { get; set; } = null!;
    public virtual ICollection<CourtImage> Images { get; set; }
    public virtual ICollection<Booking> Bookings { get; set; }
    public virtual ICollection<Review> Reviews { get; set; }
}
```

**Database Configuration:**
```csharp
entity.ToTable("Courts");
entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
entity.Property(e => e.Address).HasMaxLength(500).IsRequired();
entity.Property(e => e.Latitude).HasPrecision(10, 8);
entity.Property(e => e.Longitude).HasPrecision(11, 8);
entity.Property(e => e.PricePerHour).HasPrecision(10, 2);
entity.Property(e => e.Rating).HasPrecision(3, 2).HasDefaultValue(0);
entity.Property(e => e.SportType).HasConversion<string>();
entity.HasIndex(e => e.OwnerId);
entity.HasIndex(e => e.SportType);
entity.HasIndex(e => new { e.Latitude, e.Longitude });  // Composite for location search
entity.HasOne(e => e.Owner).WithMany(u => u.OwnedCourts)
      .HasForeignKey(e => e.OwnerId).OnDelete(DeleteBehavior.Restrict);
```

---

### 6.3 CourtImage
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class CourtImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CourtId { get; set; }                             // FK to Courts
    public string ImageUrl { get; set; } = string.Empty;          // Required, max 500
    public bool IsPrimary { get; set; } = false;                  // Main image flag
    public int DisplayOrder { get; set; }                         // Sort order
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public virtual Court Court { get; set; } = null!;
}
```

**Database Configuration:**
```csharp
entity.ToTable("CourtImages");
entity.Property(e => e.ImageUrl).HasMaxLength(500).IsRequired();
entity.HasIndex(e => e.CourtId);
entity.HasOne(e => e.Court).WithMany(c => c.Images)
      .HasForeignKey(e => e.CourtId).OnDelete(DeleteBehavior.Cascade);
```

---

### 6.4 Booking
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // References
    public Guid UserId { get; set; }                              // FK to Users
    public Guid CourtId { get; set; }                             // FK to Courts
    
    // Booking Details
    public DateOnly BookingDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public decimal TotalPrice { get; set; }                       // Precision(10,2)
    
    // Payment
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public PaymentMethod PaymentMethod { get; set; }
    
    // Status
    public BookingStatus BookingStatus { get; set; } = BookingStatus.Confirmed;
    
    // QR Code
    public string? QRCode { get; set; }                           // Path to QR image, max 500
    public string? QRCodeHash { get; set; }                       // Verification hash, max 255
    public DateTime? CheckedInAt { get; set; }
    
    // Cancellation
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }               // Max 500
    public decimal RefundAmount { get; set; } = 0;                // Precision(10,2)
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public virtual User User { get; set; } = null!;
    public virtual Court Court { get; set; } = null!;
    public virtual Match? Match { get; set; }                     // 1:1 optional
    public virtual Payment? Payment { get; set; }                 // 1:1 optional
}
```

**Database Configuration:**
```csharp
entity.ToTable("Bookings");
entity.Property(e => e.TotalPrice).HasPrecision(10, 2);
entity.Property(e => e.RefundAmount).HasPrecision(10, 2).HasDefaultValue(0);
entity.Property(e => e.QRCode).HasMaxLength(500);
entity.Property(e => e.QRCodeHash).HasMaxLength(255);
entity.Property(e => e.PaymentStatus).HasConversion<string>();
entity.Property(e => e.PaymentMethod).HasConversion<string>();
entity.Property(e => e.BookingStatus).HasConversion<string>();
entity.HasIndex(e => e.UserId);
entity.HasIndex(e => e.CourtId);
entity.HasIndex(e => new { e.BookingDate, e.StartTime, e.CourtId });  // Composite
entity.HasOne(e => e.User).WithMany(u => u.Bookings)
      .HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
entity.HasOne(e => e.Court).WithMany(c => c.Bookings)
      .HasForeignKey(e => e.CourtId).OnDelete(DeleteBehavior.Restrict);
```

---

### 6.5 Payment
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // References
    public Guid BookingId { get; set; }                           // FK to Bookings (unique)
    public Guid UserId { get; set; }                              // FK to Users
    
    // Payment Details
    public decimal Amount { get; set; }                           // Precision(10,2)
    public Currency Currency { get; set; } = Currency.EGP;        // Enum
    public PaymentMethod PaymentMethod { get; set; }              // Enum
    public string? TransactionId { get; set; }                    // Gateway ID, max 255, unique
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Gateway Response
    public string? PaymentGatewayResponse { get; set; }           // JSON
    
    // Timestamps
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RefundedAt { get; set; }
    
    // Navigation Properties
    public virtual Booking Booking { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
```

**Database Configuration:**
```csharp
entity.ToTable("Payments");
entity.Property(e => e.Amount).HasPrecision(10, 2);
entity.Property(e => e.TransactionId).HasMaxLength(255);
entity.Property(e => e.PaymentGatewayResponse).HasColumnType("json");
entity.Property(e => e.Currency).HasConversion<string>();
entity.Property(e => e.PaymentMethod).HasConversion<string>();
entity.Property(e => e.PaymentStatus).HasConversion<string>();
entity.HasIndex(e => e.BookingId).IsUnique();
entity.HasIndex(e => e.UserId);
entity.HasIndex(e => e.TransactionId).IsUnique();
entity.HasOne(e => e.Booking).WithOne(b => b.Payment)
      .HasForeignKey<Payment>(e => e.BookingId).OnDelete(DeleteBehavior.Restrict);
entity.HasOne(e => e.User).WithMany()
      .HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
```

---

### 6.6 Match
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class Match
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // References
    public Guid BookingId { get; set; }                           // FK to Bookings (unique)
    public Guid OrganizerId { get; set; }                         // FK to Users
    
    // Match Details
    public MatchType MatchType { get; set; } = MatchType.Public;  // Enum: Public/Private
    public string? InviteCode { get; set; }                       // For private matches, max 50, unique
    public int Capacity { get; set; }                             // Maximum players
    public int CurrentPlayers { get; set; } = 1;                  // Organizer counted
    public MatchStatus MatchStatus { get; set; } = MatchStatus.Open;
    public string? FieldAssignment { get; set; }                  // e.g., "Tennis table 1", max 100
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public virtual Booking Booking { get; set; } = null!;
    public virtual User Organizer { get; set; } = null!;
    public virtual ICollection<MatchParticipant> Participants { get; set; }
    public virtual ICollection<ChatMessage> ChatMessages { get; set; }
}
```

**Database Configuration:**
```csharp
entity.ToTable("Matches");
entity.Property(e => e.InviteCode).HasMaxLength(50);
entity.Property(e => e.FieldAssignment).HasMaxLength(100);
entity.Property(e => e.MatchType).HasConversion<string>();
entity.Property(e => e.MatchStatus).HasConversion<string>();
entity.HasIndex(e => e.BookingId).IsUnique();
entity.HasIndex(e => e.OrganizerId);
entity.HasIndex(e => e.InviteCode);
entity.HasOne(e => e.Booking).WithOne(b => b.Match)
      .HasForeignKey<Match>(e => e.BookingId).OnDelete(DeleteBehavior.Restrict);
entity.HasOne(e => e.Organizer).WithMany(u => u.OrganizedMatches)
      .HasForeignKey(e => e.OrganizerId).OnDelete(DeleteBehavior.Restrict);
```

---

### 6.7 MatchParticipant
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class MatchParticipant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // References
    public Guid MatchId { get; set; }                             // FK to Matches
    public Guid UserId { get; set; }                              // FK to Users
    
    // Details
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LeftAt { get; set; }                         // If left match
    public bool IsOwner { get; set; } = false;                    // Match organizer flag
    
    // Navigation Properties
    public virtual Match Match { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
```

**Database Configuration:**
```csharp
entity.ToTable("MatchParticipants");
entity.HasIndex(e => e.MatchId);
entity.HasIndex(e => e.UserId);
entity.HasIndex(e => new { e.MatchId, e.UserId });  // Composite unique
entity.HasOne(e => e.Match).WithMany(m => m.Participants)
      .HasForeignKey(e => e.MatchId).OnDelete(DeleteBehavior.Cascade);
entity.HasOne(e => e.User).WithMany(u => u.MatchParticipations)
      .HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
```

---

### 6.8 ChatMessage
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class ChatMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // References
    public Guid MatchId { get; set; }                             // FK to Matches
    public Guid SenderId { get; set; }                            // FK to Users
    
    // Message
    public string MessageText { get; set; } = string.Empty;       // Required, text type
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    
    // Read Status
    public string? ReadBy { get; set; }                           // JSON array of UserIds
    
    // Navigation Properties
    public virtual Match Match { get; set; } = null!;
    public virtual User Sender { get; set; } = null!;
}
```

**Database Configuration:**
```csharp
entity.ToTable("ChatMessages");
entity.Property(e => e.MessageText).HasColumnType("text").IsRequired();
entity.Property(e => e.ReadBy).HasColumnType("json");
entity.HasIndex(e => e.MatchId);
entity.HasIndex(e => e.SenderId);
entity.HasOne(e => e.Match).WithMany(m => m.ChatMessages)
      .HasForeignKey(e => e.MatchId).OnDelete(DeleteBehavior.Cascade);
entity.HasOne(e => e.Sender).WithMany(u => u.ChatMessages)
      .HasForeignKey(e => e.SenderId).OnDelete(DeleteBehavior.Restrict);
```

---

### 6.9 Notification
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Reference
    public Guid UserId { get; set; }                              // FK to Users
    
    // Notification Details
    public NotificationType Type { get; set; }                    // Enum
    public string Title { get; set; } = string.Empty;             // Required, max 200
    public string Message { get; set; } = string.Empty;           // Required, text type
    public bool IsRead { get; set; } = false;
    public string? ActionUrl { get; set; }                        // Deep link, max 500
    
    // Timestamp
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public virtual User User { get; set; } = null!;
}
```

**Database Configuration:**
```csharp
entity.ToTable("Notifications");
entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
entity.Property(e => e.Message).HasColumnType("text").IsRequired();
entity.Property(e => e.ActionUrl).HasMaxLength(500);
entity.Property(e => e.Type).HasConversion<string>();
entity.HasIndex(e => e.UserId);
entity.HasIndex(e => new { e.UserId, e.IsRead });  // Composite for filtering
entity.HasOne(e => e.User).WithMany(u => u.Notifications)
      .HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
```

---

### 6.10 NotificationSettings
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class NotificationSettings
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }                              // FK to Users (unique)
    
    // General Settings
    public bool GeneralNotifications { get; set; } = true;
    public bool Sound { get; set; } = true;
    public bool Vibrate { get; set; } = true;
    
    // System & Services
    public bool AppUpdates { get; set; } = true;
    public bool BillReminders { get; set; } = true;
    public bool Promotions { get; set; } = true;
    public bool DiscountAvailable { get; set; } = true;
    public bool PaymentRequests { get; set; } = true;
    
    // Others
    public bool NewServices { get; set; } = true;
    public bool NewTips { get; set; } = true;
    
    // Channels
    public bool PushEnabled { get; set; } = true;
    public bool EmailEnabled { get; set; } = true;
    public bool SMSEnabled { get; set; } = false;
    
    // Navigation Properties
    public virtual User User { get; set; } = null!;
}
```

**Database Configuration:**
```csharp
entity.ToTable("NotificationSettings");
entity.HasIndex(e => e.UserId).IsUnique();
entity.HasOne(e => e.User).WithOne(u => u.NotificationSettings)
      .HasForeignKey<NotificationSettings>(e => e.UserId)
      .OnDelete(DeleteBehavior.Cascade);
```

---

### 6.11 Review
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // References
    public Guid CourtId { get; set; }                             // FK to Courts
    public Guid UserId { get; set; }                              // FK to Users
    public Guid BookingId { get; set; }                           // FK to Bookings (unique)
    
    // Review Details
    public int Rating { get; set; }                               // 1-5 stars
    public string? Comment { get; set; }                          // Text type
    
    // Timestamp
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public virtual Court Court { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public virtual Booking Booking { get; set; } = null!;
}
```

**Database Configuration:**
```csharp
entity.ToTable("Reviews");
entity.Property(e => e.Comment).HasColumnType("text");
entity.HasIndex(e => e.CourtId);
entity.HasIndex(e => e.UserId);
entity.HasIndex(e => e.BookingId).IsUnique();  // One review per booking
entity.HasOne(e => e.Court).WithMany(c => c.Reviews)
      .HasForeignKey(e => e.CourtId).OnDelete(DeleteBehavior.Restrict);
entity.HasOne(e => e.User).WithMany(u => u.Reviews)
      .HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
```

---

### 6.12 SearchHistory
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class SearchHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Reference
    public Guid UserId { get; set; }                              // FK to Users
    
    // Search Details
    public string SearchQuery { get; set; } = string.Empty;       // Required, max 200
    public string SearchType { get; set; } = string.Empty;        // Court/Sport/Location/Time, max 50
    
    // Timestamp
    public DateTime SearchedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public virtual User User { get; set; } = null!;
}
```

**Database Configuration:**
```csharp
entity.ToTable("SearchHistories");
entity.Property(e => e.SearchQuery).HasMaxLength(200).IsRequired();
entity.Property(e => e.SearchType).HasMaxLength(50).IsRequired();
entity.HasIndex(e => e.UserId);
entity.HasOne(e => e.User).WithMany(u => u.SearchHistories)
      .HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
```

---

### 6.13 SportTypeEntity
**Namespace:** `SportsBookingSystem.Core.Entities`

**Properties:**
```csharp
public class SportTypeEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;              // Required, max 100, unique
    public int DefaultCapacity { get; set; }                      // Default players per match
    public string? Icon { get; set; }                             // Icon URL/emoji, max 500
    public bool IsActive { get; set; } = true;
}
```

**Database Configuration:**
```csharp
entity.ToTable("SportTypes");
entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
entity.Property(e => e.Icon).HasMaxLength(500);
entity.HasIndex(e => e.Name).IsUnique();
```

**Default Sport Types:**
- Tennis (Capacity: 2-4)
- Football 5-a-side (Capacity: 10)
- Basketball (Capacity: 10)
- Paddle (Capacity: 4)

---

## 7. ENUMS & CONSTANTS

### 7.1 BookingStatus
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum BookingStatus
{
    Confirmed,      // Booking confirmed
    Cancelled,      // User cancelled
    Completed,      // Booking finished successfully
    NoShow          // User didn't show up
}
```

---

### 7.2 PaymentStatus
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum PaymentStatus
{
    Pending,        // Payment not processed yet
    Paid,           // Payment successful
    Refunded,       // Payment refunded
    Failed          // Payment failed
}
```

---

### 7.3 PaymentMethod
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum PaymentMethod
{
    CreditCard,     // Credit/Debit card via Stripe
    PayPal,         // PayPal account
    ApplePay,       // Apple Pay via Stripe
    GooglePay,      // Google Pay via Stripe
    Cash            // Cash on arrival (manual confirmation)
}
```

---

### 7.4 MatchStatus
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum MatchStatus
{
    Open,           // Accepting players
    Full,           // Capacity reached
    InProgress,     // Match started
    Completed,      // Match finished
    Cancelled       // Match cancelled
}
```

---

### 7.5 MatchType
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum MatchType
{
    Public,         // Anyone can join, listed publicly
    Private         // Invite-only, requires invite code
}
```

---

### 7.6 NotificationType
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum NotificationType
{
    // Booking-related (always sent)
    BookingConfirmation,
    BookingReminder,
    BookingCancellation,
    RefundProcessed,
    
    // Match-related
    MatchInvitation,
    PlayerJoinedMatch,
    PlayerLeftMatch,
    NewChatMessage,
    MatchStartingSoon,
    
    // System & Services (user configurable)
    AppUpdate,
    BillReminder,
    Promotion,
    DiscountAvailable,
    PaymentRequest,
    NewServiceAvailable,
    NewTipAvailable
}
```

---

### 7.7 SportType
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum SportType
{
    Tennis,         // Tennis courts
    Football5,      // 5-a-side football
    Basketball,     // Basketball courts
    Paddle          // Paddle tennis
}
```

---

### 7.8 UserRole
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum UserRole
{
    User,           // Regular player/customer
    CourtOwner,     // Court facility owner
    Admin           // System administrator
}
```

---

### 7.9 Currency
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum Currency
{
    EGP,            // Egyptian Pound (default)
    USD,            // US Dollar
    EUR             // Euro
}
```

---

### 7.10 Language
**Namespace:** `SportsBookingSystem.Core.Enums`

```csharp
public enum Language
{
    Arabic,         // Arabic (default)
    English         // English
}
```

---

## 8. API ENDPOINTS

### 8.1 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/register` | Register new user | `{ email, password, fullName, phoneNumber, role }` | `{ userId, message }` |
| POST | `/login` | Login with email/password | `{ email, password }` | `{ accessToken, refreshToken, user }` |
| POST | `/login/google` | OAuth Google login | `{ googleToken }` | `{ accessToken, refreshToken, user }` |
| POST | `/login/facebook` | OAuth Facebook login | `{ facebookToken }` | `{ accessToken, refreshToken, user }` |
| POST | `/logout` | Logout user | None | `{ message }` |
| POST | `/refresh-token` | Refresh JWT token | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| POST | `/forgot-password` | Request password reset | `{ email }` | `{ message }` |
| POST | `/reset-password` | Reset password with token | `{ token, newPassword }` | `{ message }` |
| POST | `/verify-email` | Verify email with token | `{ token }` | `{ message }` |

**JWT Token Configuration:**
- Access Token: 15 minutes expiry
- Refresh Token: 7 days expiry
- Stored in HTTP-only cookies
- Bearer token in Authorization header

---

### 8.2 Users Endpoints (`/api/users`)

| Method | Endpoint | Description | Auth Required | Response |
|--------|----------|-------------|---------------|----------|
| GET | `/me` | Get current user profile | ✅ | `{ user }` |
| PUT | `/me` | Update current user profile | ✅ | `{ user }` |
| POST | `/me/avatar` | Upload profile picture | ✅ | `{ profilePictureUrl }` |
| PUT | `/me/password` | Change password | ✅ | `{ message }` |
| DELETE | `/me` | Delete account | ✅ | `{ message }` |
| GET | `/me/reviews` | Get user reviews | ✅ | `{ reviews }` |

---

### 8.3 Courts Endpoints (`/api/courts`)

| Method | Endpoint | Description | Auth Required | Request Params |
|--------|----------|-------------|---------------|----------------|
| GET | `/` | List all courts | No | `?sportType, ?minPrice, ?maxPrice, ?rating, ?page, ?limit` |
| GET | `/{id}` | Get court details | No | None |
| GET | `/{id}/availability` | Get availability calendar | No | `?date, ?days` |
| GET | `/nearby` | Get nearby courts | No | `?lat, ?lng, ?radius` |
| POST | `/` | Create court | ✅ CourtOwner | `{ name, address, lat, lng, sportType, price, ... }` |
| PUT | `/{id}` | Update court | ✅ Owner | `{ name, address, price, ... }` |
| DELETE | `/{id}` | Delete court | ✅ Owner | None |
| POST | `/{id}/images` | Upload court images | ✅ Owner | `FormData with images` |
| GET | `/{id}/reviews` | Get court reviews | No | `?page, ?limit` |

---

### 8.4 Bookings Endpoints (`/api/bookings`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/` | Get user bookings | ✅ | Query: `?status=upcoming/past` |
| GET | `/{id}` | Get booking details | ✅ | None |
| POST | `/` | Create new booking | ✅ | `{ courtId, date, startTime, endTime }` |
| PUT | `/{id}/cancel` | Cancel booking | ✅ | `{ reason }` |
| POST | `/{id}/payment` | Process payment | ✅ | `{ paymentMethod, paymentDetails }` |
| GET | `/{id}/qrcode` | Get QR code image | ✅ | None |
| POST | `/{id}/checkin` | Check-in with QR | ✅ CourtOwner | `{ qrCodeHash }` |

**Refund Policy Logic:**
- > 24 hours before booking: 100% refund
- < 24 hours before booking: 50% refund
- No-show: No refund

---

### 8.5 Matches Endpoints (`/api/matches`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/` | List all public matches | No | Query: `?sportType, ?date, ?location` |
| GET | `/my` | Get user's matches | ✅ | Query: `?status=created/joined` |
| GET | `/{id}` | Get match details | ✅ | None |
| POST | `/` | Create match | ✅ | `{ bookingId, matchType, capacity, inviteCode? }` |
| PUT | `/{id}` | Update match | ✅ Owner | `{ capacity, status }` |
| DELETE | `/{id}` | Cancel match | ✅ Owner | None |
| POST | `/{id}/join` | Join match | ✅ | `{ inviteCode? }` |
| POST | `/{id}/leave` | Leave match | ✅ | None |
| GET | `/{id}/participants` | Get match participants | ✅ | None |

---

### 8.6 Chat Endpoints (`/api/chat`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/matches/{matchId}/messages` | Get chat history | ✅ | Query: `?page, ?limit` |
| POST | `/matches/{matchId}/messages` | Send message | ✅ | `{ messageText }` |
| PUT | `/messages/{id}/read` | Mark message as read | ✅ | None |

**Note:** SignalR is preferred for real-time chat operations.

---

### 8.7 Notifications Endpoints (`/api/notifications`)

| Method | Endpoint | Description | Auth Required | Response |
|--------|----------|-------------|---------------|----------|
| GET | `/` | Get user notifications | ✅ | `{ notifications, unreadCount }` |
| GET | `/unread-count` | Get unread count | ✅ | `{ count }` |
| PUT | `/{id}/read` | Mark as read | ✅ | `{ message }` |
| PUT | `/read-all` | Mark all as read | ✅ | `{ message }` |
| DELETE | `/{id}` | Delete notification | ✅ | `{ message }` |
| DELETE | `/clear-all` | Clear all notifications | ✅ | `{ message }` |

---

### 8.8 Notification Settings (`/api/notifications/settings`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/` | Get notification preferences | ✅ | None |
| PUT | `/` | Update preferences | ✅ | `{ generalNotifications, sound, vibrate, ... }` |

---

### 8.9 Search Endpoints (`/api/search`)

| Method | Endpoint | Description | Auth Required | Query Params |
|--------|----------|-------------|---------------|--------------|
| GET | `/courts` | Search courts | No | `?q, ?sportType, ?location, ?minPrice, ?maxPrice` |
| GET | `/matches` | Search matches | No | `?q, ?sportType, ?date, ?location` |
| GET | `/suggestions` | Get search suggestions | No | `?q` |
| GET | `/history` | Get user search history | ✅ | None |
| DELETE | `/history` | Clear search history | ✅ | None |

---

### 8.10 Reviews Endpoints (`/api/reviews`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST | `/` | Submit review | ✅ | `{ courtId, bookingId, rating, comment }` |
| GET | `/courts/{courtId}` | Get court reviews | No | Query: `?page, ?limit` |
| PUT | `/{id}` | Update review | ✅ Own | `{ rating, comment }` |
| DELETE | `/{id}` | Delete review | ✅ Own | None |

**Validation:** User can only review courts they have completed bookings for.

---

### 8.11 Admin Endpoints (`/api/admin`)

| Method | Endpoint | Description | Auth Required | Response |
|--------|----------|-------------|---------------|----------|
| GET | `/users` | Manage users | ✅ Admin | `{ users, pagination }` |
| GET | `/courts` | Manage all courts | ✅ Admin | `{ courts, pagination }` |
| GET | `/bookings` | View all bookings | ✅ Admin | `{ bookings, pagination }` |
| GET | `/payments` | View all transactions | ✅ Admin | `{ payments, pagination }` |
| GET | `/reports/revenue` | Revenue reports | ✅ Admin | `{ revenue, breakdown }` |
| GET | `/reports/bookings` | Booking statistics | ✅ Admin | `{ stats }` |
| POST | `/sports` | Add sport type | ✅ Admin | `{ name, defaultCapacity, icon }` |
| PUT | `/sports/{id}` | Update sport type | ✅ Admin | `{ name, defaultCapacity, icon }` |

---

## 9. AUTHENTICATION & AUTHORIZATION

### 9.1 JWT Configuration

**Token Structure:**
```json
{
  "sub": "user-guid",
  "email": "user@example.com",
  "role": "User",
  "jti": "unique-token-id",
  "iat": 1234567890,
  "exp": 1234568790
}
```

**JWT Settings (from appsettings.json):**
```json
{
  "JwtSettings": {
    "Secret": "YourSuperSecretKeyHereMustBeAtLeast32CharactersLong!",
    "Issuer": "SportsBookingAPI",
    "Audience": "SportsBookingClient",
    "ExpiryMinutes": 15,
    "RefreshTokenExpiryDays": 7
  }
}
```

**Token Validation Parameters:**
```csharp
new TokenValidationParameters
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = jwtSettings["Issuer"],
    ValidAudience = jwtSettings["Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
    ClockSkew = TimeSpan.Zero  // No grace period
}
```

---

### 9.2 ASP.NET Core Identity Configuration

**Identity Options:**
```csharp
builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    
    // Sign-in settings
    options.SignIn.RequireConfirmedEmail = false;  // Set to true for email confirmation
    
    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();
```

**Identity Tables (Auto-generated):**
1. AspNetUsers (extended by User entity)
2. AspNetRoles
3. AspNetUserRoles (many-to-many)
4. AspNetUserClaims
5. AspNetUserLogins (external providers)
6. AspNetUserTokens
7. AspNetRoleClaims

---

### 9.3 OAuth 2.0 Configuration

**Google OAuth:**
```json
{
  "Authentication": {
    "Google": {
      "ClientId": "your-google-client-id.apps.googleusercontent.com",
      "ClientSecret": "your-google-client-secret"
    }
  }
}
```

```csharp
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
})
```

**Facebook OAuth:**
```json
{
  "Authentication": {
    "Facebook": {
      "AppId": "your-facebook-app-id",
      "AppSecret": "your-facebook-app-secret"
    }
  }
}
```

```csharp
.AddFacebook(options =>
{
    options.AppId = builder.Configuration["Authentication:Facebook:AppId"];
    options.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"];
})
```

---

### 9.4 Authorization Policies

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy => 
        policy.RequireRole("Admin"));
    
    options.AddPolicy("RequireCourtOwnerRole", policy => 
        policy.RequireRole("Admin", "CourtOwner"));
    
    options.AddPolicy("RequireUserRole", policy => 
        policy.RequireRole("Admin", "CourtOwner", "User"));
});
```

**Usage in Controllers:**
```csharp
[Authorize(Policy = "RequireAdminRole")]
[HttpGet("admin/users")]
public async Task<IActionResult> GetAllUsers() { }

[Authorize(Policy = "RequireCourtOwnerRole")]
[HttpPost("courts")]
public async Task<IActionResult> CreateCourt() { }
```

---

### 9.5 SignalR JWT Support

```csharp
options.Events = new JwtBearerEvents
{
    OnMessageReceived = context =>
    {
        var accessToken = context.Request.Query["access_token"];
        var path = context.HttpContext.Request.Path;
        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
        {
            context.Token = accessToken;
        }
        return Task.CompletedTask;
    }
};
```

---

## 10. REAL-TIME FEATURES

### 10.1 SignalR Configuration

**Hub Endpoints (Planned, not yet implemented):**
- `/hubs/chat` - Match chat hub
- `/hubs/notifications` - Notification hub

**Program.cs Configuration:**
```csharp
builder.Services.AddSignalR();

// Map hubs (commented out, need to implement)
// app.MapHub<ChatHub>("/hubs/chat");
// app.MapHub<NotificationHub>("/hubs/notifications");
```

---

### 10.2 ChatHub (To be implemented)

**Hub Methods:**
```csharp
public class ChatHub : Hub
{
    // Join match chat room
    public async Task JoinMatchChat(Guid matchId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"match_{matchId}");
    }
    
    // Leave match chat room
    public async Task LeaveMatchChat(Guid matchId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"match_{matchId}");
    }
    
    // Send message to match
    public async Task SendMessage(Guid matchId, string message)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
        
        // Save to database
        var chatMessage = new ChatMessage
        {
            MatchId = matchId,
            SenderId = Guid.Parse(userId),
            MessageText = message,
            SentAt = DateTime.UtcNow
        };
        // await _dbContext.ChatMessages.AddAsync(chatMessage);
        // await _dbContext.SaveChangesAsync();
        
        // Broadcast to match room
        await Clients.Group($"match_{matchId}").SendAsync("ReceiveMessage", new
        {
            id = chatMessage.Id,
            senderId = userId,
            senderName = userName,
            message = message,
            sentAt = chatMessage.SentAt
        });
    }
    
    // Typing indicator
    public async Task UserTyping(Guid matchId)
    {
        var userName = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
        await Clients.OthersInGroup($"match_{matchId}")
                     .SendAsync("UserTyping", userName);
    }
    
    // Mark message as read
    public async Task MarkAsRead(Guid messageId)
    {
        // Update ReadBy JSON array in database
    }
}
```

**Client-side Usage (JavaScript):**
```javascript
// Connect to hub
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat?access_token=" + jwtToken)
    .build();

// Join match chat
connection.invoke("JoinMatchChat", matchId);

// Send message
connection.invoke("SendMessage", matchId, messageText);

// Receive messages
connection.on("ReceiveMessage", (message) => {
    console.log(`${message.senderName}: ${message.message}`);
});

// Typing indicator
connection.on("UserTyping", (userName) => {
    console.log(`${userName} is typing...`);
});
```

---

### 10.3 NotificationHub (To be implemented)

**Hub Methods:**
```csharp
public class NotificationHub : Hub
{
    // Subscribe to user notifications
    public async Task SubscribeToNotifications()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
    }
    
    // Send notification to user
    public async Task SendNotification(Guid userId, Notification notification)
    {
        await Clients.Group($"user_{userId}").SendAsync("ReceiveNotification", new
        {
            id = notification.Id,
            type = notification.Type.ToString(),
            title = notification.Title,
            message = notification.Message,
            actionUrl = notification.ActionUrl,
            createdAt = notification.CreatedAt
        });
    }
    
    // Mark notification as read
    public async Task MarkAsRead(Guid notificationId)
    {
        // Update database
    }
    
    // Clear all notifications
    public async Task ClearAll()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        // Delete all notifications for user
    }
}
```

**Client-side Usage:**
```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/notifications?access_token=" + jwtToken)
    .build();

// Subscribe to notifications
connection.invoke("SubscribeToNotifications");

// Receive notifications
connection.on("ReceiveNotification", (notification) => {
    showNotification(notification.title, notification.message);
    updateNotificationBadge();
});
```

---

## 11. PAYMENT INTEGRATION

### 11.1 Stripe Configuration

**appsettings.json:**
```json
{
  "Stripe": {
    "SecretKey": "sk_test_your_stripe_secret_key",
    "PublishableKey": "pk_test_your_stripe_publishable_key",
    "WebhookSecret": "whsec_your_webhook_secret"
  }
}
```

**Package:**
- `Stripe.net` version 50.2.0

**Payment Flow:**
1. User selects time slots and court
2. Calculate total price (price per hour × duration)
3. Create Stripe PaymentIntent
4. Client confirms payment with card details
5. Webhook receives payment confirmation
6. Update booking payment status to "Paid"
7. Generate QR code
8. Send confirmation email/SMS
9. Create notification

**Payment Methods Supported:**
- Credit/Debit Card (Stripe)
- Apple Pay (via Stripe)
- Google Pay (via Stripe)
- PayPal (separate integration)
- Cash on arrival (manual confirmation by court owner)

---

### 11.2 PayPal Configuration

**appsettings.json:**
```json
{
  "PayPal": {
    "ClientId": "your-paypal-client-id",
    "ClientSecret": "your-paypal-client-secret",
    "Mode": "sandbox"
  }
}
```

**Note:** PayPal SDK integration required (not yet installed).

---

### 11.3 Refund Logic

**Refund Policy:**
```csharp
public decimal CalculateRefundAmount(Booking booking)
{
    var hoursUntilBooking = (booking.BookingDate.ToDateTime(booking.StartTime) - DateTime.UtcNow).TotalHours;
    
    if (hoursUntilBooking > 24)
    {
        return booking.TotalPrice;  // 100% refund
    }
    else if (hoursUntilBooking > 0)
    {
        return booking.TotalPrice * 0.5m;  // 50% refund
    }
    else
    {
        return 0;  // No refund (no-show)
    }
}
```

**Refund Processing Time:** 5-7 business days

---

## 12. FILE MANAGEMENT

### 12.1 File Upload Configuration

**appsettings.json:**
```json
{
  "FileUpload": {
    "MaxFileSizeMB": 5,
    "AllowedExtensions": [ ".jpg", ".jpeg", ".png", ".webp" ],
    "ProfilePicturesPath": "wwwroot/uploads/profiles",
    "CourtImagesPath": "wwwroot/uploads/courts",
    "QRCodesPath": "wwwroot/qrcodes"
  }
}
```

### 12.2 Storage Paths

**Local Storage (Development):**
```
wwwroot/
├── uploads/
│   ├── profiles/        # User profile pictures
│   │   └── {userId}.jpg
│   └── courts/          # Court images
│       └── {courtId}/
│           ├── 1.jpg
│           ├── 2.jpg
│           └── 3.jpg
└── qrcodes/             # QR codes
    └── {bookingId}.png
```

**Cloud Storage (Production - Planned):**
- Azure Blob Storage
- AWS S3
- CDN for static asset delivery

---

### 12.3 QR Code Generation

**Package:** `QRCoder` version 1.7.0

**QR Code Content:**
```json
{
  "bookingId": "guid",
  "userId": "guid",
  "courtId": "guid",
  "timestamp": "2026-01-18T12:00:00Z",
  "hash": "HMAC-SHA256-verification-hash"
}
```

**Generation Code:**
```csharp
public string GenerateQRCode(Booking booking)
{
    var qrData = new
    {
        bookingId = booking.Id,
        userId = booking.UserId,
        courtId = booking.CourtId,
        timestamp = DateTime.UtcNow,
        hash = GenerateHash(booking)
    };
    
    using var qrGenerator = new QRCodeGenerator();
    var qrCodeData = qrGenerator.CreateQrCode(JsonSerializer.Serialize(qrData), QRCodeGenerator.ECCLevel.Q);
    using var qrCode = new PngByteQRCode(qrCodeData);
    var qrBytes = qrCode.GetGraphic(20);
    
    var fileName = $"{booking.Id}.png";
    var filePath = Path.Combine("wwwroot/qrcodes", fileName);
    File.WriteAllBytes(filePath, qrBytes);
    
    return $"/qrcodes/{fileName}";
}

private string GenerateHash(Booking booking)
{
    var data = $"{booking.Id}|{booking.UserId}|{booking.CourtId}|{booking.BookingDate}|{booking.StartTime}";
    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes("secret-key"));
    var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
    return Convert.ToBase64String(hash);
}
```

**Validation:**
- Check-in only within 30 minutes before/after booking time
- Single-use QR code (expires after check-in)
- HMAC verification to prevent tampering

---

## 13. BUSINESS LOGIC

### 13.1 Booking Availability Check

**Logic:**
```csharp
public async Task<bool> IsCourtAvailable(Guid courtId, DateOnly date, TimeSpan startTime, TimeSpan endTime)
{
    // Check if court exists and is active
    var court = await _dbContext.Courts.FindAsync(courtId);
    if (court == null || !court.IsActive) return false;
    
    // Check operating hours
    if (startTime < court.OperatingHoursStart || endTime > court.OperatingHoursEnd)
        return false;
    
    // Check for overlapping bookings
    var overlappingBookings = await _dbContext.Bookings
        .Where(b => b.CourtId == courtId 
                 && b.BookingDate == date
                 && b.BookingStatus != BookingStatus.Cancelled
                 && (
                     (b.StartTime < endTime && b.EndTime > startTime)  // Overlap check
                 ))
        .AnyAsync();
    
    return !overlappingBookings;
}
```

---

### 13.2 Match Capacity Management

**Logic:**
```csharp
public async Task<bool> JoinMatch(Guid matchId, Guid userId)
{
    var match = await _dbContext.Matches
        .Include(m => m.Participants)
        .FirstOrDefaultAsync(m => m.Id == matchId);
    
    if (match == null) throw new NotFoundException("Match not found");
    
    // Check if user already joined
    if (match.Participants.Any(p => p.UserId == userId && p.LeftAt == null))
        throw new InvalidOperationException("User already in match");
    
    // Check capacity
    if (match.CurrentPlayers >= match.Capacity)
        throw new InvalidOperationException("Match is full");
    
    // Add participant
    var participant = new MatchParticipant
    {
        MatchId = matchId,
        UserId = userId,
        JoinedAt = DateTime.UtcNow
    };
    
    match.CurrentPlayers++;
    if (match.CurrentPlayers >= match.Capacity)
        match.MatchStatus = MatchStatus.Full;
    
    _dbContext.MatchParticipants.Add(participant);
    await _dbContext.SaveChangesAsync();
    
    // Send notification to match organizer
    await SendNotification(match.OrganizerId, NotificationType.PlayerJoinedMatch, 
                          $"New player joined your match");
    
    return true;
}
```

---

### 13.3 Nearby Courts Search

**Logic:**
```csharp
public async Task<List<Court>> GetNearbyCourts(decimal latitude, decimal longitude, double radiusKm = 10)
{
    // Haversine formula for distance calculation
    var courts = await _dbContext.Courts
        .Where(c => c.IsActive)
        .ToListAsync();
    
    var nearbyCourts = courts
        .Select(c => new
        {
            Court = c,
            Distance = CalculateDistance(latitude, longitude, c.Latitude, c.Longitude)
        })
        .Where(x => x.Distance <= radiusKm)
        .OrderBy(x => x.Distance)
        .Select(x => x.Court)
        .ToList();
    
    return nearbyCourts;
}

private double CalculateDistance(decimal lat1, decimal lon1, decimal lat2, decimal lon2)
{
    const double R = 6371; // Earth radius in km
    var dLat = ToRadians((double)(lat2 - lat1));
    var dLon = ToRadians((double)(lon2 - lon1));
    var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
            Math.Cos(ToRadians((double)lat1)) * Math.Cos(ToRadians((double)lat2)) *
            Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
    var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    return R * c;
}

private double ToRadians(double degrees) => degrees * (Math.PI / 180);
```

---

### 13.4 Rating Calculation

**Logic:**
```csharp
public async Task UpdateCourtRating(Guid courtId)
{
    var reviews = await _dbContext.Reviews
        .Where(r => r.CourtId == courtId)
        .ToListAsync();
    
    var court = await _dbContext.Courts.FindAsync(courtId);
    if (court != null && reviews.Any())
    {
        court.Rating = (decimal)reviews.Average(r => r.Rating);
        court.TotalReviews = reviews.Count;
        await _dbContext.SaveChangesAsync();
    }
}
```

---

### 13.5 Notification Sending

**Email Notification (MailKit):**
```csharp
public async Task SendEmailNotification(string toEmail, string subject, string body)
{
    var message = new MimeMessage();
    message.From.Add(new MailboxAddress("Sports Booking System", "noreply@sportsbooking.com"));
    message.To.Add(new MailboxAddress("", toEmail));
    message.Subject = subject;
    message.Body = new TextPart("html") { Text = body };
    
    using var client = new SmtpClient();
    await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
    await client.AuthenticateAsync("noreply@sportsbooking.com", "app-password");
    await client.SendAsync(message);
    await client.DisconnectAsync(true);
}
```

**Notification Types and Templates:**
1. **Booking Confirmation:** "Your booking at {CourtName} on {Date} at {Time} is confirmed!"
2. **Booking Reminder:** "Reminder: Your booking starts in 1 hour at {CourtName}"
3. **Match Invitation:** "{UserName} invited you to join a match at {CourtName}"
4. **Player Joined:** "New player joined your match"
5. **Payment Confirmation:** "Payment of {Amount} {Currency} received"
6. **Refund Processed:** "Refund of {Amount} {Currency} processed"

---

## 14. CONFIGURATION

### 14.1 appsettings.json (Complete)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=SportsBookingDB;User=root;Password=Sports@2026;"
  },
  "JwtSettings": {
    "Secret": "YourSuperSecretKeyHereMustBeAtLeast32CharactersLong!",
    "Issuer": "SportsBookingAPI",
    "Audience": "SportsBookingClient",
    "ExpiryMinutes": 15,
    "RefreshTokenExpiryDays": 7
  },
  "Authentication": {
    "Google": {
      "ClientId": "your-google-client-id.apps.googleusercontent.com",
      "ClientSecret": "your-google-client-secret"
    },
    "Facebook": {
      "AppId": "your-facebook-app-id",
      "AppSecret": "your-facebook-app-secret"
    }
  },
  "Stripe": {
    "SecretKey": "sk_test_your_stripe_secret_key",
    "PublishableKey": "pk_test_your_stripe_publishable_key",
    "WebhookSecret": "whsec_your_webhook_secret"
  },
  "PayPal": {
    "ClientId": "your-paypal-client-id",
    "ClientSecret": "your-paypal-client-secret",
    "Mode": "sandbox"
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderName": "Sports Booking System",
    "SenderEmail": "noreply@sportsbooking.com",
    "SenderPassword": "your-app-password",
    "EnableSsl": true
  },
  "FileUpload": {
    "MaxFileSizeMB": 5,
    "AllowedExtensions": [ ".jpg", ".jpeg", ".png", ".webp" ],
    "ProfilePicturesPath": "wwwroot/uploads/profiles",
    "CourtImagesPath": "wwwroot/uploads/courts",
    "QRCodesPath": "wwwroot/qrcodes"
  },
  "AppSettings": {
    "DefaultOperatingHoursStart": "06:00",
    "DefaultOperatingHoursEnd": "23:00",
    "RefundPolicy": {
      "FullRefundHours": 24,
      "PartialRefundPercentage": 50
    },
    "SearchHistoryLimit": 10,
    "NearbyDistanceKm": 10,
    "DefaultLanguage": "ar",
    "DefaultCurrency": "EGP"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

---

### 14.2 Program.cs Configuration

**Key Middleware Pipeline:**
1. UseSwagger (Development only)
2. UseHttpsRedirection
3. UseStaticFiles
4. UseCors
5. UseAuthentication
6. UseAuthorization
7. MapControllers
8. MapHub (SignalR hubs)

**Services Registered:**
- DbContext (MySQL with Pomelo provider)
- Identity (with custom User/Role)
- Authentication (JWT + OAuth)
- SignalR
- Controllers with JSON cycle handling
- CORS policy
- Swagger/OpenAPI

---

### 14.3 CORS Configuration

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();  // Required for SignalR
    });
});

app.UseCors("AllowAll");
```

---

## 15. MERN CONVERSION GUIDE

### 15.1 Stack Mapping

| .NET Component | MERN Equivalent |
|----------------|-----------------|
| ASP.NET Core Web API | **Express.js** (Node.js framework) |
| Entity Framework Core | **Mongoose** (MongoDB ODM) |
| MySQL Database | **MongoDB** (NoSQL database) |
| ASP.NET Core Identity | **Passport.js** + custom User model |
| JWT Authentication | **jsonwebtoken** package |
| SignalR | **Socket.io** |
| MailKit | **Nodemailer** |
| Stripe.NET | **stripe** npm package |
| QRCoder | **qrcode** npm package |
| Razor Pages | **React** (SPA framework) |

---

### 15.2 Database Migration (MySQL → MongoDB)

#### Key Differences:
1. **No Foreign Keys:** Use ObjectId references instead
2. **No Enums:** Store as strings or numbers
3. **JSON Native:** No need for JSON columns, use nested objects
4. **Flexible Schema:** No rigid table structure

#### Schema Conversion Examples:

**User Model (Mongoose):**
```javascript
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  country: { type: String, default: 'Egypt' },
  profilePictureUrl: { type: String },
  preferredLanguage: { type: String, enum: ['Arabic', 'English'], default: 'Arabic' },
  preferredCurrency: { type: String, enum: ['EGP', 'USD', 'EUR'], default: 'EGP' },
  role: { type: String, enum: ['User', 'CourtOwner', 'Admin'], default: 'User' },
  isActive: { type: Boolean, default: true },
  emailConfirmed: { type: Boolean, default: false },
  refreshTokens: [{ token: String, createdAt: Date }],  // For JWT refresh
}, { timestamps: true });  // Auto createdAt/updatedAt

UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });
```

**Court Model (Mongoose):**
```javascript
const CourtSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, maxlength: 200 },
  description: { type: String },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }  // [longitude, latitude]
  },
  sportType: { type: String, enum: ['Tennis', 'Football5', 'Basketball', 'Paddle'], required: true },
  pricePerHour: { type: Number, required: true },
  operatingHours: {
    start: { type: String, default: '06:00' },
    end: { type: String, default: '23:00' }
  },
  capacity: { type: Number, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  amenities: {
    parking: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    showers: { type: Boolean, default: false },
    lockers: { type: Boolean, default: false }
  },
  images: [{ url: String, isPrimary: Boolean, displayOrder: Number }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

CourtSchema.index({ owner: 1 });
CourtSchema.index({ sportType: 1 });
CourtSchema.index({ location: '2dsphere' });  // For geospatial queries
```

**Booking Model (Mongoose):**
```javascript
const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },  // "08:00"
  endTime: { type: String, required: true },    // "10:00"
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded', 'Failed'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['CreditCard', 'PayPal', 'ApplePay', 'GooglePay', 'Cash'] },
  bookingStatus: { type: String, enum: ['Confirmed', 'Cancelled', 'Completed', 'NoShow'], default: 'Confirmed' },
  qrCode: { url: String, hash: String },
  checkedInAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  refundAmount: { type: Number, default: 0 }
}, { timestamps: true });

BookingSchema.index({ user: 1 });
BookingSchema.index({ court: 1 });
BookingSchema.index({ bookingDate: 1, startTime: 1, court: 1 });
```

**Match Model (Mongoose):**
```javascript
const MatchSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchType: { type: String, enum: ['Public', 'Private'], default: 'Public' },
  inviteCode: { type: String, unique: true, sparse: true },
  capacity: { type: Number, required: true },
  currentPlayers: { type: Number, default: 1 },
  matchStatus: { type: String, enum: ['Open', 'Full', 'InProgress', 'Completed', 'Cancelled'], default: 'Open' },
  fieldAssignment: { type: String },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
    isOwner: { type: Boolean, default: false }
  }]
}, { timestamps: true });

MatchSchema.index({ booking: 1 });
MatchSchema.index({ organizer: 1 });
MatchSchema.index({ inviteCode: 1 });
```

---

### 15.3 Backend Conversion (Express.js)

#### Project Structure:
```
backend/
├── server.js                 # Entry point
├── config/
│   ├── database.js           # MongoDB connection
│   ├── passport.js           # Passport.js setup
│   └── socketio.js           # Socket.io setup
├── models/
│   ├── User.js
│   ├── Court.js
│   ├── Booking.js
│   ├── Match.js
│   ├── Payment.js
│   ├── Notification.js
│   └── ...
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── courtController.js
│   ├── bookingController.js
│   └── ...
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── courts.js
│   ├── bookings.js
│   └── ...
├── middlewares/
│   ├── auth.js               # JWT verification
│   ├── errorHandler.js
│   └── upload.js             # Multer file upload
├── services/
│   ├── emailService.js       # Nodemailer
│   ├── paymentService.js     # Stripe
│   ├── qrcodeService.js      # QR generation
│   └── notificationService.js
├── utils/
│   ├── validators.js
│   ├── helpers.js
│   └── constants.js
└── package.json
```

#### Express.js Server Setup:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: 'http://localhost:3000', credentials: true }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(passport.initialize());

// Static files
app.use('/uploads', express.static('uploads'));
app.use('/qrcodes', express.static('qrcodes'));

// Database connection
mongoose.connect('mongodb://localhost:27017/sportsbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Passport config
require('./config/passport')(passport);

// Socket.io
require('./config/socketio')(io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courts', require('./routes/courts'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/notifications', require('./routes/notifications'));

// Error handling
app.use(require('./middlewares/errorHandler'));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### JWT Middleware:
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Bearer token
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { userId, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
```

#### Auth Controller Example:
```javascript
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, phoneNumber, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      email,
      passwordHash,
      fullName,
      phoneNumber,
      role: role || 'User'
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // Save refresh token
    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();
    
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

### 15.4 Real-time (Socket.io)

#### Socket.io Server Setup:
```javascript
module.exports = (io) => {
  io.use((socket, next) => {
    // JWT authentication for Socket.io
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    
    // Join user room for notifications
    socket.join(`user_${socket.userId}`);
    
    // Join match chat
    socket.on('joinMatchChat', async (matchId) => {
      // Verify user is in match
      const match = await Match.findById(matchId);
      const isParticipant = match.participants.some(p => p.user.toString() === socket.userId);
      
      if (isParticipant) {
        socket.join(`match_${matchId}`);
        socket.emit('joinedMatchChat', { matchId });
      }
    });
    
    // Send message
    socket.on('sendMessage', async ({ matchId, message }) => {
      const chatMessage = new ChatMessage({
        match: matchId,
        sender: socket.userId,
        messageText: message,
        sentAt: new Date()
      });
      await chatMessage.save();
      
      // Populate sender
      await chatMessage.populate('sender', 'fullName profilePictureUrl');
      
      // Broadcast to match room
      io.to(`match_${matchId}`).emit('receiveMessage', {
        id: chatMessage._id,
        senderId: chatMessage.sender._id,
        senderName: chatMessage.sender.fullName,
        senderAvatar: chatMessage.sender.profilePictureUrl,
        message: chatMessage.messageText,
        sentAt: chatMessage.sentAt
      });
    });
    
    // Typing indicator
    socket.on('userTyping', ({ matchId }) => {
      socket.to(`match_${matchId}`).emit('userTyping', { userId: socket.userId });
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });
};
```

#### React Socket.io Client:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('accessToken') }
});

// Join match chat
socket.emit('joinMatchChat', matchId);

// Send message
const sendMessage = (matchId, message) => {
  socket.emit('sendMessage', { matchId, message });
};

// Receive messages
socket.on('receiveMessage', (message) => {
  setMessages(prev => [...prev, message]);
});

// Typing indicator
socket.on('userTyping', ({ userId }) => {
  setTypingUsers(prev => [...prev, userId]);
});
```

---

### 15.5 Frontend (React)

#### Project Structure:
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── Courts/
│   │   │   ├── CourtList.jsx
│   │   │   ├── CourtDetails.jsx
│   │   │   ├── CourtForm.jsx
│   │   │   └── CourtCard.jsx
│   │   ├── Bookings/
│   │   │   ├── BookingForm.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── BookingDetails.jsx
│   │   │   └── QRCodeDisplay.jsx
│   │   ├── Matches/
│   │   │   ├── MatchList.jsx
│   │   │   ├── MatchDetails.jsx
│   │   │   ├── MatchChat.jsx
│   │   │   └── CreateMatch.jsx
│   │   ├── Navigation/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── BottomNav.jsx
│   │   └── Common/
│   │       ├── Loader.jsx
│   │       ├── ErrorBoundary.jsx
│   │       └── NotFound.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Explore.jsx
│   │   ├── Profile.jsx
│   │   ├── Notifications.jsx
│   │   └── Admin.jsx
│   ├── services/
│   │   ├── api.js              # Axios instance
│   │   ├── authService.js
│   │   ├── courtService.js
│   │   ├── bookingService.js
│   │   └── matchService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── SocketContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
└── package.json
```

#### React Router Setup:
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/courts/:id" element={<CourtDetails />} />
        
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
          <Route path="/matches" element={<MatchList />} />
          <Route path="/matches/:id" element={<MatchDetails />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        
        {/* Admin routes */}
        <Route element={<PrivateRoute roles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Auth Context:
```javascript
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      authService.getCurrentUser()
        .then(user => setUser(user))
        .catch(() => localStorage.removeItem('accessToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (email, password) => {
    const { accessToken, refreshToken, user } = await authService.login(email, password);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
  };
  
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### 15.6 Key Packages

#### Backend (package.json):
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "passport-google-oauth20": "^2.0.0",
    "passport-facebook": "^3.0.0",
    "socket.io": "^4.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "nodemailer": "^6.9.7",
    "stripe": "^14.0.0",
    "qrcode": "^1.5.3",
    "multer": "^1.4.5-lts.1",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  }
}
```

#### Frontend (package.json):
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "socket.io-client": "^4.6.0",
    "@stripe/stripe-js": "^2.2.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "react-qr-code": "^2.0.12",
    "react-hook-form": "^7.48.2",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^2.30.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  }
}
```

---

## 16. SUMMARY

### Current State (✅ Completed):
1. ✅ Clean Architecture solution with 4 projects
2. ✅ 13 Entity models created
3. ✅ 10 Enums defined
4. ✅ DbContext with complete EF Core configurations
5. ✅ Initial migration applied to MySQL database
6. ✅ Program.cs configured with JWT, Identity, OAuth, SignalR
7. ✅ appsettings.json with all required configurations
8. ✅ NuGet packages installed (Stripe, MailKit, QRCoder, etc.)

### Pending Implementation (🚧 In Progress):
1. 🚧 Controllers (only HealthController exists)
2. 🚧 SignalR Hubs (ChatHub, NotificationHub)
3. 🚧 Services layer (Repository pattern, business logic)
4. 🚧 Payment integration (Stripe/PayPal)
5. 🚧 Email service (MailKit)
6. 🚧 QR code generation
7. 🚧 File upload handling
8. 🚧 Razor Pages UI

### For MERN Conversion:
- **Replace:** ASP.NET Core → Express.js
- **Replace:** Entity Framework Core → Mongoose
- **Replace:** MySQL → MongoDB
- **Replace:** ASP.NET Core Identity → Passport.js + bcrypt
- **Replace:** SignalR → Socket.io
- **Replace:** MailKit → Nodemailer
- **Keep:** Stripe, QR generation logic, business rules
- **Build:** React frontend with same UI/UX

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-23  
**Total Lines:** 3500+  
**Status:** Complete ✅

---

END OF DOCUMENT
