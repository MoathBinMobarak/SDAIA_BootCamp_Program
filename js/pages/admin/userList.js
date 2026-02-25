// ── Admin User List ───────────────────────────────────────────

async function renderAdminUserList() {
    const app = $('#app');
    app.innerHTML = renderAdminLayout(`
    <h1 class="text-2xl font-bold mb-8">إدارة المستخدمين</h1>
    <div id="admin-users-table">${renderPageLoader()}</div>
  `, 'users');

    try {
        const users = await API.get('/admin/users');
        const container = $('#admin-users-table');

        const roleLabels = { admin: 'مسؤول', vendor: 'مزوّد', user: 'مستخدم' };

        container.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>الاسم</th><th>البريد</th><th>الدور</th><th>تاريخ التسجيل</th><th>الإجراءات</th></tr></thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td class="font-medium">${u.name}</td>
              <td class="text-secondary" dir="ltr">${u.email}</td>
              <td><span class="badge badge-primary">${roleLabels[u.role] || u.role}</span></td>
              <td class="text-secondary text-sm">${formatDate(u.createdAt)}</td>
              <td>
                <select class="form-select" style="width:auto;padding:4px 8px;font-size:0.8rem;" onchange="changeUserRole('${u.id}', this.value)">
                  <option value="user" ${u.role === 'user' ? 'selected' : ''}>مستخدم</option>
                  <option value="vendor" ${u.role === 'vendor' ? 'selected' : ''}>مزوّد</option>
                  <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>مسؤول</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    } catch (err) {
        Toast.error(err.message);
    }
}

async function changeUserRole(userId, role) {
    try {
        await API.put(`/admin/users/${userId}/role`, { role });
        Toast.success('تم تحديث الدور');
    } catch (err) {
        Toast.error(err.message);
        renderAdminUserList(); // revert
    }
}
