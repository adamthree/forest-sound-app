import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Dimensions, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, X, MapPin, CheckCircle, Plus, Minus, Calendar, Bell } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 修改声音点位类型，添加区域属性
interface SoundLocation {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  soundFile: any;
  image: any;
  isUnlocked: boolean;
  visits: number;
  x: number;
  y: number;
  region?: string; // 声音所属区域
}

// 区域数据
interface Region {
  id: string;
  name: string;
  x: number;
  y: number;
  count: number; // 该区域有多少声音
}

// 声音点位数据
const soundLocations: SoundLocation[] = [
  {
    id: '1',
    name: '亚马逊雨林',
    description: '巴西热带雨林的自然声音，包括鸟鸣、昆虫和雨滴声。',
    latitude: -3.4653,
    longitude: -62.2159,
    soundFile: require('../../assets/sounds/forest-nature.mp3'),
    image: require('../../assets/images/amazon.jpg'),
    isUnlocked: true,
    visits: 15,
    x: 50,
    y: 200,
    region: '1' // 南美洲
  },
  {
    id: '2',
    name: '撒哈拉沙漠',
    description: '非洲撒哈拉沙漠的风声和沙丘移动的声音。',
    latitude: 23.8859,
    longitude: 10.1808,
    soundFile: require('../../assets/sounds/summer-field.mp3'),
    image: require('../../assets/images/sahara.jpg'),
    isUnlocked: true,
    visits: 12,
    x: 200,
    y: 120,
    region: '2' // 非洲
  },
  {
    id: '3',
    name: '北极冰原',
    description: '北极冰原的冰裂声和风声。',
    latitude: 78.6569,
    longitude: 16.3715,
    soundFile: require('../../assets/sounds/calming-rain.mp3'),
    image: require('../../assets/images/arctic.jpg'),
    isUnlocked: true,
    visits: 8,
    x: 180,
    y: 30,
    region: '3' // 北极
  },
  {
    id: '4',
    name: '大堡礁',
    description: '澳大利亚大堡礁的海洋生物声音。',
    latitude: -18.2871,
    longitude: 147.6992,
    soundFile: require('../../assets/sounds/nature.mp3'),
    image: require('../../assets/images/reef.jpg'),
    isUnlocked: false,
    visits: 0,
    x: 300,
    y: 180,
    region: '4' // 大洋洲
  },
  {
    id: '5',
    name: '喜马拉雅山脉',
    description: '喜马拉雅山脉的风声和雪崩声。',
    latitude: 27.9881,
    longitude: 86.9250,
    soundFile: require('../../assets/sounds/forest.mp3'),
    image: require('../../assets/images/himalayas.jpg'),
    isUnlocked: false,
    visits: 0,
    x: 250,
    y: 100,
    region: '5' // 亚洲
  },
  {
    id: '6',
    name: '威尼斯水城',
    description: '意大利威尼斯的河水拍打声和远处的船夫歌声。',
    latitude: 45.4408,
    longitude: 12.3155,
    soundFile: require('../../assets/sounds/summer-field.mp3'),
    image: require('../../assets/images/sahara.jpg'),
    isUnlocked: true,
    visits: 10,
    x: 170,
    y: 90,
    region: '6' // 欧洲
  },
  {
    id: '7',
    name: '东京街头',
    description: '日本东京繁忙街头的城市声音混合。',
    latitude: 35.6762,
    longitude: 139.6503,
    soundFile: require('../../assets/sounds/calming-rain.mp3'),
    image: require('../../assets/images/arctic.jpg'),
    isUnlocked: true,
    visits: 7,
    x: 270,
    y: 110,
    region: '5' // 亚洲
  },
  {
    id: '8',
    name: '夏威夷海滩',
    description: '夏威夷海滩的海浪和热带鸟鸣声。',
    latitude: 19.8968,
    longitude: -155.5828,
    soundFile: require('../../assets/sounds/nature.mp3'),
    image: require('../../assets/images/reef.jpg'),
    isUnlocked: false,
    visits: 0,
    x: 60,
    y: 130,
    region: '7' // 北美洲
  },
  {
    id: '9',
    name: '南极冰盖',
    description: '南极洲冰盖的裂冰声和极地风暴声。',
    latitude: -90.0000,
    longitude: 0.0000,
    soundFile: require('../../assets/sounds/forest.mp3'),
    image: require('../../assets/images/himalayas.jpg'),
    isUnlocked: false,
    visits: 0,
    x: 170,
    y: 290,
    region: '8' // 南极洲
  }
];

