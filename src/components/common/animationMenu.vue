<template>
  <transition name="move">
    <div class="menu" v-show="item.menuShow">
      <div class="inner inner-1" @click.once="_temporaryPlay(index)">
        <i class="icon el-icon-caret-right"></i>
      </div>
      <div class="inner inner-2" @click="_addToTask(index)">
        <i class="icon el-icon-plus"></i>
      </div>
      <div class="inner inner-3" @click="_del(index)">
        <i class="icon el-icon-delete"></i>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from "vue";

import { mapGetters } from "vuex";

export default {
  props: {
    item: Object,

    index: Number
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters([
      // 'listenLists'
    ])
  },

  methods: {
    _temporaryPlay(index) {
      this.$message({
        showClose: true,

        message: "_temporaryPlay index: " + index,

        type: "success"
      });
    },

    _addToTask(index) {
      // let x = this.listenLists.findIndex((music) => {

      //     if(this.item.ar) {

      //         return music.name == this.item.name && music.ar[0].name == this.item.ar[0].name

      //     } else {

      //         if (music.ar) {

      //             return music.name == this.item.name && music.ar[0].name == this.item.artists[0].name

      //         } else {

      //             return music.name == this.item.name && music.artists[0].name == this.item.artists[0].name

      //         }

      //     }

      // })

      // if(x !== -1) {

      //     _.toast('试听列表中已存在')

      //     Vue.set(this.item, 'menuShow', false)

      // } else {

      //     _.toast('已添加到试听列表')

      //     this.$store.dispatch('addListenLists', this.item)

      //     Vue.set(this.item, 'menuShow', false)

      // }

      this.$message({
        showClose: true,

        message: "_addToTask index: " + index,

        type: "success"
      });
    },

    _del(index) {
      this.$message({
        showClose: true,

        message: "_del index: " + index,

        type: "success"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/function.scss";

.menu {
  position: absolute;

  right: px2rem(130px);

  top: px2rem(22px);

  transition: all 0.7s ease-in;

  &.move-enter-active {
    .inner {
      transform: translate3d(0, 0, 0);

      transition-timing-function: cubic-bezier(0, 0.57, 0.44, 1.97);
    }

    .inner-1 {
      transition-delay: 0.1s;
    }

    .inner-2 {
      transition-delay: 0.2s;
    }

    .inner-3 {
      transition-delay: 0.3s;
    }
  }

  &.move-enter,
  &.move-leave-active {
    .inner {
      transition-timing-function: ease-in-out;

      opacity: 0;
    }

    .inner-1 {
      transform: translate3d(px2rem(20px), 0, 0);

      transition-delay: 0.3s;
    }

    .inner-2 {
      transform: translate3d(px2rem(100px), 0, 0);

      transition-delay: 0.2s;
    }

    .inner-3 {
      transform: translate3d(px2rem(180px), 0, 0);

      transition-delay: 0.1s;
    }
  }

  .inner {
    display: inline-block;

    position: absolute;

    width: 2em; //px2rem(60px);

    height: 2em; // px2rem(60px);

    line-height: px2rem(62px);

    border-radius: 50%;

    background: rgba(255, 255, 255, 0.1);

    text-align: center;

    color: #fff;

    cursor: pointer;

    transition: all 0.4s;
  }

  .inner-1 {
    left: -2em; //px2rem(-20px);
  }

  .inner-2 {
    left: -4.2em; //px2rem(-100px);
  }

  .inner-3 {
    left: -6.4em; //px2rem(-180px);
  }

  .icon {
    font-size: 18px;

    margin-top: 6px;
  }
}
</style>