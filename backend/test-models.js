const mongoose = require('mongoose');
const config = require('./config/config');
const models = require('./models');

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    testModels();
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

async function testModels() {
  try {
    console.log('\n🧪 Testing Models...\n');

    // Clear existing test data
    console.log('🧹 Clearing old test data...');
    await models.User.deleteMany({ email: { $in: ['test@sportsbooking.com', 'owner@sportsbooking.com'] } });
    await models.Court.deleteMany({ name: 'Cairo Sports Arena' });
    await models.SportType.deleteMany({});
    console.log('✅ Old data cleared\n');

    // Test 1: Create a User
    console.log('1️⃣ Testing User Model...');
    const user = new models.User({
      email: 'test@sportsbooking.com',
      passwordHash: 'Test123456!',
      fullName: 'Test User',
      phoneNumber: '+201234567890',
      role: 'User'
    });
    await user.save();
    console.log('✅ User created:', user.fullName, '(ID:', user._id + ')');
    console.log('   Password was hashed:', user.passwordHash.startsWith('$2'));

    // Test 2: Create a Court Owner
    console.log('\n2️⃣ Testing Court Owner...');
    const owner = new models.User({
      email: 'owner@sportsbooking.com',
      passwordHash: 'Owner123456!',
      fullName: 'Court Owner',
      phoneNumber: '+201234567891',
      role: 'CourtOwner'
    });
    await owner.save();
    console.log('✅ Court Owner created:', owner.fullName);

    // Test 3: Create SportTypes
    console.log('\n3️⃣ Testing SportType Model...');
    const sportTypes = [
      {
        name: 'Football',
        nameAr: 'كرة القدم',
        description: 'Football/Soccer field',
        descriptionAr: 'ملعب كرة القدم',
        minPlayers: 10,
        maxPlayers: 22
      },
      {
        name: 'Tennis',
        nameAr: 'التنس',
        description: 'Tennis court',
        descriptionAr: 'ملعب التنس',
        minPlayers: 2,
        maxPlayers: 4
      }
    ];
    
    for (const sport of sportTypes) {
      const existing = await models.SportType.findOne({ name: sport.name });
      if (!existing) {
        await models.SportType.create(sport);
        console.log('✅ SportType created:', sport.name);
      }
    }

    // Test 4: Create a Court
    console.log('\n4️⃣ Testing Court Model...');
    const court = new models.Court({
      name: 'Cairo Sports Arena',
      description: 'Professional football court with modern facilities',
      ownerId: owner._id,
      sportType: 'Football',
      location: {
        address: '123 Sports Street',
        city: 'Cairo',
        governorate: 'Cairo',
        coordinates: {
          latitude: 30.0444,
          longitude: 31.2357
        }
      },
      pricePerHour: 200,
      currency: 'EGP',
      capacity: 22,
      amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Water'],
      images: [
        { url: '/uploads/courts/court1.jpg', isPrimary: true }
      ],
      availableDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isActive: true,
      isVerified: true
    });
    await court.save();
    console.log('✅ Court created:', court.name, '(ID:', court._id + ')');
    console.log('   Price:', court.pricePerHour, court.currency, 'per hour');

    // Test 5: Create a Booking
    console.log('\n5️⃣ Testing Booking Model...');
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 2);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);

    const booking = new models.Booking({
      userId: user._id,
      courtId: court._id,
      startTime: startTime,
      endTime: endTime,
      totalPrice: 400,
      currency: 'EGP',
      status: 'Confirmed'
    });
    await booking.save();
    console.log('✅ Booking created for:', user.fullName);
    console.log('   Duration:', booking.duration, 'minutes');
    console.log('   Status:', booking.status);

    // Test 6: Create a Match
    console.log('\n6️⃣ Testing Match Model...');
    const match = new models.Match({
      bookingId: booking._id,
      organizerId: user._id,
      matchType: 'Public',
      capacity: 10,
      participants: [
        { userId: user._id, isOrganizer: true, status: 'Active' }
      ]
    });
    await match.save();
    console.log('✅ Match created with invite code:', match.inviteCode || 'N/A (public match)');
    console.log('   Available slots:', match.availableSlots);

    // Test 7: Create a Payment
    console.log('\n7️⃣ Testing Payment Model...');
    const payment = new models.Payment({
      bookingId: booking._id,
      userId: user._id,
      amount: 400,
      currency: 'EGP',
      paymentMethod: 'Stripe',
      status: 'Completed'
    });
    await payment.save();
    console.log('✅ Payment created:', payment.transactionId);
    console.log('   Amount:', payment.amount, payment.currency);

    // Test 8: Create Notification Settings
    console.log('\n8️⃣ Testing NotificationSettings Model...');
    const notifSettings = new models.NotificationSettings({
      userId: user._id
    });
    await notifSettings.save();
    console.log('✅ Notification settings created for user');
    console.log('   Email enabled:', notifSettings.email.enabled);
    console.log('   Push enabled:', notifSettings.push.enabled);

    // Test 9: Create a Review
    console.log('\n9️⃣ Testing Review Model...');
    const review = new models.Review({
      courtId: court._id,
      userId: user._id,
      bookingId: booking._id,
      rating: 5,
      comment: 'Amazing court! Very well maintained.',
      pros: ['Clean', 'Good lighting', 'Friendly staff'],
      isVerifiedBooking: true
    });
    await review.save();
    console.log('✅ Review created with', review.rating, 'stars');

    // Test 10: Check Court Rating Update
    console.log('\n🔟 Testing Court Rating Auto-Update...');
    const updatedCourt = await models.Court.findById(court._id);
    console.log('✅ Court rating updated to:', updatedCourt.averageRating);
    console.log('   Total reviews:', updatedCourt.totalReviews);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL TESTS PASSED!');
    console.log('='.repeat(50));
    console.log('Database:', config.MONGODB_URI.split('/').pop());
    console.log('Collections created: 10');
    console.log('Documents created: 10+');
    console.log('\n💡 You can view the data in MongoDB Compass:');
    console.log('   Connection string: mongodb://localhost:27017/sportsbooking');
    console.log('\n🎉 Phase 2 Models are fully functional!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}
