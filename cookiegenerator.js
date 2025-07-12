import puppeteer from "puppeteer";
import fs from "fs";


const USERNAME = "user";
const PASSWORD = "pass";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/125.0.0.0 Safari/537.36"
  );

  console.log("👉 Opening Instagram login page...");
  await page.goto("https://www.instagram.com/accounts/login/", { waitUntil: "networkidle2" });

  // Wait for the username input to appear
  await page.waitForSelector('input[name="username"]');

  console.log("⌨️ Typing username...");
  for (const char of USERNAME) {
    await page.type('input[name="username"]', char, { delay: 150 });
  }

  await delay(500);

  console.log("⌨️ Typing password...");
  for (const char of PASSWORD) {
    await page.type('input[name="password"]', char, { delay: 150 });
  }

  await delay(800);

  console.log("🖱️ Clicking login button...");
  await page.click('button[type="submit"]');

  console.log("🔐 Waiting for possible OTP — complete it manually if needed...");
  await delay(45000); // 45 seconds for manual OTP input

  console.log("⏳ Waiting for Instagram home feed to load...");
  await page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {});
  await delay(5000);

  const cookies = await page.cookies();
  fs.writeFileSync("session.json", JSON.stringify(cookies, null, 2));
  console.log("✅ Session saved as session.json");

  await browser.close();
})();
