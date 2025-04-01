package models

type Book struct {
	Author   string `json:"author"`
	BookText string `json:"book_text"`
	BookSize string `json:"book_size"`
}
