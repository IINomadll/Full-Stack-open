const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url, likes) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByLabel("Title:").fill(title);
  await page.getByLabel("Author:").fill(author);
  await page.getByLabel("URL:").fill(url);
  await page.getByLabel("Likes:").fill(likes.toString());

  await page.getByRole("button", { name: "create" }).click();
};

export { loginWith, createBlog };
