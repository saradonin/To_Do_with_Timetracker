const apikey = "93a5a0f8-07f6-41f7-ab39-c61a1207f499";
const apihost = "https://todo-api.coderslab.pl";

/*
general purpose functions
 */

function addDOMElement(parent, tag, classname = null, innerText = null) {
    // DOM element constructor
    const element = document.createElement(tag);
    if (classname) {
        element.className = classname;
    }
    if (innerText) {
        element.innerText = innerText;
    }
    parent.appendChild(element);
    return element
}

function convertTime(timeSpent) {
    // converts time as number to user-friendly string
    let hours = Math.floor(timeSpent / 60);
    const min = timeSpent % 60;
    if (hours === 0) {
        return min + "m"
    }
    return hours + "h " + min + "m"
}

/*
task related functions
 */

function apiListTasks() {
    return fetch(
        apihost + "/api/tasks",
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert("An error occurred while listing tasks. Open devtools and tab Network/Network, and look for the cause.");
            }
            return resp.json();
        }
    )
}

function renderTask(taskId, title, description, status) {
    // renders task section
    const main = document.querySelector('main');
    const section = addDOMElement(main, "section", "card mt-5 shadow-sm");

    // headers
    const headerDiv = addDOMElement(section, "div", "card-header d-flex justify-content-between align-items-center");
    const headerLeftDiv = addDOMElement(headerDiv, "div");
    const h5 = addDOMElement(headerLeftDiv, "h5", null, title);
    const h6 = addDOMElement(headerLeftDiv, "h6", "card-subtitle text-muted", description);
    const headerRightDiv = addDOMElement(headerDiv, "div");

    // task control buttons
    if (status === "open") {
        const finishButton = addDOMElement(headerRightDiv, "button", "btn btn-dark btn-sm js-task-open-only", "Finish");
        finishButton.addEventListener("click", function () {
            apiUpdateTask(taskId, title, description, "closed").then(
                function () {
                    section.querySelectorAll(".js-task-open-only").forEach(function (element) {
                        element.remove()
                    })
                }
            )
        })
    }
    const deleteButton = addDOMElement(headerRightDiv, "button", "btn btn-outline-danger btn-sm ml-2", "Delete");
    deleteButton.addEventListener("click", function () {
        // delete task
        apiDeleteTask(taskId).then(
            section.remove()
        )
    })

    // operations list
    const operationsList = addDOMElement(section, "ul", "list-group list-group-flush");
    apiListOperationsForTask(taskId).then(
        function (response) {
            response.data.forEach(
                function (operation) {
                    renderOperation(operationsList, status, operation.id, operation.description, operation.timeSpent);
                }
            );
        }
    )

    // add operations form
    if (status === "open") {
        const formDiv = addDOMElement(section, "div", "card-body js-task-open-only");
        const operationsForm = addDOMElement(formDiv, "form");
        const formInputGroup = addDOMElement(operationsForm, "div", "input-group");
        const inputField = addDOMElement(formInputGroup, "input", "form-control");
        inputField.type = "text";
        inputField.minLength = '5';
        inputField.placeholder = "Operations description";
        const addOpButtonDiv = addDOMElement(formInputGroup, "div", "input-group-append");
        const addOpButton = addDOMElement(addOpButtonDiv, "button", "btn btn-info", "Add");

        // handles adding new operation to existing task
        addOpButton.addEventListener("click", function (e) {
            e.preventDefault();
            apiCreateOperationForTask(taskId, inputField.value).then(
                function (response) {
                    renderOperation(operationsList, status, response.data.id, response.data.description, response.data.timeSpent)
                }
            )
            inputField.value = ""
        })
    }
}

function apiCreateTask(title, description) {
    return fetch(
        apihost + "/api/tasks",
        {
            method: "POST",
            headers: {
                'Authorization': apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: title, description: description, status: "open"})
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert("An error occurred while creating task. Open devtools and tab Network/Network, and look for the cause.");
            }
            return resp.json();
        }
    )
}

