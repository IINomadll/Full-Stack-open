import { Link } from "react-router-dom";

const Users = ({ users }) => {
  const style = {
    paddingLeft: 5,
    border: "solid",
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    listStyleType: "none",
  };

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Users;
