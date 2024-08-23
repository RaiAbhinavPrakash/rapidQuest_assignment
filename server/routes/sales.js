// routes/sales.js
const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const customerController = require("../controllers/customerController"); // Add this line

router.get("/api/total-sales/monthly", salesController.getTotalSales);
router.get("/api/total-sales/daily", salesController.getDailySales);
router.get("/api/total-sales/quarterly", salesController.getQuarterlySales);
router.get("/api/total-sales/yearly", salesController.getYearlySales);
router.get("/api/sales-growth-rate", salesController.getMonthlyGrowthRate);
router.get("/api/new-customers", customerController.getNewCustomersOverTime);
router.get("/api/repeat-customers", customerController.getRepeatCustomers);
router.get("/api/customer-lifetime-value", customerController.getCustomerLifetimeValue);

module.exports = router;
