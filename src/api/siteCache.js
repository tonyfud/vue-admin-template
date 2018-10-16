import request from '@/utils/request'

export function getLog(params) {
  return request({
    url: '/api/getLog',
    method: 'GET',
    params: params
  })
}

export function singleCleanCache(server, user) {
  const data = { user, server }
  return request({
    url: '/api/singleCleanCache',
    method: 'POST',
    data
  })
}

export function muiltCleanCache(servers) {
  const data = { servers }
  return request({
    url: '/api/muiltCleanCache',
    method: 'POST',
    data
  })
}
