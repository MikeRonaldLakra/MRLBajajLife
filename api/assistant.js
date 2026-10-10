/**
 * Dedicated current chat endpoint.
 * This endpoint intentionally delegates to the single source-of-truth handler,
 * avoiding any duplicate system prompt, model configuration, or lead webhook code.
 */
const chatHandler = require("./chat.js");

module.exports = async function (req, res) {
    res.setHeader("X-Assistant-Route-Version", "openrouter-assistant-route-2026-10-10");
    return chatHandler(req, res);
};
