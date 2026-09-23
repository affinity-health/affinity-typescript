// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { Configuration, FetchError, ResponseError, type FetchAPI } from "./runtime";
import { createTransport, type TransportOptions } from "./resources/transport";
import { RawClient } from "./raw";
import {
  AccountResource,
  APIKeysResource,
  CatalogResource,
  LocationsResource,
  OrdersResource,
  PatientsResource,
  PlatformPricingResource,
  PracticesResource,
  TeamResource,
  WebhooksResource,
} from "./resources";
import {
  type AffinityActor,
  type RequestOptions,
  validateAffinityActor,
  validateCustomHeaders,
  validateNonEmptyOption,
} from "./resources/shared";

export interface AffinityOptions extends TransportOptions {
  actor?: AffinityActor;
  apiVersion?: string;
  baseUrl?: string;
  fetch?: FetchAPI;
  headers?: Record<string, string>;
  organizationId?: string;
}

export type RawRequestParams = Record<string, unknown>;

export interface RawRequestOptions extends RequestOptions {
  idempotencyKey?: string;
}

function createPublicResources(
  raw: RawClient,
  actor: AffinityActor,
): {
  readonly practices: {
    readonly locations: {
      readonly list: LocationsResource["list"];
      readonly create: LocationsResource["create"];
      readonly retrieve: LocationsResource["retrieve"];
      readonly update: LocationsResource["update"];
      readonly archive: LocationsResource["archive"];
    };
    readonly users: { readonly create: TeamResource["createUser"] };
    readonly patients: {
      readonly addresses: {
        readonly list: PatientsResource["listAddresses"];
        readonly create: PatientsResource["createAddress"];
        readonly update: PatientsResource["updateAddress"];
        readonly delete: PatientsResource["archiveAddress"];
        readonly default: { readonly update: PatientsResource["setDefaultAddress"] };
      };
      readonly list: PatientsResource["list"];
      readonly create: PatientsResource["create"];
      readonly retrieve: PatientsResource["retrieve"];
      readonly delete: PatientsResource["delete"];
      readonly update: PatientsResource["update"];
      readonly allergies: {
        readonly retrieve: PatientsResource["retrieveAllergies"];
        readonly update: PatientsResource["replaceAllergies"];
      };
    };
    readonly team: {
      readonly invitations: {
        readonly create: TeamResource["invite"];
        readonly list: TeamResource["listInvitations"];
        readonly retrieve: TeamResource["retrieveInvitation"];
        readonly delete: TeamResource["revokeInvitation"];
        readonly resend: TeamResource["resendInvitation"];
      };
      readonly retrieve: TeamResource["retrieve"];
      readonly members: {
        readonly list: TeamResource["listMembers"];
        readonly retrieve: TeamResource["retrieveMember"];
        readonly update: TeamResource["updateMember"];
      };
      readonly prescribers: {
        readonly list: TeamResource["listPrescribers"];
        readonly retrieve: TeamResource["retrievePrescriber"];
        readonly update: TeamResource["updatePrescriber"];
        readonly licenses: {
          readonly create: TeamResource["createLicense"];
          readonly update: TeamResource["updateLicense"];
        };
      };
    };
    readonly list: PracticesResource["list"];
    readonly create: PracticesResource["create"];
    readonly retrieve: PracticesResource["retrieve"];
    readonly update: PracticesResource["update"];
  };
  readonly account: { readonly retrieve: AccountResource["retrieve"] };
  readonly catalog: {
    readonly items: {
      readonly list: CatalogResource["list"];
      readonly shippingOptions: { readonly list: CatalogResource["listShippingOptions"] };
      readonly prescribingOptions: {
        readonly retrieve: CatalogResource["retrievePrescribingOptions"];
      };
      readonly sellingPrice: {
        readonly retrieve: PlatformPricingResource["retrieve"];
        readonly update: PlatformPricingResource["update"];
      };
    };
  };
  readonly pharmacies: { readonly list: CatalogResource["listPharmacies"] };
  readonly orders: {
    readonly list: OrdersResource["list"];
    readonly create: OrdersResource["create"];
    readonly retrieve: OrdersResource["retrieve"];
    readonly cancel: OrdersResource["cancel"];
    readonly exceptions: {
      readonly actions: { readonly create: OrdersResource["actOnException"] };
    };
    readonly events: { readonly list: OrdersResource["listEvents"] };
    readonly sign: OrdersResource["sign"];
    readonly signAndSubmit: OrdersResource["signAndSubmit"];
    readonly submit: OrdersResource["submit"];
    readonly rejection: { readonly create: OrdersResource["reject"] };
    readonly prescriptions: {
      readonly create: OrdersResource["addPrescription"];
      readonly update: OrdersResource["updatePrescription"];
    };
  };
  readonly webhookEndpoints: {
    readonly list: WebhooksResource["list"];
    readonly create: WebhooksResource["create"];
    readonly update: WebhooksResource["update"];
    readonly delete: WebhooksResource["delete"];
    readonly rotateSecret: WebhooksResource["rotateSecret"];
    readonly test: WebhooksResource["test"];
  };
  readonly webhookEvents: {
    readonly list: WebhooksResource["listEvents"];
    readonly retrieve: WebhooksResource["retrieveEvent"];
    readonly replay: WebhooksResource["replayEvent"];
  };
  readonly orderPreviews: { readonly create: OrdersResource["preview"] };
  readonly auth: { readonly access: { readonly retrieve: APIKeysResource["retrieve"] } };
  readonly orderBatches: { readonly create: OrdersResource["createBatch"] };
  readonly webhookGrants: {
    readonly list: WebhooksResource["listGrants"];
    readonly update: WebhooksResource["saveGrant"];
    readonly delete: WebhooksResource["revokeGrant"];
  };
} {
  const account = new AccountResource(raw.account);
  const apiKeys = new APIKeysResource(raw.apiKeys);
  const catalog = new CatalogResource(raw.catalog);
  const locations = new LocationsResource(raw.locations);
  const orders = new OrdersResource(raw.orders);
  const patients = new PatientsResource(raw.patients);
  const platformPricing = new PlatformPricingResource(raw.platformPricing);
  const practices = new PracticesResource(raw.practices);
  const team = new TeamResource(raw.team);
  const webhooks = new WebhooksResource(raw.webhooks);
  return {
    practices: {
      locations: {
        list: locations.list.bind(locations),
        create: locations.create.bind(locations),
        retrieve: locations.retrieve.bind(locations),
        update: locations.update.bind(locations),
        archive: locations.archive.bind(locations),
      },
      users: { create: team.createUser.bind(team) },
      patients: {
        addresses: {
          list: patients.listAddresses.bind(patients),
          create: patients.createAddress.bind(patients),
          update: patients.updateAddress.bind(patients),
          delete: patients.archiveAddress.bind(patients),
          default: { update: patients.setDefaultAddress.bind(patients) },
        },
        list: patients.list.bind(patients),
        create: patients.create.bind(patients),
        retrieve: patients.retrieve.bind(patients),
        delete: patients.delete.bind(patients),
        update: patients.update.bind(patients),
        allergies: {
          retrieve: patients.retrieveAllergies.bind(patients),
          update: patients.replaceAllergies.bind(patients),
        },
      },
      team: {
        invitations: {
          create: team.invite.bind(team),
          list: team.listInvitations.bind(team),
          retrieve: team.retrieveInvitation.bind(team),
          delete: team.revokeInvitation.bind(team),
          resend: team.resendInvitation.bind(team),
        },
        retrieve: team.retrieve.bind(team),
        members: {
          list: team.listMembers.bind(team),
          retrieve: team.retrieveMember.bind(team),
          update: team.updateMember.bind(team),
        },
        prescribers: {
          list: team.listPrescribers.bind(team),
          retrieve: team.retrievePrescriber.bind(team),
          update: team.updatePrescriber.bind(team),
          licenses: {
            create: team.createLicense.bind(team),
            update: team.updateLicense.bind(team),
          },
        },
      },
      list: practices.list.bind(practices),
      create: practices.create.bind(practices),
      retrieve: practices.retrieve.bind(practices),
      update: practices.update.bind(practices),
    },
    account: { retrieve: account.retrieve.bind(account) },
    catalog: {
      items: {
        list: catalog.list.bind(catalog),
        shippingOptions: { list: catalog.listShippingOptions.bind(catalog) },
        prescribingOptions: { retrieve: catalog.retrievePrescribingOptions.bind(catalog) },
        sellingPrice: {
          retrieve: platformPricing.retrieve.bind(platformPricing),
          update: platformPricing.update.bind(platformPricing),
        },
      },
    },
    pharmacies: { list: catalog.listPharmacies.bind(catalog) },
    orders: {
      list: orders.list.bind(orders),
      create: orders.create.bind(orders),
      retrieve: orders.retrieve.bind(orders),
      cancel: orders.cancel.bind(orders),
      exceptions: { actions: { create: orders.actOnException.bind(orders) } },
      events: { list: orders.listEvents.bind(orders) },
      sign: orders.sign.bind(orders),
      signAndSubmit: orders.signAndSubmit.bind(orders),
      submit: orders.submit.bind(orders),
      rejection: { create: orders.reject.bind(orders) },
      prescriptions: {
        create: orders.addPrescription.bind(orders),
        update: orders.updatePrescription.bind(orders),
      },
    },
    webhookEndpoints: {
      list: webhooks.list.bind(webhooks),
      create: webhooks.create.bind(webhooks),
      update: webhooks.update.bind(webhooks),
      delete: webhooks.delete.bind(webhooks),
      rotateSecret: webhooks.rotateSecret.bind(webhooks),
      test: webhooks.test.bind(webhooks),
    },
    webhookEvents: {
      list: webhooks.listEvents.bind(webhooks),
      retrieve: webhooks.retrieveEvent.bind(webhooks),
      replay: webhooks.replayEvent.bind(webhooks),
    },
    orderPreviews: { create: orders.preview.bind(orders) },
    auth: { access: { retrieve: apiKeys.retrieve.bind(apiKeys) } },
    orderBatches: { create: orders.createBatch.bind(orders) },
    webhookGrants: {
      list: webhooks.listGrants.bind(webhooks),
      update: webhooks.saveGrant.bind(webhooks),
      delete: webhooks.revokeGrant.bind(webhooks),
    },
  };
}

