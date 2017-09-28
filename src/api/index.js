import axios from 'axios'
//import qs from 'qs'
import { Loading, Message } from 'element-ui'
// axios 配置
axios.defaults.timeout = 3000;
//axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.baseURL = 'http://192.168.10.189';

// 创建实例时设置配置的默认值
var instance = axios.create({
    baseURL: 'http://192.168.10.106'
});

// http请求拦截器
var loadinginstace
instance.interceptors.request.use(config => {
        // element ui Loading方法
        loadinginstace = Loading.service({ fullscreen: true })
        return config
    }, error => {
        loadinginstace.close()
        Message.error({
            message: '加载超时,请检查网络和设备情况。'
        })
        return Promise.reject(error)
    })
    // http响应拦截器
instance.interceptors.response.use(data => { // 响应成功关闭loading
    loadinginstace.close()
    return data
}, error => {
    loadinginstace.close()
    Message.error({
        message: '加载失败，请检查网络和设备情况。'
    })
    return Promise.reject(error)
})


export function fetchGet(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: param })
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export function toDeviceGet(url, param) {
    return new Promise((resolve, reject) => {
        instance.get(url, { params: param })
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}




export default {
    /**
     * 用户登录
     */
    System(params) {
        return toDeviceGet('/API/System', params);
    },
    Group(params) {
        return toDeviceGet('/API/Group', params);
    },
    Task(params) {
        return toDeviceGet('/API/Task', params);
    },
    Speak(params) {
        return toDeviceGet('/API/Speak', params);
    }
}