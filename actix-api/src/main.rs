use actix_web::{
    App, HttpServer,
    web::{self, Data},
};
use dotenv::dotenv;
use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
mod services;
use services::{create_book, fetch_book, greet};
pub struct AppState {
    db: Pool<Postgres>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let dbpool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
        .expect("Error building a connection pool");
    let port = 3001;
    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(AppState { db: dbpool.clone() }))
            .service(create_book)
            .service(fetch_book)
            .route("/hey", web::get().to(greet))
    })
    .workers(1)
    .bind(("127.0.0.1", port))?
    .run()
    .await
}
