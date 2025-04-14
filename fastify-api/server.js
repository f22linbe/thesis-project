import Fastify from "fastify";
import FastifyEnv from "@fastify/env";
import pg from "@fastify/postgres";
import { createBookSchema, getBookSchema } from "./schema.js";

const fastify = Fastify({
  logger: true,
});

// Set Environment
const schema = {
  type: "object",
  required: ["PORT", "DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
    DB_USER: { type: "string" },
    DB_PASSWORD: { type: "string" },
    DB_HOST: { type: "string" },
    DB_PORT: { type: "string", default: "5432" },
    DB_NAME: { type: "string" },
  },
};

await fastify.register(FastifyEnv, {
  schema: schema,
  dotenv: true,
  confKey: "config",
});

// Connect to database
await fastify.register(pg, {
  host: fastify.config.DB_HOST,
  port: Number(fastify.config.DB_PORT),
  user: fastify.config.DB_USER,
  password: fastify.config.DB_PASSWORD,
  database: fastify.config.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

fastify.get(
  "/fastify/book/:id",
  {
    schema: getBookSchema,
  },
  async (req, reply) => {
    const { id } = req.params;
    const { rows } = await fastify.pg.query("SELECT * FROM books WHERE id=$1", [
      id,
    ]);
    if (rows.length === 0) {
      return reply.code(404).send({ error: "Book not found" });
    }
    return rows[0];
  }
);

fastify.post(
  "/fastify/book",
  {
    schema: createBookSchema,
  },
  async (req, reply) => {
    const { author, book_text, book_size } = req.body;

    const { rows } = await fastify.pg.query(
      "INSERT INTO posted_books (author, book_text, book_size) VALUES ($1, $2, $3::book_size) RETURNING id",
      [author, book_text, book_size]
    );

    const id = rows[0].id;

    reply
      .code(201)
      .send({ message: `Book with ID ${id} has been posted to the database` });
  }
);

// Run the server!
try {
  await fastify.listen({ port: fastify.config.PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
