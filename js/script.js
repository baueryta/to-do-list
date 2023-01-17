"use strict";

// Elemente im DOM
let addButton = document.querySelector("#addInput");
let inputName = document.querySelector(".listInput");
let tableBody = document.querySelector("#liste tbody");
let randomTask = document.querySelector(".randomTask");

let taskListObjectId = 'taskList';
let taskList;


// 1. XHR-Objekt erstellen
let xhr = new XMLHttpRequest();

// 2. Event-Handler definieren
xhr.onload = function() {
    if (xhr.status != 200) {
        container.textContent = "Allgemeiner Verarbeitungsfehler";
        return;
    }

    // Browserweiche
    let jsonData;
    if (xhr.responseType == "json") jsonData = xhr.response;
    else jsonData = JSON.parse(xhr.responseText);

    console.log(jsonData);

    // Verarbeitung der Daten 
    let taskJson = jsonData.taskList;
    console.log(taskJson);

    for (let i = 0; i < taskJson.length; i++) {
        let task = taskJson[i];
        addToList(task.description, task.done);
    };

};

// 3. Request öffnen / formulieren
xhr.open("GET", "./taskList.json");

// 4. Request konfigurieren
xhr.responseType = "json";

// 5. Request absenden
xhr.send();

if(localStorage.getItem(taskListObjectId))
taskList = JSON.parse(localStorage.getItem(taskListObjectId));
console.log(taskList);

let randomText; 
    if (taskList.length == 0) {randomText = "einem Kaffee"}
    else {randomText = taskList[Math.floor(Math.random()*(taskList.length))].descriptioin};

randomTask.append(randomText);

let addToList = function(value, done) {

    let listTd = document.createElement("td");
    listTd.textContent = value;

    let buttonTd = document.createElement("td");

    buttonTd.append (createButton("X", "toArchive"), createButton("🗸", "done", done));

    let tableRow = document.createElement("tr");
    tableRow.append(listTd, buttonTd);
    tableBody.append(tableRow);
}

let displayTable = function() {
    if (!localStorage.getItem(taskListObjectId)) { localStorage.setItem(taskListObjectId, JSON.stringify([])); }


    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        addToList(task.descriptioin, task.done);
    };
}

displayTable();

let addToListHandler = function() {
    let taskDescription = inputName.value;
    addToList(taskDescription);

    console.log(taskDescription);

    taskList = JSON.parse(localStorage.getItem(taskListObjectId));
    taskList.push({'descriptioin': taskDescription, 'done': false });
    localStorage.setItem(taskListObjectId, JSON.stringify(taskList));
}

addButton.addEventListener("click", addToListHandler);


function createButton(content, klasse, toggle) {
    let button = document.createElement("button");
    button.textContent = content;
    button.className = klasse;

    if (toggle) {
        button.classList.toggle("doneToggle");
    }

    let eventFunction, currentRow;
    switch (klasse) {
        case "toArchive":
            eventFunction = function() {
                currentRow = this.parentNode.parentNode;
                currentRow.remove();
                let text = this.parentElement.parentElement.firstElementChild.textContent;

                for (let i = 0; i < taskList.length; i++) {
                    let task = taskList[i];
                    if (task.descriptioin == text) {
                        taskList.splice(i, 1);
                        break;
                    };
                    
                };
                localStorage.setItem(taskListObjectId, JSON.stringify(taskList));
            };
            break;
        case "done":
            eventFunction = function() {
                button.classList.toggle("doneToggle");

                let text = this.parentElement.parentElement.firstElementChild.textContent;

                //Status abspeichern
                taskList = JSON.parse(localStorage.getItem(taskListObjectId));
                for (let i = 0; i < taskList.length; i++) {
                    let task = taskList[i];
                    if (task.descriptioin == text) {
                        task.done = !task.done;
                    }
                };
                localStorage.setItem(taskListObjectId, JSON.stringify(taskList));

            };
    }
    button.addEventListener("click", eventFunction);
    return button;
}