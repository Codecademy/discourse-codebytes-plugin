module CodeByte
  class CodeByteController < ::ApplicationController
    requires_plugin CodeByte

    before_action :ensure_logged_in

    def index
    end
  end
end
