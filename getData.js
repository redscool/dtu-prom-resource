import Male from "./model/Male.js";
import Female from "./model/Female.js";

const TIME_INTERVAL = 1000 * 20;
const prev = {
  M: 0,
  F: 0,
};

const loading = {
  M: false,
  F: false,
};

export default async function getData(CACHE, type) {
  const time = Date.now();
  const prevTime = prev[type];

  if (time - prevTime < TIME_INTERVAL || loading[type]) {
    console.log("Cache hit for " + type);
    return CACHE[type];
  } else {
    loading[type] = true;

    const Model = type === "M" ? Male : Female;

    console.log("DB hit for " + type);

    const data = await Model.find({ regComplete: true });

    prev[type] = time;
    CACHE[type] = data;
    loading[type] = false;

    return data;
  }
}
