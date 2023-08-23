# To-Do App
***
This is a simple To-Do app that allows you to manage your tasks and track time spent on operations associated with each task. The app is built using HTML, CSS, and JavaScript for the front-end, and it communicates with a RESTful API to manage tasks and operations on the server side.

## Features

- Create new tasks
- Add operations to tasks
- Mark tasks as finished
- Delete tasks and operations
- Track time spent on operations

## Getting Started

1. Clone the repository to your local machine:


2. Open the `index.html` file in your web browser to use the app.

## API Documentation

The app communicates with a RESTful API hosted at: [https://todo-api.coderslab.pl](https://todo-api.coderslab.pl)

You will need an API key to authenticate your requests. The API key should be placed in the `apikey` variable in the `script.js` file.

### Endpoints

- `GET /api/tasks`: Retrieve a list of tasks.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/{task_id}`: Update a task's details.
- `DELETE /api/tasks/{task_id}`: Delete a task.

- `GET /api/tasks/{task_id}/operations`: Retrieve a list of operations for a task.
- `POST /api/tasks/{task_id}/operations`: Create a new operation for a task.
- `PUT /api/operations/{operation_id}`: Update an operation's details.
- `DELETE /api/operations/{operation_id}`: Delete an operation.

Please replace `{task_id}` and `{operation_id}` with the actual task and operation IDs.

## Dependencies

- None. The app uses only HTML, CSS, and JavaScript.

![to_do_app](https://github.com/saradonin/To_Do_with_Timetracker/assets/124811561/15bec51f-5229-45d0-90e6-6bc29d385f38)

