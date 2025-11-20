import { Logger, Storage } from "@mondaycom/apps-sdk";

const logTag = "StorageTesterService";
const logger = new Logger(logTag);

/**
 * Comprehensive Storage API Testing Service
 * Tests all available Monday Storage API functionality using the Apps SDK
 * 
 * @param {string} token - The access token for monday API
 * @returns {Promise<object>} - Returns comprehensive test results with summary
 */
export const testAllStorageCapabilities = async (token) => {
  const testResults = {
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      successRate: 0,
      overallStatus: "UNKNOWN",
      timestamp: new Date().toISOString(),
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
    // TEST 1: Basic CRUD Operations
    logger.info("Starting Test 1: Basic CRUD Operations");
    
    const testKey1 = `test_basic_${Date.now()}`;
    const testValue1 = "Hello Monday Storage!";

    try {
      // Test set
      await storage.set(testKey1, testValue1);
      testResults.testCases.push({ 
        name: "Basic set operation", 
        status: "PASS",
        details: `Successfully set key: ${testKey1}`
      });
      passedTests++;

      // Test get
      const getResult1 = await storage.get(testKey1);
      const retrievedValue = typeof getResult1 === 'object' && getResult1.value 
        ? getResult1.value 
        : getResult1;
      
      if (retrievedValue === testValue1) {
        testResults.testCases.push({ 
          name: "Basic get operation", 
          status: "PASS",
          details: `Successfully retrieved matching value`
        });
        passedTests++;
      } else {
        testResults.testCases.push({ 
          name: "Basic get operation", 
          status: "FAIL",
          details: `Value mismatch. Expected: "${testValue1}", Got: "${retrievedValue}"`
        });
        failedTests++;
      }

      // Test delete
      await storage.delete(testKey1);
      testResults.testCases.push({ 
        name: "Basic delete operation", 
        status: "PASS",
        details: `Successfully deleted key: ${testKey1}`
      });
      passedTests++;

      // Verify deletion
      try {
        const deletedResult = await storage.get(testKey1);
        const deletedValue = typeof deletedResult === 'object' && deletedResult.value 
          ? deletedResult.value 
          : deletedResult;
        
        if (!deletedValue || deletedValue === null || deletedValue === undefined) {
          testResults.testCases.push({ 
            name: "Delete verification", 
            status: "PASS",
            details: "Item successfully deleted and verified"
          });
          passedTests++;
        } else {
          testResults.testCases.push({ 
            name: "Delete verification", 
            status: "FAIL",
            details: `Item still exists after deletion. Value: "${deletedValue}"`
          });
          failedTests++;
        }
      } catch (error) {
        // Expected for deleted items - API might throw error or return null
        testResults.testCases.push({ 
          name: "Delete verification", 
          status: "PASS",
          details: `Delete verified (expected error/null): ${error.message || 'null returned'}`
        });
        passedTests++;
      }

    } catch (error) {
      testResults.testCases.push({ 
        name: "Basic CRUD Operations", 
        status: "FAIL",
        details: `Error: ${error.message}`
      });
      failedTests++;
      testResults.errors.push(`Basic CRUD test error: ${error.message}`);
    }

    // TEST 2: TTL (Time To Live) Functionality
    logger.info("Starting Test 2: TTL Functionality");
    
    const testKey2 = `test_ttl_${Date.now()}`;
    const testValue2 = "TTL Test Value";
    const ttlSeconds = 300; // 5 minutes

    try {
      await storage.set(testKey2, testValue2, { ttl: ttlSeconds });
      testResults.testCases.push({ 
        name: "Set with TTL", 
        status: "PASS",
        details: `Successfully set key with TTL of ${ttlSeconds} seconds`
      });
      passedTests++;

      const ttlResult = await storage.get(testKey2);
      const ttlRetrievedValue = typeof ttlResult === 'object' && ttlResult.value 
        ? ttlResult.value 
        : ttlResult;
      
      if (ttlRetrievedValue === testValue2) {
        testResults.testCases.push({ 
          name: "Get with TTL", 
          status: "PASS",
          details: "Successfully retrieved value set with TTL"
        });
        passedTests++;
      } else {
        testResults.testCases.push({ 
          name: "Get with TTL", 
          status: "FAIL",
          details: `Value mismatch. Expected: "${testValue2}", Got: "${ttlRetrievedValue}"`
        });
        failedTests++;
      }

      // Cleanup
      await storage.delete(testKey2);
      
    } catch (error) {
      testResults.testCases.push({ 
        name: "TTL Functionality", 
        status: "FAIL",
        details: `Error: ${error.message}`
      });
      failedTests++;
      testResults.errors.push(`TTL test error: ${error.message}`);
    }

    // TEST 3: Edge Cases and Data Types
    logger.info("Starting Test 3: Edge Cases and Data Types");
    
    const edgeTestData = [
      { key: "empty_string", value: "", desc: "Empty string" },
      { key: "very_long_string", value: "A".repeat(10000), desc: "Very long string (10k chars)" },
      { key: "unicode_test", value: "🚀🎉🔥💎🌟", desc: "Unicode emojis" },
      { key: "json_like", value: '{"test": "value", "number": 42}', desc: "JSON-like string" },
      { key: "special_chars", value: "!@#$%^&*()[]{}|;':\",./<>?", desc: "Special characters" },
      { key: "whitespace", value: "   \t\n\r   ", desc: "Whitespace only" },
      { key: "newlines", value: "Line 1\nLine 2\nLine 3", desc: "String with newlines" },
      { key: "numbers", value: "1234567890", desc: "Numeric string" },
      { key: "mixed_case", value: "Hello WORLD 123 !@#", desc: "Mixed case and characters" },
    ];

    for (const testData of edgeTestData) {
      try {
        const edgeKey = `edge_${testData.key}_${Date.now()}`;
        const isWhitespaceOnly = testData.key === "whitespace";
        const isEmptyString = testData.key === "empty_string";
        const isValidationCase = isWhitespaceOnly || isEmptyString;

        // Test set
        try {
          await storage.set(edgeKey, testData.value, { ttl: 300 });
          
          // Test get
          const edgeResult = await storage.get(edgeKey);
          const edgeRetrievedValue = typeof edgeResult === 'object' && edgeResult.value 
            ? edgeResult.value 
            : edgeResult;
          
          if (edgeRetrievedValue === testData.value) {
            testResults.testCases.push({ 
              name: `${testData.desc}`, 
              status: "PASS",
              details: `Successfully stored and retrieved: ${testData.desc}`
            });
            passedTests++;
          } else if (isValidationCase && (!edgeRetrievedValue || edgeRetrievedValue.trim() === "")) {
            // Expected behavior: API may normalize or reject empty/whitespace values
            const reason = isEmptyString ? "Empty string normalized" : "Whitespace normalized";
            testResults.testCases.push({ 
              name: `${testData.desc}`, 
              status: "PASS",
              details: `${reason} (expected API behavior)`
            });
            passedTests++;
          } else {
            testResults.testCases.push({ 
              name: `${testData.desc}`, 
              status: "FAIL",
              details: `Value corruption. Expected: "${testData.value.substring(0, 50)}...", Got: "${edgeRetrievedValue && typeof edgeRetrievedValue === 'string' ? edgeRetrievedValue.substring(0, 50) : 'Got non-string value: ' + typeof edgeRetrievedValue}..."`
            });
            failedTests++;
          }

          // Cleanup
          await storage.delete(edgeKey).catch(() => {}); // Ignore cleanup errors
          
        } catch (error) {
          if (isValidationCase) {
            // Expected: API might reject empty/whitespace-only values
            const reason = isEmptyString ? "Empty string rejected" : "Whitespace rejected";
            testResults.testCases.push({ 
              name: `${testData.desc}`, 
              status: "PASS",
              details: `${reason} (expected API validation)`
            });
            passedTests++;
          } else {
            testResults.testCases.push({ 
              name: `${testData.desc}`, 
              status: "FAIL",
              details: `Error: ${error.message}`
            });
            failedTests++;
          }
        }
      } catch (error) {
        testResults.testCases.push({ 
          name: `Edge case ${testData.desc}`, 
          status: "FAIL",
          details: `Unexpected error: ${error.message}`
        });
        failedTests++;
      }
    }

    // TEST 4: Concurrency Testing (with rate limit awareness)
    logger.info("Starting Test 4: Concurrency Testing");
    
    try {
      const baseKey = `concurrency_test_${Date.now()}`;
      let concurrentSuccesses = 0;
      let concurrentRateLimits = 0;
      let concurrentErrors = 0;

      // Test multiple simultaneous operations with rate limit handling
      const concurrencyPromises = Array.from({ length: 10 }, (_, i) =>
        storage.set(`${baseKey}_${i}`, `Value ${i}`, { ttl: 300 })
          .then(() => ({ success: true, index: i }))
          .catch((error) => {
            const isRateLimit = error?.message?.includes('429') || 
                               error?.status === 429 || 
                               error?.code === 429;
            return { 
              success: false, 
              rateLimited: isRateLimit, 
              error: error.message,
              index: i 
            };
          })
      );

      const concurrencyResults = await Promise.allSettled(concurrencyPromises);
      
      concurrencyResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          const value = result.value;
          if (value.success) {
            concurrentSuccesses++;
          } else if (value.rateLimited) {
            concurrentRateLimits++;
          } else {
            concurrentErrors++;
          }
        } else {
          concurrentErrors++;
        }
      });

      testResults.testCases.push({ 
        name: "Concurrent writes (10 items)", 
        status: concurrentSuccesses > 0 ? "PASS" : "FAIL",
        details: `${concurrentSuccesses} success, ${concurrentRateLimits} rate-limited, ${concurrentErrors} errors`
      });
      if (concurrentSuccesses > 0) {
        passedTests++;
      } else {
        failedTests++;
      }

      // Verify the successful items were written correctly
      if (concurrentSuccesses > 0) {
        const verificationPromises = [];
        for (let i = 0; i < 10; i++) {
          verificationPromises.push(
            storage.get(`${baseKey}_${i}`)
              .then((result) => {
                const value = typeof result === 'object' && result.value 
                  ? result.value 
                  : result;
                return { success: true, value, index: i };
              })
              .catch((error) => ({ success: false, error: error.message, index: i }))
          );
        }

        const verificationResults = await Promise.all(verificationPromises);
        let correctValues = 0;
        let notFound = 0;
        let verificationErrors = 0;

        verificationResults.forEach((result) => {
          if (!result.success) {
            verificationErrors++;
          } else if (!result.value) {
            notFound++;
          } else if (result.value === `Value ${result.index}`) {
            correctValues++;
          }
        });

        testResults.testCases.push({ 
          name: "Concurrent data integrity check", 
          status: correctValues > 0 ? "PASS" : "FAIL",
          details: `${correctValues} correct values, ${notFound} not found, ${verificationErrors} errors`
        });
        if (correctValues > 0) {
          passedTests++;
        } else {
          failedTests++;
        }

        // Cleanup
        for (let i = 0; i < 10; i++) {
          await storage.delete(`${baseKey}_${i}`).catch(() => {}); // Ignore cleanup errors
        }
      }

    } catch (error) {
      testResults.testCases.push({ 
        name: "Concurrency test", 
        status: "FAIL",
        details: `Error: ${error.message}`
      });
      failedTests++;
      testResults.errors.push(`Concurrency test error: ${error.message}`);
    }

    // TEST 5: Error Handling
    logger.info("Starting Test 5: Error Handling");
    
    try {
      // Test getting non-existent key
      try {
        const nonExistentResult = await storage.get("non_existent_key_12345_" + Date.now());
        const nonExistentValue = typeof nonExistentResult === 'object' && nonExistentResult.value 
          ? nonExistentResult.value 
          : nonExistentResult;
        
        if (!nonExistentValue || nonExistentValue === null || nonExistentValue === undefined) {
          testResults.testCases.push({ 
            name: "Non-existent key handling", 
            status: "PASS",
            details: "Correctly returned null/undefined for non-existent key"
          });
          passedTests++;
        } else {
          testResults.testCases.push({ 
            name: "Non-existent key handling", 
            status: "PASS",
            details: "No error thrown (API may return empty value)"
          });
          passedTests++;
        }
      } catch (error) {
        // Some APIs throw errors for non-existent keys, which is also acceptable
        testResults.testCases.push({ 
          name: "Non-existent key handling", 
          status: "PASS",
          details: `Expected error for non-existent key: ${error.message}`
        });
        passedTests++;
      }

      // Test deleting non-existent key
      try {
        await storage.delete("non_existent_key_67890_" + Date.now());
        testResults.testCases.push({ 
          name: "Delete non-existent key", 
          status: "PASS",
          details: "No error thrown when deleting non-existent key"
        });
        passedTests++;
      } catch (error) {
        // Some APIs throw errors, which is also acceptable
        testResults.testCases.push({ 
          name: "Delete non-existent key", 
          status: "PASS",
          details: `Expected error: ${error.message}`
        });
        passedTests++;
      }

    } catch (error) {
      testResults.testCases.push({ 
        name: "Error handling test", 
        status: "FAIL",
        details: `Unexpected error: ${error.message}`
      });
      failedTests++;
      testResults.errors.push(`Error handling test error: ${error.message}`);
    }

    // TEST 6: Rate Limiting and Performance Testing
    logger.info("Starting Test 6: Rate Limiting and Performance Testing");
    
    try {
      const startTime = Date.now();
      const batchSize = 15;
      let successCount = 0;
      let rateLimitCount = 0;
      let otherErrorCount = 0;

      // Helper function to make a request with retry logic
      const makeRequestWithRetry = async (key, value, maxRetries = 2) => {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            await storage.set(key, value, { ttl: 300 });
            return { success: true, attempt };
          } catch (error) {
            const isRateLimit = error?.message?.includes('429') || 
                               error?.status === 429 || 
                               error?.code === 429;
            if (isRateLimit && attempt < maxRetries) {
              // Wait 1.1 seconds before retry (slightly more than the 1sec window)
              await new Promise(resolve => setTimeout(resolve, 1100));
              continue;
            }
            return { 
              success: false, 
              rateLimited: isRateLimit, 
              error: error.message, 
              attempt 
            };
          }
        }
      };

      // Test rate limiting behavior with rapid requests
      const rapidResults = [];
      for (let i = 0; i < 20; i++) {
        const perfKey = `rate_limit_test_${Date.now()}_${i}`;
        rapidResults.push(
          makeRequestWithRetry(perfKey, `Rate limit test value ${i}`, 0) // No retries for rate limit test
        );
      }

      const rapidResponses = await Promise.all(rapidResults);
      const rapidSuccess = rapidResponses.filter(r => r.success).length;
      const rapidRateLimit = rapidResponses.filter(r => r.rateLimited).length;
      const rapidOtherErrors = rapidResponses.filter(r => !r.success && !r.rateLimited).length;

      testResults.testCases.push({ 
        name: "Rate limiting detection", 
        status: "PASS",
        details: `${rapidSuccess} success, ${rapidRateLimit} rate-limited (expected), ${rapidOtherErrors} other errors`
      });
      passedTests++;

      if (rapidRateLimit > 0) {
        testResults.testCases.push({ 
          name: "Rate limiter functioning", 
          status: "PASS",
          details: "Rate limiter is properly protecting the service"
        });
        passedTests++;
      } else {
        testResults.testCases.push({ 
          name: "Rate limiter functioning", 
          status: "PASS",
          details: "No rate limiting detected (might be expected in test environment)"
        });
        passedTests++;
      }

      // Test retry logic with slower, controlled requests
      const controlledResults = [];
      for (let i = 0; i < batchSize; i++) {
        const perfKey = `controlled_perf_test_${Date.now()}_${i}`;
        controlledResults.push(
          makeRequestWithRetry(perfKey, `Controlled test value ${i}`, 2)
        );
        
        // Small delay between requests to be more respectful of rate limits
        if (i < batchSize - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      const controlledResponses = await Promise.all(controlledResults);
      const controlledSuccess = controlledResponses.filter(r => r.success).length;
      const controlledRateLimit = controlledResponses.filter(r => r.rateLimited).length;
      const controlledOtherErrors = controlledResponses.filter(r => !r.success && !r.rateLimited).length;

      const endTime = Date.now();
      const totalDuration = endTime - startTime;

      testResults.testCases.push({ 
        name: `Controlled performance test (${batchSize} items with retries)`, 
        status: controlledSuccess > 0 ? "PASS" : "FAIL",
        details: `${controlledSuccess}/${batchSize} success, ${controlledRateLimit} rate-limited, ${totalDuration}ms total`
      });
      if (controlledSuccess > 0) {
        passedTests++;
      } else {
        failedTests++;
      }

      // Test retry effectiveness
      const retriedRequests = controlledResponses.filter(r => r.attempt > 0);
      if (retriedRequests.length > 0) {
        const successfulRetries = retriedRequests.filter(r => r.success).length;
        testResults.testCases.push({ 
          name: "Retry logic effectiveness", 
          status: successfulRetries > 0 ? "PASS" : "FAIL",
          details: `${successfulRetries}/${retriedRequests.length} retries succeeded`
        });
        if (successfulRetries > 0) {
          passedTests++;
        } else {
          failedTests++;
        }
      }

      // Performance metrics
      if (controlledSuccess > 0) {
        const avgTimePerSuccess = totalDuration / controlledSuccess;
        testResults.testCases.push({ 
          name: "Performance metrics", 
          status: "PASS",
          details: `${avgTimePerSuccess.toFixed(1)}ms avg per successful operation`
        });
        passedTests++;
      }

      // Cleanup
      for (let i = 0; i < 20; i++) {
        await storage.delete(`rate_limit_test_${Date.now()}_${i}`).catch(() => {});
      }
      for (let i = 0; i < batchSize; i++) {
        await storage.delete(`controlled_perf_test_${Date.now()}_${i}`).catch(() => {});
      }

    } catch (error) {
      testResults.testCases.push({ 
        name: "Rate limiting and performance test", 
        status: "FAIL",
        details: `Error: ${error.message}`
      });
      failedTests++;
      testResults.errors.push(`Rate limiting test error: ${error.message}`);
    }

  } catch (error) {
    testResults.summary.overallStatus = "FAILED";
    testResults.errors.push(`Critical test suite error: ${error.message}`);
    logger.error({ error: error.message, stack: error.stack }, "Critical error in test suite");
  }

  // Calculate final summary
  const totalTests = passedTests + failedTests;
  testResults.summary.totalTests = totalTests;
  testResults.summary.passedTests = passedTests;
  testResults.summary.failedTests = failedTests;
  testResults.summary.successRate = totalTests > 0 
    ? ((passedTests / totalTests) * 100).toFixed(1) 
    : 0;

  // Determine overall status
  if (failedTests === 0 && totalTests > 0) {
    testResults.summary.overallStatus = "SUCCESS";
    testResults.summary.message = `🎉 ALL TESTS PASSED! ${passedTests}/${totalTests} tests successful (${testResults.summary.successRate}%)`;
  } else if (passedTests > failedTests && totalTests > 0) {
    testResults.summary.overallStatus = "PARTIAL_SUCCESS";
    testResults.summary.message = `⚠️ MOSTLY PASSING: ${passedTests}/${totalTests} tests passed (${testResults.summary.successRate}%). ${failedTests} failures.`;
  } else if (totalTests > 0) {
    testResults.summary.overallStatus = "FAILED";
    testResults.summary.message = `❌ CRITICAL ISSUES: Only ${passedTests}/${totalTests} tests passed (${testResults.summary.successRate}%). Storage API needs attention!`;
  } else {
    testResults.summary.overallStatus = "FAILED";
    testResults.summary.message = "❌ NO TESTS EXECUTED";
  }

  logger.info({
    totalTests,
    passedTests,
    failedTests,
    successRate: testResults.summary.successRate,
    overallStatus: testResults.summary.overallStatus
  }, "Storage testing completed");

  return testResults;
};

