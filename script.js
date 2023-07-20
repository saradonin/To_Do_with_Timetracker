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
    if (status == 'open') {
        const finishButton = addDOMElement(headerRightDiv, "button", "btn btn-dark btn-sm js-task-open-only", "Finish");
    }
    const deleteButton = addDOMElement(headerRightDiv, "button", "btn btn-outline-danger btn-sm ml-2", "Delete");

    // operations list
    const operationsList = addDOMElement(section, "ul", "list-group list-group-flush");

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

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks' + taskId + "/operations",
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


/*
events and function calls
 */

document.addEventListener('DOMContentLoaded', function () {


    apiListTasks().then(
        function (response) {
            // "response" zawiera obiekt z kluczami "error" i "data" (zob. wyżej)
            // "data" to tablica obiektów-zadań
            // uruchamiamy funkcję renderTask dla każdego zadania jakie dał nam backend
            response.data.forEach(
                function (task) {
                    renderTask(task.id, task.title, task.description, task.status);
                }
            );
        }
    );


    // apiCreateTask('Przykładowy tytuł', 'Przykładowy opis').then(
    //     function (response) {
    //         console.log('Odpowiedź z serwera to:', response);
    //     }
    // );


});
