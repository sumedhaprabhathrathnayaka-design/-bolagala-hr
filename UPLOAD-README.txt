BOLAGALA HR — FIXED (v3)
=========================

මේ files 6 GitHub repo root එකට upload කරන්න (පරණ ඒවා replace වෙනවා):
  index.html, sw.js, manifest.json, manifest-admin.json, icon-192.png, icon-512.png

FIXES APPLIED
-------------
1. pullAll() — redirect:'follow' added
   → Google Apps Script එකෙන් data sync එක reliable කරනවා ("Sync failed" නවතිනවා)

2. sw.js v2 → v3
   → icons + manifests දෙකම cache කරනවා
   → Promise.allSettled (එක file fail වුණත් install break වෙන්නේ නැහැ)
   → googleusercontent.com (Apps Script redirect) network එකට pass කරනවා

3. manifest-admin.json — repo එකේ තියෙන නිසා admin manifest switch එක තියාගත්තා
   (worker = manifest.json, admin = ?admin → manifest-admin.json)

UPLOAD කරපු පස්සේ
------------------
- Phone එකේ පරණ app එක uninstall කරලා, browser cache clear කරලා,
  URL එක නැවත open කරන්න (sw v3 අලුතෙන් load වෙන්න).

Worker:  https://YOUR_SITE/
Admin:   https://YOUR_SITE/?admin

DATA තාම SYNC වෙන්නේ නැත්නම්
----------------------------
ඒ Apps Script deployment එකේ ප්‍රශ්නයක් — මේ files වල නෙමෙයි:
  Apps Script → New deployment → Execute as: Me → Who has access: Anyone
  → /exec URL එක app Settings එකේ එක match විය යුතුයි.
