/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPwrRecord = /* GraphQL */ `
  mutation CreatePwrRecord(
    $input: CreatePwrRecordInput!
    $condition: ModelPwrRecordConditionInput
  ) {
    createPwrRecord(input: $input, condition: $condition) {
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
export const updatePwrRecord = /* GraphQL */ `
  mutation UpdatePwrRecord(
    $input: UpdatePwrRecordInput!
    $condition: ModelPwrRecordConditionInput
  ) {
    updatePwrRecord(input: $input, condition: $condition) {
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
export const deletePwrRecord = /* GraphQL */ `
  mutation DeletePwrRecord(
    $input: DeletePwrRecordInput!
    $condition: ModelPwrRecordConditionInput
  ) {
    deletePwrRecord(input: $input, condition: $condition) {
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
