export const getBookSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        book_id: { type: "integer" },
        url: { type: "string" },
        text: { type: "string" },
      },
    },
  },
};

export const createBookSchema = {
  body: {
    type: "object",
    required: ["author", "book_text", "book_size"],
    properties: {
      author: { type: "string" },
      book_text: { type: "string" },
      book_size: {
        type: "string",
        enum: ["small", "medium", "large"],
      },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
      },
    },
  },
};
