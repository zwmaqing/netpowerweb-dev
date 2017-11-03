<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" unique-opened router>
            <el-submenu index="1">
                <template slot="title">
                <i class="icon16 icon-music"></i> 播放任务管理</template>
                <el-menu-item index="tasks">播放任务</el-menu-item>
                <el-menu-item index="files">资源管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="groups">
                <i class="icon16 icon-th"></i> 分区分组管理
            </el-menu-item>
            <el-submenu index="3">
                <template slot="title">
                    <i class="icon16 icon-bullhorn"></i> 广播播报管理</template>
                <el-menu-item index="speak">语音广播</el-menu-item>
                <el-menu-item index="speak-class">分班播报</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-setting"></i>设备管理</template>
                <el-menu-item index="settings">基础配置</el-menu-item>
                <el-menu-item index="eqadjust">音频EQ平衡</el-menu-item>
                <el-menu-item index="microphone">话筒管理</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    }
}
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    width: 11.25em;
    left: 0em;
    top: 3.125em;
    bottom: 3.75em;
    background: #2E363F;
}

.sidebar>ul {
    height: 100%;
}

@media(max-width:768px) {
    /* 网页全屏显示 */
    /* body {width:100%;} */
    /* 正文全屏显示 */
    /* #divMain{width:100%} */
    /* 为了避免正文图片超出屏幕宽度 */
    /* 正文图片宽度最多是屏幕宽度的90% */
    /* #divMain img{max-width:90%} */
    /* 隐藏头部、导航、侧栏、页脚 */
    .sidebar {
        display: none
    }


    /* 显示手机版头部、导航和页脚 */
    #divHead_mobile {
        display: block
    }
}
</style>
