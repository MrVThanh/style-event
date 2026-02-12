# Video URL Options - Quick Reference

## ✅ Option 1: Fixed Cloudinary URL (Hiện tại)

```typescript
video_url: "https://res.cloudinary.com/thanh2k3/video/upload/dd0ae1c132c7e0056d15eb88965b9346.mp4"
```

**Test nếu URL này không work:**
1. Open URL trực tiếp trong browser
2. Nếu 404 → Video không tồn tại trên Cloudinary → Dùng Option 2 hoặc 3

## ✅ Option 2: Test Video (Recommended)

```typescript
const resource = {
  mobile: {
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    image_url: "https://pnganime.com/web/image-thumbnails/529/887-md.png",
  },
  desktop: {
    video_url: "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1770782911590308487_video_hung-dev-test.mp4?...",
    image_url: "https://i.pinimg.com/originals/5b/8c/85/5b8c853780def283ec9c6f5b62dbe498.png",
  }
}
```

**Pros:**
- ✅ Guaranteed to work
- ✅ Public accessible
- ✅ Good quality (720p)
- ✅ Free to use

## ✅ Option 3: Dùng desktop URL cho cả 2

```typescript
const CLOUDFRONT_VIDEO = "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1770782911590308487_video_hung-dev-test.mp4?Expires=4924382998&Signature=e-VCVg8fNSWIzHxE56cyCayeTUpMfPG3cr~v7azTIAZav3glSjgBzQ9lXIZ6hVwcEe-lU4PNfCIl6PllNw~WfeBB1AYY0IcsRmzi-teVcG0XIdPIu-jykDMjWcyKGTLA18~w3bbAL0gscks4u7cAxiTUjP2r8Q9B6sbbg-vKFEzbFpj4hYXGUcCIMusXZvJQCBFy8kN-Vm7JTsFhueQn1XNZc4PLRZQblh~laYFYSA-CEwpxSjZeHP7FNhRcRZjF0HYR13ZWTmXh4txdygJwpJhxlbWU6CWRBsNH8SvAyqSW4SWCWXoHbwLczmllQVHoetnfuRhKUct0UNjfa5NBDg__&Key-Pair-Id=K1RAOUJU1Q3EVC"

const resource = {
  mobile: {
    video_url: CLOUDFRONT_VIDEO, // Dùng chung video
    image_url: "https://pnganime.com/web/image-thumbnails/529/887-md.png",
  },
  desktop: {
    video_url: CLOUDFRONT_VIDEO,
    image_url: "https://i.pinimg.com/originals/5b/8c/85/5b8c853780def283ec9c6f5b62dbe498.png",
  }
}
```

**Pros:**
- ✅ Sử dụng video đã có sẵn
- ✅ Đã test và hoạt động
- ✅ Không cần video mới

## 🔄 Quick Switch

Copy-paste vào line 20-28 trong `app/page.tsx`:

### For Test Video:
```typescript
  const resource = {
    mobile: {
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      image_url: "https://pnganime.com/web/image-thumbnails/529/887-md.png",
    },
    desktop: {
      video_url: "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1770782911590308487_video_hung-dev-test.mp4?Expires=4924382998&Signature=e-VCVg8fNSWIzHxE56cyCayeTUpMfPG3cr~v7azTIAZav3glSjgBzQ9lXIZ6hVwcEe-lU4PNfCIl6PllNw~WfeBB1AYY0IcsRmzi-teVcG0XIdPIu-jykDMjWcyKGTLA18~w3bbAL0gscks4u7cAxiTUjP2r8Q9B6sbbg-vKFEzbFpj4hYXGUcCIMusXZvJQCBFy8kN-Vm7JTsFhueQn1XNZc4PLRZQblh~laYFYSA-CEwpxSjZeHP7FNhRcRZjF0HYR13ZWTmXh4txdygJwpJhxlbWU6CWRBsNH8SvAyqSW4SWCWXoHbwLczmllQVHoetnfuRhKUct0UNjfa5NBDg__&Key-Pair-Id=K1RAOUJU1Q3EVC",
      image_url: "https://i.pinimg.com/originals/5b/8c/85/5b8c853780def283ec9c6f5b62dbe498.png",
    },
  }
```

## 🧪 Test Current Setup

1. **Check Cloudinary URL:**
```bash
# Open in browser:
https://res.cloudinary.com/thanh2k3/video/upload/dd0ae1c132c7e0056d15eb88965b9346.mp4
```

Nếu thấy:
- ✅ Video plays → URL OK, keep current
- ❌ 404 Error → Video không tồn tại, switch to Option 2

2. **Test in app:**
```bash
npm run dev
# Open http://localhost:3000
# Resize window < 768px (mobile mode)
# Should see video playing
```

## 📝 Cloudinary Upload Guide

Nếu muốn upload video mới lên Cloudinary:

### Step 1: Upload
```bash
# Using Cloudinary CLI
cloudinary uploader.upload("path/to/video.mp4", {
  resource_type: "video",
  public_id: "my-mobile-video"
})
```

### Step 2: Get URL
```typescript
// Format:
https://res.cloudinary.com/thanh2k3/video/upload/{public_id}.mp4

// Example:
https://res.cloudinary.com/thanh2k3/video/upload/my-mobile-video.mp4
```

### Step 3: Use in app
```typescript
const resource = {
  mobile: {
    video_url: "https://res.cloudinary.com/thanh2k3/video/upload/my-mobile-video.mp4",
    image_url: "..."
  },
  desktop: { ... }
}
```

## 💡 Quick Fix

Nếu vẫn lỗi "No supported sources", thử ngay:

```typescript
// Line 18: Change hasShow to use mobile_image instead
const hasShow = (matches ? "desktop_video" : "mobile_image") as ...
```

Điều này sẽ show image thay vì video trên mobile, verify logic hoạt động.
Sau đó fix video URL và switch back to "mobile_video".
