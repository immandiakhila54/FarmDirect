import { Router, type IRouter } from "express";
import healthRouter from "./health";
import farmdirectRouter from "./farmdirect";

const router: IRouter = Router();

router.use(healthRouter);
router.use(farmdirectRouter);

export default router;