function apiUpdateTask(taskId, title, description, status) {
    return fetch(
        apihost + "/api/tasks/" + taskId,
        {
            method: "PUT",
            headers: {
                Authorization: apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: title, description: description, status: status}),
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert("An error occurred while updating task. Open devtools and tab Network/Network, and look for the cause.");
            }
            return resp.json();
        }
    );
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + "/api/tasks/" + taskId,
        {
            method: "DELETE",
            headers: {
                'Authorization': apikey,
            },
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert("An error occurred while deleting task. Open devtools and tab Network/Network, and look for the cause.");
            }
            return resp.json();
        }
    )
}

/*
operations related functions
 */

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + "/api/tasks/" + taskId + "/operations",
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert("An error occurred while listing operations. Open devtools and tab Network/Network, and look for the cause.");
            }
            return resp.json();
        }
    );
}

function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
    // renders operations section for each task

    const li = addDOMElement(operationsList, "li", "list-group-item d-flex justify-content-between align-items-center");
    const descriptionDiv = addDOMElement(li, "div", null, operationDescription);
    const time = addDOMElement(descriptionDiv, "span", "badge badge-success badge-pill ml-2", convertTime(timeSpent));

    // buttons active for open tasks
    if (status === "open") {
        const buttonsDiv = addDOMElement(li, "div", "js-task-open-only");

        // adds 15 minutes on click
        const plus15minButton = addDOMElement(buttonsDiv, "button", "btn btn-outline-success btn-sm mr-2", "+15m");
        plus15minButton.addEventListener("click", function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(
                function (response) {
                    time.innerText = convertTime(response.data.timeSpent);
                    timeSpent = response.data.timeSpent;
                }
            )
        })
        // adds 60 minutes on click
        const plus1hButton = addDOMElement(buttonsDiv, "button", "btn btn-outline-success btn-sm mr-2", "+1h");
        plus1hButton.addEventListener("click", function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(
                function (response) {
                    time.innerText = convertTime(response.data.timeSpent);
                    timeSpent = response.data.timeSpent;
                }
            )
        })

        // delete operation
        const deleteOpButton = addDOMElement(buttonsDiv, "button", "btn btn-outline-danger btn-sm", "Delete");
        deleteOpButton.addEventListener("click", function () {
            apiDeleteOperation(operationId).then(
                li.remove()
            )
        })
    }
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + "/api/tasks/" + taskId + "/operations",
        {
            method: "POST",
            headers: {
                'Authorization': apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({description: description, timeSpent: 0})
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert("An error occurred while creating operation. Open devtools and tab Network/Network, and look for the cause.");
            }
            return resp.json();
        }
    )
}

function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(
        apihost + "/api/operations/" + operationId,
        {
            method: "PUT",
            headers: {
                'Authorization': apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({description: description, timeSpent: timeSpent})
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert("An error occurred while updating task. Open devtools and tab Network/Network, and look for the cause.");
            }
            return resp.json();
        }
    )
}

function apiDeleteOperation(operationId) {
    return fetch(
        apihost + "/api/operations/" + operationId,
        {
            method: "DELETE",
            headers: {
                'Authorization': apikey,
            },
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert("An error occurred while deleting operation. Open devtools and tab Network/Network, and look for the cause.");
            }
            return resp.json();
        }
    )
}

/*
function calls
 */

document.addEventListener("DOMContentLoaded", function () {

    apiListTasks().then(
        function (response) {
            // render for each task
            response.data.forEach(
                function (task) {
                    renderTask(task.id, task.title, task.description, task.status);
                }
            );
        }
    );

    // handles adding new task
    const newTaskForm = document.querySelector(".js-task-adding-form");
    const newTaskTitle = newTaskForm.querySelector('[name="title"]');
    const newTaskDescription = newTaskForm.querySelector('[name="description"]');
    const newTaskButton = newTaskForm.querySelector("button");

    newTaskButton.addEventListener("click", function (e) {
        e.preventDefault()

        const title = newTaskTitle.value
        const description = newTaskDescription.value

        apiCreateTask(title, description).then(
            function (response) {
                console.log(response)
            }
        )
        // reloads page to refresh task list
        location.reload()
    })
});
