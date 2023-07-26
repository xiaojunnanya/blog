/*
 * @Author: XJN
 * @Date: 2023-07-02 09:37:16
 * @LastEditors: xiaojunnanya
 * @LastEditTime: 2023-07-03 10:49:37
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
      label: '每天一个小知识',
      type: 'category',
      link: {
        type: 'generated-index',
      },
      items: [
        'skill/每天一个小知识/info',
      ],
    },
  ],
  tools: [
    'tools/introduction',
    'tools/everything-quick-search-local-files',
    'tools/windows-custom-right-click-menu',
    'tools/vscode-config',
  ]
}

module.exports = sidebars
