class IndexedDB {
    /** 
     * Esta clase facilita el uso de IndexedDB.
     * @param {string} DBName El nombre de la base de datos.
     * @param {string} objectStoreName El nombre del registro donde se guardaran los datos.
     */
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

    /** Este método recibe un objecto el cual sera guardado */
    saveObject(obj) {
        const db = this.DB_Request.result
        const IDBTransaction = db.transaction(this.objectStoreName, 'readwrite')
        const objectStore = IDBTransaction.objectStore(this.objectStoreName)
        objectStore.add(obj)
    
        IDBTransaction.addEventListener('complete', () => console.log('Sin errores al guardar.'))
    }

    /** Este método recibe un callback que recibirá el arreglo u objeto que se allá guardado */
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

    /** Este método recibe la key del objeto que se quiere eliminar y lo elimina */
    deleteObject(objectKey) {
        const db = this.DB_Request.result
        const IDBTransaction = db.transaction(this.objectStoreName, 'readwrite')
        const objectStore = IDBTransaction.objectStore(this.objectStoreName)
    
        objectStore.delete(parseInt(objectKey))
        IDBTransaction.addEventListener('complete', () => console.log("Eliminado"))
    }
}

export default IndexedDB