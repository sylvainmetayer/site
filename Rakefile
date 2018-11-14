abort('Please run this using `bundle exec rake`') unless ENV["BUNDLE_BIN_PATH"]
require 'html-proofer'

options = { 
  :assume_extension => true, 
  :href_ignore=> ['http://localhost:4000'],
  :verbose => true,
  :check_opengraph => true,
  :check_html => true,
  :check_favicon => true,
  :typhoeus => {
      :ssl_verifyhost => 0
  },
  # Because their is authwall 
  :url_ignore => ["http://linkedin.com/in/sylvainmetayer"]
}

task :test do
  sh "bundle exec jekyll build --config _config.yml,_config-dev.yml"
  HTMLProofer.check_directory("./_site", options).run
end

task :ci do
  HTMLProofer.check_directory("./_site", options).run
end

task :default => [:test]