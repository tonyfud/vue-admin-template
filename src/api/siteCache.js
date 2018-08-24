import request from '@/utils/request'

export function getLog(params) {
  return request({
    url: 'http://localhost:8080/api/getLog',
    method: 'GET',
    params: params
  })
}

export function singleCleanCache(server) {
  const data = { server }
  return request({
    url: 'http://localhost:8080/api/singleCleanCache',
    method: 'POST',
    data
  })
}

export function muiltCleanCache(servers) {
  const data = { servers }
  return request({
    url: 'http://localhost:8080/api/muiltCleanCache',
    method: 'POST',
    data
  })
}
