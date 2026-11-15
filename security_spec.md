# Security Specification & Red Team Audit

## 1. Data Invariants
1. A guestbook message (`/guestbook/{messageId}`) must belong to an authenticated, email-verified user (`authorId == request.auth.uid`), contain no PII (no email, phone, or address), obey strict string size limits (`authorName <= 80`, `location <= 80`, `message <= 400`), and use server timestamps (`createdAt == request.time`).
2. A supporter cheer (`/cheers/{userId}`) is keyed strictly by the supporter's `uid` (`request.auth.uid == userId`), preventing duplicate cheers per user and preventing spoofing another user's cheer.
3. Training logs (`/trainingLogs/{logId}`) can only be created, updated, or deleted by the verified portfolio owner/admin (`tsatsraltodaltangerel3@gmail.com` with `email_verified == true` or listed in `/admins/{uid}`). Once a training log reaches terminal status `completed`, non-admin edits are impossible (and terminal locking protects completed records).
4. Service orders (`/serviceOrders/{orderId}`) contain PII (`contact`: phone or email). Therefore, `get` and `list` access is strictly restricted to the verified admin (`isAdmin()`) or the authenticated, email-verified creator (`resource.data.userId == request.auth.uid`). Public visitors can only `create` new orders with `status == 'new'`, strict field size limits, and server timestamp (`createdAt == request.time`), with no ability to read, list, update, or delete existing orders.
5. Portfolio services (`/services/{serviceId}`) are publicly readable catalog entries, while creation, updates, and deletion are strictly restricted to the verified admin (`isAdmin()`) with bounded array size (`highlights.size() <= 6`), strict string limits, and server timestamps.
6. Shadow fields, oversized strings, invalid document IDs, and client-forged timestamps are rejected on every write.

## 2. Dirty Dozen Payloads (Must Return PERMISSION_DENIED)
1. Shadow field injection on `/guestbook/{id}` (`isAdmin: true` added to payload).
2. Identity spoofing on `/guestbook/{id}` (`authorId` set to another user's UID).
3. Client-forged `createdAt` timestamp on `/guestbook/{id}`.
4. Oversized message (`message.length > 400`) on `/guestbook/{id}`.
5. Email spoofing attack (matching admin email with `email_verified: false`).
6. Non-author attempting to update or delete another user's guestbook message.
7. Modifying immutable `authorId` or `createdAt` during guestbook update.
8. Creating a cheer under `/cheers/other_uid` when authenticated as `user_1`.
9. Updating an immutable cheer document under `/cheers/{uid}`.
10. Non-admin authenticated user creating a `/trainingLogs/{id}` entry.
11. Injecting junk path ID (`../etc/passwd` or 200-char ID) violating `isValidId()`.
12. Unauthenticated or non-admin user attempting to `get` or `list` `/serviceOrders`, create an order with `status: 'completed'`, spoof another user's `userId`, or update/delete someone else's order.
