/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMonitoringRecord = /* GraphQL */ `
  query GetMonitoringRecord($id: ID!) {
    getMonitoringRecord(id: $id) {
      id
      device_id
      Irms
      Vrms
      Power
      dataTime
      plugStatus
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listMonitoringRecords = /* GraphQL */ `
  query ListMonitoringRecords(
    $filter: ModelMonitoringRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMonitoringRecords(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        device_id
        Irms
        Vrms
        Power
        dataTime
        plugStatus
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listPwrData = /* GraphQL */ `
  query ListMonitoringRecords(
    $filter: ModelMonitoringRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMonitoringRecords(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        device_id
        Power
        dataTime
      }
      nextToken
      __typename
    }
  }
`;