let count = 0
const max_timeout = 30*60*1000
const timeout = 2000
const max_count = max_timeout/timeout
let is_active = false

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.command === "activate") {
            if (!is_active) {
                is_active = true
                await myFunction()
            }
        }
    }
);

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.command === "deactivate") {
            is_active = false
            reset()
        }
    }
);

function reset() {
    count = 0;
    chrome.action.setBadgeText({text: null})
}

async function myFunction() {
    if (!is_active) {
        reset()
        return
    }

    try {
        const response = await fetch('https://www.znanylekarz.pl');

        if (!response.ok) {
            if (count <= max_count) {
                chrome.action.setBadgeText({text: String(count)})
                await new Promise(()=> {
                    setTimeout(async (resolve,reject)=> {
                        myFunction().then(resolve).catch(reject)
                        count++
                    },timeout)
                })
            }
            chrome.action.setIcon({path: { "19": "/check_yellow-19.png"}})
        }else {
            const txt = await response.text()

            if (txt.includes('www.znanylekarz.pl')) {
                onSuccess()
            }
        }
    } catch (error) {
        if (count <= max_count) {
            chrome.action.setBadgeText({text: String(count)})
            await new Promise(() => {
                setTimeout(async (resolve, reject) => {
                    myFunction().then(resolve).catch(reject)
                    count++
                }, timeout)
            })
        }
        chrome.action.setIcon({path: "/check_red-19.png"})
    }
}

function onSuccess() {
    const options = {
        type: "basic",
        iconUrl: "./check-19.png",
        title: "Popup.js",
        message: "Hello from popup.js!"
    };

    chrome.notifications.create(options);
    chrome.action.setBadgeText({text: null})
    chrome.action.setIcon({path: { "19": "/check-19.png"}})
}