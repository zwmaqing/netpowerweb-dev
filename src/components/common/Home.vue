<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content" v-bind:class="{ contentMobile: isMobileDev }">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <v-playbar v-show="playBar"></v-playbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import vHead from '../common/Header';
import vSidebar from '../common/Sidebar';
import vPlaybar from '../common/playbar'
export default {
    components: {
        vHead, vSidebar, vPlaybar
    },
    computed: {
        playBar() {
            return true
        },
        ...mapGetters({
            screenWidth: 'screenWidth',
            screenHeight: 'screenHeight',
            isMobileDev: 'isMobileDev',
            isPcDev:'isPcDev',
            isLogin: 'isLogin'
        })
    }
}
</script>

<style>
.contentMobile {
    left: 0em;
    bottom: 2.75em;
    }

</style>
