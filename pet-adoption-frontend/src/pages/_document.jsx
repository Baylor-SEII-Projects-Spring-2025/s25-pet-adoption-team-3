/**
 * The _document.js helps to define the markup that surrounds pages. Generally, you don't need to
 * modify this file unless a library you import specifically tells you to put something here.
 */

import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

import {
  DocumentHeadTags,
  documentGetInitialProps,
} from "@mui/material-nextjs/v15-pagesRouter";

export default function Document(props) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
