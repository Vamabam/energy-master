/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMonitoringRecord = /* GraphQL */ `
  subscription OnCreateMonitoringRecord(
    $filter: ModelSubscriptionMonitoringRecordFilterInput
  ) {
    onCreateMonitoringRecord(filter: $filter) {
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
export const onUpdateMonitoringRecord = /* GraphQL */ `
  subscription OnUpdateMonitoringRecord(
    $filter: ModelSubscriptionMonitoringRecordFilterInput
  ) {
    onUpdateMonitoringRecord(filter: $filter) {
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
export const onDeleteMonitoringRecord = /* GraphQL */ `
  subscription OnDeleteMonitoringRecord(
    $filter: ModelSubscriptionMonitoringRecordFilterInput
  ) {
    onDeleteMonitoringRecord(filter: $filter) {
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
