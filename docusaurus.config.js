const path = require('path')

/** @type {import('@docusaurus/types').Config} */
const config = {
  onBrokenLinks: 'ignore',
  title: '鲸落',
  titleDelimiter: '-',
  url: 'http://xiaojunnan.cn',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'jl',
  projectName: 'blog',
  tagline: '记录所学知识，领略编程之美',
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  themeConfig: {
    image: 'img/logo.png',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    metadata: [
      {
        name: 'keywords',
        content: '鲸落',
      },
      {
        name: 'keywords',
        content: 'blog, javascript, typescript, node, react, vue, web',
      },
      {
        name: 'keywords',
        content: '编程爱好者, Web开发者',
      },
    ],
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: '鲸落',
      logo: {
        alt: '鲸落',
        src: 'img/logo.webp',
        srcDark: 'img/logo.webp',
      },
      hideOnScroll: true,
      items: [
        {
          label: '笔记',
          position: 'right',
          items: [
            {
              label: '学习',
              to: 'docs/skill',
            },
            {
              label: '思考',
              to: 'docs/thing',
            },
            {
              label: '使用',
              to: 'docs/use',
            },
            {
              label: '系列',
              to: 'docs/series',
            },
          ],
        },
        {
          label: '生活',
          position: 'right',
          items: [
            {
              label: '爱好',
              to: 'docs/hobby',
            },
            {
              label: '总结',
              to: 'docs/summarize',
            },
            // {
            //   label: 'vercel',
            //   to: 'https://vercel.com/',
            // },
          ],
        },
        // {
        //   label: '导航',
        //   position: 'right',
        //   to: 'resource',
        // },
        {
          label: '项目',
          position: 'right',
          to: 'project',
        },
        {
          label: '归档',
          position: 'right',
          to: 'archive',
        },
        // {
        //   type: 'localeDropdown',//中文英文
        //   position: 'right',
        // },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '学习',
          items: [
            {
              label: '标签',
              to: 'tags',
            },
            {
              label: '归档',
              to: 'archive',
            },
            {
              label: '学习笔记',
              to: 'docs/skill',
            },
            {
              label: '实战项目',
              to: 'project',
            }
          ],
        },
        {
          title: '社交媒体',
          items: [
            {
              label: '关于我',
              to: '/about',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/xiaojunnanya',
            },
            {
              label: '掘金',
              href: 'https://juejin.cn/user/3633256370537165',
            },
            {
              label: 'bilibili',
              href: 'https://space.bilibili.com/629793289',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '友链',
              position: 'right',
              to: 'friends',
            },
            {
              label: '导航',
              position: 'right',
              to: 'resource',
            },
            {
              label: 'Docusaurus',
              position: 'right',
              to: 'https://docusaurus.io/zh-CN/',
            }
          ],
        },
      ],
      copyright:  `Copyright © ${new Date().getFullYear()} 鲸落<p><a href="https://beian.miit.gov.cn" class="footer_lin">皖ICP备2023012012号</a></p>`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/vsLight'),
      darkTheme: require('prism-react-renderer/themes/vsDark'),
      additionalLanguages: ['java', 'php', 'rust', 'toml'],
      defaultLanguage: 'javascript',
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    algolia: {
      appId: 'RIMEHIIIP6',
      apiKey: '0bb55046a96eb973a220fe57b2d2d3b5',
      indexName: 'xiaojunnan'
    },
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
      config: {},
    },
    matomo: {
      matomoUrl: 'http://xiaojunnan.cn',
      siteId: '1',
      phpLoader: 'matomo.php',
      jsLoader: 'matomo.js',
    },
    giscus: {
      repo: 'xiaojunnanya/blog',
      repoId: 'R_kgDOJ23KyQ',
      category: 'General',
      categoryId: 'DIC_kwDOJ23Kyc4Ccv-l',
      theme: 'light',
      darkTheme: 'dark',
    },
    liveCodeBlock: {
      playgroundPosition: 'top',
    },
    socials: {
      github: 'https://github.com/xiaojunnanya',
      juejin: 'https://juejin.cn/user/3633256370537165',
      // twitter: 'https://twitter.com',
      // csdn: 'https://blog.csdn.net',
      // qq: 'https://wpa.qq.com/msgrd?v=3&amp;uin=911993023&amp;site=qq',
      // zhihu: 'https://www.zhihu.com/people',
      // cloudmusic: 'https://music.163.com/#/user/home?id=1333010742',
    },
  },
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: '鲸落的个人博客',
      },
    },
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          sidebarPath: 'sidebars.js',
        },
        blog: false,
        theme: {
          customCss: [require.resolve('./src/css/custom.scss')],
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.5,
        },
        gtag: {
          trackingID: 'G-S4SD5NXWXF',
          anonymizeIP: true,
        },
        // debug: true,
      }),
    ],
  ],
  // themes: ['@docusaurus/theme-live-codeblock'],
  plugins: [
    'docusaurus-plugin-matomo',
    'docusaurus-plugin-image-zoom',
    'docusaurus-plugin-sass',
    path.resolve(__dirname, './src/plugin/plugin-baidu-tongji'),
    path.resolve(__dirname, './src/plugin/plugin-baidu-push'),
    [
      path.resolve(__dirname, './src/plugin/plugin-content-blog'),
      {
        path: 'blog',
        routeBasePath: '/',
        editUrl: ({ locale, blogDirPath, blogPath, permalink }) =>
          `https://github.com/xiaojunnanya/blog`,
        editLocalizedFiles: false,
        blogDescription: '鲸落的个人博客',
        blogSidebarCount: 10,
        blogSidebarTitle: '最近更新',
        postsPerPage: 10,
        showReadingTime: true,
        readingTime: ({ content, frontMatter, defaultReadingTime }) =>
          defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
        feedOptions: {
          type: 'all',
          title: '鲸落',
          copyright: `Copyright © ${new Date().getFullYear()} 鲸落<p><a href="https://beian.miit.gov.cn" class="footer_lin">皖ICP备2023012012号</a></p>`,
        },
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        disableInDev: false,
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/logo.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(51 139 255)',
          },
        ],
      },
    ],
  ],
  stylesheets: [],
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
    // localeConfigs: {
    //   en: {
    //     htmlLang: 'en-GB',
    //   },
    // },
  },
}

module.exports = config
