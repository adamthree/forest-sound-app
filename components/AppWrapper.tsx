import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppWrapperProps {
  children: React.ReactNode;
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// 标准移动设备尺寸 (iPhone 12/13)
const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 844;

// 计算应该使用的缩放比例，确保内容不会溢出屏幕
const getScale = () => {
  // 如果是移动设备，不缩放
  if (!isWeb) return 1;
  
  // 在web上，计算合适的缩放比例
  const widthScale = (windowWidth * 0.9) / MOBILE_WIDTH; // 留10%的空间
  const heightScale = (windowHeight * 0.9) / MOBILE_HEIGHT; // 留10%的空间
  
  // 使用较小的缩放比例来确保内容完全显示
  return Math.min(widthScale, heightScale, 1); // 最大不超过1
};

export default function AppWrapper({ children }: AppWrapperProps) {
  const insets = useSafeAreaInsets();
  const scale = getScale();
  
  // 在移动设备上，直接渲染内容
  if (!isWeb) {
    return <>{children}</>;
  }
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.phoneFrame, 
          { 
            width: MOBILE_WIDTH * scale,
            height: MOBILE_HEIGHT * scale,
            // 转换paddingTop为缩放后的值
            paddingTop: insets.top * scale,
            paddingBottom: insets.bottom * scale,
            transform: [{ scale }],
          }
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // 深色背景
    overflow: 'hidden',
  },
  phoneFrame: {
    width: MOBILE_WIDTH,
    height: MOBILE_HEIGHT,
    backgroundColor: '#121212', // 手机屏幕背景色
    borderRadius: 40, // 圆角
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#333333', // 手机边框颜色
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
}); 