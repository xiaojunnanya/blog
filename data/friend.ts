/*
 * @Author: XJN
 * @Date: 2023-07-02 09:37:16
 * @LastEditors: xiaojunnanya
 * @LastEditTime: 2023-07-03 09:56:47
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
]

export type Friend = {
  title: string
  description: string
  website: string
  avatar?: any
}
