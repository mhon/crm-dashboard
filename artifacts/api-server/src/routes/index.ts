import { Router, type IRouter } from "express";
import healthRouter from "./health";
import customersRouter from "./customers";
import ordersRouter from "./orders";
import notesRouter from "./notes";
import dashboardRouter from "./dashboard";
import companiesRouter from "./companies";
import leadsRouter from "./leads";
import tasksRouter from "./tasks";
import aiRouter from "./ai";
import analyticsRouter from "./analytics";
import workflowsRouter from "./workflows";

const router: IRouter = Router();

router.use(healthRouter);
router.use(customersRouter);
router.use(ordersRouter);
router.use(notesRouter);
router.use(dashboardRouter);
router.use(companiesRouter);
router.use(leadsRouter);
router.use(tasksRouter);
router.use("/ai", aiRouter);
router.use("/analytics", analyticsRouter);
router.use("/workflows", workflowsRouter);

export default router;
