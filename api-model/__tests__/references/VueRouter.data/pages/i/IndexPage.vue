<script setup lang="ts">
import {indexTable} from '.'

const router = useRouter()
const routeTo = (path?: string) => {
  if (path) router.push(path)
}
</script>
<template>
  <VContainer v-for="(group, gIdx) in indexTable" :key="gIdx">
    <h3>{{ group.title }}</h3>
    <VDivider pb-1 />
    <VRow transition-all duration-300>
      <template v-for="(it, idx) in group.children" :key="idx">
        <VCol cols="12" sm="6" md="3" xl="1">
          <VCard min-h-10 @click="routeTo(it.link)">
            <div v-ripple f-c flex-col>
              <div rounded c-p text-16 :class="it.icon" />
              <div text-4>{{ it.title }}</div>
            </div>
          </VCard>
        </VCol>
      </template>
    </VRow>
  </VContainer>
</template>
