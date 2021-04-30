<h1 align="center">
  CodeBytes Discourse Plugin
</h1>

- [Description](#description)
- [Setup](#setup)
- [Usage](#usage)
- [Developer Guide](#developer-guide)

## Description
![Screen Shot 2021-04-21 at 6 58 14 PM](https://user-images.githubusercontent.com/4821431/115631293-88b08100-a2d3-11eb-84a4-c46a2bbc33c4.png)

## Setup
1. Install the plugin according to this tutorial: https://meta.discourse.org/t/install-a-plugin/19157
2. In admin settings, check that "code bytes enabled" is checked ![Screen Shot 2021-04-21 at 7 06 23 PM](https://user-images.githubusercontent.com/4821431/115631875-aaf6ce80-a2d4-11eb-8d4b-df4ae5a25756.png)
That's it!

## Usage
### Add a CodeByte to a post
#### Using the toolbar button
1. Click the "Create a Codebyte" button in the editor toolbar to insert a new, empty codebyte. ![Screen Shot 2021-04-21 at 7 07 11 PM](https://user-images.githubusercontent.com/4821431/115631952-c6fa7000-a2d4-11eb-9893-b508573a79e8.png)
2. The CodeByte editor will appear in the preview pane. Select the language you would like to use. This will automatically be saved to the markdown editor. ![Screen Shot 2021-04-21 at 7 09 58 PM](https://user-images.githubusercontent.com/4821431/115632170-2b1d3400-a2d5-11eb-899f-5adbc0d3997a.png)
3. You can type your code in the CodeByte editor itself. This allows you to execute your code as you go along, as well as take advantage of features such as autocomplete and syntax highlighting. The code will be auto-saved to markdown after a few seconds of inactivity. You can also click the "Save to post" button to manually save the contents of the CodeByte to markdown. ![Screen Shot 2021-04-21 at 7 11 01 PM](https://user-images.githubusercontent.com/4821431/115632251-52740100-a2d5-11eb-996b-383fc4adfb2c.png)
#### Using markdown
1. If you prefer not to use the editor in the preview pane, you can use markdown directly to create a CodeByte using the [codebyte] tag.
2. Add a `language` attribute to the opening tag, e.g. [codebyte language=python]. The currently supported options are `cpp` (C++), `csharp`, `golang`, `javascript`, `php`, `python`, `ruby`.
3. Type your code in between the opening and closing tags.
4. The opening and closing tags must each be be on their own line with no other text,

## Developer Guide
1. First, set up a local Discourse development environment. See the guide here: https://meta.discourse.org/t/how-do-i-set-up-a-local-discourse-development-environment/182882
2. Clone this repository:
   ```sh
     git clone git@github.com:codecademy/discourse-codebytes-plugin.git
   ```
3. Create a symlink between the CodeBytes plugin code and your Discourse plugin folder. From within your Discourse directory, run:
   ```sh
     cd plugins
     ln -s <path to discourse-code-bytes-plugin>
   ```
   You will have to determine your `<path to discourse-code-bytes-plugin>`. If your discourse-code-bytes-plugin directory is at your root, this will be `~/discourse-codebytes-plugin`
4. Run Discourse. From within your Discourse directory, run:
   ```sh
     bundle exec rails server
   ```
   You should now be able to run Discourse at http://localhost:3000/. Log-in with your admin account.
5. Create a new post. You should see the "Create a Codebyte" button in the editor toolbar.

### Further Resources
- [Beginner's Guide to Creating Discourse Plugins](https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-1/30515)

