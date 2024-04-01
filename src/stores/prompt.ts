import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
import { Prompt, PopupMode } from '../types';

export const usePromptStore = defineStore('prompt', () => {
    const popupMode: Ref<PopupMode> = ref(PopupMode.TABLE);

    const prompts: Ref<Prompt[]> = ref([]);
    chrome.storage.sync.get(['storedPrompts']).then(result => {
        prompts.value = result.storedPrompts ? result.storedPrompts : [];
        console.log(result);
        console.log(prompts.value)
    })

    const defaultPrompt: Prompt = {
        id: '',
        title: '',
        prompt: '',
        active: false
    }

    const currentPrompt: Ref<Prompt> = ref({...defaultPrompt});

    const createContextItem = (prompt: Prompt) => {
        console.log(prompt);

        const id: string = `prompt-${prompt.id}`;

        chrome.contextMenus.create({
            id: id,
            parentId: "commonPrompts",
            title: prompt.prompt,
            contexts: ["editable"],
        });
    };

    const updateContextItem = (prompt: Prompt) => {
        console.log(prompt);
        const id: string = `prompt-${prompt.id}`;
        chrome.contextMenus.update(
            id,
            {
                title: prompt.prompt
            }
        );
    };

    const addPrompt = () => {
        currentPrompt.value = {...defaultPrompt};
        popupMode.value = PopupMode.EDIT;
    }

    const editingIndex: Ref<number | null> = ref(null);

    const editPrompt = (index: number) => {
        currentPrompt.value = { ...prompts.value[index] }; // Make a copy of the prompt to edit
        editingIndex.value = index; // Set the editing index
        popupMode.value = PopupMode.EDIT; // Change the mode to EDIT
    }

    const savePrompt = async () => {
        let updatedPrompts = [...prompts.value];

        const { valid } = await promptForm.value?.validate()

        if (valid) {
            if (editingIndex.value !== null) {
                updatedPrompts[editingIndex.value] = currentPrompt.value; // Replace the prompt at editingIndex
            } else {
                currentPrompt.value.id = prompts.value.length === 0 ? 0 : prompts.value.length;
                updatedPrompts.push(currentPrompt.value); // Add a new prompt
            }
            prompts.value = updatedPrompts; // Update the ref
            chrome.storage.sync.set({ 'storedPrompts': updatedPrompts }).then(() => {
                console.log('SAVED PROMPTS: ', updatedPrompts);

                if (editingIndex.value !== null) {
                    updateContextItem(currentPrompt.value); // update the context menu item
                } else {
                    createContextItem(currentPrompt.value); // Add a new context menu item
                }
                popupMode.value = PopupMode.TABLE;
                editingIndex.value = null; // Reset the editing index
            });
        }
    }

    const closeEdit = () => {
        currentPrompt.value = {...defaultPrompt};
        promptForm.value?.reset();
        editingIndex.value = null;
        popupMode.value = PopupMode.TABLE;
    }

    const deletePrompt = (index: number) => {
        // create a new array without the deleted prompt
        let updatedPrompts = [...prompts.value.slice(0, index), ...prompts.value.slice(index + 1)];
        prompts.value = updatedPrompts; // update the ref
        chrome.storage.sync.set({ 'storedPrompts': updatedPrompts }).then(() => {
            console.log('REMAINING PROMPTS: ', updatedPrompts);
            // assuming you also want to remove the context menu item
            const id: string = `prompt-${index}`;
            chrome.contextMenus.remove(id);
        });
    }

    const copyPrompt = async (prompt: Prompt) => {
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            prompt.active = true;
            setTimeout(() => {
                prompt.active = false;
            }, 500);
            console.log('Prompt copied to clipboard');
        } catch (err) {
            console.log('Failed to copy prompt: ', err);
        }
    }

    const promptForm = ref<HTMLFormElement>();
    const searchActive: Ref<boolean> = ref(false);
    const search: Ref<string> = ref('');
    const showCopied: Ref<boolean> = ref(false);
    const gptActive: Ref<boolean> = ref(false);

    const checkForGPT = async () => {
        let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        console.log(tab);
        if (tab.url && tab.url.includes('https://chat.openai.com')) {
            console.log(tab.url);
            gptActive.value = true;
        }
    }

    const validationRules = [
        (value: string) => {
            if (value) return true
            return 'Required field.'
        }
    ];


    return {
        prompts,
        popupMode,
        currentPrompt,
        promptForm,
        addPrompt,
        editPrompt,
        savePrompt,
        closeEdit,
        deletePrompt,
        copyPrompt,
        checkForGPT,
        search,
        searchActive,
        showCopied,
        gptActive,
        validationRules
    }
})