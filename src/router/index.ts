import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/ui',
    name: 'Ui',
    component: () => import(/* webpackChunkName: "ui" */ '../views/Ui.vue'),
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () =>
      import(/* webpackChunkName: "timeline" */ '../views/Timeline.vue'),
    children: [
      {
        path: '',
        name: 'TimelineMain',
        component: () =>
          import(
            /* webpackChunkName: "timeline" */ '../views/TimelineMain.vue'
          ),
      },
      {
        path: 'archive',
        name: 'TimelineArchive',
        component: () =>
          import(
            /* webpackChunkName: "timeline" */ '../views/TimelineArchive.vue'
          ),
      },
      {
        path: 'search',
        name: 'TimelineSearch',
        component: () =>
          import(
            /* webpackChunkName: "timeline" */ '../views/TimelineSearch.vue'
          ),
      },
      {
        path: 'albums',
        name: 'TimelineAlbumManager',
        component: () =>
          import(
            /* webpackChunkName: "timeline-album" */ '../views/TimelineAlbumManager.vue'
          ),
      },
      {
        path: 'album/:id',
        name: 'TimelineAlbumDetails',
        component: () =>
          import(
            /* webpackChunkName: "timeline-album" */ '../views/TimelineAlbumDetails.vue'
          ),
      },
    ],
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(/* webpackChunkName: "settings" */ '../views/Settings.vue'),
    children: [
      {
        path: 'profile',
        name: 'SettingsProfile',
        component: () =>
          import(
            /* webpackChunkName: "settings" */ '../views/SettingsDjangoLink.vue'
          ),
      },
      {
        path: 'libraries',
        name: 'SettingsLibraries',
        component: () =>
          import(
            /* webpackChunkName: "settings" */ '../views/SettingsLibraries.vue'
          ),
      },
      {
        path: 'users',
        name: 'SettingsUsers',
        component: () =>
          import(
            /* webpackChunkName: "settings" */ '../views/SettingsDjangoLink.vue'
          ),
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
