/**
 * The public name of every operation is kept in one explicit table.  The
 * generator derives request details from OpenAPI, but never guesses where an
 * operation belongs or what it should be called.
 */
export const facadeOperationMap = {
  getAccount: { resource: "account", method: "retrieve", publicPath: "account.retrieve" },
  getApiAccess: { resource: "apiKeys", method: "retrieve", publicPath: "auth.access.retrieve" },
  listCatalogItems: { resource: "catalog", method: "list", publicPath: "catalog.items.list" },
  retrievePrescribingOptions: {
    resource: "catalog",
    method: "retrievePrescribingOptions",
    publicPath: "catalog.items.prescribingOptions.retrieve",
  },
  listPharmacies: { resource: "catalog", method: "listPharmacies", publicPath: "pharmacies.list" },
  listShippingOptions: {
    resource: "catalog",
    method: "listShippingOptions",
    publicPath: "catalog.items.shippingOptions.list",
  },
  archivePracticeLocation: {
    resource: "locations",
    method: "archive",
    publicPath: "practices.locations.archive",
  },
  createPracticeLocation: {
    resource: "locations",
    method: "create",
    publicPath: "practices.locations.create",
  },
  getPracticeLocation: {
    resource: "locations",
    method: "retrieve",
    publicPath: "practices.locations.retrieve",
  },
  listPracticeLocations: {
    resource: "locations",
    method: "list",
    publicPath: "practices.locations.list",
  },
  updatePracticeLocation: {
    resource: "locations",
    method: "update",
    publicPath: "practices.locations.update",
  },
  actOnOrderException: {
    resource: "orders",
    method: "actOnException",
    publicPath: "orders.exceptions.actions.create",
  },
  addOrderPrescription: {
    resource: "orders",
    method: "addPrescription",
    publicPath: "orders.prescriptions.create",
  },
  cancelOrder: { resource: "orders", method: "cancel", publicPath: "orders.cancel" },
  createOrder: { resource: "orders", method: "create", publicPath: "orders.create" },
  previewOrder: { resource: "orders", method: "preview", publicPath: "orderPreviews.create" },
  createOrderBatch: {
    resource: "orders",
    method: "createBatch",
    publicPath: "orderBatches.create",
  },
  getOrder: { resource: "orders", method: "retrieve", publicPath: "orders.retrieve" },
  getOrderTestSimulation: { resource: "orders", rawOnly: true },
  listOrderEvents: { resource: "orders", method: "listEvents", publicPath: "orders.events.list" },
  listOrders: { resource: "orders", method: "list", publicPath: "orders.list" },
  rejectOrder: { resource: "orders", method: "reject", publicPath: "orders.rejection.create" },
  signOrder: { resource: "orders", method: "sign", publicPath: "orders.sign" },
  signAndSubmitOrder: {
    resource: "orders",
    method: "signAndSubmit",
    publicPath: "orders.signAndSubmit",
  },
  submitOrder: { resource: "orders", method: "submit", publicPath: "orders.submit" },
  updateOrderPrescription: {
    resource: "orders",
    method: "updatePrescription",
    publicPath: "orders.prescriptions.update",
  },
  updateOrderTestSimulation: { resource: "orders", rawOnly: true },
  createPatient: {
    resource: "patients",
    method: "create",
    publicPath: "practices.patients.create",
  },
  createPatientAddress: {
    resource: "patients",
    method: "createAddress",
    publicPath: "practices.patients.addresses.create",
  },
  deletePatient: {
    resource: "patients",
    method: "delete",
    publicPath: "practices.patients.delete",
  },
  getPatient: {
    resource: "patients",
    method: "retrieve",
    publicPath: "practices.patients.retrieve",
  },
  getPatientAllergies: {
    resource: "patients",
    method: "retrieveAllergies",
    publicPath: "practices.patients.allergies.retrieve",
  },
  listPatientAddresses: {
    resource: "patients",
    method: "listAddresses",
    publicPath: "practices.patients.addresses.list",
  },
  listPatients: { resource: "patients", method: "list", publicPath: "practices.patients.list" },
  replacePatientAllergies: {
    resource: "patients",
    method: "replaceAllergies",
    publicPath: "practices.patients.allergies.update",
  },
  setDefaultPatientAddress: {
    resource: "patients",
    method: "setDefaultAddress",
    publicPath: "practices.patients.addresses.default.update",
  },
  updatePatient: {
    resource: "patients",
    method: "update",
    publicPath: "practices.patients.update",
  },
  updatePatientAddress: {
    resource: "patients",
    method: "updateAddress",
    publicPath: "practices.patients.addresses.update",
  },
  archivePatientAddress: {
    resource: "patients",
    method: "archiveAddress",
    publicPath: "practices.patients.addresses.delete",
  },
  createPractice: { resource: "practices", method: "create", publicPath: "practices.create" },
  getPractice: { resource: "practices", method: "retrieve", publicPath: "practices.retrieve" },
  listPractices: { resource: "practices", method: "list", publicPath: "practices.list" },
  updatePractice: { resource: "practices", method: "update", publicPath: "practices.update" },
  createPracticeTeamLicense: {
    resource: "team",
    method: "createLicense",
    publicPath: "practices.team.prescribers.licenses.create",
  },
  getPracticeTeam: { resource: "team", method: "retrieve", publicPath: "practices.team.retrieve" },
  getPracticeTeamInvitation: {
    resource: "team",
    method: "retrieveInvitation",
    publicPath: "practices.team.invitations.retrieve",
  },
  getPracticeTeamMember: {
    resource: "team",
    method: "retrieveMember",
    publicPath: "practices.team.members.retrieve",
  },
  getPracticeTeamPrescriber: {
    resource: "team",
    method: "retrievePrescriber",
    publicPath: "practices.team.prescribers.retrieve",
  },
  invitePracticeTeamPerson: {
    resource: "team",
    method: "invite",
    publicPath: "practices.team.invitations.create",
  },
  listPracticeTeamInvitations: {
    resource: "team",
    method: "listInvitations",
    publicPath: "practices.team.invitations.list",
  },
  listPracticeTeamMembers: {
    resource: "team",
    method: "listMembers",
    publicPath: "practices.team.members.list",
  },
  listPracticeTeamPrescribers: {
    resource: "team",
    method: "listPrescribers",
    publicPath: "practices.team.prescribers.list",
  },
  registerUser: { resource: "team", method: "createUser", publicPath: "practices.users.create" },
  resendPracticeTeamInvitation: {
    resource: "team",
    method: "resendInvitation",
    publicPath: "practices.team.invitations.resend",
  },
  revokePracticeTeamInvitation: {
    resource: "team",
    method: "revokeInvitation",
    publicPath: "practices.team.invitations.delete",
  },
  updatePracticeTeamLicense: {
    resource: "team",
    method: "updateLicense",
    publicPath: "practices.team.prescribers.licenses.update",
  },
  updatePracticeTeamMember: {
    resource: "team",
    method: "updateMember",
    publicPath: "practices.team.members.update",
  },
  updatePracticeTeamPrescriber: {
    resource: "team",
    method: "updatePrescriber",
    publicPath: "practices.team.prescribers.update",
  },
  createWebhookEndpoint: {
    resource: "webhooks",
    method: "create",
    publicPath: "webhookEndpoints.create",
  },
  deleteWebhookEndpoint: {
    resource: "webhooks",
    method: "delete",
    publicPath: "webhookEndpoints.delete",
  },
  getWebhookEvent: {
    resource: "webhooks",
    method: "retrieveEvent",
    publicPath: "webhookEvents.retrieve",
  },
  listWebhookEndpoints: {
    resource: "webhooks",
    method: "list",
    publicPath: "webhookEndpoints.list",
  },
  listWebhookEvents: {
    resource: "webhooks",
    method: "listEvents",
    publicPath: "webhookEvents.list",
  },
  listWebhookGrants: {
    resource: "webhooks",
    method: "listGrants",
    publicPath: "webhookGrants.list",
  },
  replayWebhookEvent: {
    resource: "webhooks",
    method: "replayEvent",
    publicPath: "webhookEvents.replay",
  },
  revokeWebhookGrant: {
    resource: "webhooks",
    method: "revokeGrant",
    publicPath: "webhookGrants.delete",
  },
  rotateWebhookEndpointSecret: {
    resource: "webhooks",
    method: "rotateSecret",
    publicPath: "webhookEndpoints.rotateSecret",
  },
  saveWebhookGrant: {
    resource: "webhooks",
    method: "saveGrant",
    publicPath: "webhookGrants.update",
  },
  testWebhookEndpoint: {
    resource: "webhooks",
    method: "test",
    publicPath: "webhookEndpoints.test",
  },
  updateWebhookEndpoint: {
    resource: "webhooks",
    method: "update",
    publicPath: "webhookEndpoints.update",
  },
  "platform.public-api.selling-prices.readSellingPrice": {
    resource: "platformPricing",
    method: "retrieve",
    publicPath: "catalog.items.sellingPrice.retrieve",
  },
  "platform.public-api.selling-prices.updateSellingPrice": {
    resource: "platformPricing",
    method: "update",
    publicPath: "catalog.items.sellingPrice.update",
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
  | { readonly resource: FacadeResource; readonly method: string; readonly publicPath: string }
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
  const publicPaths = Object.values(map).flatMap((mapping) =>
    "method" in mapping ? [mapping.publicPath] : [],
  );
  if (publicPaths.some((path) => !path || !/^[a-zA-Z]+(?:\.[a-zA-Z]+)+$/.test(path)))
    throw new Error("Invalid or missing public SDK path");
  if (new Set(publicPaths).size !== publicPaths.length)
    throw new Error("Duplicate public methods in SDK hierarchy");
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