// 定义区域数据
const regions: Region[] = [
  { id: '1', name: '#1', x: 130, y: 220, count: 23 },
  { id: '2', name: '#2', x: 200, y: 185, count: 18 },
  { id: '3', name: '#3', x: 205, y: 35, count: 12 },
  { id: '4', name: '#4', x: 310, y: 230, count: 15 },
  { id: '5', name: '#5', x: 270, y: 125, count: 27 },
  { id: '6', name: '#6', x: 195, y: 95, count: 19 },
  { id: '7', name: '#7', x: 95, y: 120, count: 21 },
  { id: '8', name: '#8', x: 205, y: 300, count: 9 }
];

export default function SoundMapScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<SoundLocation | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [showModal, setShowModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [locations, setLocations] = useState<SoundLocation[]>(soundLocations);
  const [mapRef, setMapRef] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showCheckInAnimation, setShowCheckInAnimation] = useState(false);
  const [checkedInDays, setCheckedInDays] = useState(3);
  const [showCheckInCard, setShowCheckInCard] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [showRegionSounds, setShowRegionSounds] = useState(false);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 });

  // 清理音频资源
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // 更新播放进度
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sound && isPlaying) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis / 1000);
          setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
          
          // 如果播放完成，解锁该位置
          if (status.didJustFinish && currentLocation) {
            unlockLocation(currentLocation.id);
            setShowUnlockModal(true);
          }
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sound, isPlaying, currentLocation]);

  // 播放声音
  async function playSound(location: SoundLocation) {
    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        location.soundFile,
        { 
          shouldPlay: true,
          volume: volume,
        },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setCurrentLocation(location);
      setIsPlaying(true);
      setShowModal(true);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  // 播放状态更新
  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
    }
  }

  // 播放/暂停切换
  async function togglePlayPause() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  }

  // 跳转到指定位置
  async function seekTo(value: number) {
    if (sound) {
      await sound.setPositionAsync(value * 1000);
    }
  }

  // 格式化时间
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // 关闭模态框
  function closeModal() {
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
    }
    setShowModal(false);
    setSound(null);
    setIsPlaying(false);
    setCurrentLocation(null);
  }

  // 解锁位置
  function unlockLocation(id: string) {
    setLocations(prevLocations => 
      prevLocations.map(location => 
        location.id === id ? { 
          ...location, 
          isUnlocked: true,
          visits: location.visits + 1
        } : location
      )
    );
  }

  // 放大地图
  function zoomIn() {
    if (zoomLevel < 2) {
      setZoomLevel(zoomLevel + 0.1);
    }
  }

  // 缩小地图
  function zoomOut() {
    if (zoomLevel > 0.8) {
      setZoomLevel(zoomLevel - 0.1);
    }
  }

  // 签到
  function checkIn() {
    setCheckedInDays(checkedInDays + 1);
    setShowCheckInAnimation(true);
    setShowCheckInCard(false);
    
    // 3秒后隐藏动画
    setTimeout(() => {
      setShowCheckInAnimation(false);
    }, 3000);
  }

  // 分享打卡图片
  async function shareCheckIn() {
    try {
      if (mapRef) {
        const uri = await captureRef(mapRef, {
          format: 'png',
          quality: 0.8,
        });
        
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: '分享你的声音打卡',
        });
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  }

  // 处理区域点击
  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region);
    setShowRegionSounds(true);
    
    // 放大并移动到区域中心
    setZoomLevel(1.8);
    setMapCenter({ x: region.x, y: region.y });
  };
  
  // 关闭区域声音列表
  const closeRegionSounds = () => {
    setShowRegionSounds(false);
    setSelectedRegion(null);
    
    // 恢复地图
    setZoomLevel(1);
    setMapCenter({ x: 0, y: 0 });
  };
  
  // 获取区域内的声音
  const getRegionSounds = (regionId: string) => {
    return locations.filter(location => location.region === regionId);
  };

  // 调整音量
  async function setVolumeLevel(value: number) {
    setVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  }

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>声音地图</Text>
        <View style={styles.navRight}>
          <View style={styles.checkInDays}>
            <Calendar size={16} color="#fff" />
            <Text style={styles.checkInText}>已打卡 {checkedInDays} 天</Text>
          </View>
          <View style={styles.notificationIcon}>
            <Bell size={20} color="#fff" />
            <View style={styles.notificationBadge} />
          </View>
        </View>
      </View>

      {/* 签到卡片 */}
      {showCheckInCard && (
        <View style={styles.checkInCard}>
          <View style={styles.checkInHeader}>
            <Text style={styles.checkInTitle}>每日签到</Text>
            <TouchableOpacity style={styles.checkInButton} onPress={checkIn}>
              <Text style={styles.checkInButtonText}>立即签到</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weekDays}>
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <View key={day} style={styles.dayItem}>
                <View style={[
                  styles.dayCircle, 
                  day <= checkedInDays ? styles.dayChecked : styles.dayUnchecked
                ]}>
                  {day <= checkedInDays && (
                    <CheckCircle size={12} color="#fff" />
                  )}
                </View>
                <Text style={styles.dayText}>周{day}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 世界地图区域 */}
      <View style={styles.mapWrapper}>
        <View 
          style={[
            styles.mapContainer, 
            { 
              transform: [
                { scale: zoomLevel },
                { translateX: selectedRegion ? -(selectedRegion.x / 2) : 0 },
                { translateY: selectedRegion ? -(selectedRegion.y / 2) : 0 }
              ] 
            }
          ]} 
          ref={ref => setMapRef(ref)}
        >
          <View style={styles.mapImage}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1' }}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                opacity: 1,
                resizeMode: 'cover',
              }}
            />
            <View 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
              }}
            />
          </View>
          
          {/* 区域标记 */}
          {regions.map((region) => (
            <TouchableOpacity
              key={region.id}
              style={[
                styles.regionMarker,
                {
                  left: region.x,
                  top: region.y,
                },
              ]}
              onPress={() => handleRegionClick(region)}
            >
              <View style={styles.regionCircle}>
                <Text style={styles.regionNumber}>{region.count}</Text>
              </View>
              <Text style={styles.regionName}>{region.name}</Text>
            </TouchableOpacity>
          ))}
          
          {/* 声音位置标记 - 只在区域展开时显示 */}
          {showRegionSounds && selectedRegion && 
            getRegionSounds(selectedRegion.id).map((location) => (
              <View key={location.id} style={[
                styles.locationMarkerContainer,
                {
                  left: location.x,
                  top: location.y,
                },
              ]}>
                <TouchableOpacity
                  style={styles.locationMarker}
                  onPress={() => playSound(location)}
                >
                  <View style={styles.markerInner}>
                    <Ionicons name="musical-note" size={18} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.markerName}>{location.name}</Text>
              </View>
            ))
          }
          
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <Ionicons name="remove" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.locationFilters}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>全部</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.filterInactive]}>
              <Text style={styles.filterInactiveText}>自然</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.filterInactive]}>
              <Text style={styles.filterInactiveText}>城市</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.filterInactive]}>
              <Text style={styles.filterInactiveText}>白噪音</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* 区域声音列表 */}
      {showRegionSounds && selectedRegion && (
        <View style={styles.regionSoundsOverlay}>
          <View style={styles.regionSoundsHeader}>
            <Text style={styles.regionSoundsTitle}>
              声音合集 #{selectedRegion.id} ({selectedRegion.count}个)
            </Text>
            <TouchableOpacity onPress={closeRegionSounds} style={styles.closeRegionButton}>
              <X color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.regionSoundsList}>
            {getRegionSounds(selectedRegion.id).map(sound => (
              <TouchableOpacity 
                key={sound.id} 
                style={styles.regionSoundItem}
                onPress={() => playSound(sound)}
              >
                <Image source={sound.image} style={styles.regionSoundImage} />
                <View style={styles.regionSoundInfo}>
                  <Text style={styles.regionSoundName}>{sound.name}</Text>
                  <Text style={styles.regionSoundDesc} numberOfLines={2}>{sound.description}</Text>
                </View>
                <View style={styles.playIconContainer}>
                  <Play color="#FF6B6B" size={20} />
                </View>
              </TouchableOpacity>
            ))}
            {/* 添加更多声音示例 */}
            {selectedRegion && Array.from({ length: 3 }).map((_, index) => (
              <TouchableOpacity 
                key={`example-${index}`} 
                style={styles.regionSoundItem}
                onPress={() => alert('此声音示例尚未实现')}
              >
                <View style={styles.regionSoundImage}>
                  <View style={{
                    width: 60, 
                    height: 60, 
                    borderRadius: 8, 
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Ionicons name="musical-note" size={24} color="#FF6B6B" />
                  </View>
                </View>
                <View style={styles.regionSoundInfo}>
                  <Text style={styles.regionSoundName}>{selectedRegion.name}声音{index + getRegionSounds(selectedRegion.id).length + 1}</Text>
                  <Text style={styles.regionSoundDesc} numberOfLines={2}>这是{selectedRegion.name}地区的更多声音示例，点击即可收听。</Text>
                </View>
                <View style={styles.playIconContainer}>
                  <Play color="#FF6B6B" size={20} />
                </View>
              </TouchableOpacity>
            ))}
            <View style={{height: 80}} />
          </ScrollView>
        </View>
      )}

      {/* 底部播放控件 */}
      {currentLocation && (
        <View style={styles.playBar}>
          <View style={styles.playBarContent}>
            <View style={styles.songInfo}>
              <Image 
                source={currentLocation.image} 
                style={styles.songThumbnail} 
              />
              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{currentLocation.name}</Text>
                <Text style={styles.songSubtitle}>
                  正在播放 · 已完成 {formatTime(position)}
                </Text>
              </View>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="play-skip-back" size={20} color="#2D6A4F" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.playButton} 
                onPress={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause color="#ffffff" size={20} />
                ) : (
                  <Play color="#ffffff" size={20} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="play-skip-forward" size={20} color="#2D6A4F" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(position / duration) * 100}%` }]} />
          </View>
          {/* 音量控制区域 */}
          <View style={styles.volumeSection}>
            <View style={styles.volumeContainer}>
              <Ionicons name="volume-low" size={16} color="#ffffff" />
              <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={setVolumeLevel}
                minimumTrackTintColor="#52B788"
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor="#52B788"
              />
              <Ionicons name="volume-high" size={16} color="#ffffff" />
            </View>
          </View>
        </View>
      )}

      {/* 打卡动画 */}
      {showCheckInAnimation && (
        <Modal
          transparent={true}
          visible={showCheckInAnimation}
          animationType="fade"
        >
          <View style={styles.checkInAnimationOverlay}>
            <View style={styles.checkInAnimationCard}>
              <Image 
                source={soundLocations[2].image}
                style={styles.checkInAnimationImage} 
              />
              <Text style={styles.checkInAnimationTitle}>
                北极冰原陪伴下入眠
              </Text>
              <Text style={styles.checkInAnimationText}>
                今晚在北极的抚慰下，您已完成 45 分钟的深度睡眠
              </Text>
              <View style={styles.checkInAnimationBadges}>
                <View style={styles.checkInBadge}>
                  <Text style={styles.checkInBadgeText}>
                    连续打卡 {checkedInDays} 天
                  </Text>
                </View>
                <View style={styles.checkInBadge}>
                  <Text style={styles.checkInBadgeText}>
                    获得 50 积分
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* 播放详情模态框 */}
      {showModal && currentLocation && (
        <Modal
          transparent={true}
          visible={showModal}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <X color="#ffffff" size={24} />
              </TouchableOpacity>
              
              <Image source={currentLocation.image} style={styles.locationImage} />
              <Text style={styles.locationName}>{currentLocation.name}</Text>
              <Text style={styles.locationDescription}>{currentLocation.description}</Text>
              
              <View style={styles.playerContainer}>
                <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
                  {isPlaying ? (
                    <Pause color="#ffffff" size={24} />
                  ) : (
                    <Play color="#ffffff" size={24} />
                  )}
                </TouchableOpacity>
                
                <View style={styles.playerSliderContainer}>
                  <Slider
                    style={styles.playerSlider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    onSlidingComplete={seekTo}
                    minimumTrackTintColor="#ffffff"
                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                    thumbTintColor="#ffffff"
                  />
                  <View style={styles.timeDisplay}>
                    <Text style={styles.timeText}>{formatTime(position)}</Text>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={shareCheckIn}
              >
                <Text style={styles.shareButtonText}>分享打卡</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  navbar: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 0,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkInDays: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  checkInText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 5,
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  checkInCard: {
    margin: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  checkInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  checkInButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.3)',
  },
  checkInButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
  },
  dayChecked: {
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    borderColor: 'rgba(147, 197, 253, 0.3)',
  },
  dayUnchecked: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayText: {
    color: '#ffffff',
    fontSize: 12,
  },
  mapWrapper: {
    flex: 1,
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
    position: 'relative',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.9,
    resizeMode: 'cover',
  },
  locationMarkerContainer: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
  },
  locationMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  markerInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(191, 219, 254, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerName: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 80,
    right: 15,
    zIndex: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 25,
    padding: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationFilters: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  filterButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  filterText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  filterInactive: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterInactiveText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  playBar: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    padding: 16,
    margin: 15,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  playBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  songThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  songSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    marginHorizontal: 8,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.3)',
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 10,
    borderRadius: 1,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#FF6B6B',
    borderRadius: 1,
  },
  checkInAnimationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10%',
  },
  checkInAnimationCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  checkInAnimationImage: {
    width: 160,
    height: 160,
    borderRadius: 10,
    marginBottom: 15,
  },
  checkInAnimationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  checkInAnimationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
    textAlign: 'center',
  },
  checkInAnimationBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  checkInBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  checkInBadgeText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  locationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  locationDescription: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 20,
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 15,
    borderRadius: 10,
  },
  playPauseButton: {
    marginRight: 15,
  },
  playerSliderContainer: {
    flex: 1,
  },
  playerSlider: {
    width: '100%',
    height: 40,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#ffffff',
    opacity: 0.8,
    fontSize: 12,
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: '#52B788',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  regionMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  regionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(147, 197, 253, 0.6)',
    backdropFilter: 'blur(5px)',
  },
  regionNumber: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  regionName: {
    display: 'none', // 隐藏地区名称，只显示数字
  },
  regionSoundsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    maxHeight: '60%',
    zIndex: 100,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  regionSoundsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  regionSoundsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeRegionButton: {
    padding: 5,
  },
  regionSoundsList: {
    maxHeight: '90%',
  },
  regionSoundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  regionSoundImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  regionSoundInfo: {
    flex: 1,
    marginLeft: 12,
  },
  regionSoundName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  regionSoundDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  playIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.3)',
  },
  volumeSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  volumeSlider: {
    flex: 1,
    height: 30,
    marginHorizontal: 12,
  },
}); 