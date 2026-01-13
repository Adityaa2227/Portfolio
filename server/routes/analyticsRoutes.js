const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get Analytics Stats
// @route   GET /api/analytics/stats
// @access  Private (Admin only)
router.get('/stats', protect, async (req, res) => {
  try {
    // 1. Basic Counts
    const totalVisits = await Session.countDocuments();
    const liveUsers = await Session.countDocuments({ isOnline: true });
    
    // 2. Unique Visitors (Approximate via distinct ipHash)
    const uniqueVisitors = (await Session.distinct('ipHash')).length;

    // 3. Bounce Rate (Sessions with pageCount <= 1)
    const singlePageSessions = await Session.countDocuments({ pageCount: { $lte: 1 } });
    const bounceRate = totalVisits > 0 ? ((singlePageSessions / totalVisits) * 100).toFixed(1) : 0;

    // 4. Daily Visits (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyVisits = await Session.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    // 5. Device Breakdown
    const devices = await Session.aggregate([
      { $group: { _id: "$deviceType", count: { $sum: 1 } } }
    ]);

    // 6. Country Breakdown
    const countries = await Session.aggregate([
        { $match: { country: { $ne: 'Unknown' } } },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    // 7. Top Pages
    // This is harder because pagesVisited is an array. We unwind it.
    const topPages = await Session.aggregate([
        { $unwind: "$pagesVisited" },
        { $group: { _id: "$pagesVisited.path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    res.json({
      overview: {
        totalVisits,
        uniqueVisitors,
        liveUsers,
        bounceRate
      },
      charts: {
        dailyVisits,
        devices,
        countries,
        topPages
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
