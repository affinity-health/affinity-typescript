/**
 * The public name of every operation is kept in one explicit table.  The
 * generator derives request details from OpenAPI, but never guesses where an
 * operation belongs or what it should be called.
 */
export const facadeOperationMap = {
  getAccount: { resource: "account", method: "retrieve" },
  getApiAccess: { resource: "apiKeys", method: "retrieve" },
  listCatalogItems: { resource: "catalog", method: "list" },
  retrievePrescribingOptions: { resource: "catalog", method: "retrievePrescribingOptions" },
  listPharmacies: { resource: "catalog", method: "listPharmacies" },
  listShippingOptions: { resource: "catalog", method: "listShippingOptions" },
  archivePracticeLocation: { resource: "locations", method: "archive" },
  createPracticeLocation: { resource: "locations", method: "create" },
  getPracticeLocation: { resource: "locations", method: "retrieve" },
  listPracticeLocations: { resource: "locations", method: "list" },
  updatePracticeLocation: { resource: "locations", method: "update" },
  actOnOrderException: { resource: "orders", method: "actOnException" },
  addOrderPrescription: { resource: "orders", method: "addPrescription" },
  cancelOrder: { resource: "orders", method: "cancel" },
  createOrder: { resource: "orders", method: "create" },
  previewOrder: { resource: "orders", method: "preview" },
  createOrderBatch: { resource: "orders", method: "createBatch" },
  getOrder: { resource: "orders", method: "retrieve" },
  getOrderTestSimulation: { resource: "orders", rawOnly: true },
  listOrderEvents: { resource: "orders", method: "listEvents" },
  listOrders: { resource: "orders", method: "list" },
  rejectOrder: { resource: "orders", method: "reject" },
  signOrder: { resource: "orders", method: "sign" },
  signAndSubmitOrder: { resource: "orders", method: "signAndSubmit" },
  submitOrder: { resource: "orders", method: "submit" },
  updateOrderPrescription: { resource: "orders", method: "updatePrescription" },
  updateOrderTestSimulation: { resource: "orders", rawOnly: true },
  createPatient: { resource: "patients", method: "create" },
  createPatientAddress: { resource: "patients", method: "createAddress" },
  deletePatient: { resource: "patients", method: "delete" },
  getPatient: { resource: "patients", method: "retrieve" },
  getPatientAllergies: { resource: "patients", method: "retrieveAllergies" },
  listPatientAddresses: { resource: "patients", method: "listAddresses" },
  listPatients: { resource: "patients", method: "list" },
  replacePatientAllergies: { resource: "patients", method: "replaceAllergies" },
  setDefaultPatientAddress: { resource: "patients", method: "setDefaultAddress" },
  updatePatient: { resource: "patients", method: "update" },
  updatePatientAddress: { resource: "patients", method: "updateAddress" },
  archivePatientAddress: { resource: "patients", method: "archiveAddress" },
  createPractice: { resource: "practices", method: "create" },
  getPractice: { resource: "practices", method: "retrieve" },
  listPractices: { resource: "practices", method: "list" },
  updatePractice: { resource: "practices", method: "update" },
  createPracticeTeamLicense: { resource: "team", method: "createLicense" },
  getPracticeTeam: { resource: "team", method: "retrieve" },
  getPracticeTeamInvitation: { resource: "team", method: "retrieveInvitation" },
  getPracticeTeamMember: { resource: "team", method: "retrieveMember" },
  getPracticeTeamPrescriber: { resource: "team", method: "retrievePrescriber" },
  invitePracticeTeamPerson: { resource: "team", method: "invite" },
  listPracticeTeamInvitations: { resource: "team", method: "listInvitations" },
  listPracticeTeamMembers: { resource: "team", method: "listMembers" },
  listPracticeTeamPrescribers: { resource: "team", method: "listPrescribers" },
  registerUser: { resource: "team", method: "createUser" },
  resendPracticeTeamInvitation: { resource: "team", method: "resendInvitation" },
  revokePracticeTeamInvitation: { resource: "team", method: "revokeInvitation" },
  updatePracticeTeamLicense: { resource: "team", method: "updateLicense" },
  updatePracticeTeamMember: { resource: "team", method: "updateMember" },
  updatePracticeTeamPrescriber: { resource: "team", method: "updatePrescriber" },
  createWebhookEndpoint: { resource: "webhooks", method: "create" },
  deleteWebhookEndpoint: { resource: "webhooks", method: "delete" },
  getWebhookEvent: { resource: "webhooks", method: "retrieveEvent" },
  listWebhookEndpoints: { resource: "webhooks", method: "list" },
  listWebhookEvents: { resource: "webhooks", method: "listEvents" },
  listWebhookGrants: { resource: "webhooks", method: "listGrants" },
  replayWebhookEvent: { resource: "webhooks", method: "replayEvent" },
  revokeWebhookGrant: { resource: "webhooks", method: "revokeGrant" },
  rotateWebhookEndpointSecret: { resource: "webhooks", method: "rotateSecret" },
  saveWebhookGrant: { resource: "webhooks", method: "saveGrant" },
  testWebhookEndpoint: { resource: "webhooks", method: "test" },
  updateWebhookEndpoint: { resource: "webhooks", method: "update" },
  "platform.public-api.selling-prices.readSellingPrice": {
    resource: "platformPricing",
    method: "retrieve",
  },
  "platform.public-api.selling-prices.updateSellingPrice": {
    resource: "platformPricing",
    method: "update",
  },
} as const;

