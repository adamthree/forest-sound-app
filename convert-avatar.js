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
    const svgPath = path.join(imageDir, 'avatar.svg');
    const pngPath = path.join(imageDir, 'avatar.png');
    
    async function convertImage() {
      try {
        const svgBuffer = fs.readFileSync(svgPath);
        await sharp(svgBuffer)
          .png()
          .toFile(pngPath);
        console.log('Converted avatar.svg to avatar.png');
      } catch (err) {
        console.error(`Error converting avatar.svg: ${err.message}`);
      }
    }
    
    convertImage().then(() => {
      console.log('Avatar conversion completed!');
    }).catch(err => {
      console.error('Error during conversion:', err);
    });
  }, 5000); // 给npm install一些时间完成
}); 