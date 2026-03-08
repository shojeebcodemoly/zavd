# Debugging Guide - User Data Fetching

**Project:** Synos Medical
**Date:** December 3, 2025
**Status:** 🔧 **DEBUGGING IN PROGRESS**

---

## 🐛 Issues Found

### Issue 1: Collection Name Mismatch ✅ FIXED

**Problem:** Mongoose was querying `users` collection, Better Auth uses `user`
**Fix:** Changed `collection: "users"` → `collection: "user"` in user model
**Status:** ✅ Fixed

### Issue 2: Orphaned Profiles 🔧 IDENTIFIED

**Problem:** Profile exists for old user ID, not current user
**Evidence:**

```javascript
Current user: ObjectId('692fc2b5163b6b4edc683e23')
Profile userId: ObjectId('692fc002163b6b4edc683e09') console.logOld user!
```

**Fix:** Delete orphaned profiles, create profile for current user
**Status:** ✅ Fixed manually

### Issue 3: No Active Session 🔧 NEEDS TESTING

**Problem:** No session found in database
**Impact:** User not logged in, so /api/user/me returns unauthorized
**Fix:** User needs to login again
**Status:** 🔄 Needs user to login

---

## 📊 Current Database State

### Collections

```
- user (Better Auth)
- profiles (Our app)
- session (Better Auth)
- account (Better Auth OAuth)
```

### Current User

```javascript
{
  _id: ObjectId('692fc2b5163b6b4edc683e23'),
  email: 'refayth.codemoly@gmail.com',
  name: 'Refayth Hossain',
  emailVerified: false
}
```

### Current Profile

```javascript
{
  _id: ObjectId('...'),
  userId: ObjectId('692fc2b5163b6b4edc683e23'), console.log✅ Matches user!
  bio: '',
  avatarUrl: null
}
```

### Current Session

```
No active session - user needs to login
```

---

## 🔍 Complete Logging Added

### API Route: /api/user/me

```typescript
✅ Session validation logging
✅ User ID extraction logging
✅ Service call logging
✅ Error handling logging
```

### User Service

```typescript
✅ Method entry logging
✅ Repository call logging
✅ Result logging
✅ Error logging
```

### User Repository

```typescript
✅ Query execution logging
✅ Collection name logging
✅ Result detailed logging
✅ Error logging
```

### Profile Repository

```typescript
✅ Find or create logging
✅ Profile creation logging
✅ Result logging
```

---

## 🧪 Testing Steps

### Step 1: Login

```
1. Open http://localhost:3000/login
2. Enter credentials:
   - Email: refayth.codemoly@gmail.com
   - Password: [your password]
3. Click Login
```

**Expected Logs:**

```
Better Auth creates session
Session stored in database
Cookies set: synos.session_token
Redirect to /dashboard
```

### Step 2: Check Dashboard

```
Dashboard automatically calls /api/user/me
```

**Expected Console Logs:**

```
=== /api/user/me GET request started ===
Auth instance obtained: true
Session: {
  exists: true,
  hasUser: true,
  userId: '692fc2b5163b6b4edc683e23',
  userEmail: 'refayth.codemoly@gmail.com',
  userName: 'Refayth Hossain'
}
✅ Session valid, userId: 692fc2b5163b6b4edc683e23

📦 [UserService] getUserWithProfile called
📦 [UserService] userId: 692fc2b5163b6b4edc683e23

🗄️  [UserRepository] findByIdWithProfile called
🗄️  [UserRepository] Model name: User
🗄️  [UserRepository] Collection name: user
🗄️  [UserRepository] Query executed. Result: {
  found: true,
  userId: '692fc2b5163b6b4edc683e23',
  email: 'refayth.codemoly@gmail.com',
  name: 'Refayth Hossain',
  hasProfile: false
}

👤 [ProfileRepository] findOrCreateForUser called
👤 [ProfileRepository] Profile found: true

✅ User and profile retrieved
```

### Step 3: Verify Response

```
Check Network tab → /api/user/me response:
{
  "success": true,
  "data": {
    "user": { ... },
    "profile": { ... }
  }
}
```

---

## 🔧 Manual Database Checks

### Check User Exists

```bash
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  db.user.findOne({ email: 'refayth.codemoly@gmail.com' })
"
```

### Check Profile Exists

```bash
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  const user = db.user.findOne({ email: 'refayth.codemoly@gmail.com' });
  db.profiles.findOne({ userId: user._id })
"
```

### Check Session Exists

```bash
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  db.session.find({ userId: ObjectId('692fc2b5163b6b4edc683e23') })
"
```

### Verify All Links

