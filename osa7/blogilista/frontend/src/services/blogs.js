import axios from "axios";

const baseUrl = "/api/blogs";
let token = null;

// when exported, allows other files to set values to 'token'
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const update = async (updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(
    `${baseUrl}/${updatedBlog.id}`,
    updatedBlog,
    config
  );

  return response.data;
};

const eradicate = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  return await axios.delete(`${baseUrl}/${id}`, config);
};

const comment = async ({ id, comment }) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment });
  return response.data;
};

export default { getAll, create, setToken, update, eradicate, comment };
