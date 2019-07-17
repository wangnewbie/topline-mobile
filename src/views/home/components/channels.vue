<template>
  <div>
    <van-popup
      :value="value"
      @input="$emit('input', $event)"
      position="bottom"
      :style="{ height: '95%' }"
      get-container="body"
      :lazy-render="false"
    >
      <!-- 我的频道 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">我的频道</span>
            <span class="desc">点击进入频道</span>
          </div>
          <div>
            <van-button
              type="danger"
              plain
              size="mini"
              @click="isEdit = !isEdit"
            >{{ !isEdit ? '编辑' : '完成'}}</van-button>
          </div>
        </div>
        <van-grid class="channel-content" :gutter="10" clickable>
          <van-grid-item
            v-for="(item, index) in userChannels"
            :key="item.id"
            @click="handleUserChannelClick(item, index)"
          >
            <span class="text" :class="{ active: index === activeIndex && !isEdit }">{{ item.name }}</span>
            <van-icon v-show="isEdit" class="close-icon" name="close" />
          </van-grid-item>
        </van-grid>
      </div>
      <!-- /我的频道 -->

      <!-- 推荐频道 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">频道推荐</span>
            <span class="desc">点击添加频道</span>
          </div>
        </div>
        <van-grid class="channel-content" :gutter="10" clickable>
          <van-grid-item
            v-for="item in recommendChannels"
            :key="item.id"
            @click="handleAddChannel(item)"
            >
            <div class="info">
              <span class="text">{{ item.name }}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    <!-- /推荐频道 -->
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels, deleteUserChannels, updateUserChannels } from '@/api/channels'
export default {
  name: 'HomeChannels',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    recommendChannels () {
      const duplicates = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels () {
      try {
        const data = await getAllChannels()
        data.channels.forEach(item => {
          item.articles = [] // 频道的文章
          item.timestamp = Date.now() // 用于下一页频道数据的时间戳
          item.finished = false // 控制该频道上拉加载是否已加载完毕
          item.upLoading = false // 控制该频道的下拉刷新 loading
          item.pullRefreshLoading = false // 控制频道列表的下拉刷新状态
          // item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
        })
        this.allChannels = data.channels
      } catch (error) {
        console.log(error)
      }
    },
    async handleAddChannel (item) {
      const channels = this.userChannels.slice(0)
      channels.push(item)
      this.$emit('update:user-channels', channels)
      if (this.$store.state.user) {
        // 已登录
        await updateUserChannels([{
          id: item.id,
          seq: channels.length - 1
        }])
      } else {
        // 未登录
        window.localStorage.setItem('channels', JSON.stringify(channels))
      }
    },
    async handleUserChannelClick (item, index) {
      if (this.isEdit) {
        // 编辑状态
        const channels = this.userChannels.slice(0)
        channels.splice(index, 1)
        this.$emit('update:user-channels', channels)
        if (this.$store.state.user) {
          // 已登录
          await deleteUserChannels(item.id)
        } else {
          // 未登录
          window.localStorage.setItem('channels', JSON.stringify(channels))
        }
      } else {
        // 未编辑状态
        this.$emit('update:active-index', index)
        this.$emit('input', false)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
    .action {}
  }
  .channel-content {
    .text {
      font-size: 24px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 40px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
