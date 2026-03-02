const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        unique: true
    },
    businessName: {
        type: String,
        required: [true, 'Business name is required'],
        trim: true,
        minlength: [2, 'Business name must be at least 2 characters'],
        maxlength: [150, 'Business name cannot exceed 150 characters']
    },
    businessRegistration: {
        type: String,
        required: [true, 'Business registration number is required'],
        unique: true,
        trim: true
    },
    taxId: {
        type: String,
        default: null,
        trim: true
    },
    businessLicense: {
        url: {
            type: String,
            default: null
        },
        verifiedAt: {
            type: Date,
            default: null
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    bankDetails: {
        accountHolderName: String,
        accountNumber: String,
        bankName: String,
        routingNumber: String,
        currency: {
            type: String,
            enum: ['EGP', 'USD', 'EUR'],
            default: 'EGP'
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    location: {
        address: String,
        city: String,
        governorate: String,
        zipCode: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    contactPersons: [{
        name: String,
        phoneNumber: String,
        email: String,
        position: String
    }],
    courts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court'
    }],
    totalCourts: {
        type: Number,
        default: 0
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot exceed 5']
    },
    rating: {
        total: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    documents: [{
        type: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        verifiedAt: Date,
        isVerified: Boolean
    }],
    commissionRate: {
        type: Number,
        default: 10, // percentage
        min: [0, 'Commission rate cannot be negative'],
        max: [100, 'Commission rate cannot exceed 100']
    },
    paymentSettings: {
        paymentMethod: {
            type: String,
            enum: ['Bank Transfer', 'Wallet', 'Check'],
            default: 'Bank Transfer'
        },
        payoutFrequency: {
            type: String,
            enum: ['Weekly', 'BiWeekly', 'Monthly'],
            default: 'Monthly'
        },
        lastPayoutDate: Date,
        nextPayoutDate: Date,
        pendingBalance: {
            type: Number,
            default: 0
        }
    },
    subscriptionPlan: {
        type: String,
        enum: ['Free', 'Basic', 'Premium', 'Enterprise'],
        default: 'Free'
    },
    subscriptionStatus: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended', 'Expired'],
        default: 'Inactive'
    },
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    features: {
        maxCourts: {
            type: Number,
            default: 1
        },
        analyticsAccess: {
            type: Boolean,
            default: false
        },
        customBranding: {
            type: Boolean,
            default: false
        },
        advancedReporting: {
            type: Boolean,
            default: false
        },
        mobileApp: {
            type: Boolean,
            default: false
        },
        apiAccess: {
            type: Boolean,
            default: false
        }
    },
    stats: {
        weeklyBookings: [{
            week: Date,
            count: Number,
            revenue: Number
        }],
        monthlyRevenue: [{
            month: Date,
            amount: Number,
            bookingCount: Number
        }],
        topCourts: [{
            courtId: mongoose.Schema.Types.ObjectId,
            bookingCount: Number,
            revenue: Number
        }],
        peakHours: [{
            hour: String,
            bookingCount: Number
        }]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    suspensionReason: {
        type: String,
        default: null
    },
    suspensionDate: {
        type: Date,
        default: null
    },
    approvalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Under Review'],
        default: 'Pending'
    },
    approvedAt: {
        type: Date,
        default: null
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// Indexes for better query performance
OwnerSchema.index({ userId: 1 });
OwnerSchema.index({ approvalStatus: 1 });
OwnerSchema.index({ isActive: 1, isSuspended: 1 });
OwnerSchema.index({ createdAt: -1 });
OwnerSchema.index({ totalRevenue: -1 });

// Methods
OwnerSchema.methods.addCourt = function (courtId) {
    if (!this.courts.includes(courtId)) {
        this.courts.push(courtId);
        this.totalCourts = this.courts.length;
    }
    return this.save();
};

OwnerSchema.methods.removeCourt = function (courtId) {
    this.courts = this.courts.filter(id => id.toString() !== courtId.toString());
    this.totalCourts = this.courts.length;
    return this.save();
};

OwnerSchema.methods.updateRevenue = function (amount) {
    this.totalRevenue += amount;
    this.paymentSettings.pendingBalance += amount;
    return this.save();
};

OwnerSchema.methods.recordBooking = function () {
    this.totalBookings += 1;
    return this.save();
};

OwnerSchema.methods.updateRating = function (newRating) {
    const { total, count } = this.rating;
    this.rating.total += newRating;
    this.rating.count += 1;
    this.averageRating = this.rating.total / this.rating.count;
    return this.save();
};

OwnerSchema.methods.suspend = function (reason) {
    this.isSuspended = true;
    this.suspensionReason = reason;
    this.suspensionDate = new Date();
    return this.save();
};

OwnerSchema.methods.unsuspend = function () {
    this.isSuspended = false;
    this.suspensionReason = null;
    this.suspensionDate = null;
    return this.save();
};

OwnerSchema.methods.approveBusiness = function (adminId) {
    this.approvalStatus = 'Approved';
    this.approvedAt = new Date();
    this.approvedBy = adminId;
    this.isActive = true;
    return this.save();
};

OwnerSchema.methods.rejectBusiness = function (adminId, reason) {
    this.approvalStatus = 'Rejected';
    this.suspensionReason = reason;
    this.approvedBy = adminId;
    return this.save();
};

module.exports = mongoose.model('Owner', OwnerSchema);
