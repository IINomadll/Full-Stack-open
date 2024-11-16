/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders title", () => {
  const blog = {
    title: "test title",
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("test title");
  expect(element).toBeDefined();
});
