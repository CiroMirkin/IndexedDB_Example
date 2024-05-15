import IndexedDB from "./indexedDB.js"

const db = new IndexedDB('app_de_tareas', 'tareas')

const showDB =  (taskList) => {
    const taskListFragment = document.createDocumentFragment()
    
    taskList.forEach(task => {
        const taskElement = document.createElement('LI')
        taskElement.setAttribute('class', 'is-size-4')
        taskElement.setAttribute('object-key', task.key)
        taskElement.innerHTML = `
            <p>${task.text}</p>
            <button class="button is-danger">Eliminar</button>
        `
        taskListFragment.appendChild(taskElement)
    })

    const taskListElement = document.getElementById('taskList')
    taskListElement.innerHTML = ''
    taskListElement.appendChild(taskListFragment)
}
const show  = () => db.readObject(showDB)
window.addEventListener('load', () => show())

const createTaskForm = document.getElementById('createTaskForm')
createTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskDescriptionInput = e.target.elements[0]
    const inputText = taskDescriptionInput.value
    taskDescriptionInput.value = ''
    const newTask = {
        text: inputText,
        done: false
    }
    db.saveObject(newTask)
    show()
})

const taskList = document.getElementById('taskList')
taskList.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
        const objectKey = e.target.parentElement.getAttribute('object-key')
        db.deleteObject(objectKey)
        show()
    }
})
