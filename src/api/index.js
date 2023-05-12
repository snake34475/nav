import request from '@/utils/request'

//获取所有展示
export function getPage(params) {
    return request({
        url: '/page/get',
        method: 'get',
        params
    })
}
//获取所有展示
export function hit(params) {
    return request({
        url: '/web/info/label',
        method: 'get',
        params
    })
}
