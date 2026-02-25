// ── Admin Product Form (Create/Edit) ──────────────────────────

async function renderAdminProductForm(productId) {
    const isEdit = !!productId && productId !== 'new';
    const app = $('#app');
    app.innerHTML = renderAdminLayout(`
    <h1 class="text-2xl font-bold mb-8">${isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
    <div id="product-form-container">${renderPageLoader()}</div>
  `, 'products');

    try {
        const [companies, categories, product] = await Promise.all([
            API.get('/admin/companies'),
            API.get('/categories'),
            isEdit ? API.get(`/admin/products?limit=100`).then(r => r.data.find(p => p.id === productId)) : Promise.resolve(null),
        ]);

        const allCategories = [];
        categories.forEach(cat => {
            allCategories.push(cat);
            if (cat.children) allCategories.push(...cat.children);
        });

        $('#product-form-container').innerHTML = `
      <form id="product-form" class="card p-8" style="max-width:700px;">
        <div class="grid grid-2 gap-6">
          <div class="form-group">
            <label class="form-label">الاسم بالعربية *</label>
            <input type="text" id="pf-nameAr" required value="${product?.nameAr || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">الاسم بالإنجليزية</label>
            <input type="text" id="pf-nameEn" value="${product?.nameEn || ''}" dir="ltr">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">الاسم المختصر (slug) *</label>
          <input type="text" id="pf-slug" required value="${product?.slug || ''}" dir="ltr">
        </div>
        <div class="grid grid-2 gap-6">
          <div class="form-group">
            <label class="form-label">الشركة *</label>
            <select id="pf-company" class="form-select" required>
              <option value="">اختر الشركة</option>
              ${companies.map(c => `<option value="${c.id}" ${product?.companyId === c.id ? 'selected' : ''}>${c.nameAr}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">التصنيف *</label>
            <select id="pf-category" class="form-select" required>
              <option value="">اختر التصنيف</option>
              ${allCategories.map(c => `<option value="${c.id}" ${product?.categoryId === c.id ? 'selected' : ''}>${c.nameAr}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">الوصف المختصر</label>
          <input type="text" id="pf-tagline" value="${product?.taglineAr || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">الوصف التفصيلي</label>
          <textarea id="pf-description" rows="4">${product?.descriptionAr || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">رابط الموقع</label>
          <input type="url" id="pf-website" value="${product?.website || ''}" dir="ltr">
        </div>
        <div class="grid grid-2 gap-6">
          <div class="form-group">
            <label class="form-label">نوع المعاينة</label>
            <select id="pf-previewType" class="form-select">
              <option value="none" ${product?.previewType === 'none' ? 'selected' : ''}>بدون معاينة</option>
              <option value="iframe" ${product?.previewType === 'iframe' ? 'selected' : ''}>معاينة حية (iframe)</option>
              <option value="video" ${product?.previewType === 'video' ? 'selected' : ''}>فيديو توضيحي</option>
              <option value="screenshots" ${product?.previewType === 'screenshots' ? 'selected' : ''}>صور الشاشة</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">الحالة</label>
            <select id="pf-status" class="form-select">
              <option value="draft" ${product?.status === 'draft' ? 'selected' : ''}>مسودة</option>
              <option value="published" ${product?.status === 'published' ? 'selected' : ''}>منشور</option>
              <option value="archived" ${product?.status === 'archived' ? 'selected' : ''}>مؤرشف</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">رابط المعاينة الحية</label>
          <input type="url" id="pf-demoUrl" value="${product?.demoUrl || ''}" dir="ltr">
        </div>
        <div class="form-group">
          <label class="form-label">رابط الفيديو التوضيحي</label>
          <input type="url" id="pf-demoVideo" value="${product?.demoVideoUrl || ''}" dir="ltr">
        </div>
        <div class="flex items-center gap-4 mb-6">
          <label class="filter-checkbox">
            <input type="checkbox" id="pf-featured" ${product?.isFeatured ? 'checked' : ''}> منتج مميز
          </label>
        </div>
        <div id="pf-error" class="form-error mb-4" style="display:none;"></div>
        <div class="flex gap-4">
          <button type="submit" class="btn btn-primary" id="pf-submit">${isEdit ? 'حفظ التغييرات' : 'إنشاء المنتج'}</button>
          <button type="button" class="btn btn-ghost" onclick="Router.navigate('/admin/products')">إلغاء</button>
        </div>
      </form>
    `;

        // Auto-generate slug from Arabic name
        $('#pf-nameAr').addEventListener('input', (e) => {
            if (!isEdit) {
                $('#pf-slug').value = slugify(e.target.value.replace(/[\u0621-\u064A]/g, c => c));
            }
        });

        // Form submit
        $('#product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = $('#pf-submit');
            const errorEl = $('#pf-error');
            errorEl.style.display = 'none';
            btn.disabled = true;
            btn.textContent = 'جارٍ الحفظ...';

            const data = {
                companyId: $('#pf-company').value,
                categoryId: $('#pf-category').value,
                nameAr: $('#pf-nameAr').value,
                nameEn: $('#pf-nameEn').value || undefined,
                slug: $('#pf-slug').value,
                taglineAr: $('#pf-tagline').value || undefined,
                descriptionAr: $('#pf-description').value || undefined,
                website: $('#pf-website').value || undefined,
                previewType: $('#pf-previewType').value,
                demoUrl: $('#pf-demoUrl').value || undefined,
                demoVideoUrl: $('#pf-demoVideo').value || undefined,
                isFeatured: $('#pf-featured').checked,
                status: $('#pf-status').value,
            };

            try {
                if (isEdit) {
                    await API.put(`/admin/products/${productId}`, data);
                    Toast.success('تم تحديث المنتج بنجاح');
                } else {
                    await API.post('/admin/products', data);
                    Toast.success('تم إنشاء المنتج بنجاح');
                }
                Router.navigate('/admin/products');
            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.style.display = 'block';
                btn.disabled = false;
                btn.textContent = isEdit ? 'حفظ التغييرات' : 'إنشاء المنتج';
            }
        });
    } catch (err) {
        Toast.error(err.message);
    }
}
