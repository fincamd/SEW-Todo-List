class Task {

    constructor(number, text) {
        this.number = number;
        this.text = text;
        this.htmlContents = "";
    }

    getNumber() {
        return this.number;
    }

    formatHtmlComponent(htmlStructure) {
        this.htmlContents = htmlStructure;
        while (this.htmlContents.includes("%Number%")) {
            this.htmlContents = this.htmlContents.replace("%Number%", this.number);
        }
        this.htmlContents = this.htmlContents.replace("%Text%", this.text);
    }

    readHtml() {
        return this.htmlContents;
    }

}

class TaskBoard {

    constructor() {
        this.HTML_STRUCTURE_TODO = `
            <div class="task" id="task%Number%">
                <button id="finishedButton" type="button" onclick="taskBoard.moveTaskToFinished('%Number%')">Mover a acabadas</button>
                <p>%Text%</p>
                <button id="removeButton" type="button" onclick="taskBoard.removeTaskFromTodo('%Number%')">Eliminar</button>
            </div>
        `;
        this.HTML_STRUCTURE_FINISHED = `
            <div class="task" id="task%Number%">
                <button id="finishedButton" type="button" onclick="taskBoard.moveTaskToTodo('%Number%')">Mover a por hacer</button>
                <p>%Text%</p>
                <button id="removeButton" type="button" onclick="taskBoard.removeTaskFromFinished('%Number%')">Eliminar</button>
            </div>
        `;
        this.numberOfTasks = 0;
        this.todoTasks = new Array();
        this.finishedTasks = new Array();
    }

    createNewTask() {
        var taskInput = document.getElementById("newTaskInput");
        if (taskInput.value != "") {
            var task = new Task(++this.numberOfTasks, taskInput.value);
            task.formatHtmlComponent(this.HTML_STRUCTURE_TODO);
            this.todoTasks.push(task);
            this.printTasks();
            taskInput.value = "";
        } else {
            alert("No se puede añadir una tarea vacía");
        }
    }

    findTask(taskNumber, taskList) {
        var taskToRemove = undefined;
        for (var task in taskList) {
            if (taskList[task].getNumber() == taskNumber) {
                taskToRemove = taskList[task];
                break;
            }
        }
        return taskToRemove;
    }

    moveTaskToFinished(taskNumber) {
        var taskToMove = this.findTask(taskNumber, this.todoTasks);
        this.removeTaskFromTodo(taskNumber);
        taskToMove.formatHtmlComponent(this.HTML_STRUCTURE_FINISHED);
        this.finishedTasks.push(taskToMove);
        this.printTasks();
    }

    moveTaskToTodo(taskNumber) {
        var taskToMove = this.findTask(taskNumber, this.finishedTasks);
        this.removeTaskFromFinished(taskNumber);
        taskToMove.formatHtmlComponent(this.HTML_STRUCTURE_TODO);
        this.todoTasks.push(taskToMove);
        this.printTasks();
    }

    removeTaskFromTodo(taskNumber) {
        this.removeTask(taskNumber, this.todoTasks);
    }

    removeTaskFromFinished(taskNumber) {
        this.removeTask(taskNumber, this.finishedTasks);
    }

    removeTask(taskNumber, taskList) {
        var taskToRemove = this.findTask(taskNumber, taskList);
        if (taskToRemove !== undefined) {
            var index = taskList.indexOf(taskToRemove);
            taskList.splice(index, 1);
        }
        this.printTasks();
    }

    printTasks() {
        var temp = "";
        var taskList = document.getElementById("todoTaskList");
        for (var task in this.todoTasks) {
            temp += this.todoTasks[task].readHtml();
        }
        taskList.innerHTML = temp;
        temp = "";
        taskList = document.getElementById("finishedTaskList");
        for (var task in this.finishedTasks) {
            temp += this.finishedTasks[task].readHtml();
        }
        taskList.innerHTML = temp;
        this.updateStatistics();
    }

    updateStatistics() {
        var finishedTasks = this.finishedTasks.length;
        var todoTasks = this.todoTasks.length;
        var ratio = finishedTasks + todoTasks != 0 ? ((finishedTasks / (finishedTasks + todoTasks)) * 100) : 0;
        var htmlContent = `
            <p>
                Total de tareas: %Total%<br>
                Tareas sin terminar: %Todo%<br>
                Tareas acabadas: %Finished%<br>
                Porcentaje de tareas terminadas: %TodoToFinishedRatio%
            </p>
        `;
        htmlContent = htmlContent.replace("%Total%", finishedTasks + todoTasks);
        htmlContent = htmlContent.replace("%Todo%", todoTasks); 
        htmlContent = htmlContent.replace("%Finished%", finishedTasks);
        htmlContent = htmlContent.replace("%TodoToFinishedRatio%", ratio.toFixed(2) + '%');
        document.getElementById("statistics").innerHTML = htmlContent;
    }

}

const taskBoard = new TaskBoard();