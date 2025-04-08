import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Play, Pause, Volume2 } from 'lucide-react-native';
import { useState } from 'react';

const soundTracks = [
  { id: '1', name: '雨声', volume: 80, playing: true },
  { id: '2', name: '溪流声', volume: 60, playing: false },
  { id: '3', name: '风声', volume: 45, playing: true },
  { id: '4', name: '海浪声', volume: 35, playing: false },
];

export default function SoundMapScreen() {
  const [tracks, setTracks] = useState(soundTracks);

  const togglePlay = (id: string) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, playing: !track.playing } : track
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 声音编辑</Text>
      
      <ScrollView style={styles.content}>
        <View style={styles.trackList}>
          {tracks.map(track => (
            <View key={track.id} style={styles.trackItem}>
              <TouchableOpacity onPress={() => togglePlay(track.id)}>
                {track.playing ? (
                  <Pause color="#fff" size={24} />
                ) : (
                  <Play color="#fff" size={24} />
                )}
              </TouchableOpacity>
              
              <View style={styles.trackInfo}>
                <Text style={styles.trackName}>{track.name}</Text>
                <View style={styles.volumeBar}>
                  <View style={[styles.volumeFill, { width: `${track.volume}%` }]} />
                </View>
              </View>
              
              <Volume2 color="#fff" size={20} />
            </View>
          ))}
        </View>

        <View style={styles.soundCategories}>
          <Text style={styles.categoryTitle}>声音分类</Text>
          <View style={styles.categoryGrid}>
            {['全部', '雨声', '鸟鸣', '风声', '流水', '篝火'].map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.personalMix}>
          <Text style={styles.mixTitle}>个性化混音</Text>
          <TouchableOpacity style={styles.createMixButton}>
            <Text style={styles.createMixText}>创建新的混音 +</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  trackList: {
    marginBottom: 30,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D6A4F',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  trackName: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  volumeBar: {
    height: 4,
    backgroundColor: '#40916C',
    borderRadius: 2,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  soundCategories: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryItem: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
  },
  personalMix: {
    marginBottom: 30,
  },
  mixTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  createMixButton: {
    backgroundColor: '#40916C',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  createMixText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});