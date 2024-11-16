import { render, screen, fireEvent } from "@testing-library/react";
// import { vi } from "vitest";
import BlogForm from "./BlogForm";

test("calls createBlog with the right details when a new blog is created", () => {
  const createBlog = vi.fn(); // Mock the createBlog function

  render(<BlogForm createBlog={createBlog} />);

  // Fill in the form fields
  fireEvent.change(screen.getByLabelText(/title:/i), {
    target: { value: "Test Blog Title", name: "title" },
  });
  fireEvent.change(screen.getByLabelText(/author:/i), {
    target: { value: "Test Author", name: "author" },
  });
  fireEvent.change(screen.getByLabelText(/url:/i), {
    target: { value: "http://example.com", name: "url" },
  });
  fireEvent.change(screen.getByLabelText(/likes:/i), {
    target: { value: 5, name: "likes" },
  });

  // Submit the form
  fireEvent.submit(screen.getByRole("button", { name: /create/i }));

  // Assert that createBlog is called once with the correct data
  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://example.com",
    likes: 5,
  });
});
