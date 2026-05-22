const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const VEHICLE_JS = path.join(ROOT, "vehicle.js");
const OUT_DIR = path.join(ROOT, "assets", "vehicles");
const MAP_FILE = path.join(ROOT, "vehicle-images.js");
const WIDTH = 720;
const DELAY_MS = 180;

const BRAND_EN = {
  "大众":"Volkswagen","丰田":"Toyota","本田":"Honda","日产":"Nissan","别克":"Buick","福特":"Ford","雪佛兰":"Chevrolet",
  "奥迪":"Audi","宝马":"BMW","奔驰":"Mercedes-Benz","雷克萨斯":"Lexus","凯迪拉克":"Cadillac","沃尔沃":"Volvo",
  "特斯拉":"Tesla","比亚迪":"BYD","蔚来":"Nio","理想":"Li Auto","小鹏":"XPeng","极氪":"Zeekr","吉利":"Geely","领克":"Lynk & Co",
  "长安":"Changan","哈弗":"Haval","坦克":"Tank","马自达":"Mazda","斯巴鲁":"Subaru","现代":"Hyundai","起亚":"Kia",
  "保时捷":"Porsche","MINI":"MINI","Jeep":"Jeep","路虎":"Land Rover","五菱":"Wuling","宝骏":"Baojun","广汽埃安":"GAC Aion",
  "本田摩托":"Honda motorcycle","雅马哈":"Yamaha motorcycle","川崎":"Kawasaki motorcycle","宝马摩托":"BMW Motorrad",
  "杜卡迪":"Ducati","哈雷戴维森":"Harley-Davidson","春风":"CFMoto","钱江":"QJMotor","豪爵铃木":"Haojue Suzuki"
};

const MODEL_EN = {
  "朗逸":"Lavida","速腾":"Sagitar","帕萨特":"Passat","迈腾":"Magotan","途观L":"Tiguan L",
  "卡罗拉":"Corolla","雷凌":"Levin","凯美瑞":"Camry","亚洲龙":"Avalon","RAV4 荣放":"RAV4","汉兰达":"Highlander",
  "飞度":"Fit","思域":"Civic","雅阁":"Accord","皓影":"Breeze","奥德赛":"Odyssey",
  "轩逸":"Sylphy","天籁":"Altima","逍客":"Qashqai","奇骏":"X-Trail","楼兰":"Murano",
  "英朗":"Excelle GT","君威":"Regal","君越":"LaCrosse","昂科威":"Envision",
  "福克斯":"Focus","蒙迪欧":"Mondeo","锐界":"Edge","探险者":"Explorer","科鲁泽":"Monza","迈锐宝XL":"Malibu XL",
  "汉 DM-i":"Han DM-i","汉 EV":"Han EV","宋 PLUS DM-i":"Song Plus DM-i","唐 DM-i":"Tang DM-i","海豚":"Dolphin","海豹":"Seal",
  "帝豪":"Emgrand","星瑞":"Preface","博越L":"Boyue L","逸动 PLUS":"Eado Plus","UNI-V":"UNI-V","CS75 PLUS":"CS75 Plus",
  "大狗":"Dargo","昂克赛拉":"Mazda3 Axela","狮铂拓界":"Sportage","宏光MINIEV":"Hongguang Mini EV","缤果":"Bingo",
  "赛 600":"QJMotor SRK 600"
};

