import { render, screen, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

vi.mock("../services/blogs", () => {
  return {
    default: {
      update: vi.fn().mockResolvedValue({
        id: "123",
        title: "Test Blog Title",
        author: "Test Author",
        url: "http://example.com",
        likes: 6,
        user: { name: "Test User", username: "testuser" },
      }),
    },
  };
});

import blogService from "../services/blogs";

test("renders title", () => {
  const blog = {
    title: "test title",
  };

  render(<Blog blog={blog} />);

  // ensure blog title is displayed
  const element = screen.getByText("test title");
  expect(element).toBeDefined();
});

test("renders all blog details when 'view' button is clicked", () => {
  const blog = {
    title: "Test Blog Title",
    author: "Test men",
    url: "http://test.example.com",
    likes: 13,
    user: { name: "Jarski", username: "jarskibastian" },
  };

  const user = { username: "jarskibastian" };
  const setBlogs = vi.fn();

  render(<Blog blog={blog} user={user} blogs={[blog]} setBlogs={setBlogs} />);

  // ensure the minimal view is displayed first
  expect(screen.getByText("Test Blog Title Test men")).toBeDefined();
  expect(screen.queryByText("http://test.example.com")).toBeNull();
  expect(screen.queryByText("likes: 13")).toBeNull();
  expect(screen.queryByText("Jarski")).toBeNull();

  // click the "view" button to show all details
  fireEvent.click(screen.getByText("view"));

  // ensure all blog details are displayed
  expect(screen.getByText("http://test.example.com")).toBeDefined();
  expect(screen.getByText("likes: 13")).toBeDefined();
  expect(screen.getByText("Jarski")).toBeDefined();
});

test("calls handleLike twice when like button is clicked twice", () => {
  const blog = {
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://example.com",
    likes: 5,
    user: { name: "Test User", username: "testuser" },
  };

  const user = { username: "testuser" };
  const setBlogs = vi.fn();

  render(<Blog blog={blog} user={user} blogs={[blog]} setBlogs={setBlogs} />);

  // click the "view" button to show all details
  fireEvent.click(screen.getByText("view"));

  // find the like button and click it twice
  const likeButton = screen.getByText("like");
  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  // verify the `update` function was called twice
  expect(blogService.update).toHaveBeenCalledTimes(2);
});
