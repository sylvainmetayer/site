const fs = require('fs');

module.exports = {
  callbacks: {
    ready: function (err, browserSync) {
      const content_404 = fs.readFileSync("dist/404.html");
      browserSync.addMiddleware('*', (req, res) => {
        // Provides the 404 content without redirect.
        res.writeHead(404);
        res.write(content_404);
        res.end();
      });
    }
  }
};
