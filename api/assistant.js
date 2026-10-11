const chatHandler = require("./chat.js");

module.exports = async function (req, res) {
    res.setHeader("X-Assistant-Route-Version", "openrouter-assistant-route-2026-10-10");
    return chatHandler(req, res);
};
