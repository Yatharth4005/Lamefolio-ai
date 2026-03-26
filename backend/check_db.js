import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

const sql = postgres(process.env.NEON_DATABASE_URL || '', {
  ssl: 'require',
  connect_timeout: 10
});

async function check() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables found:', tables.map(t => t.table_name).join(', '));
    
    // Check if chat_sessions exists and its columns
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'chat_sessions'
    `;
    console.log('Columns in chat_sessions:', columns.map(c => `${c.column_name} (${c.data_type})`).join(', '));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
