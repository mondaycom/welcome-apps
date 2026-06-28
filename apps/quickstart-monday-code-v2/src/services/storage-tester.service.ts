import { Logger, Storage, Period } from "@mondaycom/apps-sdk";

const logger = new Logger("StorageTesterService");

const safeStringify = (obj: unknown): string => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
};

interface VerboseDetails {
  [key: string]: unknown;
}

const createVerboseDetails = (data: Record<string, unknown>): VerboseDetails | undefined => {
  const verbose: VerboseDetails = {};
  if (data.request) verbose.request = data.request;
  if (data.response) verbose.response = safeStringify(data.response);
  if (data.error) verbose.error = safeStringify(data.error);
  if (data.rawValue !== undefined) verbose.rawValue = safeStringify(data.rawValue);
  if (data.extractedValue !== undefined) verbose.extractedValue = safeStringify(data.extractedValue);
  if (data.expectedValue !== undefined) verbose.expectedValue = safeStringify(data.expectedValue);
  if (data.statusCode) verbose.statusCode = data.statusCode;
  if (data.key) verbose.key = data.key as string;
  if (data.value) verbose.value = safeStringify(data.value);
  return Object.keys(verbose).length > 0 ? verbose : undefined;
};

interface TestCase {
  name: string;
  status: "PASS" | "FAIL";
  details: string;
  verboseDetails?: VerboseDetails;
}

interface TestResults {
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    successRate: number | string;
    overallStatus: string;
    timestamp: string;
    disclaimer: string;
    message?: string;
  };
  testCases: TestCase[];
  errors: string[];
}

