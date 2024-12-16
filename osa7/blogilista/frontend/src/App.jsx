import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/loginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/users";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import Users from "./pages/UsersPage";
import User from "./pages/UserPage";
import BlogPage from "./pages/BlogPage";
import {
  useNotifyMessage,
  useNotifyError,
} from "./contexts/NotificationContext";
import { useUserValue, useUserDispatch } from "./contexts/UserContext";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const user = useUserValue();
  const userDispatch = useUserDispatch();

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
      queryClient.invalidateQueries({ queryKey: ["blogsAndUsers"] });
    },
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "LOGIN", payload: user });
      blogService.setToken(user.token);
    }
  }, [userDispatch]);

  // get both blogs and users using useQuery and Promise.all
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blogsAndUsers"],
    queryFn: async () => {
      const [blogs, users] = await Promise.all([
        blogService.getAll(),
        userService.getAll(),
      ]);
      return { blogs, users };
    },
  });

  if (isLoading) return <div>loading data...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const { blogs, users } = data;

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
      userDispatch({ type: "LOGIN", payload: user });
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
    userDispatch({ type: "LOGOUT" });
    console.log("logged out");
    notifyMessage("Successfully logged out");
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

  const padding = {
    padding: 5,
  };

  const marginBottom = {
    marginBottom: 15,
  };

  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          Blogs
        </Link>
        <Link style={padding} to="/users">
          Users
        </Link>
      </div>
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
            <Routes>
              <Route path="/users/:id" element={<User users={users} />} />
              <Route path="/blogs/:id" element={<BlogPage blogs={blogs} />} />
              <Route path="/users" element={<Users users={users} />} />
              <Route
                path="/"
                element={
                  <>
                    <h2>Blogs</h2>
                    <Togglable buttonLabel="new blog" ref={blogFormRef}>
                      <BlogForm createBlog={addBlog} />
                    </Togglable>
                    <br />
                    {sortedBlogs.map((blog) => (
                      <Blog key={blog.id} blog={blog} user={user} />
                    ))}
                  </>
                }
              />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
