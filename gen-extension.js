const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  { name: 'name', message: 'Enter the name of your extension: ' },
  { name: 'description', message: 'Enter the description of your extension: ' },
  { name: 'background', message: 'Include background service worker? (y/n): ' },
  { name: 'popup', message: 'Include popup? (y/n): ' },
  { name: 'options', message: 'Include options page? (y/n): ' }
];

let answers = {};

const askQuestion = (index) => {
  if (index >= questions.length) {
    generateExtension();
    rl.close();
    return;
  }

  rl.question(questions[index].message, (answer) => {
    const normalizedAnswer = answer.trim().toLowerCase();
    if (questions[index].name === 'name' || questions[index].name === 'description') {
      answers[questions[index].name] = answer;
    } else {
      answers[questions[index].name] = normalizedAnswer === 'y';
    }
    askQuestion(index + 1);
  });
};

const generateExtension = () => {
  const { name, description, background, popup, options } = answers;
  const dirName = name.toLowerCase().replace(/\s+/g, '-');
  const basePath = path.join(__dirname, dirName);

  // Create extension directory
  fs.mkdirSync(basePath, { recursive: true });

  // Create manifest.json
  const manifest = {
    manifest_version: 3,
    name: name,
    version: '1.0',
    description: description,
    permissions: [],
    icons: {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png'
    },
    action: {}
  };

  if (background) {
    manifest.background = {
      service_worker: 'background.js'
    };
  }

  if (popup) {
    manifest.action.default_popup = 'popup.html';
  }

  if (options) {
    manifest.options_page = 'options.html';
  }

  // Write manifest.json
  fs.writeFileSync(path.join(basePath, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // Create icons directory and placeholder icons
  const iconsDir = path.join(basePath, 'icons');
  fs.mkdirSync(iconsDir);
  ['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
    fs.writeFileSync(path.join(iconsDir, icon), ''); // Placeholder for icon files
  });

  // Create optional files based on features
  if (background) {
    fs.writeFileSync(path.join(basePath, 'background.js'), '// Background service worker');
  }

  if (popup) {
    const popupHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>${name} Popup</title>
  <link rel="stylesheet" type="text/css" href="popup.css">
</head>
<body>
  <h1>${name} Popup</h1>
  <script src="popup.js"></script>
</body>
</html>`;
    const popupCss = `body { font-family: Arial, sans-serif; }`;
    const popupJs = `console.log('${name} Popup script loaded');`;

    fs.writeFileSync(path.join(basePath, 'popup.html'), popupHtml);
    fs.writeFileSync(path.join(basePath, 'popup.css'), popupCss);
    fs.writeFileSync(path.join(basePath, 'popup.js'), popupJs);
  }

  if (options) {
    const optionsHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>${name} Options</title>
  <link rel="stylesheet" type="text/css" href="options.css">
</head>
<body>
  <h1>${name} Options</h1>
  <script src="options.js"></script>
</body>
</html>`;
    const optionsCss = `body { font-family: Arial, sans-serif; }`;
    const optionsJs = `console.log('${name} Options script loaded');`;

    fs.writeFileSync(path.join(basePath, 'options.html'), optionsHtml);
    fs.writeFileSync(path.join(basePath, 'options.css'), optionsCss);
    fs.writeFileSync(path.join(basePath, 'options.js'), optionsJs);
  }

  console.log('Extension generated successfully!');
};

// Start asking questions
askQuestion(0);
