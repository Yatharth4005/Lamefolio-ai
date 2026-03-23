import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: 'f:/Lamefolioai/backend/.env' });

const sql = postgres(process.env.NEON_DATABASE_URL || '', {
  ssl: 'require'
});

async function main() {
  try {
    const users = await sql`SELECT * FROM users`;
    console.log(JSON.stringify({ 
      rows: users, 
      count: users.length, 
      columns: Object.keys(users[0] || {}) 
    }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
