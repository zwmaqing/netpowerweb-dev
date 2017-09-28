export default {
    screenHeight: state => state.screenHeight,
    screenWidth: state => state.screenWidth,
    isMobileDev: state => state.isMobileDev,
    isPcDev: state => !state.isMobileDev,
    userName: state => state.userName,
    isLogin: state => state.isLogin,
    tokenStr: state => state.tokenStr
}