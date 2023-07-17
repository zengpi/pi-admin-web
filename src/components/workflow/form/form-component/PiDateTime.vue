<script setup lang="ts" name="PiDateTime">
/**
 * DateTimePicker 日期时间选择器
 * @author ZnPi
 * @date 2023-07-16
 */
import { computed } from "vue";

const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();

const props = defineProps<{
    value: string;
    readonly: boolean;
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
    <el-date-picker v-model="value" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"
        placeholder="选择日期时间" :readonly="readonly">
    </el-date-picker>
</template>