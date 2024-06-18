import Head from "next/head";

const MetaWrapper = ({ title, description, image, url, children }) => {
  return (
    <Head>
      <title>{title ?? "PlexFlix"}</title>
      <meta name='title' content={title} key='title' />
      <meta property='og:title' content={title} key='og_title' />
      <meta
        property='og:image'
        content={image ?? "https://i.imgur.com/bnT3bYL.jpeg"}
        key='og_image'
      />
      <meta name='description' content={description ?? ""} key='description' />
      <meta property='og:description' content={description ?? ""} key='og_description' />
      <meta property='og:url' content={url ?? `${process.env.BUILD_URL}`} key='og_url' />
      <meta property='twitter:title' content={title} key='twitter_title' />
      <meta property='twitter:description' content={description ?? ""} key='twitter_description' />
      <meta
        property='twitter:image'
        content={image ?? "https://i.imgur.com/bnT3bYL.jpeg"}
        key='twitter_image'
      />
      <meta property="og:site_name" content="PlexFlix TMDB Client"></meta>
      {children}
    </Head>
  );
};

export default MetaWrapper;
