// ── Submit Product Page (Dynamic, i18n) ───────────────────────

async function renderSubmitPage() {
    const app = $('#app');
    app.innerHTML = `<div class="page-content"><div class="container">${renderPageLoader()}</div></div>`;

    try {
        // Dynamically fetch categories and plans from the API
        const [categoriesData, plansData] = await Promise.all([
            API.get('/categories'),
            API.get('/plans'),
        ]);

        // Flatten categories (include children)
        const allCategories = [];
        categoriesData.forEach(cat => {
            allCategories.push(cat);
            if (cat.children) cat.children.forEach(c => allCategories.push(c));
        });

        const isAr = I18n.isAr();
        const t = I18n.t.bind(I18n);

        app.innerHTML = `
      <div class="page-content page-enter">
        <!-- Hero Banner -->
        <div class="submit-hero">
          <div class="submit-hero__bg"></div>
          <div class="container submit-hero__content slide-up">
            <div class="submit-hero__badge">${Icons.sparkles(16)} ${isAr ? 'أضف منتجك' : 'List Your Product'}</div>
            <h1 class="submit-hero__title">
              ${isAr ? 'انضم إلى <span class="gradient-text">SoftMarket</span>' : 'Join <span class="gradient-text">SoftMarket</span>'}
            </h1>
            <p class="submit-hero__subtitle">
              ${isAr
                ? 'أضف منتجك البرمجي ليصل لآلاف الشركات في المنطقة العربية. العملية سهلة وسريعة!'
                : 'List your software product to reach thousands of businesses in the MENA region. Quick and easy!'}
            </p>
            <div class="submit-hero__steps">
              <div class="submit-step">
                <div class="submit-step__num">1</div>
                <div class="submit-step__label">${isAr ? 'املأ البيانات' : 'Fill Details'}</div>
              </div>
              <div class="submit-step__connector"></div>
              <div class="submit-step">
                <div class="submit-step__num">2</div>
                <div class="submit-step__label">${isAr ? 'نراجع الطلب' : 'We Review'}</div>
              </div>
              <div class="submit-step__connector"></div>
              <div class="submit-step">
                <div class="submit-step__num">3</div>
                <div class="submit-step__label">${isAr ? 'يظهر منتجك!' : 'You\'re Live!'}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <form id="submit-form" class="submit-form" novalidate>

            <!-- ═══ Section 1: Company ═══ -->
            <div class="submit-section card slide-up" style="animation-delay:0.05s;">
              <div class="submit-section__header">
                <div class="submit-section__icon">${Icons.building(22)}</div>
                <div>
                  <h2 class="submit-section__title">${isAr ? 'بيانات الشركة' : 'Company Information'}</h2>
                  <p class="submit-section__desc">${isAr ? 'أخبرنا عن شركتك' : 'Tell us about your company'}</p>
                </div>
              </div>
              <div class="submit-grid">
                <div class="form-group">
                  <label class="form-label" for="sf-companyNameAr">${isAr ? 'اسم الشركة بالعربية' : 'Company Name (Arabic)'} <span class="required">*</span></label>
                  <input type="text" id="sf-companyNameAr" required placeholder="${isAr ? 'مثال: تقنية السحاب' : 'e.g. تقنية السحاب'}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="sf-companyNameEn">${isAr ? 'اسم الشركة بالإنجليزية' : 'Company Name (English)'}</label>
                  <input type="text" id="sf-companyNameEn" placeholder="${isAr ? 'مثال: Cloud Tech' : 'e.g. Cloud Tech'}" dir="ltr">
                </div>
              </div>
              <div class="submit-grid">
                <div class="form-group">
                  <label class="form-label" for="sf-companySlug">${isAr ? 'الاسم المختصر (slug)' : 'Company Slug'} <span class="required">*</span></label>
                  <input type="text" id="sf-companySlug" required placeholder="cloud-tech" dir="ltr">
                  <span class="form-hint">${isAr ? 'أحرف صغيرة وأرقام وشرطات فقط' : 'Lowercase letters, numbers, and hyphens only'}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="sf-companyWebsite">${isAr ? 'موقع الشركة' : 'Company Website'}</label>
                  <input type="url" id="sf-companyWebsite" placeholder="https://your-company.com" dir="ltr">
                </div>
              </div>
              <div class="submit-grid">
                <div class="form-group">
                  <label class="form-label" for="sf-companyCountry">${isAr ? 'الدولة' : 'Country'}</label>
                  <select id="sf-companyCountry" class="form-select">
                    <option value="">${isAr ? 'اختر الدولة' : 'Select country'}</option>
                    <option value="SA">${isAr ? 'السعودية' : 'Saudi Arabia'}</option>
                    <option value="AE">${isAr ? 'الإمارات' : 'UAE'}</option>
                    <option value="EG">${isAr ? 'مصر' : 'Egypt'}</option>
                    <option value="JO">${isAr ? 'الأردن' : 'Jordan'}</option>
                    <option value="KW">${isAr ? 'الكويت' : 'Kuwait'}</option>
                    <option value="BH">${isAr ? 'البحرين' : 'Bahrain'}</option>
                    <option value="QA">${isAr ? 'قطر' : 'Qatar'}</option>
                    <option value="OM">${isAr ? 'عمان' : 'Oman'}</option>
                    <option value="MA">${isAr ? 'المغرب' : 'Morocco'}</option>
                    <option value="TN">${isAr ? 'تونس' : 'Tunisia'}</option>
                    <option value="OTHER">${isAr ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="sf-companyFounded">${isAr ? 'سنة التأسيس' : 'Founded Year'}</label>
                  <input type="number" id="sf-companyFounded" placeholder="2020" min="1900" max="2100" dir="ltr">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="sf-companyDesc">${isAr ? 'وصف الشركة بالعربية' : 'Company Description (Arabic)'}</label>
                <textarea id="sf-companyDesc" rows="3" placeholder="${isAr ? 'وصف مختصر عن شركتك ومجال عملها...' : 'Brief description about your company...'}"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label" for="sf-companyLogo">${isAr ? 'رابط شعار الشركة' : 'Company Logo URL'}</label>
                <input type="url" id="sf-companyLogo" placeholder="https://your-domain.com/logo.png" dir="ltr">
                <span class="form-hint">${isAr ? 'صورة مربعة PNG/SVG بحد أدنى 200×200 بكسل' : 'Square PNG/SVG image, minimum 200×200px'}</span>
              </div>
            </div>

            <!-- ═══ Section 2: Product ═══ -->
            <div class="submit-section card slide-up" style="animation-delay:0.1s;">
              <div class="submit-section__header">
                <div class="submit-section__icon">${Icons.package(22)}</div>
                <div>
                  <h2 class="submit-section__title">${isAr ? 'بيانات المنتج' : 'Product Information'}</h2>
                  <p class="submit-section__desc">${isAr ? 'أخبرنا عن منتجك' : 'Tell us about your product'}</p>
                </div>
              </div>
              <div class="submit-grid">
                <div class="form-group">
                  <label class="form-label" for="sf-productNameAr">${isAr ? 'اسم المنتج بالعربية' : 'Product Name (Arabic)'} <span class="required">*</span></label>
                  <input type="text" id="sf-productNameAr" required placeholder="${isAr ? 'مثال: مشاريعي' : 'e.g. مشاريعي'}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="sf-productNameEn">${isAr ? 'اسم المنتج بالإنجليزية' : 'Product Name (English)'}</label>
                  <input type="text" id="sf-productNameEn" placeholder="${isAr ? 'مثال: Masharii' : 'e.g. Masharii'}" dir="ltr">
                </div>
              </div>
              <div class="submit-grid">
                <div class="form-group">
                  <label class="form-label" for="sf-productSlug">${isAr ? 'الاسم المختصر (slug)' : 'Product Slug'} <span class="required">*</span></label>
                  <input type="text" id="sf-productSlug" required placeholder="masharii" dir="ltr">
                  <span class="form-hint">${isAr ? 'سيظهر في الرابط: softmarket.com/product/your-slug' : 'Will appear in URL: softmarket.com/product/your-slug'}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="sf-category">${isAr ? 'التصنيف' : 'Category'} <span class="required">*</span></label>
                  <select id="sf-category" class="form-select" required>
                    <option value="">${isAr ? 'اختر التصنيف' : 'Select category'}</option>
                    ${allCategories.map(c => `<option value="${c.id}">${isAr ? c.nameAr : (c.nameEn || c.nameAr)}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="sf-tagline">${isAr ? 'الوصف المختصر (سطر واحد)' : 'Tagline (one-liner pitch)'}</label>
                <input type="text" id="sf-tagline" placeholder="${isAr ? 'إدارة مشاريعك بذكاء وسهولة' : 'Manage your projects with intelligence and ease'}" maxlength="200">
              </div>
              <div class="form-group">
                <label class="form-label" for="sf-description">${isAr ? 'وصف تفصيلي بالعربية' : 'Detailed Description (Arabic)'}</label>
                <textarea id="sf-description" rows="5" placeholder="${isAr ? 'اشرح ميزات منتجك وكيف يساعد المستخدمين...' : 'Explain your product features and how it helps users...'}"></textarea>
              </div>
              <div class="submit-grid">
                <div class="form-group">
                  <label class="form-label" for="sf-productWebsite">${isAr ? 'رابط موقع المنتج' : 'Product Website'}</label>
                  <input type="url" id="sf-productWebsite" placeholder="https://your-product.com" dir="ltr">
                </div>
                <div class="form-group">
                  <label class="form-label" for="sf-productLogo">${isAr ? 'رابط شعار المنتج' : 'Product Logo URL'}</label>
                  <input type="url" id="sf-productLogo" placeholder="https://your-domain.com/product-logo.png" dir="ltr">
                </div>
              </div>
            </div>

            <!-- ═══ Section 3: Preview ═══ -->
            <div class="submit-section card slide-up" style="animation-delay:0.15s;">
              <div class="submit-section__header">
                <div class="submit-section__icon">${Icons.monitor(22)}</div>
                <div>
                  <h2 class="submit-section__title">${isAr ? 'معاينة المنتج' : 'Product Preview'}</h2>
                  <p class="submit-section__desc">${isAr ? 'اختر كيف يشاهد المستخدمون منتجك' : 'Choose how users can preview your product'}</p>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="sf-previewType">${isAr ? 'نوع المعاينة' : 'Preview Type'}</label>
                <div class="submit-preview-options" id="preview-type-options">
                  <label class="submit-preview-option active" data-value="none">
                    <input type="radio" name="previewType" value="none" checked>
                    <span class="submit-preview-option__icon">${Icons.x(20)}</span>
                    <span class="submit-preview-option__label">${isAr ? 'بدون معاينة' : 'None'}</span>
                  </label>
                  <label class="submit-preview-option" data-value="iframe">
                    <input type="radio" name="previewType" value="iframe">
                    <span class="submit-preview-option__icon">${Icons.monitor(20)}</span>
                    <span class="submit-preview-option__label">${isAr ? 'معاينة حية' : 'Live Demo'}</span>
                  </label>
                  <label class="submit-preview-option" data-value="video">
                    <input type="radio" name="previewType" value="video">
                    <span class="submit-preview-option__icon">${Icons.video(20)}</span>
                    <span class="submit-preview-option__label">${isAr ? 'فيديو' : 'Video'}</span>
                  </label>
                  <label class="submit-preview-option" data-value="screenshots">
                    <input type="radio" name="previewType" value="screenshots">
                    <span class="submit-preview-option__icon">${Icons.image(20)}</span>
                    <span class="submit-preview-option__label">${isAr ? 'صور شاشة' : 'Screenshots'}</span>
                  </label>
                </div>
              </div>
              <div id="preview-fields-container">
                <!-- Dynamically populated based on previewType -->
              </div>
            </div>

            <!-- ═══ Section 4: Pricing Plans ═══ -->
            <div class="submit-section card slide-up" style="animation-delay:0.2s;">
              <div class="submit-section__header">
                <div class="submit-section__icon">${Icons.creditCard(22)}</div>
                <div>
                  <h2 class="submit-section__title">${isAr ? 'خطط التسعير' : 'Pricing Plans'} <span class="required">*</span></h2>
                  <p class="submit-section__desc">${isAr ? 'أضف خطة واحدة على الأقل' : 'Add at least one pricing plan'}</p>
                </div>
              </div>
              <div id="plans-container"></div>
              <button type="button" class="btn btn-ghost submit-add-plan-btn" id="add-plan-btn">
                ${Icons.sparkles(14)} ${isAr ? 'إضافة خطة أخرى' : 'Add Another Plan'}
              </button>
            </div>

            <!-- ═══ Section 5: Contact ═══ -->
            <div class="submit-section card slide-up" style="animation-delay:0.25s;">
              <div class="submit-section__header">
                <div class="submit-section__icon">${Icons.messageCircle(22)}</div>
                <div>
                  <h2 class="submit-section__title">${isAr ? 'بيانات التواصل' : 'Contact Information'}</h2>
                  <p class="submit-section__desc">${isAr ? 'للتواصل معك بخصوص الطلب' : 'So we can contact you about your submission'}</p>
                </div>
              </div>
              <div class="submit-grid">
                <div class="form-group">
                  <label class="form-label" for="sf-contactEmail">${isAr ? 'البريد الإلكتروني' : 'Email Address'} <span class="required">*</span></label>
                  <input type="email" id="sf-contactEmail" required placeholder="you@company.com" dir="ltr">
                </div>
                <div class="form-group">
                  <label class="form-label" for="sf-contactName">${isAr ? 'اسمك' : 'Your Name'}</label>
                  <input type="text" id="sf-contactName" placeholder="${isAr ? 'الاسم الكامل' : 'Full name'}">
                </div>
              </div>
            </div>

            <!-- ═══ Submit Button ═══ -->
            <div id="sf-error" class="form-error submit-error" style="display:none;"></div>
            <div class="submit-actions slide-up" style="animation-delay:0.3s;">
              <button type="submit" class="btn btn-primary btn-lg btn-ripple submit-btn" id="sf-submit">
                ${Icons.arrowUpRight(18)} ${isAr ? 'إرسال الطلب' : 'Submit Product'}
              </button>
              <p class="submit-disclaimer">
                ${isAr
                ? 'بالإرسال، أنت توافق على مراجعة فريقنا لبيانات منتجك. سنتواصل معك خلال 24-48 ساعة.'
                : 'By submitting, you agree to our team reviewing your product data. We\'ll contact you within 24-48 hours.'}
              </p>
            </div>

          </form>
        </div>
      </div>
    `;

        // ── Dynamic Logic ──────────────────────────────────────

        const plansArr = plansData; // [{id, nameAr, nameEn, tier}, ...]
        let planCount = 0;

        // Add first plan by default
        addPlanRow();

        // Auto-slug from Arabic company name
        const companyNameArInput = $('#sf-companyNameAr');
        const companySlugInput = $('#sf-companySlug');
        companyNameArInput.addEventListener('input', () => {
            companySlugInput.value = slugify(companyNameArInput.value);
        });

        // Auto-slug from Arabic product name
        const productNameArInput = $('#sf-productNameAr');
        const productSlugInput = $('#sf-productSlug');
        productNameArInput.addEventListener('input', () => {
            productSlugInput.value = slugify(productNameArInput.value);
        });

        // Preview type radio buttons
        const previewOptions = document.querySelectorAll('.submit-preview-option');
        previewOptions.forEach(option => {
            option.addEventListener('click', () => {
                previewOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                const val = option.dataset.value;
                option.querySelector('input').checked = true;
                updatePreviewFields(val);
            });
        });

        function updatePreviewFields(type) {
            const container = $('#preview-fields-container');
            if (type === 'iframe') {
                container.innerHTML = `
          <div class="form-group slide-up">
            <label class="form-label" for="sf-demoUrl">${isAr ? 'رابط المعاينة الحية' : 'Live Demo URL'} <span class="required">*</span></label>
            <input type="url" id="sf-demoUrl" placeholder="https://demo.your-product.com" dir="ltr">
            <span class="form-hint">${isAr ? 'يجب أن يسمح بالعرض داخل iframe' : 'Must allow embedding in an iframe'}</span>
          </div>`;
            } else if (type === 'video') {
                container.innerHTML = `
          <div class="form-group slide-up">
            <label class="form-label" for="sf-demoVideoUrl">${isAr ? 'رابط الفيديو (YouTube Embed)' : 'Video URL (YouTube Embed)'} <span class="required">*</span></label>
            <input type="url" id="sf-demoVideoUrl" placeholder="https://www.youtube.com/embed/VIDEO_ID" dir="ltr">
            <span class="form-hint">${isAr ? 'استخدم رابط embed وليس الرابط العادي' : 'Use the embed URL, not the regular URL'}</span>
          </div>`;
            } else if (type === 'screenshots') {
                container.innerHTML = `
          <div class="form-group slide-up">
            <label class="form-label">${isAr ? 'روابط صور الشاشة' : 'Screenshot URLs'}</label>
            <div id="screenshots-container">
              <div class="submit-screenshot-row">
                <input type="url" class="screenshot-url" placeholder="https://your-domain.com/screenshot1.png" dir="ltr">
              </div>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" id="add-screenshot-btn" style="margin-top:var(--space-2);">
              + ${isAr ? 'إضافة صورة' : 'Add Screenshot'}
            </button>
            <span class="form-hint">${isAr ? 'يفضل مقاس 800×500 بكسل أو أكبر' : 'Recommended size: 800×500px or larger'}</span>
          </div>`;
                $('#add-screenshot-btn').addEventListener('click', () => {
                    const row = document.createElement('div');
                    row.className = 'submit-screenshot-row slide-up';
                    row.innerHTML = `
            <input type="url" class="screenshot-url" placeholder="https://your-domain.com/screenshot.png" dir="ltr">
            <button type="button" class="btn btn-ghost btn-sm submit-remove-btn" onclick="this.parentElement.remove()">✕</button>
          `;
                    $('#screenshots-container').appendChild(row);
                });
            } else {
                container.innerHTML = '';
            }
        }

        // Plans management
        function addPlanRow() {
            planCount++;
            const container = $('#plans-container');
            const row = document.createElement('div');
            row.className = 'submit-plan-card card slide-up';
            row.id = `plan-row-${planCount}`;
            row.innerHTML = `
        <div class="submit-plan-card__header">
          <h3>${isAr ? `خطة ${planCount}` : `Plan ${planCount}`}</h3>
          ${planCount > 1 ? `<button type="button" class="btn btn-ghost btn-sm submit-remove-btn" data-remove-plan="${planCount}">✕ ${isAr ? 'حذف' : 'Remove'}</button>` : ''}
        </div>
        <div class="submit-grid">
          <div class="form-group">
            <label class="form-label">${isAr ? 'مستوى الخطة' : 'Plan Tier'} <span class="required">*</span></label>
            <select class="form-select plan-tier-select" required>
              <option value="">${isAr ? 'اختر' : 'Select'}</option>
              ${plansArr.map(p => `<option value="${p.id}">${isAr ? p.nameAr : (p.nameEn || p.nameAr)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">${isAr ? 'العملة' : 'Currency'}</label>
            <select class="form-select plan-currency-select">
              <option value="SAR">${isAr ? 'ريال سعودي (SAR)' : 'SAR'}</option>
              <option value="USD">${isAr ? 'دولار (USD)' : 'USD'}</option>
              <option value="AED">${isAr ? 'درهم إماراتي (AED)' : 'AED'}</option>
              <option value="EGP">${isAr ? 'جنيه مصري (EGP)' : 'EGP'}</option>
            </select>
          </div>
        </div>
        <div class="submit-grid">
          <div class="form-group">
            <label class="form-label">${isAr ? 'السعر الشهري' : 'Monthly Price'}</label>
            <input type="number" class="plan-price-monthly" min="0" value="0" dir="ltr">
          </div>
          <div class="form-group">
            <label class="form-label">${isAr ? 'السعر السنوي' : 'Yearly Price'}</label>
            <input type="number" class="plan-price-yearly" min="0" value="0" dir="ltr">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">${isAr ? 'الميزات (كل ميزة في سطر)' : 'Features (one per line)'}</label>
          <textarea class="plan-features" rows="4" placeholder="${isAr ? 'ميزة 1\nميزة 2\nميزة 3' : 'Feature 1\nFeature 2\nFeature 3'}"></textarea>
        </div>
        <label class="filter-checkbox">
          <input type="checkbox" class="plan-is-popular"> ${isAr ? 'خطة الأكثر شيوعًا' : 'Most Popular Plan'}
        </label>
      `;
            container.appendChild(row);

            // Remove handler
            const removeBtn = row.querySelector(`[data-remove-plan="${planCount}"]`);
            if (removeBtn) {
                removeBtn.addEventListener('click', () => row.remove());
            }
        }

        $('#add-plan-btn').addEventListener('click', addPlanRow);

        // ── Form Submission ────────────────────────────────────
        $('#submit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = $('#sf-submit');
            const errorEl = $('#sf-error');
            errorEl.style.display = 'none';
            btn.disabled = true;
            btn.innerHTML = `${Icons.loader(18)} ${isAr ? 'جارٍ الإرسال...' : 'Submitting...'}`;

            // Gather preview fields
            const previewType = document.querySelector('input[name="previewType"]:checked')?.value || 'none';
            const demoUrl = $('#sf-demoUrl')?.value || '';
            const demoVideoUrl = $('#sf-demoVideoUrl')?.value || '';
            const screenshotEls = document.querySelectorAll('.screenshot-url');
            const screenshots = Array.from(screenshotEls).map(el => el.value.trim()).filter(Boolean);

            // Gather plans
            const planRows = document.querySelectorAll('.submit-plan-card');
            const plans = Array.from(planRows).map(row => ({
                planId: row.querySelector('.plan-tier-select').value,
                priceMonthly: parseFloat(row.querySelector('.plan-price-monthly').value) || 0,
                priceYearly: parseFloat(row.querySelector('.plan-price-yearly').value) || 0,
                currency: row.querySelector('.plan-currency-select').value,
                isPopular: row.querySelector('.plan-is-popular').checked,
                features: row.querySelector('.plan-features').value.split('\n').map(f => f.trim()).filter(Boolean),
            })).filter(p => p.planId);

            const payload = {
                companyNameAr: $('#sf-companyNameAr').value.trim(),
                companyNameEn: $('#sf-companyNameEn').value.trim() || undefined,
                companySlug: $('#sf-companySlug').value.trim(),
                companyLogoUrl: $('#sf-companyLogo').value.trim() || undefined,
                companyDescriptionAr: $('#sf-companyDesc').value.trim() || undefined,
                companyWebsite: $('#sf-companyWebsite').value.trim() || undefined,
                companyCountry: $('#sf-companyCountry').value || undefined,
                companyFoundedYear: $('#sf-companyFounded').value ? parseInt($('#sf-companyFounded').value) : undefined,

                productNameAr: $('#sf-productNameAr').value.trim(),
                productNameEn: $('#sf-productNameEn').value.trim() || undefined,
                productSlug: $('#sf-productSlug').value.trim(),
                productTaglineAr: $('#sf-tagline').value.trim() || undefined,
                productDescriptionAr: $('#sf-description').value.trim() || undefined,
                productLogoUrl: $('#sf-productLogo').value.trim() || undefined,
                productWebsite: $('#sf-productWebsite').value.trim() || undefined,
                categoryId: $('#sf-category').value,
                previewType,
                demoUrl: demoUrl || undefined,
                demoVideoUrl: demoVideoUrl || undefined,
                screenshots,

                plans,

                contactEmail: $('#sf-contactEmail').value.trim(),
                contactName: $('#sf-contactName').value.trim() || undefined,
            };

            try {
                const result = await API.post('/submissions', payload);
                // Show success screen
                app.innerHTML = `
          <div class="page-content page-enter">
            <div class="container">
              <div class="submit-success slide-up">
                <div class="submit-success__icon">${Icons.checkCircle(64)}</div>
                <h1 class="submit-success__title">${isAr ? 'تم إرسال طلبك بنجاح! 🎉' : 'Submission Received! 🎉'}</h1>
                <p class="submit-success__text">
                  ${isAr
                        ? 'شكرًا لك! سيراجع فريقنا بيانات منتجك وسنتواصل معك عبر البريد الإلكتروني خلال 24-48 ساعة.'
                        : 'Thank you! Our team will review your product details and contact you via email within 24-48 hours.'}
                </p>
                <div class="submit-success__details card">
                  <div class="submit-success__row">
                    <span>${isAr ? 'رقم الطلب:' : 'Submission ID:'}</span>
                    <code>${result.id}</code>
                  </div>
                  <div class="submit-success__row">
                    <span>${isAr ? 'المنتج:' : 'Product:'}</span>
                    <strong>${payload.productNameAr}</strong>
                  </div>
                  <div class="submit-success__row">
                    <span>${isAr ? 'الشركة:' : 'Company:'}</span>
                    <strong>${payload.companyNameAr}</strong>
                  </div>
                </div>
                <div class="flex gap-4 justify-center" style="margin-top:var(--space-8);">
                  <a href="#/" class="btn btn-primary btn-ripple">${isAr ? 'العودة للرئيسية' : 'Back to Home'}</a>
                  <a href="#/submit" class="btn btn-secondary btn-ripple">${isAr ? 'إضافة منتج آخر' : 'Submit Another'}</a>
                </div>
              </div>
            </div>
          </div>
        `;
            } catch (err) {
                errorEl.textContent = err.message || (isAr ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.');
                errorEl.style.display = 'block';
                errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                btn.disabled = false;
                btn.innerHTML = `${Icons.arrowUpRight(18)} ${isAr ? 'إرسال الطلب' : 'Submit Product'}`;
            }
        });

    } catch (err) {
        app.innerHTML = `<div class="page-content"><div class="container">${renderEmptyState(
            I18n.isAr() ? 'حدث خطأ' : 'Error',
            err.message,
            Icons.alertCircle(48),
            I18n.t('general.backHome'),
            '/'
        )}</div></div>`;
    }
}
