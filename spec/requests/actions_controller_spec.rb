require 'rails_helper'

describe CodeBytes::ActionsController do
  before do
    Jobs.run_immediately!
  end

  it 'can list' do
    sign_in(Fabricate(:user))
    get "/code-bytes/list.json"
    expect(response.status).to eq(200)
  end
end
