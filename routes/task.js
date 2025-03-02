const express = require("express");
const taskController = require("../controllers/taskController");

// middleware
const {
  checkRequiredFields,
  checkRequiredArrayFields,
  checkOptionalFields,
  checkRequiredValues,
} = require("../middlewares/validation");

// constants
const { TASK_FIELDS, REORDER_FIELDS } = require("../config/constants");

const router = express.Router();

router.get("/", taskController.getAllTasks);
router.post(
  "/",
  checkRequiredArrayFields(TASK_FIELDS),
  taskController.createTask
);
router.put(
  "/reorder",
  checkRequiredFields(REORDER_FIELDS),
  checkRequiredValues(REORDER_FIELDS),
  taskController.reorderTask
);
router.put("/:id", checkOptionalFields(TASK_FIELDS), taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// extras for test
router.get("/randomId", taskController.getRandomTask);
router.get("/randomTwoTasks", taskController.getRandomConsecutiveTasks);

module.exports = router;
