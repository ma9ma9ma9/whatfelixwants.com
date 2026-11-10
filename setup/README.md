# Setting up the "I'll get this" buttons

The buttons save to a Google Sheet that you own. Everyone who opens whatfelixwants.com sees which gifts are taken and who is getting them. You can open the sheet any time to see the list or fix mistakes: delete a row to free up a gift again.

## One-time setup (about 5 minutes)

1. Go to <https://sheets.new> (signed in to your Google account) and name the sheet **Felix wish list claims**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what's in the editor and paste in everything from [`claims-apps-script.gs`](claims-apps-script.gs). Click **Save** (the disk icon).
4. Click **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Description: `wish list`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**. Google asks you to authorize: choose your account. If it says *"Google hasn't verified this app"*, click **Advanced → Go to (unsafe)**. That warning appears because the script is yours and not published; it only touches this one sheet.
6. Copy the **Web app URL** (it ends in `/exec`) and send it to Claude, or paste it into `index.html` here:

   ```js
   const CLAIMS_API = "https://script.google.com/macros/s/…/exec";
   ```

A tab called **Claims** shows up in the sheet the first time someone taps a button.

## Day to day

- **Adding a wish:** each item in `index.html` needs a unique `data-wish` name, e.g. `data-wish="want-play-kitchen"`. Don't rename it after people start claiming, or the claim gets disconnected.
- **Freeing up a gift:** the person who claimed it can tap **undo** on the same phone or computer. Otherwise, delete that row in the sheet.
- **Changing the script later:** edit it, then use **Deploy → Manage deployments → Edit (pencil) → Version: New version** so the URL stays the same.
