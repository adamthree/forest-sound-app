import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Bell, Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';

const featuredScenes = [
  {
    id: '1',
    title: '夏日晚风',
    duration: '30分钟',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8',
  },
  {
    id: '2',
    title: '温柔雨声',
    duration: '45分钟',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
  },
  {
    id: '3',
    title: '舒缓音乐',
    duration: '60分钟',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  },
  {
    id: '4',
    title: '森林漫步',
    duration: '40分钟',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  },
];

const scenes = [
  { id: '1', title: '睡前故事', icon: '📚' },
  { id: '2', title: '冥想', icon: '🧘' },
  { id: '3', title: '雨声', icon: '🌧️' },
  { id: '4', title: '大自然', icon: '🌲' },
];

// 导入音频文件
const sounds = {
  nature: require('../../assets/sounds/calming-rain.mp3'),
  rain: require('../../assets/sounds/summer-field.mp3'),
  forest: require('../../assets/sounds/forest-nature.mp3'), 
};  

export default function HomeScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sound && isPlaying) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis / 1000);
          setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sound, isPlaying]);

  async function playSound(soundName: string) {
    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        sounds[soundName as keyof typeof sounds],
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setCurrentSound(soundName);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
    }
  }

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

  async function seekTo(value: number) {
    if (sound) {
      await sound.setPositionAsync(value * 1000);
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nature Sleep</Text>
        <TouchableOpacity>
          <Bell color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.featuredCards}>
          <TouchableOpacity 
            style={[styles.card, styles.cardNature]}
            onPress={() => playSound('nature')}
          >
            <Text style={styles.cardTitle}>自然声音</Text>
            <Text style={styles.cardSubtitle}>聆听大自然的声音</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.card, styles.cardMap]}
            onPress={() => playSound('rain')}
          >
            <Text style={styles.cardTitle}>雨声</Text>
            <Text style={styles.cardSubtitle}>聆听雨滴的声音</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.card, styles.cardPremium]}
            onPress={() => playSound('forest')}
          >
            <Text style={styles.cardTitle}>森林声音</Text>
            <Text style={styles.cardSubtitle}>聆听森林的声音</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>助眠场景</Text>
        <View style={styles.sceneGrid}>
          {scenes.map((scene) => (
            <TouchableOpacity key={scene.id} style={styles.sceneItem}>
              <Text style={styles.sceneIcon}>{scene.icon}</Text>
              <Text style={styles.sceneTitle}>{scene.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>为你推荐</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll}>
          {featuredScenes.map((scene) => (
            <TouchableOpacity key={scene.id} style={styles.recommendedCard}>
              <Image source={{ uri: scene.image }} style={styles.recommendedImage} />
              <View style={styles.recommendedInfo}>
                <Text style={styles.recommendedTitle}>{scene.title}</Text>
                <Text style={styles.recommendedDuration}>{scene.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {currentSound && (
        <View style={styles.fixedPlayerContainer}>
          <View style={styles.playerContainer}>
            <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
              {isPlaying ? (
                <Pause color="#fff" size={20} />
              ) : (
                <Play color="#fff" size={20} />
              )}
            </TouchableOpacity>
            <View style={styles.currentSoundInfo}>
              <Image 
                source={currentSound === 'nature' ? require('../../assets/sounds/nature-icon.png') :
                        currentSound === 'rain' ? require('../../assets/sounds/rain-icon.png') :
                        require('../../assets/sounds/forest-icon.png')}
                style={styles.soundIcon}
              />
              <Text style={styles.soundName}>
                {currentSound === 'nature' ? '自然声音' :
                 currentSound === 'rain' ? '雨声' :
                 '森林声音'}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <Slider
                style={styles.progressBar}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onSlidingComplete={seekTo}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="rgba(255,255,255,0.5)"
                thumbTintColor="#FFFFFF"
              />
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  featuredCards: {
    marginTop: 20,
    gap: 15,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    height: 120,
    justifyContent: 'center',
    marginBottom: 15,
  },
  cardNature: {
    backgroundColor: '#2D6A4F',
  },
  cardMap: {
    backgroundColor: '#40916C',
  },
  cardPremium: {
    backgroundColor: '#52B788',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    color: '#ffffff',
    opacity: 0.8,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 30,
    marginBottom: 15,
  },
  sceneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  sceneItem: {
    width: '47%',
    backgroundColor: '#2D6A4F',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  sceneIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  sceneTitle: {
    color: '#ffffff',
    fontSize: 16,
  },
  recommendedScroll: {
    marginTop: 15,
  },
  recommendedCard: {
    width: 250,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 150,
  },
  recommendedInfo: {
    padding: 15,
    backgroundColor: '#2D6A4F',
  },
  recommendedTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendedDuration: {
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 5,
  },
  fixedPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  playButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    marginRight: 8,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 8,
  },
  progressBar: {
    width: '100%',
    height: 3,
    marginBottom: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  timeText: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.8,
  },
  currentSoundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  soundIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  soundName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});