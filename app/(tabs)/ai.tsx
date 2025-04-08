import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Moon, Clock, Activity, Mic } from 'lucide-react-native';
import { Audio } from 'expo-av';
import Voice from '@react-native-voice/voice';

// 音轨类型定义
interface Track {
  id: number;
  name: string;
  category: string;
  volume: number;
  playing: boolean;
  icon: string;
  soundFile: any;
}

// 音轨数据
const availableTracks: Track[] = [
  { 
    id: 1, 
    name: '雨声', 
    category: '自然', 
    volume: 50, 
    playing: false, 
    icon: '☔',
    soundFile: require('../../assets/sounds/calming-rain.mp3')
  },
  { 
    id: 2, 
    name: '森林声', 
    category: '自然', 
    volume: 60, 
    playing: false, 
    icon: '🌲',
    soundFile: require('../../assets/sounds/forest.mp3')
  },
  { 
    id: 3, 
    name: '自然声', 
    category: '自然', 
    volume: 45, 
    playing: false, 
    icon: '🌿',
    soundFile: require('../../assets/sounds/nature.mp3')
  },
  { 
    id: 4, 
    name: '森林自然', 
    category: '自然', 
    volume: 35, 
    playing: false, 
    icon: '🌳',
    soundFile: require('../../assets/sounds/forest-nature.mp3')
  },
  { 
    id: 5, 
    name: '夏日田野', 
    category: '自然', 
    volume: 30, 
    playing: false, 
    icon: '🌾',
    soundFile: require('../../assets/sounds/summer-field.mp3')
  },
  { 
    id: 6, 
    name: '钢琴曲', 
    category: '音乐', 
    volume: 50, 
    playing: false, 
    icon: '🎹',
    soundFile: require('../../assets/sounds/peaceful-piano-loop.mp3')
  },
  { 
    id: 7, 
    name: '蛙鸣', 
    category: '自然', 
    volume: 40, 
    playing: false, 
    icon: '🐸',
    soundFile: require('../../assets/sounds/frog-croaking-sound-effect-322956.mp3')
  },
  { 
    id: 8, 
    name: '篝火声', 
    category: '自然', 
    volume: 45, 
    playing: false, 
    icon: '🔥',
    soundFile: require('../../assets/sounds/campfirefireplace-crackling-268525.mp3')
  }
];

