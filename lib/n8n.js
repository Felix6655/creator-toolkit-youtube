/**
 * n8n Webhook Integration
 * Sends events to n8n workflow automation
 * 
 * Events:
 * - tool_used: When a user generates content with any tool
 * - user_signed_up: When a new user registers
 * - user_upgraded_pro: When a user upgrades to Pro plan (placeholder for Stripe)
 */

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

/**
 * Send an event to n8n webhook
 * Fails silently if N8N_WEBHOOK_URL is not configured
 * 
 * @param {string} eventName - Name of the event (e.g., 'tool_used', 'user_signed_up')
 * @param {object} payload - Event data to send
 * @returns {Promise<boolean>} - Returns true if sent successfully, false otherwise
 */
export async function sendToN8n(eventName, payload) {
  // Skip if webhook URL is not configured
  if (!N8N_WEBHOOK_URL) {
    console.log(`[n8n] Webhook not configured, skipping event: ${eventName}`)
    return false
  }

  try {
    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...payload,
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      console.error(`[n8n] Webhook failed with status: ${response.status}`)
      return false
    }

    console.log(`[n8n] Event sent successfully: ${eventName}`)
    return true
  } catch (error) {
    // Fail silently - don't break the app if n8n is down
    console.error(`[n8n] Error sending event ${eventName}:`, error.message)
    return false
  }
}

/**
 * Send tool usage event
 * Called after successful content generation
 */
export async function sendToolUsedEvent(toolSlug, userId = null) {
  return sendToN8n('tool_used', {
    tool: toolSlug,
    user_id: userId,
  })
}

/**
 * Send user signup event
 * Called after successful user registration
 */
export async function sendUserSignedUpEvent(userId, email) {
  return sendToN8n('user_signed_up', {
    user_id: userId,
    email: email,
  })
}

/**
 * Send user upgrade to Pro event
 * Placeholder for future Stripe integration
 */
export async function sendUserUpgradedProEvent(userId, email = null) {
  return sendToN8n('user_upgraded_pro', {
    user_id: userId,
    email: email,
    plan: 'pro',
  })
}
