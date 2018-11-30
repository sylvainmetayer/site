document.addEventListener("scroll", function () {
    var scrollTop = document.documentElement["scrollTop"] || document.body["scrollTop"];
    var scrollBottom = (document.documentElement["scrollHeight"] ||
        document.body["scrollHeight"]) - document.documentElement.clientHeight;
    scrollPercent = scrollTop / scrollBottom * 100 + "%";
    document
        .getElementById("progress-bar")
        .style.setProperty("--scroll", scrollPercent);
}, { passive: true });
