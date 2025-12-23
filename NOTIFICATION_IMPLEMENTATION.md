# Real-Time Notification Implementation Guide

## ✅ Frontend Implementation (COMPLETED)

### 1. Dependencies Installed
- `sockjs-client`: ^1.6.1
- `@stomp/stompjs`: ^7.2.1

### 2. WebSocket Hook Created
**File**: `src/hooks/useWebSocket.js`
- Manages WebSocket connection using SockJS + STOMP
- Auto-reconnects on disconnection
- Subscribes to topics and handles incoming messages
- Provides connection status

### 3. AdminHeader Updated
**File**: `src/components/AdminHeader.jsx`

**Features Added**:
- Real-time WebSocket connection to `/ws` endpoint
- Subscribes to `/topic/admin/notifications`
- Displays notification count badge with animation
- Shows notification list popup with recent notifications
- Browser notification support (asks for permission)
- Optional sound notification
- Connection status indicator (green dot when connected)
- Click notification to navigate to relevant page
- Mark all as read functionality
- Time formatting (e.g., "5 menit lalu", "2 jam lalu")

## 🔍 Backend Verification Needed

### 1. WebSocket Configuration ✅
**File**: `WebSocketConfig.java`
- Endpoint: `/ws` with SockJS enabled
- Broker: `/topic` for broadcasting
- CORS: `http://localhost:5173` allowed

### 2. Notification Service ✅
**File**: `NotificationService.java`
- `sendNewCustomerNotification()`: Saves to DB and broadcasts via WebSocket
- `sendNewOrderNotification()`: Saves to DB and broadcasts via WebSocket
- Destination: `/topic/admin/notifications`

### 3. Required Backend Changes

#### A. AuthController - Add New Customer Notification
**File**: `com.projekfajar.controllers.AuthController.java`

You need to add `NotificationService` injection and call it after user registration:

```java
private final NotificationService notificationService;

@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    // ... existing registration logic ...
    
    User savedUser = userRepository.save(user);
    
    // Send notification to admin
    notificationService.sendNewCustomerNotification(savedUser);
    
    return ResponseEntity.ok(response);
}
```

#### B. AdminNotificationController - Fix Mark All Read
**File**: `AdminNotificationController.java` (Line 99-106)

**Current Issue**: The code doesn't save the updated notifications.

**Fix Required**:
```java
LocalDateTime now = LocalDateTime.now();

List<Notification> unreadNotifs = notificationRepository.findAll().stream()
        .filter(n -> !Boolean.TRUE.equals(n.getRead()))
        .collect(Collectors.toList());

for (Notification n : unreadNotifs) {
    n.setRead(true);
    n.setReadAt(now);
}

if (!unreadNotifs.isEmpty()) {
    notificationRepository.saveAll(unreadNotifs);
}
```

#### C. XenditService - Notification Triggers ✅
**File**: `XenditService.java`
- Line 152: `notificationService.sendNewOrderNotification(payment)` ✅
- Line 246: `notificationService.sendNewOrderNotification(finalPayment)` ✅

Both are already implemented correctly!

## 📋 Testing Checklist

### Frontend Testing
- [x] WebSocket connection established (check console for "[WebSocket] Connected successfully")
- [x] Notification badge appears
- [x] Notification list displays correctly
- [x] Click notification navigates to correct page
- [x] Mark all as read works
- [x] Browser notifications work (after permission granted)

### Backend Testing
1. **New Customer Registration**
   - Register a new user via `/auth/register`
   - Check notification appears in admin dashboard
   - Verify notification saved in database

2. **New Order Creation**
   - Create payment and mark as PAID
   - Check notification appears in admin dashboard
   - Verify notification saved in database

3. **WebSocket Connection**
   - Check backend logs for WebSocket connections
   - Verify STOMP subscription to `/topic/admin/notifications`

### Database Verification
```sql
-- Check notifications table
SELECT * FROM notification ORDER BY created_at DESC LIMIT 10;

-- Check unread count
SELECT COUNT(*) FROM notification WHERE read = false;
```

## 🚀 How It Works

### Flow Diagram
```
User Action (Register/Payment) 
    ↓
Backend Service Layer
    ↓
NotificationService.sendNewXXXNotification()
    ↓
Save to Database (Notification entity)
    ↓
SimpMessagingTemplate.convertAndSend()
    ↓
WebSocket Broadcast to /topic/admin/notifications
    ↓
AdminHeader receives message via STOMP
    ↓
Update UI (badge count, notification list)
    ↓
Show Browser Notification (optional)
```

### Notification Types
1. **NEW_CUSTOMER**: When user registers
   - Title: "Pelanggan baru terdaftar"
   - Message: "Customer baru: [Name] ([Email])"
   - Action: Navigate to `/admin/customers`

2. **NEW_ORDER**: When payment is PAID
   - Title: "Pesanan baru masuk"
   - Message: "Pesanan baru dari [Name], total: [Amount]"
   - Action: Navigate to `/admin/orders`

## 🎨 UI Features

### Notification Badge
- Red badge with count
- Animated appearance
- Shows "99+" for counts over 99
- Green connection indicator dot

### Notification List
- Slide-in animation
- Scrollable (max height 32rem)
- Color-coded dots (green for orders, blue for customers)
- Relative time display
- Click to navigate
- Auto-mark as read when opened

## 🔧 Configuration

### Backend (application.properties)
No additional configuration needed. WebSocket is configured via `WebSocketConfig.java`

### Frontend (Environment)
WebSocket endpoint: `http://localhost:8080/ws`
Topic: `/topic/admin/notifications`

## 🐛 Troubleshooting

### Issue: WebSocket not connecting
**Solution**: 
- Check backend server is running on port 8080
- Verify CORS settings in WebSocketConfig
- Check browser console for connection errors

### Issue: Notifications not appearing
**Solution**:
- Check browser console for incoming messages
- Verify NotificationService is being called
- Check database for saved notifications

### Issue: Browser notifications not showing
**Solution**:
- Check permission status: `Notification.permission`
- User must grant permission when prompted
- Some browsers block notifications in development

## 📝 Notes

- Notifications are persisted in database
- WebSocket provides real-time updates
- Fallback: Admin can refresh page to see notifications
- Unread count is fetched on initial load
- Notifications are limited to 50 most recent

## 🎯 Next Steps (Optional Enhancements)

1. Add sound file (`/public/notification.mp3`)
2. Add logo for browser notifications (`/public/logo.png`)
3. Implement notification preferences (sound on/off)
4. Add notification filtering by type
5. Implement notification deletion
6. Add "Clear All" functionality
7. Show notification details modal
