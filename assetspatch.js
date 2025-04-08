// 音频资源路径修复 - 更彻底的解决方案
(function() {
  console.log('[Audio Patch] 初始化...');
  
  // 定义音频资源映射表 - 使用清单中的确切文件名
  const AUDIO_FILES = {
    1: 'calming-rain.c64852b8311545e7a2b790c5e19663dc.mp3',
    2: 'forest.4e50765c5043e19715c1bd672f1caf21.mp3',
    3: 'nature.5af401a2508ad521dd2bea1a4c015724.mp3',
    4: 'forest-nature.9cce4e2e1edc60112ed47cc815f456b3.mp3',
    5: 'summer-field.9f0ec56d4946f63855cb225e54b367b4.mp3',
    6: 'peaceful-piano-loop.a37119663146f6dd834f6d23fb3e3d44.mp3',
    7: 'frog-croaking-sound-effect-322956.ee89b00dc29ce7ec709507dc1785bbde.mp3',
    8: 'campfirefireplace-crackling-268525.a12954769d2be79c447f27012fa1fcae.mp3'
  };
  
  // 构建音频URL
  function buildAudioUrl(fileId) {
    // 使用repo绝对路径，不依赖相对路径
    const repoUrl = '/forest-sound-app';
    const filename = AUDIO_FILES[fileId];
    if (!filename) return null;
    
    return `${repoUrl}/assets/${filename}`;
  }
  
  // 创建原生音频元素并缓存
  const audioElements = {};
  
  function createAudio(fileId) {
    if (audioElements[fileId]) {
      return audioElements[fileId];
    }
    
    const url = buildAudioUrl(fileId);
    if (!url) return null;
    
    const audio = new Audio(url);
    audio.loop = true;
    
    // 预加载
    audio.load();
    
    // 缓存
    audioElements[fileId] = audio;
    return audio;
  }
  
  // 检查并修补
  function patchExpoAudio() {
    if (!window.expo || !window.expo.modules || !window.expo.modules.av || !window.expo.modules.av.Audio) {
      console.log('[Audio Patch] Expo Audio 尚未加载');
      return false;
    }
    
    const Audio = window.expo.modules.av.Audio;
    if (!Audio.Sound || !Audio.Sound.createAsync) {
      console.log('[Audio Patch] Audio.Sound.createAsync 不存在');
      return false;
    }

    // 保存原始方法
    const originalCreateAsync = Audio.Sound.createAsync;
    
    // 提供替代播放方法
    Audio.Sound.createAsync = function(source, initialStatus, onPlaybackStatusUpdate, downloadFirst) {
      console.log('[Audio Patch] 拦截音频加载:', source);
      
      // 如果是require方式加载的资源
      if (source && typeof source === 'number') {
        const fileId = source;
        console.log('[Audio Patch] 处理音频ID:', fileId);
        
        // 创建音频元素
        const audio = createAudio(fileId);
        if (!audio) {
          console.error('[Audio Patch] 无法为ID创建音频:', fileId);
          return originalCreateAsync(source, initialStatus, onPlaybackStatusUpdate, downloadFirst);
        }
        
        // 创建模拟的Sound对象
        const mockSound = {
          // 实现基本播放控制
          playAsync: function() {
            console.log('[Audio Patch] 播放音频:', fileId);
            return new Promise((resolve) => {
              audio.play().then(() => {
                resolve({ isPlaying: true });
              }).catch(err => {
                console.error('[Audio Patch] 播放失败:', err);
                resolve({ isPlaying: false, error: err });
              });
            });
          },
          pauseAsync: function() {
            console.log('[Audio Patch] 暂停音频:', fileId);
            audio.pause();
            return Promise.resolve({ isPlaying: false });
          },
          stopAsync: function() {
            console.log('[Audio Patch] 停止音频:', fileId);
            audio.pause();
            audio.currentTime = 0;
            return Promise.resolve({ isPlaying: false });
          },
          unloadAsync: function() {
            console.log('[Audio Patch] 卸载音频:', fileId);
            audio.pause();
            audio.src = '';
            delete audioElements[fileId];
            return Promise.resolve({ isLoaded: false });
          },
          setVolumeAsync: function(volume) {
            console.log('[Audio Patch] 设置音量:', volume);
            audio.volume = volume;
            return Promise.resolve({ volume: volume });
          },
          setIsLoopingAsync: function(isLooping) {
            console.log('[Audio Patch] 设置循环:', isLooping);
            audio.loop = isLooping;
            return Promise.resolve({ isLooping: isLooping });
          },
          setOnPlaybackStatusUpdate: function(callback) {
            if (typeof callback === 'function') {
              // 添加事件监听器
              audio.addEventListener('play', () => {
                callback({ isLoaded: true, isPlaying: true });
              });
              audio.addEventListener('pause', () => {
                callback({ isLoaded: true, isPlaying: false });
              });
              audio.addEventListener('ended', () => {
                callback({ isLoaded: true, isPlaying: false, didJustFinish: true });
              });
            }
          },
          replayAsync: function() {
            console.log('[Audio Patch] 重新播放:', fileId);
            audio.currentTime = 0;
            return this.playAsync();
          }
        };
        
        // 音频错误处理
        audio.onerror = function(e) {
          console.error('[Audio Patch] 音频加载错误:', e);
        };
        
        // 将原始URL路径替换为我们的路径
        const fixedSource = { uri: buildAudioUrl(fileId) };
        console.log('[Audio Patch] 重新映射音频:', source, '=>', fixedSource.uri);
        
        // 如果设置了自动播放
        if (initialStatus && initialStatus.shouldPlay) {
          // 尝试处理自动播放限制
          const playPromise = audio.play().catch(e => {
            console.warn('[Audio Patch] 浏览器阻止了自动播放:', e);
            
            // 添加用户交互处理
            const playOnInteraction = function() {
              audio.play().catch(e => console.error('[Audio Patch] 交互后播放失败:', e));
              document.removeEventListener('click', playOnInteraction);
              document.removeEventListener('touchstart', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
          });
        }
        
        // 返回模拟的Sound对象和创建状态
        return Promise.resolve({
          sound: mockSound,
          status: { isLoaded: true, isPlaying: initialStatus?.shouldPlay || false }
        });
      }
      
      // 对于其他类型的音频，使用原始方法
      return originalCreateAsync(source, initialStatus, onPlaybackStatusUpdate, downloadFirst);
    };
    
    console.log('[Audio Patch] 成功应用!');
    return true;
  }
  
  // 添加事件监听
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[Audio Patch] DOM 已加载，尝试应用补丁');
    if (!patchExpoAudio()) {
      // 设置定时器继续尝试
      let attempts = 0;
      const maxAttempts = 30;
      const interval = setInterval(function() {
        attempts++;
        
        if (patchExpoAudio() || attempts >= maxAttempts) {
          clearInterval(interval);
          if (attempts >= maxAttempts) {
            console.warn(`[Audio Patch] 达到最大尝试次数(${maxAttempts})，停止尝试`);
          }
        }
      }, 200);
    }
  });
  
  // 首次尝试
  patchExpoAudio();
})(); 