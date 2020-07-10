const sharp = require(`sharp`)
const glob = require(`glob`)
const fs = require(`fs-extra`)
const svgtofont = require('svgtofont');

const images = glob.sync(`content/images/**/*.{png,jpg,jpeg}`)
const MAX_WIDTH = 800
const QUALITY = 70

Promise.all(
    images.map(async match => {
        const stream = sharp(match)
        const info = await stream.metadata()
        if (info.width < MAX_WIDTH) {
            return
        }
        const optimizedName = match.replace(
            /(\..+)$/,
            (match, ext) => `-optimized${ext}`
        )
        await stream
            .resize(MAX_WIDTH)
            .jpeg({ quality: QUALITY })
            .toFile(optimizedName) 
        return fs.rename(optimizedName, match)
    })
)

const thumbnails = glob.sync(`content/thumbnails/**/*.{png,jpg,jpeg}`)
const SQUARE = 128

Promise.all(
    thumbnails.map(async match => {
        const stream = sharp(match)
        const info = await stream.metadata()
        if (info.width < MAX_WIDTH) {
            return
        }
        const optimizedName = match.replace(
            /(\..+)$/,
            (match, ext) => `-optimized${ext}`
        )
        await stream
            .resize(SQUARE, SQUARE)
            .jpeg({ quality: QUALITY })
            .toFile(optimizedName)
        return fs.rename(optimizedName, match)
    })
)

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