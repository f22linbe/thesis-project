const selectApi = document.getElementById("select-api");
const bookId = document.getElementById("book-id");
const bookText = document.getElementById("book-text");

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
