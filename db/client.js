import 'dotenv/config'

// import postgres from 'postgres'

// const sql = postgres(process.env.DB_URL)

// export default sql

import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DB_URL, max: 50 })
const client = await pool.connect()

export default client