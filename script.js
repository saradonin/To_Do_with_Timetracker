const apikey = '93a5a0f8-07f6-41f7-ab39-c61a1207f499';
const apihost = 'https://todo-api.coderslab.pl';

/*
functions definitions
 */

function apiListTasks() {
    // GET method
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + "/operations",
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

function convertTime(minutesTotal) {
    let hours = Math.floor(minutesTotal / 60);
    const min = minutesTotal % 60;
    if (hours === 0) {
        return min
    }
    return hours + "h " + min
}

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

function renderTask(taskId, title, description, status) {
    // main task section
    const main = document.querySelector('main');
    const section = addDOMElement(main, "section", "card mt-5 shadow-sm");

    // headers
    const headerDiv = addDOMElement(section, "div", "card-header d-flex justify-content-between align-items-center");
    const headerLeftDiv = addDOMElement(headerDiv, "div");
    const h5 = addDOMElement(headerLeftDiv, "h5", null, title);
    const h6 = addDOMElement(headerLeftDiv, "h6", "card-subtitle text-muted", description);
    const headerRightDiv = addDOMElement(headerDiv, "div");

    // task control buttons
    if (status == "open") {
        const finishButton = addDOMElement(headerRightDiv, "button", "btn btn-dark btn-sm js-task-open-only", "Finish");
    }
    const deleteButton = addDOMElement(headerRightDiv, "button", "btn btn-outline-danger btn-sm ml-2", "Delete");
    deleteButton.addEventListener("click", function () {
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
                    renderOperation(operationsList, status, operation.id, operation.description, convertTime(operation.timeSpent));
                }
            );
        }
    )

    // add operations form
    const inputDiv = addDOMElement(section, "div", "card-body");
    const operationsForm = addDOMElement(inputDiv, "form");
    const formInputGroup = addDOMElement(operationsForm, "div", "input-group");
    const inputField = addDOMElement(formInputGroup, "input", "form-control");
    inputField.type = 'text';
    inputField.minLength = '5';
    inputField.placeholder = 'Operations description';
    const addOpButtonDiv = addDOMElement(formInputGroup, "div", "input-group-append");
    const addOpButton = addDOMElement(addOpButtonDiv, "button", "btn btn-info", "Add");
}


function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {

    const li = addDOMElement(operationsList, "li", "list-group-item d-flex justify-content-between align-items-center");
    const descriptionDiv = addDOMElement(li, "div", null, operationDescription);
    const time = addDOMElement(descriptionDiv, "span", "badge badge-success badge-pill ml-2", timeSpent + 'm');


    if (status == "open") {
        const buttonsDiv = addDOMElement(li, "div", "js-task-open-only");
        const plus15minButton = addDOMElement(buttonsDiv, "button", "btn btn-outline-success btn-sm mr-2", "+15m");
        const plus1hButton = addDOMElement(buttonsDiv, "button", "btn btn-outline-success btn-sm mr-2", "+1h");
        const deleteOpButton = addDOMElement(buttonsDiv, "button", "btn btn-outline-danger btn-sm", "Delete");
    }

}

function apiCreateTask(title, description) {
    // uses POST method
    return fetch(
        apihost + '/api/tasks',
        {
            method: "POST",
            headers: {
                'Authorization': apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: title, description: description, status: 'open'})
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

// TODO in progress
function apiCreateOperationForTask(taskId, description) {
    // uses POST method
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
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
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            method: "DELETE",
            headers: {
                'Authorization': apikey,
            },
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

/*
events and function calls
 */

document.addEventListener('DOMContentLoaded', function () {


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

    // handling of adding new task
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
        // reload to refresh task list
        location.reload()
    })
});
