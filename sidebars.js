/*
 * @Author: XJN
 * @Date: 2023-07-02 09:37:16
 * @LastEditors: xiaojunnanya
 * @LastEditTime: 2024-01-19 17:17:12
 * @FilePath: \blog\sidebars.js
 * @Description:
 * @前端实习生：鲸落:
 */
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  skill: [
    'skill/introduction',
    {
      label: 'HTML与CSS',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/HTML与CSS/html',
        'skill/HTML与CSS/css',
        'skill/HTML与CSS/screen',
        'skill/HTML与CSS/skill',
        'skill/HTML与CSS/canvas'
      ],
    },
    {
      label: 'JavaScript',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/JavaScript/javascript1',
        'skill/JavaScript/javascript2',
        'skill/JavaScript/javascript3',
        'skill/JavaScript/javascript4',
        'skill/JavaScript/javascripttip'
      ],
    },
    {
      label: 'Vue',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/Vue/vue2'
      ],
    },
    {
      label: 'React',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/React/react',
        'skill/React/reacthooks',
        'skill/React/reactwebsite',
        'skill/React/tsreact',
        'skill/React/reactuse',
      ],
    },
    {
      label: 'Node',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/Node/node',
        'skill/Node/nodesql',
        'skill/Node/nodeuse',
        'skill/Node/nestjs',
        'skill/Node/nestjsbefore',
        'skill/Node/redis'
      ],
    },
    {
      label: 'TypeScript',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/TypeScript/typescript'
      ],
    },
    {
      label: '微信小程序',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/微信小程序/wechat1',
        'skill/微信小程序/wechat2',
        'skill/微信小程序/wechat3',
      ],
    },
    {
      label: 'Uniapp',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/Uniapp/uniapp'
      ],
    },
    {
      label: '数据结构与算法',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/数据结构与算法/build',
        'skill/数据结构与算法/count',
        'skill/数据结构与算法/leetcode',
      ],
    },
    {
      label: '前端工程化',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/前端工程化/frontendEngineering',
        'skill/前端工程化/webpack',
        'skill/前端工程化/gitgithub',
        'skill/前端工程化/usegit',
        'skill/前端工程化/gitcommit',
      ],
    },
    {
      label: '力扣算法',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/力扣算法/algorithmbefore',
        'skill/力扣算法/algorithmarr',
      ],
    },
    {
      label: '抓住小细节',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/抓住小细节/detail',
        'skill/抓住小细节/detailhtmlcss',
        'skill/抓住小细节/detailjs',
        'skill/抓住小细节/detailreact',
        'skill/抓住小细节/detailvue',
        'skill/抓住小细节/detailnode',
        'skill/抓住小细节/detailts',
        'skill/抓住小细节/detailllqyl',
        'skill/抓住小细节/detailwl',
        'skill/抓住小细节/detailbc',
      ],
    }
  ],
  thing: [
    'thing/introduction',
    {
      label: 'HTML与CSS',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'thing/HTML与CSS/threecolumn',
      ],
    },
    {
      label: 'JavaScript',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'thing/JavaScript/console',
        'thing/JavaScript/eventLoop',
        'thing/JavaScript/lightDeppCopy',
        'thing/JavaScript/jsRunPrinciple',
        'thing/JavaScript/scope',
        'thing/JavaScript/closure',
        'thing/JavaScript/setTimeout',
        'thing/JavaScript/noconsole',
        'thing/JavaScript/sessionStorage',
        'thing/JavaScript/jslanguagedesign',
      ],
    },
    {
      label: 'React',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'thing/React/reactstate',
        'thing/React/setreact',
        'thing/React/removeeffect',
        'thing/React/build-your-own-react',
      ],
    },
    {
      label: 'Node',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'thing/Node/commonjsnode',
      ],
    },
    {
      label: '前端工程化',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'thing/前端工程化/dependencies',
      ],
    },
    {
      label: '网络',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'thing/网络/inputUrlHappen',
        'thing/网络/inputUrlHappenAdd',
        'thing/网络/websocket',
        'thing/网络/networkModel',
        'thing/网络/httpsencryption',
        'thing/网络/websafe',
      ],
    },
  ],
  use: [
    'use/introduction',
    {
      label: '工具',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'use/tool/windowcmd',
        'use/tool/yalc',
        'use/tool/xswitch',
        'use/tool/release-it',
        'use/tool/mvn',
        'use/tool/delete_node_modules',
        'use/tool/markdown',
        'use/tool/gitee',
        'use/tool/lerna',
      ],
    },
    {
      label: '技术',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'use/technology/bigfile',
        'use/technology/tsaxios',
        'use/technology/qiankun',
      ],
    },
    {
      label: '其他',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'use/other/cli',
        'use/other/scpsh',
        'use/other/projectUbun',
        'use/other/hexo',
        'use/other/ubuntusetvue',
        'use/other/useubuntu',
        'use/other/googletoolsipload',
      ],
    },
    {
      label: '开发纪录',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'use/开发纪录/whaledevfrontend',
        'use/开发纪录/whaledevbackEnd',
      ],
    },
  ],
  series: [
    'series/introduction',
    {
      label: '前端调试通关秘籍',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'series/前端调试通关秘籍/frontenddebug01',
        'series/前端调试通关秘籍/frontenddebug02',
        'series/前端调试通关秘籍/frontenddebug03',
        'series/前端调试通关秘籍/frontenddebug04',
        'series/前端调试通关秘籍/frontenddebug05',
        'series/前端调试通关秘籍/frontenddebug06',
        'series/前端调试通关秘籍/frontenddebug07',
        'series/前端调试通关秘籍/frontenddebug08',
        'series/前端调试通关秘籍/frontenddebug09',
        'series/前端调试通关秘籍/frontenddebug10',
        'series/前端调试通关秘籍/frontenddebug11',
        'series/前端调试通关秘籍/frontenddebug12',
        'series/前端调试通关秘籍/frontenddebug13',
        'series/前端调试通关秘籍/frontenddebug14',
        'series/前端调试通关秘籍/frontenddebug15',
        'series/前端调试通关秘籍/frontenddebug16',
        'series/前端调试通关秘籍/frontenddebug17',
        'series/前端调试通关秘籍/frontenddebug18',
        'series/前端调试通关秘籍/frontenddebug19',
        'series/前端调试通关秘籍/frontenddebug20',
        'series/前端调试通关秘籍/frontenddebug21',
      ],
    },
    {
      label: 'Nest通关秘籍',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'series/Nest通关秘籍/nestseries01',
        'series/Nest通关秘籍/nestseries02',
        'series/Nest通关秘籍/nestseries03',
        'series/Nest通关秘籍/nestseries04',
        'series/Nest通关秘籍/nestseries05',
        'series/Nest通关秘籍/nestseries06',
        'series/Nest通关秘籍/nestseries07',
        'series/Nest通关秘籍/nestseries08',
        'series/Nest通关秘籍/nestseries09',
        'series/Nest通关秘籍/nestseries10',
        'series/Nest通关秘籍/nestseries11',
        'series/Nest通关秘籍/nestseries12',
        'series/Nest通关秘籍/nestseries13',
        'series/Nest通关秘籍/nestseries14',
        'series/Nest通关秘籍/nestseries15',
        'series/Nest通关秘籍/nestseries16',
        'series/Nest通关秘籍/nestseries17',
      ],
    },
  ],
  hobby: [
    'hobby/introduction',
    {
      label: '摄影',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'hobby/摄影/studyphotography',
        'hobby/摄影/studyphoto',
      ],
    },
    {
      label: '旅行',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'hobby/旅行/travelsummary',
        'hobby/旅行/traveltips',
      ],
    },
  ],
  summarize: [
    'summarize/introduction',
    {
      label: '2023',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'summarize/2023/frondstudy21',
      ],
    },
  ]
}

module.exports = sidebars
