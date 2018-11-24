# Plugin to add environment variables to the `site` object in Liquid templates

module Jekyll

    # Used to get Netlify preview URL
    class EnvironmentVariablesGenerator < Generator
  
      def generate(site)
        puts "TEST"
        puts ENV["IS_NETLIFY"]
        puts ENV['DEPLOY_URL']
        puts "END TEST"
        if ENV["IS_NETLIFY"]
            site.config['url'] = ENV['DEPLOY_URL'].dup.chomp!("/")
            puts "URL is now " + site.config['url']
        end
      end
  
    end
  
  end