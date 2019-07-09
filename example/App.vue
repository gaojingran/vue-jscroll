<template>
  <div>
    <div class="container">
      <JScroll
        ref="scroll"
        :data="source"
        :pullDownRefresh="{ stop: 60 }"
        :pullUpLoad="true"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
      >
        <div class="item" v-for="(v, i) in source" :key="i">{{ v }}</div>
      </JScroll>
    </div>

    <div class="horizontal">
       <JScroll
        direction="horizontal"
        horizontalWidth="2000px"
        :data="source"
      >
        <div class="item" v-for="(v, i) in source" :key="i">{{ v }}</div>
      </JScroll>
    </div>
  </div>
</template>

<script>
import JScroll from "../packages/jscroll";
export default {
  name: "App",
  components: {
    JScroll,
  },
  data() {
    return {
      source: [1,2,3],
    };
  },
  methods: {
    onPullingDown() {
      // 模拟更新数据
      setTimeout(() => {
        if (Math.random() > 0.5) {
          // 如果有新数据
          this.source.unshift("newDataTxt" + +new Date());
        } else {
          // 如果没有新数据
          this.$refs.scroll.forceUpdate();
        }
      }, 2000);
    },
    onPullingUp() {
      // 更新数据
      console.log("pulling up and load data");
      setTimeout(() => {
        if (Math.random() > 0.5) {
          // 如果有新数据
          let newPage = [];
          for (let i = 0; i < 10; i++) {
            newPage.push(+new Date());
          }
          this.source = this.source.concat(newPage);
        } else {
          // 如果没有新数据
          this.$refs.scroll.forceUpdate();
        }
      }, 1500);
    },
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 200px;
  overflow: hidden;
}
.horizontal {
  height: 200px;
  overflow: hidden;
  margin-top: 20px;
}
.horizontal .item {
  float: left;
  width: 300px;
  margin: 0 24px;
}
.item {
  height: 60px;
  background-color: #666;
  margin-block-end: 20px;
  color: #fff;
}
</style>
