import axios from 'axios'
const baseUrl = "http://localhost:3001/persons"

const getAll = async () => {
    const request = axios.get(baseUrl)
    const resp = await request
    console.log(resp.data);
    return resp.data
}
 
const create = async newThing => {
    const request = axios.post(baseUrl, newThing)

    console.log(request);
    const resp = await request

    console.log(resp);

    return resp.data
}  

const update = async (newThing, id) => {
    
    const request = axios.put(`${baseUrl}/${id}`, newThing)
    const resp = await request

    return resp
}

const remove = async id => {
    const request = axios.delete(`${baseUrl}/${id}`)

    return request.then(response => {
        console.log(`person #${id} deleted`);
    }).catch(code => {
        console.log("Deletion failed");
        console.log(code);
    })
}

export default {
    getAll: getAll,
    create: create,
    update: update,
    remove: remove
}