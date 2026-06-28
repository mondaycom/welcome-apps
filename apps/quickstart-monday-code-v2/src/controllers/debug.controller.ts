import { Logger, SecureStorage, Storage } from "@mondaycom/apps-sdk";
import axios from "axios";
import type { Request, Response } from "express";
import { envs, ENV_KEYS, getSecretsObject, getEnvsObject } from "../config/index.js";
import { platformApiHealthCheck } from "../services/monday-api.service.js";
import { produceMessageWithPayload } from "../services/queue.service.js";
import { testAllStorageCapabilities } from "../services/storage-tester.service.js";

const logger = new Logger("DebugController");

const testStorage = async (): Promise<unknown> => {
  const token = (envs.get(ENV_KEYS.DEV_ACCESS_TOKEN) as string) + "";
  const storage = new Storage(token);
  await storage.set("maors_test_app", JSON.stringify({ my_key: "my_value", now: new Date().toISOString() }), { ttl: 3600 });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await storage.get("maors_test_app");
};

const testSecureStorage = async (): Promise<unknown> => {
  const secureStorage = new SecureStorage();
  await secureStorage.set("maors_test_app", JSON.stringify({ my_key: "my_value", now: new Date().toISOString() }));
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await secureStorage.get("maors_test_app");
};

export const superHealth = async (_req: Request, res: Response): Promise<void> => {
  logger.info("hello from info");
  logger.error("hello from error");
  logger.error("hello from error WITH error string", { error: new Error("error string") });
  logger.error("hello from error WITH error object", { error: new Error("error class instance") });
  logger.warn("hello from warn");
  logger.debug("hello from debug");

  const now = Date.now() + "";
  const messageId = await produceMessageWithPayload({ message: "hello from super-health", now });

  res.status(200).send({
    healthy: "OK",
    timestamp: now,
    secretsObject: getSecretsObject(),
    envsObject: getEnvsObject(),
    producedQueueMessageId: messageId,
  });
};

export const longRequest = (req: Request, res: Response): void => {
  const time = req.query.time ? Number(req.query.time) : 15000;
  setTimeout(() => {
    res.status(200).send({ status: "OK", timestamp: new Date().toISOString() });
  }, time);
};

export const networking = async (_req: Request, res: Response): Promise<void> => {
  try {
    const asyncApiCalls: Record<string, Promise<unknown> | string> = {
      "http://example.com": axios.get("http://example.com", { timeout: 5000 }),
      "http://api.ipify.org": axios.get("http://api.ipify.org", { timeout: 5000 }),
      "http://1.1.1.1 (Cloudflare public DNS)": axios.get("http://1.1.1.1", { timeout: 5000 }),
      "http://34.102.212.0 (walla.co.il)": axios.get("http://34.102.212.0", { timeout: 5000 }),
      "-------------------------------------": "-------------------------------------",
      "Platform-API (GraphQL with SDK client)": platformApiHealthCheck((envs.get(ENV_KEYS.DEV_ACCESS_TOKEN) as string) + ""),
      "AppsSDK - Queue - produce message:": produceMessageWithPayload(),
      "AppsSDK - Storage:": testStorage(),
      "AppsSDK - SecureStorage:": testSecureStorage(),
    };

    const results: Record<string, string> = {};

    for (const [name, asyncApiCall] of Object.entries(asyncApiCalls)) {
      if (typeof asyncApiCall === "string") {
        results[name] = asyncApiCall;
        continue;
      }

      try {
        const response = (await asyncApiCall) as Record<string, unknown> | null;
        let statusCode: unknown = null;
        if (response) {
          statusCode = response.status || response.statusCode || response.code || response.responseCode || JSON.stringify(response).substring(0, 100);
        }
        results[name] = `Success` + (statusCode ? `: ${statusCode}` : "");
      } catch (error) {
        const axiosErr = error as { response?: { status: number }; message: string };
        results[name] = axiosErr.response ? `Failed: ${axiosErr.response.status}` : `Failed: ${axiosErr.message}`;
      }
    }

    res.status(200).send(results);
  } catch (e) {
    console.error(e);
    res.status(200).send({ message: "Wild exception thrown", error: (e as Error).message, stack: (e as Error).stack, JSON: JSON.stringify(e) });
  }
};

export const storageTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = envs.get(ENV_KEYS.DEV_ACCESS_TOKEN) as string | undefined;
    if (!token) {
      res.status(400).send({
        summary: { overallStatus: "FAILED", message: "Missing DEV_ACCESS_TOKEN environment variable", timestamp: new Date().toISOString() },
        errors: ["DEV_ACCESS_TOKEN not found in environment"],
      });
      return;
    }

    logger.info("Starting comprehensive storage API testing");
    const testResults = await testAllStorageCapabilities(token, !!req.query.shortTest);
    const statusCode = testResults.summary.overallStatus === "SUCCESS" ? 200 : 500;
    res.status(statusCode).send(testResults);
  } catch (err) {
    logger.error(`Error in storage-test endpoint: ${(err as Error).message}`, { error: err instanceof Error ? err : new Error(String(err)) });
    res.status(500).send({
      summary: { overallStatus: "FAILED", message: "Internal server error during storage testing", timestamp: new Date().toISOString() },
      errors: [(err as Error).message],
      testCases: [],
    });
  }
};
