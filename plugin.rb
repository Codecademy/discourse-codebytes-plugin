# frozen_string_literal: true

# name: CodeBytes
# about: Adds executable code blocks
# version: 0.1
# authors: dougyd92
# url: https://github.com/codecademy-engineering/discourse-codebytes-plugin

register_asset 'stylesheets/common/code-bytes.scss'
register_asset 'stylesheets/desktop/code-bytes.scss', :desktop
register_asset 'stylesheets/mobile/code-bytes.scss', :mobile

enabled_site_setting :code_bytes_enabled

PLUGIN_NAME ||= 'CodeByte'

load File.expand_path('lib/code-bytes/engine.rb', __dir__)

after_initialize do
  # https://github.com/discourse/discourse/blob/master/lib/plugin/instance.rb
end
