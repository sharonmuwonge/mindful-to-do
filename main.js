document.addEventListener('DOMContentLoaded', getBackground(), getTask())

function getBackground() {

    let main = document.querySelector('main')
      
      fetch('https://www.colr.org/json/schemes/random/7?scheme_size_limit=>5', {cache: "no-cache"})
        .then(response => response.json())
        .then(result => {
            console.log(result)
            console.log(result.schemes)
            if (result.schemes.length > 0) {
                let colors = result.schemes[0].colors
                main.style.background = `linear-gradient(90deg, #${colors[1]}, #${colors[3]})`
                console.log(colors)
            } else {
                main.style.background = `linear-gradient(90deg, #4b6cb7, #182848)`
            }
        })
        .catch(error => console.log('error', error));
}

function getTask() {

    let apiKey
    let projectID

    if (!localStorage.getItem('apiKey')) {
        apiKey = prompt('Please enter your Todoist API token')
        localStorage.setItem('apiKey', apiKey);
    }

    if (!localStorage.getItem('projectID')) {
        projectID = prompt('Please provide the ID of your single item project')
        localStorage.setItem('projectID', projectID);   
    }

    var myHeaders = new Headers();
    myHeaders.append(`Authorization`, `Bearer ${localStorage.apiKey}`);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    let url = `https://api.todoist.com/rest/v1/tasks/?project_id=${localStorage.projectID}`

    fetch(url, requestOptions)
    .then(res => res.json()) // parse response as JSON
    .then(result => {
        const todo = result[0]
        const doneButton = document.querySelector('#done')

        if (todo) {
            document.querySelector('h1').innerText = todo.content
            document.querySelector('p').innerText = todo.description
            document.querySelector('#done').innerText = 'done!'

            doneButton.addEventListener('click', closeTaskAndRefresh)
            
            localStorage.taskID = todo.id
            
        } else {
            document.querySelector('h1').innerText = 'Done! Great job.'
            document.querySelector('#done').innerText = 'I\'\m ready for something else'

            doneButton.addEventListener('click', addForm)
        }
    })
    .catch(err => {
        console.log(`error ${err}`)
        });
}

function closeTaskAndRefresh() {

    let apiKey

    if (!localStorage.getItem('apiKey')) {
        apiKey = prompt('Please enter your Todoist API token')
        localStorage.setItem('apiKey', apiKey);
    }

    var myHeaders = new Headers();
        myHeaders.append(`Authorization`, `Bearer ${localStorage.apiKey}`);
        myHeaders.append("Cookie", "csrf=1f2f45cf3e044886ad54d4bc5eca773d");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    let url = `https://api.todoist.com/rest/v1/tasks/${localStorage.taskID}/close`

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => location = location)
        .catch(error => console.log('error', error));

}

function addForm() {

    let main = document.querySelector('main')
    
    let taskForm = document.createElement('form')
    taskForm.setAttribute('onSubmit', 'addTaskAndRefresh; return false')
    main.appendChild(taskForm)

    let contentInput = document.createElement('input')
    contentInput.type = 'text'
    contentInput.id = 'contentInput'
    taskForm.appendChild(contentInput)

    let addButton = document.createElement('button')
    addButton.innerText = 'add'
    taskForm.appendChild(addButton)

    taskForm.addEventListener('submit', addTaskAndRefresh)
}

function addTaskAndRefresh() {

    let apiKey
    let taskContent = document.getElementById('contentInput').value
    
    if (!localStorage.getItem('apiKey')) {
        apiKey = prompt('Please enter your Todoist API token')
        localStorage.setItem('apiKey', apiKey);
    } else {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Request-Id", "$(uuidgen)");
        myHeaders.append("Authorization", `Bearer ${localStorage.apiKey}`);
        myHeaders.append("Cookie", "csrf=1f2f45cf3e044886ad54d4bc5eca773d");

    var raw = JSON.stringify({
        "content": taskContent,
        "due_string": "today",
        "due_lang": "en",
        "priority": 4,
        "project_id": localStorage.projectID
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.todoist.com/rest/v1/tasks", requestOptions)
        .then(response => response.json())
        .then(result => location = location)
        .catch(error => console.log('error', error));

    }

}