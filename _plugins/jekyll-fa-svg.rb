module Jekyll

    class FontAwesomeSvgItemGenerator < Liquid::Tag
        def initialize(tag_name, faIcon, tokens)
            super
            @fa_icon = faIcon.strip
            # @type = faIcon.split.first.strip
        end

        def render(context)
            unless context.environments.first['page']['fa_svg'].is_a?([]::class)
                context.environments.first['page']['fa_svg'] = []
            end
            context.environments.first['page']['fa_svg'].push(@fa_icon)
            "<svg class=\"icon\"><use xlink:href='##{@fa_icon}'></use></svg>"
        end
    end

    class FontAwesomeSvgGenerator < Liquid::Tag

        def mapper(type)
            {
                "fas" => "solid/",
                "fab" => "brands/",
                "far" => "regular/"
            }[type]
        end

        def filename(icon, type)
            base_directory = __dir__ + "/../assets/fa_svgs/"
            directory = mapper(type)
            base_directory + directory + icon + ".svg"
        end

        def icon_name(icon)
            icon = icon.split(' ').last.split('-')
            icon.shift
            icon = icon.join('-')
            icon
        end

        def render(context)
            unless context.environments.first['page']['fa_svg'].nil?
                context.environments.first['page']['fa_svg'].each do |icon|


                    type = icon.split(' ').first.strip
                    icon = icon.split(' ').last.strip
                    icon_svg_name = icon_name(icon)
                    filename = filename(icon_svg_name, type)

                    puts filename

                    file = File.read(filename)

                    # TODO
                    # Récupérer la valeur path du fichier
                    # Générer le HTML avec la déclaration de l'élément
                    # Render le tout

                    puts file
                end
            end
        end

    end
end

Liquid::Template.register_tag('fa_svg', Jekyll::FontAwesomeSvgItemGenerator)
Liquid::Template.register_tag('fa_svg_generate', Jekyll::FontAwesomeSvgGenerator)
