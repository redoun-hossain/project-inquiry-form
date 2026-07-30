# Project Inquiry Form

A professional, responsive inquiry form with n8n webhook integration. Built with pure HTML, CSS, and JavaScript — no build tools required.

![Version](https://img.shields.io/badge/Version-3.1-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

- ✅ Modern, responsive UI (Dark/Light theme)
- ✅ n8n Webhook integration
- ✅ Auto-save form draft (localStorage)
- ✅ Dynamic response card from webhook
- ✅ Mobile-friendly sidebar
- ✅ Form validation
- ✅ Loading states & animations
- ✅ No build tools required

---

## 📁 File Structure

```
project-inquiry-form/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles
├── js/
│   ├── config.js       # Webhook configuration
│   └── main.js         # Application logic
└── README.md           # Documentation
```

---

## ⚡ Quick Start

### Option 1: GitHub Pages

1. Fork or clone this repository
2. Go to **Settings → Pages**
3. Select **Deploy from a branch** → **main**
4. Your site will be live at `https://yourusername.github.io/project-inquiry-form/`

### Option 2: Any Static Hosting

Upload all files to:
- Netlify
- Vercel
- Firebase Hosting
- Any web server

---

## ⚙️ Configuration

Edit `js/config.js` to customize:

```javascript
const CONFIG = {
  WEBHOOK_TEST_URL: 'your-test-webhook-url',
  WEBHOOK_PROD_URL: 'your-production-webhook-url',
  USE_TEST: false,        // true = Test URL, false = Production URL
  VERSION: 'Version-3.1',
  get WEBHOOK_URL() {
    return this.USE_TEST ? this.WEBHOOK_TEST_URL : this.WEBHOOK_PROD_URL;
  }
};
```

---

## 📤 Webhook Request

### Request Format

```http
POST /webhook
Content-Type: application/json
```

### Request Payload

```json
{
  "message": "Project Inquiry Form Submission\nFull Name: John Doe\n...",
  "sessionId": "c_1234567890abc",
  "formType": "project_inquiry",
  "fullName": "John Doe",
  "businessEmail": "john@company.com",
  "phoneNumber": "+8801XXXXXXXXX",
  "companyName": "Acme Inc",
  "serviceInterestedIn": "Workflow Automation",
  "requirements": "Need CRM integration"
}
```

---

## 📥 Webhook Response

### Expected Response Format

```json
{
  "success": true,
  "title": "Inquiry Submitted",
  "message": "Thank you for contacting us. Our team will review your inquiry and get back to you shortly.",
  "reference": "IQ-20260728-001"
}
```

### Response Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `success` | boolean | Yes | `true` for success, `false` for error |
| `title` | string | Yes | Response card title |
| `message` | string | Yes | Response card message |
| `reference` | string | No | Reference ID (shown only if provided) |

### Error Response

```json
{
  "success": false,
  "title": "Submission Failed",
  "message": "Please try again later."
}
```

---

## 🎨 Customization

### Theme Colors

Edit CSS variables in `css/style.css`:

```css
:root {
  --primary: #2563EB;
  --primary-hover: #3B82F6;
  --accent: #60A5FA;
  --success: #22C55E;
  --error: #EF4444;
}
```

### Dark Theme

```css
[data-theme="dark"] {
  --bg: #0F172A;
  --surface: #111827;
  --text: #F1F5F9;
}
```

### Light Theme

```css
[data-theme="light"] {
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --text: #0F172A;
}
```

---

## 💾 LocalStorage Keys

| Key | Description |
|-----|-------------|
| `rag_theme` | Current theme (`dark` / `light`) |
| `rag_sb` | Sidebar collapsed state |
| `project_inquiry_draft` | Auto-saved form data |
| `project_inquiry_session` | Session ID for tracking |

---

## 📱 Responsive Breakpoints

- **Desktop:** > 768px (Sidebar visible)
- **Mobile:** ≤ 768px (Hamburger menu)

---

## 🔄 Form Flow

```
[User fills form]
       ↓
[Submit Inquiry]
       ↓
[Button: "Sending..."]
       ↓
[Webhook POST Request]
       ↓
[Parse Response]
       ↓
[Show Response Card]
       ↓
[Reset Form (if success)]
```

---

## 🛠️ n8n Workflow Integration

```
Inquiry Form (UI)
       │
       ▼
   Webhook
       │
       ▼
  AI Analysis
       │
       ▼
┌──────┴──────┐
│   Actions   │
├─────────────┤
│ • HubSpot   │
│ • Airtable  │
│ • Slack     │
│ • Notion    │
│ • Gmail     │
└─────────────┘
       │
       ▼
Respond to Webhook
       │
       ▼
Response Card (UI)
```

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 👨‍💻 Author

Built with ❤️ for professional inquiry management.
