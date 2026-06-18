import { Router } from "express";
import {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMembersToProject,
  getMembersProject,
  updateProjectMemberRole,
  removeProjectMember,
} from "../contollers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  verifyJWT,
  verifyProjectPermission,
} from "../middlewares/auth.middleware.js";
import {
  createProjectValidator,
  addProjectMemberValidator,
} from "../validators/index.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();

export default router;

router.use(verifyJWT);

router
  .route("/")
  .get(getAllProjects)
  .post(createProjectValidator(), validate, createProject);
router

  .route("/:projectId")
  .get(verifyProjectPermission(AvailableUserRole), getProjectById)
  .put(
    verifyProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(verifyProjectPermission([UserRolesEnum.ADMIN]), deleteProject);

router
  .route("/:projectId/members")
  .get(getMembersProject)
  .post(
    verifyProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    addProjectMemberValidator(),
    validate,
    addMembersToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(verifyProjectPermission([UserRolesEnum.ADMIN]), updateProjectMemberRole)
  .delete(verifyProjectPermission([UserRolesEnum.ADMIN]), removeProjectMember);

export { router as projectRouter };
