<template>
  <v-card class="mx-auto rounded-0 d-flex flex-column" width="500" :min-height="400">
    <v-toolbar color="blue-darken-3">
      <v-btn variant="text" icon="mdi-menu" color="white"></v-btn>

      <v-toolbar-title class="ms-1">Prompts</v-toolbar-title>
      <v-badge v-if="gptActive" color="teal-lighten-1" content="chatGPT" inline class="flex-grow-1"></v-badge>

      <div v-if="popupMode == PopupMode.TABLE" class="flex-grow-1 d-flex justify-end">
        <v-slide-x-reverse-transition>
          <v-text-field v-if="searchActive" :hide-details="true" autofocus variant="solo-filled" bg-color="transparent" density="compact"
            v-model="search"></v-text-field>
        </v-slide-x-reverse-transition>
        <v-btn v-if="!searchActive" icon="mdi-plus" class="mx-1" @click="addPrompt"></v-btn>
        <v-btn icon="mdi-magnify" class="mx-1" @click="searchActive ? searchActive = false : searchActive = true"
          :active="searchActive"></v-btn>
      </div>

    </v-toolbar>

    <v-window v-model="popupMode" class="flex-grow-1">

      <!-- EDIT -->
      <v-window-item :value="PopupMode.EDIT">
        <edit-window :prompt="currentPrompt" />
      </v-window-item>

      <!-- TABLE -->
      <v-window-item :value="PopupMode.TABLE">

        <table-window v-if="prompts.length > 0"></table-window>

        <v-sheet height="300" class="d-flex justify-center align-center" v-else>
          <span class="text-h5 font-italic">No prompts to show</span>
        </v-sheet>
      </v-window-item>

    </v-window>


  </v-card>
</template>

<script setup lang="ts">
import { PopupMode } from './types'
import { usePromptStore } from './stores/prompt.ts'
import EditWindow from './components/editWindow.vue';
import { storeToRefs } from 'pinia';
import TableWindow from './components/tableWindow.vue';

const promptStore = usePromptStore();
const { currentPrompt, popupMode, prompts, searchActive, search, gptActive } = storeToRefs(promptStore);
const { addPrompt, checkForGPT } = promptStore;

checkForGPT();

</script>

<style scoped>

</style>
