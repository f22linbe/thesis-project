import http from "k6/http";
import { sleep } from "k6";

function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateText(size, seed) {
  let text = "";
  const target = size * 1024;
  // Characters
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";

  // Generate text to target
  while (text.length < target) {
    text += characters.charAt(Math.floor(seed() * characters.length));
  }

  return text;
}

export const options = {
  scenarios: {
    contacts: {
      executor: "per-vu-iterations",
      vus: 2,
      iterations: 10,
      // maxDuration: "30s",
    },
  },
};

export default function () {
  const url = "http://localhost:3003/gin/book"; // (/:3001/actix, /:3002/fastify, /:3003/gin )
  const seed = 10 - __ITER;
  // Initiate seed
  const mySeed = mulberry32(seed);
  const payload = JSON.stringify({
    author: "testuser",
    book_text: generateText(500, mySeed),
    book_size: "small", // small = 500, medium = 1000, large = 1500
  });

  const header = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  http.post(url, payload, header);
  sleep(1);
}
