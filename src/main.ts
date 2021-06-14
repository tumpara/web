import './registerServiceWorker';

import { DefaultApolloClient } from '@vue/apollo-composable';
import { createApp } from 'vue';

import App from './App.vue';
import apolloClient from './graphql/client';
import router from './router';

createApp(App)
  .use(router)
  .provide(DefaultApolloClient, apolloClient)
  .mount('body');
