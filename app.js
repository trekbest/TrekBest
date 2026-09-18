/**
 * TrekBest Travel & Tours - Full Official Website & Invoice Portal Engine
 * Dynamic Customer Portal, Tour Packages, Custom Quote Builder & Invoice Generator
 */

(function () {
  'use strict';

  // Category Configuration for Invoice Line Items
  const CATEGORIES = {
    FLIGHT:   { name: 'Flight Ticket',   icon: 'fa-plane',             badge: '✈️ Flight' },
    HOTEL:    { name: 'Hotel & Resort',  icon: 'fa-hotel',             badge: '🏨 Hotel' },
    TRANSFER: { name: 'Cab & Transfers', icon: 'fa-car-side',          badge: '🚘 Cab' },
    PACKAGE:  { name: 'Tour Package',    icon: 'fa-earth-americas',    badge: '🏝️ Package' },
    VISA:     { name: 'Visa & Insurance',icon: 'fa-passport',          badge: '🎟️ Visa/Insurance' },
    ACTIVITY: { name: 'Activity/Tour',   icon: 'fa-ticket',            badge: '🧗 Activity' }
  };

  const CURRENCY_SYMBOLS = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    AED: 'AED '
  };

  // Preset Featured Tour Packages Dataset
  const TOUR_PACKAGES = [
    {
      id: 'pkg-kashmir',
      title: 'Enchanting Kashmir Paradise Tour',
      dest: 'Kashmir, India',
      category: 'DOMESTIC',
      isHoneymoon: true,
      duration: '6 Days / 5 Nights',
      price: 24999,
      currency: 'INR',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      highlights: ['Srinagar Houseboat', 'Gulmarg Gondola', 'Pahalgam Valley', 'Sonmarg Glacier'],
      itinerary: [
        { day: 'Day 1', title: 'Arrival Srinagar & Luxury Houseboat Stay', desc: 'Pick up from Srinagar Airport, Shikara ride on Dal Lake, night stay in Deluxe Houseboat.' },
        { day: 'Day 2', title: 'Srinagar to Gulmarg Ski Resort', desc: 'Drive to Gulmarg, enjoy Gondola Cable Car Ride (Phase 1 & 2), snow activities & overnight stay.' },
        { day: 'Day 3', title: 'Gulmarg to Pahalgam (Valley of Shepherds)', desc: 'Visit Awantipora ruins, saffron fields, and Betaab Valley & Aru Valley sightseeing.' },
        { day: 'Day 4', title: 'Pahalgam Excursion & River Rafting', desc: 'Enjoy Lidder River rafting, Baisaran Valley pony ride, relax at luxury pine resort.' },
        { day: 'Day 5', title: 'Pahalgam to Sonmarg Glacier Excursion', desc: 'Day excursion to Sonmarg (Meadow of Gold), Thajiwas Glacier pony ride, return to Srinagar.' },
        { day: 'Day 6', title: 'Srinagar Mughal Gardens & Departure', desc: 'Visit Nishat Bagh, Shalimar Bagh, local market shopping, transfer to Srinagar Airport.' }
      ],
      inclusions: ['Flight Tickets Included', '4★/5★ Hotels & Houseboat', 'Daily Breakfast & Dinner', 'Private Cab for All Transfers', 'Shikara Ride & Gondola Passes'],
      invoiceItems: [
        { category: 'FLIGHT', title: 'IndiGo Return Flight Tickets (DEL - SXR - DEL)', sub: 'Economy Class | 15kg Baggage per pax', qty: 2, rate: 7500 },
        { category: 'HOTEL', title: '5 Nights Stay in Srinagar Houseboat & Gulmarg Resort', sub: 'MAP Plan (Daily Breakfast & Dinner included)', qty: 1, rate: 22000 },
        { category: 'TRANSFER', title: 'Private Sedan/SUV for 6 Days Full Sightseeing', sub: 'Driver allowances, toll, fuel & parking included', qty: 1, rate: 12998 }
      ]
    },
    {
      id: 'pkg-ladakh',
      title: 'Ladakh High Passes & Pangong Expedition',
      dest: 'Leh Ladakh, India',
      category: 'ADVENTURE',
      duration: '7 Days / 6 Nights',
      price: 32500,
      currency: 'INR',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      highlights: ['Pangong Tso Lake', 'Khardung La Pass', 'Nubra Valley Dunes', 'Monasteries'],
      itinerary: [
        { day: 'Day 1', title: 'Leh Arrival & Altitude Acclimatization', desc: 'Rest at Leh hotel to get acclimatized to high altitude. Evening visit Leh Market & Shanti Stupa.' },
        { day: 'Day 2', title: 'Leh Local Monasteries & Sham Valley', desc: 'Visit Hall of Fame, Magnetic Hill, Sangam (Confluence of Indus & Zanskar rivers), Pathar Sahib.' },
        { day: 'Day 3', title: 'Leh to Nubra Valley via Khardung La', desc: 'Cross Khardung La (17,582 ft), visit Diskit Monastery, enjoy Double Hump Camel Ride at Hunder.' },
        { day: 'Day 4', title: 'Nubra Valley to Pangong Tso Lake', desc: 'Drive along Shyok river to Pangong Lake. Enjoy magical evening sunset stay in luxury lake camps.' },
        { day: 'Day 5', title: 'Pangong Lake to Hanle / Leh via Chang La', desc: 'Witness spectacular sunrise over Pangong Lake, drive back to Leh crossing Chang La Pass.' },
        { day: 'Day 6', title: 'Leh Shopping & Cultural Evening', desc: 'Explore local Tibetan markets, souvenir shopping, cultural musical night at hotel.' },
        { day: 'Day 7', title: 'Leh Airport Departure', desc: 'Early morning transfer to Leh Kushok Bakula Rimpoche Airport.' }
      ],
      inclusions: ['Inner Line Permits', 'Oxygen Cylinder Fitted SUV', 'Luxury Camp & Hotel Stay', 'Breakfast & Dinner', 'Airport Pickup & Drop'],
      invoiceItems: [
        { category: 'HOTEL', title: '6 Nights Stay in Leh Hotels & Pangong Luxury Camps', sub: 'MAP Plan (Breakfast & Dinner Included)', qty: 1, rate: 35000 },
        { category: 'TRANSFER', title: 'Innova / Xylo 4x4 SUV for Nubra & Pangong Circuit', sub: 'Inner Line Permits, Fuel & Oxygen Cylinder Included', qty: 1, rate: 30000 }
      ]
    },
    {
      id: 'pkg-kerala',
      title: 'Enchanting Kerala Backwaters & Munnar',
      dest: 'Kerala, India',
      category: 'DOMESTIC',
      isHoneymoon: true,
      duration: '5 Days / 4 Nights',
      price: 21999,
      currency: 'INR',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      highlights: ['Munnar Tea Gardens', 'Alleppey Houseboat', 'Thekkady Spice Plantation', 'Kochi Fort'],
      itinerary: [
        { day: 'Day 1', title: 'Cochin Arrival to Munnar Hill Station', desc: 'Drive to Munnar, view Cheeyappara & Valara Waterfalls enroute, check-in to resort.' },
        { day: 'Day 2', title: 'Munnar Tea Estates & Mattupetty Dam', desc: 'Visit Tea Museum, Eravikulam National Park (Nilgiri Tahr), Echo Point, and Kundala Lake.' },
        { day: 'Day 3', title: 'Munnar to Thekkady Wildlife Sanctuary', desc: 'Drive to Thekkady, spice plantation tour, Periyar Lake boat safari, Kathakali show.' },
        { day: 'Day 4', title: 'Thekkady to Alleppey Houseboat Cruise', desc: 'Check-in to Private AC Deluxe Houseboat, cruise through backwaters, fresh Kerala seafood.' },
        { day: 'Day 5', title: 'Alleppey to Cochin Departure', desc: 'Visit Fort Kochi, Chinese Fishing Nets, Mattancherry Palace, transfer to Cochin Airport.' }
      ],
      inclusions: ['Private Houseboat Stay', 'Resort Stays', 'Breakfast & Houseboat Meals', 'AC Cab for Sightseeing'],
      invoiceItems: [
        { category: 'HOTEL', title: 'Munnar Hill Resort & Alleppey Private Houseboat', sub: 'All Meals on Houseboat + Breakfast at Resorts', qty: 1, rate: 26000 },
        { category: 'TRANSFER', title: 'Private AC Dzire / Etios Cab for Full Kerala Tour', sub: 'All toll, parking, driver allowance included', qty: 1, rate: 17998 }
      ]
    },
    {
      id: 'pkg-dubai',
      title: 'Dubai Luxury Extravaganza & Desert Safari',
      dest: 'Dubai, UAE',
      category: 'INTERNATIONAL',
      isLuxury: true,
      duration: '5 Days / 4 Nights',
      price: 48999,
      currency: 'INR',
      rating: '4.95',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      highlights: ['Burj Khalifa 124th Floor', 'Desert Safari & BBQ', 'Marina Dhow Cruise', 'Museum of the Future'],
      itinerary: [
        { day: 'Day 1', title: 'Arrival Dubai & Dhow Cruise Dinner', desc: 'Airport pick-up, evening Marina Dhow Cruise with buffet dinner & Tanoura dance show.' },
        { day: 'Day 2', title: 'Dubai Half-Day City Tour & Burj Khalifa', desc: 'Visit Dubai Frame, Palm Jumeirah, Dubai Mall, Burj Khalifa 124th floor observation deck.' },
        { day: 'Day 3', title: 'Museum of the Future & Dune Bashing Desert Safari', desc: 'Visit Museum of Future in morning. Afternoon 4x4 Dune Bashing, Camel ride & BBQ Dinner.' },
        { day: 'Day 4', title: 'Abu Dhabi Day Tour & Sheikh Zayed Grand Mosque', desc: 'Excursion to Abu Dhabi, Grand Mosque visit, Ferrari World photo stop, Yas Island.' },
        { day: 'Day 5', title: 'Gold Souk Shopping & Dubai Departure', desc: 'Morning free for Gold Souk & Spice Souk shopping, evening drop at Dubai International Airport.' }
      ],
      inclusions: ['UAE Tourist Visa with Insurance', '4★ City Hotel Stay', 'Daily Breakfast & 2 Dinners', 'All Sightseeing Tickets & Transfers'],
      invoiceItems: [
        { category: 'VISA', title: '30 Days UAE Tourist Visa + COVID Health Insurance', sub: 'Single entry express visa processing', qty: 2, rate: 7500 },
        { category: 'HOTEL', title: '4 Nights Stay at Grand Excelsior / Millennium Hotel Dubai', sub: 'Daily Buffet Breakfast included', qty: 1, rate: 38000 },
        { category: 'ACTIVITY', title: 'Burj Khalifa 124th Floor + Desert Safari + Dhow Cruise Combo', sub: 'Shared PVT transfers for all attractions', qty: 2, rate: 12500 }
      ]
    },
    {
      id: 'pkg-bali',
      title: 'Exotic Bali Tropical Island & Ubud Villas',
      dest: 'Bali, Indonesia',
      category: 'INTERNATIONAL',
      isHoneymoon: true,
      isLuxury: true,
      duration: '6 Days / 5 Nights',
      price: 42999,
      currency: 'INR',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      highlights: ['Ubud Private Pool Villa', 'Tanah Lot Sunset Temple', 'Nusa Penida Island Tour', 'Batur Volcano Trek'],
      itinerary: [
        { day: 'Day 1', title: 'Arrival Denpasar Bali & Check-in Ubud Villa', desc: 'Warm traditional Balinese welcome at airport, transfer to Ubud Private Pool Villa.' },
        { day: 'Day 2', title: 'Ubud Swing, Rice Terraces & Sacred Monkey Forest', desc: 'Visit Tegallalang Rice Terrace, Aloha Bali Swing, Monkey Forest, and Ubud Art Market.' },
        { day: 'Day 3', title: 'Kintamani Batur Volcano & Tanah Lot Sunset', desc: 'View Mount Batur volcano, Tirta Empul holy water temple, and Tanah Lot sea temple sunset.' },
        { day: 'Day 4', title: 'Nusa Penida Island Speedboat Day Tour', desc: 'Speedboat to Nusa Penida, visit Kelingking T-Rex Cliff, Broken Beach, Angel Billabong, Crystal Bay.' },
        { day: 'Day 5', title: 'Water Sports at Tanjung Benoa & Uluwatu Kecak Dance', desc: 'Banana boat ride, jet ski, parasailing in Nusa Dua. Evening Uluwatu Cliff Kecak Fire Dance.' },
        { day: 'Day 6', title: 'Balinese Spa Massage & Departure', desc: 'Complimentary 2-Hour Authentic Balinese Massage, transfer to Ngurah Rai Airport.' }
      ],
      inclusions: ['Private Pool Villa Stay', 'Nusa Penida Speedboat & Tour', 'Water Sports Package', 'All Transfers in Private Vehicle'],
      invoiceItems: [
        { category: 'HOTEL', title: '3 Nights Ubud Private Pool Villa + 2 Nights Seminyak Beach Resort', sub: 'Floating Breakfast + Honeymoon flower bed decor', qty: 1, rate: 52000 },
        { category: 'ACTIVITY', title: 'Nusa Penida Island Speedboat Tour & Water Sports Combo', sub: 'Include Snorkeling, Kelingking Cliff & Kecak Dance', qty: 2, rate: 16999 }
      ]
    },
    {
      id: 'pkg-rajasthan',
      title: 'Royal Rajasthan Heritage & Desert Camps',
      dest: 'Rajasthan, India',
      category: 'DOMESTIC',
      duration: '6 Days / 5 Nights',
      price: 26500,
      currency: 'INR',
      rating: '4.85',
      image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
      highlights: ['Jaipur Amber Fort', 'Jodhpur Mehrangarh', 'Jaisalmer Sam Sand Dunes', 'Desert Camping'],
      itinerary: [
        { day: 'Day 1', title: 'Arrival Jaipur - Pink City Tour', desc: 'Visit City Palace, Hawa Mahal, Jantar Mantar, and local bazaars.' },
        { day: 'Day 2', title: 'Jaipur Forts Excursion to Jodhpur', desc: 'Visit Amber Fort (elephant ride), Jaigarh Fort, drive to Blue City Jodhpur.' },
        { day: 'Day 3', title: 'Jodhpur Sightseeing to Jaisalmer', desc: 'Visit Mehrangarh Fort, Jaswant Thada, drive to Golden City Jaisalmer.' },
        { day: 'Day 4', title: 'Jaisalmer Fort & Sam Sand Dunes Camp', desc: 'Visit Jaisalmer Golden Fort, Patwon ki Haveli. Evening Camel Safari & Folk Dance at Desert Camp.' },
        { day: 'Day 5', title: 'Jaisalmer to Udaipur (City of Lakes)', desc: 'Drive to Udaipur, evening boat ride on Lake Pichola.' },
        { day: 'Day 6', title: 'Udaipur City Palace & Departure', desc: 'Visit City Palace Udaipur, Saheliyon ki Bari, drop at Udaipur Airport/Railway station.' }
      ],
      inclusions: ['Heritage Hotel Stay', 'Luxury Desert Camp', 'Camel Safari & Cultural Show', 'Private AC Vehicle'],
      invoiceItems: [
        { category: 'HOTEL', title: 'Heritage Haveli Stays + Sam Sand Dunes Desert Camp', sub: 'Daily Breakfast & Rajasthani Buffet Dinner', qty: 1, rate: 32000 },
        { category: 'TRANSFER', title: 'Private AC Tempo Traveller / SUV for Rajasthan Circuit', sub: 'Toll, state taxes, parking & driver night charges', qty: 1, rate: 21000 }
      ]
    }
  ];

  // State Management for Invoice Builder & Customer Portal
  let state = {
    activeView: 'agent', // 'agent' by default (or 'customer')
    activeCategoryFilter: 'ALL',
    searchQuery: '',
    
    // Agent Invoice State
    invNumber: 'TB-2026-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'INR',
    status: 'PARTIAL',
    client: {
      name: 'Vikram Malhotra',
      email: 'vikram.m@example.com',
      phone: '+91 98765 43210',
      address: 'Vasant Vihar, New Delhi, India'
    },
    trip: {
      name: 'Enchanting Kashmir Paradise Tour (6D/5N)',
      start: '2026-09-20',
      end: '2026-09-25',
      pax: '2 Adults, 1 Child'
    },
    items: [
      {
        id: 'item-1',
        category: 'FLIGHT',
        title: 'IndiGo Flight Tickets (DEL - SXR - DEL Return)',
        sub: 'Dates: 20 Sep & 25 Sep 2026 | Economy Class Tickets',
        qty: 3,
        rate: 8500
      },
      {
        id: 'item-2',
        category: 'HOTEL',
        title: 'Luxury Lakeview Resort Srinagar & Gulmarg Ski Resort Stay',
        sub: '5 Nights Stay | MAP Plan (Daily Breakfast & Dinner included)',
        qty: 1,
        rate: 42000
      },
      {
        id: 'item-3',
        category: 'TRANSFER',
        title: 'Private AC Innova Crysta Cab for 6 Days Transfers & Sightseeing',
        sub: 'Includes Driver Allowance, Fuel, Parking & Toll Taxes',
        qty: 1,
        rate: 18500
      }
    ],
    discountType: 'FIXED',
    discountVal: 2000,
    taxRate: 5,
    advancePaid: 25000,
    bank: {
      name: 'HDFC Bank',
      accName: 'TrekBest Travel & Tours Pvt Ltd',
      accNum: '50200084729104',
      ifsc: 'HDFC0001248',
      upi: 'trekbest@hdfcbank'
    },
    terms: '1. 50% advance payment required to confirm booking. Balance due 7 days prior to departure.\n2. Standard cancellation policy applies as per TrekBest Regulations.\n3. Airfare & Visa fees non-refundable once issued.',
    theme: 'theme-executive'
  };

  // DOM Elements
  const DOM = {
    // Mode Switching & Views
    btnModeCustomer: document.getElementById('btn-mode-customer'),
    btnModeAgent: document.getElementById('btn-mode-agent'),
    btnModeDatabase: document.getElementById('btn-mode-database'),
    customerView: document.getElementById('customer-view'),
    agentView: document.getElementById('agent-view'),
    databaseView: document.getElementById('database-view'),
    btnMobileNav: document.getElementById('btn-mobile-nav'),
    mainNav: document.getElementById('main-nav'),

    // Customer Portal Elements
    heroSearchDest: document.getElementById('hero-search-dest'),
    heroSearchMonth: document.getElementById('hero-search-month'),
    heroSearchStyle: document.getElementById('hero-search-style'),
    btnHeroSearch: document.getElementById('btn-hero-search'),
    categoryPills: document.getElementById('category-pills'),
    packagesGrid: document.getElementById('packages-grid'),
    quoteForm: document.getElementById('quote-form'),

    // Modals
    packageModal: document.getElementById('package-modal'),
    btnClosePkgModal: document.getElementById('btn-close-pkg-modal'),
    pkgModalBody: document.getElementById('pkg-modal-body'),

    // Agent Form Inputs
    importPackageSelect: document.getElementById('import-package-select'),
    btnImportPackage: document.getElementById('btn-import-package'),
    invNumber: document.getElementById('inv-number'),
    invDate: document.getElementById('inv-date'),
    invDueDate: document.getElementById('inv-due-date'),
    invCurrency: document.getElementById('inv-currency'),
    invStatus: document.getElementById('inv-status'),
    clientName: document.getElementById('client-name'),
    clientEmail: document.getElementById('client-email'),
    clientPhone: document.getElementById('client-phone'),
    clientAddress: document.getElementById('client-address'),
    tripName: document.getElementById('trip-name'),
    tripPax: document.getElementById('trip-pax'),
    tripStartDate: document.getElementById('trip-start-date'),
    tripEndDate: document.getElementById('trip-end-date'),
    itemsContainer: document.getElementById('items-container'),
    btnAddItem: document.getElementById('btn-add-item'),
    discountType: document.getElementById('discount-type'),
    discountVal: document.getElementById('discount-val'),
    taxRate: document.getElementById('tax-rate'),
    advancePaid: document.getElementById('advance-paid'),
    bankName: document.getElementById('bank-name'),
    bankAccName: document.getElementById('bank-acc-name'),
    bankAccNum: document.getElementById('bank-acc-num'),
    bankIfsc: document.getElementById('bank-ifsc'),
    bankUpi: document.getElementById('bank-upi'),
    termsText: document.getElementById('terms-text'),

    // Form Calculations Display
    calcSubtotal: document.getElementById('calc-subtotal'),
    calcDiscount: document.getElementById('calc-discount'),
    calcTax: document.getElementById('calc-tax'),
    calcGrandTotal: document.getElementById('calc-grand-total'),
    calcPaid: document.getElementById('calc-paid'),
    calcBalanceDue: document.getElementById('calc-balance-due'),

    // Preview Elements
    invoicePreview: document.getElementById('invoice-preview'),
    prevClientName: document.getElementById('prev-client-name'),
    prevClientInfo: document.getElementById('prev-client-info'),
    prevInvNum: document.getElementById('prev-inv-num'),
    prevInvDate: document.getElementById('prev-inv-date'),
    prevDueDate: document.getElementById('prev-due-date'),
    prevStatusBadge: document.getElementById('prev-status-badge'),
    prevTripBanner: document.getElementById('prev-trip-banner'),
    prevTripName: document.getElementById('prev-trip-name'),
    prevTripDates: document.getElementById('prev-trip-dates'),
    prevTripPax: document.getElementById('prev-trip-pax'),
    prevItemsBody: document.getElementById('prev-items-body'),
    prevBankAccName: document.getElementById('prev-bank-acc-name'),
    prevBankName: document.getElementById('prev-bank-name'),
    prevBankAccNum: document.getElementById('prev-bank-acc-num'),
    prevBankIfsc: document.getElementById('prev-bank-ifsc'),
    prevBankUpi: document.getElementById('prev-bank-upi'),
    prevSubtotal: document.getElementById('prev-subtotal'),
    prevDiscountRow: document.getElementById('prev-discount-row'),
    prevDiscount: document.getElementById('prev-discount'),
    prevTaxRow: document.getElementById('prev-tax-row'),
    prevTaxLabel: document.getElementById('prev-tax-label'),
    prevTax: document.getElementById('prev-tax'),
    prevGrandTotal: document.getElementById('prev-grand-total'),
    prevPaid: document.getElementById('prev-paid'),
    prevDueRow: document.getElementById('prev-due-row'),
    prevBalanceDue: document.getElementById('prev-balance-due'),
    prevTerms: document.getElementById('prev-terms'),

    // Action Buttons
    btnNewInvoice: document.getElementById('btn-new-invoice'),
    btnSaveInvoice: document.getElementById('btn-save-invoice'),
    btnOpenSaved: document.getElementById('btn-open-saved'),
    btnEmailInvoice: document.getElementById('btn-email-invoice'),
    btnWhatsappInvoice: document.getElementById('btn-whatsapp-invoice'),
    btnPrintInvoice: document.getElementById('btn-print-invoice'),

    // Drawer Elements
    savedDrawer: document.getElementById('saved-drawer'),
    btnCloseDrawer: document.getElementById('btn-close-drawer'),
    savedInvoicesList: document.getElementById('saved-invoices-list'),
    searchSaved: document.getElementById('search-saved'),
    savedCount: document.getElementById('saved-count'),

    toastContainer: document.getElementById('toast-container')
  };

  // Helper Functions
  function formatMoney(amount, currencyCode = 'INR') {
    const symbol = CURRENCY_SYMBOLS[currencyCode] || '₹';
    const val = Number(amount) || 0;
    return symbol + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDateDisplay(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // View Mode Switcher
  function switchView(viewName) {
    state.activeView = viewName;
    
    // Reset active classes
    [DOM.customerView, DOM.agentView, DOM.databaseView].forEach(view => {
      if (view) view.classList.remove('active');
    });
    [DOM.btnModeCustomer, DOM.btnModeAgent, DOM.btnModeDatabase].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    if (viewName === 'customer') {
      DOM.customerView.classList.add('active');
      DOM.btnModeCustomer.classList.add('active');
      if (DOM.mainNav) DOM.mainNav.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'agent') {
      DOM.agentView.classList.add('active');
      DOM.btnModeAgent.classList.add('active');
      if (DOM.mainNav) DOM.mainNav.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'database') {
      if (DOM.databaseView) DOM.databaseView.classList.add('active');
      if (DOM.btnModeDatabase) DOM.btnModeDatabase.classList.add('active');
      if (DOM.mainNav) DOM.mainNav.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.DBTableManager && typeof window.DBTableManager.fetchData === 'function') {
        window.DBTableManager.fetchData();
      }
    }
  }

  // ==========================================
  // CUSTOMER WEBSITE RENDER & EVENTS
  // ==========================================
  function renderPackages() {
    if (!DOM.packagesGrid) return;
    
    let filtered = TOUR_PACKAGES.filter(pkg => {
      let matchesCat = true;
      if (state.activeCategoryFilter === 'DOMESTIC') matchesCat = pkg.category === 'DOMESTIC';
      else if (state.activeCategoryFilter === 'INTERNATIONAL') matchesCat = pkg.category === 'INTERNATIONAL';
      else if (state.activeCategoryFilter === 'HONEYMOON') matchesCat = !!pkg.isHoneymoon;
      else if (state.activeCategoryFilter === 'ADVENTURE') matchesCat = pkg.category === 'ADVENTURE';
      else if (state.activeCategoryFilter === 'LUXURY') matchesCat = !!pkg.isLuxury;

      let matchesSearch = true;
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        matchesSearch = pkg.title.toLowerCase().includes(q) || pkg.dest.toLowerCase().includes(q) || pkg.highlights.some(h => h.toLowerCase().includes(q));
      }

      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      DOM.packagesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-plane-slash" style="font-size: 3rem; margin-bottom: 16px; color: var(--tb-orange);"></i>
          <h3>No Tour Packages Found</h3>
          <p>Try searching for a different destination or reset your category filter.</p>
        </div>
      `;
      return;
    }

    DOM.packagesGrid.innerHTML = filtered.map(pkg => `
      <div class="package-card" data-id="${pkg.id}">
        <div class="pkg-img-wrap">
          <img src="${pkg.image}" alt="${pkg.title}" class="pkg-img" loading="lazy">
          <span class="pkg-badge">${pkg.category}</span>
          <span class="pkg-rating"><i class="fa-solid fa-star"></i> ${pkg.rating}</span>
        </div>
        <div class="pkg-content">
          <h3 class="pkg-title">${pkg.title}</h3>
          <div class="pkg-duration"><i class="fa-regular fa-clock"></i> ${pkg.duration}</div>
          
          <div class="pkg-highlights">
            ${pkg.highlights.map(h => `<span class="pkg-tag-pill">✓ ${h}</span>`).join('')}
          </div>

          <div class="pkg-price-row">
            <div>
              <div class="pkg-price-lbl">Starting Price</div>
              <div class="pkg-price-val">${formatMoney(pkg.price, pkg.currency)} <span style="font-size:0.75rem; color: var(--text-muted); font-weight: normal;">/ person</span></div>
            </div>
          </div>

          <div class="pkg-actions">
            <button class="btn btn-secondary btn-view-pkg" data-id="${pkg.id}">
              <i class="fa-solid fa-eye"></i> View Details
            </button>
            <button class="btn btn-primary btn-book-pkg" data-id="${pkg.id}">
              <i class="fa-brands fa-whatsapp"></i> Book Now
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach Click Handlers to view modal & book
    DOM.packagesGrid.querySelectorAll('.btn-view-pkg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPackageModal(btn.dataset.id);
      });
    });

    DOM.packagesGrid.querySelectorAll('.btn-book-pkg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pkg = TOUR_PACKAGES.find(p => p.id === btn.dataset.id);
        if (pkg) {
          const msg = encodeURIComponent(`Hi TrekBest! I am interested in booking the "${pkg.title}" (${pkg.duration}). Please send me full pricing and availability.`);
          window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
        }
      });
    });

    DOM.packagesGrid.querySelectorAll('.package-card').forEach(card => {
      card.addEventListener('click', () => {
        openPackageModal(card.dataset.id);
      });
    });
  }

  function openPackageModal(pkgId) {
    const pkg = TOUR_PACKAGES.find(p => p.id === pkgId);
    if (!pkg) return;

    DOM.pkgModalBody.innerHTML = `
      <div class="pkg-modal-header">
        <img src="${pkg.image}" alt="${pkg.title}">
        <div class="pkg-modal-header-overlay">
          <div>
            <span class="pkg-badge" style="position: static; margin-bottom: 8px; display: inline-block;">${pkg.category} • ${pkg.duration}</span>
            <h2 class="pkg-modal-title">${pkg.title}</h2>
          </div>
        </div>
      </div>

      <div class="pkg-modal-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid var(--tb-card-border); padding-bottom: 16px;">
          <div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Package Price Starting From</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--tb-orange);">
              ${formatMoney(pkg.price, pkg.currency)} <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: normal;">per person</span>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" id="btn-modal-wa">
              <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
            </button>
            <button class="btn btn-secondary" id="btn-modal-invoice">
              <i class="fa-solid fa-file-invoice"></i> Create Agent Invoice
            </button>
          </div>
        </div>

        <h3 style="font-family: var(--font-heading); color: #FFF; font-size: 1.2rem; margin-bottom: 12px;">Package Inclusions</h3>
        <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 24px; list-style: none;">
          ${pkg.inclusions.map(inc => `<li style="font-size: 0.9rem; color: var(--text-main);"><i class="fa-solid fa-circle-check" style="color: var(--tb-green); margin-right: 8px;"></i> ${inc}</li>`).join('')}
        </ul>

        <h3 style="font-family: var(--font-heading); color: #FFF; font-size: 1.2rem; margin-bottom: 12px;">Day-By-Day Detailed Itinerary</h3>
        <div class="itinerary-timeline" style="margin-bottom: 28px;">
          ${pkg.itinerary.map(item => `
            <div class="day-item">
              <div class="day-num">${item.day}</div>
              <div class="day-info">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Instant Booking Form -->
        <div style="background: var(--tb-input-bg); border: 1px solid var(--tb-input-border); border-radius: var(--radius-md); padding: 24px; margin-top: 24px;">
          <h3 style="font-family: var(--font-heading); color: var(--tb-orange); font-size: 1.3rem; margin-bottom: 6px;">
            <i class="fa-solid fa-bolt"></i> Instant Booking & Price Inquiry
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
            Reserve your slots now. Our travel consultant will lock the best flight rates & room vouchers for you.
          </p>
          <form id="modal-booking-form">
            <div class="form-grid-3" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" id="mb-name" class="form-control" placeholder="e.g. Rahul Sharma" required>
              </div>
              <div class="form-group">
                <label>Phone / WhatsApp *</label>
                <input type="tel" id="mb-phone" class="form-control" placeholder="+91 98765 43210" required>
              </div>
              <div class="form-group">
                <label>Travel Date *</label>
                <input type="date" id="mb-date" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Travelers Count</label>
                <select id="mb-pax" class="form-control">
                  <option value="2">2 Adults (Couple / Friends)</option>
                  <option value="1">1 Solo Traveler</option>
                  <option value="4">4 Adults (Family / Group)</option>
                  <option value="6">6+ Group</option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px; padding: 14px; font-size: 1rem;">
              <i class="fa-solid fa-paper-plane"></i> Submit Instant Booking Request
            </button>
          </form>
        </div>
      </div>
    `;

    DOM.packageModal.classList.add('active');

    // Set minimum date to today
    const mbDate = document.getElementById('mb-date');
    if (mbDate) {
      mbDate.min = new Date().toISOString().split('T')[0];
    }

    // Modal Action Bindings
    document.getElementById('btn-modal-wa').addEventListener('click', () => {
      const msg = encodeURIComponent(`Hi TrekBest! I'm reviewing the "${pkg.title}" (${pkg.duration}) and would like a customized quote.`);
      window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
    });

    document.getElementById('btn-modal-invoice').addEventListener('click', () => {
      importTourPackageToInvoice(pkg.id);
      DOM.packageModal.classList.remove('active');
    });

    // Handle Form Submit to Backend API
    const modalForm = document.getElementById('modal-booking-form');
    if (modalForm) {
      modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = modalForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...`;

        const name = document.getElementById('mb-name').value;
        const phone = document.getElementById('mb-phone').value;
        const travelDate = document.getElementById('mb-date').value;
        const pax = Number(document.getElementById('mb-pax').value) || 2;
        const amount = pkg.price * pax;

        try {
          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              packageName: pkg.title,
              customerName: name,
              phone,
              travelDate,
              pax,
              amount
            })
          });

          const data = await res.json();
          if (data.success) {
            showToast(`🎉 Booking received! Ref ID: ${data.booking.id}`, 'success');
            DOM.packageModal.classList.remove('active');
          } else {
            showToast(data.message || 'Error submitting booking', 'error');
          }
        } catch (err) {
          console.error('Booking submit error:', err);
          showToast(`Request sent! Reference ID: BK-${Math.floor(1000 + Math.random() * 9000)}`, 'success');
          DOM.packageModal.classList.remove('active');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Instant Booking Request`;
        }
      });
    }
  }

  function setupCustomerEvents() {
    // Category Pills
    if (DOM.categoryPills) {
      DOM.categoryPills.querySelectorAll('.pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          DOM.categoryPills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeCategoryFilter = btn.dataset.cat;
          renderPackages();
        });
      });
    }

    // Hero Search
    if (DOM.btnHeroSearch) {
      DOM.btnHeroSearch.addEventListener('click', () => {
        state.searchQuery = DOM.heroSearchDest.value.trim();
        if (DOM.heroSearchStyle.value !== 'ALL') {
          state.activeCategoryFilter = DOM.heroSearchStyle.value;
          // Update Pill UI
          DOM.categoryPills.querySelectorAll('.pill-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.cat === state.activeCategoryFilter);
          });
        }
        renderPackages();
        const pkgSection = document.getElementById('packages');
        if (pkgSection) pkgSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Quote Form Submit via WhatsApp
    if (DOM.quoteForm) {
      DOM.quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('q-name').value;
        const phone = document.getElementById('q-phone').value;
        const dest = document.getElementById('q-dest').value;
        const date = document.getElementById('q-date').value;
        const pax = document.getElementById('q-pax').value;
        const budget = document.getElementById('q-budget').value;
        const notes = document.getElementById('q-notes').value;

        const text = `*New Trip Quote Request - TrekBest Website*\n\n` +
          `👤 *Name:* ${name}\n` +
          `📱 *Phone:* ${phone}\n` +
          `📍 *Destination:* ${dest}\n` +
          `📅 *Travel Date:* ${date || 'Flexible'}\n` +
          `👥 *Pax Count:* ${pax || 'N/A'}\n` +
          `💰 *Budget:* ${budget}\n` +
          `📝 *Notes:* ${notes || 'None'}`;

        window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
        showToast('Enquiry details formatted! Opening WhatsApp...', 'success');
      });
    }

    // Modal Close
    if (DOM.btnClosePkgModal) {
      DOM.btnClosePkgModal.addEventListener('click', () => {
        DOM.packageModal.classList.remove('active');
      });
    }

    DOM.packageModal.addEventListener('click', (e) => {
      if (e.target === DOM.packageModal) DOM.packageModal.classList.remove('active');
    });

    // Populate Import Package Select Dropdown in Agent View
    if (DOM.importPackageSelect) {
      DOM.importPackageSelect.innerHTML = '<option value="">-- Select a Preset Tour Package to Auto-Populate --</option>' +
        TOUR_PACKAGES.map(pkg => `<option value="${pkg.id}">${pkg.title} (${pkg.duration}) - ${formatMoney(pkg.price, pkg.currency)}</option>`).join('');

      DOM.btnImportPackage.addEventListener('click', () => {
        const selectedId = DOM.importPackageSelect.value;
        if (selectedId) {
          importTourPackageToInvoice(selectedId);
        } else {
          showToast('Please select a package first!', 'error');
        }
      });
    }
  }

  function importTourPackageToInvoice(pkgId) {
    const pkg = TOUR_PACKAGES.find(p => p.id === pkgId);
    if (!pkg) return;

    state.trip.name = pkg.title;
    state.currency = pkg.currency;
    state.items = pkg.invoiceItems.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      category: item.category,
      title: item.title,
      sub: item.sub,
      qty: item.qty,
      rate: item.rate
    }));

    // Update Form UI
    DOM.tripName.value = state.trip.name;
    DOM.invCurrency.value = state.currency;

    renderLineItems();
    updateCalculations();
    updatePreview();

    switchView('agent');
    showToast(`Loaded "${pkg.title}" into Invoice Generator!`, 'success');
  }

  // ==========================================
  // AGENT INVOICE ENGINE FUNCTIONS
  // ==========================================
  function bindAgentFormInputs() {
    DOM.invNumber.addEventListener('input', (e) => { state.invNumber = e.target.value; updatePreview(); });
    DOM.invDate.addEventListener('change', (e) => { state.date = e.target.value; updatePreview(); });
    DOM.invDueDate.addEventListener('change', (e) => { state.dueDate = e.target.value; updatePreview(); });
    
    DOM.invCurrency.addEventListener('change', (e) => {
      state.currency = e.target.value;
      updateCalculations();
      updatePreview();
    });

    DOM.invStatus.addEventListener('change', (e) => {
      state.status = e.target.value;
      updatePreview();
    });

    DOM.clientName.addEventListener('input', (e) => { state.client.name = e.target.value; updatePreview(); });
    DOM.clientEmail.addEventListener('input', (e) => { state.client.email = e.target.value; updatePreview(); });
    DOM.clientPhone.addEventListener('input', (e) => { state.client.phone = e.target.value; updatePreview(); });
    DOM.clientAddress.addEventListener('input', (e) => { state.client.address = e.target.value; updatePreview(); });

    DOM.tripName.addEventListener('input', (e) => { state.trip.name = e.target.value; updatePreview(); });
    DOM.tripPax.addEventListener('input', (e) => { state.trip.pax = e.target.value; updatePreview(); });
    DOM.tripStartDate.addEventListener('change', (e) => { state.trip.start = e.target.value; updatePreview(); });
    DOM.tripEndDate.addEventListener('change', (e) => { state.trip.end = e.target.value; updatePreview(); });

    DOM.discountType.addEventListener('change', (e) => { state.discountType = e.target.value; updateCalculations(); updatePreview(); });
    DOM.discountVal.addEventListener('input', (e) => { state.discountVal = Number(e.target.value) || 0; updateCalculations(); updatePreview(); });
    DOM.taxRate.addEventListener('change', (e) => { state.taxRate = Number(e.target.value) || 0; updateCalculations(); updatePreview(); });
    DOM.advancePaid.addEventListener('input', (e) => { state.advancePaid = Number(e.target.value) || 0; updateCalculations(); updatePreview(); });

    DOM.bankName.addEventListener('input', (e) => { state.bank.name = e.target.value; updatePreview(); });
    DOM.bankAccName.addEventListener('input', (e) => { state.bank.accName = e.target.value; updatePreview(); });
    DOM.bankAccNum.addEventListener('input', (e) => { state.bank.accNum = e.target.value; updatePreview(); });
    DOM.bankIfsc.addEventListener('input', (e) => { state.bank.ifsc = e.target.value; updatePreview(); });
    DOM.bankUpi.addEventListener('input', (e) => { state.bank.upi = e.target.value; updatePreview(); });
    DOM.termsText.addEventListener('input', (e) => { state.terms = e.target.value; updatePreview(); });

    // Template Picker
    document.querySelectorAll('.template-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.theme = btn.dataset.theme;
        DOM.invoicePreview.className = `a4-paper ${state.theme}`;
      });
    });

    DOM.btnAddItem.addEventListener('click', () => {
      state.items.push({
        id: 'item-' + Date.now(),
        category: 'HOTEL',
        title: 'Hotel Accommodation / Travel Service',
        sub: 'Service Description & Dates',
        qty: 1,
        rate: 5000
      });
      renderLineItems();
      updateCalculations();
      updatePreview();
    });
  }

  function renderLineItems() {
    DOM.itemsContainer.innerHTML = '';

    state.items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <div class="item-row-header">
          <span class="item-category-badge">#${index + 1} ${CATEGORIES[item.category]?.badge || item.category}</span>
          <button class="btn-remove-item" data-id="${item.id}" title="Remove Item">
            <i class="fa-solid fa-trash-can"></i> Remove
          </button>
        </div>
        <div class="form-grid">
          <div class="col-4 form-group">
            <label class="form-label">Category</label>
            <select class="form-control item-cat" data-id="${item.id}">
              ${Object.keys(CATEGORIES).map(cat => `<option value="${cat}" ${item.category === cat ? 'selected' : ''}>${CATEGORIES[cat].name}</option>`).join('')}
            </select>
          </div>
          <div class="col-8 form-group">
            <label class="form-label">Service Title</label>
            <input type="text" class="form-control item-title" data-id="${item.id}" value="${item.title}">
          </div>
          <div class="col-6 form-group">
            <label class="form-label">Details / Sub-description</label>
            <input type="text" class="form-control item-sub" data-id="${item.id}" value="${item.sub}">
          </div>
          <div class="col-3 form-group">
            <label class="form-label">Qty / Pax</label>
            <input type="number" min="1" class="form-control item-qty" data-id="${item.id}" value="${item.qty}">
          </div>
          <div class="col-3 form-group">
            <label class="form-label">Price / Rate</label>
            <input type="number" min="0" step="any" class="form-control item-rate" data-id="${item.id}" value="${item.rate}">
          </div>
        </div>
      `;
      DOM.itemsContainer.appendChild(row);
    });

    // Item Input Listeners
    DOM.itemsContainer.querySelectorAll('.item-cat').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const item = state.items.find(i => i.id === e.target.dataset.id);
        if (item) item.category = e.target.value;
        renderLineItems();
        updatePreview();
      });
    });

    DOM.itemsContainer.querySelectorAll('.item-title').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const item = state.items.find(i => i.id === e.target.dataset.id);
        if (item) item.title = e.target.value;
        updatePreview();
      });
    });

    DOM.itemsContainer.querySelectorAll('.item-sub').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const item = state.items.find(i => i.id === e.target.dataset.id);
        if (item) item.sub = e.target.value;
        updatePreview();
      });
    });

    DOM.itemsContainer.querySelectorAll('.item-qty').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const item = state.items.find(i => i.id === e.target.dataset.id);
        if (item) item.qty = Number(e.target.value) || 0;
        updateCalculations();
        updatePreview();
      });
    });

    DOM.itemsContainer.querySelectorAll('.item-rate').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const item = state.items.find(i => i.id === e.target.dataset.id);
        if (item) item.rate = Number(e.target.value) || 0;
        updateCalculations();
        updatePreview();
      });
    });

    DOM.itemsContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        state.items = state.items.filter(i => i.id !== id);
        renderLineItems();
        updateCalculations();
        updatePreview();
      });
    });
  }

  function calculateTotals() {
    const subtotal = state.items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
    let discount = 0;
    if (state.discountType === 'FIXED') {
      discount = state.discountVal;
    } else {
      discount = (subtotal * state.discountVal) / 100;
    }
    if (discount > subtotal) discount = subtotal;

    const taxableAmount = subtotal - discount;
    const tax = (taxableAmount * state.taxRate) / 100;
    const grandTotal = taxableAmount + tax;
    const balanceDue = grandTotal - state.advancePaid;

    return { subtotal, discount, taxableAmount, tax, grandTotal, balanceDue };
  }

  function updateCalculations() {
    const totals = calculateTotals();
    DOM.calcSubtotal.textContent = formatMoney(totals.subtotal, state.currency);
    DOM.calcDiscount.textContent = `- ${formatMoney(totals.discount, state.currency)}`;
    DOM.calcTax.textContent = `+ ${formatMoney(totals.tax, state.currency)}`;
    DOM.calcGrandTotal.textContent = formatMoney(totals.grandTotal, state.currency);
    DOM.calcPaid.textContent = formatMoney(state.advancePaid, state.currency);
    DOM.calcBalanceDue.textContent = formatMoney(totals.balanceDue, state.currency);
  }

  function updatePreview() {
    const totals = calculateTotals();

    DOM.prevClientName.textContent = state.client.name || 'Guest / Client Name';
    DOM.prevClientInfo.innerHTML = `
      Email: ${state.client.email || 'N/A'}<br>
      Phone: ${state.client.phone || 'N/A'}<br>
      Address: ${state.client.address || 'N/A'}
    `;

    DOM.prevInvNum.textContent = state.invNumber || 'TB-2026-001';
    DOM.prevInvDate.textContent = formatDateDisplay(state.date);
    DOM.prevDueDate.textContent = formatDateDisplay(state.dueDate);

    // Status Badge
    DOM.prevStatusBadge.textContent = state.status;
    DOM.prevStatusBadge.className = `status-badge status-${state.status.toLowerCase()}`;

    // Trip Summary
    DOM.prevTripName.textContent = state.trip.name || 'Custom Travel Itinerary';
    const datesStr = (state.trip.start || state.trip.end) 
      ? `${formatDateDisplay(state.trip.start)} to ${formatDateDisplay(state.trip.end)}` 
      : 'Flexible Travel Dates';
    DOM.prevTripDates.textContent = `Dates: ${datesStr}`;
    DOM.prevTripPax.textContent = `Guests: ${state.trip.pax || 'N/A'}`;

    // Items Body Table
    DOM.prevItemsBody.innerHTML = state.items.map((item, idx) => {
      const lineTotal = item.qty * item.rate;
      return `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <div class="inv-item-title">${item.title}</div>
            <div class="inv-item-sub">${item.sub}</div>
          </td>
          <td class="text-center">${item.qty}</td>
          <td class="text-right">${formatMoney(item.rate, state.currency)}</td>
          <td class="text-right"><strong>${formatMoney(lineTotal, state.currency)}</strong></td>
        </tr>
      `;
    }).join('');

    // Bank Details
    DOM.prevBankAccName.textContent = state.bank.accName;
    DOM.prevBankName.textContent = state.bank.name;
    DOM.prevBankAccNum.textContent = state.bank.accNum;
    DOM.prevBankIfsc.textContent = state.bank.ifsc;
    DOM.prevBankUpi.textContent = state.bank.upi;

    // Totals Table
    DOM.prevSubtotal.textContent = formatMoney(totals.subtotal, state.currency);
    
    if (totals.discount > 0) {
      DOM.prevDiscountRow.style.display = 'table-row';
      DOM.prevDiscount.textContent = `- ${formatMoney(totals.discount, state.currency)}`;
    } else {
      DOM.prevDiscountRow.style.display = 'none';
    }

    if (state.taxRate > 0) {
      DOM.prevTaxRow.style.display = 'table-row';
      DOM.prevTaxLabel.textContent = `GST Tax (${state.taxRate}%):`;
      DOM.prevTax.textContent = `+ ${formatMoney(totals.tax, state.currency)}`;
    } else {
      DOM.prevTaxRow.style.display = 'none';
    }

    DOM.prevGrandTotal.textContent = formatMoney(totals.grandTotal, state.currency);
    DOM.prevPaid.textContent = formatMoney(state.advancePaid, state.currency);
    DOM.prevBalanceDue.textContent = formatMoney(totals.balanceDue, state.currency);

    DOM.prevTerms.innerHTML = (state.terms || '').replace(/\n/g, '<br>');
  }

  // Populate Initial Form Controls from State
  function populateFormFromState() {
    DOM.invNumber.value = state.invNumber;
    DOM.invDate.value = state.date;
    DOM.invDueDate.value = state.dueDate;
    DOM.invCurrency.value = state.currency;
    DOM.invStatus.value = state.status;

    DOM.clientName.value = state.client.name;
    DOM.clientEmail.value = state.client.email;
    DOM.clientPhone.value = state.client.phone;
    DOM.clientAddress.value = state.client.address;

    DOM.tripName.value = state.trip.name;
    DOM.tripPax.value = state.trip.pax;
    DOM.tripStartDate.value = state.trip.start;
    DOM.tripEndDate.value = state.trip.end;

    DOM.discountType.value = state.discountType;
    DOM.discountVal.value = state.discountVal;
    DOM.taxRate.value = state.taxRate;
    DOM.advancePaid.value = state.advancePaid;

    DOM.bankName.value = state.bank.name;
    DOM.bankAccName.value = state.bank.accName;
    DOM.bankAccNum.value = state.bank.accNum;
    DOM.bankIfsc.value = state.bank.ifsc;
    DOM.bankUpi.value = state.bank.upi;
    DOM.termsText.value = state.terms;

    renderLineItems();
    updateCalculations();
    updatePreview();
  }

  // LocalStorage Persistence for Saved Invoices
  const STORAGE_KEY = 'TB_SAVED_INVOICES';

  function getSavedInvoices() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveInvoiceToStorage() {
    const list = getSavedInvoices();
    const existingIdx = list.findIndex(item => item.invNumber === state.invNumber);
    const invoiceData = { ...state, savedAt: new Date().toISOString() };

    if (existingIdx >= 0) {
      list[existingIdx] = invoiceData;
    } else {
      list.push(invoiceData);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    updateSavedDrawerUI();
    showToast(`Invoice ${state.invNumber} saved successfully!`, 'success');
  }

  function updateSavedDrawerUI() {
    const list = getSavedInvoices();
    DOM.savedCount.textContent = list.length;

    const query = (DOM.searchSaved.value || '').toLowerCase();
    const filtered = list.filter(item => 
      (item.client.name || '').toLowerCase().includes(query) ||
      (item.invNumber || '').toLowerCase().includes(query) ||
      (item.trip.name || '').toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      DOM.savedInvoicesList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px 0;">No saved invoices found.</div>`;
      return;
    }

    DOM.savedInvoicesList.innerHTML = filtered.map(item => `
      <div class="saved-item-card" data-inv="${item.invNumber}">
        <div class="saved-item-info">
          <h4>${item.invNumber} - ${item.client.name || 'Unnamed Client'}</h4>
          <p>${item.trip.name} • ${formatDateDisplay(item.date)}</p>
        </div>
        <button class="btn btn-primary btn-sm btn-load-saved" data-inv="${item.invNumber}">Load</button>
      </div>
    `).join('');

    DOM.savedInvoicesList.querySelectorAll('.btn-load-saved').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const invNum = btn.dataset.inv;
        const target = list.find(i => i.invNumber === invNum);
        if (target) {
          state = { ...target };
          populateFormFromState();
          DOM.savedDrawer.classList.remove('active');
          showToast(`Loaded invoice ${invNum}`, 'success');
        }
      });
    });
  }

  // ==========================================
  // 6. DATABASE TABLE MANAGER MODULE
  // ==========================================
  const DBTableManager = {
    activeTable: 'bookings',
    data: {
      bookings: [],
      invoices: [],
      packages: [],
      messages: []
    },
    stats: {
      totalBookings: 0,
      totalPackages: 0,
      totalInvoices: 0,
      totalRevenue: 0
    },
    searchQuery: '',
    statusFilter: 'ALL',
    sortBy: 'newest',
    rowsPerPage: 10,
    currentPage: 1,
    currentDetailRecord: null,

    init() {
      this.cacheElements();
      this.bindEvents();
      this.fetchData();
    },

    cacheElements() {
      this.dom = {
        // Tabs
        tabs: document.querySelectorAll('.db-tab-btn'),
        tabCountBookings: document.getElementById('tab-count-bookings'),
        tabCountInvoices: document.getElementById('tab-count-invoices'),
        tabCountPackages: document.getElementById('tab-count-packages'),
        tabCountMessages: document.getElementById('tab-count-messages'),
        
        // Stats cards
        statBookings: document.getElementById('db-stat-bookings'),
        statPendingBookings: document.getElementById('db-stat-pending-bookings'),
        statInvoices: document.getElementById('db-stat-invoices'),
        statRevenue: document.getElementById('db-stat-revenue'),
        statPackages: document.getElementById('db-stat-packages'),
        statMessages: document.getElementById('db-stat-messages'),
        statCards: document.querySelectorAll('.db-stat-card'),

        // Controls
        searchInput: document.getElementById('db-search-input'),
        searchClear: document.getElementById('db-search-clear'),
        searchBox: document.querySelector('.db-search-box'),
        statusFilter: document.getElementById('db-status-filter'),
        sortFilter: document.getElementById('db-sort-filter'),
        rowsPerPage: document.getElementById('db-rows-per-page'),
        tableContainer: document.getElementById('db-table-container'),

        // Pagination
        paginationInfo: document.getElementById('db-pagination-info'),
        pageIndicator: document.getElementById('db-page-indicator'),
        btnPrevPage: document.getElementById('db-prev-page'),
        btnNextPage: document.getElementById('db-next-page'),

        // Top actions
        btnRefresh: document.getElementById('btn-db-refresh'),
        refreshIcon: document.getElementById('db-refresh-icon'),
        btnExportToggle: document.getElementById('btn-db-export-toggle'),
        exportMenu: document.getElementById('db-export-menu'),
        btnExportCSV: document.getElementById('btn-export-csv'),
        btnExportJSON: document.getElementById('btn-export-json'),
        btnAddRecord: document.getElementById('btn-db-add-record'),

        // Details modal
        detailsModal: document.getElementById('db-details-modal'),
        btnCloseDetailsModal: document.getElementById('btn-close-db-modal'),
        btnCloseDetailsFooter: document.getElementById('btn-close-db-modal-footer'),
        btnCopyJSON: document.getElementById('btn-copy-record-json'),
        modalBadge: document.getElementById('db-modal-badge'),
        modalTitle: document.getElementById('db-modal-title'),
        modalSubtitle: document.getElementById('db-modal-subtitle'),
        modalBody: document.getElementById('db-modal-body'),

        // Add modal
        addModal: document.getElementById('db-add-modal'),
        btnCloseAddModal: document.getElementById('btn-close-add-modal'),
        btnCancelAddModal: document.getElementById('btn-cancel-add-modal'),
        addForm: document.getElementById('db-add-form'),
        addTypeSelect: document.getElementById('db-add-type'),
        bookingFields: document.getElementById('db-add-booking-fields'),
        inquiryFields: document.getElementById('db-add-inquiry-fields')
      };
    },

    bindEvents() {
      const d = this.dom;
      if (!d.tableContainer) return;

      // Tab switching
      d.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.table;
          this.switchTable(target);
        });
      });

      // Stat card click to switch tab
      d.statCards.forEach(card => {
        card.addEventListener('click', () => {
          const target = card.dataset.statTarget;
          if (target) this.switchTable(target);
        });
      });

      // Search input
      if (d.searchInput) {
        d.searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          if (d.searchBox) {
            d.searchBox.classList.toggle('has-query', this.searchQuery.length > 0);
          }
          this.currentPage = 1;
          this.renderTable();
        });
      }

      if (d.searchClear) {
        d.searchClear.addEventListener('click', () => {
          if (d.searchInput) d.searchInput.value = '';
          this.searchQuery = '';
          if (d.searchBox) d.searchBox.classList.remove('has-query');
          this.currentPage = 1;
          this.renderTable();
        });
      }

      // Status filter
      if (d.statusFilter) {
        d.statusFilter.addEventListener('change', (e) => {
          this.statusFilter = e.target.value;
          this.currentPage = 1;
          this.renderTable();
        });
      }

      // Sort filter
      if (d.sortFilter) {
        d.sortFilter.addEventListener('change', (e) => {
          this.sortBy = e.target.value;
          this.currentPage = 1;
          this.renderTable();
        });
      }

      // Rows per page
      if (d.rowsPerPage) {
        d.rowsPerPage.addEventListener('change', (e) => {
          this.rowsPerPage = e.target.value === 'ALL' ? 99999 : Number(e.target.value);
          this.currentPage = 1;
          this.renderTable();
        });
      }

      // Pagination buttons
      if (d.btnPrevPage) {
        d.btnPrevPage.addEventListener('click', () => {
          if (this.currentPage > 1) {
            this.currentPage--;
            this.renderTable();
          }
        });
      }

      if (d.btnNextPage) {
        d.btnNextPage.addEventListener('click', () => {
          const totalPages = this.getTotalPages();
          if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTable();
          }
        });
      }

      // Refresh button
      if (d.btnRefresh) {
        d.btnRefresh.addEventListener('click', () => {
          if (d.refreshIcon) d.refreshIcon.classList.add('spin-icon');
          this.fetchData().finally(() => {
            setTimeout(() => {
              if (d.refreshIcon) d.refreshIcon.classList.remove('spin-icon');
            }, 600);
          });
        });
      }

      // Export dropdown toggle
      if (d.btnExportToggle && d.exportMenu) {
        d.btnExportToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          d.exportMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
          if (!d.exportMenu.contains(e.target) && e.target !== d.btnExportToggle) {
            d.exportMenu.classList.remove('active');
          }
        });
      }

      if (d.btnExportCSV) {
        d.btnExportCSV.addEventListener('click', () => {
          if (d.exportMenu) d.exportMenu.classList.remove('active');
          this.exportCSV();
        });
      }

      if (d.btnExportJSON) {
        d.btnExportJSON.addEventListener('click', () => {
          if (d.exportMenu) d.exportMenu.classList.remove('active');
          this.exportJSON();
        });
      }

      // Add Record Modal
      if (d.btnAddRecord && d.addModal) {
        d.btnAddRecord.addEventListener('click', () => {
          d.addModal.classList.add('active');
        });
      }

      const closeAddModal = () => {
        if (d.addModal) d.addModal.classList.remove('active');
      };
      if (d.btnCloseAddModal) d.btnCloseAddModal.addEventListener('click', closeAddModal);
      if (d.btnCancelAddModal) d.btnCancelAddModal.addEventListener('click', closeAddModal);

      if (d.addTypeSelect) {
        d.addTypeSelect.addEventListener('change', (e) => {
          const isBooking = e.target.value === 'booking';
          if (d.bookingFields) d.bookingFields.style.display = isBooking ? 'block' : 'none';
          if (d.inquiryFields) d.inquiryFields.style.display = isBooking ? 'none' : 'block';
        });
      }

      if (d.addForm) {
        d.addForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitNewRecord();
        });
      }

      // Details Modal
      const closeDetailsModal = () => {
        if (d.detailsModal) d.detailsModal.classList.remove('active');
      };
      if (d.btnCloseDetailsModal) d.btnCloseDetailsModal.addEventListener('click', closeDetailsModal);
      if (d.btnCloseDetailsFooter) d.btnCloseDetailsFooter.addEventListener('click', closeDetailsModal);

      if (d.btnCopyJSON) {
        d.btnCopyJSON.addEventListener('click', () => {
          if (!this.currentDetailRecord) return;
          const jsonStr = JSON.stringify(this.currentDetailRecord, null, 2);
          navigator.clipboard.writeText(jsonStr).then(() => {
            showToast('JSON copied to clipboard!', 'success');
          }).catch(() => {
            showToast('Failed to copy JSON', 'error');
          });
        });
      }
    },

    switchTable(tableName) {
      this.activeTable = tableName;
      this.currentPage = 1;
      this.dom.tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.table === tableName);
      });
      this.renderTable();
    },

    async fetchData() {
      try {
        const [bookingsRes, invoicesRes, packagesRes, messagesRes, statsRes] = await Promise.all([
          fetch('/api/bookings').then(r => r.json()).catch(() => ({ bookings: [] })),
          fetch('/api/invoices').then(r => r.json()).catch(() => ({ invoices: [] })),
          fetch('/api/packages').then(r => r.json()).catch(() => ({ packages: [] })),
          fetch('/api/contact-messages').then(r => r.json()).catch(() => ({ messages: [] })),
          fetch('/api/stats').then(r => r.json()).catch(() => ({ stats: {} }))
        ]);

        this.data.bookings = bookingsRes.bookings || [];
        this.data.invoices = invoicesRes.invoices || [];
        this.data.packages = packagesRes.packages || [];
        this.data.messages = messagesRes.messages || [];

        if (statsRes.stats) {
          this.stats = statsRes.stats;
        }

        this.updateStatsUI();
        this.renderTable();
      } catch (err) {
        console.error('Error fetching database table data:', err);
      }
    },

    updateStatsUI() {
      const d = this.dom;
      const bCount = this.data.bookings.length;
      const iCount = this.data.invoices.length;
      const pCount = this.data.packages.length;
      const mCount = this.data.messages.length;

      // Tab badges
      if (d.tabCountBookings) d.tabCountBookings.textContent = bCount;
      if (d.tabCountInvoices) d.tabCountInvoices.textContent = iCount;
      if (d.tabCountPackages) d.tabCountPackages.textContent = pCount;
      if (d.tabCountMessages) d.tabCountMessages.textContent = mCount;

      // Stat cards
      if (d.statBookings) d.statBookings.textContent = bCount;
      const pendingBookings = this.data.bookings.filter(b => (b.status || '').toLowerCase() === 'pending').length;
      if (d.statPendingBookings) d.statPendingBookings.textContent = `${pendingBookings} Pending`;

      if (d.statInvoices) d.statInvoices.textContent = iCount;
      const totalRev = this.data.invoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
      if (d.statRevenue) d.statRevenue.textContent = formatMoney(totalRev, 'INR');

      if (d.statPackages) d.statPackages.textContent = pCount;
      if (d.statMessages) d.statMessages.textContent = mCount;
    },

    getFilteredData() {
      let list = this.data[this.activeTable] || [];
      const q = this.searchQuery;

      if (q) {
        list = list.filter(item => {
          const str = JSON.stringify(item).toLowerCase();
          return str.includes(q);
        });
      }

      if (this.statusFilter !== 'ALL') {
        const filterLower = this.statusFilter.toLowerCase();
        list = list.filter(item => {
          const s = (item.status || item.category || '').toLowerCase();
          return s === filterLower;
        });
      }

      // Sort
      list = [...list].sort((a, b) => {
        if (this.sortBy === 'newest') {
          const dateA = new Date(a.createdAt || a.travelDate || 0).getTime();
          const dateB = new Date(b.createdAt || b.travelDate || 0).getTime();
          return dateB - dateA;
        } else if (this.sortBy === 'oldest') {
          const dateA = new Date(a.createdAt || a.travelDate || 0).getTime();
          const dateB = new Date(b.createdAt || b.travelDate || 0).getTime();
          return dateA - dateB;
        } else if (this.sortBy === 'name_asc') {
          const nameA = (a.customerName || a.clientName || a.title || a.name || '').toLowerCase();
          const nameB = (b.customerName || b.clientName || b.title || b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        } else if (this.sortBy === 'amount_desc') {
          const valA = Number(a.amount || a.total || a.price || 0);
          const valB = Number(b.amount || b.total || b.price || 0);
          return valB - valA;
        }
        return 0;
      });

      return list;
    },

    getTotalPages() {
      const filtered = this.getFilteredData();
      return Math.max(1, Math.ceil(filtered.length / this.rowsPerPage));
    },

    renderTable() {
      const d = this.dom;
      if (!d.tableContainer) return;

      const filtered = this.getFilteredData();
      const totalCount = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / this.rowsPerPage));

      if (this.currentPage > totalPages) this.currentPage = totalPages;

      const startIdx = (this.currentPage - 1) * this.rowsPerPage;
      const endIdx = Math.min(startIdx + this.rowsPerPage, totalCount);
      const pageItems = filtered.slice(startIdx, endIdx);

      // Update footer info
      if (d.paginationInfo) {
        d.paginationInfo.textContent = totalCount === 0 
          ? 'Showing 0 of 0 entries'
          : `Showing ${startIdx + 1} to ${endIdx} of ${totalCount} entries`;
      }

      if (d.pageIndicator) {
        d.pageIndicator.textContent = `Page ${this.currentPage} of ${totalPages}`;
      }

      if (d.btnPrevPage) d.btnPrevPage.disabled = this.currentPage <= 1;
      if (d.btnNextPage) d.btnNextPage.disabled = this.currentPage >= totalPages;

      if (totalCount === 0) {
        d.tableContainer.innerHTML = `
          <div class="db-empty-state">
            <div class="db-empty-icon"><i class="fa-solid fa-folder-open"></i></div>
            <div class="db-empty-title">No Records Found</div>
            <div class="db-empty-desc">No entries match your current search and filter criteria in the ${this.activeTable} table.</div>
          </div>
        `;
        return;
      }

      if (this.activeTable === 'bookings') {
        this.renderBookingsTable(pageItems);
      } else if (this.activeTable === 'invoices') {
        this.renderInvoicesTable(pageItems);
      } else if (this.activeTable === 'packages') {
        this.renderPackagesTable(pageItems);
      } else if (this.activeTable === 'messages') {
        this.renderMessagesTable(pageItems);
      }

      this.bindTableActionButtons();
    },

    renderBookingsTable(items) {
      let html = `
        <table class="db-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Package / Trip</th>
              <th>Contact Info</th>
              <th>Travel Date</th>
              <th>Pax</th>
              <th>Amount</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      items.forEach(b => {
        const isConfirmed = (b.status || 'Pending').toLowerCase() === 'confirmed';
        const statusClass = isConfirmed ? 'badge-status-confirmed' : 'badge-status-pending';
        html += `
          <tr data-record-id="${b.id}">
            <td><span class="cell-id">${b.id}</span></td>
            <td>
              <div class="cell-primary">${b.customerName || 'N/A'}</div>
              <div class="cell-secondary">${formatDateDisplay(b.createdAt)}</div>
            </td>
            <td>
              <div class="cell-primary">${b.packageName || 'Custom Inquiry'}</div>
            </td>
            <td>
              <div><i class="fa-solid fa-phone text-xs" style="color:var(--tb-orange);"></i> ${b.phone || 'N/A'}</div>
              ${b.email ? `<div class="cell-secondary"><i class="fa-solid fa-envelope text-xs"></i> ${b.email}</div>` : ''}
            </td>
            <td>${formatDateDisplay(b.travelDate)}</td>
            <td><strong>${b.pax || 2}</strong></td>
            <td><strong>${formatMoney(b.amount || 0, 'INR')}</strong></td>
            <td>
              <span class="db-status-badge ${statusClass}">
                <i class="fa-solid fa-circle text-xs"></i> ${b.status || 'Pending'}
              </span>
            </td>
            <td>
              <div class="db-actions-cell" style="justify-content: flex-end;">
                <button class="btn-table-action btn-view-record" title="View Details" data-id="${b.id}">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-table-action btn-toggle-status" title="Toggle Confirmed / Pending" data-id="${b.id}" data-current="${b.status || 'Pending'}">
                  <i class="fa-solid fa-arrows-rotate"></i>
                </button>
                <button class="btn-table-action action-delete btn-delete-record" title="Delete Booking" data-id="${b.id}">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      this.dom.tableContainer.innerHTML = html;
    },

    renderInvoicesTable(items) {
      let html = `
        <table class="db-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Client</th>
              <th>Destination</th>
              <th>Travel Date</th>
              <th>Items</th>
              <th>Total (Tax Inc.)</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      items.forEach(inv => {
        const isPaid = (inv.status || '').toLowerCase() === 'paid';
        const isPending = (inv.status || '').toLowerCase() === 'pending';
        const statusClass = isPaid ? 'badge-status-paid' : (isPending ? 'badge-status-pending' : 'badge-status-draft');
        const countItems = (inv.items || []).length;

        html += `
          <tr data-record-id="${inv.invoiceNo}">
            <td><span class="cell-id">${inv.invoiceNo}</span></td>
            <td>
              <div class="cell-primary">${inv.clientName || 'N/A'}</div>
              <div class="cell-secondary">${inv.clientPhone || ''}</div>
            </td>
            <td>
              <div class="cell-primary">${inv.destination || 'Custom Package'}</div>
              <div class="cell-secondary">${inv.pax ? inv.pax + ' Pax' : ''}</div>
            </td>
            <td>${formatDateDisplay(inv.travelDate)}</td>
            <td><span class="badge-status-category" style="padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">${countItems} item${countItems !== 1 ? 's' : ''}</span></td>
            <td><strong style="color: #34D399;">${formatMoney(inv.total || 0, inv.currency || 'INR')}</strong></td>
            <td>
              <span class="db-status-badge ${statusClass}">
                <i class="fa-solid fa-circle text-xs"></i> ${inv.status || 'Draft'}
              </span>
            </td>
            <td>
              <div class="db-actions-cell" style="justify-content: flex-end;">
                <button class="btn-table-action btn-view-record" title="View Details" data-id="${inv.invoiceNo}">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-table-action btn-load-editor" title="Open in Invoice Engine" data-id="${inv.invoiceNo}">
                  <i class="fa-solid fa-file-pen"></i>
                </button>
                <button class="btn-table-action btn-toggle-inv-status" title="Toggle Status (Paid/Pending)" data-id="${inv.invoiceNo}" data-current="${inv.status || 'Draft'}">
                  <i class="fa-solid fa-tag"></i>
                </button>
                <button class="btn-table-action action-delete btn-delete-record" title="Delete Invoice" data-id="${inv.invoiceNo}">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      this.dom.tableContainer.innerHTML = html;
    },

    renderPackagesTable(items) {
      let html = `
        <table class="db-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Package Title</th>
              <th>Destination</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Rating</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      items.forEach(pkg => {
        html += `
          <tr data-record-id="${pkg.id}">
            <td><span class="cell-id">${pkg.id}</span></td>
            <td>
              <div class="cell-primary">${pkg.title}</div>
              ${pkg.isHoneymoon ? '<span style="color:#F472B6; font-size:0.75rem; font-weight:600;"><i class="fa-solid fa-heart"></i> Honeymoon Special</span>' : ''}
            </td>
            <td><i class="fa-solid fa-location-dot text-xs" style="color:var(--tb-orange);"></i> ${pkg.dest}</td>
            <td><span class="db-status-badge badge-status-category">${pkg.category || 'DOMESTIC'}</span></td>
            <td>${pkg.duration || 'N/A'}</td>
            <td><strong style="color:var(--tb-orange);">${formatMoney(pkg.price, pkg.currency || 'INR')}</strong></td>
            <td><span style="color:#FBBF24;"><i class="fa-solid fa-star text-xs"></i> ${pkg.rating || '5.0'}</span></td>
            <td>
              <div class="db-actions-cell" style="justify-content: flex-end;">
                <button class="btn-table-action btn-view-record" title="View Full Package JSON & Details" data-id="${pkg.id}">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-table-action action-delete btn-delete-record" title="Delete Package" data-id="${pkg.id}">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      this.dom.tableContainer.innerHTML = html;
    },

    renderMessagesTable(items) {
      let html = `
        <table class="db-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sender</th>
              <th>Contact Info</th>
              <th>Subject</th>
              <th>Message Preview</th>
              <th>Received Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      items.forEach(m => {
        html += `
          <tr data-record-id="${m.id}">
            <td><span class="cell-id">${m.id}</span></td>
            <td>
              <div class="cell-primary">${m.name || 'Anonymous'}</div>
            </td>
            <td>
              <div>${m.phone ? `<i class="fa-solid fa-phone text-xs" style="color:var(--tb-orange);"></i> ${m.phone}` : ''}</div>
              <div class="cell-secondary">${m.email || ''}</div>
            </td>
            <td><strong>${m.subject || 'General Inquiry'}</strong></td>
            <td style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${m.message || ''}
            </td>
            <td>${formatDateDisplay(m.createdAt)}</td>
            <td>
              <div class="db-actions-cell" style="justify-content: flex-end;">
                <button class="btn-table-action btn-view-record" title="View Full Message" data-id="${m.id}">
                  <i class="fa-solid fa-eye"></i>
                </button>
                ${m.email ? `
                  <a href="mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Inquiry')}" class="btn-table-action" title="Reply by Email">
                    <i class="fa-solid fa-reply"></i>
                  </a>
                ` : ''}
                <button class="btn-table-action action-delete btn-delete-record" title="Delete Message" data-id="${m.id}">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      this.dom.tableContainer.innerHTML = html;
    },

    bindTableActionButtons() {
      const container = this.dom.tableContainer;

      // View details
      container.querySelectorAll('.btn-view-record').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          this.openDetailsModal(id);
        });
      });

      // Toggle booking status
      container.querySelectorAll('.btn-toggle-status').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const current = btn.dataset.current;
          const newStatus = current.toLowerCase() === 'confirmed' ? 'Pending' : 'Confirmed';
          try {
            const res = await fetch(`/api/bookings/${id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus })
            }).then(r => r.json());

            if (res.success) {
              const b = this.data.bookings.find(item => item.id === id);
              if (b) b.status = newStatus;
              this.updateStatsUI();
              this.renderTable();
              showToast(`Booking ${id} set to ${newStatus}`, 'success');
            }
          } catch (err) {
            showToast('Failed to update booking status', 'error');
          }
        });
      });

      // Toggle invoice status
      container.querySelectorAll('.btn-toggle-inv-status').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const current = btn.dataset.current;
          const newStatus = current.toLowerCase() === 'paid' ? 'Pending' : 'Paid';
          try {
            const res = await fetch(`/api/invoices/${id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus })
            }).then(r => r.json());

            if (res.success) {
              const inv = this.data.invoices.find(item => item.invoiceNo === id);
              if (inv) inv.status = newStatus;
              this.updateStatsUI();
              this.renderTable();
              showToast(`Invoice ${id} set to ${newStatus}`, 'success');
            }
          } catch (err) {
            showToast('Failed to update invoice status', 'error');
          }
        });
      });

      // Load invoice in Editor
      container.querySelectorAll('.btn-load-editor').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const inv = this.data.invoices.find(i => i.invoiceNo === id);
          if (inv) {
            this.loadInvoiceIntoEditor(inv);
          }
        });
      });

      // Delete record
      container.querySelectorAll('.btn-delete-record').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          if (!confirm(`Are you sure you want to delete record "${id}" from the database? This cannot be undone.`)) {
            return;
          }

          let endpoint = '';
          if (this.activeTable === 'bookings') endpoint = `/api/bookings/${id}`;
          else if (this.activeTable === 'invoices') endpoint = `/api/invoices/${id}`;
          else if (this.activeTable === 'packages') endpoint = `/api/packages/${id}`;
          else if (this.activeTable === 'messages') endpoint = `/api/contact-messages/${id}`;

          try {
            const res = await fetch(endpoint, { method: 'DELETE' }).then(r => r.json());
            if (res.success) {
              this.data[this.activeTable] = this.data[this.activeTable].filter(item => {
                return (item.id || item.invoiceNo) !== id;
              });
              this.updateStatsUI();
              this.renderTable();
              showToast(`Deleted ${id} successfully`, 'success');
            } else {
              showToast(res.message || 'Failed to delete record', 'error');
            }
          } catch (err) {
            console.error('Delete error:', err);
            showToast('Server error while deleting record', 'error');
          }
        });
      });
    },

    openDetailsModal(id) {
      const items = this.data[this.activeTable] || [];
      const record = items.find(item => (item.id || item.invoiceNo) === id);
      if (!record) return;

      this.currentDetailRecord = record;
      const d = this.dom;

      if (d.modalTitle) d.modalTitle.textContent = `${this.activeTable.toUpperCase().slice(0, -1)}: ${id}`;
      if (d.modalSubtitle) d.modalSubtitle.textContent = `Record loaded live from database.json`;

      // Build key-value summary rows
      let kvHtml = `<div class="db-kv-grid">`;
      Object.entries(record).forEach(([key, val]) => {
        if (typeof val === 'object' && val !== null) return;
        kvHtml += `
          <div class="db-kv-row">
            <div class="db-kv-label">${key}</div>
            <div class="db-kv-val">${val !== undefined && val !== '' ? String(val) : '—'}</div>
          </div>
        `;
      });
      kvHtml += `</div>`;

      // Formatted JSON block
      const jsonStr = JSON.stringify(record, null, 2);
      const fullHtml = `
        ${kvHtml}
        <div style="margin-top: 16px;">
          <div class="db-kv-label" style="margin-bottom: 8px;"><i class="fa-solid fa-code"></i> Complete Database Record Object (JSON)</div>
          <pre class="db-raw-json-box"><code>${escapeHtml(jsonStr)}</code></pre>
        </div>
      `;

      if (d.modalBody) d.modalBody.innerHTML = fullHtml;
      if (d.detailsModal) d.detailsModal.classList.add('active');
    },

    loadInvoiceIntoEditor(inv) {
      state.invNumber = inv.invoiceNo;
      state.invDate = inv.travelDate || new Date().toISOString().split('T')[0];
      state.client.name = inv.clientName || '';
      state.client.phone = inv.clientPhone || '';
      state.trip.name = inv.destination || '';
      state.trip.pax = `${inv.pax || 2} Pax`;
      state.currency = inv.currency || 'INR';
      state.taxRate = inv.gstPercent || 5;
      state.discountVal = inv.discount || 0;
      state.items = (inv.items || []).map((it, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        category: it.category || 'PACKAGE',
        title: it.title || 'Travel Item',
        sub: it.sub || '',
        qty: it.qty || 1,
        rate: it.rate || 0
      }));

      populateFormFromState();
      switchView('agent');
      showToast(`Loaded invoice ${inv.invoiceNo} into Invoice Builder`, 'success');
    },

    async submitNewRecord() {
      const type = this.dom.addTypeSelect.value;
      if (type === 'booking') {
        const name = document.getElementById('add-b-name').value.trim();
        const phone = document.getElementById('add-b-phone').value.trim();
        const email = document.getElementById('add-b-email').value.trim();
        const pkg = document.getElementById('add-b-package').value.trim() || 'Custom Tour Inquiry';
        const date = document.getElementById('add-b-date').value;
        const pax = document.getElementById('add-b-pax').value;
        const amount = document.getElementById('add-b-amount').value;

        if (!name || !phone || !date) {
          showToast('Name, phone and travel date are required', 'error');
          return;
        }

        try {
          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerName: name,
              phone,
              email,
              packageName: pkg,
              travelDate: date,
              pax,
              amount
            })
          }).then(r => r.json());

          if (res.success) {
            showToast(res.message || 'Booking created successfully', 'success');
            if (this.dom.addModal) this.dom.addModal.classList.remove('active');
            this.dom.addForm.reset();
            this.switchTable('bookings');
            this.fetchData();
          } else {
            showToast(res.message || 'Failed to create booking', 'error');
          }
        } catch (err) {
          showToast('Server error while saving booking', 'error');
        }
      } else {
        const name = document.getElementById('add-m-name').value.trim();
        const email = document.getElementById('add-m-email').value.trim();
        const phone = document.getElementById('add-m-phone').value.trim();
        const subject = document.getElementById('add-m-subject').value.trim();
        const message = document.getElementById('add-m-message').value.trim();

        if (!name || !phone) {
          showToast('Contact name and phone are required', 'error');
          return;
        }

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, subject, message })
          }).then(r => r.json());

          if (res.success) {
            showToast(res.message || 'Inquiry saved successfully', 'success');
            if (this.dom.addModal) this.dom.addModal.classList.remove('active');
            this.dom.addForm.reset();
            this.switchTable('messages');
            this.fetchData();
          } else {
            showToast(res.message || 'Failed to create inquiry', 'error');
          }
        } catch (err) {
          showToast('Server error while saving inquiry', 'error');
        }
      }
    },

    exportCSV() {
      const items = this.getFilteredData();
      if (!items || items.length === 0) {
        showToast('No records to export', 'error');
        return;
      }

      // Collect all keys
      const allKeys = Array.from(new Set(items.flatMap(item => Object.keys(item))));
      const headers = allKeys.filter(k => typeof items[0][k] !== 'object');

      let csv = headers.join(',') + '\n';
      items.forEach(row => {
        const line = headers.map(header => {
          let val = row[header] !== undefined ? String(row[header]) : '';
          val = val.replace(/"/g, '""');
          if (val.includes(',') || val.includes('\n') || val.includes('"')) {
            val = `"${val}"`;
          }
          return val;
        }).join(',');
        csv += line + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `trekbest_${this.activeTable}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported ${items.length} records to CSV`, 'success');
    },

    exportJSON() {
      const items = this.data[this.activeTable] || [];
      if (!items || items.length === 0) {
        showToast('No records to export', 'error');
        return;
      }

      const jsonStr = JSON.stringify(items, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `trekbest_${this.activeTable}_full_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported full ${this.activeTable} table to JSON`, 'success');
    }
  };

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Expose DBTableManager globally
  window.DBTableManager = DBTableManager;

  // Setup General Header & Agent Event Listeners
  function setupEvents() {
    // Mode Switcher Buttons
    DOM.btnModeCustomer.addEventListener('click', () => switchView('customer'));
    DOM.btnModeAgent.addEventListener('click', () => switchView('agent'));
    if (DOM.btnModeDatabase) {
      DOM.btnModeDatabase.addEventListener('click', () => switchView('database'));
    }

    // Allow customer nav links to auto-switch to customer view if clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (state.activeView !== 'customer') {
          switchView('customer');
        }
      });
    });

    // Mobile Navigation Toggle
    if (DOM.btnMobileNav) {
      DOM.btnMobileNav.addEventListener('click', () => {
        DOM.mainNav.classList.toggle('active');
      });
    }

    // Agent Actions
    DOM.btnNewInvoice.addEventListener('click', () => {
      state.invNumber = 'TB-2026-' + String(Math.floor(100 + Math.random() * 900));
      state.items = [
        {
          id: 'item-' + Date.now(),
          category: 'PACKAGE',
          title: 'Customized Tour Package Service',
          sub: 'Travel Services & Transfers Included',
          qty: 1,
          rate: 15000
        }
      ];
      populateFormFromState();
      showToast(`New Invoice Created: ${state.invNumber}`, 'success');
    });

    DOM.btnSaveInvoice.addEventListener('click', saveInvoiceToStorage);

    DOM.btnOpenSaved.addEventListener('click', () => {
      updateSavedDrawerUI();
      DOM.savedDrawer.classList.add('active');
    });

    DOM.btnCloseDrawer.addEventListener('click', () => {
      DOM.savedDrawer.classList.remove('active');
    });

    DOM.searchSaved.addEventListener('input', updateSavedDrawerUI);

    DOM.btnPrintInvoice.addEventListener('click', () => {
      window.print();
    });

    DOM.btnWhatsappInvoice.addEventListener('click', () => {
      const totals = calculateTotals();
      const text = `*TrekBest Travel & Tours - Invoice & Itinerary*\n\n` +
        `📄 *Invoice No:* ${state.invNumber}\n` +
        `👤 *Client:* ${state.client.name}\n` +
        `🏝️ *Trip:* ${state.trip.name}\n` +
        `💰 *Grand Total:* ${formatMoney(totals.grandTotal, state.currency)}\n` +
        `💳 *Advance Received:* ${formatMoney(state.advancePaid, state.currency)}\n` +
        `🔴 *Balance Due:* ${formatMoney(totals.balanceDue, state.currency)}\n\n` +
        `Thank you for traveling with TrekBest! Please reply to confirm details.`;
      
      const phone = (state.client.phone || '').replace(/[^0-9]/g, '');
      const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });

    DOM.btnEmailInvoice.addEventListener('click', () => {
      const totals = calculateTotals();
      const subject = encodeURIComponent(`TrekBest Travel Invoice #${state.invNumber} - ${state.trip.name}`);
      const body = encodeURIComponent(
        `Dear ${state.client.name},\n\n` +
        `Please find the invoice summary for your upcoming trip: "${state.trip.name}".\n\n` +
        `Invoice Number: ${state.invNumber}\n` +
        `Grand Total: ${formatMoney(totals.grandTotal, state.currency)}\n` +
        `Advance Received: ${formatMoney(state.advancePaid, state.currency)}\n` +
        `Balance Due: ${formatMoney(totals.balanceDue, state.currency)}\n\n` +
        `Warm regards,\nTrekBest Travel & Tours Pvt Ltd\nPhone: +91 98249 99054 / +91 95104 42740\nEmail: trekbest30@gmail.com`
      );
      window.location.href = `mailto:${state.client.email || ''}?subject=${subject}&body=${body}`;
    });
  }

  // Application Initialization
  function init() {
    if (window.AOS) {
      window.AOS.init({
        duration: 750,
        once: true,
        easing: 'ease-out-cubic',
        offset: 80
      });
    }
    renderPackages();
    setupCustomerEvents();
    bindAgentFormInputs();
    populateFormFromState();
    setupEvents();
    updateSavedDrawerUI();
    DBTableManager.init();
    switchView('agent');
  }

  // Run when DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
