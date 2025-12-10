# Public Assets Directory

This directory contains all public-facing files organized in a structured manner for the MAX Falcon Backend.

## Directory Structure

```
public/
├── index.html          # Main directory page listing all available tools
├── css/                # Stylesheets
│   ├── battery-soc-checker.css
│   └── dashboard-test.css
├── js/                 # JavaScript files
│   ├── battery-soc-checker.js
│   └── dashboard-test.js
├── html/               # HTML pages
│   ├── battery-soc-checker.html
│   ├── dashboard-test.html
│   ├── qc-dashboard.html
│   └── qc-form.html
└── images/             # Static images (future use)
```

## Available Tools

### 🔋 Battery SOC Checker

- **File**: `html/battery-soc-checker.html`
- **Purpose**: Check battery State of Charge (SOC) using battery ID
- **API**: Connects to `https://epoint.mautoafrica.com/battery/{id}/soc`
- **Features**: Real-time SOC display with visual progress bar and error handling

### 📊 Dashboard WebSocket Test

- **File**: `html/dashboard-test.html`
- **Purpose**: Test WebSocket connections and real-time notifications
- **Features**: Connection management, channel subscription, event logging

### 🔍 QC Dashboard

- **File**: `html/qc-dashboard.html`
- **Purpose**: Quality Control dashboard for battery monitoring

### 📝 QC Form

- **File**: `html/qc-form.html`
- **Purpose**: Quality Control form interface

## Usage

### Serving Files

When serving these files through your web server, make sure to:

1. **Configure static file serving** for the `/public` directory
2. **Update Content Security Policy** to allow resources from `/public/css/` and `/public/js/`
3. **Set proper MIME types** for CSS and JS files

### Example Express.js Configuration

```javascript
// Serve static files from public directory
app.use('/public', express.static('public'));

// Serve the main index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
```

### Example Nginx Configuration

```nginx
location /public/ {
    alias /path/to/your/project/public/;
    expires 1d;
    add_header Cache-Control "public, immutable";
}
```

## Development

When adding new public assets:

1. **CSS files** → `public/css/`
2. **JavaScript files** → `public/js/`
3. **HTML pages** → `public/html/`
4. **Images** → `public/images/`

Make sure to update the main `index.html` file to include links to new tools.

## Security Considerations

- All external API calls use HTTPS
- Content Security Policy is configured to prevent XSS attacks
- API keys are handled securely in the JavaScript files
- CORS policies should be configured appropriately for the external APIs

## File Updates

If you need to update paths in HTML files, remember to use the new structure:

- CSS: `/public/css/filename.css`
- JS: `/public/js/filename.js`
- Images: `/public/images/filename.ext`
