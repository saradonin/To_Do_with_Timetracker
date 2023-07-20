const apikey = '93a5a0f8-07f6-41f7-ab39-c61a1207f499';
const apihost = 'https://todo-api.coderslab.pl';

/*
function definitions
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
    // const section = document.createElement('section');
    // section.className = 'card mt-5 shadow-sm';
    // document.querySelector('main').appendChild(section);
    const main = document.querySelector('main');
    const section = addDOMElement(main, "section", "card mt-5 shadow-sm");

    // headers

    // const headerDiv = document.createElement('div');
    // headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    // section.appendChild(headerDiv);
    const headerDiv = addDOMElement(section, "div", "card-header d-flex justify-content-between align-items-center");

    // const headerLeftDiv = document.createElement('div');
    // headerDiv.appendChild(headerLeftDiv);
    const headerLeftDiv = addDOMElement(headerDiv, "div");

    // const h5 = document.createElement('h5');
    // h5.innerText = title;
    // headerLeftDiv.appendChild(h5);
    const h5 = addDOMElement(headerLeftDiv, "h5", null, title);

    // const h6 = document.createElement('h6');
    // h6.className = 'card-subtitle text-muted';
    // h6.innerText = description;
    // headerLeftDiv.appendChild(h6);
    const h6 = addDOMElement(headerLeftDiv, "h6", "card-subtitle text-muted", description);


    // const headerRightDiv = document.createElement('div');
    // headerDiv.appendChild(headerRightDiv);
    const headerRightDiv = addDOMElement(headerDiv, "div");

    // task control buttons
    if (status == 'open') {
        // const finishButton = document.createElement('button');
        // finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        // finishButton.innerText = 'Finish';
        // headerRightDiv.appendChild(finishButton);
        const finishButton = addDOMElement(headerRightDiv, "button", "btn btn-dark btn-sm js-task-open-only", "Finish");
    }

    // const deleteButton = document.createElement('button');
    // deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    // deleteButton.innerText = 'Delete';
    // headerRightDiv.appendChild(deleteButton);
    const deleteButton = addDOMElement(headerRightDiv, "button", "btn btn-outline-danger btn-sm ml-2", "Delete");

    // operations list

    // const operationsList = document.createElement('ul');
    // operationsList.className = 'list-group list-group-flush';
    // section.appendChild(operationsList);
    const operationsList = addDOMElement(section, "ul", "list-group list-group-flush");

    // add operations form

    // const inputDiv = document.createElement('div');
    // inputDiv.className = 'card-body';
    // section.appendChild(inputDiv);
    const inputDiv = addDOMElement(section, "div", "card-body");

    // const operationsForm = document.createElement('form');
    // inputDiv.appendChild(operationsForm);
    const operationsForm = addDOMElement(inputDiv, "form");

    // const formInputGroup = document.createElement('div');
    // formInputGroup.className = 'input-group';
    // operationsForm.appendChild(formInputGroup);
    const formInputGroup = addDOMElement(operationsForm, "div", "input-group");

    // const inputField = document.createElement('input');
    // inputField.className = 'form-control';
    // inputField.type = 'text';
    // inputField.minLength = '5';
    // inputField.placeholder = 'Operations description';
    // formInputGroup.appendChild(inputField);
    const inputField = addDOMElement(formInputGroup, "input", "form-control");
    inputField.type = 'text';
    inputField.minLength = '5';
    inputField.placeholder = 'Operations description';

    // const addOpButtonDiv = document.createElement('div');
    // addOpButtonDiv.className = 'input-group-append';
    // formInputGroup.appendChild(addOpButtonDiv);
    const addOpButtonDiv = addDOMElement(formInputGroup, "div", "input-group-append");


    // const addOpButton = document.createElement('button');
    // addOpButton.className = 'btn btn-info';
    // addOpButton.innerText = 'Add';
    // addOpButtonDiv.appendChild(addOpButton);
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