export class Affinity {
  readonly practices: ReturnType<typeof createPublicResources>["practices"];
  readonly account: ReturnType<typeof createPublicResources>["account"];
  readonly catalog: ReturnType<typeof createPublicResources>["catalog"];
  readonly pharmacies: ReturnType<typeof createPublicResources>["pharmacies"];
  readonly orders: ReturnType<typeof createPublicResources>["orders"];
  readonly webhookEndpoints: ReturnType<typeof createPublicResources>["webhookEndpoints"];
  readonly webhookEvents: ReturnType<typeof createPublicResources>["webhookEvents"];
  readonly orderPreviews: ReturnType<typeof createPublicResources>["orderPreviews"];
  readonly auth: ReturnType<typeof createPublicResources>["auth"];
  readonly orderBatches: ReturnType<typeof createPublicResources>["orderBatches"];
  readonly webhookGrants: ReturnType<typeof createPublicResources>["webhookGrants"];
  private readonly transport: FetchAPI;
  private readonly apiKey: string;
  private readonly options: AffinityOptions;

  constructor(apiKey: string, options: AffinityOptions = {}) {
    if (typeof apiKey !== "string" || !apiKey.trim())
      throw new Error("Affinity requires a service API key");
    const actor: AffinityActor =
      options.actor === undefined
        ? ({ type: "system" } as const)
        : validateAffinityActor(options.actor);
    const headers = validateCustomHeaders(options.headers);
    const version =
      options.apiVersion !== undefined
        ? validateNonEmptyOption(options.apiVersion, "apiVersion")
        : "2026-08-11";
    const organizationId =
      options.organizationId !== undefined
        ? validateNonEmptyOption(options.organizationId, "organizationId")
        : undefined;
    this.transport = createTransport(options.fetch ?? globalThis.fetch, options);
    this.apiKey = apiKey;
    const basePath = (options.baseUrl ?? "https://api.joinaffinityai.com").replace(/\/+$/, "");
    this.options = {
      ...options,
      baseUrl: basePath,
      headers,
      apiVersion: version,
      actor,
      ...(organizationId ? { organizationId } : {}),
    };
    const configuration = new Configuration({
      accessToken: apiKey,
      basePath,
      fetchApi: this.transport,
      headers: {
        ...headers,
        "Affinity-Version": version,
        ...(actor.id === undefined ? {} : { "Affinity-Actor-Id": actor.id }),
        "Affinity-Actor-Type": actor.type,
        ...(organizationId ? { "X-Affinity-Organization-Id": organizationId } : {}),
      },
    });
    const raw = new RawClient(configuration);
    const resources = createPublicResources(raw, actor);
    this.practices = resources.practices;
    this.account = resources.account;
    this.catalog = resources.catalog;
    this.pharmacies = resources.pharmacies;
    this.orders = resources.orders;
    this.webhookEndpoints = resources.webhookEndpoints;
    this.webhookEvents = resources.webhookEvents;
    this.orderPreviews = resources.orderPreviews;
    this.auth = resources.auth;
    this.orderBatches = resources.orderBatches;
    this.webhookGrants = resources.webhookGrants;
  }

