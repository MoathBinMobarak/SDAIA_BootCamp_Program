# 🛒 List Your Product on SoftMarket

**[SoftMarket](https://softmarket.com)** is an Arabic-first cloud software directory helping businesses in the MENA region discover, compare, and try SaaS products.

## 🚀 Want to list your product?

### Option 1: Use Our Submission Form (Recommended)
Submit your product directly through our **dynamic submission form**:

👉 **[Submit Your Product →](https://softmarket.com/#/submit)**

The form dynamically loads all available categories and pricing tiers — just fill in your details and we'll review within 24-48 hours.

---

### Option 2: Open a GitHub Issue

Open an issue in this repo titled `[Product Listing] Your Product Name` with the following template:

```yaml
# Company
company_name_ar: اسم الشركة بالعربية
company_name_en: Company Name in English
company_website: https://your-company.com
company_country: SA  # ISO country code

# Product
product_name_ar: اسم المنتج بالعربية
product_name_en: Product Name in English  
product_website: https://your-product.com
product_tagline_ar: سطر وصف قصير بالعربية
product_description_ar: وصف تفصيلي بالعربية

# Preview (choose one: none / iframe / video / screenshots)
preview_type: screenshots
demo_url:                    # for iframe type
demo_video_url:              # for video type (YouTube embed URL)
screenshots:                 # for screenshots type
  - https://your-domain.com/screenshot1.png
  - https://your-domain.com/screenshot2.png

# Pricing (at least one plan)
plans:
  - tier: Free
    price_monthly: 0
    features: [Feature 1, Feature 2, Feature 3]
  - tier: Pro  
    price_monthly: 99
    price_yearly: 990
    currency: SAR
    is_popular: true
    features: [Everything in Free, Feature 4, Feature 5, Priority Support]

# Contact
contact_email: you@company.com
contact_name: Your Name
```

---

### What Happens Next?

1. ✅ You submit your product details
2. 🔍 Our team reviews within **24-48 hours**
3. 🚀 Your product goes live on SoftMarket!

---

### Requirements

- **Arabic name** is required for company and product
- **At least one pricing plan** must be provided
- **Logo** should be a square image (PNG/SVG, ≥200×200px)  
- **Screenshots** should be ≥800×500px
- **Demo URL** must allow iframe embedding (if using live preview)
- **Video URL** must use embed format: `https://www.youtube.com/embed/VIDEO_ID`

---

<p align="center">
  <strong>🌐 <a href="https://softmarket.com">softmarket.com</a></strong><br>
  <em>The first comprehensive Arabic cloud software directory</em>
</p>
