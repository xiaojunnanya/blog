/*
 * @Author: XJN
 * @Date: 2023-07-02 09:37:16
 * @LastEditors: xiaojunnanya
 * @LastEditTime: 2024-01-04 10:31:08
 * @FilePath: \blog\data\project.ts
 * @Description:
 * @前端实习生：鲸落:
 */
export const projects: Project[] = [
  {
    title: '鲸落',
    description: '基于 Docusaurus 静态网站生成器实现个人博客',
    preview: '/img/project/blog.png',
    website: 'http://www.xiaojunnan.cn/',
    source: 'https://github.com/xiaojunnanya/blog',
    tags: ['personal', 'opensource', 'design'],
    type: '博客',
  },
  {
    title: '鲸落',
    description: 'Hexo + Github搭建个人静态博客',
    preview: '/img/project/hexoGithub.png',
    website: 'https://xiaojunnanya.github.io/',
    source: 'https://github.com/xiaojunnanya/xiaojunnanya.github.io',
    tags: ['opensource', 'design', 'personal'],
    type: '博客',
  },
  {
    title: '精灵开发低代码平台',
    description: '低代码产品',
    preview: '/img/project/whaledev.png',
    website: 'http://whaledev.xiaojunnan.cn/',
    source: 'https://github.com/xiaojunnanya',
    tags: ['opensource', 'personal'],
    type: '全栈项目',
  },
  {
    title: '实时聊天前端',
    description: '基于React的实时聊天前端部分',
    preview: '/img/project/chatFrontEnd.png',
    website: 'https://github.com/xiaojunnanya/chat-frontEnd',
    source: 'https://github.com/xiaojunnanya/chat-frontEnd',
    tags: ['opensource', 'personal'],
    type: '全栈项目',
  },
  {
    title: '实时聊天后端',
    description: '基于Node/Express的实时聊天后端部分',
    preview: '/img/project/null.png',
    website: 'https://github.com/xiaojunnanya/chat-backEnd',
    source: 'https://github.com/xiaojunnanya/chat-backEnd',
    tags: ['opensource', 'personal'],
    type: '全栈项目',
  },
  {
    title: '网易云音乐',
    description: '基于TS+React实现网易云音乐部分内容',
    preview: '/img/project/wyyyy.png',
    website: 'https://github.com/xiaojunnanya/cloud_music',
    source: 'https://github.com/xiaojunnanya/cloud_music',
    tags: ['opensource', 'personal'],
    type: '前端项目',
  },
  {
    title: 'Easy云盘',
    description: '网盘项目',
    preview: '/img/project/easy.png',
    website: 'https://github.com/xiaojunnanya/easy_pan',
    source: 'https://github.com/xiaojunnanya/easy_pan',
    tags: ['opensource', 'personal'],
    type: '前端项目',
  },
  {
    title: '仿爱彼迎页面',
    description: '初学React仿爱彼迎页面',
    preview: '/img/project/airbnbReact.png',
    website: 'https://github.com/xiaojunnanya/airbnbReact',
    source: 'https://github.com/xiaojunnanya/airbnbReact',
    tags: ['opensource', 'personal'],
    type: '前端项目',
  },
  {
    title: 'whale-design',
    description: '个人组件库',
    preview: '/img/project/whale-design.png',
    website: 'https://github.com/xiaojunnanya/whale-design',
    source: 'https://github.com/xiaojunnanya/whale-design',
    tags: ['opensource', 'personal'],
    type: '前端项目',
  },
]

export type Tag = {
  label: string
  description: string
  color: string
}

// tags的类型
export type TagType =
  | 'favorite'
  | 'opensource'
  | 'product'
  | 'design'
  | 'large'
  | 'personal'

  // 添加个人项目的类型
export type ProjectType = '博客' | '前端项目' | '个人项目' | '全栈项目'

export type Project = {
  title: string
  description: string
  preview?: any
  website: string
  source?: string | null
  tags: TagType[]
  type: ProjectType
}

export const Tags: Record<TagType, Tag> = {
  favorite: {
    label: '喜爱',
    description: '我最喜欢的网站，一定要去看看!',
    color: '#e9669e',
  },
  opensource: {
    label: '开源',
    description: '开源项目',
    color: '#39ca30',
  },
  product: {
    label: '产品',
    description: '与产品相关的项目!',
    color: '#dfd545',
  },
  design: {
    label: '设计',
    description: '设计漂亮的网站!',
    color: '#a44fb7',
  },
  large: {
    label: '大型',
    description: '大型项目，原多于平均数的页面',
    color: '#8c2f00',
  },
  personal: {
    label: '个人',
    description: '个人项目',
    color: '#12affa',
  },
}

export const TagList = Object.keys(Tags) as TagType[]

export const groupByProjects = projects.reduce((group, project) => {
  const { type } = project
  group[type] = group[type] ?? []
  group[type].push(project)
  return group
}, {} as Record<ProjectType, Project[]>)
