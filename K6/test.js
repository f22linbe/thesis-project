import http from "k6/http";
import { sleep } from "k6";
import { check } from "k6";

// NOT IN USE (USED IN generateText())
function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// NOT IN USE (TOO TIME CONSUMING)
function generateText(size, seed) {
  let text = "";
  const target = size * 1024;
  // Characters
  // const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";

  // Generate text to target
  // while (text.length < target) {
  //   text += characters.charAt(Math.floor(seed() * characters.length));
  // }

  while (text.length < target) {
    text += seed().toString(36);
  }

  return text;
}
const numOfUsers = 2; // 2, 5, 10, 20
const numOfIterations = 10; // 250, 100, 50, 25

export const options = {
  scenarios: {
    contacts: {
      executor: "per-vu-iterations",
      vus: numOfUsers,
      iterations: numOfIterations,
      maxDuration: "2h",
    },
  },
};

export default function () {
  const url = "http://localhost:3003/gin/book"; // (/:3001/actix, /:3002/fastify, /:3003/gin )
  const index = __ITER * numOfUsers + (__VU - 1);
  const seed = index + 1;
  console.log(`index: ${index}`);
  // Initiate seed
  const mySeed = mulberry32(seed);
  const payload = JSON.stringify({
    author: "testuser",
    book_text: generateText(500, mySeed),
    book_size: "small", // small = 500, medium = 1000, large = 1500
  });
  console.log(typeof smallText);
  console.log(smallText.length);
  const header = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, header);

  check(res, { "is status 201": (r) => r.status === 201 });
  console.log(`Response status: ${res.status}`);
  console.log(`Response body: ${res.body}`);
  sleep(1);
}
export function handleSummary(data) {
  console.log("Summary:");
  console.log(JSON.stringify(data.metrics, null, 2));
  return {
    "summary.json": JSON.stringify(data, null, 2),
  };
}
