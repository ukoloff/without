pckg = require '../../package'

module.exports = """
module Without
  module Rails
    VERSION = #{JSON.stringify pckg.version}
  end
end

"""
