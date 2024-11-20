const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

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
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.locator("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "jarski69", "salainen");
      await expect(
        page.getByText("Jarskibastian Lehtipihvinen logged in")
      ).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "jarski", "salainen");
      await expect(
        page.getByText("Wrong username and/or password")
      ).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "jarski69", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "test title", "testerman", "test.test", 3);
      await expect(page.getByText("test title testerman")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, "dumb title", "dumb author", "this.is.dumb", 0);
      await page
        .locator("p")
        .filter({ hasText: "dumb title dumb author view" })
        .getByRole("button")
        .click();
      await expect(await page.getByText("likes: 0 like")).toBeVisible();
      await page.getByRole("button", { name: "like" }).click();
      await expect(await page.getByText("likes: 1 like")).toBeVisible();
    });

    test("a blog can be deleted by it's creator", async ({ page }) => {
      await createBlog(page, "to be deleted", "yes", "delete.me", 6);
      await page
        .locator("p")
        .filter({ hasText: "to be deleted yes" })
        .getByRole("button")
        .click();

      // Set up an event listener to handle the confirmation dialog
      page.on("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm"); // Ensure it's a confirm dialog

        // Check for the dialog message
        expect(dialog.message()).toBe("Delete blog to be deleted by yes?");
        await dialog.accept(); // Accept the dialog to confirm deletion
      });

      await page.getByRole("button", { name: "delete" }).click();
      await expect(
        page.locator("p").filter({ hasText: "to be deleted yes" })
      ).not.toBeVisible();
    });
  });
});
