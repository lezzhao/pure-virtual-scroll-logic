<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useScrollHelper } from "../../src/scroll";

const list = Array.from({ length: 1000000 }).map((_, i) => ({
  id: i,
  name: `Item ${i}`
}))

const containerRef = ref<HTMLElement>()
const virtualInfo = ref<any>()
const realHeight = ref(0)
const visList = ref<any>([])

onMounted(() => {
  if (containerRef.value) {
    const res = useScrollHelper({
      list,
      el: containerRef.value,
      rowHeight: 22,
      calcFn: (info) => {
        virtualInfo.value = info
        visList.value = info.list
        console.log(info);
      }
    })
    realHeight.value = res.realHeight
  }
})

</script>

<template>
  <div class="container" ref="containerRef">
    <div class="content" :style="{ height: `${realHeight}px` }">
      <div :style="{ transform: `translateY(${virtualInfo?.offsetY || 0}px)` }">
        <div class="item" v-for="item, index in visList">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 200px;
  width: 800px;
  margin: auto;
  border: 1px solid #ccc;
  padding: 0 16px;
  overflow-y: auto;
  position: relative;
}
</style>
