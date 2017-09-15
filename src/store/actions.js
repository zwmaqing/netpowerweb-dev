import * as types from './mutation-types'

export default {
    setWidth({ commit }, width) {
        //console.log("action:" + width)
        commit(types.SET_WIDTH, width)
    },
    setHeight({ commit }, height) {
        commit(types.SET_HEIGHT, height)
    },
    setLogin({ commit }, isLogin) {
        commit(types.SET_ISLOGIN, isLogin)
    }
}