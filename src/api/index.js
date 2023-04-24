import request from '@/utils/request'

//获取所有展示
export function getPage(params) {
    return request({
        url: '/page/get',
        method: 'get',
        params
    })
}
