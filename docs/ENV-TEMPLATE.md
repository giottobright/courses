# Environment Variables Template

Copy this to `.env` and fill in your values.

## Database
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/learnify"
```

## App Configuration
```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

## Memberstack (Authentication + Payments)
```bash
# Public key (frontend)
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY="pk_sb_..."

# Secret key (backend)
MEMBERSTACK_SECRET_KEY="sk_sb_..."

# Webhook secret (for verifying webhook signatures)
MEMBERSTACK_WEBHOOK_SECRET="whsec_..."
```

## Vimeo (Video Hosting)
```bash
VIMEO_ACCESS_TOKEN="your_vimeo_access_token"
VIMEO_CLIENT_ID="your_vimeo_client_id"
VIMEO_CLIENT_SECRET="your_vimeo_client_secret"
```

## Cloudinary (Image Upload)
```bash
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_preset"
```

## SendGrid (Email Service)
```bash
SENDGRID_API_KEY="SG.xxxxx"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="Learnify"
```

## Admin Configuration
```bash
# Comma-separated list of Memberstack user IDs who should have admin access
NEXT_PUBLIC_ADMIN_USER_IDS="user_id_1,user_id_2"
```

## Notes

### Memberstack Setup
1. Создайте account на [Memberstack](https://www.memberstack.com)
2. Получите Public и Secret keys из Dashboard
3. Настройте Stripe integration в Memberstack (Settings → Payments)
4. Создайте Plans для ваших курсов (Plans → Create Plan)
5. Настройте webhook URL: `https://yourdomain.com/api/webhooks/memberstack`

### Stripe (через Memberstack)
- **НЕ НУЖНЫ** прямые Stripe API keys
- Stripe интегрируется автоматически через Memberstack
- Memberstack обрабатывает все платежи и webhooks

### Previous Configuration (if migrating)
If you were using direct Stripe integration, you can safely remove:
```bash
# These are NO LONGER NEEDED:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# STRIPE_SECRET_KEY
# STRIPE_WEBHOOK_SECRET
```

Memberstack handles all Stripe integration automatically!
