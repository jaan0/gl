export type Language = 'en' | 'sd' | 'ur';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'sd', label: 'Sindhi', nativeLabel: 'سنڌي', dir: 'rtl' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', dir: 'rtl' },
];

export type TranslationKey =
  // App-wide
  | 'appName'
  | 'backToList'
  // Bottom nav
  | 'navList'
  | 'navCatalog'
  | 'navSettings'
  // Grocery list page
  | 'yourList'
  | 'yourListSubtitle'
  | 'addItems'
  // ListClient filters
  | 'filterToBuy'
  | 'filterAll'
  | 'filterBought'
  | 'itemsLeft'
  | 'searchPlaceholder'
  | 'boughtSection'
  | 'hide'
  | 'show'
  | 'listEmpty'
  | 'browseCatalog'
  | 'boughtEmpty'
  | 'addFromCatalog'
  | 'markBought'
  | 'unmarkBought'
  | 'removeItem'
  // CatalogClient
  | 'catalogTitle'
  | 'catalogSubtitle'
  | 'searchCatalog'
  | 'qualityEssential'
  | 'addToList'
  | 'added'
  | 'cantFindItem'
  | 'cantFindSubtitle'
  | 'quickAddItem'
  | 'close'
  | 'itemName'
  | 'qty'
  | 'unit'
  | 'category'
  | 'addToMyList'
  | 'noItemsFound'
  | 'decrease'
  | 'increase'
  // Admin page - Login
  | 'adminLogin'
  | 'adminLoginSubtitle'
  | 'adminAccess'
  | 'adminPasswordLabel'
  | 'adminPasswordHint'
  | 'adminPasswordPlaceholder'
  | 'loginButton'
  | 'returnToList'
  // Admin page - Catalog
  | 'catalogAdmin'
  | 'catalogAdminSubtitle'
  | 'addNewProduct'
  | 'productName'
  | 'productNamePlaceholder'
  | 'categoryLabel'
  | 'defaultUnit'
  | 'defaultQuantity'
  | 'imageUrl'
  | 'imageUrlPlaceholder'
  | 'saveToCatalog'
  | 'catalogCount'
  | 'viewInShop'
  | 'catalogEmpty'
  | 'logout'
  | 'deleteItem'
  // Admin edit modal
  | 'editProduct'
  | 'editProductSubtitle'
  | 'editName'
  | 'editNameUr'
  | 'editNameSd'
  | 'editImageUrl'
  | 'editImageUrlPlaceholder'
  | 'orUploadImage'
  | 'uploadFromGallery'
  | 'takePhoto'
  | 'saveChanges'
  | 'cancel'
  | 'editItem'
  | 'imagePreview'
  // A11y
  | 'a11yLabel';

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  appName: 'Family Groceries',
  backToList: 'Back',
  navList: 'List',
  navCatalog: 'Catalog',
  navSettings: 'Settings',
  yourList: 'Your List',
  yourListSubtitle: 'Check off items as you shop. Tap ✓ when done.',
  addItems: 'Add Items',
  filterToBuy: 'To Buy',
  filterAll: 'All',
  filterBought: 'Bought',
  itemsLeft: 'left',
  searchPlaceholder: 'Search your list...',
  boughtSection: 'Bought',
  hide: 'Hide',
  show: 'Show',
  listEmpty: 'Your shopping list is empty!',
  browseCatalog: 'Browse Catalog',
  boughtEmpty: 'Bought items will appear here',
  addFromCatalog: 'Add items from catalog',
  markBought: 'Mark as bought',
  unmarkBought: 'Unmark bought',
  removeItem: 'Remove item',
  catalogTitle: 'Browse Catalog',
  catalogSubtitle: 'Pick items and add them to your list.',
  searchCatalog: 'Search sugar, milk, bread...',
  qualityEssential: 'Quality Essential',
  addToList: 'Add to List',
  added: 'Added!',
  cantFindItem: "Can't Find An Item?",
  cantFindSubtitle: 'Add a custom item directly to your shopping list.',
  quickAddItem: 'Quick Add Item',
  close: 'Close',
  itemName: 'Item Name',
  qty: 'Qty',
  unit: 'Unit',
  category: 'Category',
  addToMyList: 'Add to My List',
  noItemsFound: 'No items found.',
  decrease: 'Decrease',
  increase: 'Increase',
  adminLogin: 'Admin Login',
  adminLoginSubtitle: 'Manage your family product catalog.',
  adminAccess: 'Admin Access',
  adminPasswordLabel: 'Family Password',
  adminPasswordHint: 'Enter your family password',
  adminPasswordPlaceholder: 'Enter admin secret...',
  loginButton: 'Login to Admin',
  returnToList: '← Return to Shopping List',
  catalogAdmin: 'Catalog Admin',
  catalogAdminSubtitle: 'Add, manage and remove products from the family catalog.',
  addNewProduct: 'Add New Product',
  productName: 'Product Name',
  productNamePlaceholder: 'e.g. Sugar, Whole Milk',
  categoryLabel: 'Category',
  defaultUnit: 'Default Unit',
  defaultQuantity: 'Default Quantity',
  imageUrl: 'Image URL (optional)',
  imageUrlPlaceholder: 'https://...',
  saveToCatalog: 'Save to Catalog',
  catalogCount: 'Catalog',
  viewInShop: 'View in shop →',
  catalogEmpty: 'Catalog is empty. Add your first product above.',
  logout: 'Logout',
  deleteItem: 'Delete item from catalog',
  editProduct: 'Edit Product',
  editProductSubtitle: 'Update the product name or image.',
  editName: 'Product Name (English)',
  editNameUr: 'Product Name in Urdu (optional)',
  editNameSd: 'Product Name in Sindhi (optional)',
  editImageUrl: 'Image URL',
  editImageUrlPlaceholder: 'https://...',
  orUploadImage: 'Or upload a photo',
  uploadFromGallery: 'Choose from Gallery',
  takePhoto: 'Take a Photo',
  saveChanges: 'Save Changes',
  cancel: 'Cancel',
  editItem: 'Edit product',
  imagePreview: 'Image preview',
  a11yLabel: 'A11y',
};

