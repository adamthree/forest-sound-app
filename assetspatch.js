// 音频资源路径修复
(function() {
  console.log('音频补丁初始化...');
  
  // 存储原始的require函数引用
  var originalRequire = window.require;
  
  // 添加定期检查，确保在expo模块可用时进行修补
  function checkAndPatchAudio() {
    console.log('检查Audio模块...');
    
    // 如果Audio模块已加载，立即修补
    if (window.expo && window.expo.modules && window.expo.modules.av && window.expo.modules.av.Audio) {
      patchAudioModule();
      return true;
    }
    
    // 否则返回false，继续等待
    return false;
  }
  
  // 音频模块补丁函数
  function patchAudioModule() {
    console.log('找到Audio模块，开始应用补丁');
    const Audio = window.expo.modules.av.Audio;
    
    if (!Audio) {
      console.error('音频模块为空，无法应用补丁');
      return;
    }
    
    // 检查Sound对象
    if (!Audio.Sound) {
      console.error('Audio.Sound不存在，无法应用补丁');
      return;
    }
    
    // 检查createAsync方法
    if (!Audio.Sound.createAsync) {
      console.error('Audio.Sound.createAsync不存在，无法应用补丁');
      return;
    }
    
    // 保存原始方法
    const originalCreateAsync = Audio.Sound.createAsync;
    
    // 重写方法
    Audio.Sound.createAsync = function(source, initialStatus, onPlaybackStatusUpdate, downloadFirst) {
      console.log('音频加载拦截:', source);
      
      // 如果是require方式加载的资源，转换为正确的URL
      if (source && typeof source === 'number') {
        // 根据不同的资源ID映射到正确的文件名
        const fileNameMap = {
          // 这里根据你的实际require映射添加对应关系
          // require ID -> 实际文件名
          1: 'calming-rain.c64852b8311545e7a2b790c5e19663dc.mp3',
          2: 'forest.4e50765c5043e19715c1bd672f1caf21.mp3',
          3: 'nature.5af401a2508ad521dd2bea1a4c015724.mp3',
          4: 'forest-nature.9cce4e2e1edc60112ed47cc815f456b3.mp3',
          5: 'summer-field.9f0ec56d4946f63855cb225e54b367b4.mp3',
          6: 'peaceful-piano-loop.a37119663146f6dd834f6d23fb3e3d44.mp3',
          7: 'frog-croaking-sound-effect-322956.ee89b00dc29ce7ec709507dc1785bbde.mp3',
          8: 'campfirefireplace-crackling-268525.a12954769d2be79c447f27012fa1fcae.mp3'
        };
        
        // 获取可能的文件名
        let fileName = fileNameMap[source];
        
        if (fileName) {
          // 构建正确的URL路径
          const baseUrl = window.baseUrl || '/';
          const correctUrl = `${baseUrl}assets/${fileName}`;
          
          console.log('重新映射音频资源:', source, '->', correctUrl);
          
          // 使用URL替代require ID
          return originalCreateAsync(
            { uri: correctUrl },
            initialStatus,
            onPlaybackStatusUpdate,
            downloadFirst
          );
        }
      }
      
      // 如果不需要修复，则使用原始方法
      return originalCreateAsync(source, initialStatus, onPlaybackStatusUpdate, downloadFirst);
    };
    
    console.log('已成功安装音频资源路径修复补丁');
  }
  
  // 立即尝试修补
  if (!checkAndPatchAudio()) {
    // 如果不成功，设置定时器持续尝试
    console.log('Audio模块尚未加载，将继续尝试');
    
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(function() {
      attempts++;
      if (checkAndPatchAudio() || attempts >= maxAttempts) {
        clearInterval(interval);
        if (attempts >= maxAttempts) {
          console.error(`达到最大尝试次数(${maxAttempts})，停止尝试`);
        }
      }
    }, 300);
  }
  
  // 添加DOM加载完成后的备用修补
  window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，再次尝试修补Audio模块');
    checkAndPatchAudio();
  });
  
  // 添加全局错误处理
  window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise拒绝:', event.reason);
  });
})(); 