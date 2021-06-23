<template>
  <VView color="blue">
    <VSidebar>
      <nav>
        <VSidebarGroup>
          <router-link
            v-slot="{ href, navigate, isExactActive }"
            :to="{ name: 'SettingsProfile' }"
            custom
          >
            <VSidebarLink
              :active="isExactActive"
              :href="href"
              @click="navigate"
            >
              <template #icon><PhUserCircle /></template>
              {{
                $formatMessage({
                  description: 'user account settings navigation',
                  defaultMessage: 'My Account',
                })
              }}
            </VSidebarLink>
          </router-link>
        </VSidebarGroup>

        <VSidebarGroup :heading="managementSidebarHeading">
          <router-link
            v-slot="{ href, navigate, isExactActive }"
            :to="{ name: 'SettingsLibraries' }"
            custom
          >
            <VSidebarLink
              :active="isExactActive"
              :href="href"
              @click="navigate"
            >
              <template #icon><PhStackSimple /></template>
              {{
                $formatMessage({
                  description: 'library management settings navigation',
                  defaultMessage: 'Libraries',
                })
              }}
            </VSidebarLink>
          </router-link>

          <router-link
            v-slot="{ href, navigate, isExactActive }"
            :to="{ name: 'SettingsUsers' }"
            custom
          >
            <VSidebarLink
              :active="isExactActive"
              :href="href"
              @click="navigate"
            >
              <template #icon><PhUsers /></template>
              {{
                $formatMessage({
                  description: 'user management settings navigation',
                  defaultMessage: 'Users',
                })
              }}
            </VSidebarLink>
          </router-link>
        </VSidebarGroup>
      </nav>
    </VSidebar>

    <router-view />
  </VView>
</template>

<script lang="ts">
import { PhStackSimple, PhUserCircle, PhUsers } from 'phosphor-vue';
import { defineComponent } from 'vue';
import { useIntl } from 'vue-intl';

import { VSidebar, VSidebarGroup, VSidebarLink, VView } from '@/interface';

export default defineComponent({
  name: 'Settings',

  components: {
    PhStackSimple,
    PhUserCircle,
    PhUsers,
    VSidebar,
    VSidebarGroup,
    VSidebarLink,
    VView,
  },

  setup() {
    const { formatMessage } = useIntl();

    const managementSidebarHeading = formatMessage({
      description: 'settings sidebar management heading',
      defaultMessage: 'Management',
    });

    return { managementSidebarHeading };
  },
});
</script>
