import { test, expect } from "@playwright/test";

// HAPPY PATH
// Tests that a normal user can log in, create, edit and delete their own book.
test("user can add, edit and delete a book", async ({ page }) => {
  // Create a unique title so repeated test runs do not clash
  const testBookTitle = `Playwright Test Book ${Date.now()}`;

  // Open the Reading Tracker
  await page.goto("http://localhost:5173");

  // Enter the user's login details
  await page.getByLabel("Email").fill("testuser@example.com");
  await page.getByLabel("Password").fill("password123");

  // Log in
  await page
    .getByRole("button", { name: "Login" })
    .click();

  // Check that the user's library is displayed
  await expect(
    page.getByText("PERSONAL LIBRARY"),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: /Your Library/i }),
  ).toBeVisible();

  // CREATE A BOOK

  // Open the Add Book form
  await page
    .getByRole("button", { name: "+ Add a Book" })
    .click();

  // Enter the book title
  await page
    .getByRole("textbox", {
      name: "Title",
      exact: true,
    })
    .fill(testBookTitle);

  // Enter the author
  await page
    .getByRole("textbox", {
      name: "Author",
      exact: true,
    })
    .fill("Playwright Author");

  // Submit the new book
  await page
    .getByRole("button", { name: /Add Book/i })
    .click();

  // Find the exact row containing the book we created
  const bookRow = page
    .locator(".book-row")
    .filter({ hasText: testBookTitle });

  // Confirm the book appears
  await expect(bookRow).toBeVisible();

  // Confirm the correct author appears
  await expect(
    bookRow.getByText("Playwright Author"),
  ).toBeVisible();

  // EDIT THE BOOK

  // Open the edit form for this book
  await bookRow
    .getByRole("button", { name: "Edit" })
    .click();

  // Update the notes
  await bookRow
    .getByLabel("Notes")
    .fill("Updated by Playwright");

  // Save the changes
  await bookRow
    .getByRole("button", { name: /Save|Update/i })
    .click();

  // Confirm the updated notes appear
  await expect(
    bookRow.getByText("Updated by Playwright"),
  ).toBeVisible();

  // DELETE THE BOOK

  // Listen for the browser confirmation dialog
  // before clicking the Delete button
  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  // Delete the book
  await bookRow
    .getByRole("button", { name: "Delete" })
    .click();

  // Confirm the book has disappeared
  await expect(bookRow).not.toBeVisible();
});


// AUTHORIZATION FAILURE
// Tests that a normal USER cannot access an ADMIN-only endpoint.
test("normal user cannot access admin books", async ({ page, request }) => {
  // Open the Reading Tracker
  await page.goto("http://localhost:5173");

  // Log in as a normal USER account
  await page.getByLabel("Email").fill("testuser@example.com");
  await page.getByLabel("Password").fill("password123");

  await page
    .getByRole("button", { name: "Login" })
    .click();

  // Wait until login has completed
  await expect(
    page.getByText("PERSONAL LIBRARY"),
  ).toBeVisible();

  // Get the JWT that was stored after login
  const token = await page.evaluate(() =>
    localStorage.getItem("token"),
  );

  // Make sure a token was actually stored
  expect(token).not.toBeNull();

  // Attempt to access the ADMIN-only endpoint
  const response = await request.get(
    "http://localhost:3000/admin/books",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  // The backend should reject a normal USER
  expect(response.status()).toBe(403);

  // Read the response from the backend
  const body = await response.json();

  // Check that the correct authorization error was returned
  expect(body.message).toBe("Admin access required");
});