const { getDatabase } = require("../config/database");

// 1. New Customers Over Time
async function getNewCustomersOverTime(req, res) {
  try {
    const db = await getDatabase();
    const { interval } = req.query; // daily, monthly, yearly

    let groupBy;

    switch (interval) {
      case "daily":
        groupBy = {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $toDate: "$created_at" },
          },
        };
        break;
      case "monthly":
        groupBy = {
          $dateToString: { format: "%Y-%m", date: { $toDate: "$created_at" } },
        };
        break;
      case "yearly":
        groupBy = { $year: { $toDate: "$created_at" } };
        break;
      default:
        return res.status(400).send("Invalid interval");
    }

    const customers = await db
      .collection("shopifyCustomers")
      .aggregate([
        {
          $group: {
            _id: groupBy,
            newCustomers: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    res.json(customers);
  } catch (error) {
    console.error("Error fetching new customers over time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 2. repeat Customers
const convertDateStringToDate = {
  $addFields: {
    createdAtDate: { $dateFromString: { dateString: "$created_at" } }
  }
};

async function getRepeatCustomers(req, res) {
  const { interval } = req.query;

  try {
    const db = await getDatabase();
    
    let pipeline;
    
    switch (interval) {
      case 'daily':
        pipeline = [
          convertDateStringToDate,
          {
            $group: {
              _id: {
                year: { $year: "$createdAtDate" },
                month: { $month: "$createdAtDate" },
                day: { $dayOfMonth: "$createdAtDate" }
              },
              customers: { $addToSet: "$customer.id" }
            }
          },
          {
            $project: {
              _id: 0,
              interval: "$_id",
              repeatCustomers: { $size: { $setUnion: "$customers" } }
            }
          },
          { $sort: { "interval.year": 1, "interval.month": 1, "interval.day": 1 } }
        ];
        break;
        
      case 'monthly':
        pipeline = [
          convertDateStringToDate,
          {
            $group: {
              _id: {
                year: { $year: "$createdAtDate" },
                month: { $month: "$createdAtDate" }
              },
              customers: { $addToSet: "$customer.id" }
            }
          },
          {
            $project: {
              _id: 0,
              interval: "$_id",
              repeatCustomers: { $size: { $setUnion: "$customers" } }
            }
          },
          { $sort: { "interval.year": 1, "interval.month": 1 } }
        ];
        break;
        
      case 'quarterly':
        pipeline = [
          convertDateStringToDate,
          {
            $addFields: {
              quarter: {
                $switch: {
                  branches: [
                    { case: { $lte: [{ $month: "$createdAtDate" }, 3] }, then: 1 },
                    { case: { $lte: [{ $month: "$createdAtDate" }, 6] }, then: 2 },
                    { case: { $lte: [{ $month: "$createdAtDate" }, 9] }, then: 3 }
                  ],
                  default: 4
                }
              }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAtDate" },
                quarter: "$quarter"
              },
              customers: { $addToSet: "$customer.id" }
            }
          },
          {
            $project: {
              _id: 0,
              interval: "$_id",
              repeatCustomers: { $size: { $setUnion: "$customers" } }
            }
          },
          { $sort: { "interval.year": 1, "interval.quarter": 1 } }
        ];
        break;
        
      case 'yearly':
        pipeline = [
          convertDateStringToDate,
          {
            $group: {
              _id: { year: { $year: "$createdAtDate" } },
              customers: { $addToSet: "$customer.id" }
            }
          },
          {
            $project: {
              _id: 0,
              interval: "$_id",
              repeatCustomers: { $size: { $setUnion: "$customers" } }
            }
          },
          { $sort: { "interval.year": 1 } }
        ];
        break;
        
      default:
        return res.status(400).json({ error: "Invalid interval" });
    }
    
    const results = await db.collection("shopifyOrders").aggregate(pipeline).toArray();
    res.json(results);

  } catch (error) {
    console.error("Error fetching repeat customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// 3. Customer Lifetime Value (CLV)
async function getCustomerLifetimeValue(req, res) {
  try {
    const db = await getDatabase();

    const pipeline = [
      {
        $lookup: {
          from: "shopifyOrders",
          localField: "id",
          foreignField: "customer.id",
          as: "orders"
        }
      },
      {
        $addFields: {
          totalSpent: {
            $sum: {
              $map: {
                input: "$orders",
                as: "order",
                in: { $toDouble: "$$order.total_price" }
              }
            }
          },
          firstPurchaseDate: {
            $min: {
              $map: {
                input: "$orders",
                as: "order",
                in: { $dateFromString: { dateString: "$$order.created_at" } }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          first_name: 1,
          last_name: 1,
          email: 1,
          totalSpent: 1,
          firstPurchaseDate: 1
        }
      },
      {
        $sort: { totalSpent: -1 }
      }
    ];

    const results = await db
      .collection("shopifyCustomers")
      .aggregate(pipeline)
      .toArray();

    res.json(results);
  } catch (error) {
    console.error("Error fetching customer lifetime value:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



module.exports = {
  getNewCustomersOverTime,
  getRepeatCustomers,
  getCustomerLifetimeValue,
};
