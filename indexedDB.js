class IndexedDB {
    constructor(objectStoreName) {
        this.objectStoreName = objectStoreName
    }

    saveObject(obj) {
        const db = IDBRequest.result
        const IDBTransaction = db.transaction(this.objectStoreName, 'readwrite')
        const objectStore = IDBTransaction.objectStore(this.objectStoreName)
        objectStore.add(obj)
    
        IDBTransaction.addEventListener('complete', () => console.log('Sin errores al guardar.'))
    }

    readObject() {
        const db = IDBRequest.result
        const IDBTransaction = db.transaction(this.objectStoreName, 'readonly')
        const objectStore = IDBTransaction.objectStore(this.objectStoreName)
    
        const taskList = []
        const request = objectStore.openCursor()
        request.addEventListener('success', (e) => {
            const cursor = e.target.result
            if (cursor) {
                cursor.continue()
                const task = {
                    key: cursor.key,
                    text: cursor.value.text
                }
                taskList.push(task)
            } else {
                return taskList
            }
        })
    }

    deleteObject(objectKey) {
        const db = IDBRequest.result
        const IDBTransaction = db.transaction(this.objectStoreName, 'readwrite')
        const objectStore = IDBTransaction.objectStore(this.objectStoreName)
    
        objectStore.delete(parseInt(objectKey))
        IDBTransaction.addEventListener('complete', () => console.log("Eliminado"))
    }
}

export default IndexedDB