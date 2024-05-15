class IndexedDB {
    constructor(DBName, objectStoreName) {
        this.objectStoreName = objectStoreName
        this.DB_Request = indexedDB.open(DBName, 1)
        this.DB_Request.addEventListener('upgradeneeded', () =>{
            const db = this.DB_Request.result 
            db.createObjectStore(objectStoreName, {
                autoIncrement: true
            })
        })
    }

    saveObject(obj) {
        const db = this.DB_Request.result
        const IDBTransaction = db.transaction(this.objectStoreName, 'readwrite')
        const objectStore = IDBTransaction.objectStore(this.objectStoreName)
        objectStore.add(obj)
    
        IDBTransaction.addEventListener('complete', () => console.log('Sin errores al guardar.'))
    }

    readObject(showCallBack) {
        const db = this.DB_Request.result
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
                showCallBack(taskList)
                return taskList
            }
        })
    }

    deleteObject(objectKey) {
        const db = this.DB_Request.result
        const IDBTransaction = db.transaction(this.objectStoreName, 'readwrite')
        const objectStore = IDBTransaction.objectStore(this.objectStoreName)
    
        objectStore.delete(parseInt(objectKey))
        IDBTransaction.addEventListener('complete', () => console.log("Eliminado"))
    }
}

export default IndexedDB