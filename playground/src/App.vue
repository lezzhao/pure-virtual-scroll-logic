<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useVirtualScroll } from '../../src/scroll'

const list = Array.from({ length: 1000000 }).map((_, i) => ({
  id: i,
  name: `Item ${i}`,
}))

const containerRef = ref<HTMLElement>()
const virtualInfo = ref<any>({
  offset: 0,
  realHeight: 0,
})
const visList = ref<any>([])

onMounted(() => {
  if (containerRef.value) {
    const { initVirtualScroll } = useVirtualScroll({
      amount: list.length,
      viewport: containerRef.value,
      itemHeight: 22,
      onCalculated: (info) => {
        visList.value = list.slice(info.start, info.end)
        virtualInfo.value = {
          offset: info.offset,
          realHeight: info.realHeight,
        }
        // nextTick(() => {
        //   for (let i = 0; i < visList.value.length; i++) {
        //     const el = document.querySelector(`[data-index="${info.start + i}"]`)
        //   }
        // })
      },
    })

    initVirtualScroll()
  }
})
</script>

<template>
  <div ref="containerRef" class="container">
    <div class="content" :style="{ height: `${virtualInfo.realHeight}px` }">
      <div :style="{ transform: `translateY(${virtualInfo?.offset || 0}px)` }">
        <div v-for="item, index in visList" :key="index" class="item" :data-index="index">
          <span v-if="index % 2 === 0">{{ item.name }}</span>
          <details v-else>
            <summary>Google Nexus 6</summary>
            <p>商品详情：</p>
            <dl>
              <dt>屏幕</dt>
              <dd>5.96” 2560x1440 QHD AMOLED display (493 ppi)</dd>
              <dt>电池</dt>
              <dd>3220 mAh</dd>
              <dt>相机</dt>
              <dd>13MP rear-facing with optical image stabilization 2MP front-facing</dd>
              <dt>处理器</dt>
              <dd>Qualcomm® Snapdragon™ 805 processor</dd>
            </dl>
          </details>
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