const ur: Translations = {
  appName: 'خاندانی گروسری',
  backToList: 'واپس',
  navList: 'فہرست',
  navCatalog: 'کیٹلاگ',
  navSettings: 'ترتیبات',
  yourList: 'آپ کی فہرست',
  yourListSubtitle: 'خریداری کے دوران اشیاء چیک کریں۔ ✓ دبائیں جب ہو جائے۔',
  addItems: 'اشیاء شامل کریں',
  filterToBuy: 'خریدنا ہے',
  filterAll: 'سب',
  filterBought: 'خریدا',
  itemsLeft: 'باقی',
  searchPlaceholder: 'اپنی فہرست میں تلاش کریں...',
  boughtSection: 'خریدا گیا',
  hide: 'چھپائیں',
  show: 'دکھائیں',
  listEmpty: 'آپ کی خریداری کی فہرست خالی ہے!',
  browseCatalog: 'کیٹلاگ دیکھیں',
  boughtEmpty: 'خریدی گئی اشیاء یہاں نظر آئیں گی',
  addFromCatalog: 'کیٹلاگ سے اشیاء شامل کریں',
  markBought: 'خریدا ہوا نشان لگائیں',
  unmarkBought: 'نشان ہٹائیں',
  removeItem: 'شے ہٹائیں',
  catalogTitle: 'کیٹلاگ دیکھیں',
  catalogSubtitle: 'اشیاء منتخب کریں اور اپنی فہرست میں شامل کریں۔',
  searchCatalog: 'چینی، دودھ، روٹی تلاش کریں...',
  qualityEssential: 'معیاری ضروری',
  addToList: 'فہرست میں شامل کریں',
  added: 'شامل ہو گیا!',
  cantFindItem: 'کوئی شے نہیں ملی؟',
  cantFindSubtitle: 'اپنی خریداری کی فہرست میں براہ راست ایک کسٹم شے شامل کریں۔',
  quickAddItem: 'جلدی شامل کریں',
  close: 'بند کریں',
  itemName: 'شے کا نام',
  qty: 'مقدار',
  unit: 'اکائی',
  category: 'زمرہ',
  addToMyList: 'میری فہرست میں شامل کریں',
  noItemsFound: 'کوئی شے نہیں ملی۔',
  decrease: 'کم کریں',
  increase: 'بڑھائیں',
  adminLogin: 'ایڈمن لاگ ان',
  adminLoginSubtitle: 'اپنے خاندان کا پروڈکٹ کیٹلاگ منظم کریں۔',
  adminAccess: 'ایڈمن رسائی',
  adminPasswordLabel: 'خاندانی پاس ورڈ',
  adminPasswordHint: 'اپنا خاندانی پاس ورڈ درج کریں',
  adminPasswordPlaceholder: 'ایڈمن کوڈ درج کریں...',
  loginButton: 'ایڈمن میں لاگ ان کریں',
  returnToList: '← خریداری کی فہرست پر واپس جائیں',
  catalogAdmin: 'کیٹلاگ ایڈمن',
  catalogAdminSubtitle: 'خاندانی کیٹلاگ سے پروڈکٹس شامل، منظم اور حذف کریں۔',
  addNewProduct: 'نئی پروڈکٹ شامل کریں',
  productName: 'پروڈکٹ کا نام',
  productNamePlaceholder: 'مثلاً چینی، دودھ',
  categoryLabel: 'زمرہ',
  defaultUnit: 'پہلے سے اکائی',
  defaultQuantity: 'پہلے سے مقدار',
  imageUrl: 'تصویر کا لنک (اختیاری)',
  imageUrlPlaceholder: 'https://...',
  saveToCatalog: 'کیٹلاگ میں محفوظ کریں',
  catalogCount: 'کیٹلاگ',
  viewInShop: 'دکان میں دیکھیں ←',
  catalogEmpty: 'کیٹلاگ خالی ہے۔ اوپر پہلی پروڈکٹ شامل کریں۔',
  logout: 'لاگ آؤٹ',
  deleteItem: 'کیٹلاگ سے شے حذف کریں',
  editProduct: 'پروڈکٹ ترمیم',
  editProductSubtitle: 'پروڈکٹ کا نام یا تصویر اپڈیٹ کریں۔',
  editName: 'پروڈکٹ کا نام (انگریزی)',
  editNameUr: 'اردو میں نام (اختیاری)',
  editNameSd: 'سندھی میں نام (اختیاری)',
  editImageUrl: 'تصویر کا لنک',
  editImageUrlPlaceholder: 'https://...',
  orUploadImage: 'یا تصویر اپلوڈ کریں',
  uploadFromGallery: 'گیلری سے منتخب کریں',
  takePhoto: 'تصویر لیں',
  saveChanges: 'تبدیلیاں محفوظ کریں',
  cancel: 'منسوخ کریں',
  editItem: 'پروڈکٹ ترمیم کریں',
  imagePreview: 'تصویر کا پیش نظارہ',
  a11yLabel: 'A11y',
};

