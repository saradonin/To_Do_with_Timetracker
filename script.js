const apikey = '93a5a0f8-07f6-41f7-ab39-c61a1207f499';
const apihost = 'https://todo-api.coderslab.pl';


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

function renderTask(taskId, title, description, status) {
  const section = document.createElement('section');
  section.className = 'card mt-5 shadow-sm';
  document.querySelector('main').appendChild(section);

  const headerDiv = document.createElement('div');
  headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
  section.appendChild(headerDiv);

  const headerLeftDiv = document.createElement('div');
  headerDiv.appendChild(headerLeftDiv);

  const h5 = document.createElement('h5');
  h5.innerText = title;
  headerLeftDiv.appendChild(h5);

  const h6 = document.createElement('h6');
  h6.className = 'card-subtitle text-muted';
  h6.innerText = description;
  headerLeftDiv.appendChild(h6);

  const headerRightDiv = document.createElement('div');
  headerDiv.appendChild(headerRightDiv);
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

//
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
