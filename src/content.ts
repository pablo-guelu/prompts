import { Prompt } from "./types";

(() => {

    chrome.runtime.onMessage.addListener((request) => {

        console.log(request.type);

        if (request.type === 'usePrompt') {
            setPrompt(request.promptId);
        }
    });
})();

let prompts: Prompt[] = [];

chrome.storage.sync.get(['storedPrompts']).then(result => {
    prompts = result.storedPrompts;
    console.log(prompts)
});

chrome.storage.onChanged.addListener(() => {
    chrome.storage.sync.get(['storedPrompts']).then(result => {
        prompts = result.storedPrompts;
        console.log(prompts)
    });
});


async function setPrompt(index: number) {

    const promptArea: HTMLTextAreaElement = document.getElementById('prompt-textarea') as HTMLTextAreaElement;

    if (promptArea !== null) {
        console.log(promptArea, prompts[index]);
        promptArea.value = prompts[index].prompt;
    } else {
        console.log('no prompt area');
    }

};

