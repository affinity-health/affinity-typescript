// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { AffinityApiClient as GeneratedClient } from "./forge/index.js";

/** Resource methods with Affinity defaults and compatibility aliases. */
export class AffinityApiClient extends GeneratedClient {
  constructor(options: GeneratedClient.Options) {
    super({
      ...options,
      affinityVersion: options.affinityVersion ?? "2026-09-28",
      maxRetries: options.maxRetries ?? 0,
    });
  }

  public override get locations() {
    return Object.assign(super.locations, {
      listPracticeLocations: super.locations.list.bind(super.locations),
      createPracticeLocation: super.locations.create.bind(super.locations),
      getPracticeLocation: super.locations.get.bind(super.locations),
      updatePracticeLocation: super.locations.update.bind(super.locations),
      archivePracticeLocation: super.locations.archive.bind(super.locations),
    });
  }

  public override get apiKeys() {
    return Object.assign(super.apiKeys, {
      createPlatformPracticeApiKey: super.apiKeys.create.bind(super.apiKeys),
      getApiAccess: super.apiKeys.getAccess.bind(super.apiKeys),
    });
  }

  public override get account() {
    return Object.assign(super.account, {
      getAccount: super.account.get.bind(super.account),
    });
  }

  public override get catalog() {
    return Object.assign(super.catalog, {
      listCatalogItems: super.catalog.items.list.bind(super.catalog.items),
      listPharmacies: super.pharmacies.list.bind(super.pharmacies),
      listShippingOptions: super.catalog.shippingOptions.list.bind(super.catalog.shippingOptions),
      retrievePrescribingOptions: super.catalog.prescribingOptions.get.bind(
        super.catalog.prescribingOptions,
      ),
    });
  }

  public override get orders() {
    return Object.assign(super.orders, {
      listOrders: super.orders.list.bind(super.orders),
      createOrder: super.orders.create.bind(super.orders),
      getOrder: super.orders.get.bind(super.orders),
      cancelOrder: super.orders.cancel.bind(super.orders),
      actOnOrderException: super.orders.exceptions.act.bind(super.orders.exceptions),
      listOrderEvents: super.orders.events.list.bind(super.orders.events),
      getOrderTestSimulation: super.orders.testSimulation.get.bind(super.orders.testSimulation),
      updateOrderTestSimulation: super.orders.testSimulation.update.bind(
        super.orders.testSimulation,
      ),
      previewOrder: super.orders.preview.bind(super.orders),
      signOrder: super.orders.sign.bind(super.orders),
      signAndSubmitOrder: super.orders.signAndSubmit.bind(super.orders),
      submitOrder: super.orders.submit.bind(super.orders),
      rejectOrder: super.orders.reject.bind(super.orders),
      addOrderPrescription: super.orders.prescriptions.add.bind(super.orders.prescriptions),
      updateOrderPrescription: super.orders.prescriptions.update.bind(super.orders.prescriptions),
      createOrderBatch: super.orders.batches.create.bind(super.orders.batches),
    });
  }

  public override get webhooks() {
    return Object.assign(super.webhooks, {
      listWebhookEndpoints: super.webhooks.endpoints.list.bind(super.webhooks.endpoints),
      createWebhookEndpoint: super.webhooks.endpoints.create.bind(super.webhooks.endpoints),
      updateWebhookEndpoint: super.webhooks.endpoints.update.bind(super.webhooks.endpoints),
      deleteWebhookEndpoint: super.webhooks.endpoints.delete.bind(super.webhooks.endpoints),
      rotateWebhookEndpointSecret: super.webhooks.endpoints.rotateSecret.bind(
        super.webhooks.endpoints,
      ),
      testWebhookEndpoint: super.webhooks.endpoints.test.bind(super.webhooks.endpoints),
      listWebhookEvents: super.webhooks.events.list.bind(super.webhooks.events),
      getWebhookEvent: super.webhooks.events.get.bind(super.webhooks.events),
      replayWebhookEvent: super.webhooks.events.replay.bind(super.webhooks.events),
      listWebhookGrants: super.webhooks.grants.list.bind(super.webhooks.grants),
      saveWebhookGrant: super.webhooks.grants.save.bind(super.webhooks.grants),
      revokeWebhookGrant: super.webhooks.grants.revoke.bind(super.webhooks.grants),
    });
  }

  public override get team() {
    return Object.assign(super.team, {
      registerUser: super.team.register.bind(super.team),
      invitePracticeTeamPerson: super.team.invitations.create.bind(super.team.invitations),
      listPracticeTeamInvitations: super.team.invitations.list.bind(super.team.invitations),
      getPracticeTeam: super.team.get.bind(super.team),
      listPracticeTeamMembers: super.team.members.list.bind(super.team.members),
      listPracticeTeamPrescribers: super.team.prescribers.list.bind(super.team.prescribers),
      getPracticeTeamMember: super.team.members.get.bind(super.team.members),
      updatePracticeTeamMember: super.team.members.update.bind(super.team.members),
      getPracticeTeamPrescriber: super.team.prescribers.get.bind(super.team.prescribers),
      updatePracticeTeamPrescriber: super.team.prescribers.update.bind(super.team.prescribers),
      createPracticeTeamLicense: super.team.prescribers.licenses.create.bind(
        super.team.prescribers.licenses,
      ),
      updatePracticeTeamLicense: super.team.prescribers.licenses.update.bind(
        super.team.prescribers.licenses,
      ),
      getPracticeTeamInvitation: super.team.invitations.get.bind(super.team.invitations),
      revokePracticeTeamInvitation: super.team.invitations.revoke.bind(super.team.invitations),
      resendPracticeTeamInvitation: super.team.invitations.resend.bind(super.team.invitations),
    });
  }

  public override get patients() {
    return Object.assign(super.patients, {
      listPatientAddresses: super.patients.addresses.list.bind(super.patients.addresses),
      createPatientAddress: super.patients.addresses.create.bind(super.patients.addresses),
      updatePatientAddress: super.patients.addresses.update.bind(super.patients.addresses),
      archivePatientAddress: super.patients.addresses.archive.bind(super.patients.addresses),
      setDefaultPatientAddress: super.patients.addresses.setDefault.bind(super.patients.addresses),
      listPatients: super.patients.list.bind(super.patients),
      createPatient: super.patients.create.bind(super.patients),
      getPatient: super.patients.get.bind(super.patients),
      deletePatient: super.patients.delete.bind(super.patients),
      updatePatient: super.patients.update.bind(super.patients),
      getPatientAllergies: super.patients.allergies.get.bind(super.patients.allergies),
      replacePatientAllergies: super.patients.allergies.replace.bind(super.patients.allergies),
    });
  }

  public override get practices() {
    return Object.assign(super.practices, {
      listPractices: super.practices.list.bind(super.practices),
      createPractice: super.practices.create.bind(super.practices),
      getPractice: super.practices.get.bind(super.practices),
      updatePractice: super.practices.update.bind(super.practices),
    });
  }

  public get platformPricing() {
    return Object.assign(
      {},
      {
        platformPublicApiSellingPricesReadSellingPrice: super.catalog.sellingPrices.get.bind(
          super.catalog.sellingPrices,
        ),
        platformPublicApiSellingPricesUpdateSellingPrice: super.catalog.sellingPrices.update.bind(
          super.catalog.sellingPrices,
        ),
      },
    );
  }
}
