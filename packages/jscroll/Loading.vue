<template>
  <div class="loading">
    <img :width="width" :height="height" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 24,
      height: 24
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped>
.loading {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.desc {
  line-height: 20px;
  font-size: 24px;
  color: #666;
}
</style>
