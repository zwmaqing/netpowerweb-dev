<template>
    <div class="playbar" v-bind:class="{ mobile: isMobileDev }">
        <div class="payset-bar">
            <el-popover ref="popmusiclist" placement="top" width="336" trigger="click">
                <el-table :data="runingTask.Projects">
                    <el-table-column width="50" property="FileIndex" label="序号"></el-table-column>
                    <el-table-column width="200" property="FileName" label="曲目名"></el-table-column>
                    <el-table-column width="80" property="TimeSpan" label="时长"></el-table-column>
                </el-table>
            </el-popover>
            <el-popover ref="popvolumeadj" placement="top" width="300" trigger="click" >
                <div style="">
                    <!-- <mt-range v-model="currentProject.Volume"></mt-range> -->
                    <el-slider v-model="currentProject.Volume" show-input :step="1"  @change="valumchange"></el-slider>
                </div>
            </el-popover>
            
            <button class="button button-primary button-circle button-small juzhongd" :disabled="!isTaskRuning" v-popover:popvolumeadj>
                <i class="icon16 icon-volume-up"></i>
            </button>
            <el-tooltip class="item" effect="dark" content="均衡调节" placement="top" v-show="isPcDev">
                <button class="button button-primary button-circle button-small juzhongz" v-on:click="equalizingControl" :disabled="!isTaskRuning">
                    <i class="icon16 icon-sliders"></i>
                </button>
            </el-tooltip>
            <button class="button button-primary button-circle button-small juzhongz" :disabled="!isTaskRuning" v-popover:popmusiclist>
                <i class="icon16 icon-list-ul"></i>
            </button>
            <el-tooltip class="item" effect="dark" content="播放模式" placement="top" v-show="isPcDev">
                <button class="button button-primary button-circle button-small juzhongz" :disabled="!isTaskRuning" @click="playmodelswich">
                    <i class="icon16 icon-retweet"></i>
                </button>
            </el-tooltip>
        </div>
        <div class="play-box">
            <div class="pay-front">
                <button class="button button-royal button-circle" v-bind:class="{ 'button-small': isMobileDev }" v-on:click="_previous">
                    <i class="icon16 icon-step-backward"></i>
                </button>
            </div>
            <div class="pay-play">
                <button class="button button-royal button-circle" v-bind:class="{ 'button-large': isPcDev }" v-on:click="_playPause">
                    <i class="icon24 icon-play"></i>
                </button>
            </div>
            <div class="pay-next">
                <button class="button button-royal button-circle" v-bind:class="{ 'button-small': isMobileDev }" v-on:click="_next">
                    <i class="icon16 icon-step-forward"></i>
                </button>
            </div>
        </div>
        <div class="progress-bar" style="padding-top: 3px;">
            <div class="remainingTimeFlag">
                <span v-show="isPcDev">-{{currentProject.RemainingTime}}</span>
            </div>
            <div class="finishTimeFlag">
                <span v-show="isPcDev">{{currentProject.FinishTime}}</span>
            </div>
            <div class="musicnameFlag">
                <span style="" v-show="isPcDev">{{currentProject.FileName}}</span>
            </div>
            <el-slider v-model="currentProject.PlayPercent" :disabled="!isTaskRuning" @input="percentinput" @change="playPercentchange"></el-slider>
        </div>
        <!-- <audio preload ref="myAudio" :src="audioUrl" @ended="_next()"></audio> -->
        <!-- <transition name="fold">
                                    <v-listen-list v-show="showListenList"></v-listen-list>
                                    </transition> -->
    </div>
</template>

<script>
import listenList from './listenList'
import { mapGetters } from 'vuex'
import api from '../api'
import * as _ from '../util/tools'

