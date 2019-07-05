const config = {
  siteTitle: 'GitDiG',
  siteTitleShort: '一艘慢船',
  siteTitleAlt: '一艘慢船',
  siteLogo: '/logos/logo.png',
  siteUrl: 'https://www.gitdig.com',
  repo: 'https://github.com/gitdigg/website',
  pathPrefix: '',
  dateFromFormat: 'YYYY-MM-DD',
  dateFormat: 'YYYY/MM/DD',
  siteDescription: "信息洪流中的一叶扁舟，这里没有大事件，只有小声音。内容关于：IT技术、读书与旅行。",
  siteRss: '/rss.xml',
  googleAnalyticsID: 'UA-141133293-1',
  disqusShortname: 'JayL',
  postDefaultCategoryID: 'Tech',
  userName: 'JayL',
  userEmail: 'gitdig.com@gmail.com',
  userTwitter: 'gitdigg',
  userLocation: 'Shanghai, China',
  menuLinks: [
    {
      name: '首页',
      link: '/',
    },
    {
      name: '文章',
      link: '/blog/',
    },
    {
      name: '主题',
      link: '/topics/',
    },
    {
      name: '关于',
      link: '/about/',
    },
  ],
  themeColor: '#3F80FF', // Used for setting manifest and progress theme colors.
  backgroundColor: '#ffffff',
}

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === '/') {
  config.pathPrefix = ''
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/') config.siteUrl = config.siteUrl.slice(0, -1)

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== '/') config.siteRss = `/${config.siteRss}`

module.exports = config
