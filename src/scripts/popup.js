// Get elements to interact with.
const machineNameInput = document.getElementById('machineName');
const savedMessage = document.getElementById('savedMessage');

// Variables for managing saved message state.
let savedMessageTimer;
let oldMachineName;

/**
 * Get stored machine name from settings, fill the input with
 * it, and store it for later comparison.
 */
chrome.storage.sync.get({
    machineName
}, function (options) {
    if (typeof options.machineName === 'string') {
        oldMachineName = options.machineName;
        machineNameInput.value = options.machineName;
    }
});

/**
 * When user changes value in the input, save the new value to
 * their settings. If it's a new machine name, let them know
 * that it was saved successfully after they've stopped typing
 * for 1 second.
 */
machineNameInput.addEventListener('keyup', () => {
    chrome.storage.sync.set({
        machineName: machineNameInput.value
    }, () => {
        const newMachineName = machineNameInput.value !== oldMachineName;
        const emptyMachineName = machineNameInput.value === '';

        /**
         * If user types another key before timer expires, clear the
         * existing timer so we don't show a premature success message.
         */
        if (savedMessageTimer && newMachineName) {
            window.clearTimeout(savedMessageTimer);
            savedMessage.style.visibility = 'collapse';
        }

        /**
         * Set a new timer after keyup to show user a success message
         * after 1 second.
         */
        savedMessageTimer = setTimeout(() => {
            if (newMachineName && !emptyMachineName) {
                oldMachineName = machineNameInput.value;
                savedMessage.innerText = 'Machine name saved!';
                savedMessage.style.visibility = 'visible';
            } else if (emptyMachineName) {
                savedMessage.innerText = 'Machine name cleared!';
                savedMessage.style.visibility = 'visible';
            }
        }, 1000);
    });
});

