#!/usr/bin/env node
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
  { name: 'contentScripts', message: 'Include content scripts? (y/n): ' },
  { name: 'popup', message: 'Include popup? (y/n): ' },
  { name: 'options', message: 'Include options page? (y/n): ' }
];

let answers = {};

const askQuestions = (index) => {
  if (index >= questions.length) {
    generateExtension();
    rl.close();
    return;
  }
  console.log('');

  rl.question((' > ' + questions[index].message), (answer) => {
    const normalizedAnswer = answer.trim().toLowerCase();
    if(!normalizedAnswer && questions[index].name == 'name') {
      console.log('\n(Warning) Extension name is required. Please run the CLI again and enter the correct details.\n');
      rl.close();
      return;
    }
    if (questions[index].name === 'name' || questions[index].name === 'description') {
      answers[questions[index].name] = answer;
    } else {
      answers[questions[index].name] = normalizedAnswer === 'y';
    }
    askQuestions(index + 1);
  });
};

function duplicateFile(sourcePath, destinationPath) {
  fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
      // console.error('* Error copying file:', err);
    } else {
      // console.log(` * Added icon | ${destinationPath}`);
    }
  });
}

const generateExtension = () => {
  const { name, description, background, contentScripts, popup, options } = answers;
  const dirName = name.toLowerCase().replace(/\s+/g, '-');
  let __pwdTarget = process.cwd();
  const basePath = path.join(__pwdTarget, dirName);

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

  if(contentScripts) {
    manifest.content_scripts = [
      {
        "matches": ["<all_urls>"],
        "css": ["content.css"],
        "js": ["content.js"], 
        "exclude_matches": []
      }
    ]
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
  const __iconsBaseDir = path.join(__dirname, 'icons');
  fs.mkdirSync(iconsDir);
  ['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
    // fs.writeFileSync(path.join(iconsDir, icon), ''); // Placeholder for icon files
    const sourceFilePath = path.join(__iconsBaseDir, icon);
    const destinationFilePath = path.join(iconsDir, icon);
    duplicateFile(sourceFilePath, destinationFilePath);
  });

  // Create optional files based on features
  if (background) {
    fs.writeFileSync(path.join(basePath, 'background.js'), '// Background service worker');
  }
  if (contentScripts) {
    fs.writeFileSync(path.join(basePath, 'content.js'), '// Content script JS');
    fs.writeFileSync(path.join(basePath, 'content.css'), '/* Content script CSS */');
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

  console.log('\nExtension generated successfully!');
};

function main() {
  const args = process.argv.slice(2); // Get command line arguments, ignoring the first two (node and script path)

  if (args.length === 0 || args[0] != 'generate') {
    console.error('Usage: >> chrome-extensions-cli generate');
    process.exit(1);
  }
  askQuestions(0);
}

main();