export default function AIScreen() {
  const [activeTab, setActiveTab] = useState('edit');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTracks, setActiveTracks] = useState<Track[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const soundsRef = useRef<{ [key: number]: Audio.Sound }>({});
  const recognitionRef = useRef<any>(null);

  // 初始化音频
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      // 清理所有音轨
      Object.values(soundsRef.current).forEach(sound => {
        sound.unloadAsync();
      });
    };
  }, [sound]);

  // 初始化语音识别
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Voice.onSpeechStart = () => {
        setIsListening(true);
      };
      Voice.onSpeechEnd = () => {
        setIsListening(false);
      };
      Voice.onSpeechResults = (event) => {
        if (event.value) {
          const transcript = event.value[0];
          setVoiceCommand(transcript);
          handleVoiceCommand(transcript);
        }
      };
      Voice.onSpeechError = (error) => {
        console.error('语音识别错误:', error);
        setIsListening(false);
      };

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }
  }, []);

  // 处理语音指令
  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    console.log('处理语音指令:', command);
    
    // 添加同义词映射表，扩展指令可能的表达方式
    const commandTypes = {
      play: ['播放', '开始', '放', '打开', '开', '启动', '开始播放'],
      pause: ['暂停', '停', '停止', '关', '关闭', '静音'],
      add: ['添加', '叠加', '加入', '放入', '加', '放', '来点', '给我来', '放一下', '播放', '开始', '加一个'],
      remove: ['移除', '删除', '去掉', '拿掉', '减去', '关掉', '去除', '取消', '停止', '不要', '关闭', '删', '关'],
      volumeUp: ['声音大', '音量大', '调大', '大声', '大声点', '增大音量', '增加音量', '声音增大', '音量增加', '声音调大', '声大', '声调大'],
      volumeDown: ['声音小', '音量小', '调小', '小声', '小声点', '减小音量', '降低音量', '声音减小', '音量减少', '声音调小', '声小', '声调小'],
      volume: ['音量', '声音', '响度', '声'],
      removeAll: ['全部移除', '移除全部', '全部删除', '删除全部', '清空', '全部清除', '清除全部', '移除所有', '删除所有', '关闭所有', '停止所有', '全部关闭', '全部停止', '全关了', '关了', '全部关掉', '全都关了']
    };
    
    // 音轨名称的同音词或误识别映射
    const trackNameMap: Record<string, string[]> = {
      '森林声': ['森林声', '森林生', '森林升', '森林胜', '森林剩'],
      '雨声': ['雨声', '雨生', '雨升', '语声'],
      '自然声': ['自然声', '自然生', '自然升'],
      '森林自然': ['森林自然', '森林自然声', '森林自然生'],
      '蛙鸣': ['蛙鸣', '娃鸣', '华鸣', '哇鸣'],
      '篝火声': ['篝火声', '篝火生', '狗火声', '购火声']
    };
    
    // 检查命令类型的通用函数
    const hasCommandType = (types: string[]) => {
      return types.some(type => lowerCommand.includes(type));
    };
    
    // 检查是否包含音轨名称，返回匹配的音轨
    const findTrackByName = (command: string): Track | null => {
      // 首先尝试直接匹配
      for (const track of availableTracks) {
        if (command.includes(track.name.toLowerCase())) {
          return track;
        }
      }
      
      // 如果直接匹配失败，尝试通过同音词映射匹配
      for (const track of availableTracks) {
        const possibleNames = trackNameMap[track.name];
        if (possibleNames && possibleNames.some((name: string) => command.includes(name.toLowerCase()))) {
          return track;
        }
      }
      
      return null;
    };
    
    // 优先检查全部移除指令
    if (hasCommandType(commandTypes.removeAll)) {
      console.log('检测到全部移除指令:', lowerCommand);
      await removeAllTracks();
      return;
    }
    
    // 检查是否为移除指令
    if (hasCommandType(commandTypes.remove)) {
      console.log('检测到移除指令:', lowerCommand);
      
      // 遍历所有可用音轨，检查命令中是否包含音轨名称
      for (const track of availableTracks) {
        // 检查命令中是否包含音轨名称或其同音词
        const trackNames = trackNameMap[track.name] || [track.name];
        if (trackNames.some(name => lowerCommand.includes(name.toLowerCase()))) {
          console.log('找到待移除音轨:', track.name, 'ID:', track.id);
          
          // 无论是否在活动列表中，都尝试强制停止并移除
          if (soundsRef.current[track.id]) {
            // 立即停止音轨
            console.log('尝试停止音轨');
            try {
              soundsRef.current[track.id].stopAsync().then(() => {
                soundsRef.current[track.id].unloadAsync().then(() => {
                  console.log(`${track.name}音轨已停止并卸载`);
                  delete soundsRef.current[track.id];
                  
                  // 从活动音轨中移除
                  setActiveTracks(prev => {
                    console.log('移除前活动音轨数:', prev.length);
                    const newTracks = prev.filter(t => t.id !== track.id);
                    console.log('移除后活动音轨数:', newTracks.length);
                    return newTracks;
                  });
                });
              });
            } catch (e) {
              console.log(`停止${track.name}失败:`, e);
              // 即使停止失败，也尝试从列表中移除
              setActiveTracks(prev => prev.filter(t => t.id !== track.id));
            }
          } else {
            console.log(`没有找到活动的${track.name}音轨引用，但仍尝试从列表中移除`);
            setActiveTracks(prev => prev.filter(t => t.id !== track.id));
          }
          return;
        }
      }
      
      // 如果找不到精确匹配，尝试模糊匹配活跃轨道
      for (const track of activeTracks) {
        const containsKeyword = track.name.split('').some(char => 
          lowerCommand.includes(char) && char.trim() !== '');
        
        if (containsKeyword) {
          console.log('模糊匹配到音轨:', track.name);
          await removeTrack(track);
          return;
        }
      }
      
      console.log('找不到匹配的音轨');
      return;
    }
    
    // 1. 音量调整命令 - 使用更宽泛的表达方式
    if (hasCommandType(commandTypes.volumeUp)) {
      // 找到可能的音轨名称
      const targetTrack = findTrackByName(lowerCommand);
      if (targetTrack) {
        console.log('调大音量:', targetTrack.name);
        const newVolume = Math.min(100, targetTrack.volume + 20);
        await adjustVolume(targetTrack, newVolume);
        return;
      }
      
      // 如果没有指定音轨，调整全部已添加音轨
      if (activeTracks.length > 0) {
        console.log('调大所有音轨音量');
        for (const track of activeTracks) {
          const newVolume = Math.min(100, track.volume + 20);
          await adjustVolume(track, newVolume);
        }
        return;
      }
      
      return;
    }
    
    if (hasCommandType(commandTypes.volumeDown)) {
      // 找到可能的音轨名称
      const targetTrack = findTrackByName(lowerCommand);
      if (targetTrack) {
        console.log('调小音量:', targetTrack.name);
        const newVolume = Math.max(0, targetTrack.volume - 20);
        await adjustVolume(targetTrack, newVolume);
        return;
      }
      
      // 如果没有指定音轨，调整全部已添加音轨
      if (activeTracks.length > 0) {
        console.log('调小所有音轨音量');
        for (const track of activeTracks) {
          const newVolume = Math.max(0, track.volume - 20);
          await adjustVolume(track, newVolume);
        }
        return;
      }
      
      return;
    }
    
    // 2. 查找命令中提到的音轨
    let targetTrack = findTrackByName(lowerCommand);
    
    // 如果找不到特定音轨，但命令很简单（如"小点"），尝试操作最近添加的音轨
    if (!targetTrack && activeTracks.length > 0 && 
        (hasCommandType(commandTypes.volumeUp) || 
         hasCommandType(commandTypes.volumeDown) || 
         hasCommandType(commandTypes.play) || 
         hasCommandType(commandTypes.pause))) {
      console.log('未指定音轨，使用最近添加的音轨');
      targetTrack = activeTracks[activeTracks.length - 1];
    }
    
    if (!targetTrack) {
      console.log('未找到匹配的音轨名称');
      return;
    }
    
    console.log('找到音轨:', targetTrack.name);
    
    // 3. 添加音轨命令 - 特别处理蛙鸣和篝火声
    if ((targetTrack.name === '蛙鸣' || targetTrack.name === '篝火声') && 
        hasCommandType(commandTypes.add)) {
      console.log('尝试添加特殊音轨:', targetTrack.name);
      
      // 查找是否已在活动音轨中
      const isActive = activeTracks.some(t => t.id === targetTrack.id);
      if (!isActive) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          targetTrack.soundFile,
          { shouldPlay: true, volume: targetTrack.volume / 100, isLooping: true }
        );
        
        // 监听播放结束事件
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
            console.log('音轨播放结束，重新开始:', targetTrack.name);
            newSound.replayAsync();
          }
        });
        
        soundsRef.current[targetTrack.id] = newSound;
        setActiveTracks(prev => [...prev, { ...targetTrack, playing: true }]);
        console.log('成功添加音轨:', targetTrack.name);
      } else {
        console.log('音轨已经存在于活动列表中，尝试重新播放');
        if (soundsRef.current[targetTrack.id]) {
          await soundsRef.current[targetTrack.id].playAsync();
          setActiveTracks(prev => prev.map(t => 
            t.id === targetTrack.id ? { ...t, playing: true } : t
          ));
        }
      }
      return;
    }
    
    // 4. 播放/暂停指令 - 使用更宽泛的表达方式
    if (hasCommandType(commandTypes.play) || hasCommandType(commandTypes.pause)) {
      await togglePlayback(targetTrack);
      return;
    }
    
    // 5. 音量控制指令（带数值）
    if (hasCommandType(commandTypes.volume)) {
      const volumeMatch = lowerCommand.match(/(\d+)/);
      if (volumeMatch) {
        const volume = parseInt(volumeMatch[1]);
        if (volume >= 0 && volume <= 100) {
          await adjustVolume(targetTrack, volume);
        }
      }
      return;
    }
    
    // 6. 添加音轨指令 - 使用更宽泛的表达方式
    if (hasCommandType(commandTypes.add)) {
      console.log('尝试添加音轨:', targetTrack.name);
      
      // 查找是否已在活动音轨中
      const isActive = activeTracks.some(t => t.id === targetTrack.id);
      if (!isActive) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          targetTrack.soundFile,
          { shouldPlay: true, volume: targetTrack.volume / 100, isLooping: true }
        );
        
        // 监听播放结束事件
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
            console.log('音轨播放结束，重新开始:', targetTrack.name);
            newSound.replayAsync();
          }
        });
        
        soundsRef.current[targetTrack.id] = newSound;
        setActiveTracks(prev => [...prev, { ...targetTrack, playing: true }]);
        console.log('成功添加音轨:', targetTrack.name);
      } else {
        console.log('音轨已经存在于活动列表中，尝试重新播放');
        if (soundsRef.current[targetTrack.id]) {
          await soundsRef.current[targetTrack.id].playAsync();
          setActiveTracks(prev => prev.map(t => 
            t.id === targetTrack.id ? { ...t, playing: true } : t
          ));
        }
      }
      return;
    }
    
    // 7. 移除音轨指令 - 使用更简单的逻辑
    if (hasCommandType(commandTypes.remove)) {
      console.log('检测到移除指令:', lowerCommand);
      
      // 先直接检查当前活动轨道里有没有匹配的
      for (const track of activeTracks) {
        if (lowerCommand.includes(track.name)) {
          console.log('在活动列表中找到了匹配的音轨:', track.name);
          await removeTrack(track);
          return;
        }
      }
      
      // 如果找不到精确匹配，尝试模糊匹配活跃轨道
      for (const track of activeTracks) {
        const containsKeyword = track.name.split('').some(char => 
          lowerCommand.includes(char) && char.trim() !== '');
        
        if (containsKeyword) {
          console.log('模糊匹配到音轨:', track.name);
          await removeTrack(track);
          return;
        }
      }
      
      // 如果仍然没找到，不显示任何提示，直接返回
      console.log('找不到匹配的音轨');
      return;
    }
    
    // 9. 如果只说了音轨名称
    if (activeTracks.some(t => t.id === targetTrack.id)) {
      // 如果音轨已经在活动列表中，切换播放状态
      await togglePlayback(targetTrack);
    } else {
      // 如果音轨不在活动列表中，添加它
      const { sound: newSound } = await Audio.Sound.createAsync(
        targetTrack.soundFile,
        { shouldPlay: true, volume: targetTrack.volume / 100, isLooping: true }
      );
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          console.log('音轨播放结束，重新开始:', targetTrack.name);
          newSound.replayAsync();
        }
      });
      
      soundsRef.current[targetTrack.id] = newSound;
      setActiveTracks(prev => [...prev, { ...targetTrack, playing: true }]);
      console.log('成功添加音轨:', targetTrack.name);
    }
  };

  // 开始语音识别
  const startListening = async () => {
    try {
      if (Platform.OS === 'web') {
        // 检查浏览器是否支持语音识别
        if (!('webkitSpeechRecognition' in window)) {
          console.error('此浏览器不支持语音识别');
          alert('您的浏览器不支持语音识别功能');
          return;
        }
        
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = true; // 使用连续模式，可以持续识别
        recognition.interimResults = true; // 允许中间结果，提高响应速度
        recognition.maxAlternatives = 3; // 提供多个可能的识别结果
        
        recognition.onstart = () => {
          setIsListening(true);
          setVoiceCommand('正在聆听...');
          console.log('语音识别已启动');
          // 输出当前音轨状态，便于调试
          console.log('启动时活动音轨数:', activeTracks.length);
          console.log('启动时soundsRef音轨数:', Object.keys(soundsRef.current).length);
        };
        
        recognition.onresult = (event: any) => {
          // 获取最新的识别结果
          const latestResult = event.results[event.results.length - 1];
          
          // 如果是最终结果才处理
          if (latestResult.isFinal) {
            const transcript = latestResult[0].transcript;
            console.log('识别结果(最终):', transcript);
            setVoiceCommand(transcript);
            handleVoiceCommand(transcript);
          } else {
            // 显示中间结果但不执行
            const interim = latestResult[0].transcript;
            console.log('识别结果(中间):', interim);
            setVoiceCommand('识别中: ' + interim);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('语音识别错误:', event.error);
          setIsListening(false);
          setVoiceCommand('识别出错，请重试: ' + event.error);
          alert('语音识别错误: ' + event.error);
        };
        
        recognition.onend = () => {
          console.log('语音识别已结束');
          // 如果仍然应该在听，则重新开始
          if (isListening && recognitionRef.current) {
            recognition.start();
            console.log('自动重新开始语音识别');
          } else {
            setIsListening(false);
          }
        };
        
        recognitionRef.current = recognition;
        recognition.start();
      } else {
        await Voice.start('zh-CN');
      }
    } catch (error) {
      console.error('启动语音识别失败:', error);
      setIsListening(false);
      alert('启动语音识别失败: ' + error);
    }
  };

  // 停止语音识别
  const stopListening = async () => {
    try {
      if (Platform.OS === 'web') {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          console.log('停止语音识别');
          // 标记为不再需要自动重启
          setIsListening(false);
          setVoiceCommand('语音识别已停止');
        }
      } else {
        await Voice.stop();
        setIsListening(false);
        setVoiceCommand('语音识别已停止');
      }
    } catch (error) {
      console.error('停止语音识别失败:', error);
      alert('停止语音识别失败: ' + error);
    }
  };

  // 添加音轨
  const addTrack = async (track: Track) => {
    try {
      const foundTrack = availableTracks.find(t => t.id === track.id);
      if (!foundTrack) {
        console.error('未找到此音轨');
        return;
      }
      
      // 检查音轨是否已经存在于活动音轨中
      const exists = activeTracks.some(t => t.id === track.id);
      if (exists) {
        console.log('音轨已经存在，尝试重新播放');
        if (soundsRef.current[track.id]) {
          await soundsRef.current[track.id].playAsync();
          setActiveTracks(prev => prev.map(t => 
            t.id === track.id ? { ...t, playing: true } : t
          ));
        }
        return;
      }
      
      // 创建并播放音轨
      const { sound: newSound } = await Audio.Sound.createAsync(
        foundTrack.soundFile,
        { shouldPlay: true, volume: foundTrack.volume / 100, isLooping: true }
      );
      
      // 监听播放结束事件 (作为备份，即使设置了 isLooping)
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          console.log('音轨播放结束，重新开始:', foundTrack.name);
          newSound.replayAsync();
        }
      });
      
      // 保存音轨引用
      soundsRef.current[track.id] = newSound;
      
      // 更新活动音轨状态
      setActiveTracks(prev => [...prev, { ...foundTrack, playing: true }]);
      console.log('成功添加音轨:', foundTrack.name);
    } catch (error) {
      console.error('添加音轨失败:', error);
    }
  };

  // 移除音轨 - 简化版
  const removeTrack = async (track: Track) => {
    console.log('开始移除音轨:', track.name, 'ID:', track.id);
    
    try {
      // 尝试停止和卸载声音 (如果存在)
      if (soundsRef.current[track.id]) {
        try {
          await soundsRef.current[track.id].stopAsync();
          await soundsRef.current[track.id].unloadAsync();
          console.log('成功停止音频');
        } catch (e) {
          console.log('停止音频出错', e);
        }
        delete soundsRef.current[track.id];
      }
      
      // 无论如何都从激活列表中移除
      setActiveTracks(prev => {
        console.log('移除前轨道数:', prev.length);
        const filtered = prev.filter(t => t.id !== track.id);
        console.log('移除后轨道数:', filtered.length);
        return filtered;
      });
      
      console.log('音轨已移除:', track.name);
    } catch (error) {
      console.error('移除失败:', error);
    }
  };

  // 播放/暂停音轨
  const togglePlayback = async (track: Track) => {
    try {
      if (track.playing) {
        if (soundsRef.current[track.id]) {
          await soundsRef.current[track.id].pauseAsync();
        }
        setActiveTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, playing: false } : t
        ));
      } else {
        if (soundsRef.current[track.id]) {
          await soundsRef.current[track.id].playAsync();
        } else {
          const { sound: newSound } = await Audio.Sound.createAsync(
            track.soundFile,
            { shouldPlay: true, volume: track.volume / 100, isLooping: true }
          );
          
          // 监听播放结束事件
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
              console.log('音轨播放结束，重新开始:', track.name);
              newSound.replayAsync();
            }
          });
          
          soundsRef.current[track.id] = newSound;
        }
        setActiveTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, playing: true } : t
        ));
      }
    } catch (error) {
      console.error('播放音轨失败:', error);
    }
  };

  // 调整音量
  const adjustVolume = async (track: Track, newVolume: number) => {
    try {
      console.log(`尝试调整音轨 ${track.name} (ID: ${track.id}) 的音量到 ${newVolume}%`);
      
      // 首先检查此音轨是否已在活动音轨中
      const activeTrack = activeTracks.find(t => t.id === track.id);
      console.log('此音轨在活动列表中:', !!activeTrack);
      
      if (soundsRef.current[track.id]) {
        // 如果音轨存在，调整其音量
        console.log('音轨引用存在，直接调整音量');
        await soundsRef.current[track.id].setVolumeAsync(newVolume / 100);
        
        // 更新活动音轨的音量
        setActiveTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, volume: newVolume } : t
        ));
      } else if (activeTrack) {
        // 音轨在活动列表中但引用不存在，重新创建引用
        console.log('音轨在活动列表中但引用不存在，重新创建');
        const { sound: newSound } = await Audio.Sound.createAsync(
          track.soundFile,
          { shouldPlay: true, volume: newVolume / 100, isLooping: true }
        );
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
            newSound.replayAsync();
          }
        });
        
        soundsRef.current[track.id] = newSound;
        
        // 只更新现有音轨的音量，不添加新的
        setActiveTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, volume: newVolume, playing: true } : t
        ));
      } else {
        // 如果音轨不存在且不在活动列表中，先添加它
        console.log('音轨不在活动列表中，添加新音轨');
        const { sound: newSound } = await Audio.Sound.createAsync(
          track.soundFile,
          { shouldPlay: true, volume: newVolume / 100, isLooping: true }
        );
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
            newSound.replayAsync();
          }
        });
        
        soundsRef.current[track.id] = newSound;
        setActiveTracks(prev => [...prev, { ...track, volume: newVolume, playing: true }]);
      }
      
      console.log(`${track.name} 音量调整完成`);
    } catch (error) {
      console.error('调整音量失败:', error);
    }
  };

  // 切换静音
  const toggleMute = async () => {
    try {
      Object.values(soundsRef.current).forEach(async (sound) => {
        if (isMuted) {
          await sound.setVolumeAsync(1);
        } else {
          await sound.setVolumeAsync(0);
        }
      });
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('切换静音失败:', error);
    }
  };

  // 移除所有音轨
  const removeAllTracks = async () => {
    try {
      console.log('开始移除所有音轨，当前活动音轨数量:', activeTracks.length);
      
      // 先检查soundsRef中是否有音轨引用
      const soundIds = Object.keys(soundsRef.current);
      console.log('当前soundsRef中的音轨数:', soundIds.length);
      console.log('soundsRef中的音轨ID:', soundIds);
      
      // 强制清理所有可能的音轨，不管它们是否在soundsRef中
      console.log('尝试强制清理所有可能的音轨');
      let trackRemoved = false;
      
      // 首先停止所有当前音轨
      if (soundIds.length > 0) {
        for (const id of soundIds) {
          const numericId = parseInt(id);
          try {
            console.log(`尝试停止音轨ID: ${id}`);
            await soundsRef.current[numericId].stopAsync();
            await soundsRef.current[numericId].unloadAsync();
            delete soundsRef.current[numericId];
            trackRemoved = true;
            console.log(`成功卸载音轨ID: ${id}`);
          } catch (error) {
            console.error(`卸载音轨失败 ID: ${id}`, error);
          }
        }
      }
      
      // 再按照可用音轨列表再次尝试清理，以防万一
      for (const track of availableTracks) {
        if (soundsRef.current[track.id]) {
          try {
            console.log('尝试卸载额外音轨ID:', track.id, '名称:', track.name);
            await soundsRef.current[track.id].stopAsync().catch(e => console.log('停止失败，继续卸载'));
            await soundsRef.current[track.id].unloadAsync().catch(e => console.log('卸载失败，继续删除'));
            delete soundsRef.current[track.id];
            trackRemoved = true;
          } catch (error) {
            console.error('卸载音轨失败:', track.id, error);
          }
        }
      }
      
      // 强制清空soundsRef
      for (const key in soundsRef.current) {
        try {
          delete soundsRef.current[key];
        } catch (e) {
          console.error('删除soundsRef键失败:', key);
        }
      }
      
      // 检查清理后的状态
      console.log('清理后soundsRef中的音轨数:', Object.keys(soundsRef.current).length);
      
      // 清空活动音轨列表
      const hadActiveTracks = activeTracks.length > 0;
      if (activeTracks.length > 0) {
        console.log('清空前的活动音轨:', JSON.stringify(activeTracks.map(t => ({ id: t.id, name: t.name }))));
      }
      setActiveTracks([]);
      
      if (trackRemoved || hadActiveTracks) {
        console.log('成功移除所有音轨');
      } else {
        console.log('没有活动的音轨可移除');
      }

      // 最后一道防线：直接重新初始化音频系统
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      }).catch(e => console.log('设置音频模式失败', e));
      
      // 最后警告一下如果仍有音轨残留
      const remainingTracks = Object.keys(soundsRef.current);
      if (remainingTracks.length > 0) {
        console.warn('警告：仍有音轨未清理干净:', remainingTracks);
      } else {
        console.log('所有音轨已完全清理');
      }
      
      // 强制更新UI
      setActiveTracks([...[]]);
    } catch (error) {
      console.error('移除所有音轨失败:', error);
    }
  };

  // 睡眠数据
  const sleepData = {
    date: '2023-04-20',
    score: 85,
    deepSleep: '2.5h',
    totalSleep: '7.5h',
    efficiency: 98,
    sleepTime: '23:30',
    wakeTime: '07:00'
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen
        options={{
          title: 'AI声音编辑',
          headerRight: () => (
            <TouchableOpacity style={styles.menuButton}>
              <Menu size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'edit' && styles.activeTab]}
          onPress={() => setActiveTab('edit')}
        >
          <Text style={[styles.tabText, activeTab === 'edit' && styles.activeTabText]}>AI编辑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sleep' && styles.activeTab]}
          onPress={() => setActiveTab('sleep')}
        >
          <Text style={[styles.tabText, activeTab === 'sleep' && styles.activeTabText]}>AI睡眠</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'edit' ? (
        <ScrollView style={styles.content}>
          <View style={styles.voiceCommandContainer}>
            <TouchableOpacity
              style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
              onPress={isListening ? stopListening : startListening}
            >
              <Mic size={24} color={isListening ? '#fff' : '#52B788'} />
              <Text style={[styles.voiceButtonText, isListening && styles.voiceButtonTextActive]}>
                {isListening ? '停止语音' : '开始语音'}
              </Text>
            </TouchableOpacity>
            {voiceCommand ? (
              <Text style={styles.voiceCommandText}>指令: {voiceCommand}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>我的音轨</Text>
            {availableTracks
              .filter(track => selectedCategory === 'all' || track.category === selectedCategory)
              .map(track => (
                <View key={track.id} style={styles.trackItem}>
                  <Text style={styles.trackIcon}>{track.icon}</Text>
                  <Text style={styles.trackName}>{track.name}</Text>
                  <View style={styles.volumeContainer}>
                    <Volume2 size={20} color="#666" />
                    <View style={styles.volumeBar}>
                      <View 
                        style={[
                          styles.volumeFill, 
                          { width: `${track.volume}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.volumeText}>{track.volume}%</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={() => togglePlayback(track)}
                  >
                    {track.playing ? <Pause size={20} color="#52B788" /> : <Play size={20} color="#52B788" />}
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          {activeTracks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>当前活动音轨</Text>
              {activeTracks.map((track, index) => (
                <View key={`active-${track.id}-${index}`} style={[styles.trackItem, styles.activeTrackItem]}>
                  <Text style={styles.trackIcon}>{track.icon}</Text>
                  <Text style={styles.trackName}>{track.name}</Text>
                  <View style={styles.volumeContainer}>
                    <Volume2 size={20} color="#666" />
                    <View style={styles.volumeBar}>
                      <View 
                        style={[
                          styles.volumeFill, 
                          { width: `${track.volume}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.volumeText}>{track.volume}%</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={() => togglePlayback(track)}
                  >
                    {track.playing ? <Pause size={20} color="#52B788" /> : <Play size={20} color="#52B788" />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeTrack(track)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>声音分类</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.categoryButton, selectedCategory === 'all' && styles.activeCategory]}
                onPress={() => setSelectedCategory('all')}
              >
                <Text style={[styles.categoryText, selectedCategory === 'all' && styles.activeCategoryText]}>全部</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryButton, selectedCategory === '自然' && styles.activeCategory]}
                onPress={() => setSelectedCategory('自然')}
              >
                <Text style={[styles.categoryText, selectedCategory === '自然' && styles.activeCategoryText]}>自然</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryButton, selectedCategory === '音乐' && styles.activeCategory]}
                onPress={() => setSelectedCategory('音乐')}
              >
                <Text style={[styles.categoryText, selectedCategory === '音乐' && styles.activeCategoryText]}>音乐</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>语音指令说明</Text>
            <View style={styles.commandList}>
              <Text style={styles.commandItem}>• 播放/开始/放/打开 [音轨名称] - 控制音轨播放</Text>
              <Text style={styles.commandItem}>• 暂停/停止/关闭 [音轨名称] - 暂停音轨</Text>
              <Text style={styles.commandItem}>• [音轨名称] 音量 [数值] - 调整音轨音量</Text>
              <Text style={styles.commandItem}>• [音轨名称] 声音大/小/大声点/小声点 - 调整音量</Text>
              <Text style={styles.commandItem}>• 添加/叠加/来点/放一下 [音轨名称] - 添加新音轨</Text>
              <Text style={styles.commandItem}>• 移除/删除/去掉/关掉 [音轨名称] - 移除音轨</Text>
              <Text style={styles.commandItem}>• 全部移除/清空/移除所有 - 移除所有音轨</Text>
              <Text style={styles.commandItem}>• 直接说出音轨名称 - 自动添加或播放/暂停</Text>
              <Text style={styles.commandItem}>• 可用音轨：雨声, 森林声, 自然声, 森林自然, 夏日田野, 钢琴曲, 蛙鸣, 篝火声</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.sleepCard}>
            <Text style={styles.sleepDate}>{sleepData.date}</Text>
            <View style={styles.sleepMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{sleepData.deepSleep}</Text>
                <Text style={styles.metricLabel}>深睡</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{sleepData.score}</Text>
                <Text style={styles.metricLabel}>睡眠评分</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{sleepData.efficiency}%</Text>
                <Text style={styles.metricLabel}>睡眠效率</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.startButton}>
            <Moon size={24} color="#fff" />
            <Text style={styles.startButtonText}>开始睡眠监测</Text>
          </TouchableOpacity>

          <View style={styles.sleepDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>睡眠评分</Text>
              <Text style={styles.detailValue}>{sleepData.score}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>总睡眠时长</Text>
              <Text style={styles.detailValue}>{sleepData.totalSleep}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>深睡时长</Text>
              <Text style={styles.detailValue}>{sleepData.deepSleep}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>睡眠效率</Text>
              <Text style={styles.detailValue}>{sleepData.efficiency}%</Text>
            </View>
          </View>

          <View style={styles.sleepTime}>
            <View style={styles.timeItem}>
              <Clock size={20} color="#666" />
              <Text style={styles.timeLabel}>入睡时间</Text>
              <Text style={styles.timeValue}>{sleepData.sleepTime}</Text>
            </View>
            <View style={styles.timeItem}>
              <Activity size={20} color="#666" />
              <Text style={styles.timeLabel}>起床时间</Text>
              <Text style={styles.timeValue}>{sleepData.wakeTime}</Text>
            </View>
          </View>

          <View style={styles.sleepTips}>
            <Moon size={20} color="#666" />
            <Text style={styles.tipsText}>保持良好的睡眠习惯，有助于提高睡眠质量</Text>
          </View>
        </ScrollView>
      )}

      {activeTab === 'edit' && (
        <View style={styles.playerBar}>
          <Text style={styles.playerTitle}>个性化音符</Text>
          <View style={styles.playerControls}>
            <TouchableOpacity style={styles.controlButton}>
              <SkipBack size={24} color="#52B788" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={24} color="#fff" /> : <Play size={24} color="#fff" />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <SkipForward size={24} color="#52B788" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.volumeButton}
            onPress={toggleMute}
          >
            {isMuted ? <VolumeX size={24} color="#52B788" /> : <Volume2 size={24} color="#52B788" />}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuButton: {
    padding: 10,
    marginRight: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#52B788',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#52B788',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  voiceCommandContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  voiceButtonActive: {
    backgroundColor: '#52B788',
  },
  voiceButtonText: {
    marginLeft: 5,
    color: '#52B788',
    fontSize: 16,
  },
  voiceButtonTextActive: {
    color: '#fff',
  },
  voiceCommandText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  commandList: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  commandItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  trackIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  trackName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  volumeBar: {
    width: 100,
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#52B788',
    borderRadius: 2,
  },
  volumeText: {
    fontSize: 12,
    color: '#666',
    minWidth: 30,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeCategory: {
    backgroundColor: '#52B788',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
  },
  sleepCard: {
    backgroundColor: '#52B788',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sleepDate: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  sleepMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#52B788',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sleepDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginRight: '4%',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sleepTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginRight: 5,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sleepTips: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  playerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  playerTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 10,
  },
  volumeButton: {
    padding: 10,
  },
  activeTrackItem: {
    backgroundColor: '#e6f7ef',
    borderLeftWidth: 3,
    borderLeftColor: '#52B788',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffeeee',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    color: '#ff5555',
    fontSize: 18,
    fontWeight: 'bold',
  },
});