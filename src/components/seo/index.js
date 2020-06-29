import React from "react";
import { Helmet } from "react-helmet";
import urljoin from "url-join";
import moment from "moment";
import { useConfigs } from "../../hooks";


export function SEO({ keywords, postNode, postPath, postSEO }) {
    let title;
    let description;
    let imageURI;
    let postURL;
    const config = useConfigs()
    console.log(config)
    title = config.title;
    description = config.description;
    imageURI = config.image;
    if (postSEO) {
        const postMeta = postNode.frontmatter;
        ({ title } = postMeta);
        description = postMeta.description
            ? postMeta.description
            : postNode.excerpt;
        if (postMeta.image && postMeta.image.length > 0) {
            imageURI = postMeta.image;
        }
        postURL = urljoin(config.url, config.prefix, postPath);
    }

    const getImagePath = () => {
        if (
            !imageURI.match(
                `(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]`
            )
        )
            return urljoin(config.url, config.prefix, imageURI);

        return imageURI;
    };

    const getPublicationDate = (node) => {
        if (!node) return null;

        if (!node.frontmatter) return null;

        if (!node.frontmatter.date) return null;

        return moment(node.frontmatter.date, config.dateFromFormat).toDate();
    };

    let image = getImagePath();
    const datePublished = getPublicationDate(postNode);

    const authorJSONLD = {
        "@type": "Person",
        name: config.creator.name,
        email: config.creator.email,
        address: config.creator.location,
    };

    const logoJSONLD = {
        "@type": "ImageObject",
        url: getImagePath(config.image),
    };

    const blogURL = urljoin(config.url, config.prefix)
    const schemaOrgJSONLD = [
        {
            "@context": "http://schema.org",
            "@type": "WebSite",
            url: blogURL,
            name: title,
            alternateName: config.titleAlt ? config.titleAlt : "",
        },
    ];

    if (postSEO) {
        schemaOrgJSONLD.push(
            {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        item: {
                            "@id": postURL,
                            name: title,
                            image,
                        },
                    },
                ],
            },
            {
                "@context": "http://schema.org",
                "@type": "BlogPosting",
                url: blogURL,
                name: title,
                alternateName: config.titleAlt ? config.titleAlt : "",
                headline: title,
                image: { "@type": "ImageObject", url: image },
                author: authorJSONLD,
                publisher: {
                    ...authorJSONLD,
                    "@type": "Organization",
                    logo: logoJSONLD,
                },
                datePublished,
                description,
            }
        );
    }
    return (
        <Helmet>
            {/* General tags */}
            {keywords &&
                <meta name="keywords" content={keywords.join(",")} />
            }
            <meta name="description" content={description} />
            <meta name="image" content={image} />

            {/* Schema.org tags */}
            <script type="application/ld+json">
                {JSON.stringify(schemaOrgJSONLD)}
            </script>

            {/* OpenGraph tags */}
            <meta property="og:url" content={postSEO ? postURL : blogURL} />
            {postSEO ? <meta property="og:type" content="article" /> : null}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content={postSEO ? 'summary_large_image' : 'summary'} />
            <meta
                name="twitter:creator"
                content={config.twitter ? config.twitter : ""}
            />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
