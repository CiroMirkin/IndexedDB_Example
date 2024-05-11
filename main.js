
const objectStoreName = 'tareas'

const IDBRequest = indexedDB.open('app_de_tareas', 1)
// Verifica si la DB hay que crearla
IDBRequest.addEventListener('upgradeneeded', () =>{
    const db = IDBRequest.result 
    db.createObjectStore(objectStoreName, {
        autoIncrement: true
    })
})

const saveObject = (obj) =>{
    const db = IDBRequest.result
    const IDBTransaction = db.transaction(objectStoreName, 'readwrite')
    const objectStore = IDBTransaction.objectStore(objectStoreName) 
    objectStore.add(obj)

    IDBTransaction.addEventListener('complete', () => console.log('Sin errores al guardar.'))
}

const readObject = async () =>{
    const db = IDBRequest.result
    const IDBTransaction = db.transaction(objectStoreName, 'readonly') 
    const objectStore = IDBTransaction.objectStore(objectStoreName)

    const taskListFragment = document.createDocumentFragment()
    const request = objectStore.openCursor()
    await request.addEventListener('success', (e) =>{
        const cursor = e.target.result
        if(cursor) {
            cursor.continue()

            const task = document.createElement('LI')
            task.setAttribute('class', 'is-size-4')
            task.setAttribute('object-key', cursor.key)
            task.innerHTML = `
            <p>${cursor.value.text}</p>
            <button class="button is-danger">Eliminar</button>
            `
            taskListFragment.appendChild(task)
        } else {
            // En este punto no hay mas tareas
            const taskList = document.getElementById('taskList')
            taskList.innerHTML = ''
            taskList.appendChild(taskListFragment)
        }
    })
}

window.addEventListener('load', () => readObject())

const deleteObject = (objectKey) =>{
    const db = IDBRequest.result
    const IDBTransaction = db.transaction(objectStoreName, 'readwrite')
    const objectStore = IDBTransaction.objectStore(objectStoreName)
    
    objectStore.delete(parseInt(objectKey))
    IDBTransaction.addEventListener('complete', () => console.log("Eliminado"))
}

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
    saveObject(newTask)
    readObject()
})

const taskList = document.getElementById('taskList')
taskList.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
        const objectKey = e.target.parentElement.getAttribute('object-key')
        deleteObject(objectKey)
        readObject()
    }
})
