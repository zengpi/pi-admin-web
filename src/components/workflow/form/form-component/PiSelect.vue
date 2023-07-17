<script setup lang="ts" name="PiSelect">
/**
 * Select 选择器
 * @author ZnPi
 * @date 2023-07-13
 */
import { computed, onMounted } from "vue";

import type { SelectOptions } from "@/model/process/process-management/process-form";

const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();

const props = defineProps<{
    value: string;
    readonly: boolean;
    options: Array<SelectOptions>;
}>();

const value = computed({
    get() {
        return props.value;
    },
    set(value) {
        emit("update:value", value);
    },
});
</script>

<template>
    <el-select v-model="value" placeholder="请选择" filterable clearable :disabled="readonly">
        <el-option v-for="(option, key) in options" :key="key" :label="option.name"
            :value="option.id ? option.id : option.name">
        </el-option>
    </el-select>
</template>