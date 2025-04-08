const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// 安装所需的包
console.log('Installing required packages...');
exec('npm install sharp', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error installing packages: ${error.message}`);
    return;
  }
  console.log('Packages installed successfully');
  
  // 等待包安装完成后运行转换代码
  setTimeout(() => {
    const sharp = require('sharp');
    
    const iconDir = path.join(__dirname, 'assets', 'sounds', 'icons');
    const outputDir = path.join(__dirname, 'assets', 'sounds');
    
    const icons = ['nature', 'rain', 'forest'];
    
    async function convertIcon(name) {
      const svgPath = path.join(iconDir, `${name}.svg`);
      const pngPath = path.join(outputDir, `${name}-icon.png`);
      
      try {
        const svgBuffer = fs.readFileSync(svgPath);
        await sharp(svgBuffer)
          .resize(48, 48)
          .png()
          .toFile(pngPath);
        console.log(`Converted ${name}.svg to ${name}-icon.png`);
      } catch (err) {
        console.error(`Error converting ${name}.svg: ${err.message}`);
      }
    }
    
    async function convertAll() {
      for (const icon of icons) {
        await convertIcon(icon);
      }
    }
    
    convertAll().then(() => {
      console.log('All icons converted successfully!');
    }).catch(err => {
      console.error('Error during conversion:', err);
    });
  }, 5000); // 给npm install一些时间完成
}); 