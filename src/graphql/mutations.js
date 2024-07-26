/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const publishMessageToIot = /* GraphQL */ `
  mutation publishMessageToIot(
  $topicName: String!, 
  $message: String!) {
    publishMessageToIot(topicName: $topicName, message: $message)
  }
`;
export const createMonitoringRecord = /* GraphQL */ `
  mutation CreateMonitoringRecord(
    $input: CreateMonitoringRecordInput!
    $condition: ModelMonitoringRecordConditionInput
  ) {
    createMonitoringRecord(input: $input, condition: $condition) {
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
export const updateMonitoringRecord = /* GraphQL */ `
  mutation UpdateMonitoringRecord(
    $input: UpdateMonitoringRecordInput!
    $condition: ModelMonitoringRecordConditionInput
  ) {
    updateMonitoringRecord(input: $input, condition: $condition) {
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
export const deleteMonitoringRecord = /* GraphQL */ `
  mutation DeleteMonitoringRecord(
    $input: DeleteMonitoringRecordInput!
    $condition: ModelMonitoringRecordConditionInput
  ) {
    deleteMonitoringRecord(input: $input, condition: $condition) {
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
