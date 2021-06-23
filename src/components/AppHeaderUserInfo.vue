<template>
  <VPopup direction="sw">
    <template #activator>
      <summary v-if="user?.firstName || user?.lastName" :class="$style.summary">
        {{ user.firstName }} {{ user.lastName }}
      </summary>
      <summary v-else-if="user" :class="[$style.summary, $style.nameless]">
        {{ user.username }}
      </summary>
      <summary v-else :class="[$style.summary, $style.nameless]">
        {{
          $formatMessage({
            description: 'unauthenticated message',
            defaultMessage: 'Not logged in',
          })
        }}
      </summary>
    </template>

    <VCard v-if="user">
      <VMenu>
        <router-link
          v-slot="{ href, navigate }"
          :to="{ name: 'SettingsProfile' }"
          custom
        >
          <VMenuLink :href="href" @click="navigate">
            <PhUserCircle />
            {{
              $formatMessage({
                description: 'user account settings navigation',
                defaultMessage: 'My Account',
              })
            }}
          </VMenuLink>
        </router-link>

        <VMenuLink href="/admin/logout/?next=/">
          <PhSignOut />
          {{
            $formatMessage({
              description: 'sign out link',
              defaultMessage: 'Sign out',
            })
          }}
        </VMenuLink>
      </VMenu>
    </VCard>

    <VCard v-else content>
      <p class="hint">
        {{
          $formatMessage({
            description: 'unauthenticated details text',
            defaultMessage:
              'You are currently not logged in and can therefore only see public items. If you have an account on this server, sign in to view your content.',
          })
        }}
      </p>

      <VMenu>
        <VMenuLink :href="loginUrl">
          <PhSignIn />
          {{
            $formatMessage({
              description: 'sign in link',
              defaultMessage: 'Sign in',
            })
          }}
        </VMenuLink>
      </VMenu>
    </VCard>
  </VPopup>
</template>

<script lang="ts">
import { useResult } from '@vue/apollo-composable';
import { PhSignIn, PhSignOut, PhUserCircle } from 'phosphor-vue';
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import { useCurrentUserInformationQuery } from '@/graphql';
import { VCard, VMenu, VMenuLink, VPopup } from '@/interface';

export default defineComponent({
  name: 'AppHeaderUserInfo',

  components: {
    PhSignIn,
    PhSignOut,
    PhUserCircle,
    VCard,
    VMenu,
    VMenuLink,
    VPopup,
  },

  setup() {
    const userInformationQuery = useCurrentUserInformationQuery();
    const user = useResult(
      userInformationQuery.result,
      null,
      (data) => data.me || null
    );

    const route = useRoute();
    const loginUrl = computed(() => {
      return `/admin/login/?next=${encodeURIComponent(route.fullPath)}`;
    });

    return { user, loginUrl };
  },
});
</script>

<style lang="scss" module>
.summary {
  display: inline-block;
  color: var(--inverse-fg-color);
  cursor: pointer;
}

.nameless {
  font-style: italic;
}
</style>
