// 音频资源路径修复
(function() {
  // 检测并修复Audio.Sound.createAsync方法
  if (window.expo && window.expo.modules && window.expo.modules.av && window.expo.modules.av.Audio) {
    const originalCreateAsync = window.expo.modules.av.Audio.Sound.createAsync;
    
    window.expo.modules.av.Audio.Sound.createAsync = function(source, initialStatus, onPlaybackStatusUpdate, downloadFirst) {
      console.log('拦截音频加载:', source);
      
      // 如果是require方式加载的资源，转换为正确的URL
      if (source && typeof source === 'number') {
        // 根据不同的资源ID映射到正确的文件名
        const fileNameMap = {
          // 这里根据你的实际require映射添加对应关系
          // require ID -> 实际文件名
          1: 'calming-rain.mp3',
          2: 'forest.mp3',
          3: 'nature.mp3',
          4: 'forest-nature.mp3',
          5: 'summer-field.mp3',
          6: 'peaceful-piano-loop.mp3',
          7: 'frog-croaking-sound-effect-322956.mp3',
          8: 'campfirefireplace-crackling-268525.mp3'
        };
        
        // 获取可能的文件名
        let fileName = fileNameMap[source];
        
        if (fileName) {
          // 构建正确的URL
          const correctUrl = window.getAudioPath(fileName);
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
    
    console.log('已安装音频资源路径修复补丁');
  } else {
    console.warn('无法安装音频资源路径修复补丁，Audio模块未找到');
  }
})(); 