const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false, //open with no-graphical mode
  });

  page = await browser.newPage();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("The header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  expect(text).toEqual("Blogster");
});

test("clicking loging start OAuth flow", async () => {
  await page.click(".right a");

  const pageUrl = await page.url();
  expect(pageUrl).toMatch(/accounts\.google\.com/);
});

test("when signed in, show logout button", async () => {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);

  await page.setCookie({ name: "session", value: session });
  await page.setCookie({ name: "session.sig", value: sig });

  await page.goto("localhost:3000");
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  expect(text).toEqual("Logout");
});
