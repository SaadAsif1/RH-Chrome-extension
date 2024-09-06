// Function to handle the toggling of testing mode
function toggleTestingMode(tabId, url, sendResponse) {
    if (!url || !url.startsWith('http')) {  // Ensure it's a valid URL and not an empty string or invalid URL
        console.error("Invalid URL passed to toggleTestingMode:", url);
        sendResponse({ status: "error", message: "Invalid URL" });
        return;
    }

    const currentUrl = new URL(url); // This will safely run only if url is valid
    const isTestingMode = currentUrl.searchParams.has('testing'); // Check if 'testing' is in the URL

    if (isTestingMode) {
        // Remove 'testing' query parameter and unblock the domain
        currentUrl.searchParams.delete('testing'); // Remove 'testing=true'

        // Remove the rule blocking 'tags.roberthalf.com'
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1], // Remove rule ID 1 (blocking rule)
            addRules: []
        });
    } else {
        // Add 'testing=true' query parameter and block the domain
        currentUrl.searchParams.set('testing', 'true'); // Add 'testing=true' to the URL

        // Add a rule to block 'tags.roberthalf.com'
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [{
                id: 1,
                priority: 1,
                action: { type: "block" },
                condition: {
                    urlFilter: "tags.roberthalf.com",
                    resourceTypes: ["script", "xmlhttprequest"]
                }
            }],
            removeRuleIds: []
        });
    }

    // Update the tab's URL to reflect the change
    chrome.tabs.update(tabId, { url: currentUrl.toString() });

    // Provide a response to indicate that the message has been processed
    sendResponse({ status: "success" });
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleTesting") {
        chrome.tabs.get(message.tabId, (tab) => {


            toggleTestingMode(message.tabId, tab.url, sendResponse);
        });
        return true; // Ensure the message is handled asynchronously
    }
});

// Listen for when a page/tab is loading or updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' && tab.url && tab.url.startsWith('http')) {  // Ensure tab.url is valid
        try {
            console.log("Current tab URL:", tab.url); // Log URL for debugging
            const currentUrl = new URL(tab.url); // Construct URL safely
            const isTestingMode = currentUrl.searchParams.has('testing'); // Check if 'testing=true' is present

            if (isTestingMode) {
                // Ensure rule ID 1 is unique by removing it first before adding
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [1], // Remove any existing rule with ID 1
                    addRules: [{
                        id: 1,
                        priority: 1,
                        action: { type: "block" },
                        condition: {
                            urlFilter: "tags.roberthalf.com",
                            resourceTypes: ["script", "xmlhttprequest"]
                        }
                    }]
                });
            } else {
                // Remove the blocking rule if testing mode is not active
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [1], // Remove rule ID 1 (blocking rule)
                    addRules: []
                });
            }
        } catch (e) {
            console.error("Failed to construct URL:", e.message); // Log the error with more details
        }
    }
});
