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

        let description = '**Links**\n';
        description += `- #${workItemNumber}\n`;
        description += '- [Deploy URL]()\n\n'
        description += '**Changes**\n';
        description += '- Changes a thing to make OWA better';

        descriptionBox.value = description;
        descriptionBox.focus();
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
        }, 500);
    };
})();