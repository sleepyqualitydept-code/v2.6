import React, { useState } from 'react';
import { 
  UserCheck, Plus, Search, Shield, Building2, CheckCircle2, XCircle, 
  Key, Edit3, Power, Eye, Users, ShieldAlert, Check, X, Lock, Unlock, History
} from 'lucide-react';
import { ErpDatabase } from '../../utils/erpDb';
import { SystemUser, SystemRole, SystemDepartment, AuditLog } from '../../types/erp';
import { useTranslationService } from '../../i18n';

export const UsersGovernanceView: React.FC = () => {
  const { isAr } = useTranslationService();
  const [subTab, setSubTab] = useState<'users' | 'roles' | 'departments'>('users');
  const [users, setUsers] = useState<SystemUser[]>(() => ErpDatabase.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<SystemUser | null>(null);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<SystemUser | null>(null);
  const [historyUser, setHistoryUser] = useState<SystemUser | null>(null);

  // Add Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<SystemRole>('PRODUCTION');
  const [formDept, setFormDept] = useState<SystemDepartment>('الإنتاج');

  // Edit Form states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<SystemRole>('PRODUCTION');
  const [editDept, setEditDept] = useState<SystemDepartment>('الإنتاج');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');

  // Reset password state
  const [newPassword, setNewPassword] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenAddUser = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('PRODUCTION');
    setFormDept('الإنتاج');
    setIsAddUserModalOpen(true);
  };

  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      showToast(isAr ? 'يرجى إدخال اسم المستخدم وبريده الإلكتروني' : 'Please provide name and email', 'error');
      return;
    }
    const newUser = ErpDatabase.addUser({
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
      department: formDept,
      status: 'active'
    });
    setUsers(ErpDatabase.getUsers());
    setIsAddUserModalOpen(false);
    showToast(isAr ? `تمت إضافة المستخدم ${newUser.name} بنجاح` : `User ${newUser.name} added successfully`);
  };

  const handleOpenEditUser = (u: SystemUser) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditDept(u.department);
    setEditStatus(u.status);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Check if changing Super Admin to another role and it's the last Super Admin
    if (editingUser.role === 'SUPER_ADMIN' && editRole !== 'SUPER_ADMIN') {
      const activeSuperAdmins = users.filter(u => u.role === 'SUPER_ADMIN' && u.status === 'active' && u.id !== editingUser.id);
      if (activeSuperAdmins.length === 0) {
        showToast(
          isAr 
            ? 'لا يمكن تغيير دور المشرف العام الأخير للنظام (Security Rule)' 
            : 'Cannot change the role of the last remaining Super Admin', 
          'error'
        );
        return;
      }
    }

    // Check if inactivating last Super Admin
    if (editingUser.role === 'SUPER_ADMIN' && editStatus === 'inactive') {
      const check = ErpDatabase.canSuspendUser(editingUser.id);
      if (!check.allowed) {
        showToast(check.reason || (isAr ? 'غير مصرح بتعطيل المشرف العام الأخير' : 'Cannot suspend last Super Admin'), 'error');
        return;
      }
    }

    const updatedUsers = users.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: editName.trim(),
          email: editEmail.trim(),
          role: editRole,
          department: editDept,
          status: editStatus
        };
      }
      return u;
    });

    ErpDatabase.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    ErpDatabase.addAuditLog(
      'User Update', 
      `تم تعديل بيانات المستخدم: ${editName.trim()} (${editEmail.trim()}) - الدور: ${editRole}`
    );
    setEditingUser(null);
    showToast(isAr ? 'تم حفظ تعديلات المستخدم بنجاح' : 'User profile updated successfully');
  };

  // Suspend / Reactivate action with Security Rules
  const handleToggleStatus = (u: SystemUser) => {
    if (u.status === 'active') {
      // Suspend attempt
      const check = ErpDatabase.canSuspendUser(u.id);
      if (!check.allowed) {
        showToast(check.reason || (isAr ? 'لا يمكن تعطيل هذا الحساب' : 'Action forbidden by security rules'), 'error');
        return;
      }
      const updated = users.map(user => 
        user.id === u.id ? { ...user, status: 'inactive' as const } : user
      );
      ErpDatabase.saveUsers(updated);
      setUsers(updated);
      ErpDatabase.addAuditLog('Security', `تم تعطيل حساب المستخدم: ${u.email} (${u.name})`);
      showToast(isAr ? `تم تعطيل حساب المستخدم ${u.name}` : `Suspended user account ${u.name}`);
    } else {
      // Reactivate attempt
      const updated = users.map(user => 
        user.id === u.id ? { ...user, status: 'active' as const } : user
      );
      ErpDatabase.saveUsers(updated);
      setUsers(updated);
      ErpDatabase.addAuditLog('Security', `تم إعادة تفعيل حساب المستخدم: ${u.email} (${u.name})`);
      showToast(isAr ? `تمت إعادة تفعيل حساب المستخدم ${u.name}` : `Reactivated user account ${u.name}`);
    }
  };

  // Lock / Unlock action with Security Rules
  const handleToggleLock = (u: SystemUser) => {
    if (u.isLocked) {
      // Unlock
      const updated = users.map(user => 
        user.id === u.id ? { ...user, isLocked: false, lockedReason: undefined } : user
      );
      ErpDatabase.saveUsers(updated);
      setUsers(updated);
      ErpDatabase.addAuditLog('Security', `تم فك قفل حساب المستخدم: ${u.email}`);
      showToast(isAr ? `تم فك قفل حساب ${u.name}` : `Unlocked account for ${u.name}`);
    } else {
      // Lock
      const check = ErpDatabase.canLockUser(u.id);
      if (!check.allowed) {
        showToast(check.reason || (isAr ? 'لا يمكن قفل المشرف العام الأخير' : 'Cannot lock last Super Admin'), 'error');
        return;
      }
      const updated = users.map(user => 
        user.id === u.id ? { ...user, isLocked: true, lockedReason: 'إجراء أمني إداري' } : user
      );
      ErpDatabase.saveUsers(updated);
      setUsers(updated);
      ErpDatabase.addAuditLog('Security', `تم قفل حساب المستخدم: ${u.email}`);
      showToast(isAr ? `تم قفل حساب ${u.name}` : `Locked account for ${u.name}`);
    }
  };

  // Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser || !newPassword.trim()) return;
    ErpDatabase.addAuditLog(
      'Security', 
      `تمت إعادة تعيين كلمة مرور المستخدم: ${resetPasswordUser.email} بنجاح`
    );
    setResetPasswordUser(null);
    setNewPassword('');
    showToast(isAr ? 'تمت إعادة تعيين كلمة المرور بنجاح للمستخدم' : 'Password reset successfully');
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // User Audit Logs for Activity History Modal
  const userAuditLogs = React.useMemo<AuditLog[]>(() => {
    if (!historyUser) return [];
    const allLogs = ErpDatabase.getAuditLogs();
    return allLogs.filter(log => 
      log.operator === historyUser.name || 
      log.details.includes(historyUser.email) ||
      log.details.includes(historyUser.name)
    );
  }, [historyUser]);

  // Roles Matrix Data
  const roleMatrix = [
    { role: 'SUPER_ADMIN', name: isAr ? 'مدير النظام التنفيذي' : 'Super Admin', desc: isAr ? 'كامل الصلاحيات دون قيود' : 'Full unrestricted access', admin: true, prod: true, wh: true, sales: true, cs: true, export: true },
    { role: 'PLANT_MANAGER', name: isAr ? 'مدير المصنع والإنتاج' : 'Plant Manager', desc: isAr ? 'إدارة خطوط الإنتاج والتشغيلات' : 'Production lines & batches control', admin: false, prod: true, wh: true, sales: false, cs: false, export: true },
    { role: 'PRODUCTION', name: isAr ? 'مشغل وفني إنتاج' : 'Production Operator', desc: isAr ? 'إدخال السيريالات وإصدار الأوامر' : 'Serials entry & order execution', admin: false, prod: true, wh: false, sales: false, cs: false, export: false },
    { role: 'WAREHOUSE', name: isAr ? 'أمين ومسؤول المستودعات' : 'Warehouse Keeper', desc: isAr ? 'إدارة المخزون والشحن والتخصيص' : 'Inventory, allocations & dispatch', admin: false, prod: false, wh: true, sales: false, cs: false, export: true },
    { role: 'SALES', name: isAr ? 'مسؤول المبيعات والتوزيع' : 'Sales Representative', desc: isAr ? 'توثيق فواتير المبيعات ونقاط البيع' : 'Sales documentation & POS', admin: false, prod: false, wh: false, sales: true, cs: true, export: true },
    { role: 'CUSTOMER_SERVICE', name: isAr ? 'ممثل خدمة العملاء' : 'Customer Service', desc: isAr ? 'التحقق من الضمان وتفعيل الشهادات' : 'Warranty verification & activation', admin: false, prod: false, wh: false, sales: false, cs: true, export: false },
    { role: 'READ_ONLY', name: isAr ? 'مراجع تدقيق واطلاع' : 'Auditor (Read-Only)', desc: isAr ? 'استعراض البيانات والتقارير فقط' : 'Audit review & reports only', admin: false, prod: false, wh: false, sales: false, cs: false, export: true }
  ];

  // Departments Data
  const departments = [
    { id: 'DEP-PROD', name: isAr ? 'الإنتاج' : 'Production', lead: 'م. محمود البدري', count: 18, desc: isAr ? 'تصنيع شاسيهات المراتب، تجميع الطبقات، خطوط الحياكة والتغليف' : 'Spring cores, foam layers assembly, quilting & packing', status: isAr ? 'نشط' : 'Active' },
    { id: 'DEP-WH', name: isAr ? 'المخازن' : 'Warehouses', lead: 'أ. طارق عبد الرحمن', count: 8, desc: isAr ? 'استلام المواد الخام، تخزين المنتجات الجاهزة، إدارة الشحنات والتوزيع' : 'Raw materials intake, finished goods storage, dispatch', status: isAr ? 'نشط' : 'Active' },
    { id: 'DEP-SALES', name: isAr ? 'المبيعات' : 'Sales', lead: 'أ. حسام فوزي', count: 12, desc: isAr ? 'شبكة الموزعين المعتمدين، صالات العرض المباشرة، مناقصات المشاريع' : 'Authorized dealers network, direct showrooms, project tenders', status: isAr ? 'نشط' : 'Active' },
    { id: 'DEP-CS', name: isAr ? 'خدمة العملاء' : 'Customer Service', lead: 'أ. سارة مصطفى', count: 6, desc: isAr ? 'مركز الاتصالات، تفعيل شهادات الضمان، شكاوى الجودة والاستبدال' : 'Call center, warranty activation, quality claims & replacement', status: isAr ? 'نشط' : 'Active' },
    { id: 'DEP-MGMT', name: isAr ? 'الإدارة' : 'Management', lead: 'م. أحمد الشناوي', count: 4, desc: isAr ? 'إدارة العمليات، الرقابة على الجودة والسياسات، الصلاحيات والتدقيق' : 'Operations management, quality governance, security & audit', status: isAr ? 'نشط' : 'Active' }
  ];

  return (
    <div className="space-y-4 animate-fade-in text-start">
      {/* Toast Notification */}
      {toast && (
        <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs border ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <ShieldAlert size={16} className="text-rose-600 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header and Subtabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border-main pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
            <UserCheck size={18} className="text-blue-600" />
            <span>{isAr ? 'مركز حوكمة المستخدمين والصلاحيات' : 'Users & Roles Governance Center'}</span>
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {isAr 
              ? 'إدارة حسابات المستخدمين، مصفوفة الأدوار والصلاحيات، وسجلات النشاط والأقسام التنظيمية.' 
              : 'Manage user profiles, roles and permissions matrix, activity logs, and organizational departments.'}
          </p>
        </div>

        {/* Subtabs Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-border-main text-xs font-bold">
          <button
            type="button"
            onClick={() => setSubTab('users')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'users' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Users size={14} />
            <span>{isAr ? `المستخدمون (${users.length})` : `Users (${users.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('roles')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'roles' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Shield size={14} />
            <span>{isAr ? 'الأدوار والصلاحيات' : 'Roles & Permissions'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('departments')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'departments' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Building2 size={14} />
            <span>{isAr ? 'الأقسام التنظيمية' : 'Departments'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: USERS */}
      {subTab === 'users' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'}
                  className="w-full h-9 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 bg-surface border border-border-main rounded-xl text-xs outline-none focus:border-blue-600"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="h-9 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
              >
                <option value="All">{isAr ? 'جميع الأدوار' : 'All Roles'}</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="PLANT_MANAGER">PLANT_MANAGER</option>
                <option value="PRODUCTION">PRODUCTION</option>
                <option value="WAREHOUSE">WAREHOUSE</option>
                <option value="SALES">SALES</option>
                <option value="CUSTOMER_SERVICE">CUSTOMER_SERVICE</option>
                <option value="READ_ONLY">READ_ONLY</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddUser}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Plus size={14} />
              <span>{isAr ? 'إضافة مستخدم جديد' : 'Add New User'}</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface shadow-2xs">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-100/70 dark:bg-surface text-text-secondary font-bold border-b border-border-main">
                <tr>
                  <th className="p-3.5 whitespace-nowrap">{isAr ? 'الاسم' : 'Name'}</th>
                  <th className="p-3.5 whitespace-nowrap">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="p-3.5 whitespace-nowrap">{isAr ? 'الدور' : 'Role'}</th>
                  <th className="p-3.5 whitespace-nowrap">{isAr ? 'القسم' : 'Department'}</th>
                  <th className="p-3.5 text-center whitespace-nowrap">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="p-3.5 text-center whitespace-nowrap">{isAr ? 'القفل الأمني' : 'Security Lock'}</th>
                  <th className="p-3.5 whitespace-nowrap">{isAr ? 'آخر دخول' : 'Last Login'}</th>
                  <th className="p-3.5 text-center whitespace-nowrap">{isAr ? 'الإجراءات الحوكمية' : 'Governance Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                      {isAr ? 'لا يوجد مستخدمون يطابقون محددات البحث' : 'No users match search criteria'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-text-primary whitespace-nowrap">{u.name}</td>
                      <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">{u.email}</td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap font-semibold">{u.department}</td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 justify-center ${
                          u.status === 'active' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}>
                          {u.status === 'active' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                          <span>{u.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Suspended')}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {u.isLocked ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 inline-flex items-center gap-1">
                            <Lock size={10} />
                            <span>{isAr ? 'مقفل' : 'Locked'}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {isAr ? 'متاح' : 'Normal'}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[10px] whitespace-nowrap">
                        {new Date(u.lastLogin).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {/* SECTION 7 REQUIRED ACTIONS: View, Edit, Reset Password, Suspend/Reactivate, Unlock/Lock, Activity History */}
                        <div className="flex items-center justify-center gap-1">
                          {/* 1. View */}
                          <button
                            type="button"
                            onClick={() => setViewingUser(u)}
                            title={isAr ? 'عرض التفاصيل' : 'View User Details'}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>

                          {/* 2. Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(u)}
                            title={isAr ? 'تعديل البيانات' : 'Edit Profile'}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer"
                          >
                            <Edit3 size={14} />
                          </button>

                          {/* 3. Reset Password */}
                          <button
                            type="button"
                            onClick={() => {
                              setResetPasswordUser(u);
                              setNewPassword('');
                            }}
                            title={isAr ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                          >
                            <Key size={14} />
                          </button>

                          {/* 4. Suspend / Reactivate */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            title={u.status === 'active' ? (isAr ? 'تعطيل الحساب' : 'Suspend User') : (isAr ? 'تفعيل الحساب' : 'Reactivate User')}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              u.status === 'active' 
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40' 
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                          >
                            <Power size={14} />
                          </button>

                          {/* 5. Lock / Unlock */}
                          <button
                            type="button"
                            onClick={() => handleToggleLock(u)}
                            title={u.isLocked ? (isAr ? 'فك قفل الحساب' : 'Unlock Account') : (isAr ? 'قفل الحساب أمنياً' : 'Lock Account')}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              u.isLocked
                                ? 'text-amber-600 hover:text-emerald-600 hover:bg-emerald-50'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {u.isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                          </button>

                          {/* 6. Activity History */}
                          <button
                            type="button"
                            onClick={() => setHistoryUser(u)}
                            title={isAr ? 'سجل النشاط' : 'Activity History'}
                            className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer"
                          >
                            <History size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
      {subTab === 'roles' && (
        <div className="space-y-4">
          <div className="border border-border-main rounded-2xl overflow-hidden bg-surface shadow-2xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-border-main flex items-center justify-between">
              <span className="font-bold text-xs">{isAr ? 'مصفوفة الصلاحيات حسب الدور (Permissions Matrix)' : 'Roles & Permissions Matrix'}</span>
              <span className="text-[10px] text-slate-400">{isAr ? '7 أدوار نظام قياسية' : '7 Standard System Roles'}</span>
            </div>
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-100/50 dark:bg-surface text-slate-600 font-bold border-b border-border-main">
                <tr>
                  <th className="p-3.5">{isAr ? 'الدور (Role)' : 'Role'}</th>
                  <th className="p-3.5">{isAr ? 'الوصف والمسؤوليات' : 'Responsibilities'}</th>
                  <th className="p-3.5 text-center">{isAr ? 'إدارة النظام' : 'System Admin'}</th>
                  <th className="p-3.5 text-center">{isAr ? 'الإنتاج والتكويد' : 'Production'}</th>
                  <th className="p-3.5 text-center">{isAr ? 'المخازن' : 'Warehouses'}</th>
                  <th className="p-3.5 text-center">{isAr ? 'المبيعات' : 'Sales'}</th>
                  <th className="p-3.5 text-center">{isAr ? 'خدمة العملاء' : 'Customer Service'}</th>
                  <th className="p-3.5 text-center">{isAr ? 'تصدير التقارير' : 'Reports'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {roleMatrix.map((r) => (
                  <tr key={r.role} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold font-mono text-blue-700 dark:text-blue-300">
                      <div>{r.name}</div>
                      <span className="text-[10px] font-mono text-slate-400">{r.role}</span>
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px] max-w-xs">{r.desc}</td>
                    <td className="p-3.5 text-center">{r.admin ? <Check className="inline text-emerald-600" size={16} /> : <X className="inline text-slate-300" size={16} />}</td>
                    <td className="p-3.5 text-center">{r.prod ? <Check className="inline text-emerald-600" size={16} /> : <X className="inline text-slate-300" size={16} />}</td>
                    <td className="p-3.5 text-center">{r.wh ? <Check className="inline text-emerald-600" size={16} /> : <X className="inline text-slate-300" size={16} />}</td>
                    <td className="p-3.5 text-center">{r.sales ? <Check className="inline text-emerald-600" size={16} /> : <X className="inline text-slate-300" size={16} />}</td>
                    <td className="p-3.5 text-center">{r.cs ? <Check className="inline text-emerald-600" size={16} /> : <X className="inline text-slate-300" size={16} />}</td>
                    <td className="p-3.5 text-center">{r.export ? <Check className="inline text-emerald-600" size={16} /> : <X className="inline text-slate-300" size={16} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORGANIZATIONAL DEPARTMENTS */}
      {subTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d) => (
            <div key={d.id} className="p-4 bg-surface border border-border-main rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border-main pb-2">
                <span className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300">{d.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  {d.status}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>{isAr ? 'مسؤول القسم:' : 'Department Lead:'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{d.lead}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{isAr ? 'فريق العمل:' : 'Staff Count:'}</span>
                  <span className="font-mono font-bold text-blue-600">{d.count} {isAr ? 'موظف' : 'members'}</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-border-main">
                  {d.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                <Plus size={16} />
                <span>{isAr ? 'إضافة مستخدم جديد للنظام' : 'Add New System User'}</span>
              </h4>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleSaveNewUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold block">{isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={isAr ? 'مثال: م. عمر سامي' : 'e.g. John Doe'}
                  className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@sleepee.com"
                  className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold block">{isAr ? 'الدور الوظيفي' : 'Role'}</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as SystemRole)}
                    className="w-full h-10 px-2 bg-surface border border-border-main rounded-xl font-bold"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="PLANT_MANAGER">PLANT_MANAGER</option>
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="WAREHOUSE">WAREHOUSE</option>
                    <option value="SALES">SALES</option>
                    <option value="CUSTOMER_SERVICE">CUSTOMER_SERVICE</option>
                    <option value="READ_ONLY">READ_ONLY</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold block">{isAr ? 'القسم' : 'Department'}</label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value as SystemDepartment)}
                    className="w-full h-10 px-2 bg-surface border border-border-main rounded-xl font-bold"
                  >
                    <option value="الإنتاج">الإنتاج</option>
                    <option value="المخازن">المخازن</option>
                    <option value="المبيعات">المبيعات</option>
                    <option value="خدمة العملاء">خدمة العملاء</option>
                    <option value="الإدارة">الإدارة</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-border-main rounded-xl font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  {isAr ? 'حفظ المستخدم' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                <Edit3 size={16} />
                <span>{isAr ? 'تعديل بيانات المستخدم' : 'Edit User Profile'}</span>
              </h4>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold block">{isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold block">{isAr ? 'الدور الوظيفي' : 'Role'}</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as SystemRole)}
                    className="w-full h-10 px-2 bg-surface border border-border-main rounded-xl font-bold"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="PLANT_MANAGER">PLANT_MANAGER</option>
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="WAREHOUSE">WAREHOUSE</option>
                    <option value="SALES">SALES</option>
                    <option value="CUSTOMER_SERVICE">CUSTOMER_SERVICE</option>
                    <option value="READ_ONLY">READ_ONLY</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold block">{isAr ? 'القسم' : 'Department'}</label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value as SystemDepartment)}
                    className="w-full h-10 px-2 bg-surface border border-border-main rounded-xl font-bold"
                  >
                    <option value="الإنتاج">الإنتاج</option>
                    <option value="المخازن">المخازن</option>
                    <option value="المبيعات">المبيعات</option>
                    <option value="خدمة العملاء">خدمة العملاء</option>
                    <option value="الإدارة">الإدارة</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold block">{isAr ? 'حالة الحساب' : 'Account Status'}</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full h-10 px-2 bg-surface border border-border-main rounded-xl font-bold"
                >
                  <option value="active">{isAr ? 'نشط (Active)' : 'Active'}</option>
                  <option value="inactive">{isAr ? 'معطل (Suspended)' : 'Suspended'}</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-border-main rounded-xl font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  {isAr ? 'تحديث البيانات' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW USER DETAILS MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                <Eye size={16} />
                <span>{isAr ? 'بطاقة بيانات المستخدم' : 'User Information Card'}</span>
              </h4>
              <button onClick={() => setViewingUser(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">&times;</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1.5 border border-border-main">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'معرف المستخدم:' : 'User ID:'}</span>
                  <span className="font-mono font-bold text-blue-600">{viewingUser.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'الاسم:' : 'Name:'}</span>
                  <span className="font-bold">{viewingUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'البريد:' : 'Email:'}</span>
                  <span className="font-mono">{viewingUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'الدور الوظيفي:' : 'Role:'}</span>
                  <span className="font-bold text-blue-700">{viewingUser.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'القسم:' : 'Department:'}</span>
                  <span className="font-semibold">{viewingUser.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'الحالة:' : 'Status:'}</span>
                  <span className="font-bold text-emerald-600">{viewingUser.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'حالة القفل:' : 'Lock Status:'}</span>
                  <span className="font-bold">{viewingUser.isLocked ? (isAr ? 'مقفل' : 'Locked') : (isAr ? 'متاح' : 'Unlocked')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'آخر تسجيل دخول:' : 'Last Login:'}</span>
                  <span className="font-mono text-slate-500">{new Date(viewingUser.lastLogin).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3 z-[10000]">
            <h4 className="font-extrabold text-xs text-amber-600 flex items-center gap-1.5">
              <Key size={15} />
              <span>{isAr ? `إعادة تعيين كلمة المرور: ${resetPasswordUser.name}` : `Reset Password: ${resetPasswordUser.name}`}</span>
            </h4>
            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold block">{isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={isAr ? 'أدخل كلمة المرور الجديدة...' : 'Enter new password...'}
                  className="w-full h-9 px-3 bg-surface border border-border-main rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordUser(null)}
                  className="px-3 py-1.5 border border-border-main rounded-xl cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  {isAr ? 'تأكيد التعيين' : 'Confirm Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVITY HISTORY MODAL */}
      {historyUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col z-[10000]">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <h4 className="font-extrabold text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <History size={16} />
                <span>{isAr ? `سجل النشاط والتدقيق للمستخدم: ${historyUser.name}` : `Activity History for: ${historyUser.name}`}</span>
              </h4>
              <button onClick={() => setHistoryUser(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">&times;</button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2">
              {userAuditLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-border-main">
                  {isAr ? 'لا توجد عمليات مسجلة لهذا المستخدم حتى الآن.' : 'No audit records logged for this user yet.'}
                </div>
              ) : (
                <div className="border border-border-main rounded-2xl overflow-hidden bg-surface">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-900 font-bold border-b border-border-main">
                      <tr>
                        <th className="p-2.5">{isAr ? 'نوع العملية' : 'Action'}</th>
                        <th className="p-2.5">{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
                        <th className="p-2.5">{isAr ? 'التفاصيل' : 'Details'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main">
                      {userAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-2.5 font-bold text-blue-600">{log.action}</td>
                          <td className="p-2.5 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                          </td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-border-main shrink-0">
              <button
                type="button"
                onClick={() => setHistoryUser(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
