(function () {
    // Inject pageScript.js into the page context
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('pageScript.js');
    (document.head || document.documentElement).appendChild(script);

    // Listen for messages from the page context
    window.addEventListener("message", function (event) {
        if (event.source != window) return;
        if (event.data.type && event.data.type == "FROM_PAGE") {
            console.log("Content script received:", event.data);
            // Handle messages from pageScript here if needed
        }
    }, false);
})();

chrome.runtime.sendMessage({ action: "checkTestingMode" });
