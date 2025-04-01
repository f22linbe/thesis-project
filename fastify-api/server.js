import Fastify from 'fastify'
import FastifyEnv from '@fastify/env'
import pg from '@fastify/postgres'

const fastify = Fastify({
  logger: true
})

// Set Environment
const schema = {
  type: 'object',
  required: ['PORT', 'DATABASE_URL'],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    },
    DATABASE_URL: {
      type: 'string'
    }
  }
}

await fastify.register(FastifyEnv, {
  schema: schema,
  dotenv: true,
  confKey: 'config',
})

// Connect to database
await fastify.register(pg,{
  connectionString: fastify.config.DATABASE_URL
})

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

fastify.get('/book/:id', async (req,reply) => {
  const client = await fastify.pg.connect()
  try {
    const { rows } = await client.query(
      'SELECT * FROM books WHERE id=$1', [req.params.id]
    )
    return rows
  } finally {
    // Release the client immediately after query resolves
    client.release()
  }

})

// Run the server!
try {
  await fastify.listen({port: fastify.config.PORT})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}