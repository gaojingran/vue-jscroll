<template>
  <div ref="wrapper" class="list-wrapper">
    <!-- 滚动部分 -->
    <div class="scroll-content" ref="scrollContent">
      <div ref="listWrapper">
        <!-- 列表item -->
        <slot></slot>
      </div>
      <!-- 上拉加载更多 -->
      <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{ pullUpTxt }}</span>
          </div>
          <div class="after-trigger" v-else>
            <Loading />
          </div>
        </div>
      </slot>
    </div>
    <slot
      name="pulldown"
      :pullDownRefresh="pullDownRefresh"
      :pullDownStyle="pullDownStyle"
      :beforePullDown="beforePullDown"
      :isPullingDown="isPullingDown"
      :bubbleY="bubbleY"
    >
      <div
        ref="pulldown"
        class="pulldown-wrapper"
        :style="pullDownStyle"
        v-if="pullDownRefresh"
      >
        <div class="before-trigger" v-if="beforePullDown">
          <Bubble
            :y="bubbleY"
            :bubbleFillColor="bubbleFillColor"
            :bubbleStrokeColor="bubbleStrokeColor"
            :arrowFillColor="arrowFillColor"
            :arrowStrokeColor="arrowStrokeColor"
          />
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <Loading />
          </div>
          <div v-else>
            <span>{{ refreshTxt }}</span>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import Bubble from "../bubble";
import Loading from "../loading";

const DIRECTION_H = "horizontal";
const DIRECTION_V = "vertical";

export default {
  name: "JScroll",
  components: {
    Bubble,
    Loading
  },
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    listenBeforeScroll: {
      type: Boolean,
      default: false
    },
    listenScrollEnd: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    scrollbar: {
      type: null,
      default: false
    },
    pullDownRefresh: {
      type: null,
      default: false
    },
    pullUpLoad: {
      type: null,
      default: false
    },
    startY: {
      type: Number,
      default: 0
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    freeScroll: {
      type: Boolean,
      default: false
    },
    mouseWheel: {
      type: Boolean,
      default: false
    },
    bounce: {
      default: true
    },
    zoom: {
      default: false
    },
    bubbleFillColor: {
      type: String,
      default: "rgb(170, 170, 170)"
    },
    bubbleStrokeColor: {
      type: String,
      default: "rgb(153, 153, 153)"
    },
    arrowFillColor: {
      type: String,
      default: "rgb(255, 255, 255)"
    },
    arrowStrokeColor: {
      type: String,
      default: "rgb(170, 170, 170)"
    }
  },
  data() {
    return {
      beforePullDown: true,
      isRebounding: false,
      isPullingDown: false,
      isPullUpLoad: false,
      pullUpDirty: true,
      pullDownStyle: "",
      bubbleY: 0
    };
  },
  computed: {
    pullUpTxt() {
      const moreTxt =
        (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more) ||
        "～加载更多～";
      const noMoreTxt =
        (this.pullUpLoad &&
          this.pullUpLoad.txt &&
          this.pullUpLoad.txt.nomore) ||
        "~没有更多数据~";
      return this.pullUpDirty ? moreTxt : noMoreTxt;
    },
    refreshTxt() {
      return (this.pullDownRefresh && this.pullDownRefresh.txt) || "刷新成功";
    }
  },
  created() {
    this.pullDownInitTop = -50;
  },
  mounted() {
    setTimeout(() => {
      this.initScroll();
    }, 20);
  },
  destroyed() {
    this.$refs.scroll && this.$refs.scroll.destroy();
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
        this.$refs.listWrapper.style.minHeight = `${
          this.$refs.wrapper.offsetHeight
        }px`;
      }
      const options = {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.freeScroll || this.direction === DIRECTION_V,
        scrollX: this.freeScroll || this.direction === DIRECTION_H,
        scrollbar: this.scrollbar,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad,
        startY: this.startY,
        freeScroll: this.freeScroll,
        mouseWheel: this.mouseWheel,
        bounce: this.bounce,
        zoom: this.zoom
      };
      this.scroll = new BScroll(this.$refs.wrapper, options);
      if (this.listenScroll) {
        this.scroll.on("scroll", pos => {
          this.$emit("scroll", pos);
        });
      }
      if (this.listenScrollEnd) {
        this.scroll.on("scrollEnd", pos => {
          this.$emit("scrollEnd", pos);
        });
      }
      if (this.listenBeforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScrollStart");
        });
        this.scroll.on("scrollStart", () => {
          this.$emit("scrollStart");
        });
      }
      if (this.pullDownRefresh) {
        this._initPullDownRefresh();
      }
      if (this.pullUpLoad) {
        this._initPullUpLoad();
      }
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    autoPullDownRefresh() {
      this.scroll && this.scroll.autoPullDownRefresh();
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    destroy() {
      this.scroll.destroy();
    },
    forceUpdate(dirty) {
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false;
        this._reboundPullDown().then(() => {
          this._afterPullDown();
        });
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.isPullUpLoad = false;
        this.scroll.finishPullUp();
        this.pullUpDirty = dirty;
        this.refresh();
      } else {
        this.refresh();
      }
    },
    _initPullDownRefresh() {
      this.scroll.on("pullingDown", () => {
        this.beforePullDown = false;
        this.isPullingDown = true;
        this.$emit("pullingDown");
      });
      this.scroll.on("scroll", pos => {
        if (!this.pullDownRefresh) {
          return;
        }
        if (this.beforePullDown) {
          this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
          this.pullDownStyle = `top:${Math.min(
            pos.y + this.pullDownInitTop,
            10
          )}px`;
        } else {
          this.bubbleY = 0;
        }
        if (this.isRebounding) {
          this.pullDownStyle = `top:${10 -
            (this.pullDownRefresh.stop - pos.y)}px`;
        }
      });
    },
    _initPullUpLoad() {
      this.scroll.on("pullingUp", () => {
        this.isPullUpLoad = true;
        this.$emit("pullingUp");
      });
    },
    _reboundPullDown() {
      const { stopTime = 600 } = this.pullDownRefresh;
      return new Promise(resolve => {
        setTimeout(() => {
          this.isRebounding = true;
          this.scroll.finishPullDown();
          resolve();
        }, stopTime);
      });
    },
    _afterPullDown() {
      setTimeout(() => {
        this.pullDownStyle = `top:${this.pullDownInitTop}px`;
        this.beforePullDown = true;
        this.isRebounding = false;
        this.refresh();
      }, this.scroll.options.bounceTime);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.forceUpdate(true);
      }, this.refreshDelay);
    }
  }
};
</script>

<style scoped>
.list-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
}
.scroll-content {
  position: relative;
  z-index: 1;
}
.list-content {
  position: relative;
  z-index: 10;
}
.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
}
.after-trigger {
  margin-top: 10px;
}
.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}
</style>
