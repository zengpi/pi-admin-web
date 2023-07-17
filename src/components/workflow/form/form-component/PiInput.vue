<script setup lang="ts" name="PiRadio">
/**
 * Input 输入框
 * @author ZnPi
 * @date 2023-07-13
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
    <el-input v-model="value" :readonly="readonly"></el-input>
</template>