# Quick Start Guide - Insulin Dose Calculator

Get your Insulin Dose Calculator deployed to Appwrite in minutes!

## Prerequisites Checklist

- ✅ Appwrite CLI installed (already installed on your system)
- [ ] Appwrite account created at [cloud.appwrite.io](https://cloud.appwrite.io)
- [ ] New Appwrite project created
- [ ] Project ID copied from Appwrite Console

## 5-Minute Deployment

### Step 1: Create Appwrite Project (2 minutes)

1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Click "Create Project"
3. Name it "Insulin Dose Calculator"
4. Copy your **Project ID** from the project settings

### Step 2: Run Deployment Script (2 minutes)

```bash
cd "/Users/skyevasquez/1Projects/Insulin Dose Calculator"
./deploy.sh
```

The script will:
- ✅ Check your Appwrite CLI installation
- ✅ Verify authentication
- ✅ Configure your Project ID
- ✅ Initialize the project
- ✅ Deploy database collections

### Step 3: Configure Appwrite Console (1 minute)

1. **Enable Authentication:**
   - Go to **Auth** in your Appwrite Console
   - Enable **Email/Password** method

2. **Add Web Platform:**
   - Go to **Settings** > **Platforms**
   - Click **Add Platform** > **Web**
   - Enter: `http://localhost:8000` (for local testing)

3. **Set Collection Permissions:**
   - Go to **Databases** > **insulin_db**
   - For each collection:
     - Click on collection
     - Go to **Settings** tab
     - Enable **Document Security**
     - Add **Any** role with Create, Read, Update, Delete permissions

### Step 4: Test Locally

```bash
# Start a local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

1. Create a test account
2. Enter some blood sugar readings
3. Log a dose
4. Verify data persists after logout/login

## Common Issues

### "Project ID not found"
- Double-check you updated both `appwrite-config.js` and `appwrite.json` with your actual Project ID

### "Authentication failed"
- Verify Email/Password auth is enabled in Appwrite Console
- Check that web platform is configured with correct URL

### "Permission denied" errors
- Ensure Document Security is enabled for all collections
- Verify "Any" role has proper permissions

### "CORS errors"
- Add your domain to Platforms in Appwrite Console
- Restart your local server

## Production Deployment Options

### Option 1: Appwrite Static Hosting (Recommended)

Appwrite provides static hosting for your frontend:

1. Install Appwrite CLI globally (if not already):
   ```bash
   npm install -g appwrite-cli
   ```

2. Deploy your site:
   ```bash
   appwrite deploy
   ```

### Option 2: Netlify

1. Connect your git repository to Netlify
2. Set build command: `echo "Static site"`
3. Set publish directory: `.`
4. Add your production URL to Appwrite Platforms

### Option 3: Vercel

1. Import project to Vercel
2. Deploy as static site
3. Add deployment URL to Appwrite Platforms

### Option 4: GitHub Pages

1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Add Pages URL to Appwrite Platforms

## Update Production URLs

After deploying to production:

1. Update `appwrite-config.js` if using different endpoint
2. Add production URL to Appwrite Console > Settings > Platforms
3. Test authentication and data persistence

## What's Included

Your deployed application includes:

✅ **User Authentication**
- Email/password signup and login
- Secure session management
- User isolation

✅ **Persistent Database**
- Dose history tracking
- Blood sugar readings
- User settings and preferences

✅ **Real-time Features**
- Automatic calculations
- Safety warnings
- Health dashboard

✅ **Responsive Design**
- Mobile-friendly interface
- Touch-optimized controls
- Modern medical UI

## Security Notes

- All user data is private and isolated
- Document-level security enforced
- Passwords are securely hashed by Appwrite
- HTTPS recommended for production
- Sessions expire automatically

## Support

- **Detailed Guide**: See `DEPLOYMENT.md`
- **Project README**: See `README.md`
- **Appwrite Docs**: [appwrite.io/docs](https://appwrite.io/docs)
- **Appwrite Discord**: [discord.gg/appwrite](https://discord.gg/appwrite)

## Medical Disclaimer

⚠️ **IMPORTANT**: This tool is for practice use only. Always consult your healthcare provider for medical decisions. In case of emergency, contact your healthcare provider immediately.

---

**You're ready to go!** 🚀

Run `./deploy.sh` and start managing your insulin doses with cloud-powered persistence and authentication.
