import * as types from './mutation-types'

export default {
    [types.SET_WIDTH](state, width) {
        state.screenWidth = width;
        state.isMobileDev = state.screenWidth < 768;
        // console.log("change:" + state.screenWidth)
    },
    [types.SET_HEIGHT](state, height) {
        state.screenHeight = height
    },
    [types.SET_USERNAME](state, userName) {
        state.userName = userName
    },
    [types.SET_ISLOGIN](state, login) {
        state.isLogin = login
            //console.log('state.isLogin = ' + state.isLogin)
    },
    [types.SET_TOKENSTR](state, token) {
        state.tokenStr = token
    }
}