function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
function norm(s){ return String(s || "").toLowerCase().replace(/[\s_\-·.()（）+]/g, ""); }
function safeName(s){ return String(s || "").replace(/[\\/:*?"<>|]+/g, "_").slice(0, 80); }
function extFrom(contentType, url){
  const ct = String(contentType || "").toLowerCase();
  if (ct.includes("jpeg") || ct.includes("jpg")) return ".jpg";
  if (ct.includes("png")) return ".png";
  if (ct.includes("webp")) return ".webp";
  if (ct.includes("svg")) return ".svg";
  const clean = String(url || "").split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return ".png";
  if (clean.endsWith(".webp")) return ".webp";
  if (clean.endsWith(".svg")) return ".svg";
  return ".jpg";
}
function isLogo(title, url){
  return /logo|emblem|badge|wordmark|marque|symbol|icon/.test(String(title + " " + url).toLowerCase());
}
function isBadNonVehicle(title, url){
  return /公交|快线|线路|车站|地铁|赛道|城市|市$|自治|巴登|梅賽德斯-賓士$/.test(String(title + " " + decodeURIComponent(String(url || ""))));
}
function looksLikeVehicle(item, title, url){
  if (!title && !url) return false;
  if (isLogo(title, url)) return false;
  if (isBadNonVehicle(title, url)) return false;
  const t = norm(title);
  const u = norm(decodeURIComponent(String(url || "")));
  const keys = [item.model, MODEL_EN[item.model], item.brand + item.model].filter(Boolean).map(norm).filter(k => k.length >= 2);
  return keys.some(k => t.includes(k) || u.includes(k));
}
function looksSameBrand(item, title, url){
  const t = norm(title);
  const u = norm(decodeURIComponent(String(url || "")));
  const brandKeys = [item.brand, BRAND_EN[item.brand]].filter(Boolean).map(norm).filter(k => k.length >= 2);
  return brandKeys.some(k => t.includes(k) || u.includes(k));
}
function exactQueries(item){
  const moto = item.bodyType === "摩托车";
  const brandEn = BRAND_EN[item.brand] || item.brand;
  const modelEn = MODEL_EN[item.model] || item.model;
  return [
    {kind:"wiki-zh", q:`${item.brand} ${item.model} ${moto ? "摩托车" : "汽车"}`},
    {kind:"wiki-en", q:`${brandEn} ${modelEn} ${moto ? "motorcycle" : "car"}`},
    {kind:"commons", q:`${brandEn} ${modelEn} ${moto ? "motorcycle" : "car"}`},
    {kind:"commons", q:`${item.brand} ${item.model} ${moto ? "摩托车" : "汽车"}`}
  ];
}
function logoQueries(brand){
  const brandEn = BRAND_EN[brand] || brand;
  return [
    {kind:"commons-logo", q:`${brandEn} logo`},
    {kind:"wiki-en-logo", q:`${brandEn} logo`},
    {kind:"wiki-zh-logo", q:`${brand} logo`}
  ];
}
async function wikiImage(host, query, item, allowLogo){
  const url = `https://${host}/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=8&prop=pageimages&piprop=thumbnail&pithumbsize=${WIDTH}&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  const hit = pages.find(p => p.thumbnail?.source && (allowLogo ? isLogo(p.title, p.thumbnail.source) : looksLikeVehicle(item, p.title, p.thumbnail.source)))
    || pages.find(p => p.thumbnail?.source && !isLogo(p.title, p.thumbnail.source) && !isBadNonVehicle(p.title, p.thumbnail.source) && looksSameBrand(item, p.title, p.thumbnail.source));
  return hit ? {url:hit.thumbnail.source, title:hit.title, source:host} : null;
}
async function commonsImage(query, item, allowLogo){
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=10&prop=imageinfo&iiprop=url&iiurlwidth=${WIDTH}&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  const hit = pages.find(p => {
    const src = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
    return src && (allowLogo ? isLogo(p.title, src) : looksLikeVehicle(item, p.title, src));
  }) || pages.find(p => {
    const src = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
    return src && !isLogo(p.title, src) && !isBadNonVehicle(p.title, src) && looksSameBrand(item, p.title, src);
  });
  if (!hit) return null;
  const info = hit.imageinfo[0];
  return {url:info.thumburl || info.url, title:hit.title, source:"commons"};
}
async function resolveExact(item){
  for (const q of exactQueries(item)){
    try {
      let hit = null;
      if (q.kind === "wiki-zh") hit = await wikiImage("zh.wikipedia.org", q.q, item, false);
      else if (q.kind === "wiki-en") hit = await wikiImage("en.wikipedia.org", q.q, item, false);
      else hit = await commonsImage(q.q, item, false);
      await sleep(DELAY_MS);
      if (hit) return hit;
    } catch (err) {
      console.warn("search failed", item.id, q.q, err.message);
    }
  }
  return null;
}
async function resolveLogo(brand){
  const fake = {brand, model:brand, bodyType:""};
  for (const q of logoQueries(brand)){
    try {
      let hit = null;
      if (q.kind === "wiki-en-logo") hit = await wikiImage("en.wikipedia.org", q.q, fake, true);
      else if (q.kind === "wiki-zh-logo") hit = await wikiImage("zh.wikipedia.org", q.q, fake, true);
      else hit = await commonsImage(q.q, fake, true);
      await sleep(DELAY_MS);
      if (hit) return hit;
    } catch (err) {
      console.warn("logo search failed", brand, q.q, err.message);
    }
  }
  return null;
}
async function download(url, destBase){
  let res = null;
  for (let attempt = 0; attempt < 5; attempt++){
    res = await fetch(url, {headers: {"User-Agent":"AvayaDalian20-local-asset-script/1.0"}});
    if (res.ok) break;
    const wait = res.status === 429 ? 5000 * (attempt + 1) : 1200 * (attempt + 1);
    console.warn(`download retry ${attempt + 1}: HTTP ${res.status}; wait ${wait}ms`);
    await sleep(wait);
  }
  if (!res || !res.ok) throw new Error(`download ${res && res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = extFrom(res.headers.get("content-type"), url);
  const file = destBase + ext;
  fs.writeFileSync(file, buf);
  return file;
}
function writeBrandLogo(brand){
  const file = path.join(OUT_DIR, `_brand-${safeName(brand)}.svg`);
  if (!fs.existsSync(file)){
    const text = String(brand || "AUTO")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420"><rect width="720" height="420" fill="#f4f7fb"/><rect y="0" width="720" height="8" fill="#d6263e"/><circle cx="360" cy="190" r="118" fill="#fff" stroke="#c9d2dc" stroke-width="4"/><text x="360" y="204" text-anchor="middle" font-family="Arial, Microsoft YaHei, sans-serif" font-size="52" font-weight="800" fill="#1a1f2c">${text}</text><text x="360" y="308" text-anchor="middle" font-family="Arial, Microsoft YaHei, sans-serif" font-size="20" fill="#667085">brand image fallback</text></svg>`;
    fs.writeFileSync(file, svg, "utf8");
  }
  return file;
}

async function main(){
  fs.mkdirSync(OUT_DIR, {recursive:true});
  const code = fs.readFileSync(VEHICLE_JS, "utf8") + "; globalThis.__vehicles = VEHICLE_CATALOG;";
  const context = {console, URLSearchParams, fetch};
  vm.runInNewContext(code, context);
  const vehicles = context.__vehicles;
  const unique = new Map();
  for (const item of vehicles){
    unique.set(`${item.brand}|${item.model}|${item.bodyType}`, item);
  }
  console.log(`vehicles=${vehicles.length}, uniqueModels=${unique.size}`);

  const exactByKey = new Map();
  let i = 0;
  for (const [key, item] of unique){
    i += 1;
    const hit = await resolveExact(item);
    exactByKey.set(key, hit);
    console.log(`[${i}/${unique.size}] ${item.title}: ${hit ? hit.title : "NO EXACT"}`);
  }

  const brandFallback = {};
  for (const [key, hit] of exactByKey){
    if (!hit) continue;
    const brand = key.split("|")[0];
    if (!brandFallback[brand]) brandFallback[brand] = hit;
  }
  const logoFallback = {};
  const brands = Array.from(new Set(vehicles.map(v => v.brand)));
  for (const brand of brands){
    if (brandFallback[brand]) continue;
    const hit = await resolveLogo(brand);
    if (hit) {
      logoFallback[brand] = hit;
      console.log(`[logo] ${brand}: ${hit.title}`);
    } else {
      console.log(`[logo] ${brand}: NO LOGO`);
    }
  }

  const map = {};
  const meta = {};
  const urlToLocal = new Map();
  for (const item of vehicles){
    const key = `${item.brand}|${item.model}|${item.bodyType}`;
    let hit = exactByKey.get(key);
    let mode = "exact";
    if (!hit && brandFallback[item.brand]) { hit = brandFallback[item.brand]; mode = "brand-substitute"; }
    if (!hit && logoFallback[item.brand]) { hit = logoFallback[item.brand]; mode = "brand-logo"; }
    let file = null;
    if (!hit) {
      mode = "generated-brand-logo";
      file = writeBrandLogo(item.brand);
      hit = {title:`${item.brand} generated brand logo`, source:"generated", url:""};
      console.warn(`[brand-logo-generated] ${item.id} ${item.title}`);
    } else {
      file = urlToLocal.get(hit.url);
      if (!file){
        const base = path.join(OUT_DIR, `${item.id}-${safeName(item.brand + "-" + item.model)}`);
        file = await download(hit.url, base);
        urlToLocal.set(hit.url, file);
        await sleep(DELAY_MS);
      }
    }
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    map[item.id] = rel;
    meta[item.id] = {mode, title:hit.title, source:hit.source, originalUrl:hit.url};
    console.log(`[file] ${item.id} ${item.title} -> ${rel} (${mode})`);
  }

  const output =
`/* Auto-generated by scripts/localize-vehicle-images.js. Do not edit by hand. */
globalThis.VEHICLE_IMAGE_MAP = ${JSON.stringify(map, null, 2)};
globalThis.VEHICLE_IMAGE_META = ${JSON.stringify(meta, null, 2)};
`;
  fs.writeFileSync(MAP_FILE, output, "utf8");
  console.log(`wrote ${MAP_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
