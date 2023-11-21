<script setup lang="ts">
import type {Job} from '@compose/apidoc-dts-maliang-tnmaster'
import {JobApi} from '@/api/JobApi'
import DisabilityRuleCheckboxComp from '@/components/disability/DisabilityRuleCheckboxComp.vue'
import {GenderTypingMap, GenderTypingReverseMap, type Inst} from '@compose/compose-types'
import {VForm} from 'vuetify/components'
import {DayJs, des} from '@compose/api-model'

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
        <VTextField :rules="[v => Boolean(v) || '职位名称不能为空']" label="公司名称" v-model="pubJob.title" />
        <VTextField label="联系电话（求职者将会通过此号码联系到您）" v-model="pubJob.phone" />
        <VTextField label="公司联系座机（备用联系方式）" v-model="pubJob.landline" />
        <VTextarea label="职位描述" v-model="pubJob.doc" />
        <VTextarea label="岗位职责" v-model="pubJob.postResp" />
        <VTextarea label="任职要求" v-model="pubJob.qualification" />

        <VRow :dense="true" align="center">
          <VCol cols="12" md="6" sm="12">
            <VDialog flex>
              <template #activator="{props}">
                <VBtn v-bind="props" v-if="pubJob.startDate && pubJob.endDate">重新选择招聘时间</VBtn>
                <span v-if="pubJob.startDate && pubJob.endDate">{{ DayJs.formatDate(pubJob.startDate) }} - {{ DayJs.formatDate(pubJob.endDate) }}</span>
                <VBtn v-else v-bind="props" color="primary">选择招聘时间</VBtn>
              </template>
              <template #default="{isActive}">
                <div w-fit>
                  <YQDatePicker range v-model:range-start-value="pubJob.startDate" v-model:range-end-value="pubJob.endDate" />
                  <VBtn :block="true" @click="isActive.value = false" color="primary">确定</VBtn>
                </div>
              </template>
            </VDialog>
          </VCol>
          <VCol cols="11" md="5" sm="11">
            <AddressSelectDialogComp v-model:full-path="_fullPath" v-model:code="pubJob.addressCode" v-model:active="showAddr" />
          </VCol>
          <VCol cols="11" md="5" sm="11">
            <VSwitch label="加急" color="primary" v-model="pubJob.eagerFetch" />
          </VCol>
        </VRow>

        <VTextField type="number" label="需要人数" v-model="pubJob.rqCount" />

        <VRow :dense="true" justify="space-around" align="center">
          <VCol cols="12" md="6" sm="12">
            <VTextField type="number" label="需要经验年限" v-model="pubJob.exYear" />
          </VCol>
          <VCol cols="12" md="6" sm="12">
            <VSwitch label="接受应届毕业生" color="primary" v-model="pubJob.student" />
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
      <VBtn @click="submit" color="primary">提交</VBtn>
      <VBtn @click="clear" color="error">清空</VBtn>
      <VSpacer />
    </VCardActions>
  </VCard>
</template>
