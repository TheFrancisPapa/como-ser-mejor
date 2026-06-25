const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\bb94b4e4-5356-4432-a951-6dde9dc6f313\\.system_generated\\logs\\transcript_full.jsonl';
const outPath = 'c:\\Users\\Usuario\\Documents\\Como ser mejor\\src\\content\\raw_guides.md';

async function extract() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let outContent = '';

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'USER_INPUT' && parsed.content) {
        if (parsed.content.includes('### CATEGORÍA') || parsed.content.includes('#### ')) {
          outContent += parsed.content + '\n\n---\n\n';
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  fs.writeFileSync(outPath, outContent);
  console.log('Extracted content to ' + outPath);
}

extract();
