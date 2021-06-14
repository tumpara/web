import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import { relayStylePagination } from '@apollo/client/utilities';

import generatedIntrospection from './fragmentTypes.json';

const link = createHttpLink({
  uri: '/api/graphql',
});

const cache = new InMemoryCache({
  possibleTypes: generatedIntrospection.possibleTypes,

  typePolicies: {
    Query: {
      fields: {
        timeline: {
          merge: true,
        },
        timelineAlbums: relayStylePagination(['filters']),
      },
    },
    TimelineView: {
      fields: {
        entries: {
          keyArgs: false,
          merge(existing, incoming, { mergeObjects }) {
            interface FakeEdge {
              __typename: 'TimelineEntryEdge';
              index: number;
              node: unknown | null;
              // This is to satisfy typescript
              __ref: '?';
            }

            const edges: FakeEdge[] = [...(existing?.edges || [])];

            (incoming.edges || []).forEach((edge: FakeEdge) => {
              if (!edge?.node) {
                return;
              }

              // Check if the edge needs to go all the way to the back because
              // then we can skip iterating.
              if (!edges.length || edges[edges.length - 1].index < edge.index) {
                edges.push(edge);
                return;
              }

              for (let i = 0; i < edges.length; i++) {
                if (edges[i].index == edge.index) {
                  // The edge is already on record, merge them.
                  edges[i] = mergeObjects(edges[i], edge);
                  return;
                } else if (edges[i].index > edge.index) {
                  // The edge is new, so it is inserted into place so that the
                  // whole thing is always sorted by ascending index.
                  edges.splice(i, 0, edge);
                  return;
                }
              }
              // If we still haven't found a place for the new edge, it needs
              // to go to the end.
              edges.push(edge);
            });

            return {
              __typename: 'TimelineEntryConnection',
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null,
              },
              edges,
            };
          },
        },
      },
    },
  },
});

export default new ApolloClient({
  link,
  cache,
});
