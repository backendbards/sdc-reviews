import 'dotenv/config'

import postgres from 'postgres'

const sql = postgres(process.env.DB_URL, { max: 99 })

export default sql

// import pg from 'pg'

// const { Pool, Client } = pg
// const client = () => new Client({ connectionString: process.env.DB_URL, max: 50 })
// // const pool = new Pool({ connectionString: process.env.DB_URL, max: 50 })
// // const client = await c.connect()

// export default client