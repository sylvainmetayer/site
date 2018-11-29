module Jekyll

    class FontAwesomeIcon
        # faX.fa-dev
        def initialize(icon)
            @icon = icon
        end

        def mapper(type)
            {
                "fas" => "solid",
                "fab" => "brands",
                "far" => "regular"
            }[type]
        end

        # fa-dev
        def to_icon_name
            icon = @icon.split('.').last.split('-')
            icon.shift
            icon.join('-')
        end

        # solid / brands / regular
        def to_brand_name
            mapper(to_brand_code)
        end

        # fab / far / fas
        def to_brand_code
            @icon.split('.').first.strip
        end

        # absolute path to file
        def to_filename
            base_directory = __dir__ + "/../assets/fa_svgs/"
            base_directory + to_brand_name + "/" + to_icon_name + ".svg"
        end

        def to_svg_html
            file = File.read(to_filename)
            svg_html = /^.*path d="(.*)" ?\/>.*$/.match(file).captures.first
            "<symbol id='#{@icon}' viewBox='0 0 1024 1024'>
                <title>#{to_icon_name}</title>
                <path class='path1' d='#{svg_html}'></path>
            </symbol>
            "
        end

        def value
            @icon
        end

    end

    class FontAwesomeSvgItemGenerator < Liquid::Tag
        def initialize(tag_name, faIcon, tokens)
            super
            @icon = FontAwesomeIcon.new(faIcon.strip)
        end

        def render(context)
            unless context.environments.first['page']['fa_svg'].is_a?([]::class)
                context.environments.first['page']['fa_svg'] = []
            end
            context.environments.first['page']['fa_svg'].push(@icon.value)
            "<svg class=\"icon\"><use xlink:href='##{@icon.value}'></use></svg>"
        end
    end

    class FontAwesomeSvgGenerator < Liquid::Tag

        def render(context)
            output = nil
            unless context.environments.first['page']['fa_svg'].nil?
                output = '
                <svg display="none" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <defs>
                    <!--
                    Font Awesome Free 5.5.0 by @fontawesome - https://fontawesome.com
                    License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
                    -->
                '

                context.environments.first['page']['fa_svg'].each do |icon|
                    fa_icon = FontAwesomeIcon.new(icon)
                    output += fa_icon.to_svg_html
                end

                output += '
                    </defs>
                </svg>
                '
            end

            unless output.nil?
                output
            end
        end


    end
end

Liquid::Template.register_tag('fa_svg', Jekyll::FontAwesomeSvgItemGenerator)
Liquid::Template.register_tag('fa_svg_generate', Jekyll::FontAwesomeSvgGenerator)
