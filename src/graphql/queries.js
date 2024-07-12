/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPwrRecord = /* GraphQL */ `
  query GetPwrRecord($id: ID!) {
    getPwrRecord(id: $id) {
      id
      device_id
      Irms
      Vrms
      Power
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPwrRecords = /* GraphQL */ `
  query ListPwrRecords(
    $filter: ModelPwrRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPwrRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        device_id
        Irms
        Vrms
        Power
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
