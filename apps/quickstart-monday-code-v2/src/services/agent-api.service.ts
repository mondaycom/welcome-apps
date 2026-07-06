import { Logger } from "@mondaycom/apps-sdk";
import {envs} from "../config/index.js";

const logger = new Logger("AgentApiService");

const MONDAY_API = process.env.MONDAY_API_URL ?? envs.get('MONDAY_API_URL') as string ?? "https://api.monday.com/v2";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MondayItem {
  id: string;
  name: string;
}

export interface MondayItemFull extends MondayItem {
  state?: string;
  board?: { id: string; name: string };
  group?: { id: string; title: string };
  column_values?: Array<{ id: string; text: string; value: string }>;
}

export interface MondayUpdate {
  id: string;
  body?: string;
  created_at?: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; extensions?: { code?: string } }>;
  account_id?: string;
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

function base64UrlDecode(segment: string): string {
  let padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  if (pad) padded += "=".repeat(4 - pad);
  return Buffer.from(padded, "base64").toString("utf8");
}

function extractShortLivedToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();
  const parts = bearer.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as { shortLivedToken?: string };
    return payload.shortLivedToken ?? null;
  } catch {
    return null;
  }
}

export type TokenSource = "jwt" | "authorization" | "env" | "none";

export function resolveApiToken(authHeader: string | undefined): { token: string | null; source: TokenSource } {
  const shortLived = extractShortLivedToken(authHeader);
  if (shortLived) {
    logger.info(`shortLived jwt: ${shortLived}`);
    return {token: shortLived, source: "jwt"};
  }

  if (authHeader) {
    const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (bearer) {
      logger.info(`bearer authorization: ${bearer}`);
      return {token: bearer, source: "authorization"};
    }
  }

  const envApiToken = process.env.MONDAY_API_TOKEN ?? process.env.M_O_N_D_A_Y__A_P_I__TOKEN ?? envs.get('MONDAY_API_TOKEN') as string ?? null;
  if (envApiToken) {
    logger.info(`envApiToken env: ${envApiToken}`);
    return {token: envApiToken, source: "env"};
  }

  return { token: null, source: "none" };
}

// ─── Payload helpers ──────────────────────────────────────────────────────────

type DynamicField = Record<string, unknown> | null | undefined;

export function firstNonNullValue(obj: DynamicField): unknown {
  if (obj == null || typeof obj !== "object" || Array.isArray(obj)) return undefined;
  const keys = Object.keys(obj).sort((a, b) => Number(a) - Number(b));
  for (const k of keys) {
    if (obj[k] != null) return obj[k];
  }
  return undefined;
}

export function getTriggerOutput(body: Record<string, unknown>): Record<string, unknown> | undefined {
  const p = (body?.payload ?? body) as Record<string, unknown>;
  const fields = (p?.inputFields ?? p?.inboundFieldValues) as Record<string, unknown> | undefined;
  return fields?.triggerOutput as Record<string, unknown> | undefined;
}

// ─── API call wrapper ─────────────────────────────────────────────────────────

function formatErrors(json: GraphQLResponse<unknown>, hint: string): string {
  const scopeHints: Record<string, string> = {
    updates: " Add OAuth scope `updates:write` and reinstall the app.",
    boards: " Add OAuth scope `boards:write` and reinstall the app.",
  };
  const extra = scopeHints[hint] ?? "";
  return (json.errors ?? [])
    .map((e) => {
      let m = e.message || String(e);
      if (e.extensions?.code === "UNAUTHORIZED_FIELD_OR_TYPE" || m === "Unauthorized field or type") m += extra;
      return m;
    })
    .join("; ");
}

async function mondayRequest<T>(
  apiToken: string,
  query: string,
  variables: Record<string, unknown>,
  errorHint = "boards"
): Promise<T> {
  const token = apiToken.replace(/^Bearer\s+/i, "").trim();
  const res = await fetch(MONDAY_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    const msg = formatErrors(json, errorHint);
    logger.error(`Monday API error [${errorHint}]: ${msg}`);
    throw new Error(msg);
  }
  return json.data as T;
}

// ─── Board / item mutations ───────────────────────────────────────────────────

export async function changeColumnValue(params: {
  boardId: string;
  itemId: string;
  columnId: string;
  value: string;
  apiToken: string;
}): Promise<MondayItem | undefined> {
  const data = await mondayRequest<{ change_column_value: MondayItem }>(
    params.apiToken,
    `mutation ($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
      change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) { id name }
    }`,
    { boardId: String(params.boardId), itemId: String(params.itemId), columnId: params.columnId, value: params.value },
    "boards"
  );
  return data.change_column_value;
}

