
import bash from '../content/thumbnails/bash.png'
import go from '../content/thumbnails/go.png'
import linux from '../content/thumbnails/linux.png'
import docker from '../content/thumbnails/docker.png'
import k8s from '../content/thumbnails/k8s.png'
import gitlab from '../content/thumbnails/gitlab.png'
import micro from '../content/thumbnails/micro.svg'
import gatsby from '../content/thumbnails/gatsby.png'
import opinion from '../content/thumbnails/opinion.png'
import like from '../content/thumbnails/like.png'
import gitbook from '../content/thumbnails/gitbook.png'
import segmentfault from '../content/thumbnails/segmentfault.png'
import profile from '../content/thumbnails/profile.png'


const topics = [
    {
        icon: gitbook,
        title: 'GitBook 快速指南',
        path: '/gitbook/index.html',
        weight: 1,
    },
    {
        icon: go,
        title: 'Go 编程',
        path: '/go/',
        weight: 2,
    },
    {
        icon: bash,
        title: '命令行 & 脚本',
        path: '/bash/',
        weight: 3,
    },
    {
        icon: micro,
        title: '微服务',
        path: '/microservice/',
        weight: 3,
    },
    {
        icon: linux,
        title: 'Linux',
        path: '/linux/',
        weight: 6,
    },
    {
        icon: docker,
        title: 'Docker',
        path: '/docker/',
        weight: 4,
    },
    {
        icon: k8s,
        title: 'Kubernetes',
        path: '/k8s/',
        weight: 5,
    },
    {
        icon: gitlab,
        title: 'Devops',
        path: '/devops/',
        weight: 6,
    },
    {
        icon: gatsby,
        title: 'Gatsby',
        path: '/gatsby/',
        weight: 7,
    },
    {
        icon: profile,
        title: '自以为是',
        path: '/views/',
        weight: 8,
    },
    {
        icon: like,
        title: '精品收藏',
        path: '/collections/',
        weight: 9,
    },
    {
        icon: segmentfault,
        title: '第三方平台',
        path: '/publications/',
        weight: 10,
    },
]
export default topics
