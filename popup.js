document.querySelector('#activate').addEventListener("click", activate);
document.querySelector('#deactivate').addEventListener("click", deactivate);

async function activate() {
    chrome.action.setIcon({path: { "19": "/check_yellow-19.png"}})
    await chrome.runtime.sendMessage({command: "activate"});
}

async function deactivate() {
    chrome.action.setIcon({path: { "19": "/check_black-19.png"}})
    await chrome.runtime.sendMessage({command: "deactivate"});
}

