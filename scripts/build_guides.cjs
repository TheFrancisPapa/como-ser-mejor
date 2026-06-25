const fs = require('fs');

const rawMarkdown = fs.readFileSync('src/content/raw_guides.md', 'utf8');

// Basic parser logic to separate categories and subtopics
const categories = {};
let currentCategory = null;
let currentSubtopic = null;

const lines = rawMarkdown.split('\n');

for (const line of lines) {
  if (line.startsWith('### CATEGORÍA')) {
    currentCategory = line.replace('### CATEGORÍA', '').trim();
    categories[currentCategory] = [];
  } else if (line.startsWith('#### ')) {
    currentSubtopic = { title: line.replace('#### ', '').trim(), content: '' };
    if (currentCategory && categories[currentCategory]) {
      categories[currentCategory].push(currentSubtopic);
    }
  } else if (currentSubtopic) {
    currentSubtopic.content += line + '\n';
  }
}

fs.writeFileSync('src/content/parsed_guides.json', JSON.stringify(categories, null, 2));
console.log('Parsed guides successfully into JSON.');
