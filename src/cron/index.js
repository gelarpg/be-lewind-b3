const CronJob = require("node-cron");
const { generateDashboardOrders } = require("../controllers/api/dashboard");

exports.initScheduledJobs = () => {
    const jobDahsboardTotal = CronJob.schedule("0 00 * * *", () => {
        console.log("[DASHBOARD]: START CRON DASHBOARD")
        generateDashboardOrders();
    });

    // const jobAnggaranTotal = CronJob.schedule("*/5 * * * *", () => {
    //     console.log("START CRON ANGGARAN")
    //     calculateTotalInput
    // });

    jobDahsboardTotal.start();
}