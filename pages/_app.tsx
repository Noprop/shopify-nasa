import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/dist/styles.css';
import '../styles/main.css';

export default class WrappedApp extends App {
  render() {
    const {Component, pageProps} = this.props;

    return (
      <AppProvider i18n={enTranslations}>
        <Head>
          <title>Spacestagram</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Component {...pageProps} />
      </AppProvider>
    );
  }
}