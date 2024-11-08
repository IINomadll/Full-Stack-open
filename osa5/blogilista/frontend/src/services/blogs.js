import axios from "axios";

const baseUrl = "/api/blogs";
let token = null;

// when exported, allows other files to set values to 'token'
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  console.log(newBlog, config);
  const response = await axios.post(baseUrl, newBlog, config);
  console.log(response.data);
  return response.data;
};

export default { getAll, create, setToken };
