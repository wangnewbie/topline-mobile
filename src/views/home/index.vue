<template>
  <div class="home-warp">
    <van-nav-bar
      fixed
    />
    <van-tabs :offset-top="45" sticky v-model="channelIndex">
      <div slot="nav-right" class="wap-nav" @click="isChannelShow = true">
        <van-icon name="wap-nav" />
      </div>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <van-pull-refresh v-model="item.pullRefreshLoading" @refresh="onRefresh">
          <van-list
            v-model="item.upLoading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="item in activeChannel.articles"
              :key="item.art_id"
              :title="item.title"
            />
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <van-tabbar v-model="active" fixed>
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item icon="contact">我的</van-tabbar-item>
    </van-tabbar>
    <home-channels
      v-model="isChannelShow"
      :user-channels.sync="channels"
      :active-index.sync="channelIndex"
    ></home-channels>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channels'
import { getArticles } from '@/api/articles'
import HomeChannels from './components/channels'
export default {
  name: 'AppHome',
  components: {
    HomeChannels
  },
  data () {
    return {
      channels: [],
      channelIndex: 0,
      active: '',
      isChannelShow: false
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.channelIndex]
    }
  },
  watch: {
    async '$store.state.user' () {
      this.channelIndex = 0
      await this.loadUserChannels()
      this.activeChannel.upLoading = true
      this.onLoad()
    }
  },
  async created () {
    // console.log('组件重新 created 渲染了')
    await this.loadUserChannels()
    // await this.loadArticles()
  },
  methods: {
    async loadUserChannels () {
      try {
        let channels = []
        if (this.$store.state.user) {
          // 登录状态
          channels = (await getUserChannels()).channels
        } else {
          // 未登录状态
          const localChannels = JSON.parse(window.localStorage.getItem('channels'))
          if (localChannels) {
            channels = localChannels
          } else {
            channels = (await getUserChannels()).channels
          }
        }
        // 对频道中的数据统一处理以供页面使用
        channels.forEach(item => {
          item.articles = [] // 频道的文章
          item.timestamp = Date.now() // 用于下一页频道数据的时间戳
          item.finished = false // 控制该频道上拉加载是否已加载完毕
          item.upLoading = false // 控制该频道的下拉刷新 loading
          item.pullRefreshLoading = false // 控制频道列表的下拉刷新状态
          // item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
        })
        this.channels = channels
      } catch (error) {
        console.log(error)
      }
    },
    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      try {
        const data = await getArticles({
          channelId,
          timestamp,
          withTop: 1
        })
        if (data.results.length === 0) {
          this.activeChannel.timestamp = data.pre_timestamp
          return this.loadArticles()
        } else {
          this.activeChannel.articles.push(...data.results)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async onLoad () {
      // 异步更新数据
      await this.loadArticles()
      // 加载状态结束
      this.activeChannel.upLoading = false
      // 数据全部加载完成
      // if (this.list.length >= 40) {
      //   this.finished = true
      // }
    },
    async onRefresh () {
      const data = await getArticles({
        channelId: this.activeChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      if (data.results.length) {
        this.activeChannel.articles.push(...data.results)
        this.$toast('刷新成功')
      } else {
        this.$toast('无最新数据')
      }
      this.activeChannel.pullRefreshLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  height: 90px;
  background-color: #3296fa;
}
.van-tabs--line {
  margin-top: 90px;
  margin-bottom: 100px;
}
.wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background: #fff;
  // opacity: .7;
}
</style>
