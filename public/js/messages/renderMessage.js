
const renderMessage = function renderMessage({
    sender,
    message,
    isFirst=false
}) {
    const component = `
        <div class="chatbox-message-container ${(sender === "user") && "sent-by-user"} ${isFirst && "first"}">
            ${
                (sender !== "user") ?
                `<div class="chatbox-message-arrow ${(sender === "user") && "sent-by-user"}"></div>` : 
                ""
            }
            <div class="chatbox-message ${(sender === "user") && "sent-by-user"}">
                <h3 class="chatbox-message-owner">
                    ${(sender === "user") ? "You" : sender}
                </h3>
                <p class="chatbox-message-content">
                    ${message}
                </p>
            </div>
            ${
                (sender === "user") ?
                `<div class="chatbox-message-arrow ${(sender === "user") && "sent-by-user"}"></div>` : 
                ""
            }
        </div>
    `;
    chatboxMessages.innerHTML += component;
}
