const request = require("supertest");
const app = require("../app");

describe("USE REORDER API ONCE", () => {
  test("Should reorder a task in the list", async () => {
    const res = await fetch("http://localhost:3000/tasks/randomTwoTasks");
    const sampleData = await res.json();

    const taskId = "b2956df0-4e10-403f-becb-a9cc135b5f69";
    const upperPosition = sampleData.data[0].next_position;
    const lowerPosition = sampleData.data[0].position;

    const response = await request(app)
      .put("/tasks/reorder")
      .send({
        data: {
          id: taskId,
          upper_position: upperPosition,
          lower_position: lowerPosition,
        },
      })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
  });
});

// not a practical test
//   test("Should handle 50+ moves and move more than one task away", async (done) => {
//     // const testSampleResponse = await request(app)
//     //   .get("/randomId")
//     //   .set("Content-Type", "application/json");

//     // console.log("res", testSampleResponse.body);

//     const taskId = "b2956df0-4e10-403f-becb-a9cc135b5f69";
//     let upperPosition = getRandomBetween(9000000, 11000000);
//     let lowerPosition = getRandomBetween(7000000, 9000000);

//     for (let i = 0; i <= 50; i++) {
//       let newPosition;

//       if (i % 10 === 0) {
//         // Every 10 moves, force a large jump
//         newPosition = getRandomBetween(
//           lowerPosition - 20000,
//           upperPosition + 20000
//         );
//       } else {
//         // Normal move between two positions
//         newPosition = (lowerPosition + upperPosition) / 2;
//       }

//       const response = await request(app)
//         .post("/tasks/reorder")
//         .send({
//           data: {
//             id: taskId,
//             upper_position: upperPosition,
//             lower_position: lowerPosition,
//           },
//         })
//         .set("Content-Type", "application/json");
//       console.log({
//         responseStatus: response.status,
//         index: i,
//         newPos: newPosition,
//       });

//       expect(response.status).toBe(200);

//       upperPosition = getRandomBetween(newPosition, upperPosition + 5000);
//       lowerPosition = getRandomBetween(lowerPosition - 5000, newPosition);
//     }
//   }, 10000);
// });
