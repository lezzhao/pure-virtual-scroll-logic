<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useVirtualScroll } from "../../src/scroll";

const list = Array.from({ length: 1000000 }).map((_, i) => ({
  id: i,
  name: `Item ${i}`
}))

const containerRef = ref<HTMLElement>()
const virtualInfo = ref<any>({
  offset: 0,
  realHeight: 0
})
const visList = ref<any>([])
const htmlStr = ref('')

onMounted(() => {
  if (containerRef.value) {

    useVirtualScroll({
      amount: list.length,
      viewport: containerRef.value,
      itemHeight: 22,
      onCalculated: (info) => {
        visList.value = list.slice(info.start, info.end)
        console.log(visList.value);
        
        virtualInfo.value = {
          offset: info.offset,
          realHeight: info.realHeight
        }

        htmlStr.value = visList.value.map((item: any) => `<div class="item">${item.name}</div>`).join('')
      }
    })
  }
})

</script>

<template>
  <div class="container" ref="containerRef">
    <div class="content" :style="{ height: `${virtualInfo.realHeight}px` }">
      <div :style="{ transform: `translateY(${virtualInfo?.offset || 0}px)` }">
        <div class="item" v-for="item, index in visList" :key="index">
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
