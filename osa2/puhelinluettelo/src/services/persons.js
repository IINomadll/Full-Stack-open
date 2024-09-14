import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

// HTTP GET
const getAll = () => axios.get(baseUrl);

// HTTP POST
const create = (newObject) => axios.post(baseUrl, newObject);

export default { getAll, create };
