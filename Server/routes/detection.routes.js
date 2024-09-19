import { Router } from "express";

import { listDetections, listLastDetections, listDetectionsId } from "../controllers/objects.controller.js";

const detectionRoutes = Router();


// http://localhost:4242/api/detections
detectionRoutes.get("/", listDetections);
// http://localhost:4242/api/detections/:id
detectionRoutes.get("/history/:id", listDetectionsId);
// http://localhost:4242/api/detections/recent
detectionRoutes.get("/recent", listLastDetections);


export { detectionRoutes };