export const facadeResources = [
  "account",
  "apiKeys",
  "catalog",
  "locations",
  "orders",
  "patients",
  "platformPricing",
  "practices",
  "team",
  "webhooks",
] as const;

export type FacadeResource = (typeof facadeResources)[number];
export type FacadeOperationMapEntry =
  | { readonly resource: FacadeResource; readonly method: string }
  | { readonly resource: FacadeResource; readonly rawOnly: true };
export type FacadeOperationMap = Record<string, FacadeOperationMapEntry>;

export interface FacadeCoverage {
  contractOperations: string[];
  mappedOperations: string[];
  rawOnlyOperations: string[];
  duplicateContractOperations: string[];
  missingOperations: string[];
  unknownMappedOperations: string[];
  duplicateMethods: string[];
  unsupportedRequiredHeaders: Array<{ operationId: string; header: string }>;
}

const httpMethods = new Set(["get", "put", "post", "delete", "options", "head", "patch", "trace"]);
const supportedRequiredHeaders = new Set([
  "affinity-version",
  "idempotency-key",
  "affinity-actor-id",
  "affinity-actor-type",
  "x-affinity-organization-id",
]);

type ContractSpec = { paths?: Record<string, Record<string, unknown>> };
const resourceSet = new Set<string>(facadeResources);

function contractOperations(
  spec: ContractSpec,
): Array<{ operationId: string; requiredHeaders: string[] }> {
  const operations: Array<{ operationId: string; requiredHeaders: string[] }> = [];
  for (const path of Object.values(spec.paths ?? {})) {
    const inheritedParameters = Array.isArray(path.parameters) ? path.parameters : [];
    for (const [method, operation] of Object.entries(path)) {
      if (!httpMethods.has(method)) continue;
      const value = operation as { operationId?: string; parameters?: unknown[] };
      if (!value.operationId) {
        throw new Error(`OpenAPI operation is missing operationId for ${method.toUpperCase()}`);
      }
      const requiredHeaders = [...inheritedParameters, ...(value.parameters ?? [])]
        .filter((parameter) => {
          if (!parameter || typeof parameter !== "object") return false;
          const value = parameter as { in?: string; required?: boolean };
          return value.in === "header" && value.required === true;
        })
        .map((parameter) => (parameter as { name?: string }).name)
        .filter((name): name is string => Boolean(name));
      operations.push({ operationId: value.operationId, requiredHeaders });
    }
  }
  return operations;
}

