/**
 * LinAI - 动画工具类
 * 
 * 提供可复用的动画组件和工具函数
 * 
 * @author LinAI Team
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * 淡入动画配置
 */
export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

/**
 * 缩放动画配置
 */
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

/**
 * 滑入动画配置
 */
export const slideInVariants = {
  left: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  right: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  up: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  down: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  }
};

/**
 * 淡入动画组件
 */
export function FadeIn({
  children,
  delay = 0
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ delay, duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 列表交错动画
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * 悬停缩放效果
 */
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: 'easeInOut'
  }
};

/**
 * 点击缩放效果
 */
export const tapScale = {
  scale: 0.95
};

/**
 * 创建自定义动画
 */
export function createAnimation(
  from: Record<string, any>,
  to: Record<string, any>,
  duration: number = 0.3
) {
  return {
    initial: from,
    animate: to,
    transition: { duration, ease: 'easeInOut' }
  };
}

/**
 * 页面过渡动画
 */
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 }
};

