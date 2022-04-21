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

if (localStorage.getItem('apiKey') && localStorage.getItem('projectID')) {
    getTask(apiKey, projectID)
}

function getTask() {
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
        if (todo) {
            document.querySelector('h1').innerText = todo.content
            document.querySelector('p').innerText = todo.description
        } else {
            document.querySelector('h1').innerText = 'Done! Great job.'
        }
    })
    .catch(err => {
        console.log(`error ${err}`)
        });

}