<h1 align="center">
  CodeBytes Discourse Plug In
</h1>

[Setup Guide](#setup-guide)


[Discourse Docs](#discourse-docs)

## Setup Guide

1. **Update Homebrew and its packages**  
   Before you start, update homebrew and its packages to make sure the following steps all run smoothly.

   ```sh
   brew update
   brew upgrade
   ```

1. **Clone the plug-in repo**  
   Then, you'll need to clone the repo from your root or dev directory, depending on your setup.

   ```sh
   git clone git@github.com:codecademy-engineering/discourse-codebytes-plugin.git
   ```

1. **Setup the Discourse locally**  
   Next, you'll need to install Discourse on your macOS for local development. You will first need to install and/or upgrade several packages to run Discourse locally.

   ### There are two ways of doing this. Choose one.

   **Method One** - Run the Discourse bootsrap [script](https://github.com/techAPJ/install-rails/blob/master/mac).

   ```sh
   bash <(curl -s https://raw.githubusercontent.com/techAPJ/install-rails/master/mac)
   ```

   **Note**: Some versions of macOS (like Big Sur 11.1) may lead to difficulties.  
   For Homebrew related errors, try:

   ```sh
   brew update --verbose
   brew cleanup
   brew doctor
   ```

   **For any others you may have**, please post in the [#reach Slack channel](https://codecademy.slack.com/archives/C0179DHDBST) with a summary of your issue.

   **Method Two** - Read the bootsrap script, and pick the packages you don’t have currently installed.

   If you have worked with the Codecademy monolith repo before, you can probably start with [line 42 of the bootsrap script](https://github.com/techAPJ/install-rails/blob/master/mac#L42). Each subsequent `log_file` line specifies a step you can follow or skip, depending on necessity.

   **Now that you have installed Discourse dependencies via method one **or** two, you can move on to install Discourse itself.**

1. **Clone the Discourse repo**  
   Clone the Discourse repository from your root or dev directory.

   ```sh
    git clone https://github.com/discourse/discourse.git ./discourse
   ```

1. **Boostrap Discourse**  
   Set up the Discourse gems and database.

   ```sh
    cd discourse
    bundle install # install the needed gems
    bundle exec rake db:create
    bundle exec rake db:migrate
    RAILS_ENV=test bundle exec rake db:create db:migrate
   ```

   If you get an error about `postgresql` not running after `bundle exec rake db:create`, try running:

   ```sh
   brew postgresql-upgrade-database
   ```

   If that all works, try running the specs:

   ```sh
    bundle exec rake autospec
   ```

   All the tests should pass.

1. **Symlink the CodeBytes plug-in to the Discourse app**  
   From within your discourse directory (you should already be there), run:

   ```sh
   cd plugins
   ln -s <path to discourse-code-bytes-plugin>
   ```

   You will have to determine your `<path to discourse-code-bytes-plugin>`. If your discourse-code-bytes-plugin directory is at your root, this will be:

   ```sh
   ~/discourse-codebytes-plugin
   ```

1. **Create an admin user**  
   Go up one directory back to discourse:

   ```sh
   cd ..
   ```

   To create a new admin, run the following command:

   ```sh
   RAILS_ENV=development bundle exec rake admin:create
   ```

   Follow the prompts to create an admin account. Your password must have a minimum of 10 characters. **Save your credentials, as you will need them to log-in**.

1. **Run discourse locally**
   ```sh
   bundle exec rails server
   ```
   You should now be able to run Discourse at http://localhost:3000/. Log-in with your admin account.
1. **Create a new post or comment, to see the CodeBytes plugin in the editor toolbar.**
   <img src="https://p82.f1.n0.cdn.getcloudapp.com/items/7Kup0jBo/4ac9701b-6706-445c-b517-b55e467bc49f.gif?source=viewer&v=1e220bfb98758fd5b9e186efa21545bc" height="500"/>
   <img src="https://p82.f1.n0.cdn.getcloudapp.com/items/L1uN76xk/cfddaf1a-e509-4cdc-9633-ada88c733612.png?source=viewer&v=e4ab7fec67566d30fcffa703af3045ee" height="500"/>

### You can now open the CodeBytes repo in your editor, and create a feature branch!



## Adding SVG Icons

1. Copy `SVG` code of the icon you want to add.
1. In `svg-icons/codecademy-icons.svg`, paste the code after the last `</symbol>` tag.
1. Change the opening/closing level `<svg>` tags to `<symbol/>`s - keeping only the `viewBox` attribute.
1. Give the `<Symbol/>` an `id` attribute that will be used to reference the `icon` in the plugin.





## Discourse Docs

#### Best practices and recommendations while building the plugin:
- Disable, or have a clear way of disabling usage analytics
- Watch out for N+1 entries for performance!
- Where possible, prefer to extend functionality rather than override. This allows the functionality to be better compatible with future upgrades and other plugins.
- Where possible, use background jobs and prefer nonblocking calls to keep UI responsive.

### How-to series for creating Discourse plugins:
- [Beginner's Guide to Creating Discourse Plugins - Part 1](https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-1/30515)
- [Beginner's Guide to Creating Discourse Plugins Part 2: Plugin Outlets](https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-2-plugin-outlets/31001)
- [Beginner's Guide to Creating Discourse Plugins Part 3: Custom Settings](https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-3-custom-settings/31115)
- [Beginner's Guide to Creating Discourse Plugins Part 4: Git Setup](https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-4-git-setup/31272)
- [Beginner's Guide to Creating Discourse Plugins Part 5: Admin Interfaces](https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-5-admin-interfaces/31761)
- [Beginner’s Guide to Creating Discourse Plugins Part 6: Acceptance Tests](https://meta.discourse.org/t/beginner-s-guide-to-creating-discourse-plugins-part-6-acceptance-tests/32619)
- [Beginner’s Guide to Creating Discourse Plugins Part 7: Publish your plugin](https://meta.discourse.org/t/beginner-s-guide-to-creating-discourse-plugins-part-7-publish-your-plugin/101636)

As for existing plugins and sample, here are a few you can start out with
- Plugins for updating composer or render specific syntax here:
  - [GitHub - discourse/discourse-checklist: A simple checklist rendering plugin for discourse](https://github.com/discourse/discourse-checklist)
  - [GitHub - discourse/discourse-spoiler-alert: A plugin for discourse to hide spoilers behind the spoiler-alert jQuery plugin](https://github.com/discourse/discourse-spoiler-alert)
- Plugins that queue and run job examples:
  - [GitHub - discourse/discourse-akismet: give spam a whoopin](https://github.com/discourse/discourse-akismet)
