use crate::AppState;
use actix_web::{
    HttpResponse, Responder, get, post,
    web::{Data, Json, Path},
};
use serde::{Deserialize, Serialize};
use sqlx::{self, FromRow};

#[derive(Serialize, FromRow)]
struct Book {
    id: i32,
    book_id: i32,
    url: String,
    text: String,
}

#[derive(Deserialize)]
pub struct CreateBook {
    pub author: String,
    pub book_text: String,
    pub book_size: String,
}

#[derive(Serialize)]
pub struct BookMessage {
    pub message: String,
}

#[derive(FromRow)]
pub struct CreateBookInsert {
    pub id: i32,
}

#[get("/book/{id}")]
pub async fn fetch_book(state: Data<AppState>, path: Path<i32>) -> impl Responder {
    let id: i32 = path.into_inner();

    match sqlx::query_as::<_, Book>("SELECT * FROM books WHERE id=$1")
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(book) => HttpResponse::Ok().json(book),
        Err(_) => HttpResponse::NotFound().json("No books found"),
    }

    // HttpResponse::Ok().body("Hello world!")
}

#[post("/book")]
pub async fn create_book(state: Data<AppState>, body: Json<CreateBook>) -> impl Responder {
    let result = sqlx::query_as::<_, CreateBookInsert>(
        "INSERT INTO posted_books (author, book_text, book_size) 
	VALUES ($1, $2, $3::book_size) RETURNING id",
    )
    .bind(body.author.to_string())
    .bind(body.book_text.to_string())
    .bind(body.book_size.to_string())
    .fetch_one(&state.db)
    .await;

    match result {
        Ok(book_insert) => {
            let response = BookMessage {
                message: format!(
                    "Book with id {} has been created in the database",
                    book_insert.id
                ),
            };
            HttpResponse::Ok().json(response)
        }
        Err(e) => {
            eprintln!("DB error: {:?}", e);
            HttpResponse::InternalServerError().json("Failed to create book")
        }
    }
}

pub async fn greet() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}
