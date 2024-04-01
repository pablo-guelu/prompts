import { Prompt } from "./types";

let prompts: Prompt[] = [];

chrome.storage.sync.get(['storedPrompts']).then(result => {
  prompts = result.storedPrompts;
  console.log(prompts)
});

// Adding options to context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addCommonPrompt",
    title: "Add to Common Prompts",
    contexts: ['selection'],
  })

  chrome.contextMenus.create({
    id: "commonPrompts",
    title: "Use Prompt",
    contexts: ["editable"],
    documentUrlPatterns: ["https://chat.openai.com/*"],
  })

  chrome.storage.sync.get('storedPrompts').then((result) => {
    console.log(result.storedPrompts);

    const storedPrompts: Prompt[] = result.storedPrompts || [];

    if (storedPrompts.length > 0) {
      for (let i = 0; i < storedPrompts.length; i++) {
        storedPrompts[i].active = false;
        createContextItem(storedPrompts[i]);
      }
    }
  })

});


const usePrompt = async (index: number) => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  chrome.tabs.sendMessage(
    tab.id!,
    {
      type: 'usePrompt',
      promptId: index
    });
}

function createContextItem(prompt: Prompt) {
  console.log(prompt);

  const id: string = `prompt-${prompt.id}`;

  chrome.contextMenus.create({
    id: id,
    parentId: "commonPrompts",
    title: prompt.prompt,
    contexts: ["editable"],
  });
};


// Function to handle the saving of selected text
chrome.contextMenus.onClicked.addListener(async (info) => {

  if (info.menuItemId === "addCommonPrompt") {

    const selectedPrompt: string = info.selectionText || '';

    chrome.storage.sync.get(['storedPrompts']).then((result) => {

      let storedPrompts = result.storedPrompts || [];
      const PromptId = storedPrompts.length === 0 ? 0 : storedPrompts.length;
      const promptTitle = `Promt-${storedPrompts.length == 0 ? 0 : storedPrompts.length}`;
      const newPrompt: Prompt = {
        id: PromptId,
        title: promptTitle,
        prompt: selectedPrompt,
        active: false,
      };
      storedPrompts.push(newPrompt);

      chrome.storage.sync.set({ 'storedPrompts': storedPrompts }).then(() => {
        console.log("Value is set to " + storedPrompts);

        createContextItem(newPrompt);

      });

    });
  }

  else if (typeof info.menuItemId === 'string' && info.menuItemId.includes('prompt-')) {
    console.log(info, info.menuItemId, info.parentMenuItemId);
    let promptIndex = Number(info.menuItemId.split('-')[1])

    console.log(promptIndex);

    usePrompt(promptIndex);
  }
});