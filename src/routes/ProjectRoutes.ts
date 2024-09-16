import { Router } from "express"
import { ProjectController } from "../controllers/ProjectController"
import { body, param } from "express-validator"
import { handleInputErrors } from "../middleware/validation"
import { TaskController } from "../controllers/TaskController"
import { projectExists } from "../middleware/project"
import { taskAuthorization, taskBelongsToProject, taskExists } from "../middleware/task"
import { authenticate } from "../middleware/auth"
import { TeamMemberController } from "../controllers/TeamController"
import { NoteController } from "../controllers/NoteController"

const router = Router()

router.use(authenticate)

/// Routes for Projects ///
router.get("/", ProjectController.getAllProjects)
router.get("/:id",
    param("id").isMongoId().withMessage("Id no válido"),
    handleInputErrors,
    ProjectController.getProjectById)


router.param("projectId", projectExists)


router.put("/:projectId",
    param("projectId").isMongoId().withMessage("Id no válido"),
    body("projectName").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description").notEmpty().withMessage("La descripción es obligatoria"),
    handleInputErrors,
    taskAuthorization,
    ProjectController.updateProjectById)
router.post("/",
    body("projectName").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description").notEmpty().withMessage("La descripción es obligatoria"),
    handleInputErrors,
    ProjectController.createProject)
router.delete("/:projectId",
    param("projectId").isMongoId().withMessage("Id no válido"),
    handleInputErrors,
    ProjectController.deleteProject)


/// Routes of Tasks ///



router.post("/:projectId/tasks",
    taskAuthorization,
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description").notEmpty().withMessage("La descripción de la tarea es obligatoria"),
    handleInputErrors,
    TaskController.createTask
)

router.get("/:projectId/tasks",
    TaskController.getProjectTask
)

router.param("taskId", taskExists)
router.param("taskId", taskBelongsToProject)


router.get("/:projectId/tasks/:taskId",
    param("taskId").isMongoId().withMessage("Id no válido"),
    handleInputErrors,
    TaskController.getProjectTaskById
)

router.put("/:projectId/tasks/:taskId",
    taskAuthorization,
    param("taskId").isMongoId().withMessage("Id no válido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description").notEmpty().withMessage("La descripción de la tarea es obligatoria"),
    handleInputErrors,
    TaskController.updateTask

)

router.delete("/:projectId/tasks/:taskId",
    taskAuthorization,
    param("taskId").isMongoId().withMessage("Id no válido"),
    handleInputErrors,
    TaskController.deleteTask
)

router.post("/:projectId/tasks/:taskId/status",
    param("taskId").isMongoId().withMessage("Id no válido"),
    body("status").notEmpty().withMessage("El estado es obligatorio"),
    handleInputErrors,
    TaskController.updateStatus
)

// Routes Teams //


router.get("/:projectId/team", TeamMemberController.getProjectTeam)

router.post("/:projectId/team/find",
    body("email").isEmail().withMessage("Email no válido"),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.post("/:projectId/team",
    body("id").isMongoId().withMessage("Id no válido"),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete("/:projectId/team/:userId",
    param("userId").isMongoId().withMessage("Id no válido"),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

// Notes routes//

router.post("/:projectId/tasks/:taskId/notes",
    body("content").notEmpty().withMessage("El contenido de la nota es obligatorio"),
    handleInputErrors,
    NoteController.createNote


)

router.get("/:projectId/tasks/:taskId/notes",
    NoteController.getNotes
)

router.delete("/:projectId/tasks/:taskId/notes/:noteId",
    param("noteId").isMongoId().withMessage("Id no válido"),
    handleInputErrors,
    NoteController.removeNote
)




export default router