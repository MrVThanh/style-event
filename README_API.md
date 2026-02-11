# API Integration Guide

## ✅ Đã Fix Network Error

### Vấn đề trước đây

- Function `register` được gọi từ client-side không phải Server Action
- Gây ra lỗi CORS và Network Error khi call API từ browser

### Giải pháp đã áp dụng

#### 1. **Convert sang Server Action**

File `actions/auth/register.ts` đã được thêm directive `"use server"` ở đầu file để chạy trên server-side.

#### 2. **Enhanced Error Handling**

Thêm comprehensive error handling cho các trường hợp:

- ✅ Network errors (CORS, no internet)
- ✅ Timeout errors (request quá 10 giây)
- ✅ Server errors (4xx, 5xx)
- ✅ Unknown errors

#### 3. **User Experience Improvements**

- ✅ Loading state với spinner khi submit
- ✅ Disable tất cả inputs khi đang submit
- ✅ Error messages đa ngôn ngữ (vi/en)
- ✅ Auto reset form sau khi submit thành công
- ✅ Toast notifications cho success/error

## Cấu hình API

### Environment Variables

Tạo file `.env.local` trong root directory:

```bash
NEXT_PUBLIC_API_URL=https://54-151-179-240.nip.io
```

Hoặc copy từ file example:

```bash
cp .env.example .env.local
```

### API Endpoint

**POST** `/api/v1/registers`

**Request Body:**

```json
{
  "full_name": "Nguyen Van A",
  "email": "example@company.com",
  "gender": "male",
  "company_name": "ABC Company",
  "position": "Director",
  "phone": "0912345678"
}
```

**Response (Success):**

```json
{
  "success": true,
  "data": { ... },
  "message": "Registration successful"
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Error Codes

| Code            | Mô tả                                         | Tiếng Việt                |
| --------------- | --------------------------------------------- | ------------------------- |
| `NETWORK_ERROR` | Không kết nối được server (CORS, no internet) | Lỗi kết nối mạng          |
| `TIMEOUT`       | Request quá thời gian chờ (>10s)              | Yêu cầu hết thời gian chờ |
| `4xx/5xx`       | Lỗi từ server                                 | Server trả về lỗi         |

## Testing

### Test local với dev server:

```bash
npm run dev
```

Truy cập: http://localhost:3000/register

### Test các trường hợp lỗi:

1. **Network Error**: Tắt internet hoặc sai API URL
2. **Timeout Error**: API response > 10 giây
3. **Validation Error**: Nhập sai format (email, phone)
4. **Server Error**: API trả về 4xx/5xx

## Troubleshooting

### Vẫn gặp Network Error?

1. **Kiểm tra API URL**

   ```bash
   echo $NEXT_PUBLIC_API_URL
   ```

2. **Restart dev server**

   ```bash
   npm run dev
   ```

3. **Kiểm tra CORS headers từ API**
   Server cần trả về:

   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type
   ```

4. **Test API với curl**
   ```bash
   curl -X POST https://54-151-179-240.nip.io/api/v1/registers \
     -H "Content-Type: application/json" \
     -d '{"full_name":"Test","email":"test@test.com","gender":"male","company_name":"Test","position":"Test","phone":"0912345678"}'
   ```

### Timeout Error?

- Tăng timeout trong `actions/auth/register.ts`:
  ```ts
  timeout: 30000, // 30 seconds
  ```

## Production Deployment

Khi deploy lên production, cần set environment variable:

**Vercel:**

```bash
vercel env add NEXT_PUBLIC_API_URL
```

**Docker:**

```dockerfile
ENV NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

**Other platforms:**
Set `NEXT_PUBLIC_API_URL` trong dashboard/settings của platform.
