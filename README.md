# Task Management API

This is a simple Task Management API built using Node.js and Supabase. The API provides endpoints to manage tasks, including creating, updating, deleting, and reordering tasks. It also includes endpoints to fetch random tasks and consecutive tasks.

## Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)

---

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install the dependencies.
4. Add the attached .env file from the email in the root directory.
5. Start the server.

The server will start running on `http://localhost:3000`.

---

## API Endpoints

- Get All Tasks:

  - GET `/tasks`
  - Fetches a paginated list of tasks.
  - Query Parameters: limit (default: 10), page (default: 1).

- Create a Task:
  - POST `/tasks`
  - Request body:
  ```
  {
      "data":[
          {
              "title" : "New Task",
              "details": "Some details"
          }
      ]
  }
  ```
- Update a Task:
  - PUT `/tasks/:id`
  - Request body:
  ```
  {
      "data":{
          "title" : "New Task",
          "details": "Some details"
      }
  }
  ```
- Delete a Task:
  - DELETE `/tasks/:id`
- Reorder a Task:
  - PUT `/tasks/reorder`
  - Request body:
  ```
  {
    "data": {
      "id": 1,
      "upper_position": 20000,
      "lower_position": 10000
    }
  }
  ```

---

## Error Handling

The API handles errors by returning a JSON response with an error message and a 500 status code.

Example error response:

```
{
    "error" : "Some error message."
}
```
