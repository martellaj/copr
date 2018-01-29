# COPR (Canned OWA PRs)

    Enhancing your development experience by making your PRs a little simpler.
<center><img src="https://media.giphy.com/media/10nMEclFWTPCp2/giphy.gif"></center>

This is a Chrome extension I wrote after I found myself doing the same thing and typing the same thing every time I created a PR at work (I work on Outlook.com, thus "OWA").

- I link a VSTS work item to the PR.
- I add some simple Markdown to the description that includes:
  - A link to the work item
  - A deploy URL for my changes
  - A list of code changes

So instead of doing this manually, I created this extension to do all of the above with a click of a button.

## To use this extension
1. Add it to Chrome (if anyone wants a different browser, I can make it available).
2. Add your machine name in the extension's popup (this is to create the deploy URL).
3. Click the "Stop in the name of helpful PR descriptions!" link on the page to create a new PR.

*NOTE: The work item the PR is addressing must be in the name of your branch for the extension to work properly, i.e. joem/foo-123456 where 123456 is the work item number.*

## Development
- This project started from [EmailThis' extension-boilerplate](https://github.com/EmailThis/extension-boilerplate) project. It makes creating Chrome extensions super easy.
- For instructions on how to build and run this project, please refer to their README.