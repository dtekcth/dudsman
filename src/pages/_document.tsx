import { css, Global } from '@emotion/react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <Global
            styles={css`
              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-300-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-300-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-300-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-300-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-300-webfont.svg#Museo Sans') format('svg');
                font-weight: normal;
                font-style: normal;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-300italic-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-300italic-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-300italic-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-300italic-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-300italic-webfont.svg#museosansitalic')
                    format('svg');
                font-weight: normal;
                font-style: italic;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-100-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-100-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-100-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-100-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-100-webfont.svg#museosansregular')
                    format('svg');
                font-weight: 100;
                font-style: normal;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-100italic-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-100italic-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-100italic-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-100italic-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-100italic-webfont.svg#museosansitalic')
                    format('svg');
                font-weight: 100;
                font-style: italic;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-300-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-300-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-300-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-300-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-300-webfont.svg#museosansregular')
                    format('svg');
                font-weight: 300;
                font-style: normal;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-300italic-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-300italic-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-300italic-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-300italic-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-300italic-webfont.svg#museosansitalic')
                    format('svg');
                font-weight: 300;
                font-style: italic;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-500-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-500-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-500-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-500-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-500-webfont.svg#museosansregular')
                    format('svg');
                font-weight: 500;
                font-style: normal;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-500italic-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-500italic-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-500italic-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-500italic-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-500italic-webfont.svg#museosansitalic')
                    format('svg');
                font-weight: 500;
                font-style: italic;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-700-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-700-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-700-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-700-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-700-webfont.svg#museosansregular')
                    format('svg');
                font-weight: 700;
                font-style: normal;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-700italic-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-700italic-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-700italic-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-700italic-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-700italic-webfont.svg#museosansitalic')
                    format('svg');
                font-weight: 700;
                font-style: italic;
              }

              @font-face {
                font-family: 'Museo Sans';
                src: url('/static/fonts/museo-sans/museosans-900-webfont.eot'),
                  url('/static/fonts/museo-sans/museosans-900-webfont.eot?#iefix')
                    format('embedded-opentype'),
                  url('/static/fonts/museo-sans/museosans-900-webfont.woff') format('woff'),
                  url('/static/fonts/museo-sans/museosans-900-webfont.ttf') format('truetype'),
                  url('/static/fonts/museo-sans/museosans-900-webfont.svg#museosansregular')
                    format('svg');
                font-weight: 900;
                font-style: normal;
              }

              body {
                font-family: 'Museo Sans';
                user-select: none;

                font-size: 14px;
              }

              html {
                font-size: 100%;
              }

              html,
              body {
                margin: 0;
                height: 100%;
                overflow: hidden;
              }

              .hide-scroll::-webkit-scrollbar {
                display: none;
              }
            `}
          />
          <meta name="theme-color" content="#FA6607" />
        </Head>

        <body tw="bg-dtek">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
