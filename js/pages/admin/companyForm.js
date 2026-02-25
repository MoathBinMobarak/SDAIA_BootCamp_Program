// ── Admin Company Form (Modal) ────────────────────────────────

async function renderAdminCompanyFormModal(companyId) {
    const isEdit = !!companyId;
    let company = null;

    if (isEdit) {
        try {
            const companies = await API.get('/admin/companies');
            company = companies.find(c => c.id === companyId);
        } catch { }
    }

    Modal.open(`
    <div class="modal__header">
      <h2 class="modal__title">${isEdit ? 'تعديل الشركة' : 'إضافة شركة'}</h2>
      <button class="btn btn-ghost btn-icon" onclick="Modal.close()">✕</button>
    </div>
    <form id="company-modal-form">
      <div class="form-group">
        <label class="form-label">الاسم بالعربية *</label>
        <input type="text" id="cf-nameAr" required value="${company?.nameAr || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">الاسم بالإنجليزية</label>
        <input type="text" id="cf-nameEn" value="${company?.nameEn || ''}" dir="ltr">
      </div>
      <div class="form-group">
        <label class="form-label">الاسم المختصر (slug) *</label>
        <input type="text" id="cf-slug" required value="${company?.slug || ''}" dir="ltr">
      </div>
      <div class="form-group">
        <label class="form-label">الوصف</label>
        <textarea id="cf-desc" rows="3">${company?.descriptionAr || ''}</textarea>
      </div>
      <div class="grid grid-2 gap-4">
        <div class="form-group">
          <label class="form-label">الدولة</label>
          <input type="text" id="cf-country" value="${company?.country || ''}" placeholder="SA" dir="ltr">
        </div>
        <div class="form-group">
          <label class="form-label">سنة التأسيس</label>
          <input type="number" id="cf-year" value="${company?.foundedYear || ''}" dir="ltr">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">الموقع الإلكتروني</label>
        <input type="url" id="cf-website" value="${company?.website || ''}" dir="ltr">
      </div>
      <label class="filter-checkbox mb-4">
        <input type="checkbox" id="cf-verified" ${company?.isVerified ? 'checked' : ''}> شركة موثّقة
      </label>
      <div id="cf-error" class="form-error mb-4" style="display:none;"></div>
      <div class="flex gap-4">
        <button type="submit" class="btn btn-primary">${isEdit ? 'حفظ' : 'إنشاء'}</button>
        <button type="button" class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
      </div>
    </form>
  `);

    $('#company-modal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = $('#cf-error');
        errorEl.style.display = 'none';

        const data = {
            nameAr: $('#cf-nameAr').value,
            nameEn: $('#cf-nameEn').value || undefined,
            slug: $('#cf-slug').value,
            descriptionAr: $('#cf-desc').value || undefined,
            country: $('#cf-country').value || undefined,
            foundedYear: $('#cf-year').value ? parseInt($('#cf-year').value) : undefined,
            website: $('#cf-website').value || undefined,
            isVerified: $('#cf-verified').checked,
        };

        try {
            if (isEdit) {
                await API.put(`/admin/companies/${companyId}`, data);
                Toast.success('تم تحديث الشركة');
            } else {
                await API.post('/admin/companies', data);
                Toast.success('تم إنشاء الشركة');
            }
            Modal.close();
            renderAdminCompanyList();
        } catch (err) {
            errorEl.textContent = err.message;
            errorEl.style.display = 'block';
        }
    });
}
