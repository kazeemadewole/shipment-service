// Dashboard WebSocket Test JavaScript.
// DOM Elements
document.addEventListener('DOMContentLoaded', function () {
  const connectBtn = document.getElementById('connect-btn');
  const disconnectBtn = document.getElementById('disconnect-btn');
  const sendNotificationBtn = document.getElementById('send-notification-btn');
  const clearLogsBtn = document.getElementById('clear-logs-btn');
  const serverUrlInput = document.getElementById('server-url');
  const channelsInput = document.getElementById('channels');
  const notificationChannelSelect = document.getElementById('notification-channel');
  const notificationPayloadTextarea = document.getElementById('notification-payload');
  const connectionStatusDiv = document.getElementById('connection-status');
  const channelBadgesDiv = document.getElementById('channel-badges');
  const logContainerDiv = document.getElementById('log-container');

  // WebSocket instance
  let socket = null;
  let reconnectAttempts = 0;
  let reconnectInterval = null;
  let subscribedChannels = [];

  // Connect to WebSocket server
  connectBtn.addEventListener('click', () => {
    connect();
  });

  // Disconnect from WebSocket server
  disconnectBtn.addEventListener('click', () => {
    disconnect();
  });

  // Send test notification
  sendNotificationBtn.addEventListener('click', () => {
    const channel = notificationChannelSelect.value;
    const payload = notificationPayloadTextarea.value;

    try {
      // Parse JSON to validate it
      JSON.parse(payload);

      // Send a request to the test endpoint
      fetch(`/dashboard/test-notify/${channel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            logMessage(`Test notification sent to channel: ${channel}`, 'success');
          } else {
            logMessage(`Failed to send notification: ${data.message}`, 'error');
          }
        })
        .catch((error) => {
          logMessage(`Error sending notification: ${error.message}`, 'error');
        });
    } catch (error) {
      logMessage(`Invalid JSON payload: ${error.message}`, 'error');
    }
  });

  // Clear logs
  clearLogsBtn.addEventListener('click', () => {
    logContainerDiv.innerHTML = '';
  });

  // Connect to WebSocket
  function connect() {
    // Get server URL, channels, and authentication token
    const serverUrl = serverUrlInput.value;
    const channels = channelsInput.value;
    const authToken = document.getElementById('auth-token').value;

    // Validate URL
    if (!serverUrl) {
      logMessage('Server URL is required', 'error');
      return;
    }

    // Build URL with channels as query parameters if provided
    let fullUrl = serverUrl;
    if (channels) {
      fullUrl += (serverUrl.includes('?') ? '&' : '?') + `channels=${encodeURIComponent(channels)}`;
    }

    // Add token for authentication if provided
    if (authToken) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + `token=${encodeURIComponent(authToken)}`;
      logMessage('Authentication token added to connection', 'info');
    } else if (channels.includes('swap_station_update') || channels.includes('swap_completed')) {
      logMessage('Warning: Using dashboard channels without authentication token', 'error');
    }

    // Update UI
    updateConnectionStatus('connecting');
    logMessage(`Connecting to ${fullUrl}...`, 'info');

    try {
      // Close existing connection if any
      if (socket) {
        socket.close();
      }

      // Create new WebSocket connection
      socket = new WebSocket(fullUrl);

      // Connection event handlers
      socket.onopen = onSocketOpen;
      socket.onmessage = onSocketMessage;
      socket.onerror = onSocketError;
      socket.onclose = onSocketClose;

      // Update button states
      connectBtn.disabled = true;
      disconnectBtn.disabled = false;
      sendNotificationBtn.disabled = false;
    } catch (error) {
      logMessage(`Failed to connect: ${error.message}`, 'error');
      updateConnectionStatus('disconnected');
    }
  }

  // Disconnect from WebSocket
  function disconnect() {
    if (socket) {
      logMessage('Disconnecting...', 'info');
      socket.close();
    }
  }

  // Update connection status UI
  function updateConnectionStatus(status) {
    connectionStatusDiv.className = `status ${status}`;
    connectionStatusDiv.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  }

  // Update subscribed channels badges
  function updateChannelBadges(channels) {
    channelBadgesDiv.innerHTML = '';

    if (channels && channels.length > 0) {
      channels.forEach((channel) => {
        const badge = document.createElement('span');
        badge.className = 'badge badge-info';
        badge.textContent = channel;
        channelBadgesDiv.appendChild(badge);
      });
    } else {
      const badge = document.createElement('span');
      badge.className = 'badge badge-info';
      badge.textContent = 'No subscriptions';
      channelBadgesDiv.appendChild(badge);
    }
  }

  // Socket open handler
  function onSocketOpen() {
    logMessage('Connected to WebSocket server', 'success');
    updateConnectionStatus('connected');
    reconnectAttempts = 0;

    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  }

  // Socket message handler
  function onSocketMessage(event) {
    try {
      const message = JSON.parse(event.data);

      // Update subscribed channels when we get the connection message
      if (message.type === 'connection') {
        subscribedChannels = message.subscribedChannels;
        updateChannelBadges(subscribedChannels);
        logMessage(`Client ID: ${message.clientId}`, 'info');
      }
      // Update channels when subscription changes
      else if (message.type === 'subscribed' || message.type === 'unsubscribed') {
        const channel = message.channel;

        if (message.type === 'subscribed' && !subscribedChannels.includes(channel)) {
          subscribedChannels.push(channel);
        } else if (message.type === 'unsubscribed') {
          subscribedChannels = subscribedChannels.filter((ch) => ch !== channel);
        }

        updateChannelBadges(subscribedChannels);
      }

      // Log all messages
      logMessage(`Received: ${event.data}`, 'info');
    } catch (error) {
      logMessage(`Error parsing message: ${error.message}`, 'error');
      logMessage(`Raw message: ${event.data}`, 'info');
    }
  }

  // Socket error handler
  function onSocketError() {
    logMessage('WebSocket error', 'error');
  }

  // Socket close handler
  function onSocketClose(event) {
    logMessage(`WebSocket connection closed: ${event.code} ${event.reason}`, 'error');
    updateConnectionStatus('disconnected');
    updateChannelBadges([]);
    subscribedChannels = [];

    // Update button states
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    sendNotificationBtn.disabled = true;

    // Setup reconnect
    if (reconnectAttempts < 5 && !reconnectInterval) {
      const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 30000);
      logMessage(`Attempting to reconnect in ${Math.round(delay / 1000)} seconds...`, 'info');

      reconnectInterval = setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, delay);
    }
  }

  // Log a message to the UI
  function logMessage(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;

    const time = document.createElement('span');
    time.className = 'log-time';
    time.textContent = `[${new Date().toLocaleTimeString()}] `;

    entry.appendChild(time);
    entry.appendChild(document.createTextNode(message));

    logContainerDiv.appendChild(entry);
    logContainerDiv.scrollTop = logContainerDiv.scrollHeight;
  }

  // Initialize
  logMessage('WebSocket test page loaded', 'info');
});
