<template>
  <transition name="move">
    <div class="menu" v-show="item.menuShow">
      <div class="inner inner-1" @click.once="_temporaryPlay(index)">
        <i class="icon el-icon-caret-right"></i>
      </div>
      <div class="inner inner-2" @click="_addToTask(item,index,task,path)">
        <i class="icon el-icon-plus"></i>
      </div>
      <div class="inner inner-3" @click="_del(index)">
        <i class="icon el-icon-delete"></i>
      </div>
      <el-dialog title="请选择要添加到的定时播放任务" :visible.sync="dialogTaskVisible" :width="dialogTaskWidth">
        <el-form :model="form">
          <el-form-item label="定时播放任务" >
            <el-select v-model="form.TaskID" placeholder="请选择播放任务">
              <el-option v-for="item in tasks" :key="item.TaskID" :label="item.TaskName" :value="item.TaskID"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTaskVisible=false">取 消</el-button>
          <el-button type="primary"  @click="addToSelectTask">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </transition>
</template>


<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import api from "../../api/index";

export default {
  props: {
    item: Object,
    index: Number,
    task: Object,
    path: ""
  },

  data() {
    return {
      dialogTaskVisible: false,
      form: {
        TaskID: null,
        taskName: "",
        fileName: ""
      }
    };
  },

  computed: {
    ...mapGetters({
      isMobileDev: "isMobileDev",
      isPcDev: "isPcDev",
      isLogin: "isLogin",
      tokenStr: "tokenStr",
      tasks: "tasks"
    }),
    dialogTaskWidth() {
      return this.isPcDev ? "40%" : "80%";
    }
  },

  methods: {
    _temporaryPlay(index) {
      this.$message({
        showClose: true,
        message: "_temporaryPlay index: " + index,
        type: "success"
      });
    },

    _addToTask(item, index, task, currentPath) {
      this.form.fileName = currentPath + "/" + item.Name;
      if (task.taskID != undefined) {
        this.form.TaskID = task.taskID;
        this.addToSelectTask();
      } else {
        //弹出选择任务的对话框
        this.dialogTaskVisible = true;
      }
    },

    _del(index) {
      this.$message({
        showClose: true,
        message: "_del index: " + index,
        type: "success"
      });
    },
    addToSelectTask() {
      if (this.form.TaskID == null) {
        return;
      }
      //console.log(this.form.fileName);
      let params = {
        CMD: "AddTaskProject",
        TaskID: this.form.TaskID,
        FileName: this.form.fileName,
        Token: this.tokenStr
      };
      api.Task(params).then(res => {
        this.$message({
          showClose: true,
          message: "添加项目到定时任务" + (res.Status ? "成功." : "失败!请检查后重试."),
          type: res.Status ? "success" : "warning"
        });
      });
      this.dialogTaskVisible = false;
      this.form.fileName = "";
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

    //color: #fff;

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