<template>
  <VDialog :title="messages.dialogTitle" darken>
    <template #activator>
      <VButton>
        <PhShareNetwork v-if="copyStyle === 'sharing'" />
        <PhUserGear v-else-if="copyStyle === 'members'" />
        {{ messages.buttonText }}
      </VButton>
    </template>

    <VCard>
      <VInput
        v-model="searchQuery"
        name="usersearch"
        :label="
          $formatMessage({
            description: 'membership dialog user search label',
            defaultMessage: 'Search for a user',
          })
        "
        :placeholder="
          $formatMessage({
            description: 'membership dialog user search placeholder',
            defaultMessage: 'Search…',
          })
        "
        spread
      />

      <VMenu ref="listContainer">
        <li
          v-for="item in users"
          :key="item.id"
          :class="['menu-item', $style.user]"
        >
          <span class="username">
            <template v-if="item.firstName || item.lastName">
              {{ item.firstName }} {{ item.lastName }}
            </template>
            <template v-else>
              {{ item.username }}
            </template>
          </span>

          <VPopup
            :ref="(ref) => registerChoicePopup(item.id, ref)"
            direction="sw"
          >
            <template #activator>
              <VButton small>
                <template
                  v-if="item.isOwner === true || item.isOwner === false"
                >
                  {{
                    item.isOwner === true
                      ? messages.ownerLabel
                      : messages.memberLabel
                  }}
                  <PhCaretDown class="button-chevron" />
                </template>
                <template v-else>
                  {{
                    $formatMessage({
                      description: 'membership add button',
                      defaultMessage: 'Add',
                    })
                  }}
                </template>
              </VButton>
            </template>
            <VCard>
              <VMenu>
                <VMenuButton
                  :active="item.isOwner === false"
                  @click="setMembership(item.id, false)"
                >
                  {{ messages.memberLabel }}
                </VMenuButton>
                <VMenuButton
                  :active="item.isOwner === true"
                  @click="setMembership(item.id, true)"
                >
                  {{ messages.ownerLabel }}
                </VMenuButton>
                <VMenuButton
                  v-if="item.isOwner !== undefined"
                  @click="removeMembership(item.id)"
                >
                  {{
                    $formatMessage({
                      description: 'membership remove button',
                      defaultMessage: 'Remove',
                    })
                  }}
                </VMenuButton>
              </VMenu>
            </VCard>
          </VPopup>
        </li>
      </VMenu>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { useResult } from '@vue/apollo-composable';
import { PhCaretDown, PhShareNetwork, PhUserGear } from 'phosphor-vue';
import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  onBeforeUpdate,
  PropType,
  ref,
} from 'vue';
import { useIntl } from 'vue-intl';

import {
  MemberUsersInfoFragment,
  useMemberUsersQuery,
  useRemoveMembershipMutation,
  UsernamesFragment,
  useSetMembershipMutation,
  useUserMembershipSearchQuery,
} from '@/graphql';
import {
  VButton,
  VCard,
  VDialog,
  VInput,
  VMenu,
  VMenuButton,
  VPopup,
} from '@/interface';
import { useToasts } from '@/interface/product/app/VApp.vue';

type UserMembershipInfo = UsernamesFragment & {
  isOwner?: boolean;
};

