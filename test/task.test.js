const request = require("supertest");
const app = require("../app");
const { REORDER_FIELDS } = require("../config/constants");

describe("GET TASKS API", () => {
  test("Should be able to list tasks", async () => {
    const response = await request(app)
      .get("/tasks")
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);

    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe("PAGINATION", () => {
  test("Should return the correct number of tasks per page", async () => {
    const limit = 10;
    const page = 1;

    const response = await request(app)
      .get(`/tasks?page=${page}&limit=${limit}`)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeLessThanOrEqual(limit);
  });

  test("Should return different tasks on different pages", async () => {
    const limit = 10;
    const pageA = 1;
    const pageB = 2;

    const responseA = await request(app)
      .get(`/tasks?page=${pageA}&limit=${limit}`)
      .set("Content-Type", "application/json");
    const responseB = await request(app)
      .get(`/tasks?page=${pageB}&limit=${limit}`)
      .set("Content-Type", "application/json");

    expect(responseA.status).toBe(200);
    expect(responseB.status).toBe(200);
    expect(Array.isArray(responseA.body.data)).toBe(true);
    expect(Array.isArray(responseB.body.data)).toBe(true);

    if (responseA.body.data.length > 0 && responseB.body.data.length > 0) {
      expect(responseA.body.data[0].id).not.toBe(responseB.body.data[0].id);
    }
  });
});

describe("ADD TASK", () => {
  test("Should create a new task", async () => {
    const newTask = [
      {
        title: `Sample new task test ${Date.now()}`,
        details:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, nesciunt.",
      },
    ];

    const response = await request(app)
      .post("/tasks")
      .send({
        data: newTask,
      })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Successfully created task.");
  });
});

describe("UPDATE TASK", () => {
  test("Should update a task", async () => {
    const taskId = "70580522-17cd-4ffd-bc42-169d1ce9c946";

    const taskDetails = {
      details: `This detail was updated at ${new Date()}`,
    };

    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .send({
        data: taskDetails,
      })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully updated task.");
  });
});

describe("DELETE TASK", () => {
  test("Should delete a task", async () => {
    const res = await fetch("http://localhost:3000/tasks/randomId");
    const data = await res.json();

    const sampleId = data.data.id;

    const response = await request(app).delete(`/tasks/${sampleId}`);

    expect(response.status).toBe(200);
  });
});
