import mysql, { Connection, FieldPacket } from 'mysql2/promise';

// Create a reusable database connection pool.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Function to establish a database connection from the pool.
export async function connectToDatabase(): Promise<Connection> {
    return await pool.getConnection();
}

// Function to execute a query and return results.
export async function executeQuery(query: string): Promise<any> {
    const connection = await connectToDatabase();
    try {
        const [rows, fields]: [any[], FieldPacket[]] = await connection.execute(query);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.end();
    }
}
