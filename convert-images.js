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
    
    const imageDir = path.join(__dirname, 'assets', 'images');
    const images = ['amazon', 'sahara', 'arctic', 'reef', 'himalayas'];
    
    async function convertImage(name) {
      const svgPath = path.join(imageDir, `${name}.svg`);
      const pngPath = path.join(imageDir, `${name}.jpg`);
      
      try {
        const svgBuffer = fs.readFileSync(svgPath);
        await sharp(svgBuffer)
          .jpeg({ quality: 90 })
          .toFile(pngPath);
        console.log(`Converted ${name}.svg to ${name}.jpg`);
      } catch (err) {
        console.error(`Error converting ${name}.svg: ${err.message}`);
      }
    }
    
    async function convertAll() {
      for (const image of images) {
        await convertImage(image);
      }
    }
    
    convertAll().then(() => {
      console.log('All images converted successfully!');
    }).catch(err => {
      console.error('Error during conversion:', err);
    });
  }, 5000); // 给npm install一些时间完成
}); 