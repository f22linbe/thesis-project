const selectApi = document.getElementById("select-api");
// GET elements
const bookId = document.getElementById("book-id");
// POST elements
const bookText = document.getElementById("book-text");
const bookNum = document.getElementById("post-number");
const bookSize = document.getElementById("select-text-size");

async function getBook() {
  try {
    const backendService = selectApi.value;
    const id = bookId.value;

    const url = `${backendService}book/${id}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Server error");

    const bookData = await res.json();

    bookText.textContent = JSON.stringify(bookData, null, 2);
  } catch (err) {
    console.log("Error:", err);
    bookText.textContent = "Error: " + err.message;
  }
}

// TODO
// 1.
function setStorageVariables() {
  const inputNumPosts = bookNum.value;
  const inputSize = bookSize.value;
  const backendService = selectApi.value;

  localStorage.setItem("numPost", inputNumPosts);
  localStorage.setItem("sizePost", inputSize);
  localStorage.setItem("nameApi", backendService);

  sequenceOfApiCalls();
}
// 2a. Generate paragraphs based on seed and target
function generateText(size) {
  let text = "";
  const target = size * 1024;

  // Initiate seed
  const currentSeed = localStorage.getItem("numPost");
  const chance = new Chance(currentSeed);

  // Generate text to target
  while (new TextEncoder().encode(text).length < target) {
    text += chance.paragraph({ sentences: 1 }) + " ";
  }

  return text;
}
// 2b. Generate Book based size input
function generateBook() {
  const size = localStorage.getItem("sizePost"); // get size from local
  // Generate book
  if (size == "small") {
    return generateText(500);
  } else if (size == "medium") {
    return generateText(1000);
  } else if (size == "large") {
    return generateText(1500);
  }
}

// API CALL with POST
async function apiCall() {
  const size = localStorage.getItem("sizePost");
  const api = localStorage.getItem("nameApi");
  // Insert data
  const data = {
    author: "testuser",
    book_text: generateBook(),
    book_size: size,
  };

  // Convert to JSON (before getting time!)
  const payload = JSON.stringify(data);

  // Start time
  const startTime = performance.now();
  // API name from input
  const url = `${api}book`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });

  const result = await response.json();
  // Stop time after getting a result
  const endTime = performance.now();
  // Response time
  const responsTime = endTime - startTime;

  // TODO: Append the times to an array in localstorage
  console.log(`Respons time for ${api}: ${responsTime.toFixed(5)} ms`);
  console.log(result);
}

async function sequenceOfApiCalls() {
  let numOfPosts = parseInt(localStorage.getItem("numPost"), 10);
  // Iterate API call function based on number of posts
  while (numOfPosts > 0) {
    await apiCall();
    numOfPosts--;
    localStorage.setItem("numPost", numOfPosts);
  }
  // TODO: Convert list of respons time from storage to a file
  //

  localStorage.clear();
}
