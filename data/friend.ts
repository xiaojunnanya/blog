/*
 * @Author: XJN
 * @Date: 2023-07-02 09:37:16
 * @LastEditors: xiaojunnanya
 * @LastEditTime: 2024-01-26 17:51:46
 * @FilePath: \blog\data\friend.ts
 * @Description: 
 * @前端实习生：鲸落: 
 */
export const Friends: Friend[] = [
  {
    title: '峰华前端工程师',
    description: '致力于帮助你以最直观、最快速的方式学会前端开发',
    website: 'https://zxuqian.cn',
    avatar: '/img/friend/zxuqian.png',
  },
  {
    title: '愧怍的小站',
    description: '道阻且长，行则将至',
    website: 'https://kuizuo.cn/',
    avatar: '/img/friend/kzdxz.png',
  },
  {
    title: 'KBWS',
    description: '请叫我卷B',
    website: 'http://kbws.xyz/',
    avatar: '/img/friend/kbws.jpg',
  },
]

export type Friend = {
  title: string
  description: string
  website: string
  avatar?: any
}