export async function createItem(params: {
  boardId: string;
  itemName: string;
  groupId?: string;
  columnValues?: Record<string, unknown>;
  apiToken: string;
}): Promise<MondayItemFull | undefined> {
  const data = await mondayRequest<{ create_item: MondayItemFull }>(
    params.apiToken,
    `mutation ($boardId: ID!, $groupId: String, $itemName: String!, $columnValues: JSON) {
      create_item(board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues) {
        id name board { id name } group { id title } column_values { id text value }
      }
    }`,
    {
      boardId: String(params.boardId),
      groupId: params.groupId,
      itemName: params.itemName,
      columnValues: params.columnValues ? JSON.stringify(params.columnValues) : undefined,
    },
    "boards"
  );
  return data.create_item;
}

export async function deleteItem(params: { itemId: string; apiToken: string }): Promise<MondayItem | undefined> {
  const data = await mondayRequest<{ delete_item: MondayItem }>(
    params.apiToken,
    `mutation ($itemId: ID!) { delete_item(item_id: $itemId) { id name } }`,
    { itemId: String(params.itemId) },
    "boards"
  );
  return data.delete_item;
}

export async function archiveItem(params: { itemId: string; apiToken: string }): Promise<MondayItem | undefined> {
  const data = await mondayRequest<{ archive_item: MondayItem }>(
    params.apiToken,
    `mutation ($itemId: ID!) { archive_item(item_id: $itemId) { id name } }`,
    { itemId: String(params.itemId) },
    "boards"
  );
  return data.archive_item;
}

export async function duplicateItem(params: {
  boardId: string;
  itemId: string;
  withUpdates?: boolean;
  apiToken: string;
}): Promise<MondayItem | undefined> {
  const data = await mondayRequest<{ duplicate_item: MondayItem }>(
    params.apiToken,
    `mutation ($boardId: ID!, $itemId: ID!, $withUpdates: Boolean) {
      duplicate_item(board_id: $boardId, item_id: $itemId, with_updates: $withUpdates) { id name }
    }`,
    { boardId: String(params.boardId), itemId: String(params.itemId), withUpdates: params.withUpdates ?? false },
    "boards"
  );
  return data.duplicate_item;
}

export async function createSubitem(params: {
  parentItemId: string;
  itemName: string;
  columnValues?: Record<string, unknown>;
  apiToken: string;
}): Promise<(MondayItem & { parent_item?: MondayItem }) | undefined> {
  const data = await mondayRequest<{ create_subitem: MondayItem & { parent_item?: MondayItem } }>(
    params.apiToken,
    `mutation ($parentItemId: ID!, $itemName: String!, $columnValues: JSON) {
      create_subitem(parent_item_id: $parentItemId, item_name: $itemName, column_values: $columnValues) {
        id name parent_item { id name }
      }
    }`,
    {
      parentItemId: String(params.parentItemId),
      itemName: params.itemName,
      columnValues: params.columnValues ? JSON.stringify(params.columnValues) : undefined,
    },
    "boards"
  );
  return data.create_subitem;
}

export async function moveItemToGroup(params: {
  itemId: string;
  groupId: string;
  apiToken: string;
}): Promise<(MondayItem & { group?: { id: string; title: string } }) | undefined> {
  const data = await mondayRequest<{ move_item_to_group: MondayItem & { group?: { id: string; title: string } } }>(
    params.apiToken,
    `mutation ($itemId: ID!, $groupId: String!) {
      move_item_to_group(item_id: $itemId, group_id: $groupId) { id name group { id title } }
    }`,
    { itemId: String(params.itemId), groupId: params.groupId },
    "boards"
  );
  return data.move_item_to_group;
}

export async function queryItems(params: { itemIds: string[]; apiToken: string }): Promise<MondayItemFull[]> {
  const data = await mondayRequest<{ items: MondayItemFull[] }>(
    params.apiToken,
    `query ($itemIds: [ID!]!) {
      items(ids: $itemIds) {
        id name state board { id name } group { id title } column_values { id text value }
      }
    }`,
    { itemIds: params.itemIds.map(String) },
    "boards"
  );
  return data.items ?? [];
}

// ─── Update mutations ─────────────────────────────────────────────────────────

export async function createUpdate(params: {
  itemId: string;
  body: string;
  apiToken: string;
}): Promise<MondayUpdate | undefined> {
  const data = await mondayRequest<{ create_update: MondayUpdate }>(
    params.apiToken,
    `mutation ($itemId: ID!, $body: String!) {
      create_update(item_id: $itemId, body: $body) { id body created_at }
    }`,
    { itemId: String(params.itemId), body: params.body },
    "updates"
  );
  return data.create_update;
}

export async function deleteUpdate(params: { updateId: string; apiToken: string }): Promise<{ id: string } | undefined> {
  const data = await mondayRequest<{ delete_update: { id: string } }>(
    params.apiToken,
    `mutation ($updateId: ID!) { delete_update(id: $updateId) { id } }`,
    { updateId: String(params.updateId) },
    "updates"
  );
  return data.delete_update;
}
