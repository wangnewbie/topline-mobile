import request from '@/utils/request'

// 获取文章
export const getArticles = ({ channelId, timestamp, withTop }) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}

// 对文章不喜欢
export const dislikesArticles = target => {
  return {
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target
    }
  }
}
