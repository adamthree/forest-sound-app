import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Platform } from 'react-native';
import { Settings, Bell, Heart, Clock, Share2, HelpCircle, ChevronRight, Calendar, Download, Moon, MessageCircle, Shield, Lock, LogOut, Star, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* 页面背景 */}
      <LinearGradient
        colors={['#0D3446', '#132E37', '#1D2B2E']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 顶部用户信息卡片 */}
        <View style={styles.userInfoCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.userInfo}>
              <Image
                source={{ uri: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg' }}
                style={styles.avatar}
              />
              <View style={styles.userDetails}>
                <Text style={styles.username}>Adam</Text>
                <View style={styles.memberBadge}>
                  <Award size={14} color="#FFD700" />
                  <Text style={styles.memberText}>高级会员</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>编辑资料</Text>
              </TouchableOpacity>
            </View>

            {/* 用户统计数据 */}
            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>128</Text>
                <Text style={styles.statLabel}>收藏</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>64</Text>
                <Text style={styles.statLabel}>历史</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>关注</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 会员卡片 */}
        <TouchableOpacity style={styles.membershipCard}>
          <LinearGradient
            colors={['#3E6C89', '#1A4E6E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.membershipCardGradient}
          >
            <View style={styles.membershipCardContent}>
              <View>
                <Text style={styles.membershipTitle}>森声高级会员</Text>
                <Text style={styles.membershipDescription}>解锁全部高级音频内容与功能</Text>
              </View>
              <View style={styles.membershipButton}>
                <Text style={styles.membershipButtonText}>查看特权</Text>
                <ChevronRight size={16} color="#ffffff" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* 菜单项 */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>我的内容</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(233, 30, 99, 0.2)' }]}>
                  <Heart color="#E91E63" size={20} />
                </View>
                <Text style={styles.menuText}>我的收藏</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(3, 169, 244, 0.2)' }]}>
                  <Clock color="#03A9F4" size={20} />
                </View>
                <Text style={styles.menuText}>历史记录</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(139, 195, 74, 0.2)' }]}>
                  <Download color="#8BC34A" size={20} />
                </View>
                <Text style={styles.menuText}>下载管理</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(255, 193, 7, 0.2)' }]}>
                  <Calendar color="#FFC107" size={20} />
                </View>
                <Text style={styles.menuText}>我的日历</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>设置</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(156, 39, 176, 0.2)' }]}>
                  <Bell color="#9C27B0" size={20} />
                </View>
                <Text style={styles.menuText}>通知设置</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(0, 150, 136, 0.2)' }]}>
                  <Moon color="#009688" size={20} />
                </View>
                <Text style={styles.menuText}>休眠设置</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(33, 150, 243, 0.2)' }]}>
                  <Shield color="#2196F3" size={20} />
                </View>
                <Text style={styles.menuText}>隐私与安全</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>支持</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(255, 152, 0, 0.2)' }]}>
                  <MessageCircle color="#FF9800" size={20} />
                </View>
                <Text style={styles.menuText}>意见反馈</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
                  <Share2 color="#4CAF50" size={20} />
                </View>
                <Text style={styles.menuText}>分享给好友</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(244, 67, 54, 0.2)' }]}>
                  <Star color="#F44336" size={20} />
                </View>
                <Text style={styles.menuText}>给我们评分</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(63, 81, 181, 0.2)' }]}>
                  <HelpCircle color="#3F51B5" size={20} />
                </View>
                <Text style={styles.menuText}>帮助中心</Text>
              </View>
              <ChevronRight color="#8E9EAB" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 退出登录按钮 */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut color="#F44336" size={20} />
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>森声 v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D2B3E',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  userInfoCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  memberText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  userStats: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  membershipCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  membershipCardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  membershipCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  membershipDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  membershipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  membershipButtonText: {
    color: '#ffffff',
    marginRight: 4,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 16,
    marginBottom: 12,
  },
  menuCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    color: '#ffffff',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  logoutText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
});