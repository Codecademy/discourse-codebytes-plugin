# frozen_string_literal: true

# name: CodeBytes
# about: Adds executable code blocks
# version: 0.1
# authors: dougyd92
# url: https://github.com/codecademy-engineering/discourse-codebytes-plugin

register_asset 'stylesheets/common/code-bytes.scss'

extend_content_security_policy(
  script_src: ['https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js']
)

enabled_site_setting :code_bytes_enabled

PLUGIN_NAME ||= 'CodeByte'

load File.expand_path('lib/code-bytes/engine.rb', __dir__)

after_initialize do
  # https://github.com/discourse/discourse/blob/master/lib/plugin/instance.rb
end
