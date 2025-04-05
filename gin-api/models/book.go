package models

type BookResponse struct {
	ID     int    `json:"id"`
	Bookid int    `json:"book_id"`
	Url    string `json:"url"`
	Text   string `json:"text"`
}

type Book struct {
	Author   string `json:"author"`
	BookText string `json:"book_text"`
	BookSize string `json:"book_size"`
}
