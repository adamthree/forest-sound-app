import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { Search as SearchIcon, X, History as HistoryIcon, Tag, Clock, PlayCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 定义标签和搜索历史
const popularTags = ['自然声音', '雨声', '白噪音', '助眠音乐', '森林', '冥想', '海浪', '萤火虫'];

const initialSearchHistory = ['夏日晚风', '温柔雨声', '森林漫步', '舒缓音乐'];

// 推荐声音列表
const recommendations = [
  {
    id: '1',
    title: '温柔夜雨',
    duration: '60分钟',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
    plays: '1.2万',
    type: '自然声音',
  },
  {
    id: '2',
    title: '森林晨光',
    duration: '45分钟',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    plays: '8500',
    type: '森林',
  },
  {
    id: '3',
    title: '海浪轻抚',
    duration: '30分钟',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    plays: '6320',
    type: '海洋',
  },
  {
    id: '4',
    title: '山谷清风',
    duration: '40分钟',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    plays: '4800',
    type: '自然声音',
  },
  {
    id: '5',
    title: '夏夜蝉鸣',
    duration: '50分钟',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8',
    plays: '3600',
    type: '夏季',
  },
  {
    id: '6',
    title: '篝火噼啪',
    duration: '35分钟',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
    plays: '5200',
    type: '冥想',
  },
];

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 两列布局，每列之间有间距

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState(initialSearchHistory);
  const [activeTag, setActiveTag] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 模拟搜索结果
  const mockResults = [
    {
      id: '1',
      title: '自然声音合集',
      description: '聆听大自然的声音',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
      duration: '60分钟',
      plays: '1.5万',
      type: '自然声音',
    },
    {
      id: '2',
      title: '温柔雨声',
      description: '轻柔的雨滴声音',
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
      duration: '45分钟',
      plays: '8700',
      type: '雨声',
    },
    {
      id: '3',
      title: '森林声音',
      description: '沉浸在森林的氛围中',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
      duration: '50分钟',
      plays: '7200',
      type: '森林',
    },
    {
      id: '4',
      title: '萤火虫之夜',
      description: '夏夜中的萤火虫声音',
      image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e',
      duration: '40分钟',
      plays: '5300',
      type: '夏季',
    },
  ];

  // 处理搜索
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      setShowSearchResults(false);
      return;
    }

    // 添加到搜索历史
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
    }

    setIsSearching(true);
    setShowSearchResults(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      const results = mockResults.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    }, 300);
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setShowSearchResults(false);
  };

  // 点击标签
  const handleTagPress = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag('');
      clearSearch();
    } else {
      setActiveTag(tag);
      setSearchQuery(tag);
      // 使用标签执行搜索
      setIsSearching(true);
      setShowSearchResults(true);
      
      setTimeout(() => {
        const results = mockResults.filter(item => 
          item.title.toLowerCase().includes(tag.toLowerCase()) ||
          item.description.toLowerCase().includes(tag.toLowerCase()) ||
          item.type.toLowerCase().includes(tag.toLowerCase())
        );
        setSearchResults(results);
      }, 300);
    }
  };

  // 点击历史记录
  const handleHistoryPress = (query: string) => {
    setSearchQuery(query);
    setActiveTag('');
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    setTimeout(() => {
      const results = mockResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }, 300);
  };

  // 渲染搜索结果项
  const renderResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.resultItem}>
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultDescription}>{item.description}</Text>
        <View style={styles.resultMeta}>
          <View style={styles.resultMetaItem}>
            <Clock size={14} color="#95A5A6" />
            <Text style={styles.resultMetaText}>{item.duration}</Text>
          </View>
          <View style={styles.resultMetaItem}>
            <PlayCircle size={14} color="#95A5A6" />
            <Text style={styles.resultMetaText}>{item.plays}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 渲染推荐项目
  const renderRecommendationItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.recommendationCard}>
      <Image source={{ uri: item.image }} style={styles.recommendationImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.recommendationGradient}
      />
      <View style={styles.recommendationContent}>
        <Text style={styles.recommendationType}>{item.type}</Text>
        <Text style={styles.recommendationTitle}>{item.title}</Text>
        <View style={styles.recommendationMeta}>
          <Text style={styles.recommendationMetaText}>{item.duration}</Text>
          <View style={styles.dot} />
          <Text style={styles.recommendationMetaText}>{item.plays}次播放</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>搜索</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon color="#95A5A6" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索声音、场景..."
            placeholderTextColor="#95A5A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X color="#95A5A6" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showSearchResults ? (
        isSearching && searchResults.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>没有找到"{searchQuery}"的相关结果</Text>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>搜索结果</Text>
            <FlatList
              data={searchResults}
              renderItem={renderResultItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )
      ) : (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 热门标签 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Tag color="#ffffff" size={18} />
              <Text style={styles.sectionTitle}>热门标签</Text>
            </View>
            <View style={styles.tagsContainer}>
              {popularTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tagItem,
                    activeTag === tag && styles.activeTagItem
                  ]}
                  onPress={() => handleTagPress(tag)}
                >
                  <Text style={[
                    styles.tagText,
                    activeTag === tag && styles.activeTagText
                  ]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 搜索历史 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HistoryIcon color="#ffffff" size={18} />
              <Text style={styles.sectionTitle}>搜索历史</Text>
            </View>
            <View style={styles.historyContainer}>
              {searchHistory.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyItem}
                  onPress={() => handleHistoryPress(item)}
                >
                  <Clock color="#95A5A6" size={16} />
                  <Text style={styles.historyText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 推荐内容 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <PlayCircle color="#ffffff" size={18} />
              <Text style={styles.sectionTitle}>推荐内容</Text>
            </View>
            <FlatList
              data={recommendations}
              renderItem={renderRecommendationItem}
              keyExtractor={item => item.id}
              horizontal={false}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.recommendationsGrid}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#152D32',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  activeTagItem: {
    backgroundColor: '#4CAF50',
  },
  tagText: {
    color: '#ffffff',
    fontSize: 14,
  },
  activeTagText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  historyContainer: {
    marginTop: 5,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  historyText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 15,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultDescription: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  resultMetaText: {
    color: '#95A5A6',
    fontSize: 12,
    marginLeft: 5,
  },
  recommendationsGrid: {
    gap: 15,
  },
  recommendationCard: {
    width: cardWidth,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  recommendationImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  recommendationGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    borderRadius: 12,
  },
  recommendationContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  recommendationType: {
    color: '#4CAF50',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  recommendationTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  recommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationMetaText: {
    color: '#cccccc',
    fontSize: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#95A5A6',
    marginHorizontal: 6,
  },
});