export default {
    components: {
        'v-listen-list': listenList
    },
    data() {
        return {
            isTaskRuning: true,
            playing: false,
            showListenList: false,
            playStatus: 'playing',
            //playing pause
            currentProject: {
                FileIndex: 1,
                FileName: '爸爸妈妈我爱你们.mp3',
                TimeSpan: '00:03:12',
                PlayPercent: 0,
                FinishTime: '00:00:00',
                RemainingTime: '00:00:00',
                Volume: 80
            },
            runingTask: {
                TaskID: 101,
                TaskName: '早操音乐',
                TaskType: 'Temp',
                StartTime: '08:30:00',
                TimeSpan: '00:30:00',
                Week: '',
                Volum: '80-80',
                Projects: [
                    {
                        FileIndex: 1,
                        FileName: '爸爸妈妈我爱你们.mp3',
                        TimeSpan: '00:03:12'
                    },
                    {
                        FileIndex: 2,
                        FileName: "爸爸妈妈我爱你们--2.mp3",
                        TimeSpan: "00:03:12"
                    },
                    {
                        FileIndex: 3,
                        FileName: "爸爸妈妈我爱你们--3.mp3",
                        TimeSpan: "00:03:12"
                    }

                ],
                GroupLiast: '100',
                Status: "Start",
                IsSystem: false
            }
        }
    },
    computed: {
        ...mapGetters({
            screenWidth: 'screenWidth',
            screenHeight: 'screenHeight',
            isMobileDev: 'isMobileDev',
            isPcDev: 'isPcDev',
            isLogin: 'isLogin'
        })
    },
    mounted() {
        // let timer
        // this.$refs.myAudio.addEventListener('play', () => {
        //     timer = setInterval(() => {
        //         this.duration = this.$refs.myAudio.duration
        //         this.now = this.$refs.myAudio.currentTime
        //     }, 1000)
        // })
        // this.$refs.myAudio.addEventListener('pause', () => {
        //     clearInterval(timer)
        // })
    },
    methods: {
        _playPause() {
            if (!this.isTaskRuning) {
                this.$message({
                    showClose: true,
                    message: '当前没有任务正在运行.',
                    type: 'warning'
                });
            } else {
                //if playStatus== playing set pause  if playStatus==paused set playing
                //     this.$store.dispatch('setPlaying', true)
                //this.$store.dispatch('setPause', true)
                console.log('click playPause');
            }
        },
        _previous() {
            if (!this.isTaskRuning) {
                this.$message({
                    showClose: true,
                    message: '当前没有任务正在运行.',
                    type: 'warning'
                });
            } else {
                // this.$store.dispatch('playPreviousProject', true)
                console.log('click playPreviousProject');
            }
        },
        _next() {
            if (!this.isTaskRuning) {
                this.$message({
                    showClose: true,
                    message: '当前没有任务正在运行.',
                    type: 'warning'
                });
            } else {
                // this.$store.dispatch('playNextProject', true)
                console.log('click playNextProject');
            }

            // this.$store.dispatch('setShowPlayLoading', true)
            // for (let i = 0; i < this.listenLists.length; i++) {
            //     if (this.listenLists[i].name === this.audio[0].name) {
            //         this.$store.dispatch('setNextAudio', i)
            //         break
            //     }
            // }
            // if (this.audio[0].mp3Url) {
            //     this.$store.dispatch('setAudioUrl', this.audio[0].mp3Url)
            // } else {
            //     api.MusicUrl(this.audio[0].id)
            //         .then(res => {
            //             this.$store.dispatch('setAudioUrl', res.data[0].url)
            //         })
            // }
        },
        showList() {
            //this.$store.dispatch('setShowListenList', true)
        },
        showPlay() {
            //this.$store.dispatch('setShowPlay', true)
        },
        percentinput(newvalum) {
            //手动调整拖放曲目的播放进度
           // console.log('percentChanged to ' + newvalum);
        },
        playPercentchange(newvalum) {
            console.log('playPercentchange to ' + newvalum);
        },
        playmodelswich() {
            // console.log('playmodelswich');
        },
        equalizingControl() {
            this.$message({
                showClose: true,
                message: '对不起，当前机型好像不支持远程EQ调节.',
                type: 'warning'
            });
        },
        valumchange(newvalum) {
            console.log('valumchange to ' + newvalum);
        }
    },
    watch: {
        // playing() {
        //     this.playing ? this.$refs.myAudio.play() : this.$refs.myAudio.pause()
        // },
        // audio() {
        //     this.$store.dispatch('getMusicInfo', this.audio[0].id)
        //     this.now = 0
        //     this.$refs.myAudio.addEventListener('error', () => {
        //         _.toast('获取音乐出错...')
        //     })
        // },
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/function';

.playbar {
    transition: all .7s ease-in; // display: flex;
    background: #353c46;
    position: absolute;
    width: 100%;
    height: 3.75em;
    bottom: 0em; // border-width: 1px;
    // border-style: solid;
    // border-color: #d3d3d3;
    .play-box {
        width: 11.25em;
        float: left;
        height: 100%;
        .pay-front {
            position: absolute;
            top: 18%;
            left: 0.7em;
        }
        .pay-play {
            position: absolute;
            top: 10%;
            left: 4em;
        }
        .pay-next {
            position: absolute;
            top: 18%;
            left: 8em;
        }
    }
    .progress-bar {
        margin-left: 11.25em;
        margin-right: 12em;
        height: 100%;
        span {
            color: #fff;
        }
        div {
            height: 1em;
        }
        .remainingTimeFlag {
            width: 4.375em;
            float: right;
        }
        .finishTimeFlag {
            width: 4.375em;
            float: left;
        }
        .musicnameFlag {
            margin-left: 4.375em;
            margin-right: 4.375em;
            text-align: center;
            margin-top: -0.2em;
        }
    }
    .payset-bar {
        float: right;
        width: 12em;
        height: 100%;
        .juzhongd {
            margin: 1.25em 0.5em 1.25em 1.5em;
        }
        .juzhongz {
            margin: 1.25em 0.5em 1.25em 0em;
        }
    }
}

.mobile {
    height: 2.75em;
    .play-box {
        width: 6.85em;
        height: 100%;
        .pay-front {
            position: absolute;
            top: 18%;
            left: 0.2em;
        }
        .pay-play {
            position: absolute;
            top: 5%;
            left: 2.2em;
        }
        .pay-next {
            position: absolute;
            top: 18%;
            left: 4.8em;
        }
    }
    .progress-bar {
        margin-left: 6.85em;
        margin-right: 5em;
        margin-top: -0.8em;
        .el-slider {
            margin: 2px 4px 5px 6px;
        }
    }
    .payset-bar {
        width: 5em;
        .juzhongd {
            margin: 0.65em 0.3em 0.65em 0.3em;
        }
        .juzhongz {
            margin: 0.65em 0.3em 0.65em 0em;
        }
    }
}
</style>