/**
 * Validate the public operation table against an OpenAPI document.
 *
 * This is intentionally pure so generator contract tests can mutate a copy of
 * the document or map and prove that every operation requires a public method.
 */
export function validateFacadeCoverage(
  spec: ContractSpec,
  map: FacadeOperationMap = facadeOperationMap,
): FacadeCoverage {
  const contract = contractOperations(spec);
  const contractNames = contract.map(({ operationId }) => operationId);
  const contractSet = new Set(contractNames);
  const mappedNames = Object.keys(map);
  const allNames = new Set(mappedNames);
  const rawOnlyOperations = Object.entries(map)
    .filter(([, mapping]) => "rawOnly" in mapping)
    .map(([operationId]) => operationId);
  const duplicateContractOperations = contractNames.filter(
    (operationId, index) => contractNames.indexOf(operationId) !== index,
  );
  const duplicateMethods = Object.entries(map)
    .filter(
      ([, mapping], index, entries) =>
        "method" in mapping &&
        entries.some(
          ([otherOperation, otherMapping], otherIndex) =>
            index !== otherIndex &&
            "method" in otherMapping &&
            mapping.resource === otherMapping.resource &&
            mapping.method === otherMapping.method &&
            otherOperation !== undefined,
        ),
    )
    .map(([operationId, mapping]) =>
      "method" in mapping
        ? `${mapping.resource}.${mapping.method} (${operationId})`
        : `${mapping.resource} (raw-only ${operationId})`,
    );
  const unsupportedRequiredHeaders = contract.flatMap(({ operationId, requiredHeaders }) =>
    requiredHeaders
      .filter((header) => !supportedRequiredHeaders.has(header.toLowerCase()))
      .map((header) => ({ operationId, header })),
  );
  return {
    contractOperations: contractNames,
    mappedOperations: mappedNames,
    rawOnlyOperations,
    duplicateContractOperations,
    missingOperations: contractNames.filter((operationId) => !allNames.has(operationId)),
    unknownMappedOperations: mappedNames.filter((operationId) => !contractSet.has(operationId)),
    duplicateMethods,
    unsupportedRequiredHeaders,
  };
}

export function validateFacadeOperationCoverage(
  spec: ContractSpec,
  map: FacadeOperationMap = facadeOperationMap,
) {
  const coverage = validateFacadeCoverage(spec, map);
  const problems = [
    coverage.missingOperations.length > 0
      ? `missing operations: ${coverage.missingOperations.join(", ")}`
      : undefined,
    coverage.unknownMappedOperations.length > 0
      ? `unknown mapped operations: ${coverage.unknownMappedOperations.join(", ")}`
      : undefined,
    coverage.duplicateContractOperations.length > 0
      ? `duplicate contract operation IDs: ${coverage.duplicateContractOperations.join(", ")}`
      : undefined,
    coverage.duplicateMethods.length > 0
      ? `duplicate public methods: ${coverage.duplicateMethods.join(", ")}`
      : undefined,
    coverage.unsupportedRequiredHeaders.length > 0
      ? `unsupported required headers: ${coverage.unsupportedRequiredHeaders
          .map(({ operationId, header }) => `${operationId} (${header})`)
          .join(", ")}`
      : undefined,
    ...Object.entries(map)
      .filter(([, mapping]) => !resourceSet.has(mapping.resource))
      .map(([operationId, mapping]) => `unknown resources: ${operationId} (${mapping.resource})`),
    ...Object.entries(map)
      .filter(([, mapping]) => "method" in mapping && !mapping.method.trim())
      .map(([operationId]) => `empty public methods: ${operationId}`),
  ].filter((problem): problem is string => Boolean(problem));
  if (problems.length > 0)
    throw new Error(`Invalid facade operation coverage: ${problems.join("; ")}`);
  return coverage;
}
