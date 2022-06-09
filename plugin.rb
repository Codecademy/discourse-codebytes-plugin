# frozen_string_literal: true

# name: discourse-codebytes-plugin
# about: Adds executable code blocks
# version: 0.1
# authors: Codecademy
# url: https://github.com/codecademy/discourse-codebytes-plugin
# transpile_js: true

register_asset 'stylesheets/common/code-bytes.scss'

extend_content_security_policy(
  script_src: ['https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js']
)

enabled_site_setting :code_bytes_enabled
