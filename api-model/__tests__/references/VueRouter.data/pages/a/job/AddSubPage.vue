<script setup lang="ts">
import type {Job} from '@compose/apidoc-dts-maliang-tnmaster'
import {GenderTypingMap, GenderTypingReverseMap, type Inst} from '@compose/api-types'
import {VForm} from 'vuetify/components'
import {DayJs, des} from '@compose/api-model'

import DisabilityRuleCheckboxComp from '@/components/disability/DisabilityRuleCheckboxComp.vue'
import {JobApi} from '@/data/JobApi'

const initJob = {
  title: '',
  rqDisabilityRule: new Uint8Array(Array.from({length: 28}, () => 0))
}

const pubJob = ref<Job>({...initJob})
const clear = () => {
  pubJob.value = des(initJob)
}

const _rules = ref<boolean[]>(Array.from({length: 28}, () => false))

const showAddr = ref(false)
const _fullPath = ref<string>('')
const _salaryFixed = ref<boolean>(false)

const genderTyping = computed({
  set: v => (pubJob.value.rqGender = GenderTypingReverseMap[v as unknown as '1']),
  get: () => GenderTypingMap[pubJob.value.rqGender!]
})

const form = ref<Inst<typeof VForm> | null>(null)
const submit = async () => {
  await form.value!.validate()
  const {execute} = JobApi.saveJob(pubJob.value)
  await execute()
}
</script>

<template>
  <VCard sm-min-w-100 md-min-w-120 lg-min-w-150>
    <VCardTitle>添加职位</VCardTitle>
    <VCardText>
      <VForm ref="form" fast-fail @submit.prevent>
        <VTextField v-model="pubJob.title" :rules="[v => Boolean(v) || '职位名称不能为空']" label="公司名称" />
        <VTextField v-model="pubJob.phone" label="联系电话（求职者将会通过此号码联系到您）" />
        <VTextField v-model="pubJob.landline" label="公司联系座机（备用联系方式）" />
        <VTextarea v-model="pubJob.doc" label="职位描述" />
        <VTextarea v-model="pubJob.postResp" label="岗位职责" />
        <VTextarea v-model="pubJob.qualification" label="任职要求" />

        <VRow :dense="true" align="center">
          <VCol cols="12" md="6" sm="12">
            <VDialog flex>
              <template #activator="{props}">
                <VBtn v-if="pubJob.startDate && pubJob.endDate" v-bind="props">重新选择招聘时间</VBtn>
                <span v-if="pubJob.startDate && pubJob.endDate">{{ DayJs.formatDate(pubJob.startDate) }} - {{ DayJs.formatDate(pubJob.endDate) }}</span>
                <VBtn v-else v-bind="props" color="primary">选择招聘时间</VBtn>
              </template>
              <template #default="{isActive}">
                <div w-fit>
                  <YQDatePicker v-model:range-start-value="pubJob.startDate" v-model:range-end-value="pubJob.endDate" range />
                  <VBtn :block="true" color="primary" @click="isActive.value = false">确定</VBtn>
                </div>
              </template>
            </VDialog>
          </VCol>
          <VCol cols="11" md="5" sm="11">
            <AddressSelectDialogComp v-model:full-path="_fullPath" v-model:code="pubJob.addressCode" v-model:active="showAddr" />
          </VCol>
          <VCol cols="11" md="5" sm="11">
            <VSwitch v-model="pubJob.eagerFetch" label="加急" color="primary" />
          </VCol>
        </VRow>

        <VTextField v-model="pubJob.rqCount" type="number" label="需要人数" />

        <VRow :dense="true" justify="space-around" align="center">
          <VCol cols="12" md="6" sm="12">
            <VTextField v-model="pubJob.exYear" type="number" label="需要经验年限" />
          </VCol>
          <VCol cols="12" md="6" sm="12">
            <VSwitch v-model="pubJob.student" label="接受应届毕业生" color="primary" />
          </VCol>
        </VRow>

        <GenderAgeInputComp
          v-model:gender="genderTyping"
          v-model:max-man-age="pubJob.maxManAge"
          v-model:max-woman-age="pubJob.maxWomanAge"
          v-model:min-man-age="pubJob.minManAge"
          v-model:min-woman-age="pubJob.minWomanAge"
        />
        <SalaryRangeSelectComp v-model:fixed="_salaryFixed" v-model:max-salary="pubJob.maxSalary" v-model:min-salary="pubJob.minSalary" />
        <DisabilityRuleCheckboxComp v-model:rules="_rules" v-model:rules-uint8-array="pubJob.rqDisabilityRule" />
      </VForm>
    </VCardText>

    <VCardActions>
      <VBtn color="primary" @click="submit">提交</VBtn>
      <VBtn color="error" @click="clear">清空</VBtn>
      <VSpacer />
    </VCardActions>
  </VCard>
</template>
