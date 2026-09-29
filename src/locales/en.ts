export const en = {
  // Brand & Platform Identity (PROMPT-033-R1 SECTION 1)
  platform: {
    name: 'Sleepee Enterprise Warranty Platform',
    tagline: 'Digital Warranty Certification & Verification System',
    brand: 'SLEEPEE'
  },
  platformName: 'Sleepee Enterprise Warranty Platform',
  brandName: 'SLEEPEE',
  tagline: 'Digital Warranty Certification & Verification System',

  // Modules / Main Navigation (SECTION 3)
  nav: {
    systemAdmin: 'System Management',
    production: 'Production',
    warehouse: 'Warehouses',
    sales: 'Sales',
    customerService: 'Customer Service',
    reports: 'Reports'
  },

  // System Administration Subtabs (SECTION 5)
  systemAdmin: {
    title: 'System Management',
    auditMonitoring: 'Audit & Monitoring',
    usersRoles: 'Users & Roles',
    generalSettings: 'General Settings',
    warrantyPolicies: 'Warranty Policies',
    printSettings: 'Print Settings'
  },

  // Users & Roles Governance (SECTION 7)
  usersGovernance: {
    title: 'Users & Roles Governance Center',
    subtitle: 'Manage user accounts, roles and permissions matrix, activity logs, and organizational departments.',
    usersTab: 'Users',
    rolesTab: 'Roles & Permissions',
    departmentsTab: 'Departments',
    addUser: 'Add New User',
    editUser: 'Edit User Profile',
    resetPassword: 'Reset Password',
    suspendUser: 'Suspend User',
    reactivateUser: 'Reactivate User',
    unlockUser: 'Unlock Account',
    activityHistory: 'User Activity History',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    department: 'Department',
    status: 'Status',
    lastLogin: 'Last Login',
    actions: 'Actions'
  },

  // Printing & Label Designer (SECTION 8)
  printingGovernance: {
    title: 'Label Designer & Template Governance Center',
    subtitle: 'Manage template library, ZPL code editor, barcode & QR designer, and live industrial preview.',
    queueTitle: 'Print Queue Management',
    printerStatus: 'Printer Status',
    labelPreview: 'Label Preview',
    systemSettings: 'System Parameters',
    templates: 'Label Templates',
    printers: 'Industrial Printers',
    newTemplate: 'New Template',
    cloneTemplate: 'Clone Template',
    testPrint: 'Print Test',
    versionHistory: 'Version History',
    approvalWorkflow: 'Approval Workflow',
    auditTrail: 'Template Audit Trail'
  },

  // Production Tabs (SECTION 4 & 5)
  production: {
    title: 'Production',
    structure: 'Product Structure',
    orders: 'Production Orders',
    serials: 'Serialization & Coding',
    print: 'Printing',
    bom: 'Material BOM',
    audit: 'Unified Audit',
    bomTitle: 'Manufacturing BOM & Recipe Center'
  },

  // Admin Search Center (SECTION 2)
  adminSearch: {
    title: 'Enterprise Search Center',
    subtitle: 'Cross-module instant query across products, models, serials, warranties, customers, users, orders, BOM recipes, and audit logs',
    placeholder: 'Search by code, name, serial, warranty #, email, or customer...',
    results: 'Enterprise Results',
    noResults: 'No matching records found',
    openModule: 'Open Module',
    types: {
      product: 'Product',
      model: 'Model',
      brand: 'Brand',
      serial: 'Serial',
      warranty: 'Warranty',
      customer: 'Customer',
      order: 'Order',
      bom: 'BOM',
      user: 'User',
      audit: 'Audit Log',
      template: 'Template'
    }
  },

  // Product Structure (SECTION 8)
  productStructure: {
    title: 'Product Structure & Dimensions',
    subtitle: 'Standard hierarchy management and 39 approved standard dimensions governance.',
    treeExplorer: 'Tree Explorer',
    productGrid: 'Product Grid',
    totalDimensions: 'Total Standard Dimensions',
    usedDimensions: 'Used',
    unusedDimensions: 'Unused',
    coverage: 'Coverage',
    addProduct: 'Add Product',
    bulkGenerate: 'Bulk Product Generator',
    exportCsv: 'Export CSV',
    rapidMode: 'Rapid Entry Mode',
    searchPlaceholder: 'Search by name, code, SAP, or project...',
    allBrands: 'All Brands',
    allCategories: 'All Categories',
    allTypes: 'All Types',
    allStatuses: 'All Statuses',
    standardCatalog: 'Standard Catalog',
    customProjects: 'Special Projects & Tenders'
  },

  // Audit & Monitoring (SECTION 6)
  auditMonitoring: {
    title: 'Audit & Monitoring',
    sectionA: 'Key Operational System Indicators',
    sectionB: 'Immutable Audit & Monitoring Log',
    totalProducts: 'Total Products',
    totalOrders: 'Total Production Orders',
    totalSerials: 'Total Serials',
    totalWarranties: 'Total Warranty Certificates',
    totalUsers: 'Total Users',
    totalPolicies: 'Total Warranty Policies',
    logId: 'Log ID',
    action: 'Action Type',
    operator: 'Operator',
    dateTime: 'Date & Time',
    details: 'Details',
    searchLogs: 'Search audit logs and operations...',
    filterAction: 'Filter by Action Type',
    filterUser: 'Filter by Operator',
    allActions: 'All Actions',
    allUsers: 'All Operators',
    exportCsv: 'Export CSV',
    eventsCount: 'events'
  },

  // Common Actions
  actions: {
    save: 'Save',
    saveAndNew: 'Save & Add New',
    cancel: 'Cancel',
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    duplicate: 'Duplicate',
    toggleActive: 'Disable / Enable',
    resetPassword: 'Reset Password',
    exportCsv: 'Export CSV',
    bulkGenerate: 'Generate Multiple Products',
    addNewProduct: 'Add Product',
    addNewUser: 'Add New User',
    addNewPolicy: 'Create New Policy',
    addNewPrinter: 'Add New Printer',
    newOrder: 'New Production Order',
    newBom: 'New BOM Recipe',
    testPrint: 'Test Print',
    back: 'Back',
    close: 'Close',
    refresh: 'Refresh'
  },

  // Statuses
  status: {
    active: 'Active',
    inactive: 'Inactive',
    draft: 'Draft',
    inProduction: 'In Production',
    completed: 'Completed',
    approved: 'Approved',
    cancelled: 'Cancelled'
  }
};
