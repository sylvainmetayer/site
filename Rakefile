abort('Please run this using `bundle exec rake`') unless ENV["BUNDLE_BIN_PATH"]
require 'html-proofer'

task :test do
  sh "bundle exec jekyll build"
  options = { :assume_extension => true, :href_ignore=> ['http://localhost:4000'], :verbose => true }
  HTMLProofer.check_directory("./_site", options).run
end

task :default => [:test]