  withActor(actor: AffinityActor): Affinity {
    return new Affinity(this.apiKey, { ...this.options, actor });
  }

  async rawRequest<T = unknown>(
    method: string,
    path: string,
    params?: RawRequestParams | null,
    options: RawRequestOptions = {},
  ): Promise<T> {
    const requestMethod = method.toUpperCase();
    if (
      typeof path !== "string" ||
      !path.startsWith("/") ||
      path.startsWith("//") ||
      path.startsWith("/\\")
    ) {
      throw new Error("Affinity rawRequest path must begin with a single forward slash");
    }
    const bodyMethods = new Set(["POST", "PUT", "PATCH"]);
    if (!bodyMethods.has(requestMethod) && params && Object.keys(params).length > 0) {
      throw new Error(
        "Affinity rawRequest only supports params on POST, PUT, and PATCH requests. Add query parameters to path instead.",
      );
    }

    const headers = new Headers(this.options.headers);
    for (const [name, value] of Object.entries(validateCustomHeaders(options.headers)))
      headers.set(name, value);
    headers.set("Authorization", `Bearer ${this.apiKey}`);
    headers.set(
      "Affinity-Version",
      options.apiVersion === undefined
        ? this.options.apiVersion!
        : validateNonEmptyOption(options.apiVersion, "apiVersion"),
    );
    const organizationId = options.organizationId ?? this.options.organizationId;
    if (organizationId !== undefined)
      headers.set(
        "X-Affinity-Organization-Id",
        validateNonEmptyOption(organizationId, "organizationId"),
      );
    const actor = options.actor ?? this.options.actor;
    if (actor) {
      const validatedActor = validateAffinityActor(actor);
      if (validatedActor.id !== undefined) headers.set("Affinity-Actor-Id", validatedActor.id);
      headers.set("Affinity-Actor-Type", validatedActor.type);
    }
    if (options.idempotencyKey !== undefined)
      headers.set(
        "Idempotency-Key",
        validateNonEmptyOption(options.idempotencyKey, "idempotencyKey"),
      );

    const hasBody = bodyMethods.has(requestMethod) && params != null;
    if (hasBody) headers.set("Content-Type", "application/json");
    let response: Response;
    try {
      response = await this.transport(`${this.options.baseUrl}${path}`, {
        method: requestMethod,
        headers,
        ...(hasBody ? { body: JSON.stringify(params) } : {}),
        ...(options.signal ? { signal: options.signal } : {}),
      });
    } catch (cause) {
      if (cause instanceof Error)
        throw new FetchError(
          cause,
          "The request failed and the transport did not return a response",
        );
      throw cause;
    }
    if (!response.ok) throw new ResponseError(response, "Response returned an error code");
    if (response.status === 204 || response.headers.get("content-length") === "0")
      return undefined as T;
    return (await response.json()) as T;
  }
}
