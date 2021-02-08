<h1 align="center">
  CodeBytes Discourse Plug In
</h1>


## 🚀 Setup Guide

1.  **Clone the plug-in repo**  
    First, you'll need to clone the repo.

    ```sh
    cd your/dev/path
    git clone git@github.com:codecademy-engineering/discourse-codebytes-plugin.git
    ```

1. **Setup the Discourse locally**  
    Next, you'll need to install Discourse on your macOS for local development. You will first need to install and/or upgrade several packages to run Discourse locally.

    ### There are two ways of doing this. Choose one.
    **Method One** - Run the Discourse bootsrap [script](https://github.com/techAPJ/install-rails/blob/master/mac).  
    
    1. 
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
   Clone the Discourse repository.
   ```sh
    cd your/dev/path/folder
    git clone https://github.com/discourse/discourse.git ./discourse
    ```

1. **Boostrap Discourse**  
   Clone the Discourse repository.
   ```sh
    cd discourse
    bundle install # install the needed gems
    bundle exec rake db:create
    bundle exec rake db:migrate
    RAILS_ENV=test bundle exec rake db:create db:migrate
    ```
   Try running the specs:
   ```sh
    bundle exec rake autospec
    ```
   All the tests should pass.

1. **Symlink the CodeBytes plug-in to the Discourse app**
   cd your/dev/path/folder
   cd discourse
   cd plugins
   ln -s path/to/discourse-code-bytes-plugin

1. **Create an admin user**
   To create a new admin, run the following command:
    ```sh
    RAILS_ENV=development bundle exec rake admin:create
    ```
    Follow the prompts to create an admin account. **Save your credentials, as you will need them to log-in**.

1. **Run discourse locally**
    ```sh
    bundle exec rails server
    ```
    You should now be able to run Discourse at http://localhost:3000/. Log-in with your admin account.
    
1. **Create a new post or comment, to see the CodeBytes plugin in the editor toolbar.
   <img src="https://p82.f1.n0.cdn.getcloudapp.com/items/7Kup0jBo/4ac9701b-6706-445c-b517-b55e467bc49f.gif?source=viewer&v=1e220bfb98758fd5b9e186efa21545bc" height="500"/>
   <img src="https://p82.f1.n0.cdn.getcloudapp.com/items/L1uN76xk/cfddaf1a-e509-4cdc-9633-ada88c733612.png?source=viewer&v=e4ab7fec67566d30fcffa703af3045ee" height="500"/>

You can now open the CodeBytes repo in your editor, and create a feature branch!
   
