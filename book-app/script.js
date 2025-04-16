const selectApi = document.getElementById("select-api");
// GET elements
const bookId = document.getElementById("book-id");
const getNum = document.getElementById("get-number");

// POST elements
const bookText = document.getElementById("book-text");
const bookNum = document.getElementById("post-number");
const bookSize = document.getElementById("select-text-size");

// Download .csv file
function downloadCSV(csvData, filename = "responsetimes.csv") {
  return new Promise((resolve) => {
    // Put response times in the same col
    const csv = csvData.join("\n");

    const hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    // Provide the name for the CSV file to be downloaded
    hiddenElement.download = filename;
    hiddenElement.click();

    setTimeout(resolve, 1000);
  });
}

// Fetch a book by id
/*
async function getBook() {
  try {
    const api = selectApi.value;
    const id = bookId.value;

    const url = `/${api}/book/${id}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Server error");

    const bookData = await res.json();

    bookText.textContent = JSON.stringify(bookData, null, 2);
  } catch (err) {
    console.log("Error:", err);
    bookText.textContent = "Error: " + err.message;
  }
}
*/
function setGetVariables() {
  const inputNumGet = getNum.value;
  const api = selectApi.value;

  localStorage.setItem("numGet", inputNumGet);
  localStorage.setItem("nameApi", api);
  // Call API
  sequenceOfFetchBook();
}

function generateRandomIDs(iterates) {
  const currentSeed = parseInt(localStorage.getItem("numGet"));
  const chance = new Chance(currentSeed);

  let randomID = chance.integer({ min: 0, max: 10000 });
  return randomID;
}

async function fetchBook() {
  try {
    const api = selectApi.value;
    const currentSeed = localStorage.getItem("numGet");
    const id = generateRandomIDs(currentSeed);
    const responseTimes = JSON.parse(
      localStorage.getItem("responseTimes") || "[]"
    );

    const url = `/${api}/book/${id}`;
    // Start time
    const startTime = performance.now();

    const res = await fetch(url);
    if (!res.ok) throw new Error("Server error");

    const bookData = await res.json();

    // Stop time
    const endTime = performance.now();

    // Response time
    const responseTime = endTime - startTime;

    // Append to array
    responseTimes.push(responseTime);

    // Save back to localstorage
    localStorage.setItem("responseTimes", JSON.stringify(responseTimes));

    console.log(`Respons time for ${api}: ${responseTime.toFixed(5)} ms`);
    console.log(bookData);
    bookText.textContent = JSON.stringify(bookData, null, 2);
  } catch (err) {
    console.log("Error:", err);
    bookText.textContent = "Error: " + err.message;
  }
}

async function sequenceOfFetchBook() {
  let numOfGet = parseInt(localStorage.getItem("numGet"), 10);
  // Iterate API call function based on number of posts
  while (numOfGet > 0) {
    await fetchBook();
    await new Promise((r) => setTimeout(r, 50));
    numOfGet--;
    localStorage.setItem("numGet", numOfGet);
  }
  // Download response times
  const csv = JSON.parse(localStorage.getItem("responseTimes") || "[]");
  console.log(csv);
  const filename = localStorage.getItem("nameApi");
  downloadCSV(csv, `${filename}-get.csv`).then(() => {
    localStorage.clear();
  });
}
// 1.
function setPostVariables() {
  const inputNumPosts = bookNum.value;
  const inputSize = bookSize.value;
  const api = selectApi.value;

  localStorage.setItem("numPost", inputNumPosts);
  localStorage.setItem("sizePost", inputSize);
  localStorage.setItem("nameApi", api);

  // Call API
  sequenceOfPostCalls();
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

// 3. API CALL with POST
async function postCall() {
  const size = localStorage.getItem("sizePost");
  const api = localStorage.getItem("nameApi");
  const responseTimes = JSON.parse(
    localStorage.getItem("responseTimes") || "[]"
  );
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
  const url = `/${api}/book`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });

  const result = await response.json();
  // Stop time after getting a result
  const endTime = performance.now();
  // Response time
  const responseTime = endTime - startTime;

  // Append to array
  responseTimes.push(responseTime);

  // Save back to localstorage
  localStorage.setItem("responseTimes", JSON.stringify(responseTimes));

  console.log(`Respons time for ${api}: ${responseTime.toFixed(5)} ms`);
  console.log(result);
}

// 4. Iterate APIcall() based on number of posts from localstorage
async function sequenceOfPostCalls() {
  let numOfPosts = parseInt(localStorage.getItem("numPost"), 10);
  // Iterate API call function based on number of posts
  while (numOfPosts > 0) {
    await postCall();
    await new Promise((r) => setTimeout(r, 50));
    numOfPosts--;
    localStorage.setItem("numPost", numOfPosts);
  }
  // Download response times
  const csv = JSON.parse(localStorage.getItem("responseTimes") || "[]");
  console.log(csv);
  const filename = localStorage.getItem("nameApi");
  downloadCSV(csv, `${filename}-post.csv`).then(() => {
    localStorage.clear();
  });
}
