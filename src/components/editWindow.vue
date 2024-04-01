<template>
    <v-card-text>
        <v-form ref="promptForm">
            <v-text-field :rules="validationRules" label="Title" variant="solo-filled"
                v-model="prompt.title"></v-text-field>
            <v-textarea :rules="validationRules" label="Prompt" variant="solo-filled" v-model="prompt.prompt"></v-textarea>
        </v-form>
    </v-card-text>

    <v-card-actions class="pt-6 me-2 d-flex justify-end">
        <v-btn variant="elevated" color="blue-darken-3" @click="closeEdit">
            CANCEL
        </v-btn>
        <v-btn variant="elevated" color="blue-darken-3" :loading="saveButtonLoading" @click="savePrompt">
            SAVE
        </v-btn>
    </v-card-actions>
</template>

<script lang="ts" setup>
import { Prompt } from '../types';
import { usePromptStore } from '../stores/prompt.ts'
import { Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';

const promptStore = usePromptStore();
const {promptForm} = storeToRefs(promptStore);
const { savePrompt, closeEdit, validationRules } = promptStore;

const saveButtonLoading: Ref<boolean> = ref(false);

const props = defineProps<{
    prompt: Prompt
}>()

console.log(props.prompt);

</script>