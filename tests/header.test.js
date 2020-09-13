const Page = require("./helpers/page");

//bug type error
Number.prototype._called = {};

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("The header has the correct text", async () => {
  const text = await page.getContentsOf("a.brand-logo");

  expect(text).toEqual("Blogster");
});

test("clicking loging start OAuth flow", async () => {
  await page.click(".right a");

  const pageUrl = await page.url();
  expect(pageUrl).toMatch(/accounts\.google\.com/);
});

test("when signed in, show logout button", async () => {
  await page.login();
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual("Logout");
});
