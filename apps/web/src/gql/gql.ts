/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Destination($id: ID!) {\n    destination(id: $id) {\n      id name country summary\n      summaryAttribution { source url license }\n      photos { url alt attribution { author url } }\n      places { id name category address }\n    }\n  }\n": typeof types.DestinationDocument,
    "\n  query Destinations {\n    destinations {\n      id name country summary\n      summaryAttribution { source url license }\n      photos { url alt attribution { author url } }\n    }\n  }\n": typeof types.DestinationsDocument,
    "\n  query FlightOffers($origin: String!, $destination: String!, $date: String!) {\n    flightOffers(origin: $origin, destination: $destination, date: $date) {\n      id stops isSample\n      price { amount currency }\n      segments { from to departsAt arrivesAt carrier flightNumber }\n    }\n  }\n": typeof types.FlightOffersDocument,
};
const documents: Documents = {
    "\n  query Destination($id: ID!) {\n    destination(id: $id) {\n      id name country summary\n      summaryAttribution { source url license }\n      photos { url alt attribution { author url } }\n      places { id name category address }\n    }\n  }\n": types.DestinationDocument,
    "\n  query Destinations {\n    destinations {\n      id name country summary\n      summaryAttribution { source url license }\n      photos { url alt attribution { author url } }\n    }\n  }\n": types.DestinationsDocument,
    "\n  query FlightOffers($origin: String!, $destination: String!, $date: String!) {\n    flightOffers(origin: $origin, destination: $destination, date: $date) {\n      id stops isSample\n      price { amount currency }\n      segments { from to departsAt arrivesAt carrier flightNumber }\n    }\n  }\n": types.FlightOffersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Destination($id: ID!) {\n    destination(id: $id) {\n      id name country summary\n      summaryAttribution { source url license }\n      photos { url alt attribution { author url } }\n      places { id name category address }\n    }\n  }\n"): (typeof documents)["\n  query Destination($id: ID!) {\n    destination(id: $id) {\n      id name country summary\n      summaryAttribution { source url license }\n      photos { url alt attribution { author url } }\n      places { id name category address }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Destinations {\n    destinations {\n      id name country summary\n      summaryAttribution { source url license }\n      photos { url alt attribution { author url } }\n    }\n  }\n"): (typeof documents)["\n  query Destinations {\n    destinations {\n      id name country summary\n      summaryAttribution { source url license }\n      photos { url alt attribution { author url } }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FlightOffers($origin: String!, $destination: String!, $date: String!) {\n    flightOffers(origin: $origin, destination: $destination, date: $date) {\n      id stops isSample\n      price { amount currency }\n      segments { from to departsAt arrivesAt carrier flightNumber }\n    }\n  }\n"): (typeof documents)["\n  query FlightOffers($origin: String!, $destination: String!, $date: String!) {\n    flightOffers(origin: $origin, destination: $destination, date: $date) {\n      id stops isSample\n      price { amount currency }\n      segments { from to departsAt arrivesAt carrier flightNumber }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;