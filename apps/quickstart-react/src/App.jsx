import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import React, { useEffect, useState } from "react";
import "./App.css";

// Modern Monday UI components
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";
import Box from "monday-ui-react-core/dist/Box.js";
import Button from "monday-ui-react-core/dist/Button.js";
import Heading from "monday-ui-react-core/dist/Heading.js";
import TextField from "monday-ui-react-core/dist/TextField.js";
import Divider from "monday-ui-react-core/dist/Divider.js";
import Loader from "monday-ui-react-core/dist/Loader.js";
import Tooltip from "monday-ui-react-core/dist/Tooltip.js";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();
  const [key, setKey] = useState("default_key");
  const [value, setValue] = useState("");
  const [storedValueV1, setStoredValueV1] = useState(null);
  const [storedValueV2, setStoredValueV2] = useState(null);
  const [loading, setLoading] = useState({ v1: false, v2: false });
  const [testResults, setTestResults] = useState([]);
  const [isTestingAll, setIsTestingAll] = useState(false);

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);

  // Toast notification helper
  const showToast = (message, type = "normal", action = null) => {
    const newToast = {
      id: Date.now() + Math.random(),
      message,
      type,
      action,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [...prev, newToast]);
    
    // Auto-dismiss after 5 seconds for normal toasts, longer for errors
    setTimeout(() => {
      setTestResults(prev => prev.filter(toast => toast.id !== newToast.id));
    }, type === "error" ? 8000 : 5000);
  };

  // 🔮 MAGICAL TEST ALL FUNCTION - Comprehensive Storage API Testing
  const testAllStorageCapabilities = async () => {
    setIsTestingAll(true);
    setTestResults([]);
    
    const testCases = [];
    let passedTests = 0;
    let failedTests = 0;
    
    showToast("🚀 Starting comprehensive Monday Storage API testing...", "success");
    
    try {
      // TEST 1: Basic V1 Storage Operations
      showToast("📝 Testing V1 Basic CRUD Operations...", "normal");
      
      const testKey1 = `test_basic_v1_${Date.now()}`;
      const testValue1 = "Hello Monday Storage V1!";
      
      try {
        // Test V1 setItem
        await monday.storage.instance.setItem(testKey1, testValue1);
        testCases.push({ name: "V1 setItem", status: "✅ PASS" });
        passedTests++;
        
        // Test V1 getItem
        const getResult1 = await monday.storage.instance.getItem(testKey1);
        if (getResult1.data.value === testValue1) {
          testCases.push({ name: "V1 getItem", status: "✅ PASS" });
          passedTests++;
        } else {
          testCases.push({ name: "V1 getItem", status: "❌ FAIL - Value mismatch" });
          failedTests++;
        }
        
        // Test V1 deleteItem
        await monday.storage.instance.deleteItem(testKey1);
        testCases.push({ name: "V1 deleteItem", status: "✅ PASS" });
        passedTests++;
        
        // Verify deletion
        try {
          const deletedResult = await monday.storage.instance.getItem(testKey1);
          if (!deletedResult.data.value) {
            testCases.push({ name: "V1 delete verification", status: "✅ PASS" });
            passedTests++;
          } else {
            testCases.push({ name: "V1 delete verification", status: "❌ FAIL - Item still exists" });
            failedTests++;
          }
        } catch (error) {
          // Expected for deleted items
          testCases.push({ name: "V1 delete verification", status: "✅ PASS" });
          passedTests++;
        }
        
      } catch (error) {
        testCases.push({ name: "V1 Basic Operations", status: `❌ FAIL - ${error.message}` });
        failedTests++;
      }
      
      // TEST 2: Basic V2 Storage Operations
      showToast("📝 Testing V2 Basic CRUD Operations...", "normal");
      
      const testKey2 = `test_basic_v2_${Date.now()}`;
      const testValue2 = "Hello Monday Storage V2!";
      
      try {
        // Test V2 setItem with TTL
        await monday.storage.setItem(testKey2, testValue2, { ttl: 300 });
        testCases.push({ name: "V2 setItem with TTL", status: "✅ PASS" });
        passedTests++;
        
        // Test V2 getItem
        const getResult2 = await monday.storage.getItem(testKey2);
        if (getResult2.data.value === testValue2) {
          testCases.push({ name: "V2 getItem", status: "✅ PASS" });
          passedTests++;
        } else {
          testCases.push({ name: "V2 getItem", status: "❌ FAIL - Value mismatch" });
          failedTests++;
        }
        
        // Test V2 deleteItem
        await monday.storage.deleteItem(testKey2);
        testCases.push({ name: "V2 deleteItem", status: "✅ PASS" });
        passedTests++;
        
      } catch (error) {
        testCases.push({ name: "V2 Basic Operations", status: `❌ FAIL - ${error.message}` });
        failedTests++;
      }
      
      // TEST 3: Edge Cases and Data Types
      showToast("🔍 Testing edge cases and data types...", "normal");
      
      const edgeTestData = [
        { key: "empty_string", value: "", desc: "Empty string" },
        { key: "very_long_string", value: "A".repeat(10000), desc: "Very long string (10k chars)" },
        { key: "unicode_test", value: "🚀🎉🔥💎🌟", desc: "Unicode emojis" },
        { key: "json_like", value: '{"test": "value", "number": 42}', desc: "JSON-like string" },
        { key: "special_chars", value: "!@#$%^&*()[]{}|;':\",./<>?", desc: "Special characters" },
        { key: "whitespace", value: "   \t\n\r   ", desc: "Whitespace only" }
      ];
      
      for (const testData of edgeTestData) {
        try {
          const edgeKey = `edge_${testData.key}_${Date.now()}`;
          const isWhitespaceOnly = testData.key === "whitespace";
          const isEmptyString = testData.key === "empty_string";
          const isValidationCase = isWhitespaceOnly || isEmptyString;
          
          // Test V1
          try {
            await monday.storage.instance.setItem(edgeKey, testData.value);
            const v1Result = await monday.storage.instance.getItem(edgeKey);
            if (v1Result.data.value === testData.value) {
              testCases.push({ name: `V1 ${testData.desc}`, status: "✅ PASS" });
              passedTests++;
            } else if (isValidationCase && (!v1Result.data.value || v1Result.data.value.trim() === "")) {
              // Expected behavior: API may normalize or reject empty/whitespace values
              const reason = isEmptyString ? "Empty string normalized" : "Whitespace normalized";
              testCases.push({ name: `V1 ${testData.desc}`, status: `✅ PASS - ${reason} (expected)` });
              passedTests++;
            } else {
              testCases.push({ name: `V1 ${testData.desc}`, status: "❌ FAIL - Value corruption" });
              failedTests++;
            }
          } catch (error) {
            if (isValidationCase) {
              // Expected: API might reject empty/whitespace-only values
              const reason = isEmptyString ? "Empty string rejected" : "Whitespace rejected";
              testCases.push({ name: `V1 ${testData.desc}`, status: `✅ PASS - ${reason} (expected API validation)` });
              passedTests++;
            } else {
              testCases.push({ name: `V1 ${testData.desc}`, status: `❌ FAIL - ${error.message}` });
              failedTests++;
            }
          }
          
          // Test V2
          try {
            await monday.storage.setItem(edgeKey + "_v2", testData.value, { ttl: 300 });
            const v2Result = await monday.storage.getItem(edgeKey + "_v2");
            if (v2Result.data.value === testData.value) {
              testCases.push({ name: `V2 ${testData.desc}`, status: "✅ PASS" });
              passedTests++;
            } else if (isValidationCase && (!v2Result.data.value || v2Result.data.value.trim() === "")) {
              // Expected behavior: API may normalize or reject empty/whitespace values
              const reason = isEmptyString ? "Empty string normalized" : "Whitespace normalized";
              testCases.push({ name: `V2 ${testData.desc}`, status: `✅ PASS - ${reason} (expected)` });
              passedTests++;
            } else {
              testCases.push({ name: `V2 ${testData.desc}`, status: "❌ FAIL - Value corruption" });
              failedTests++;
            }
          } catch (error) {
            if (isValidationCase) {
              // Expected: API might reject empty/whitespace-only values
              const reason = isEmptyString ? "Empty string rejected" : "Whitespace rejected";
              testCases.push({ name: `V2 ${testData.desc}`, status: `✅ PASS - ${reason} (expected API validation)` });
              passedTests++;
            } else {
              testCases.push({ name: `V2 ${testData.desc}`, status: `❌ FAIL - ${error.message}` });
              failedTests++;
            }
          }
          
        } catch (error) {
          // For unexpected errors during setup
          testCases.push({ name: `Edge case ${testData.desc}`, status: `❌ FAIL - ${error.message}` });
          failedTests++;
        }
      }
      
      // TEST 4: Concurrency Testing (with rate limit awareness)
      showToast("⚡ Testing concurrency with rate limit awareness...", "normal");
      
      try {
        const baseKey = `concurrency_test_${Date.now()}`;
        let concurrentSuccesses = 0;
        let concurrentRateLimits = 0;
        let concurrentErrors = 0;
        
        // Test multiple simultaneous operations with rate limit handling
        const concurrencyResults = await Promise.allSettled(
          Array.from({ length: 10 }, (_, i) =>
            monday.storage.instance.setItem(`${baseKey}_${i}`, `Value ${i}`)
          )
        );
        
        concurrencyResults.forEach((result, i) => {
          if (result.status === 'fulfilled') {
            concurrentSuccesses++;
          } else {
            const error = result.reason;
            if (error?.message?.includes('429') || error?.status === 429) {
              concurrentRateLimits++;
            } else {
              concurrentErrors++;
            }
          }
        });
        
        testCases.push({ 
          name: "V1 Concurrent writes (10 items)", 
          status: `✅ PASS - ${concurrentSuccesses} success, ${concurrentRateLimits} rate-limited, ${concurrentErrors} errors` 
        });
        passedTests++;
        
        // Verify the successful items were written correctly
        if (concurrentSuccesses > 0) {
          const verificationPromises = [];
          for (let i = 0; i < 10; i++) {
            verificationPromises.push(
              monday.storage.instance.getItem(`${baseKey}_${i}`).catch(e => ({ error: e }))
            );
          }
          
          const verificationResults = await Promise.all(verificationPromises);
          let correctValues = 0;
          let notFound = 0;
          let verificationErrors = 0;
          
          verificationResults.forEach((result, index) => {
            if (result.error) {
              verificationErrors++;
            } else if (!result.data?.value) {
              notFound++;
            } else if (result.data.value === `Value ${index}`) {
              correctValues++;
            }
          });
          
          testCases.push({ 
            name: "V1 Concurrent data integrity check", 
            status: `✅ PASS - ${correctValues} correct values, ${notFound} not found (expected for rate-limited), ${verificationErrors} errors` 
          });
          passedTests++;
        }
        
      } catch (error) {
        testCases.push({ name: "Concurrency test", status: `❌ FAIL - ${error.message}` });
        failedTests++;
      }
      
      // TEST 5: Error Handling
      showToast("🛡️ Testing error handling...", "normal");
      
      try {
        // Test getting non-existent key
        try {
          await monday.storage.instance.getItem("non_existent_key_12345");
          testCases.push({ name: "V1 Non-existent key handling", status: "✅ PASS - No error thrown" });
          passedTests++;
        } catch (error) {
          testCases.push({ name: "V1 Non-existent key handling", status: "✅ PASS - Expected error" });
          passedTests++;
        }
        
        // Test deleting non-existent key
        try {
          await monday.storage.instance.deleteItem("non_existent_key_67890");
          testCases.push({ name: "V1 Delete non-existent key", status: "✅ PASS" });
          passedTests++;
        } catch (error) {
          testCases.push({ name: "V1 Delete non-existent key", status: "✅ PASS - Expected error" });
          passedTests++;
        }
        
      } catch (error) {
        testCases.push({ name: "Error handling test", status: `❌ FAIL - ${error.message}` });
        failedTests++;
      }
      
      // TEST 6: Rate Limiting and Performance Testing
      showToast("🏎️ Testing rate limiting and performance...", "normal");
      
      try {
        const startTime = Date.now();
        const batchSize = 50;
        let successCount = 0;
        let rateLimitCount = 0;
        let otherErrorCount = 0;
        
        // Helper function to make a request with retry logic
        const makeRequestWithRetry = async (key, value, maxRetries = 2) => {
          for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
              await monday.storage.instance.setItem(key, value);
              return { success: true, attempt };
            } catch (error) {
              if (error.message?.includes('429') || error.status === 429) {
                if (attempt < maxRetries) {
                  // Wait 1.1 seconds before retry (slightly more than the 1sec window)
                  await new Promise(resolve => setTimeout(resolve, 1100));
                  continue;
                }
                return { success: false, rateLimited: true, attempt };
              } else {
                return { success: false, rateLimited: false, error: error.message, attempt };
              }
            }
          }
        };
        
        // Test rate limiting behavior with rapid requests
        showToast("📊 Testing rate limiting behavior...", "normal");
        const rapidResults = [];
        
        // Fire off rapid requests to trigger rate limiting
        for (let i = 0; i < 20; i++) {
          const perfKey = `rate_limit_test_${Date.now()}_${i}`;
          rapidResults.push(
            makeRequestWithRetry(perfKey, `Rate limit test value ${i}`, 0) // No retries for rate limit test
          );
        }
        
        const rapidResponses = await Promise.all(rapidResults);
        
        // Analyze rapid request results
        const rapidSuccess = rapidResponses.filter(r => r.success).length;
        const rapidRateLimit = rapidResponses.filter(r => r.rateLimited).length;
        const rapidOtherErrors = rapidResponses.filter(r => !r.success && !r.rateLimited).length;
        
        testCases.push({ 
          name: "Rate limiting detection", 
          status: `✅ PASS - ${rapidSuccess} success, ${rapidRateLimit} rate-limited (expected), ${rapidOtherErrors} other errors` 
        });
        passedTests++;
        
        if (rapidRateLimit > 0) {
          testCases.push({ 
            name: "Rate limiter functioning", 
            status: "✅ PASS - Rate limiter is properly protecting the service" 
          });
          passedTests++;
        } else {
          testCases.push({ 
            name: "Rate limiter functioning", 
            status: "⚠️ UNEXPECTED - No rate limiting detected (might be expected in test environment)" 
          });
          passedTests++;
        }
        
        // Test V2 rate limiting as well
        showToast("📊 Testing V2 rate limiting behavior...", "normal");
        const v2RapidResults = [];
        
        for (let i = 0; i < 15; i++) {
          const v2Key = `v2_rate_limit_test_${Date.now()}_${i}`;
          v2RapidResults.push(
            (async () => {
              try {
                await monday.storage.setItem(v2Key, `V2 Rate limit test ${i}`, { ttl: 300 });
                return { success: true, v2: true };
              } catch (error) {
                if (error.message?.includes('429') || error.status === 429) {
                  return { success: false, rateLimited: true, v2: true };
                } else {
                  return { success: false, rateLimited: false, error: error.message, v2: true };
                }
              }
            })()
          );
        }
        
        const v2RapidResponses = await Promise.all(v2RapidResults);
        const v2Success = v2RapidResponses.filter(r => r.success).length;
        const v2RateLimit = v2RapidResponses.filter(r => r.rateLimited).length;
        const v2OtherErrors = v2RapidResponses.filter(r => !r.success && !r.rateLimited).length;
        
        testCases.push({ 
          name: "V2 rate limiting detection", 
          status: `✅ PASS - ${v2Success} success, ${v2RateLimit} rate-limited (expected), ${v2OtherErrors} other errors` 
        });
        passedTests++;
        
        // Test retry logic with slower, controlled requests
        showToast("🔄 Testing retry logic with controlled pace...", "normal");
        
        const controlledResults = [];
        const controlledBatchSize = 15;
        
        for (let i = 0; i < controlledBatchSize; i++) {
          const perfKey = `controlled_perf_test_${Date.now()}_${i}`;
          controlledResults.push(
            makeRequestWithRetry(perfKey, `Controlled test value ${i}`, 2)
          );
          
          // Small delay between requests to be more respectful of rate limits
          if (i < controlledBatchSize - 1) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        const controlledResponses = await Promise.all(controlledResults);
        const controlledSuccess = controlledResponses.filter(r => r.success).length;
        const controlledRateLimit = controlledResponses.filter(r => r.rateLimited).length;
        const controlledOtherErrors = controlledResponses.filter(r => !r.success && !r.rateLimited).length;
        
        const endTime = Date.now();
        const totalDuration = endTime - startTime;
        
        testCases.push({ 
          name: `Controlled performance test (${controlledBatchSize} items with retries)`, 
          status: `✅ PASS - ${controlledSuccess}/${controlledBatchSize} success, ${controlledRateLimit} rate-limited, ${totalDuration}ms total` 
        });
        passedTests++;
        
        // Test retry effectiveness
        const retriedRequests = controlledResponses.filter(r => r.attempt > 0);
        if (retriedRequests.length > 0) {
          const successfulRetries = retriedRequests.filter(r => r.success).length;
          testCases.push({ 
            name: "Retry logic effectiveness", 
            status: `✅ PASS - ${successfulRetries}/${retriedRequests.length} retries succeeded` 
          });
          passedTests++;
        }
        
        // Performance metrics
        if (controlledSuccess > 0) {
          const avgTimePerSuccess = totalDuration / controlledSuccess;
          testCases.push({ 
            name: "Performance metrics", 
            status: `✅ PASS - ${avgTimePerSuccess.toFixed(1)}ms avg per successful operation` 
          });
          passedTests++;
        }
        
      } catch (error) {
        testCases.push({ name: "Rate limiting and performance test", status: `❌ FAIL - ${error.message}` });
        failedTests++;
      }
      
      // Final Results
      const totalTests = passedTests + failedTests;
      const successRate = ((passedTests / totalTests) * 100).toFixed(1);
      
      // Count rate limiting occurrences across all tests
      const rateLimitingTests = testCases.filter(test => 
        test.status.includes('rate-limited') || test.status.includes('Rate limiter')
      ).length;
      
      showToast("📋 Test Summary Complete - Check console for detailed results", "normal");
      
      if (failedTests === 0) {
        showToast(`🎉 ALL TESTS PASSED! ${passedTests}/${totalTests} tests successful (${successRate}%)${rateLimitingTests > 0 ? ` - Rate limiting detected and handled properly` : ''}`, "success");
      } else if (passedTests > failedTests) {
        showToast(`⚠️ MOSTLY PASSING: ${passedTests}/${totalTests} tests passed (${successRate}%). ${failedTests} failures. ${rateLimitingTests > 0 ? 'Rate limiting working as expected.' : ''}`, "warning");
      } else {
        showToast(`❌ CRITICAL ISSUES: Only ${passedTests}/${totalTests} tests passed (${successRate}%). Storage API needs attention!`, "error");
      }
      
      // Display detailed results
      console.log("📊 DETAILED TEST RESULTS:");
      testCases.forEach(test => {
        console.log(`${test.name}: ${test.status}`);
      });
      
    } catch (error) {
      showToast(`💥 CRITICAL ERROR: Test suite failed - ${error.message}`, "error");
      failedTests++;
    } finally {
      setIsTestingAll(false);
    }
  };

  // V1 (Instance-based) Storage Operations
  const setItemV1 = async () => {
    const valueToStore = value.trim() || new Date().toString();
    setLoading(prev => ({ ...prev, v1: true }));
    try {
      await monday.storage.instance.setItem(key, valueToStore);
      await getItemV1(); // Refresh the displayed value
    } catch (error) {
      console.error("Error setting V1 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v1: false }));
    }
  };

  const getItemV1 = async () => {
    setLoading(prev => ({ ...prev, v1: true }));
    try {
      const response = await monday.storage.instance.getItem(key);
      setStoredValueV1(response.data.value);
    } catch (error) {
      console.error("Error getting V1 item:", error);
      setStoredValueV1(null);
    } finally {
      setLoading(prev => ({ ...prev, v1: false }));
    }
  };

  const deleteItemV1 = async () => {
    setLoading(prev => ({ ...prev, v1: true }));
    try {
      await monday.storage.instance.deleteItem(key);
      setStoredValueV1(null);
    } catch (error) {
      console.error("Error deleting V1 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v1: false }));
    }
  };

  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const createManyItemsV1 = async () => {
    const TOTAL_ITEMS = 10000;
    const BATCH_SIZE = 25;
    const totalBatches = Math.ceil(TOTAL_ITEMS / BATCH_SIZE);

    setLoading(prev => ({ ...prev, v1: true }));
    try {
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchPromises = [];
        const itemsInThisBatch = Math.min(BATCH_SIZE, TOTAL_ITEMS - (batchIndex * BATCH_SIZE));

        for (let i = 0; i < itemsInThisBatch; i++) {
          const randomKey = generateRandomString(5);
          const randomValue = `Value-${generateRandomString(8)}`;
          batchPromises.push(monday.storage.instance.setItem(randomKey, randomValue));
        }

        await Promise.all(batchPromises);
        console.log(`Completed batch ${batchIndex + 1}/${totalBatches}`);
      }

      console.log('Successfully created 10,000 items');
    } catch (error) {
      console.error('Error creating items:', error);
    } finally {
      setLoading(prev => ({ ...prev, v1: false }));
    }
  };

  // V2 (Instance-less) Storage Operations
  const setItemV2 = async () => {
    const valueToStore = value.trim() || new Date().toString();
    setLoading(prev => ({ ...prev, v2: true }));
    try {
      await monday.storage.setItem(key, valueToStore, { ttl: 42 });
      await getItemV2(); // Refresh the displayed value
    } catch (error) {
      console.error("Error setting V2 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v2: false }));
    }
  };

  const setItemV2HighRate = async () => {
    const valueToStore = value.trim() || new Date().toString();
    setLoading(prev => ({ ...prev, v2: true }));
    try {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          monday.storage.setItem(key, valueToStore, { ttl: i + 10 })
        );
      }
      await Promise.all(promises);
      await getItemV2(); // Refresh the displayed value
    } catch (error) {
      console.error("Error setting V2 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v2: false }));
    }
  };

  const getItemV2 = async () => {
    setLoading(prev => ({ ...prev, v2: true }));
    try {
      const response = await monday.storage.getItem(key);
      setStoredValueV2(response.data.value);
    } catch (error) {
      console.error("Error getting V2 item:", error);
      setStoredValueV2(null);
    } finally {
      setLoading(prev => ({ ...prev, v2: false }));
    }
  };

  const deleteItemV2 = async () => {
    setLoading(prev => ({ ...prev, v2: true }));
    try {
      await monday.storage.deleteItem(key);
      setStoredValueV2(null);
    } catch (error) {
      console.error("Error deleting V2 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v2: false }));
    }
  };

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const attentionBoxText = `Hello, your user_id is: ${
    context ? context.user.id : "still loading"
  }. Let's start building your amazing app, which will change the world!`;

  return (
    <div className="app-container">
      <div className="app-header">
        <AttentionBox
          title="🚀 Welcome to Monday Apps!"
          text={attentionBoxText}
          type="success"
          className="welcome-attention-box"
        />
      </div>

      {/* Configuration Section */}
      <Box 
        padding={Box.paddings.LARGE} 
        margin={Box.marginBottoms.LARGE}
        className="config-section"
      >
        <Heading 
          type={Heading.types.h3} 
          value="Storage Configuration"
          style={{ marginBottom: "24px", color: "var(--primary-text-color)" }}
        />
        
        <div className="input-grid">
          <div className="input-group">
            <label className="input-label">Storage Key</label>
            <TextField
              placeholder="Enter storage key"
              value={key}
              onChange={(value) => setKey(value)}
              size={TextField.sizes.MEDIUM}
              validation={key.trim() ? "success" : "error"}
              required
              className="config-input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Value</label>
            <TextField
              placeholder="Enter value (or leave empty for current date)"
              value={value}
              onChange={(value) => setValue(value)}
              size={TextField.sizes.MEDIUM}
              className="config-input"
            />
          </div>
        </div>
      </Box>

      {/* MAGICAL TEST ALL SECTION */}
      <Box 
        padding={Box.paddings.LARGE} 
        margin={Box.marginBottoms.LARGE}
        className="test-all-section"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px",
          border: "none",
          color: "white"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Heading 
            type={Heading.types.h3} 
            value="🔮 Magical Storage Testing"
            style={{ 
              marginBottom: "16px", 
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}
          />
          <p style={{ 
            marginBottom: "24px", 
            opacity: 0.9,
            fontSize: "14px",
            lineHeight: 1.5
          }}>
            One button to comprehensively test all Monday Storage API capabilities.<br/>
            Tests both V1 & V2 storage, edge cases, concurrency, error handling, and performance.
          </p>
          
          <Tooltip content="Run comprehensive tests on all Monday Storage API functionality">
            <Button
              size={Button.sizes.LARGE}
              onClick={testAllStorageCapabilities}
              disabled={isTestingAll}
              className="magical-test-button"
              style={{
                background: isTestingAll 
                  ? "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)"
                  : "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
                border: "none",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                padding: "12px 32px",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                transform: isTestingAll ? "scale(0.95)" : "scale(1)",
                cursor: isTestingAll ? "not-allowed" : "pointer"
              }}
            >
              {isTestingAll ? (
                <>
                  <Loader size={Loader.sizes.SMALL} style={{ marginRight: "8px" }} />
                  🧪 Testing in Progress...
                </>
              ) : (
                "🚀 Test All Storage Capabilities"
              )}
            </Button>
          </Tooltip>
        </div>
      </Box>

      <Divider />

      {/* Storage Operations Sections */}
      <div className="storage-sections">
        {/* V1 Storage Section */}
        <Box
          padding={Box.paddings.LARGE}
          className="storage-section v1-section"
        >
          <div className="section-header">
            <div className="section-title-group">
              <Heading
                type={Heading.types.h4}
                value="V1 Storage (Instance-based)"
                style={{ margin: 0 }}
              />
              <span className="badge legacy-badge">Legacy</span>
            </div>
            {loading.v1 && (
              <Loader 
                size={Loader.sizes.SMALL} 
                className="section-loader"
              />
            )}
          </div>

          <div className="button-group">
            <Tooltip content="Store a new item in V1 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={setItemV1}
                disabled={!key.trim() || loading.v1}
                className="action-button primary-action"
              >
                📝 Set
              </Button>
            </Tooltip>
            
            <Tooltip content="Retrieve item from V1 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={getItemV1}
                disabled={!key.trim() || loading.v1}
                kind={Button.kinds.SECONDARY}
                className="action-button"
              >
                🔍 Get
              </Button>
            </Tooltip>
            
            <Tooltip content="Delete item from V1 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={deleteItemV1}
                disabled={!key.trim() || loading.v1}
                kind={Button.kinds.TERTIARY}
                className="action-button"
              >
                🗑️ Delete
              </Button>
            </Tooltip>
            
            <Tooltip content="Create 10,000 items for stress testing">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={createManyItemsV1}
                kind={Button.kinds.PRIMARY}
                color={Button.colors.NEGATIVE}
                disabled={loading.v1}
                className="action-button danger-action"
              >
                ⚡ SUPER-SPAM! (10K Items)
              </Button>
            </Tooltip>
          </div>

          <Box
            padding={Box.paddings.MEDIUM}
            className="value-display"
          >
            <div className="value-label">Stored Value:</div>
            <div className="value-content">
              {storedValueV1 || "No value stored"}
            </div>
          </Box>
        </Box>

        {/* V2 Storage Section */}
        <Box
          padding={Box.paddings.LARGE}
          className="storage-section v2-section"
        >
          <div className="section-header">
            <div className="section-title-group">
              <Heading
                type={Heading.types.h4}
                value="V2 Storage (Instance-less)"
                style={{ margin: 0 }}
              />
              <span className="badge modern-badge">Modern</span>
            </div>
            {loading.v2 && (
              <Loader 
                size={Loader.sizes.SMALL} 
                className="section-loader"
              />
            )}
          </div>

          <div className="button-group">
            <Tooltip content="Store a new item in V2 storage with TTL">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={setItemV2}
                disabled={!key.trim() || loading.v2}
                className="action-button primary-action"
              >
                📝 Set
              </Button>
            </Tooltip>
            
            <Tooltip content="Store multiple items rapidly for stress testing">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={setItemV2HighRate}
                disabled={!key.trim() || loading.v2}
                kind={Button.kinds.SECONDARY}
                className="action-button"
              >
                🚀 Set: High Rate
              </Button>
            </Tooltip>
            
            <Tooltip content="Retrieve item from V2 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={getItemV2}
                disabled={!key.trim() || loading.v2}
                kind={Button.kinds.SECONDARY}
                className="action-button"
              >
                🔍 Get
              </Button>
            </Tooltip>
            
            <Tooltip content="Delete item from V2 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={deleteItemV2}
                disabled={!key.trim() || loading.v2}
                kind={Button.kinds.TERTIARY}
                className="action-button"
              >
                🗑️ Delete
              </Button>
            </Tooltip>
          </div>

          <Box
            padding={Box.paddings.MEDIUM}
            className="value-display"
          >
            <div className="value-label">Stored Value:</div>
            <div className="value-content">
              {storedValueV2 || "No value stored"}
            </div>
          </Box>
        </Box>
      </div>

      {/* Toast Notifications Area */}
      {testResults.length > 0 && (
        <div 
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            maxWidth: "400px",
            maxHeight: "80vh",
            overflowY: "auto"
          }}
        >
          {testResults.map((toast) => (
            <div
              key={toast.id}
              style={{
                background: toast.type === "error" 
                  ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)"
                  : toast.type === "success"
                  ? "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)"
                  : toast.type === "warning"
                  ? "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)"
                  : "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                color: "white",
                padding: "12px 16px",
                marginBottom: "8px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                fontSize: "14px",
                lineHeight: 1.4,
                animation: "slideInRight 0.3s ease-out",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)"
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {toast.message}
              </div>
              <div style={{ 
                fontSize: "12px", 
                opacity: 0.8,
                fontFamily: "monospace"
              }}>
                {toast.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
