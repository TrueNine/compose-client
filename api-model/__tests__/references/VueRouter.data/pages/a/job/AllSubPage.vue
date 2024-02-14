<script setup lang="ts">
    import type { Nullable, Pq, Pr } from "@compose/api-types";
    import type { AddressFullPathResp, Job } from "@compose/apidoc-dts-maliang-tnmaster";
    import { DayJs, eagerFetch } from "@compose/api-model";

    import { AddressApi } from "@/api/AddressApi";
    import { JobApi } from "@/api/JobApi";

    const router = useRouter();

    const page = ref<Pq>({ offset: 0, pageSize: 42 });
    const data = ref<Nullable<Pr<Job>>>(null);
    const addressData = ref<AddressFullPathResp[]>([]);
    const findCodePath = (code: string) => {
        return addressData.value.find((e) => e.code === code.padEnd(12, "0"));
    };

    const changeRequest = async (pq?: Pq) => {
        data.value = await eagerFetch(JobApi.getAll(pq));
        const a = data
            .value!.dataList!.map((e) => [e.addressCode!, e.rqAddressCode!])
            .flat()
            .filter(Boolean);
        addressData.value = a.length > 0 ? (await eagerFetch(AddressApi.findAllFullPathByCodeIn(a))) ?? [] : [];
    };

    onMounted(async () => {
        await changeRequest();
    });

    const disResult = (a: number[]) => {
        return new Uint8Array(a);
    };
</script>
<template>
    <nav flex justify-between>
        <div text-8>所有职位</div>
        <VBtn color="primary" @click="router.push(`/a/job/add`)"><i i-mdi-plus /> 添加职位</VBtn>
    </nav>
    <div f-x-c>
        <PaginatorComp v-model:pq="page" :pr="data" @change="changeRequest" />
    </div>

    <ElTable v-if="data?.dataList" :data="data.dataList" height="700">
        <ElTableColumn type="expand">
            <template #default="{ row }">
                <VRow :dense="true">
                    <VCol cols="3">
                        <VCard title="职位描述">
                            <VCardText>
                                <pre>{{ row.doc }}</pre>
                            </VCardText>
                        </VCard>
                    </VCol>
                    <VCol cols="3">
                        <VCard title="岗位职责">
                            <VCardText>
                                <pre>{{ row.postResp }}</pre>
                            </VCardText>
                        </VCard>
                    </VCol>
                    <VCol cols="3">
                        <VCard title="任职要求">
                            <VCardText>
                                <pre>{{ row.qualification }}</pre>
                            </VCardText>
                        </VCard>
                    </VCol>
                    <VCol cols="3">
                        <VCard title="残障接受状况">
                            <VCardText>
                                <DisabilityChipComp :rules="disResult(row.rqDisabilityRule)" />
                            </VCardText>
                        </VCard>
                    </VCol>
                </VRow>
            </template>
        </ElTableColumn>

        <ElTableColumn prop="title" label="职位名称" />

        <ElTableColumn prop="auditStatus" label="审核状态">
            <template #default="{ row }">
                <section text-ell>{{ row.auditStatus }}</section>
            </template>
        </ElTableColumn>

        <ElTableColumn prop="eagerFetch" label="加急">
            <template #default="{ row }">
                <VChip :color="row.eagerFetch ? `red` : `green`" size="small">{{ row.eagerFetch ? "加急" : "无需" }}</VChip>
            </template>
        </ElTableColumn>

        <ElTableColumn prop="rqCount" label="所需人数">
            <template #default="{ row }">
                {{ row.rqCount ?? "未设定" }}
            </template>
        </ElTableColumn>

        <ElTableColumn prop="addressCode" label="工作地点">
            <template #default="{ row }">
                <div text-ell>
                    {{ findCodePath(row.addressCode)?.fullPath }}
                </div>
            </template>
        </ElTableColumn>

        <ElTableColumn label="工资范围">
            <template #default="{ row }">
                <SalaryRangeComp :min="row.minSalary" :max="row.maxSalary" />
            </template>
        </ElTableColumn>

        <ElTableColumn label="开始招聘时间">
            <template #default="{ row }"> {{ DayJs.formatDate(row.startDate) }}</template>
        </ElTableColumn>
        <ElTableColumn label="招聘结束时间">
            <template #default="{ row }">{{ DayJs.formatDate(row.endDate) }}</template>
        </ElTableColumn>

        <ElTableColumn prop="orderedWight" label="职位排序权重" />

        <ElTableColumn prop="createDatetime" label="创建时间">
            <template #default="{ row }">
                {{ DayJs.formatDatetime(row.createDatetime) }}
            </template>
        </ElTableColumn>
    </ElTable>
</template>
