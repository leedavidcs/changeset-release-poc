const { tagReleases } = require("tag-releases");

tagReleases((...args) => {
    console.log("asdf");

    console.log(...args);
});