const sd: Translations = {
  appName: 'خانداني گروسري',
  backToList: 'واپس',
  navList: 'فهرست',
  navCatalog: 'ڪيٽالاگ',
  navSettings: 'ترتيبون',
  yourList: 'توهان جي فهرست',
  yourListSubtitle: 'خريداري دوران شيون چيڪ ڪيو. ✓ دٻايو جڏهن ٿي وڃي.',
  addItems: 'شيون شامل ڪيو',
  filterToBuy: 'خريد ڪرڻو آهي',
  filterAll: 'سڀ',
  filterBought: 'خريد ٿيو',
  itemsLeft: 'باقي',
  searchPlaceholder: 'پنهنجي فهرست ۾ ڳوليو...',
  boughtSection: 'خريد ٿيل',
  hide: 'لڪايو',
  show: 'ڏيکاريو',
  listEmpty: 'توهان جي خريداري جي فهرست خالي آهي!',
  browseCatalog: 'ڪيٽالاگ ڏسو',
  boughtEmpty: 'خريد ٿيل شيون هتي نظر اينديون',
  addFromCatalog: 'ڪيٽالاگ مان شيون شامل ڪيو',
  markBought: 'خريد ٿيل نشان لڳايو',
  unmarkBought: 'نشان هٽايو',
  removeItem: 'شيءِ هٽايو',
  catalogTitle: 'ڪيٽالاگ ڏسو',
  catalogSubtitle: 'شيون چونڊيو ۽ پنهنجي فهرست ۾ شامل ڪيو.',
  searchCatalog: 'کنڊ، کير، روٽي ڳوليو...',
  qualityEssential: 'معياري ضروري شيءِ',
  addToList: 'فهرست ۾ شامل ڪيو',
  added: 'شامل ٿي ويو!',
  cantFindItem: 'ڪا شيءِ نه مليو؟',
  cantFindSubtitle: 'پنهنجي خريداري جي فهرست ۾ سڌو هڪ ڪسٽم شيءِ شامل ڪيو.',
  quickAddItem: 'جلدي شامل ڪيو',
  close: 'بند ڪيو',
  itemName: 'شيءِ جو نالو',
  qty: 'مقدار',
  unit: 'يونٽ',
  category: 'زمرو',
  addToMyList: 'منهنجي فهرست ۾ شامل ڪيو',
  noItemsFound: 'ڪا شيءِ نه ملي.',
  decrease: 'گهٽايو',
  increase: 'وڌايو',
  adminLogin: 'ايڊمن لاگ ان',
  adminLoginSubtitle: 'پنهنجي خاندان جو پروڊڪٽ ڪيٽالاگ منظم ڪيو.',
  adminAccess: 'ايڊمن رسائي',
  adminPasswordLabel: 'خانداني پاسورڊ',
  adminPasswordHint: 'پنهنجو خانداني پاسورڊ داخل ڪيو',
  adminPasswordPlaceholder: 'ايڊمن ڪوڊ داخل ڪيو...',
  loginButton: 'ايڊمن ۾ لاگ ان ڪيو',
  returnToList: '← خريداري جي فهرست تي واپس وڃو',
  catalogAdmin: 'ڪيٽالاگ ايڊمن',
  catalogAdminSubtitle: 'خانداني ڪيٽالاگ مان پروڊڪٽس شامل، منظم ۽ ختم ڪيو.',
  addNewProduct: 'نئين پروڊڪٽ شامل ڪيو',
  productName: 'پروڊڪٽ جو نالو',
  productNamePlaceholder: 'مثال: کنڊ، کير',
  categoryLabel: 'زمرو',
  defaultUnit: 'ڊفالٽ يونٽ',
  defaultQuantity: 'ڊفالٽ مقدار',
  imageUrl: 'تصوير جو لنڪ (اختياري)',
  imageUrlPlaceholder: 'https://...',
  saveToCatalog: 'ڪيٽالاگ ۾ محفوظ ڪيو',
  catalogCount: 'ڪيٽالاگ',
  viewInShop: 'دڪان ۾ ڏسو ←',
  catalogEmpty: 'ڪيٽالاگ خالي آهي. مٿي پهرين پروڊڪٽ شامل ڪيو.',
  logout: 'لاگ آئوٽ',
  deleteItem: 'ڪيٽالاگ مان شيءِ حذف ڪيو',
  editProduct: 'پروڊڪٽ سڌارو',
  editProductSubtitle: 'پروڊڪٽ جو نالو يا تصوير اپڊيٽ ڪيو.',
  editName: 'پروڊڪٽ جو نالو (انگلش)',
  editNameUr: 'اردو ۾ نالو (اختياري)',
  editNameSd: 'سنڌي ۾ نالو (اختياري)',
  editImageUrl: 'تصوير جو لنڪ',
  editImageUrlPlaceholder: 'https://...',
  orUploadImage: 'يا تصوير اپلوڊ ڪيو',
  uploadFromGallery: 'گيلري مان چونڊيو',
  takePhoto: 'تصوير ورتو',
  saveChanges: 'تبديليون محفوظ ڪيو',
  cancel: 'منسوخ ڪيو',
  editItem: 'پروڊڪٽ سڌاريو',
  imagePreview: 'تصوير جو پيش نظارو',
  a11yLabel: 'A11y',
};

