import request from '@/utils/request'

export function getReviews(goodId, start, offset) {
  return request({
    url: '/reviews/good',
    method: 'get',
    params: {
      id: goodId,
      start: start,
      offset: offset
    }
  })
}

export function deleteReview(goodId, reviewId) {
  return request({
    url: '/admin/review',
    method: 'delete',
    params: {
      reviewId: reviewId,
      goodId: goodId
    }
  })
}
