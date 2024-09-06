document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleButton');
    const currentStatusText = document.getElementById('currentStatusText');
    const currentUrlText = document.getElementById('currentUrl');
    const blockMessage = document.getElementById('blockMessage');

    // Function to update the button text, color, and status inside details section
    function updateUI(isTestingMode, currentUrl) {
        currentUrlText.textContent = currentUrl; // Update the displayed URL

        if (isTestingMode) {
            toggleButton.textContent = 'Stop Testing';
            toggleButton.classList.remove('start');
            toggleButton.classList.add('stop');
            currentStatusText.textContent = 'Testing is running...';
            blockMessage.style.display = 'block'; // Show block message
        } else {
            toggleButton.textContent = 'Start Testing';
            toggleButton.classList.remove('stop');
            toggleButton.classList.add('start');
            currentStatusText.textContent = 'Testing is turned off';
            blockMessage.style.display = 'none'; // Hide block message
        }
    }

    // Initially update the UI based on the current URL's query parameters
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentUrl = new URL(tabs[0].url);
        const isTestingMode = currentUrl.searchParams.has('testing');
        updateUI(isTestingMode, tabs[0].url);
    });

    // Handle button click and toggle testing mode
    toggleButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentUrl = new URL(tabs[0].url);
            const isTestingMode = currentUrl.searchParams.has('testing');

            // Toggle the testing mode
            chrome.runtime.sendMessage({ action: "toggleTesting", tabId: tabs[0].id }, function (response) {
                // Check for any runtime errors in message passing
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                } else {
                    // Update the UI after toggling the testing mode
                    updateUI(!isTestingMode, tabs[0].url);
                }
            });

        });
    });
});
