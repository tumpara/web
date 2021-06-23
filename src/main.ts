import './registerServiceWorker';

import { DefaultApolloClient } from '@vue/apollo-composable';
import { createApp } from 'vue';

import App from './App.vue';
import apolloClient from './graphql/client';
import intl from './intl';
import router from './router';

createApp(App)
  .use(router)
  .use(intl)
  .provide(DefaultApolloClient, apolloClient)
  .mount('body');
