import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import URL from "url";
import query from "../queries";
import { getStatsLimit, removeWww } from "../utils";

const browsersList = ["IE", "Firefox", "Chrome", "Opera", "Safari", "Edge"];
const osList = ["Windows", "Mac OS", "Linux", "Android", "iOS"];

const filterInBrowser = (browserName: string) => (item: string) =>
  browserName.toLowerCase().includes(item.toLowerCase());
const filterInOs = (osName: string) => (item: string) =>
  osName.toLowerCase().includes(item.toLowerCase());

export default function visit({ data }: { data: any }) {
  const tasks = [query.link.incrementVisit({ id: data.link.id })];

  if (data.link.visit_count < getStatsLimit()) {
    const parser = new UAParser(data.headers["user-agent"]);
    const browserName = parser.getBrowser().name || "Other";
    const osName = parser.getOS().name || "Other";
    const [browser = "Other"] = browsersList.filter(filterInBrowser(browserName));
    const [os = "Other"] = osList.filter(filterInOs(osName));
    const referrer = data.referrer ? removeWww(URL.parse(data.referrer).hostname) : undefined;
    const location = geoip.lookup(data.realIP);
    const country = location?.country || "Unknown";
    tasks.push(
      query.visit.add({
        browser: browser.toLowerCase(),
        country,
        id: data.link.id,
        os: os.toLowerCase().replace(/\s/gi, ""),
        referrer: referrer ? referrer.replace(/\./gi, "[dot]") : "Direct"
      }).then(() => 1)
    );
  }

  return Promise.all(tasks);
}
