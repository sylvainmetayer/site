# Plugin to add environment variables to the `site` object in Liquid templates

module Jekyll

    # Used to get Netlify preview URL
    class EnvironmentVariablesGenerator < Generator
  
      def generate(site)
        if ENV["IS_NETLIFY"]
            site.config['url'] = ENV['DEPLOY_PRIME_URL']
            puts "URL is now " + site.config['url']
        end
      end
  
    end
  
  end