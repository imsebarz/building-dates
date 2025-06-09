const fs = require('fs');
const path = require('path');

/**
 * Build script for production deployment
 */
function build() {
  console.log('🏗️  Building project for production...');

  // Create build directory
  const buildDir = 'build';
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);

  // Copy main files
  const filesToCopy = [
    { src: 'Escalas.html', dest: 'index.html' },
    { src: 'style.css', dest: 'style.css' },
    { src: 'index.js', dest: 'index.js' },
    { src: 'README.md', dest: 'README.md' }
  ];

  filesToCopy.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(buildDir, dest));
      console.log(`✅ Copied ${src} → ${dest}`);
    } else {
      console.warn(`⚠️  File not found: ${src}`);
    }
  });

  // Copy src directory if exists
  if (fs.existsSync('src')) {
    fs.cpSync('src', path.join(buildDir, 'src'), { recursive: true });
    console.log('✅ Copied src/ directory');
  }

  // Copy PDF files if they exist
  const pdfFiles = fs.readdirSync('.').filter(file => file.endsWith('.pdf'));
  pdfFiles.forEach(file => {
    fs.copyFileSync(file, path.join(buildDir, file));
    console.log(`✅ Copied ${file}`);
  });

  // Create optimized package.json for production
  const prodPackageJson = {
    name: "lavada-de-escalas",
    version: "1.0.0",
    description: "Sistema web para gestionar escalas de limpieza de escaleras",
    main: "index.html",
    scripts: {
      start: "python -m http.server 8000"
    },
    keywords: ["escalas", "limpieza", "edificios", "gestión"],
    author: "Sebastian Ruiz",
    license: "MIT"
  };

  fs.writeFileSync(
    path.join(buildDir, 'package.json'),
    JSON.stringify(prodPackageJson, null, 2)
  );
  console.log('✅ Created production package.json');

  // Create .nojekyll file for GitHub Pages
  fs.writeFileSync(path.join(buildDir, '.nojekyll'), '');
  console.log('✅ Created .nojekyll file');

  console.log('🎉 Build completed successfully!');
  console.log(`📁 Output directory: ${buildDir}/`);
}

if (require.main === module) {
  build();
}

module.exports = { build };