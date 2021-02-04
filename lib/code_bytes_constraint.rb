class CodeByteConstraint
  def matches?(request)
    SiteSetting.code_bytes_enabled
  end
end
