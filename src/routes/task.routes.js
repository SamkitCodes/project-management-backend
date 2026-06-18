import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../contollers/task.controller.js";
import {
  verifyJWT,
  verifyProjectPermission,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

// Mounted at /api/v1/projects/:projectId/tasks
const projectTaskRouter = Router({ mergeParams: true });

projectTaskRouter.use(verifyJWT);

projectTaskRouter
  .route("/")
  .get(verifyProjectPermission(AvailableUserRole), getTasks)
  .post(
    verifyProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    upload.array("attachments", 5),
    createTask,
  );

// Mounted at /api/v1/tasks
const taskRouter = Router();

taskRouter.use(verifyJWT);

taskRouter
  .route("/:taskId")
  .get(getTaskById)
  .put(upload.array("attachments", 5), updateTask)
  .delete(deleteTask);

taskRouter
  .route("/:taskId/subtasks")
  .post(createSubTask);

taskRouter
  .route("/:taskId/subtasks/:subtaskId")
  .put(updateSubTask)
  .delete(deleteSubTask);

export { projectTaskRouter, taskRouter };
