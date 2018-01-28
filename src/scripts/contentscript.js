(function() {
    const intervalId = setInterval(() => {
        const descriptionContainer = document.getElementsByClassName('vc-pullRequestCreate-description-container')[0];

        if (descriptionContainer) {
            // Add element for user to interact with.
            addAnchorToDom(descriptionContainer);

            // Clear interval because we only need this to run once.
            window.clearInterval(intervalId);
        }
    }, 500);

    /**
     * Adds element for user to interact with to the DOM.
     */
    const addAnchorToDom = (descriptionContainer) => {
        const anchor = document.createElement('a');

        anchor.innerText = 'Prepare PR';
        anchor.onclick = onClick;

        descriptionContainer.insertAdjacentElement('afterbegin', anchor);
    };

    /**
     * Handles clicks on the programmtically inserted element (i.e. does
     * all the work).
     */
    const onClick = () => {
        const container = document.getElementsByClassName('vc-pullRequestCreate-branches-container')[0];
        const branchName = container.getElementsByClassName('selected-item-text')[0].innerText;

        // Get work item number.
        const workItemNumber = getWorkItemNumber(branchName);

        // Selects work item for PR, and supplies function to do next.
        addWorkItem(workItemNumber, fillDescription);
    };

    /**
     * Given a string name with parts separated by "-" (i.e. joem/foo-123),
     * this function returns the work item number (i.e. 123).
     * @param {string} branchName
     */
    const getWorkItemNumber = (branchName) => {
        const branchParts = branchName.split('-');

        for (let part of branchParts) {
            const converted = Number(part);

            if (!isNaN(converted)) {
                return converted;
            }
        }
    };

    /**
     * Fills description box with work item link, deploy URL, and placeholder
     * for changelist.
     * @param {number} workItemNumber
     */
    const fillDescription = (workItemNumber) => {
        const descriptionBox = document.getElementById('description-edit');

        chrome.storage.sync.get('machineName', function (options) {
            /**
             * Default the "Deploy URL" part of the description to a dummy value that
             * tells user to fill out machine name in the popup to generate it next time,
             * since the machine name is required. If we have a machine name value from
             * options, override the dummy string with the actual deploy URL.
             */
            let deployUrlString = `- [Deploy URL](Add a machine name in the extension's popup so this gets filled out!)\n\n`;
            if (typeof options.machineName === 'string' && options.machineName !== '') {
                // Get full branch name, then replace forward slashes with hyphens.
                const container = document.getElementsByClassName('vc-pullRequestCreate-branches-container')[0];
                const branchName = container.getElementsByClassName('selected-item-text')[0].innerText;
                const modifiedBranchName = branchName.replace(/\//g, '-');

                deployUrlString = `- [Deploy URL](https://outlook-sdf.office.com/mail/?branch=${options.machineName}-${modifiedBranchName})\n\n`;
            }

            // Build the description text.
            let description = '**Links**\n';
            description += `- #${workItemNumber}\n`;
            description += deployUrlString;
            description += '**Changes**\n';
            description += '- Changes a thing to make OWA better';

            /**
             * Set the textarea's value to the description text, and then it so
             * user's cursor ends up there.
             */
            descriptionBox.value = description;
            descriptionBox.focus();
        });
    };

    /**
     * Adds the work item to the PR.
     * @param {number} workItemNumber
     */
    const addWorkItem = async (workItemNumber, next) => {
        /**
         * Input work item number into "Work Items" input and click to fetch
         * work item suggestions.
         */
        const input = document.getElementsByClassName('vc-pullrequest-view-details-relatedartifacts-addartifactbox')[0];
        input.value = workItemNumber;
        input.click();

        /**
         * Give a little time for results to populate, and then select the
         * first one.
         */
        setTimeout(() => {
            // Select top suggestion.
            const suggestionsContainer = document.getElementsByClassName('vc-pullrequest-view-details-relatedartifacts-addartifactbox-container')[0];
            const suggestion = suggestionsContainer.getElementsByTagName('li')[0];
            suggestion.click();

            // Clear input.
            input.value = '';

            /**
             * Calls "next", which is "fillDescription".
             * NOTE: Did it this way so focus ends up in description box!
             */
            next(workItemNumber);
        }, 1000);
    };
})();