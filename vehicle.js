/* ============================================================
 *  vehicle.js · 500 款真实车型车市 + 车贷 + 折旧
 *  价格是游戏内模拟值，不作为现实购车报价。
 * ============================================================ */

function _vhRng(seed){
  let s = (seed >>> 0) || 7;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
function _vhPick(rng, arr){ return arr[Math.floor(rng() * arr.length)]; }

const VEHICLE_MODEL_SEEDS = [
  ["大众","朗逸","紧凑型轿车","汽油",125000,113,"9.8s"],["大众","速腾","紧凑型轿车","汽油",155000,150,"8.8s"],["大众","帕萨特","中型轿车","汽油",210000,186,"8.4s"],["大众","迈腾","中型轿车","汽油",220000,186,"8.1s"],["大众","途观L","中型SUV","汽油",245000,186,"8.7s"],
  ["丰田","卡罗拉","紧凑型轿车","混动",135000,121,"10.5s"],["丰田","雷凌","紧凑型轿车","混动",130000,121,"10.6s"],["丰田","凯美瑞","中型轿车","混动",220000,178,"8.9s"],["丰田","亚洲龙","中型轿车","混动",240000,178,"8.6s"],["丰田","RAV4 荣放","紧凑型SUV","混动",205000,178,"9.1s"],["丰田","汉兰达","中型SUV","混动",315000,248,"8.5s"],
  ["本田","飞度","小型车","汽油",90000,124,"10.6s"],["本田","思域","紧凑型轿车","汽油",155000,182,"8.5s"],["本田","雅阁","中型轿车","混动",215000,207,"7.8s"],["本田","CR-V","紧凑型SUV","混动",210000,207,"8.9s"],["本田","皓影","紧凑型SUV","混动",205000,207,"8.9s"],["本田","奥德赛","MPV","混动",265000,215,"9.6s"],
  ["日产","轩逸","紧凑型轿车","汽油",120000,135,"11.5s"],["日产","天籁","中型轿车","汽油",190000,243,"7.2s"],["日产","逍客","紧凑型SUV","汽油",155000,151,"10.2s"],["日产","奇骏","紧凑型SUV","汽油",190000,204,"8.9s"],["日产","楼兰","中型SUV","汽油",260000,186,"9.9s"],
  ["别克","英朗","紧凑型轿车","汽油",115000,113,"10.9s"],["别克","君威","中型轿车","汽油",190000,237,"7.1s"],["别克","君越","中型轿车","汽油",240000,237,"7.2s"],["别克","昂科威","中型SUV","汽油",230000,237,"8.2s"],["别克","GL8","MPV","汽油",320000,237,"9.5s"],
  ["福特","福克斯","紧凑型轿车","汽油",130000,174,"8.9s"],["福特","蒙迪欧","中型轿车","汽油",200000,238,"6.5s"],["福特","锐界","中型SUV","汽油",280000,252,"8.6s"],["福特","探险者","中大型SUV","汽油",330000,276,"7.8s"],["雪佛兰","科鲁泽","紧凑型轿车","汽油",95000,113,"11.2s"],["雪佛兰","迈锐宝XL","中型轿车","汽油",180000,237,"7.0s"],
  ["奥迪","A3","紧凑型轿车","汽油",210000,150,"8.4s"],["奥迪","A4L","中型轿车","汽油",330000,190,"8.2s"],["奥迪","A6L","中大型轿车","汽油",450000,245,"7.4s"],["奥迪","Q3","紧凑型SUV","汽油",270000,186,"8.8s"],["奥迪","Q5L","中型SUV","汽油",410000,252,"6.9s"],["奥迪","Q7","中大型SUV","汽油",700000,340,"5.9s"],
  ["宝马","1系","紧凑型轿车","汽油",210000,140,"9.4s"],["宝马","3系","中型轿车","汽油",350000,184,"7.9s"],["宝马","5系","中大型轿车","汽油",460000,245,"6.9s"],["宝马","X1","紧凑型SUV","汽油",290000,204,"7.7s"],["宝马","X3","中型SUV","汽油",430000,252,"6.8s"],["宝马","X5","中大型SUV","汽油",720000,381,"5.5s"],
  ["奔驰","A级","紧凑型轿车","汽油",230000,163,"9.0s"],["奔驰","C级","中型轿车","汽油",350000,204,"7.7s"],["奔驰","E级","中大型轿车","汽油",480000,258,"6.6s"],["奔驰","GLA","紧凑型SUV","汽油",300000,190,"8.6s"],["奔驰","GLC","中型SUV","汽油",440000,258,"6.9s"],["奔驰","GLE","中大型SUV","汽油",760000,367,"5.9s"],
  ["雷克萨斯","ES","中大型轿车","混动",320000,218,"8.9s"],["雷克萨斯","NX","中型SUV","混动",360000,243,"7.7s"],["雷克萨斯","RX","中大型SUV","混动",520000,262,"7.9s"],["凯迪拉克","CT5","中型轿车","汽油",290000,237,"7.3s"],["凯迪拉克","XT5","中型SUV","汽油",350000,237,"8.3s"],["沃尔沃","S60","中型轿车","汽油",300000,250,"6.9s"],["沃尔沃","S90","中大型轿车","汽油",420000,250,"7.2s"],["沃尔沃","XC60","中型SUV","汽油",390000,250,"7.1s"],
  ["特斯拉","Model 3","中型轿车","纯电",260000,264,"6.1s"],["特斯拉","Model Y","中型SUV","纯电",300000,299,"5.9s"],["比亚迪","秦 PLUS DM-i","紧凑型轿车","插混",110000,197,"7.9s"],["比亚迪","汉 DM-i","中大型轿车","插混",210000,218,"7.9s"],["比亚迪","汉 EV","中大型轿车","纯电",230000,245,"7.9s"],["比亚迪","宋 PLUS DM-i","紧凑型SUV","插混",155000,197,"7.9s"],["比亚迪","唐 DM-i","中型SUV","插混",210000,215,"8.5s"],["比亚迪","海豚","小型车","纯电",115000,95,"10.9s"],["比亚迪","海豹","中型轿车","纯电",190000,313,"5.9s"],
  ["蔚来","ET5","中型轿车","纯电",320000,490,"4.0s"],["蔚来","ET7","中大型轿车","纯电",450000,653,"3.9s"],["蔚来","ES6","中型SUV","纯电",360000,490,"4.5s"],["蔚来","ES8","中大型SUV","纯电",500000,653,"4.1s"],["理想","L7","中大型SUV","增程",330000,449,"5.3s"],["理想","L8","中大型SUV","增程",360000,449,"5.5s"],["理想","L9","大型SUV","增程",460000,449,"5.3s"],["小鹏","P7","中型轿车","纯电",240000,276,"6.7s"],["小鹏","G6","中型SUV","纯电",230000,296,"6.6s"],["极氪","001","中大型猎装车","纯电",300000,422,"5.9s"],["极氪","007","中型轿车","纯电",220000,422,"5.4s"],
  ["吉利","帝豪","紧凑型轿车","汽油",85000,127,"11.6s"],["吉利","星瑞","紧凑型轿车","汽油",125000,190,"7.9s"],["吉利","博越L","紧凑型SUV","汽油",135000,181,"8.9s"],["领克","03","紧凑型轿车","汽油",160000,254,"6.9s"],["领克","05","紧凑型SUV","汽油",190000,254,"6.7s"],["长安","逸动 PLUS","紧凑型轿车","汽油",90000,170,"9.2s"],["长安","UNI-V","紧凑型轿车","汽油",120000,188,"7.4s"],["长安","CS75 PLUS","紧凑型SUV","汽油",130000,188,"8.6s"],["哈弗","H6","紧凑型SUV","汽油",115000,184,"9.7s"],["哈弗","大狗","紧凑型SUV","汽油",135000,184,"9.8s"],["坦克","300","紧凑型越野SUV","汽油",220000,227,"9.5s"],["坦克","500","中大型越野SUV","混动",340000,408,"6.9s"],
  ["马自达","昂克赛拉","紧凑型轿车","汽油",130000,158,"9.1s"],["马自达","CX-5","紧凑型SUV","汽油",180000,196,"9.2s"],["斯巴鲁","森林人","紧凑型SUV","汽油",240000,154,"10.3s"],["斯巴鲁","傲虎","中型旅行车","汽油",310000,169,"10.2s"],["现代","伊兰特","紧凑型轿车","汽油",110000,140,"9.9s"],["现代","索纳塔","中型轿车","汽油",170000,240,"7.8s"],["起亚","K3","紧凑型轿车","汽油",110000,140,"10.1s"],["起亚","狮铂拓界","紧凑型SUV","汽油",170000,200,"8.8s"],
  ["保时捷","718 Cayman","跑车","汽油",650000,300,"4.9s"],["保时捷","Macan","中型SUV","汽油",580000,265,"6.4s"],["保时捷","Cayenne","中大型SUV","汽油",950000,353,"6.0s"],["MINI","Cooper","小型车","汽油",230000,178,"7.1s"],["Jeep","牧马人","越野SUV","汽油",460000,266,"7.6s"],["路虎","揽胜极光","中型SUV","汽油",390000,249,"8.2s"],["路虎","发现运动","中型SUV","汽油",380000,249,"8.2s"],
  ["五菱","宏光MINIEV","微型车","纯电",45000,41,"14.0s"],["五菱","缤果","小型车","纯电",70000,68,"12.0s"],["宝骏","KiWi EV","微型车","纯电",80000,54,"12.6s"],["广汽埃安","AION S","紧凑型轿车","纯电",150000,204,"7.8s"],["广汽埃安","AION Y","紧凑型SUV","纯电",140000,204,"8.5s"],
  ["本田摩托","CB400F","摩托车","汽油",39000,45,"5.8s"],["本田摩托","CM300","摩托车","汽油",35000,27,"8.1s"],["雅马哈","MT-03","摩托车","汽油",39800,42,"5.7s"],["雅马哈","YZF-R3","摩托车","汽油",43800,42,"5.6s"],["川崎","Ninja 400","摩托车","汽油",49800,45,"5.3s"],["川崎","Z900","摩托车","汽油",106000,125,"3.7s"],["宝马摩托","G 310 R","摩托车","汽油",52000,34,"7.0s"],["宝马摩托","R 1250 GS","摩托车","汽油",230000,136,"3.9s"],["杜卡迪","Monster","摩托车","汽油",130000,111,"3.9s"],["杜卡迪","Panigale V2","摩托车","汽油",210000,155,"3.2s"],["哈雷戴维森","Iron 883","摩托车","汽油",120000,51,"6.0s"],["春风","450SR","摩托车","汽油",33000,50,"5.2s"],["钱江","赛 600","摩托车","汽油",50000,81,"4.5s"],["豪爵铃木","DL250","摩托车","汽油",30000,25,"9.5s"]
];

const VEHICLE_COLORS = ["珍珠白","曜石黑","星河银","海湾蓝","熔岩红","量子灰","松石绿","香槟金"];
const VEHICLE_FEATURES = ["CarPlay/CarLife","L2 辅助驾驶","全景影像","座椅加热","主动刹车","自适应巡航","电尾门","全景天窗","无钥匙进入","HUD 抬头显示","矩阵大灯","Brembo 制动","快充接口","BOSE 音响","后排独立空调"];

function vehicleYearMult(year){
  if (year <= 2018) return 1.00;
  if (year === 2019) return 0.99;
  if (year === 2020) return 1.01;
  if (year === 2021) return 1.04;
  if (year === 2022) return 1.02;
  if (year === 2023) return 0.98;
  if (year === 2024) return 0.94;
  if (year === 2025) return 0.92;
  return 0.90;
}

function _vehicleTrims(seed){
  const baseFeatures = VEHICLE_FEATURES.slice(seed % 5, seed % 5 + 4);
  return [
    {id:"std", name:"标准版", mult:1.00, features:["倒车影像","定速巡航"].concat(baseFeatures.slice(0,2))},
    {id:"pro", name:"舒适版", mult:1.12, features:["L2 辅助驾驶","全景影像","座椅加热"].concat(baseFeatures.slice(1,3))},
    {id:"max", name:"旗舰版", mult:1.25, features:["HUD 抬头显示","高阶驾驶辅助","高端音响","矩阵大灯"].concat(baseFeatures.slice(2,4))}
  ];
}

function buildVehicleCatalog(){
  const out = [];
  const rng = _vhRng(260521);
  let i = 0;
  while (out.length < 500){
    const seed = VEHICLE_MODEL_SEEDS[i % VEHICLE_MODEL_SEEDS.length];
    const [brand, model, bodyType, energy, basePrice, hp, accel] = seed;
    const cycle = Math.floor(i / VEHICLE_MODEL_SEEDS.length);
    const isUsed = (i % 3 === 1) || cycle % 2 === 1;
    const age = isUsed ? 1 + ((i + cycle) % 8) : 0;
    const mileage = isUsed ? (8000 + Math.floor(rng() * 26000) + age * 11000) : 0;
    const condition = isUsed ? _vhPick(rng, ["准新车","精品车况","正常使用痕迹","工程师通勤车","轻微补漆"]) : "新车";
    const color = _vhPick(rng, VEHICLE_COLORS);
    const id = `v${String(out.length + 1).padStart(3, "0")}`;
    out.push({
      id, brand, model, bodyType, energy, hp, accel, color,
      category:isUsed ? "used" : "new",
      basePrice,
      age, mileage, condition,
      title:`${brand} ${model}`,
      trims:isUsed ? [{id:"used", name:condition, mult:Math.max(0.36, 0.82 - age * 0.055), features:["已整备","第三方检测","可当天提车"].concat(VEHICLE_FEATURES.slice(i % 8, i % 8 + 3))}] : _vehicleTrims(i),
      imageHue:(i * 37) % 360
    });
    i += 1;
  }
  return out;
}

const VEHICLE_CATALOG = buildVehicleCatalog();

function vehicleBrandList(){
  return Array.from(new Set(VEHICLE_CATALOG.map(v => v.brand))).sort((a,b) => a.localeCompare(b, "zh-CN"));
}
function vehicleBodyList(){
  return Array.from(new Set(VEHICLE_CATALOG.map(v => v.bodyType)));
}
function vehiclePriceOf(item, year, trimId){
  const trim = (item.trims || [])[0] && (item.trims.find(t => t.id === trimId) || item.trims[0]);
  let price = item.basePrice * (trim?.mult || 1);
  if (item.category === "new") price *= vehicleYearMult(year);
  return Math.round(price / 100) * 100;
}
function vehiclePriceBucket(item, year){
  const wan = vehiclePriceOf(item, year) / 10000;
  if (wan < 8) return "<8";
  if (wan < 15) return "8-15";
  if (wan < 30) return "15-30";
  if (wan < 60) return "30-60";
  return "60+";
}
function vehicleCurrentValue(vehicle, year, month){
  const item = VEHICLE_CATALOG.find(v => v.id === vehicle.vehicleId);
  const paidPrice = vehicle.totalPrice || (item ? vehiclePriceOf(item, vehicle.buyYear || year, vehicle.trimId) : 0);
  const monthsOwned = Math.max(0, (year - (vehicle.buyYear || year)) * 12 + (month || 1) - (vehicle.buyMonth || 1));
  const initialDrop = vehicle.category === "new" ? 0.88 : 0.94;
  const monthlyDrop = vehicle.bodyType === "摩托车" ? 0.988 : 0.982;
  const minRatio = vehicle.bodyType === "摩托车" ? 0.18 : 0.12;
  const ratio = Math.max(minRatio, initialDrop * Math.pow(monthlyDrop, monthsOwned));
  return Math.round(paidPrice * ratio / 100) * 100;
}
function vehicleImageSvg(item){
  const isMoto = item.bodyType === "摩托车";
  const h = item.imageHue || 0;
  const label = `${item.brand} ${item.model}`.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const shape = isMoto
    ? `<circle cx="64" cy="132" r="24" fill="#111"/><circle cx="238" cy="132" r="24" fill="#111"/><path d="M78 120 L130 92 L180 100 L224 121" fill="none" stroke="hsl(${h},70%,42%)" stroke-width="16" stroke-linecap="round"/><path d="M126 92 L148 68 L184 70" fill="none" stroke="#263238" stroke-width="8" stroke-linecap="round"/>`
    : `<path d="M42 124 L68 82 Q78 68 100 66 L208 66 Q230 68 246 88 L278 124 Z" fill="hsl(${h},70%,46%)"/><path d="M92 74 L126 42 H188 L224 74 Z" fill="hsl(${h},58%,58%)"/><rect x="72" y="114" width="186" height="28" rx="10" fill="hsl(${h},72%,38%)"/><circle cx="92" cy="144" r="22" fill="#111"/><circle cx="232" cy="144" r="22" fill="#111"/><circle cx="92" cy="144" r="9" fill="#b8c0cc"/><circle cx="232" cy="144" r="9" fill="#b8c0cc"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="190" viewBox="0 0 320 190"><defs><linearGradient id="bg" x1="0" x2="1"><stop stop-color="#f7fafc"/><stop offset="1" stop-color="#e7edf4"/></linearGradient></defs><rect width="320" height="190" fill="url(#bg)"/><rect x="0" y="0" width="320" height="4" fill="#d6263e"/><text x="18" y="28" font-family="Arial, Microsoft YaHei" font-size="14" font-weight="700" fill="#1a1f2c">${label}</text>${shape}<text x="18" y="174" font-family="Arial, Microsoft YaHei" font-size="11" fill="#667085">${item.bodyType} · ${item.energy} · ${item.hp} hp</text></svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}
function vehicleImageSrc(item){
  if (!item) return "";
  const map = globalThis.VEHICLE_IMAGE_MAP || {};
  return map[item.id] || vehicleImageSvg(item);
}

function vehicleLoanMonthly(principal, annualRate, months){
  return mortgageMonthlyEqual(principal, annualRate, months);
}

/* ---------- 本地车辆图片绑定 ---------- */
function enhanceVehiclePhotos(root){
  const scope = root || document;
  const imgs = Array.from(scope.querySelectorAll("img[data-vehicle-id]"));
  imgs.forEach(img => {
    const item = VEHICLE_CATALOG.find(v => v.id === img.dataset.vehicleId);
    if (!item) return;
    const src = vehicleImageSrc(item);
    if (!src) return;
    img.src = src;
    img.classList.toggle("vh-photo-fallback", src.startsWith("data:"));
  });
}
