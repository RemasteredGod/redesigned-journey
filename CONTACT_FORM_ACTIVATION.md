# Contact Form Activation Guide

## Quick Setup for ashutoshpadhi.tech@gmail.com

Your contact form is ready to activate! Follow these simple steps to start receiving emails from your portfolio.

## Step 1: Create Formspree Account

1. Go to [https://formspree.io/](https://formspree.io/)
2. Click "Get Started" and sign up with your email: `ashutoshpadhi.tech@gmail.com`
3. Verify your email address

## Step 2: Create Your Form

1. In your Formspree dashboard, click "New Form"
2. Enter form name: "Portfolio Contact Form"
3. Set email to: `ashutoshpadhi.tech@gmail.com`
4. Copy your Form ID (it looks like: `mwkgpzqr`)

## Step 3: Update Your Portfolio

### Replace YOUR_FORM_ID in these files:

1. **In `index.html` line 498:**
   ```html
   <form id="contact-form" class="cyber-form" 
         action="https://formspree.io/f/YOUR_FORM_ID" 
         method="POST">
   ```
   Replace `YOUR_FORM_ID` with your actual form ID.

2. **In `app.js` line 770:**
   ```javascript
   return this.submitToFormspree(data, 'YOUR_FORM_ID');
   ```
   Replace `YOUR_FORM_ID` with your actual form ID.

## Step 4: Test Your Form

1. Deploy your website
2. Fill out the contact form with test data
3. Submit the form
4. Check your email at `ashutoshpadhi.tech@gmail.com`

## Example Configuration

If your Formspree form ID is `mwkgpzqr`, your files should look like:

**index.html:**
```html
<form id="contact-form" class="cyber-form" 
      action="https://formspree.io/f/mwkgpzqr" 
      method="POST">
```

**app.js:**
```javascript
return this.submitToFormspree(data, 'mwkgpzqr');
```

## Features You'll Get

✅ **Email Notifications** - Instant email alerts for new messages  
✅ **Spam Protection** - Built-in spam filtering  
✅ **Form Validation** - Cyberpunk-styled error handling  
✅ **Mobile Responsive** - Works on all devices  
✅ **50 Free Submissions/Month** - Perfect for portfolio sites  

## Troubleshooting

**Form not working?**
- Make sure you replaced `YOUR_FORM_ID` in both files
- Check that your Formspree form is active
- Verify your email address in Formspree

**Not receiving emails?**
- Check your spam folder
- Verify email settings in Formspree dashboard
- Make sure the form ID matches exactly

## Alternative: Gmail SMTP (Advanced)

If you want to use your Gmail directly, you can set up EmailJS instead:

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Connect your Gmail account
3. Update the JavaScript to use EmailJS instead of Formspree

This method is more complex but gives you more control over email templates.

---

**Need help?** The contact form will be fully functional once you complete these steps!
