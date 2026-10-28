<?xml version="1.0" encoding="utf-8"?>
<!-- Shows the Atom feeds (/feed.xml, /en/feed.xml) as a page when opened in a
     browser. Feed readers ignore it. The language comes from the feed's xml:lang. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="utf-8" indent="yes"/>

  <xsl:variable name="en" select="/atom:feed/@xml:lang = 'en'"/>

  <xsl:template match="/atom:feed">
    <html lang="{@xml:lang}">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="robots" content="noindex"/>
        <title><xsl:value-of select="atom:title"/> · RSS</title>
        <style>
          :root { color-scheme: dark light; --bg: #0e1621; --fg: #dbe3ec; --muted: #8a9cb0; --line: #213148; --accent: #62acff; }
          @media (prefers-color-scheme: light) { :root { --bg: #f6f8fb; --fg: #14233a; --muted: #56667c; --line: #d5dde8; --accent: #1c5db3; } }
          body { margin: 0; padding: 2rem 1rem; background: var(--bg); color: var(--fg); font: 1rem/1.6 system-ui, sans-serif; }
          main { max-width: 44rem; margin: 0 auto; }
          a { color: var(--accent); }
          .note { padding: 0.8rem 1rem; border: 1px dashed var(--line); border-radius: 4px; }
          code { font-family: ui-monospace, monospace; word-break: break-all; }
          ol { padding: 0; list-style: none; }
          li { padding: 1rem 0; border-bottom: 1px solid var(--line); }
          h2 { margin: 0; font-size: 1.1rem; }
          time, .muted { color: var(--muted); font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <main>
          <xsl:choose>
            <xsl:when test="$en">
              <p class="note">This is an <strong>RSS feed</strong>. Copy its address into a feed reader to follow new articles: <code><xsl:value-of select="atom:link[@rel='self']/@href"/></code></p>
            </xsl:when>
            <xsl:otherwise>
              <p class="note">Ceci est un <strong>flux RSS</strong>. Copiez son adresse dans un lecteur de flux pour suivre les nouveaux articles : <code><xsl:value-of select="atom:link[@rel='self']/@href"/></code></p>
            </xsl:otherwise>
          </xsl:choose>
          <h1><a href="{atom:link[not(@rel)]/@href}"><xsl:value-of select="atom:title"/></a></h1>
          <p class="muted"><xsl:value-of select="atom:subtitle"/></p>
          <ol>
            <xsl:for-each select="atom:entry">
              <li>
                <h2><a href="{atom:link/@href}"><xsl:value-of select="atom:title"/></a></h2>
                <time datetime="{atom:published}"><xsl:value-of select="substring(atom:published, 1, 10)"/></time>
              </li>
            </xsl:for-each>
          </ol>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