export const translations: Record<Language, Translations> = { en, ur, sd };

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations['en'][key] ?? key;
}

export const ITEM_DICTIONARY: Record<string, { ur: string; sd: string }> = {
  // Sugar & Sweeteners
  'sugar': { ur: 'چینی', sd: 'کنڊ' },
  'white sugar': { ur: 'سفید چینی', sd: 'سفيڊ کنڊ' },
  'brown sugar': { ur: 'براؤن شوگر', sd: 'براؤن شوگر' },
  'gur': { ur: 'گڑ', sd: 'گڙ' },
  'jaggery': { ur: 'گڑ', sd: 'گڙ' },
  'honey': { ur: 'شہد', sd: 'ماکي' },

  // Milk & Dairy
  'milk': { ur: 'دودھ', sd: 'کير' },
  'whole milk': { ur: 'خالص دودھ', sd: 'خالص کير' },
  'fresh milk': { ur: 'تازہ دودھ', sd: 'تازو کير' },
  'full cream milk': { ur: 'فل کریم دودھ', sd: 'فل ڪريم کير' },
  'yogurt': { ur: 'دہی', sd: 'ڏھين' },
  'curd': { ur: 'دہی', sd: 'ڏھين' },
  'dahi': { ur: 'دہی', sd: 'ڏھين' },
  'butter': { ur: 'مکھن', sd: 'مڻي' },
  'makhan': { ur: 'مکھن', sd: 'مڻي' },
  'cheese': { ur: 'پنیر', sd: 'پنير' },
  'cream': { ur: 'کریم', sd: 'ڪريم' },
  'desi ghee': { ur: 'دیسی گھی', sd: 'ديسي گيهه' },
  'ghee': { ur: 'گھی', sd: 'گيهه' },
  'condensed milk': { ur: 'کنڈینسڈ ملک', sd: 'ڪنڊينسڊ کير' },

  // Eggs & Meat
  'egg': { ur: 'انڈا', sd: 'انڊو' },
  'eggs': { ur: 'انڈے', sd: 'انڊا' },
  'chicken': { ur: 'مرغی کا گوشت', sd: 'ڪڪڙ جو گوشت' },
  'chicken meat': { ur: 'مرغی', sd: 'ڪڪڙ' },
  'mutton': { ur: 'بکرے کا گوشت', sd: 'ٻڪريءَ جو گوشت' },
  'beef': { ur: 'بڑے کا گوشت', sd: 'ڳائي گوشت' },
  'meat': { ur: 'گوشت', sd: 'گوشت' },
  'fish': { ur: 'مچھلی', sd: 'مڇي' },
  'mince': { ur: 'قیمہ', sd: 'قيما' },

  // Grains, Rice, Flour
  'rice': { ur: 'چاول', sd: 'چونئرا' },
  'basmati rice': { ur: 'بسمتی چاول', sd: 'بسمتي چونئرا' },
  'flour': { ur: 'آٹا', sd: 'آٽو' },
  'wheat flour': { ur: 'گندم کا آٹا', sd: 'گڻهن جو آٽو' },
  'atta': { ur: 'آٹا', sd: 'آٽو' },
  'fine atta': { ur: 'فائن آٹا', sd: 'فائن آٽو' },
  'maida': { ur: 'میدہ', sd: 'ميدو' },
  'besan': { ur: 'بیسن', sd: 'بيسن' },
  'bread': { ur: 'ڈبل روٹی', sd: 'روٽي' },
  'white bread': { ur: 'سفید ڈبل روٹی', sd: 'سفيڊ روٽي' },
  'brown bread': { ur: 'براؤن بریڈ', sd: 'براؤن روٽي' },
  'naan': { ur: 'نان', sd: 'نان' },
  'roti': { ur: 'روٹی', sd: 'ماني' },

  // Oil & Fats
  'oil': { ur: 'تیل', sd: 'تيل' },
  'cooking oil': { ur: 'کوکنگ آئل', sd: 'رڌڻ جو تيل' },
  'mustard oil': { ur: 'سرسوں کا تیل', sd: 'سريھن جو تيل' },
  'olive oil': { ur: 'زیتون کا تیل', sd: 'زيتون جو تيل' },

  // Spices & Condiments
  'salt': { ur: 'نمک', sd: 'لوڻ' },
  'black pepper': { ur: 'کالی مرچ', sd: 'ڪالي مرچ' },
  'red chili': { ur: 'سرخ مرچ', sd: 'گاڙهي مرچ' },
  'red chili powder': { ur: 'سرخ مرچ پاؤڈر', sd: 'گاڙهي مرچ پائوڊر' },
  'turmeric': { ur: 'ہلدی', sd: 'هرڊ' },
  'haldi': { ur: 'ہلدی', sd: 'هرڊ' },
  'cumin': { ur: 'زیرہ', sd: 'جيرو' },
  'zeera': { ur: 'زیرہ', sd: 'جيرو' },
  'coriander': { ur: 'دھنیا', sd: 'ڌاڻا' },
  'dhaniya': { ur: 'دھنیا', sd: 'ڌاڻا' },
  'garam masala': { ur: 'گرم مصالحہ', sd: 'گرم مسالحو' },
  'vinegar': { ur: 'سرکہ', sd: 'سرڪو' },

  // Tea & Beverages
  'tea': { ur: 'چائے', sd: 'چاهه' },
  'black tea': { ur: 'پتی', sd: 'چاهه جي پتي' },
  'green tea': { ur: 'سبز چائے', sd: 'سائي چاهه' },
  'coffee': { ur: 'کافی', sd: 'ڪافي' },
  'water': { ur: 'پانی', sd: 'پاڻي' },
  'mineral water': { ur: 'منرل واٹر', sd: 'منرل واٽر' },
  'juice': { ur: 'جوس', sd: 'شربت' },
  'milkshake': { ur: 'ملک شیک', sd: 'ملڪ شيڪ' },

  // Vegetables
  'onion': { ur: 'پیاز', sd: 'بصري' },
  'onions': { ur: 'پیاز', sd: 'بصري' },
  'potato': { ur: 'آلو', sd: 'پٽاٽا' },
  'potatoes': { ur: 'آلو', sd: 'پٽاٽا' },
  'tomato': { ur: 'ٹماٹر', sd: 'ٽماٽو' },
  'tomatoes': { ur: 'ٹماٹر', sd: 'ٽماٽا' },
  'garlic': { ur: 'لہسن', sd: 'ٿوم' },
  'ginger': { ur: 'ادرک', sd: 'ادرڪ' },
  'green chili': { ur: 'ہری مرچ', sd: 'سائي مرچ' },
  'coriander leaves': { ur: 'ہرا دھنیا', sd: 'سائو ڌاڻو' },
  'mint': { ur: 'پودینہ', sd: 'پودينو' },
  'lemon': { ur: 'لیموں', sd: 'ليمون' },
  'lemons': { ur: 'لیموں', sd: 'ليما' },
  'cucumber': { ur: 'کھیرا', sd: 'کيرو' },
  'carrot': { ur: 'گاجر', sd: 'گاجر' },
  'peas': { ur: 'مٹر', sd: 'مٽر' },
  'spinach': { ur: 'پالک', sd: 'پالڪ' },
  'cabbage': { ur: 'بند گوبھی', sd: 'بند گوبھي' },
  'cauliflower': { ur: 'پھول گوبھی', sd: 'ڦول گوبھي' },
  'eggplant': { ur: 'بینگن', sd: 'واڱڻ' },
  'brinjal': { ur: 'بینگن', sd: 'واڱڻ' },

  // Fruits
  'apple': { ur: 'سیب', sd: 'صوف' },
  'apples': { ur: 'سیب', sd: 'صوف' },
  'banana': { ur: 'کیلا', sd: 'ڪيلو' },
  'bananas': { ur: 'کیلے', sd: 'ڪيلا' },
  'orange': { ur: 'مالٹا', sd: 'مالٽو' },
  'oranges': { ur: 'مالٹے', sd: 'مالٽا' },
  'mango': { ur: 'آم', sd: 'انب' },
  'mangoes': { ur: 'آم', sd: 'انب' },
  'grapes': { ur: 'انگور', sd: 'انگور' },
  'dates': { ur: 'کھجور', sd: 'کجي' },
  'watermelon': { ur: 'تربوز', sd: 'چئوڻو' },

  // Pulses & Lentils
  'daal': { ur: 'دال', sd: 'دال' },
  'lentils': { ur: 'دالیں', sd: 'داليون' },
  'daal chana': { ur: 'دال چنا', sd: 'دال چڻا' },
  'daal moong': { ur: 'دال مونگ', sd: 'دال مونگ' },
  'daal masoor': { ur: 'دال مسور', sd: 'دال مسور' },
  'chana': { ur: 'چنے', sd: 'ڇولا' },
  'white chana': { ur: 'سفید چنے', sd: 'سفيڊ ڇولا' },

  // Household & Snacks
  'soap': { ur: 'صابن', sd: 'صابڻ' },
  'shampoo': { ur: 'شیمپو', sd: 'شيمپو' },
  'toothpaste': { ur: 'ٹوتھ پیسٹ', sd: 'ٽوٿ پيسٽ' },
  'surf': { ur: 'سرف', sd: 'سرف' },
  'washing powder': { ur: 'واشنگ پاؤڈر', sd: 'واشنگ پائوڊر' },
  'dishwash': { ur: 'ڈش واش', sd: 'ڊش واش' },
  'biscuit': { ur: 'بسکٹ', sd: 'بسڪٽ' },
  'biscuits': { ur: 'بسکٹ', sd: 'بسڪٽ' },
  'chips': { ur: 'چپس', sd: 'چپس' },
  'chocolates': { ur: 'چاکلیٹ', sd: 'چاڪليٽ' },
};

