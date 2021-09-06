class ScrapperTool {
  async get(url,callbackScrapFunction) {
    const puppeteer = require("puppeteer");
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(
      url,
      {
        waitUntil: "load",
        // Remove the timeout
        timeout: 0,
      }
    );
    const data = await page.evaluate(callbackScrapFunction);
    browser.close();
    return data;
  }
}
module.exports = ScrapperTool;
