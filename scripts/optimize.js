const svgtofont = require('svgtofont');

const toSVG = (dir, out, fontname) => {
    svgtofont({
        src: dir, // svg path
        dist: out, // output path
        fontName: fontname, // font name
        css: true, // Create CSS files.
    }).then(() => {
        console.log('done!');
    });
}

toSVG("./svg", "./src/styles", "gitdig")