import { Response } from "express";
import fetch from "node-fetch";
import { AuthenticatedRequest } from "../middlewares/authentication";

// Sync lifecycle event handler - processes immediately and returns 200
export async function handleSync(req: AuthenticatedRequest, res: Response) {
  try {
    console.log("lifecycle event received:", req.body);
    // process the lifecycle event in runtime

    // notify processing is done
    res.status(200).json({
      message: "Lifecycle event processed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error processing sync lifecycle event:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Async lifecycle event handler - returns 202 immediately, waits 10 seconds, then calls back_to_url
export async function handleAsync(req: AuthenticatedRequest, res: Response) {
  try {
    console.log("Async lifecycle event received:", req.body);

    const backToUrl = req.body?.data?.back_to_url;

    if (!backToUrl) {
      res.status(400).json({
        success: false,
        message: "Missing back_to_url in request body",
      });
      return;
    }

    // Send 202 Accepted immediately to indicate that the event has been accepted and is being processed
    res.status(202).json({
      message: "Async event accepted, processing...",
      status: "accepted",
      timestamp: new Date().toISOString(),
    });

    // Wait few seconds (processing time), then call backToUrl to notify that the processing is done
    setTimeout(async () => {
      console.log(`⏱ 10 seconds elapsed, calling backToUrl...`);
      try {
        const response = await fetch(backToUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            success: true,
          }),
        });
        if (response.ok) {
          console.log("Successfully notified backToUrl!");
        }
      } catch (error) {
        console.error("Error calling backToUrl:", error);
      }
    }, 10000);
  } catch (error) {
    console.error("Error processing async lifecycle event:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
