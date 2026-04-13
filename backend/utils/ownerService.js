const Owner = require('../models/Owner');

/**
 * Record a new booking for owner
 * Updates totalBookings and related stats
 */
const recordOwnerBooking = async (ownerId, courtId, amount) => {
    try {
        const owner = await Owner.findById(ownerId);
        if (!owner) return null;

        await owner.recordBooking();
        await owner.updateRevenue(amount);

        // Update stats - monthly revenue
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const monthIndex = owner.stats.monthlyRevenue.findIndex(m =>
            m.month.toISOString().substring(0, 7) === monthKey
        );

        if (monthIndex !== -1) {
            owner.stats.monthlyRevenue[monthIndex].amount += amount;
            owner.stats.monthlyRevenue[monthIndex].bookingCount += 1;
        } else {
            owner.stats.monthlyRevenue.push({
                month: new Date(),
                amount,
                bookingCount: 1
            });
        }

        await owner.save();
        return owner;
    } catch (error) {
        console.error('Error recording owner booking:', error);
        return null;
    }
};

/**
 * Update owner court list
 */
const addCourtToOwner = async (ownerId, courtId) => {
    try {
        const owner = await Owner.findById(ownerId);
        if (!owner) return null;

        await owner.addCourt(courtId);
        return owner;
    } catch (error) {
        console.error('Error adding court to owner:', error);
        return null;
    }
};

/**
 * Remove court from owner list
 */
const removeCourtFromOwner = async (ownerId, courtId) => {
    try {
        const owner = await Owner.findById(ownerId);
        if (!owner) return null;

        await owner.removeCourt(courtId);
        return owner;
    } catch (error) {
        console.error('Error removing court from owner:', error);
        return null;
    }
};

/**
 * Update owner rating based on a review
 */
const updateOwnerRating = async (ownerId, ratingValue) => {
    try {
        if (ratingValue < 1 || ratingValue > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        const owner = await Owner.findById(ownerId);
        if (!owner) return null;

        await owner.updateRating(ratingValue);
        return owner;
    } catch (error) {
        console.error('Error updating owner rating:', error);
        return null;
    }
};

/**
 * Check if owner has permission to manage a court
 */
const ownerHasCourt = async (ownerId, courtId) => {
    try {
        const owner = await Owner.findById(ownerId);
        if (!owner) return false;

        return owner.courts.some(id => id.toString() === courtId.toString());
    } catch (error) {
        console.error('Error checking owner court:', error);
        return false;
    }
};

/**
 * Get owner by userId
 */
const getOwnerByUserId = async (userId) => {
    try {
        return await Owner.findOne({ userId });
    } catch (error) {
        console.error('Error getting owner by user ID:', error);
        return null;
    }
};

/**
 * Process payout for owner
 */
const processOwnerPayout = async (ownerId, amount) => {
    try {
        const owner = await Owner.findById(ownerId);
        if (!owner) return null;

        if (owner.paymentSettings.pendingBalance < amount) {
            throw new Error('Insufficient balance for payout');
        }

        owner.paymentSettings.pendingBalance -= amount;
        owner.paymentSettings.lastPayoutDate = new Date();

        // Calculate next payout date based on frequency
        const nextDate = new Date();
        switch (owner.paymentSettings.payoutFrequency) {
            case 'Weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'BiWeekly':
                nextDate.setDate(nextDate.getDate() + 14);
                break;
            case 'Monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
        }
        owner.paymentSettings.nextPayoutDate = nextDate;

        await owner.save();
        return owner;
    } catch (error) {
        console.error('Error processing owner payout:', error);
        return null;
    }
};

module.exports = {
    recordOwnerBooking,
    addCourtToOwner,
    removeCourtFromOwner,
    updateOwnerRating,
    ownerHasCourt,
    getOwnerByUserId,
    processOwnerPayout
};