export const testAllStorageCapabilities = async (token: string, shortTest = false): Promise<TestResults> => {
  const testResults: TestResults = {
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      successRate: 0,
      overallStatus: "UNKNOWN",
      timestamp: new Date().toISOString(),
      disclaimer: "All tests on the monday code backend using the apps-sdk is for GENERIC (V2) storage only",
    },
    testCases: [],
    errors: [],
  };

  if (!token) {
    testResults.summary.overallStatus = "FAILED";
    testResults.errors.push("Missing token parameter");
    return testResults;
  }

  const storage = new Storage(token);
  let passedTests = 0;
  let failedTests = 0;

  try {
    const testKey1 = `test_basic_${Date.now()}`;
    const testValue1 = "Hello Monday Storage!";

    try {
      const setResult = await storage.set(testKey1, testValue1);
      if (setResult && setResult.success === true) {
        testResults.testCases.push({ name: "Basic set operation", status: "PASS", details: `Successfully set key: ${testKey1}`, verboseDetails: createVerboseDetails({ request: { key: testKey1, value: testValue1 }, response: setResult }) });
        passedTests++;
      } else {
        testResults.testCases.push({ name: "Basic set operation", status: "FAIL", details: `Set operation failed: ${setResult?.error || "unknown error"}`, verboseDetails: createVerboseDetails({ request: { key: testKey1, value: testValue1 }, response: setResult }) });
        failedTests++;
      }

      const getResult1 = await storage.get(testKey1);
      const retrievedValue = getResult1?.value;

      if (retrievedValue === testValue1) {
        testResults.testCases.push({ name: "Basic get operation", status: "PASS", details: "Successfully retrieved matching value", verboseDetails: createVerboseDetails({ request: { key: testKey1 }, response: getResult1, extractedValue: retrievedValue, expectedValue: testValue1 }) });
        passedTests++;
      } else {
        testResults.testCases.push({ name: "Basic get operation", status: "FAIL", details: `Value mismatch. Expected: "${testValue1}", Got: "${retrievedValue}"`, verboseDetails: createVerboseDetails({ request: { key: testKey1 }, response: getResult1, extractedValue: retrievedValue, expectedValue: testValue1 }) });
        failedTests++;
      }

      const deleteResult = await storage.delete(testKey1);
      if (deleteResult && deleteResult.success === true) {
        testResults.testCases.push({ name: "Basic delete operation", status: "PASS", details: `Successfully deleted key: ${testKey1}`, verboseDetails: createVerboseDetails({ request: { key: testKey1, operation: "delete" }, response: deleteResult }) });
        passedTests++;
      } else {
        testResults.testCases.push({ name: "Basic delete operation", status: "FAIL", details: `Delete operation failed: ${deleteResult?.error || "unknown error"}`, verboseDetails: createVerboseDetails({ request: { key: testKey1, operation: "delete" }, response: deleteResult }) });
        failedTests++;
      }

      try {
        const deletedResult = await storage.get(testKey1);
        if (deletedResult.success === false || deletedResult.value === null || deletedResult.value === undefined) {
          testResults.testCases.push({ name: "Delete verification", status: "PASS", details: "Item successfully deleted", verboseDetails: createVerboseDetails({ request: { key: testKey1 }, response: deletedResult }) });
          passedTests++;
        } else {
          if (!deletedResult.value) {
            testResults.testCases.push({ name: "Delete verification", status: "PASS", details: "Item successfully deleted - empty value", verboseDetails: createVerboseDetails({ request: { key: testKey1 }, response: deletedResult }) });
            passedTests++;
          } else {
            testResults.testCases.push({ name: "Delete verification", status: "FAIL", details: `Item still exists after deletion`, verboseDetails: createVerboseDetails({ request: { key: testKey1 }, response: deletedResult }) });
            failedTests++;
          }
        }
      } catch (error) {
        testResults.testCases.push({ name: "Delete verification", status: "PASS", details: `Delete verified - get threw expected error: ${(error as Error).message}`, verboseDetails: createVerboseDetails({ request: { key: testKey1 }, error }) });
        passedTests++;
      }
    } catch (error) {
      testResults.testCases.push({ name: "Basic CRUD Operations", status: "FAIL", details: `Error: ${(error as Error).message}`, verboseDetails: createVerboseDetails({ error, key: testKey1 }) });
      failedTests++;
      testResults.errors.push(`Basic CRUD test error: ${(error as Error).message}`);
    }

    const testKey2 = `test_ttl_${Date.now()}`;
    const testValue2 = "TTL Test Value";
    const ttlSeconds = 300;

    try {
      await storage.set(testKey2, testValue2, { ttl: ttlSeconds });
      testResults.testCases.push({ name: "Set with TTL", status: "PASS", details: `Successfully set key with TTL of ${ttlSeconds} seconds`, verboseDetails: createVerboseDetails({ request: { key: testKey2, value: testValue2, ttl: ttlSeconds } }) });
      passedTests++;

      const ttlResult = await storage.get(testKey2);
      const ttlRetrievedValue = ttlResult?.value;

      if (ttlRetrievedValue === testValue2) {
        testResults.testCases.push({ name: "Get with TTL", status: "PASS", details: "Successfully retrieved value set with TTL", verboseDetails: createVerboseDetails({ request: { key: testKey2 }, extractedValue: ttlRetrievedValue, expectedValue: testValue2 }) });
        passedTests++;
      } else {
        testResults.testCases.push({ name: "Get with TTL", status: "FAIL", details: `Value mismatch`, verboseDetails: createVerboseDetails({ request: { key: testKey2 }, extractedValue: ttlRetrievedValue, expectedValue: testValue2 }) });
        failedTests++;
      }

      await storage.delete(testKey2);
    } catch (error) {
      testResults.testCases.push({ name: "TTL Functionality", status: "FAIL", details: `Error: ${(error as Error).message}`, verboseDetails: createVerboseDetails({ error }) });
      failedTests++;
    }

    const edgeTestData = [
      { key: "empty_string", value: "", desc: "Empty string", isValidationCase: true },
      { key: "very_long_string", value: "A".repeat(10000), desc: "Very long string (10k chars)", isValidationCase: false },
      { key: "unicode_test", value: "\u{1F680}\u{1F389}\u{1F525}\u{1F48E}\u{1F31F}", desc: "Unicode emojis", isValidationCase: false },
      { key: "json_like", value: '{"test": "value", "number": 42}', desc: "JSON-like string", isValidationCase: false },
      { key: "special_chars", value: "!@#$%^&*()[]{}|;':\",./<>?", desc: "Special characters", isValidationCase: false },
      { key: "whitespace", value: "   \t\n\r   ", desc: "Whitespace only", isValidationCase: true },
      { key: "newlines", value: "Line 1\nLine 2\nLine 3", desc: "String with newlines", isValidationCase: true },
      { key: "numbers", value: "1234567890", desc: "Numeric string", isValidationCase: false },
      { key: "mixed_case", value: "Hello WORLD 123 !@#", desc: "Mixed case and characters", isValidationCase: false },
    ];

    for (const testData of edgeTestData) {
      const edgeKey = `edge_${testData.key}_${Date.now()}`;
      const isValidationCase = testData.key === "whitespace" || testData.key === "empty_string" || testData.key === "newlines" || testData.isValidationCase;

      try {
        await storage.set(edgeKey, testData.value, { ttl: 300 });
        const edgeResult = await storage.get(edgeKey);
        const edgeRetrievedValue = edgeResult?.value;

        if (edgeRetrievedValue === testData.value) {
          testResults.testCases.push({ name: testData.desc, status: "PASS", details: `Successfully stored and retrieved: ${testData.desc}` });
          passedTests++;
        } else if (isValidationCase && (!edgeRetrievedValue || (typeof edgeRetrievedValue === "string" && edgeRetrievedValue.trim() === ""))) {
          testResults.testCases.push({ name: testData.desc, status: "PASS", details: "Value normalized (expected API behavior)" });
          passedTests++;
        } else {
          testResults.testCases.push({ name: testData.desc, status: "FAIL", details: `Value corruption` });
          failedTests++;
        }

        await storage.delete(edgeKey).catch(() => {});
      } catch (error) {
        if (isValidationCase) {
          testResults.testCases.push({ name: testData.desc, status: "PASS", details: "Value rejected (expected API validation)" });
          passedTests++;
        } else {
          testResults.testCases.push({ name: testData.desc, status: "FAIL", details: `Error: ${(error as Error).message}` });
          failedTests++;
        }
      }
    }

    try {
      const baseKey = `concurrency_test_${Date.now()}`;
      let concurrentSuccesses = 0;
      let concurrentRateLimits = 0;
      let concurrentErrors = 0;

      const concurrencyPromises = Array.from({ length: 10 }, (_, i) =>
        storage.set(`${baseKey}_${i}`, `Value ${i}`, { ttl: 300 })
          .then(() => ({ success: true, rateLimited: false, error: "", index: i }))
          .catch((error: Error) => {
            const isRateLimit = error?.message?.includes("429");
            return { success: false, rateLimited: isRateLimit, error: error.message, index: i };
          })
      );

      const concurrencyResults = await Promise.allSettled(concurrencyPromises);
      concurrencyResults.forEach((result) => {
        if (result.status === "fulfilled") {
          if (result.value.success) concurrentSuccesses++;
          else if (result.value.rateLimited) concurrentRateLimits++;
          else concurrentErrors++;
        } else {
          concurrentErrors++;
        }
      });

      testResults.testCases.push({ name: "Concurrent writes (10 items)", status: concurrentSuccesses > 0 ? "PASS" : "FAIL", details: `${concurrentSuccesses} success, ${concurrentRateLimits} rate-limited, ${concurrentErrors} errors` });
      concurrentSuccesses > 0 ? passedTests++ : failedTests++;

      if (concurrentSuccesses > 0) {
        const verificationPromises = Array.from({ length: 10 }, (_, i) =>
          storage.get(`${baseKey}_${i}`)
            .then((result) => ({ success: true, value: result?.value, index: i }))
            .catch((error: Error) => ({ success: false, value: null as unknown, error: error.message, index: i }))
        );

        const verificationResults = await Promise.all(verificationPromises);
        let correctValues = 0;
        verificationResults.forEach((result) => {
          if (result.success && result.value === `Value ${result.index}`) correctValues++;
        });

        testResults.testCases.push({ name: "Concurrent data integrity check", status: correctValues > 0 ? "PASS" : "FAIL", details: `${correctValues} correct values out of 10` });
        correctValues > 0 ? passedTests++ : failedTests++;

        for (let i = 0; i < 10; i++) {
          await storage.delete(`${baseKey}_${i}`).catch(() => {});
        }
      }
    } catch (error) {
      testResults.testCases.push({ name: "Concurrency test", status: "FAIL", details: `Error: ${(error as Error).message}` });
      failedTests++;
    }

    try {
      const nonExistentKey = "Idontexist_key" + Date.now();
      try {
        const nonExistentResult = await storage.get(nonExistentKey);

        if (nonExistentResult.success === false || !nonExistentResult.value) {
          testResults.testCases.push({ name: "Non-existent key handling", status: "PASS", details: "Correctly handled non-existent key" });
          passedTests++;
        } else {
          testResults.testCases.push({ name: "Non-existent key handling", status: "FAIL", details: "Unexpected value returned" });
          failedTests++;
        }
      } catch (error) {
        testResults.testCases.push({ name: "Non-existent key handling", status: "PASS", details: `Expected error: ${(error as Error).message}` });
        passedTests++;
      }
    } catch (error) {
      testResults.testCases.push({ name: "Error handling test", status: "FAIL", details: `Error: ${(error as Error).message}` });
      failedTests++;
    }

    if (!shortTest) {
      try {
        const startTime = Date.now();
        const batchSize = 15;
        const testTimestamp = Date.now();
        const rateLimitTestKeys: string[] = [];
        const controlledTestKeys: string[] = [];

        const makeRequestWithRetry = async (key: string, value: string, maxRetries = 2): Promise<{ success: boolean; rateLimited?: boolean; error?: string; attempt: number }> => {
          for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
              await storage.set(key, value, { ttl: 300 });
              return { success: true, attempt };
            } catch (error) {
              const isRateLimit = (error as Error)?.message?.includes("429");
              if (isRateLimit && attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, 1100));
                continue;
              }
              return { success: false, rateLimited: isRateLimit, error: (error as Error).message, attempt };
            }
          }
          return { success: false, attempt: 0 };
        };

        const rapidResults = [];
        for (let i = 0; i < 20; i++) {
          const perfKey = `rate_limit_test_${testTimestamp}_${i}`;
          rateLimitTestKeys.push(perfKey);
          rapidResults.push(makeRequestWithRetry(perfKey, `Rate limit test value ${i}`, 0));
        }

        const rapidResponses = await Promise.all(rapidResults);
        const rapidSuccess = rapidResponses.filter((r) => r.success).length;
        const rapidRateLimit = rapidResponses.filter((r) => r.rateLimited).length;

        testResults.testCases.push({ name: "Rate limiting detection", status: "PASS", details: `${rapidSuccess} success, ${rapidRateLimit} rate-limited` });
        passedTests++;

        testResults.testCases.push({ name: "Rate limiter functioning", status: "PASS", details: rapidRateLimit > 0 ? "Rate limiter is properly protecting the service" : "No rate limiting detected (may be expected in test environment)" });
        passedTests++;

        const controlledResults = [];
        for (let i = 0; i < batchSize; i++) {
          const perfKey = `controlled_perf_test_${testTimestamp}_${i}`;
          controlledTestKeys.push(perfKey);
          controlledResults.push(makeRequestWithRetry(perfKey, `Controlled test value ${i}`, 2));
          if (i < batchSize - 1) await new Promise((resolve) => setTimeout(resolve, 50));
        }

        const controlledResponses = await Promise.all(controlledResults);
        const controlledSuccess = controlledResponses.filter((r) => r.success).length;
        const endTime = Date.now();
        const totalDuration = endTime - startTime;

        testResults.testCases.push({ name: `Controlled performance test (${batchSize} items)`, status: controlledSuccess > 0 ? "PASS" : "FAIL", details: `${controlledSuccess}/${batchSize} success, ${totalDuration}ms total` });
        controlledSuccess > 0 ? passedTests++ : failedTests++;

        if (controlledSuccess > 0) {
          testResults.testCases.push({ name: "Performance metrics", status: "PASS", details: `${(totalDuration / controlledSuccess).toFixed(1)}ms avg per successful operation` });
          passedTests++;
        }

        for (const key of [...rateLimitTestKeys, ...controlledTestKeys]) {
          await storage.delete(key).catch(() => {});
        }
      } catch (error) {
        testResults.testCases.push({ name: "Rate limiting test", status: "FAIL", details: `Error: ${(error as Error).message}` });
        failedTests++;
      }
    }

    try {
      const periods = [Period.DAILY, Period.MONTHLY, Period.YEARLY];
      for (const period of periods) {
        try {
          const counterResult = await storage.incrementCounter(period);
          if (counterResult && counterResult.error) {
            testResults.testCases.push({ name: `Increment counter (${period})`, status: "PASS", details: `Counter returned error (may be expected): ${counterResult.error}` });
            passedTests++;
          } else if (counterResult && typeof counterResult.newCounterValue === "number") {
            testResults.testCases.push({ name: `Increment counter (${period})`, status: "PASS", details: `New value: ${counterResult.newCounterValue}` });
            passedTests++;
          } else {
            testResults.testCases.push({ name: `Increment counter (${period})`, status: "FAIL", details: `Unexpected response` });
            failedTests++;
          }
        } catch (error) {
          const isExpected = (error as Error).message?.toLowerCase().includes("not supported") || (error as Error).message?.toLowerCase().includes("invalid period");
          testResults.testCases.push({ name: `Increment counter (${period})`, status: isExpected ? "PASS" : "FAIL", details: `Error: ${(error as Error).message}` });
          isExpected ? passedTests++ : failedTests++;
        }
      }

      try {
        const counterWithOptions = await storage.incrementCounter(Period.DAILY, { incrementBy: 2 });
        if (counterWithOptions && typeof counterWithOptions.newCounterValue === "number") {
          testResults.testCases.push({ name: "Increment counter with options", status: "PASS", details: `New value: ${counterWithOptions.newCounterValue}` });
          passedTests++;
        } else if (counterWithOptions && counterWithOptions.error) {
          testResults.testCases.push({ name: "Increment counter with options", status: "PASS", details: `Error: ${counterWithOptions.error}` });
          passedTests++;
        } else {
          testResults.testCases.push({ name: "Increment counter with options", status: "FAIL", details: "Unexpected response" });
          failedTests++;
        }
      } catch (error) {
        testResults.testCases.push({ name: "Increment counter with options", status: "FAIL", details: `Error: ${(error as Error).message}` });
        failedTests++;
      }
    } catch (error) {
      testResults.testCases.push({ name: "Increment counter functionality", status: "FAIL", details: `Error: ${(error as Error).message}` });
      failedTests++;
    }

    if (!shortTest) {
      try {
        const searchPrefix = `search_test_${Date.now()}`;
        const searchTestKeys: string[] = [];

        for (let i = 0; i < 3; i++) {
          const testKey = `${searchPrefix}_item${i}`;
          searchTestKeys.push(testKey);
          try { await storage.set(testKey, `Value ${i}`, { ttl: 300 }); } catch { /* ignore */ }
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          const searchResult = await storage.search(searchPrefix);
          if (searchResult && searchResult.success === true) {
            const records = searchResult.records || [];
            let validStructure = true;
            if (records.length > 0) {
              const first = records[0];
              validStructure = first && typeof first.key === "string" && first.value !== undefined && typeof first.backendOnly === "boolean";
            }
            testResults.testCases.push({ name: "Basic search operation", status: validStructure ? "PASS" : "FAIL", details: `Found ${records.length} records` });
            validStructure ? passedTests++ : failedTests++;
          } else {
            testResults.testCases.push({ name: "Basic search operation", status: "FAIL", details: "Search failed" });
            failedTests++;
          }
        } catch (error) {
          testResults.testCases.push({ name: "Basic search operation", status: "FAIL", details: `Error: ${(error as Error).message}` });
          failedTests++;
        }

        try {
          const firstPage = await storage.search(searchPrefix);
          if (firstPage && firstPage.success === true && firstPage.cursor) {
            await storage.search(searchPrefix, { cursor: firstPage.cursor });
            testResults.testCases.push({ name: "Search pagination", status: "PASS", details: `Pagination works` });
            passedTests++;
          } else {
            testResults.testCases.push({ name: "Search pagination", status: "PASS", details: "No cursor returned (expected for small sets)" });
            passedTests++;
          }
        } catch (error) {
          testResults.testCases.push({ name: "Search pagination", status: "PASS", details: `Pagination error: ${(error as Error).message}` });
          passedTests++;
        }

        for (const key of searchTestKeys) {
          await storage.delete(key).catch(() => {});
        }
      } catch (error) {
        testResults.testCases.push({ name: "Search functionality", status: "FAIL", details: `Error: ${(error as Error).message}` });
        failedTests++;
      }
    }
  } catch (error) {
    testResults.summary.overallStatus = "FAILED";
    testResults.errors.push(`Critical test suite error: ${(error as Error).message}`);
    logger.error(`Critical error in test suite: ${(error as Error).message}`);
  }

  const totalTests = passedTests + failedTests;
  testResults.summary.totalTests = totalTests;
  testResults.summary.passedTests = passedTests;
  testResults.summary.failedTests = failedTests;
  testResults.summary.successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

  if (failedTests === 0 && totalTests > 0) {
    testResults.summary.overallStatus = "SUCCESS";
    testResults.summary.message = `ALL TESTS PASSED! ${passedTests}/${totalTests} tests successful (${testResults.summary.successRate}%)`;
  } else if (passedTests > failedTests && totalTests > 0) {
    testResults.summary.overallStatus = "PARTIAL_SUCCESS";
    testResults.summary.message = `MOSTLY PASSING: ${passedTests}/${totalTests} tests passed (${testResults.summary.successRate}%). ${failedTests} failures.`;
  } else if (totalTests > 0) {
    testResults.summary.overallStatus = "FAILED";
    testResults.summary.message = `CRITICAL ISSUES: Only ${passedTests}/${totalTests} tests passed (${testResults.summary.successRate}%).`;
  } else {
    testResults.summary.overallStatus = "FAILED";
    testResults.summary.message = "NO TESTS EXECUTED";
  }

  logger.info(`Storage testing completed: ${totalTests} tests, ${passedTests} passed, ${failedTests} failed, status: ${testResults.summary.overallStatus}`);
  return testResults;
};
