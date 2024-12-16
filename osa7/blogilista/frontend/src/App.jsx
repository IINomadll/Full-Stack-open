import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/loginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import {
  useNotifyMessage,
  useNotifyError,
} from "./contexts/NotificationContext";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // needed for mutation
  const queryClient = useQueryClient();

  // reusable functions returned by useNotify -custom hooks
  const notifyMessage = useNotifyMessage();
  const notifyError = useNotifyError();

  const blogFormRef = useRef();

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      // react-query updates blog query so that added blog is rendered on screen
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      notifyMessage(`Welcome back ${user.username}`);
    }
  }, []);

  const queryResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });

  if (queryResult.isLoading) return <div>loading data...</div>;

  const blogs = queryResult.data;

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      console.log(`${user.username} logged in`);
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      notifyMessage(`${user.username} successfully logged in`);
    } catch (err) {
      console.error("Error: 401 unauthorized", err);
      notifyError("Wrong username and/or password");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    setUser(null);
    console.log("logged out");
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      newBlogMutation.mutate(blogObject); // saves the blog to db
      notifyMessage(
        `A new blog "${blogObject.title}" by ${blogObject.author} added`
      );
    } catch (error) {
      console.error("Error creating blog:", error);
      notifyError("An error occured while trying to create the blog");
    }
  };

  // sorting blogs in descending order using spreading to maintain
  // immutability of original blogs -array
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h1>Bloglist</h1>
      <Notification />
      {!user && (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <h2>Blogs</h2>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <br />
          {sortedBlogs.map((blog) => (
            <Blog key={blog.id} blog={blog} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
