require_dependency "code_bytes_constraint"

CodeByte::Engine.routes.draw do
  get "/" => "code_bytes#index", constraints: CodeByteConstraint.new
  get "/actions" => "actions#index", constraints: CodeByteConstraint.new
  get "/actions/:id" => "actions#show", constraints: CodeByteConstraint.new
end