export default defineComponent({
  name: 'MembershipsDialog',

  components: {
    PhCaretDown,
    PhShareNetwork,
    PhUserGear,
    VButton,
    VCard,
    VDialog,
    VInput,
    VMenu,
    VMenuButton,
    VPopup,
  },

  props: {
    hostId: {
      type: String,
      required: true,
    },
    copyStyle: {
      type: String as PropType<'sharing' | 'members'>,
      required: true,
      validator: (value: string) => ['sharing', 'members'].includes(value),
    },
  },

  setup(props) {
    const { showNetworkErrorToast } = useToasts();
    const { formatMessage } = useIntl();

    const messages = computed(() => {
      switch (props.copyStyle) {
        case 'sharing':
          return {
            buttonText: formatMessage({
              description: 'share button text',
              defaultMessage: 'Share',
            }),
            dialogTitle: formatMessage({
              description: 'share dialog title',
              defaultMessage: 'Sharing settings',
            }),
            memberLabel: formatMessage({
              description: 'sharing status label for members',
              defaultMessage: 'Read only',
            }),
            ownerLabel: formatMessage({
              description: 'sharing status label for owners',
              defaultMessage: 'Full access',
            }),
          };
        case 'members':
          return {
            buttonText: formatMessage({
              description: 'membership management button text',
              defaultMessage: 'Manage members',
            }),
            dialogTitle: formatMessage({
              description: 'membership management dialog title',
              defaultMessage: 'Membership settings',
            }),
            memberLabel: formatMessage({
              description: 'membership status label for members',
              defaultMessage: 'Read only',
            }),
            ownerLabel: formatMessage({
              description: 'membership status label for owners',
              defaultMessage: 'Full access',
            }),
          };
        default:
          return {};
      }
    });

    // Mapping to hold refs of the individual user popups so they can be closed
    // later when required.
    let choicePopups: Record<
      string,
      ComponentPublicInstance<typeof VPopup>
    > = {};
    onBeforeUpdate(() => (choicePopups = {}));
    function registerChoicePopup(
      key: string,
      component: ComponentPublicInstance<typeof VPopup>
    ) {
      if (component) {
        choicePopups[key] = component;
      }
    }

    const { result: memberUsersResult } = useMemberUsersQuery(() => ({
      hostId: props.hostId,
    }));
    const memberUsers = useResult(
      memberUsersResult,
      [] as UserMembershipInfo[],
      (data) =>
        (data.node as MemberUsersInfoFragment | null)?.memberUsers?.edges
          ?.filter((edge) => edge !== null && edge.node !== null)
          .map((edge) => ({
            ...edge?.info,
            ...edge?.node,
          })) as UserMembershipInfo[]
    );

    const searchQuery = ref('');
    function clearSearchQuery() {
      searchQuery.value = '';
    }

    const { result: searchUsersResult } = useUserMembershipSearchQuery(
      () => ({
        query: searchQuery.value,
        hostId: props.hostId,
      }),
      () => ({
        enabled: searchQuery.value.length > 0,
      })
    );
    const searchUsers = useResult(
      searchUsersResult,
      [] as UserMembershipInfo[],
      (data) =>
        data.users?.edges
          ?.filter((edge) => edge !== null && edge.node !== null)
          .map((edge) => ({
            ...edge?.node,
            ...edge?.node?.membershipInfo,
          })) as UserMembershipInfo[]
    );

    // Display either the users that are already members or the search query
    // results, if the user has searched.
    const users = computed(() =>
      searchQuery.value.length > 0 ? searchUsers.value : memberUsers.value
    );

    const setMembershipMutation = useSetMembershipMutation({});
    const removeMembershipMutation = useRemoveMembershipMutation({});
    setMembershipMutation.onDone(clearSearchQuery);
    removeMembershipMutation.onDone(clearSearchQuery);

    function handleMutationError() {
      showNetworkErrorToast(
        formatMessage({
          description: 'membership update error',
          defaultMessage:
            "Something went wrong while updating the user's membership status.",
        })
      );
    }
    setMembershipMutation.onError(handleMutationError);
    removeMembershipMutation.onError(handleMutationError);

    function setMembership(subjectId: string, owner: boolean) {
      choicePopups[subjectId]?.close();
      setMembershipMutation.mutate({ hostId: props.hostId, subjectId, owner });
    }
    function removeMembership(subjectId: string) {
      choicePopups[subjectId]?.close();
      removeMembershipMutation.mutate({ hostId: props.hostId, subjectId });
    }

    return {
      messages,
      registerChoicePopup,
      searchQuery,
      users,
      setMembership,
      removeMembership,
    };
  },
});
</script>

<style lang="scss" module>
.user {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > span {
    text-overflow: ellipsis;
  }
}
</style>