```bash
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  const user = db.user.findOne();
  const profile = db.profiles.findOne({ userId: user._id });
  const session = db.session.findOne({ userId: user._id });

  printjson({
    user: { _id: user._id, email: user.email },
    profile: { _id: profile._id, userId: profile.userId },
    session: session ? { userId: session.userId } : 'No session',
    linksValid: {
      profileToUser: user._id.toString() === profile.userId.toString(),
      sessionToUser: session ? user._id.toString() === session.userId.toString() : false
    }
  });
"
```

---

## 🚨 Troubleshooting

### If User Data Still Not Fetching

#### 1. Check Console Logs

Look for the emoji-marked logs in your terminal:

```
=== /api/user/me GET request started ===
📦 [UserService] ...
🗄️  [UserRepository] ...
👤 [ProfileRepository] ...
```

#### 2. Check Where It Fails

```
❌ No session or user found
  → Login again

❌ [UserService] User not found
  → Check if querying correct collection
  → Verify user exists in 'user' collection

❌ [UserRepository] Error in findByIdWithProfile
  → Check error message
  → Verify MongoDB connection
  → Check userId format

❌ [ProfileRepository] Error in findOrCreateForUser
  → Check error message
  → Verify profile can be created
```

#### 3. Verify Database

```bash
# Quick verification
mongosh --eval "
  use synos-db;
  print('User count:', db.user.countDocuments());
  print('Profile count:', db.profiles.countDocuments());
  print('Session count:', db.session.countDocuments());
"
```

#### 4. Check Mongoose Model Config

```typescript
console.logIn models/user.model.ts
{
	collection: "user"; console.logMust be "user", not "users"
}
```

---

## 📝 Common Issues and Fixes

### Issue: "Unauthenticated"

**Cause:** No session in database
**Fix:** Login again

### Issue: "User not found"

**Cause:** Querying wrong collection or user doesn't exist
**Fix:**

1. Check collection name in model is "user"
2. Verify user exists: `db.user.findOne()`

### Issue: Profile null

**Cause:** Profile doesn't exist for user
**Fix:** Automatic - `findOrCreateForUser` will create it

### Issue: "Cannot read property 'profile'"

**Cause:** Virtual field not populated
**Fix:** Already using `.populate("profile")`

### Issue: Orphaned profiles

**Cause:** Profile created for old/deleted user
**Fix:**

```bash
# Find orphaned profiles
mongosh --eval "
  const userIds = db.user.find().map(u => u._id);
  db.profiles.find({ userId: { \$nin: userIds } })
"

# Delete orphaned profiles
mongosh --eval "
  const userIds = db.user.find().map(u => u._id);
  db.profiles.deleteMany({ userId: { \$nin: userIds } })
"
```

---

## 🎯 Quick Diagnostic Commands

### One-Command Check All

```bash
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  const user = db.user.findOne();
  const profile = db.profiles.findOne({ userId: user._id });
  const session = db.session.findOne({ userId: user._id });

  console.logconsole.log('✅ User exists:', !!user);
  console.logconsole.log('✅ Profile exists:', !!profile);
  console.logconsole.log('✅ Profile matches user:', profile ? user._id.toString() === profile.userId.toString() : false);
  console.logconsole.log('✅ Session exists:', !!session);
  console.logconsole.log('');
  console.logconsole.log('Current user:', user ? user.email : 'None');
  console.logconsole.log('Profile for:', profile ? profile.userId : 'None');
  console.logconsole.log('Action needed:', !session ? 'Login required' : 'Should work');
"
```

### Reset Everything

```bash
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  db.user.deleteMany({});
  db.profiles.deleteMany({});
  db.session.deleteMany({});
  db.account.deleteMany({});
  print('✅ Database cleared. Register new user.');
"
```

---

## 📈 What's Been Fixed

### ✅ Code Changes

1. User model collection name: "users" → "user"
2. Added TypeScript profile property to IUser
3. Added comprehensive logging throughout
4. Improved error messages

### ✅ Database Fixes

1. Deleted orphaned profile
2. Created profile for current user
3. Verified user-profile link

### 🔄 Needs User Action

1. Login again (to create session)
2. Test /api/user/me endpoint
3. Verify data loads in dashboard

---

## 🚀 Next Steps

### For You (User)

1. **Login** at http://localhost:3000/login
2. **Check terminal** for detailed logs
3. **Verify dashboard** loads user data
4. **Report back** what you see in console

### Expected Behavior

```
✅ Login successful
✅ Redirect to /dashboard
✅ Console shows full log flow
✅ User data appears in UI
✅ No errors in console
```

---

## 📊 Monitoring Checklist

While testing, check:

-  [ ] Terminal shows "Session valid" log
-  [ ] Terminal shows "User found" log
-  [ ] Terminal shows "Profile found" or "Profile created" log
-  [ ] Browser network tab shows successful /api/user/me response
-  [ ] Dashboard displays user name
-  [ ] No errors in browser console
-  [ ] No errors in terminal

---

**Document Version:** 1.0
**Last Updated:** December 3, 2025
**Status:** Ready for testing with comprehensive logging
