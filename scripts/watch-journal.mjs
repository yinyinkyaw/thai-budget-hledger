import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get journal file from environment or use default
const journalFile = process.env.LEDGER_FILE || path.join(__dirname, '..', '.hledger.journal');

console.log('📊 Finance Data Watcher');
console.log('======================');
console.log(`Watching: ${journalFile}`);
console.log('Press Ctrl+C to stop\n');

let isProcessing = false;

async function refreshData() {
  if (isProcessing) {
    console.log('⏳ Already processing, skipping...');
    return;
  }

  isProcessing = true;
  const timestamp = new Date().toLocaleTimeString();
  
  try {
    console.log(`\n🔄 [${timestamp}] Journal changed, refreshing data...`);
    
    // Run the data refresh command
    const { stdout, stderr } = await execAsync('npm run data:refresh', {
      cwd: path.join(__dirname, '..')
    });
    
    if (stderr && !stderr.includes('npm run')) {
      console.error('❌ Error:', stderr);
    } else {
      console.log('✅ Data refreshed successfully!');
      if (stdout) console.log(stdout);
    }
  } catch (error) {
    console.error('❌ Failed to refresh data:', error.message);
  } finally {
    isProcessing = false;
  }
}

// Initial data refresh
await refreshData();

// Watch for changes
fs.watch(journalFile, async (eventType, filename) => {
  if (eventType === 'change') {
    await refreshData();
  }
});

console.log('\n👀 Watching for changes...');
