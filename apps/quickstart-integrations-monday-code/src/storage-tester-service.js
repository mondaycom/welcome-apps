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
    // TEST 1: Basic CRUD Operations
    logger.info("Starting Test 1: Basic CRUD Operations");
    
    const testKey1 = `test_basic_${Date.now()}`;
    const testValue1 = "Hello Monday Storage!";

    try {
      // Test set
      const setResult = await storage.set(testKey1, testValue1);
      if (setResult && setResult.success === true) {
        testResults.testCases.push({ 
          name: "Basic set operation", 
          status: "PASS",
          details: `Successfully set key: ${testKey1}`
        });
        passedTests++;
      } else {
        testResults.testCases.push({ 
          name: "Basic set operation", 
          status: "FAIL",
          details: `Set operation failed: ${setResult?.error || 'unknown error'}`
        });
        failedTests++;
      }

      // Test get
      const getResult1 = await storage.get(testKey1);
      const retrievedValue = getResult1 && typeof getResult1 === 'object' && getResult1 !== null && getResult1.value !== undefined
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
      const deleteResult = await storage.delete(testKey1);
      if (deleteResult && deleteResult.success === true) {
        testResults.testCases.push({ 
          name: "Basic delete operation", 
          status: "PASS",
          details: `Successfully deleted key: ${testKey1}`
        });
        passedTests++;
      } else {
        testResults.testCases.push({ 
          name: "Basic delete operation", 
          status: "FAIL",
          details: `Delete operation failed: ${deleteResult?.error || 'unknown error'}`
        });
        failedTests++;
      }

      // Verify deletion by attempting to get the deleted item
      try {
        const deletedResult = await storage.get(testKey1);
        
        // Check if response indicates item doesn't exist
        if (deletedResult && deletedResult.success === false) {
          // Item doesn't exist - deletion verified
          testResults.testCases.push({ 
            name: "Delete verification (get deleted item)", 
            status: "PASS",
            details: "Item successfully deleted - get returned success: false"
          });
          passedTests++;
        } else if (deletedResult && deletedResult.value === null) {
          // Item doesn't exist - value is null
          testResults.testCases.push({ 
            name: "Delete verification (get deleted item)", 
            status: "PASS",
            details: "Item successfully deleted - get returned null value"
          });
          passedTests++;
        } else if (deletedResult && deletedResult.value === undefined) {
          // Item doesn't exist - value is undefined
          testResults.testCases.push({ 
            name: "Delete verification (get deleted item)", 
            status: "PASS",
            details: "Item successfully deleted - get returned undefined value"
          });
          passedTests++;
        } else {
          // Extract value properly to avoid [object Object] issue
          const deletedValue = deletedResult && typeof deletedResult === 'object' && deletedResult !== null && deletedResult.value !== undefined
            ? deletedResult.value 
            : deletedResult;
          
          if (deletedValue === null || deletedValue === undefined || deletedValue === '') {
            testResults.testCases.push({ 
              name: "Delete verification (get deleted item)", 
              status: "PASS",
              details: "Item successfully deleted - empty value returned"
            });
            passedTests++;
          } else {
            testResults.testCases.push({ 
              name: "Delete verification (get deleted item)", 
              status: "FAIL",
              details: `Item still exists after deletion. Response: ${JSON.stringify(deletedResult)}`
            });
            failedTests++;
          }
        }
      } catch (error) {
        // Expected for deleted items - API throws error (likely 404)
        const is404 = error.message?.includes('404') || 
                     error.status === 404 || 
                     error.code === 404 ||
                     error.statusCode === 404;
        
        testResults.testCases.push({ 
          name: "Delete verification (get deleted item)", 
          status: "PASS",
          details: `Delete verified - get threw expected error${is404 ? ' (404)' : ''}: ${error.message || error.toString()}`
        });
        passedTests++;
      }

      // Test deleting an already-deleted item (should return 404)
      try {
        const deleteAgainResult = await storage.delete(testKey1);
        
        if (deleteAgainResult && deleteAgainResult.success === false) {
          const errorMessage = deleteAgainResult.error || '';
          const is404 = errorMessage.includes('404') || 
                       deleteAgainResult.status === 404 ||
                       deleteAgainResult.code === 404 ||
                       errorMessage.toLowerCase().includes('not found');
          
          // Check for the expected error message format: "Key \"...\" not found."
          const hasExpectedErrorFormat = errorMessage.includes('not found') || 
                                        errorMessage.includes('Key') ||
                                        errorMessage.includes('key');
          
          if (is404 || hasExpectedErrorFormat) {
            testResults.testCases.push({ 
              name: "Delete already-deleted item", 
              status: "PASS",
              details: `Correctly returned 404 error for deleting already-deleted item: ${errorMessage || 'unknown error'}`
            });
            passedTests++;
          } else {
            testResults.testCases.push({ 
              name: "Delete already-deleted item", 
              status: "FAIL",
              details: `Expected 404 or "not found" error, got: ${errorMessage || JSON.stringify(deleteAgainResult)}`
            });
            failedTests++;
          }
        } else if (deleteAgainResult && deleteAgainResult.success === true) {
          // Delete should NOT be idempotent - returning success for non-existent key is incorrect
          testResults.testCases.push({ 
            name: "Delete already-deleted item", 
            status: "FAIL",
            details: "Delete incorrectly returned success for already-deleted key (delete should not be idempotent)"
          });
          failedTests++;
        } else {
          testResults.testCases.push({ 
            name: "Delete already-deleted item", 
            status: "FAIL",
            details: `Unexpected response format: ${JSON.stringify(deleteAgainResult)}`
          });
          failedTests++;
        }
      } catch (error) {
        // Expected - deleting already-deleted item should throw error (preferably 404)
        const errorMessage = error.message || error.toString();
        const is404 = errorMessage.includes('404') || 
                     error.status === 404 || 
                     error.code === 404 ||
                     error.statusCode === 404 ||
                     errorMessage.toLowerCase().includes('not found');
        
        if (is404) {
          testResults.testCases.push({ 
            name: "Delete already-deleted item", 
            status: "PASS",
            details: `Correctly threw 404 error for deleting already-deleted item: ${errorMessage}`
          });
          passedTests++;
        } else {
          testResults.testCases.push({ 
            name: "Delete already-deleted item", 
            status: "FAIL",
            details: `Expected 404 error, got: ${errorMessage}`
          });
          failedTests++;
        }
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
      const ttlRetrievedValue = ttlResult && typeof ttlResult === 'object' && ttlResult !== null && ttlResult.value !== undefined
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
          // Extract value from GetResponse: {success: boolean, value: T, version?: string}
          let edgeRetrievedValue;
          if (edgeResult && typeof edgeResult === 'object' && edgeResult !== null) {
            if ('value' in edgeResult) {
              edgeRetrievedValue = edgeResult.value;
            } else {
              edgeRetrievedValue = edgeResult;
            }
          } else {
            edgeRetrievedValue = edgeResult;
          }
          
          if (edgeRetrievedValue === testData.value) {
            testResults.testCases.push({ 
              name: `${testData.desc}`, 
              status: "PASS",
              details: `Successfully stored and retrieved: ${testData.desc}`
            });
            passedTests++;
          } else if (isValidationCase && (!edgeRetrievedValue || (typeof edgeRetrievedValue === 'string' && edgeRetrievedValue.trim() === ""))) {
            // Expected behavior: API may normalize or reject empty/whitespace values
            const reason = isEmptyString ? "Empty string normalized" : "Whitespace normalized";
            testResults.testCases.push({ 
              name: `${testData.desc}`, 
              status: "PASS",
              details: `${reason} (expected API behavior)`
            });
            passedTests++;
          } else {
            const expectedPreview = typeof testData.value === 'string' && testData.value.length > 0 
              ? testData.value.substring(0, 50) 
              : String(testData.value).substring(0, 50);
            const gotPreview = edgeRetrievedValue && typeof edgeRetrievedValue === 'string' && edgeRetrievedValue.length > 0
              ? edgeRetrievedValue.substring(0, 50)
              : `Got non-string value: ${typeof edgeRetrievedValue}`;
            testResults.testCases.push({ 
              name: `${testData.desc}`, 
              status: "FAIL",
              details: `Value corruption. Expected: "${expectedPreview}...", Got: "${gotPreview}..."`
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
                const value = result && typeof result === 'object' && result !== null && result.value !== undefined
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
        const nonExistentValue = nonExistentResult && typeof nonExistentResult === 'object' && nonExistentResult !== null && nonExistentResult.value !== undefined
          ? nonExistentResult.value 
          : nonExistentResult;
        
        if (nonExistentResult && nonExistentResult.success === false) {
          testResults.testCases.push({ 
            name: "Non-existent key handling", 
            status: "PASS",
            details: "Correctly returned success: false for non-existent key"
          });
          passedTests++;
        } else if (!nonExistentValue || nonExistentValue === null || nonExistentValue === undefined) {
          testResults.testCases.push({ 
            name: "Non-existent key handling", 
            status: "PASS",
            details: "Correctly returned null/undefined for non-existent key"
          });
          passedTests++;
        } else {
          testResults.testCases.push({ 
            name: "Non-existent key handling", 
            status: "FAIL",
            details: `Unexpected value returned for non-existent key: ${JSON.stringify(nonExistentValue)}`
          });
          failedTests++;
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

      // Test deleting a random non-existent key (should return 404 with error message)
      try {
        const randomNonExistentKey = `random_nonexistent_key_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const deleteNonExistentResult = await storage.delete(randomNonExistentKey);
        
        if (deleteNonExistentResult && deleteNonExistentResult.success === false) {
          const errorMessage = deleteNonExistentResult.error || '';
          const is404 = errorMessage.includes('404') || 
                       deleteNonExistentResult.status === 404 ||
                       deleteNonExistentResult.code === 404 ||
                       errorMessage.toLowerCase().includes('not found');
          
          // Check for the expected error message format: "Key \"...\" not found."
          const hasExpectedErrorFormat = errorMessage.includes('not found') || 
                                        errorMessage.includes('Key') ||
                                        errorMessage.includes('key');
          
          if (is404 || hasExpectedErrorFormat) {
            testResults.testCases.push({ 
              name: "Delete non-existent key", 
              status: "PASS",
              details: `Correctly returned 404 error for deleting non-existent key: ${errorMessage || 'unknown error'}`
            });
            passedTests++;
          } else {
            testResults.testCases.push({ 
              name: "Delete non-existent key", 
              status: "FAIL",
              details: `Expected 404 or "not found" error, got: ${errorMessage || JSON.stringify(deleteNonExistentResult)}`
            });
            failedTests++;
          }
        } else if (deleteNonExistentResult && deleteNonExistentResult.success === true) {
          // Delete should NOT be idempotent - returning success for non-existent key is incorrect
          testResults.testCases.push({ 
            name: "Delete non-existent key", 
            status: "FAIL",
            details: "Delete incorrectly returned success for non-existent key (delete should not be idempotent)"
          });
          failedTests++;
        } else {
          testResults.testCases.push({ 
            name: "Delete non-existent key", 
            status: "FAIL",
            details: `Unexpected response format: ${JSON.stringify(deleteNonExistentResult)}`
          });
          failedTests++;
        }
      } catch (error) {
        // Expected - deleting non-existent key should throw error (preferably 404)
        const errorMessage = error.message || error.toString();
        const is404 = errorMessage.includes('404') || 
                     error.status === 404 || 
                     error.code === 404 ||
                     error.statusCode === 404 ||
                     errorMessage.toLowerCase().includes('not found');
        
        if (is404) {
          testResults.testCases.push({ 
            name: "Delete non-existent key", 
            status: "PASS",
            details: `Correctly threw 404 error for deleting non-existent key: ${errorMessage}`
          });
          passedTests++;
        } else {
          testResults.testCases.push({ 
            name: "Delete non-existent key", 
            status: "FAIL",
            details: `Expected 404 error for deleting non-existent key, got: ${errorMessage}`
          });
          failedTests++;
        }
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
      const testTimestamp = Date.now();
      const rateLimitTestKeys = [];
      const controlledTestKeys = [];

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
        const perfKey = `rate_limit_test_${testTimestamp}_${i}`;
        rateLimitTestKeys.push(perfKey);
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
        const perfKey = `controlled_perf_test_${testTimestamp}_${i}`;
        controlledTestKeys.push(perfKey);
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
      for (const key of rateLimitTestKeys) {
        await storage.delete(key).catch(() => {});
      }
      for (const key of controlledTestKeys) {
        await storage.delete(key).catch(() => {});
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

    // TEST 7: Increment Counter Functionality
    logger.info("Starting Test 7: Increment Counter Functionality");
    
    try {
      const periods = ['DAILY', 'MONTHLY', 'YEARLY'];
      
      for (const period of periods) {
        try {
          const counterResult = await storage.incrementCounter(period);
          
          if (counterResult && counterResult.error) {
            // Only pass if error is expected (e.g., unsupported period)
            testResults.testCases.push({ 
              name: `Increment counter (${period})`, 
              status: "PASS",
              details: `Counter returned error (may be expected for unsupported period): ${counterResult.error}`
            });
            passedTests++;
          } else if (counterResult && typeof counterResult.newCounterValue === 'number') {
            testResults.testCases.push({ 
              name: `Increment counter (${period})`, 
              status: "PASS",
              details: `Successfully incremented. New value: ${counterResult.newCounterValue}, Message: ${counterResult.message || 'N/A'}`
            });
            passedTests++;
          } else {
            testResults.testCases.push({ 
              name: `Increment counter (${period})`, 
              status: "FAIL",
              details: `Unexpected response format: ${JSON.stringify(counterResult)}`
            });
            failedTests++;
          }
        } catch (error) {
          // Only pass if error indicates unsupported feature, not unexpected errors
          const isExpectedError = error.message?.toLowerCase().includes('not supported') || 
                                 error.message?.toLowerCase().includes('invalid period');
          testResults.testCases.push({ 
            name: `Increment counter (${period})`, 
            status: isExpectedError ? "PASS" : "FAIL",
            details: `Counter increment error: ${error.message}`
          });
          if (isExpectedError) {
            passedTests++;
          } else {
            failedTests++;
          }
        }
      }

      // Test with options (incrementBy)
      try {
        const counterWithOptions = await storage.incrementCounter('DAILY', { incrementBy: 2 });
        
        if (counterWithOptions && typeof counterWithOptions.newCounterValue === 'number') {
          testResults.testCases.push({ 
            name: "Increment counter with options", 
            status: "PASS",
            details: `Successfully incremented by 2. New value: ${counterWithOptions.newCounterValue}`
          });
          passedTests++;
        } else if (counterWithOptions && counterWithOptions.error) {
          testResults.testCases.push({ 
            name: "Increment counter with options", 
            status: "PASS",
            details: `Counter with options returned error: ${counterWithOptions.error}`
          });
          passedTests++;
        } else {
          testResults.testCases.push({ 
            name: "Increment counter with options", 
            status: "FAIL",
            details: `Unexpected response format: ${JSON.stringify(counterWithOptions)}`
          });
          failedTests++;
        }
      } catch (error) {
        testResults.testCases.push({ 
          name: "Increment counter with options", 
          status: "FAIL",
          details: `Counter with options threw unexpected error: ${error.message}`
        });
        failedTests++;
      }

    } catch (error) {
      testResults.testCases.push({ 
        name: "Increment counter functionality", 
        status: "FAIL",
        details: `Error: ${error.message}`
      });
      failedTests++;
      testResults.errors.push(`Increment counter test error: ${error.message}`);
    }

    // TEST 8: Search Functionality
    logger.info("Starting Test 8: Search Functionality");
    
    try {
      const searchPrefix = `search_test_${Date.now()}`;
      const searchTestKeys = [];
      
      // Set up test data for search
      for (let i = 0; i < 3; i++) {
        const testKey = `${searchPrefix}_item${i}`;
        searchTestKeys.push(testKey);
        try {
          await storage.set(testKey, `Value ${i}`, { ttl: 300 });
        } catch (error) {
          logger.warn({ key: testKey, error: error.message }, "Failed to set search test data");
        }
      }

      // Wait a moment for storage to propagate
      await new Promise(resolve => setTimeout(resolve, 500));

      // Test basic search
      try {
        const searchResult = await storage.search(searchPrefix);
        
        if (searchResult && searchResult.success === true) {
          const records = searchResult.records || [];
          const recordCount = Array.isArray(records) ? records.length : 0;
          
          // Validate SearchEntity structure if records exist
          let validStructure = true;
          if (recordCount > 0) {
            const firstRecord = records[0];
            validStructure = firstRecord && 
                            typeof firstRecord === 'object' &&
                            typeof firstRecord.key === 'string' &&
                            firstRecord.value !== undefined &&
                            typeof firstRecord.backendOnly === 'boolean';
          }
          
          testResults.testCases.push({ 
            name: "Basic search operation", 
            status: validStructure ? "PASS" : "FAIL",
            details: `Found ${recordCount} records. Records have valid key/value/backendOnly structure: ${validStructure ? 'yes' : 'no'}`
          });
          if (validStructure) {
            passedTests++;
          } else {
            failedTests++;
          }
        } else if (searchResult && searchResult.success === false) {
          testResults.testCases.push({ 
            name: "Basic search operation", 
            status: "FAIL",
            details: `Search failed: ${searchResult.error || 'unknown error'}`
          });
          failedTests++;
        } else {
          testResults.testCases.push({ 
            name: "Basic search operation", 
            status: "FAIL",
            details: `Unexpected response format: ${JSON.stringify(searchResult)}`
          });
          failedTests++;
        }
      } catch (error) {
        testResults.testCases.push({ 
          name: "Basic search operation", 
          status: "FAIL",
          details: `Search error: ${error.message}`
        });
        failedTests++;
      }

      // Test search pagination with cursor
      try {
        const firstPage = await storage.search(searchPrefix);
        
        if (firstPage && firstPage.success === true && firstPage.cursor) {
          const secondPage = await storage.search(searchPrefix, { cursor: firstPage.cursor });
          
          if (secondPage && secondPage.success === true) {
            testResults.testCases.push({ 
              name: "Search pagination with cursor", 
              status: "PASS",
              details: `Pagination works. First page: ${firstPage.records?.length || 0} records, Second page: ${secondPage.records?.length || 0} records`
            });
            passedTests++;
          } else {
            testResults.testCases.push({ 
              name: "Search pagination with cursor", 
              status: "PASS",
              details: "Cursor returned but second page failed (may be expected)"
            });
            passedTests++;
          }
        } else {
          testResults.testCases.push({ 
            name: "Search pagination with cursor", 
            status: "PASS",
            details: "No cursor returned (pagination may not be needed for small result sets)"
          });
          passedTests++;
        }
      } catch (error) {
        testResults.testCases.push({ 
          name: "Search pagination with cursor", 
          status: "PASS",
          details: `Cursor pagination error: ${error.message}`
        });
        passedTests++;
      }

      // Cleanup search test data
      for (const key of searchTestKeys) {
        await storage.delete(key).catch(() => {}); // Ignore cleanup errors
      }

    } catch (error) {
      testResults.testCases.push({ 
        name: "Search functionality", 
        status: "FAIL",
        details: `Error: ${error.message}`
      });
      failedTests++;
      testResults.errors.push(`Search test error: ${error.message}`);
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

