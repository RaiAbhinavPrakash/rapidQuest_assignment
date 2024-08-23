const { getDatabase } = require("../config/database");

async function getTotalSales(req, res) {
  try {
    const db = await getDatabase();
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$created_at" } },
            month: { $month: { $toDate: "$created_at" } },
          },
          total_sales: { $sum: { $toDouble: "$total_price" } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ];

    const results = await db
      .collection("shopifyOrders")
      .aggregate(pipeline)
      .toArray();
    res.json(results);
  } catch (error) {
    console.error("Error fetching total sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getDailySales(req, res) {
  try {
    const db = await getDatabase();
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$created_at" } },
            month: { $month: { $toDate: "$created_at" } },
            day: { $dayOfMonth: { $toDate: "$created_at" } },
          },
          total_sales: { $sum: { $toDouble: "$total_price" } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ];

    const results = await db
      .collection("shopifyOrders")
      .aggregate(pipeline)
      .toArray();
    res.json(results);
  } catch (error) {
    console.error("Error fetching daily sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getQuarterlySales(req, res) {
  try {
    const db = await getDatabase();
    const pipeline = [
      {
        $addFields: {
          quarter: {
            $cond: {
              if: { $lte: [{ $month: { $toDate: "$created_at" } }, 3] },
              then: 1,
              else: {
                $cond: {
                  if: { $lte: [{ $month: { $toDate: "$created_at" } }, 6] },
                  then: 2,
                  else: {
                    $cond: {
                      if: { $lte: [{ $month: { $toDate: "$created_at" } }, 9] },
                      then: 3,
                      else: 4,
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$created_at" } },
            quarter: "$quarter",
          },
          total_sales: { $sum: { $toDouble: "$total_price" } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.quarter": 1 },
      },
    ];

    const results = await db
      .collection("shopifyOrders")
      .aggregate(pipeline)
      .toArray();
    res.json(results);
  } catch (error) {
    console.error("Error fetching quarterly sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getYearlySales(req, res) {
  try {
    const db = await getDatabase();
    const pipeline = [
      {
        $group: {
          _id: { year: { $year: { $toDate: "$created_at" } } },
          total_sales: { $sum: { $toDouble: "$total_price" } },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ];

    const results = await db
      .collection("shopifyOrders")
      .aggregate(pipeline)
      .toArray();
    res.json(results);
  } catch (error) {
    console.error("Error fetching yearly sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getMonthlyGrowthRate(req, res) {
  try {
    const db = await getDatabase();

    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$created_at" } },
            month: { $month: { $toDate: "$created_at" } },
          },
          total_sales: { $sum: { $toDouble: "$total_price" } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $group: {
          _id: "$_id.year",
          monthlySales: {
            $push: { month: "$_id.month", total_sales: "$total_sales" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          monthlySales: 1,
        },
      },
      {
        $addFields: {
          growthRates: {
            $map: {
              input: {
                $slice: [
                  "$monthlySales",
                  1,
                  { $subtract: [{ $size: "$monthlySales" }, 1] },
                ],
              },
              as: "current",
              in: {
                year: "$year",
                month: "$$current.month",
                growthRate: {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $subtract: [
                            "$$current.total_sales",
                            {
                              $arrayElemAt: [
                                "$monthlySales.total_sales",
                                {
                                  $indexOfArray: [
                                    "$monthlySales.month",
                                    { $subtract: ["$$current.month", 1] },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          $arrayElemAt: [
                            "$monthlySales.total_sales",
                            {
                              $indexOfArray: [
                                "$monthlySales.month",
                                { $subtract: ["$$current.month", 1] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    100,
                  ],
                },
              },
            },
          },
        },
      },
      { $unwind: "$growthRates" },
      {
        $project: {
          _id: 0,
          year: "$growthRates.year",
          month: "$growthRates.month",
          growthRate: "$growthRates.growthRate",
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];

    const results = await db
      .collection("shopifyOrders")
      .aggregate(pipeline)
      .toArray();
    res.json(results);
  } catch (error) {
    console.error("Error fetching monthly growth rate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getTotalSales,
  getDailySales,
  getQuarterlySales,
  getYearlySales,
  getMonthlyGrowthRate,
};