export const CATEGORY_TRANSLATIONS: Record<string, { ur: string; sd: string }> = {
  'All': { ur: 'سب', sd: 'سڀ' },
  'Produce': { ur: 'سبزیاں و پھل', sd: 'ميوا ۽ سائيون' },
  'Dairy': { ur: 'ڈیری', sd: 'ڊيري' },
  'Pantry': { ur: 'پینٹری', sd: 'پينٽري' },
  'Meat': { ur: 'گوشت', sd: 'گوشت' },
  'Frozen': { ur: 'فروزن', sd: 'فروزن' },
  'Bakery': { ur: 'بیکری', sd: 'بيڪري' },
  'Other': { ur: 'دیگر', sd: 'ٻيا' },
};

export function getCategoryName(category: string | null | undefined, lang: Language): string {
  if (!category) return '';
  if (lang === 'en') return category;
  const match = CATEGORY_TRANSLATIONS[category];
  if (match && match[lang]) return match[lang];
  return category;
}

export function getItemName(
  item: { name: string | null; nameUr?: string | null; nameSd?: string | null },
  lang: Language
): string {
  const originalName = item.name || '';
  if (lang === 'en') return originalName;

  if (lang === 'ur' && item.nameUr && item.nameUr.trim()) {
    return item.nameUr.trim();
  }

  if (lang === 'sd' && item.nameSd && item.nameSd.trim()) {
    return item.nameSd.trim();
  }

  // Dictionary lookup (case-insensitive)
  const key = originalName.trim().toLowerCase();
  const dictMatch = ITEM_DICTIONARY[key];
  if (dictMatch && dictMatch[lang]) {
    return dictMatch[lang];
  }

  // Substring match for common terms like "Whole Milk", "Sugar", "White Bread"
  for (const [dictKey, dictVal] of Object.entries(ITEM_DICTIONARY)) {
    if (key.includes(dictKey) && dictVal[lang]) {
      return dictVal[lang];
    }
  }

  return originalName;
}
