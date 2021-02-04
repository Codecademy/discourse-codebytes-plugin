module CodeByte
  class Engine < ::Rails::Engine
    engine_name "CodeByte".freeze
    isolate_namespace CodeByte

    config.after_initialize do
      Discourse::Application.routes.append do
        mount ::CodeByte::Engine, at: "/code-bytes"
      end
    end
  end
end
