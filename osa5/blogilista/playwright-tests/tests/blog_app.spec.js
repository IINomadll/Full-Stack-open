const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Jarskibastian Lehtipihvinen",
        username: "jarski69",
        password: "salainen",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Login to application")).toBeVisible();
    await expect(page.getByText("username:")).toBeVisible();
    await expect(page.getByText("password:")).toBeVisible();
    await expect(
      page.locator("input", { name: "Username" }).first()
    ).toBeVisible();
    await expect(
      page.locator("input", { name: "Password" }).last()
    ).toBeVisible();
    await expect(page.locator("button", { name: "login" })).toBeVisible();
  });
});
