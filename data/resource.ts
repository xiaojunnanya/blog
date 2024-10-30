import { Friends } from './friend'

export interface Resource {
  name: string
  logo: string
  desc: string
  href: string
  tags?: string[]
}

export interface ResourceCategory {
  name: string
  resources: Resource[]
}

const friends: Resource[] = Friends.map(f => {
  return {
    ...f,
    name: f.title,
    desc: f.description,
    logo: f.avatar,
    href: f.website,
  }
})

export const resourceData: ResourceCategory[] = [
  // {
  //   name: '友链👨‍💻',
  //   resources: friends,
  // },
  {
    name: '每周必刷🔥',
    resources: [
      {
        name: '稀土掘金',
        desc: '稀土掘金是一个技术博客平台，是程序员发布自己的技术文章、分享知识的地方',
        logo: '/img/resource/juejin.png',
        href: 'https://juejin.cn/',
      },
    ],
  },
  {
    name: '文档📘',
    resources: [
      {
        name: 'MDN',
        desc: '从2005年开始记录网络技术，包括 CSS、 HTML 和 JavaScript。',
        logo: '/img/resource/mdn.png',
        href: 'https://developer.mozilla.org/zh-CN/',
        tags: ['Css', '教程'],
      }
    ],
  },
  {
    name: '工具🛠️',
    resources: [
      {
        name: 'ProcessOn',
        desc: '免费在线流程图思维导图',
        logo: 'https://processon.com/favicon.ico',
        href: 'https://processon.com/',
        tags: ['工具', '思维导图'],
      },
    ],
  },
  {
    name: '代码托管',
    resources: [
      {
        name: 'GitHub',
        desc: '全球最大的软件项目托管平台，发现优质开源项目',
        logo: 'https://github.githubassets.com/favicons/favicon.svg',
        href: 'https://github.com/',
        tags: ['GitHub', '代码托管'],
      },
      {
        name: 'Gitee',
        desc: 'Gitee 是中国领先的基于 Git 的代码托管平台，类似于全球知名的 GitHub',
        logo: '/img/resource/gitee.ico',
        href: 'https://gitee.com/',
        tags: ['代码托管'],
      },
      {
        name: 'Gitlab',
        desc: '更快地交付安全代码，部署到任何云，并推动业务成果',
        logo: 'https://gitlab.com/uploads/-/system/group/avatar/6543/logo-extra-whitespace.png?width=64',
        href: 'https://gitlab.com/',
        tags: ['代码托管'],
      },
    ],
  },
  {
    name: '网站托管',
    resources: [
      {
        name: 'Vercel',
        desc: 'Vercel将最好的开发人员体验与对最终用户性能的执着关注相结合',
        logo: 'https://assets.vercel.com/image/upload/q_auto/front/favicon/vercel/57x57.png',
        href: 'https://vercel.com',
        tags: ['网站托管'],
      },
      {
        name: 'GitHub Codespace',
        desc: '全球最大的软件项目托管平台，发现优质开源项目',
        logo: 'https://github.githubassets.com/favicons/favicon.svg',
        href: 'https://github.com/codespaces',
        tags: ['网站托管'],
      }
    ],
  },
  {
    name: '在线代码',
    resources: [
      {
        name: 'CodesandBox',
        desc: 'CodeSandbox是一个在线代码编辑器和原型工具，可以更快地创建和共享web应用程序',
        logo: 'https://codesandbox.io/favicon.ico',
        href: 'https://codesandbox.io/',
        tags: ['在线代码'],
      },
      {
        name: 'CodePen',
        desc: '是构建、测试和发现前端代码的最佳场所',
        logo: 'https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico',
        href: 'https://codepen.io/',
        tags: ['在线代码'],
      },
      {
        name: 'Stackblitz',
        desc: 'Stackblitz在流程中保持即时的开发体验。没有更多的小时储存/拉/安装本地-只需点击，并开始编码',
        logo: '/img/resource/stackblitz.png',
        href: 'https://stackblitz.com/',
        tags: ['在线代码'],
      },
    ],
  },
  {
    name: 'React',
    resources: [
      {
        name: 'React',
        desc: '用于构建用户界面的 JavaScript 库',
        logo: 'https://reactjs.org/favicon.ico',
        href: 'https://reactjs.org',
        tags: ['前端', 'React', '框架'],
      },
      {
        name: 'Next.js',
        desc: 'Next.js 为您提供生产环境所需的所有功能以及最佳的开发体验：包括静态及服务器端融合渲染、 支持 TypeScript、智能化打包、 路由预取等功能 无需任何配置',
        logo: 'https://nextjs.org/static/favicon/favicon.ico',
        href: 'https://nextjs.org/',
        tags: ['前端', 'React', '框架'],
      }
    ],
  },
  {
    name: 'CSS',
    resources: [
      {
        name: 'TailwindCSS',
        desc: 'Tailwind CSS 是一个功能类优先的 CSS 框架，它集成了诸如 flex, pt-4, text-center 和 rotate-90 这样的的类，它们能直接在脚本标记语言中组合起来，构建出任何设计',
        logo: '/img/resource/loading.gif',
        href: 'https://www.tailwindcss.cn',
        tags: ['Css', '框架'],
      },
    ],
  },
  {
    name: '组件库',
    resources: [
      {
        name: 'Ant Design',
        desc: '一套企业级 UI设计语言和 React 组件库',
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        href: 'https://ant.design/index-cn',
        tags: ['前端', 'React', '组件库'],
      }
    ],
  },
  {
    name: 'Frontend',
    resources: [
      {
        name: 'Lodash',
        desc: '一个 JavaScript 的实用工具库, 表现一致性, 模块化, 高性能, 以及可扩展',
        logo: 'https://lodash.com/icons/favicon-32x32.png',
        href: 'https://lodash.net',
        tags: ['Nodejs'],
      }
    ],
  },
  {
    name: 'Node/Demo',
    resources: [
      {
        name: 'Node',
        desc: 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时',
        logo: 'https://img.nodejs.cn/logo.svg',
        href: 'http://nodejs.cn/',
        tags: ['后端', 'Nodejs', '文档'],
      },
      {
        name: 'NPM',
        desc: 'NPM是世界上最大的包管理器',
        logo: 'https://static.npmjs.com/58a19602036db1daee0d7863c94673a4.png',
        href: 'https://www.npmjs.com',
        tags: ['Nodejs', '包管理', '文档'],
      },
      {
        name: 'Expressjs',
        desc: '基于 Node.js 平台，快速、开放、极简的 Web 开发框架',
        logo: 'https://www.expressjs.com.cn/images/favicon.png',
        href: 'https://www.expressjs.com.cn/',
        tags: ['Nodejs', '后端', '框架'],
      },
      {
        name: 'Nest.js',
        desc: '用于构建高效且可伸缩的服务端应用程序的渐进式 Node.js 框架',
        logo: 'https://docs.nestjs.cn/_media/icon.svg',
        href: 'https://docs.nestjs.cn/',
        tags: ['后端', 'Nodejs', '框架'],
      },
      {
        name: 'Socket.io',
        desc: 'Socket.IO 是一个可以在浏览器与服务器之间实现实时、双向、基于事件的通信的工具库',
        logo: 'https://socket.io/images/favicon.png',
        href: 'https://socketio.bootcss.com',
        tags: ['Nodejs', 'socket'],
      },
      {
        name: 'TypeORM',
        desc: 'TypeORM 是一个 ORM 框架，它可以运行在 NodeJS、Browser、Cordova、PhoneGap、Ionic、React Native、Expo 和 Electron 平台上，可以与 TypeScript 和 JavaScript (ES5,ES6,ES7,ES8)一起使用',
        logo: '/img/resource/typeorm.ico',
        href: 'https://typeorm.bootcss.com',
        tags: ['Nodejs', 'ORM'],
      },
      {
        name: 'Prisma',
        desc: 'Prisma 下一代 Node.js 和 TypeScript 的ORM框架',
        logo: '/img/resource/prisma.png',
        href: 'https://prisma.io/',
        tags: ['Nodejs', 'ORM'],
      },
    ],
  },
  {
    name: '构建工具',
    resources: [
      {
        name: 'Webpack',
        desc: 'webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle',
        logo: '/img/resource/webpack.png',
        href: 'https://www.webpackjs.com',
        tags: ['构建工具'],
      },
      {
        name: 'Rollup.js',
        desc: 'Rollup 是 JavaScript 的模块打包器，它将小段代码编译成更大、更复杂的代码，例如库或应用程序',
        logo: 'https://rollupjs.org/favicon.png',
        href: 'https://rollupjs.org',
        tags: ['构建工具'],
      },
      {
        name: 'Vite',
        desc: '下一代的前端工具链，为开发提供极速响应',
        logo: '/img/resource/vite.svg',
        href: 'https://cn.vitejs.dev',
        tags: ['构建工具'],
      }
    ],
  },
  {
    name: '设计',
    resources: [
      {
        name: 'Mastergo',
        desc: '面向团队的专业 UI/UX 设计工具，多人同时编辑、随时在线评审、设计一键交付，让想法更快实现',
        logo: 'https://mastergo.com/favicon.ico',
        href: 'https://mastergo.com/',
        tags: ['设计'],
      },
      {
        name: '即时设计',
        desc: '可云端编辑的专业级 UI 设计工具，为中国设计师量身打造，Windows 也能用的「协作版 Sketch」',
        logo: 'https://img.js.design/assets/webImg/favicon.ico',
        href: 'https://js.design/',
        tags: ['设计'],
      }
    ],
  },
  {
    name: '字体图标',
    resources: [
      {
        name: 'iconfont',
        desc: 'iconfont-国内功能很强大且图标内容很丰富的矢量图标库，提供矢量图标下载、在线存储、格式转换等功能',
        logo: 'https://img.alicdn.com/imgextra/i4/O1CN01EYTRnJ297D6vehehJ_!!6000000008020-55-tps-64-64.svg',
        href: 'https://www.iconfont.cn/',
        tags: ['图标'],
      }
    ],
  },
  {
    name: '跨平台',
    resources: [
      {
        name: 'Electron',
        desc: '使用 JavaScript，HTML 和 CSS 构建跨平台的桌面应用程序',
        logo: '/img/resource/electron.ico',
        href: 'https://www.electronjs.org/',
        tags: ['跨平台', 'Nodejs'],
      },
      {
        name: 'Tauri',
        desc: 'Tauri是一个框架，用于为所有主要桌面平台构建小巧、快速的二进制文件',
        logo: 'https://tauri.app/meta/favicon-96x96.png',
        href: 'https://tauri.app/',
        tags: ['跨平台', 'Rust'],
      },
      {
        name: 'Flutter',
        desc: 'Flutter 是 Google 开源的应用开发框架，仅通过一套代码库，就能构建精美的、原生平台编译的多平台应用',
        logo: 'https://docs.flutter.cn/assets/images/cn/flutter-cn-logo.png',
        href: 'https://flutter.cn/',
        tags: ['跨平台', 'Rust'],
      },
      {
        name: 'Uni-app',
        desc: 'uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/QQ/快手/钉钉/淘宝）、快应用等多个平台',
        logo: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a90b5f95-90ba-4d30-a6a7-cd4d057327db/d23e842c-58fc-4574-998d-17fdc7811cc3.png',
        href: 'https://uniapp.dcloud.io/',
        tags: ['Vue', '小程序'],
      },
      {
        name: 'Taro',
        desc: 'Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发 微信 / 京东 / 百度 / 支付宝 / 字节跳动 / QQ / 飞书 小程序 / H5 / RN 等应用',
        logo: '/img/resource/taro.png',
        href: 'https://taro.jd.com',
        tags: ['前端', 'React', '小程序'],
      },
    ],
  },
  {
    name: '站点生成',
    resources: [
      {
        name: 'Docusaurus',
        desc: '快速构建以内容为核心的最佳网站',
        logo: '/img/resource/docusaurus.svg',
        href: 'https://docusaurus.io',
        tags: ['前端', 'React', '静态站点'],
      },
      {
        name: 'Hexo',
        desc: '快速、简洁且高效的博客框架',
        logo: 'https://hexo.io/favicon.ico',
        href: 'https://hexo.io',
        tags: ['前端', '静态站点'],
      },
      {
        name: 'GitBook',
        desc: 'GitBook帮助您为用户发布漂亮的文档，并集中您的团队的知识进行高级协作',
        logo: 'https://assets-global.website-files.com/600ead1452cf056d0e52dbed/6246d2036225eac4d74cff27_Favicon_Blue.png',
        href: 'https://www.gitbook.com/',
        tags: ['前端', '静态站点'],
      },
      {
        name: 'Docsify',
        desc: 'docsify 可以快速帮你生成文档网站',
        logo: 'https://docsify.js.org/_media/icon.svg',
        href: 'https://docsify.js.org',
        tags: ['前端', '静态站点'],
      },
      {
        name: 'WordPress',
        desc: 'WordPress是一款能让您建立出色网站、博客或应用程序的开源软件',
        logo: 'https://s.w.org/images/wmark.png',
        href: 'https://cn.wordpress.org/',
        tags: ['前端', '站点'],
      },
    ],
  },
  {
    name: 'Github',
    resources: [
      {
        name: 'Gitstar Ranking',
        desc: '针对用户、组织和存储库的非官方 GitHub 星级排名',
        logo: '/img/resource/github.ico',
        href: 'https://gitstar-ranking.com/',
        tags: [],
      },
      {
        name: 'Metrics',
        desc: 'Create your own metrics',
        logo: '/img/resource/github.ico',
        href: 'https://metrics.lecoq.io/',
        tags: [],
      },
      {
        name: 'Github主页 README 生成器',
        desc: '一个Github 个人主页 README 生成器',
        logo: '/img/resource/github.ico',
        href: 'https://rahuldkjain.github.io/gh-profile-readme-generator/',
        tags: [],
      },
      {
        name: 'Github 统计生成器',
        desc: 'Github 在你的 README 中获取动态生成的 GitHub 统计信息！',
        logo: '/img/resource/github.ico',
        href: 'https://github.com/anuraghazra/github-readme-stats',
        tags: [],
      },
    ],
  },
]
