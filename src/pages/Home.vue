<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <v-playbar v-show="playBar"></v-playbar>
    </div>
</template>

<script>
import vHead from '@/components/Header';
import vSidebar from '@/components/Sidebar';
import vPlaybar from '@/components/playbar'
export default {
    components: {
        vHead, vSidebar,vPlaybar
    },
    computed: {
        playBar() {
            return true
        }
    }
}
</script>
