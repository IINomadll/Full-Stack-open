import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

// HTTP GET
const getAll = () => axios.get(baseUrl);

// HTTP POST
const create = (newObject) => axios.post(baseUrl, newObject);

// HTTP DELETE
const eradicate = (id) => axios.delete(`${baseUrl}/${id}`);

// HTTP UPDATE
const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject);

export default { getAll, create, eradicate, update };
