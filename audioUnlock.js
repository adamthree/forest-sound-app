// 解决Web浏览器的音频自动播放限制
(function() {
  console.log('[Audio Unlock] 初始化...');
  
  // 创建一个静音音频来解锁Web Audio
  function unlockAudio() {
    console.log('[Audio Unlock] 尝试解锁音频...');
    
    // 创建一个短暂的静音音频
    const silentAudio = new Audio();
    silentAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//tUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    silentAudio.load();
    
    const playPromise = silentAudio.play();
    if (playPromise) {
      playPromise.then(() => {
        console.log('[Audio Unlock] 音频已解锁');
        silentAudio.pause();
        silentAudio.currentTime = 0;
      }).catch(e => {
        console.warn('[Audio Unlock] 需要用户交互来解锁音频:', e);
      });
    }
  }
  
  // 页面加载后尝试解锁
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[Audio Unlock] DOM已加载，准备解锁音频');
    
    // 尝试初始解锁
    unlockAudio();
    
    // 监听用户交互事件以解锁音频
    const unlockOnInteraction = function() {
      console.log('[Audio Unlock] 用户交互，尝试解锁');
      unlockAudio();
      
      // 解锁后移除监听器
      document.removeEventListener('click', unlockOnInteraction);
      document.removeEventListener('touchstart', unlockOnInteraction);
      document.removeEventListener('touchend', unlockOnInteraction);
      document.removeEventListener('keydown', unlockOnInteraction);
    };
    
    // 添加各种交互事件监听
    document.addEventListener('click', unlockOnInteraction);
    document.addEventListener('touchstart', unlockOnInteraction);
    document.addEventListener('touchend', unlockOnInteraction);
    document.addEventListener('keydown', unlockOnInteraction);
    
    // 添加可见性变化事件监听，当页面变为可见时尝试解锁
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        unlockAudio();
      }
    });
  });
})(); 