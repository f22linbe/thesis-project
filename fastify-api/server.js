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
  required: ["PORT", "DATABASE_URL"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
    DATABASE_URL: {
      type: "string",
    },
  },
};

await fastify.register(FastifyEnv, {
  schema: schema,
  dotenv: true,
  confKey: "config",
});

// Connect to database
await fastify.register(pg, {
  connectionString: fastify.config.DATABASE_URL,
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
