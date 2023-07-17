<script setup lang="ts" name="PiRadio">
/**
 * rendered as a checkbox field
 * @author ZnPi
 * @date 2023-07-13
 */
import { computed } from "vue";

const emit = defineEmits<{
    (e: "update:value", value: boolean): void;
}>();

const props = defineProps<{
    value: boolean;
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
    <el-radio-group v-model="value" :readonly="readonly">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
    </el-radio-group>
</template>

