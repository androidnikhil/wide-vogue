export type Language = 'en' | 'hi';

export interface Translations {
  common: {
    cart: string;
    whatsappPill: string;
    whatsappDefaultMsg: string;
    featured: string;
    off: string;
  };
  header: {
    freeShipping: string;
    freeShippingMobile: string;
    radheRadhe: string;
    trustedDevotees: string;
    trustedDevoteesMobile: string;
    searchPlaceholder: string;
    searchBtn: string;
    navHome: string;
    navPoshak: string;
    navMukutBansuri: string;
    navJewelleryMala: string;
    navSinghasan: string;
    navSevaEssentials: string;
    navFestiveSets: string;
    navSizeChart: string;
    cart: string;
    wishlist: string;
    myAccount: string;
    devotee: string;
    verified: string;
    completeProfile: string;
    ordersTracking: string;
    savedAddresses: string;
    giftCardsRewards: string;
    editProfile: string;
    adminDashboard: string;
    signOut: string;
    signIn: string;
    sidebarPoshak: string;
    sidebarMukut: string;
    sidebarBansuri: string;
    sidebarCart: string;
  };
  home: {
    divineEssentials: string;
    hero1Title: string;
    hero1Subtitle: string;
    hero1Btn: string;
    hero1Btn2: string;
    newBadge: string;
    hero2Title: string;
    hero2Subtitle: string;
    hero2Btn: string;
    darshanBadge: string;
    hero3Title: string;
    hero3Subtitle: string;
    hero3Btn: string;
    curatedSeva: string;
    discoverShringar: string;
    poshakTitle: string;
    bestsellersBadge: string;
    mukutTitle: string;
    bansuriTitle: string;
    jewelsTitle: string;
    kanhasWorldTag: string;
    kanhasWorldTitle: string;
    kanhasWorldSubtitle: string;
    kanhasWorldDesc: string;
    readOurStoryBtn: string;
    featuredTitle: string;
    featuredSubtitle: string;
    noFeatured: string;
    viewEntireCollection: string;
    intricateBadge: string;
    divineBadge: string;
    blessedBadge: string;
    sacredBadge: string;
    completeShringar: string;
    completeSubtitle: string;
    poshakBadge: string;
    mukutBadge: string;
    malaBadge: string;
    bansuriBadge: string;
    kanganBadge: string;
    exploreCombos: string;
    matchingSets: string;
    sevaForOccasions: string;
    dailySeva: string;
    janmashtami: string;
    festivals: string;
    specialDarshan: string;
    explore: string;
    devotionalPromise: string;
    promiseTitle: string;
    promiseDesc: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar1Badge: string;
    pillar1Top: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar2Badge: string;
    pillar2Top: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar3Badge: string;
    pillar3Top: string;
    pillar4Title: string;
    pillar4Desc: string;
    pillar4Badge: string;
    pillar4Top: string;
    momentsOfSeva: string;
    momentsSubtitle: string;
    lovedByDevotees: string;
    review1Text: string;
    review1Name: string;
    review2Text: string;
    review2Name: string;
    review3Text: string;
    review3Name: string;
    ctaTitle: string;
    ctaHighlight: string;
    ctaSubtitle: string;
    ctaBtn: string;
  };
  product: {
    addToCart: string;
    addedToCart: string;
    buyNow: string;
    selectSize: string;
    sizeGuide: string;
    inclusiveOfTaxes: string;
    checkDelivery: string;
    enterPincode: string;
    checkBtn: string;
    checking: string;
    inStock: string;
    outOfStock: string;
    description: string;
    divineMatches: string;
    cashOnDelivery: string;
    available: string;
    prepaidOnly: string;
    estimatedDelivery: string;
    deliveredTo: string;
    freeDeliveryThreshold: string;
    panIndiaExpress: string;
    tapSizeToAdd: string;
    sizesCount: string;
  };
  cart: {
    yourCart: string;
    devotionalCart: string;
    emptyCartTitle: string;
    emptyCartDesc: string;
    exploreBtn: string;
    subtotal: string;
    total: string;
    qty: string;
    checkout: string;
    reviewCart: string;
    freeDeliveryEligible: string;
  };
  footer: {
    brandDesc: string;
    quickSevaLinks: string;
    home: string;
    helpFaq: string;
    sizeChartGuide: string;
    fabricPromise: string;
    shippingDelivery: string;
    exchangeReturns: string;
    devotionalCategories: string;
    poshakCollection: string;
    mukutPagdi: string;
    motiMalaHaar: string;
    goldenBansuri: string;
    carvedSinghasan: string;
    festiveComboSets: string;
    devoteeCareSupport: string;
    directCalling: string;
    callingTime: string;
    whatsappSeva: string;
    whatsappSub: string;
    devotionalInquiries: string;
    operatingHubs: string;
    operatingLocations: string;
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    authenticityPromise: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      cart: 'Seva Cart',
      whatsappPill: 'Radhe Radhe! Chat with us',
      whatsappDefaultMsg: 'Radhe Radhe! I am visiting Madhav Shringaar and would like to inquire about Laddu Gopal Ji poshak and seva essentials.',
      featured: 'Featured',
      off: 'OFF',
    },
    header: {
      freeShipping: '🚚 Free Shipping above ₹999 across India',
      freeShippingMobile: 'Free Shipping ₹999+',
      radheRadhe: '॥ Radhe Radhe ॥',
      trustedDevotees: 'Trusted by 10,000+ Happy Devotees',
      trustedDevoteesMobile: '10,000+ Devotees',
      searchPlaceholder: 'Search poshak, mukut, mala, combos...',
      searchBtn: 'Search',
      navHome: 'Home',
      navPoshak: 'Poshak',
      navMukutBansuri: 'Mukut & Bansuri',
      navJewelleryMala: 'Jewellery & Mala',
      navSinghasan: 'Singhasan',
      navSevaEssentials: 'Seva Essentials',
      navFestiveSets: 'Festive Sets',
      navSizeChart: 'Size Chart (0-6 No.)',
      cart: 'Seva Cart',
      wishlist: 'Wishlist',
      myAccount: 'My Account',
      devotee: 'Devotee',
      verified: 'Verified',
      completeProfile: 'Complete Profile',
      ordersTracking: 'Orders & Tracking',
      savedAddresses: 'Saved Addresses',
      giftCardsRewards: 'Gift Cards & Rewards',
      editProfile: 'Edit Profile',
      adminDashboard: 'Admin Dashboard',
      signOut: 'Sign Out',
      signIn: 'Sign In',
      sidebarPoshak: 'POSHAK',
      sidebarMukut: 'MUKUT',
      sidebarBansuri: 'BANSURI',
      sidebarCart: 'CART',
    },
    home: {
      divineEssentials: 'DIVINE ESSENTIALS',
      hero1Title: 'Adorn Your Beloved Kanha',
      hero1Subtitle: 'Beautiful Poshak & Shringar, Chosen with Pure Devotion for Thakur Ji.',
      hero1Btn: 'Shop Poshak',
      hero1Btn2: 'Explore Shringar',
      newBadge: 'New!',
      hero2Title: 'Signature Poshak',
      hero2Subtitle: 'Handcrafted by master artisans. Every stitch is infused with pure devotion. Designed perfectly for your beloved Laddu Gopal.',
      hero2Btn: 'EXPLORE THE COLLECTION',
      darshanBadge: 'Special Darshan',
      hero3Title: 'Crowns & Flutes',
      hero3Subtitle: 'Hand-carved brass and bamboo flutes, paired with radiant crowns fit for the Divine Prince of Braj.',
      hero3Btn: 'DISCOVER JEWELS',
      curatedSeva: 'Curated Seva',
      discoverShringar: 'Discover Shringar',
      poshakTitle: 'Poshak',
      bestsellersBadge: 'Bestsellers',
      mukutTitle: 'Mukut',
      bansuriTitle: 'Bansuri',
      jewelsTitle: 'Jewels',
      kanhasWorldTag: 'The Divine Details',
      kanhasWorldTitle: "Kanha's Little World",
      kanhasWorldSubtitle: '“Where every little detail is chosen with love.”',
      kanhasWorldDesc: 'Enter a world where devotion takes physical form. The gentle curve of His bansuri, the vibrant feathers of His mukut, the delicate embroidery of His poshak—everything is curated to resonate with the purest love.',
      readOurStoryBtn: 'Read Our Story',
      featuredTitle: 'Featured Collection',
      featuredSubtitle: 'Real Madhav Shringaar products, ready for your beloved Kanha.',
      noFeatured: 'No featured products available.',
      viewEntireCollection: 'View Entire Collection',
      intricateBadge: 'Intricate',
      divineBadge: 'Divine',
      blessedBadge: 'Blessed',
      sacredBadge: 'Sacred',
      completeShringar: 'Complete Shringar',
      completeSubtitle: '“Everything your beloved Kanha needs, thoughtfully brought together.”',
      poshakBadge: 'Poshak',
      mukutBadge: 'Mukut',
      malaBadge: 'Mala',
      bansuriBadge: 'Bansuri',
      kanganBadge: 'Kangan',
      exploreCombos: 'Explore Combos',
      matchingSets: 'Matching Sets!',
      sevaForOccasions: 'Seva For Every Occasion',
      dailySeva: 'Daily Seva',
      janmashtami: 'Janmashtami',
      festivals: 'Festivals',
      specialDarshan: 'Special Darshan',
      explore: 'Explore',
      devotionalPromise: 'पवित्र सेवा संकल्प • Our Devotional Promise',
      promiseTitle: 'Handcrafted in Braj, Adorned with Love',
      promiseDesc: 'Every poshak, mukut, and shringaar essential is crafted just as we would prepare it for Thakur Ji in our own home temple — with pure devotion, gentle deity-safe fabrics, and attentive devotee care.',
      pillar1Title: 'Authentic Braj Artistry',
      pillar1Desc: 'Hand-tailored by generational Mathura & Vrindavan karigars using pure brocades, soft silks, and velvet with feather-soft linings that gently caress Thakur Ji.',
      pillar1Badge: '100% Deity-Safe, Pure Fabrics',
      pillar1Top: 'Braj Dhām Karigari',
      pillar2Title: 'Pavitra Safe Packaging',
      pillar2Desc: 'Sealed in clean, sacred multi-layer protective packaging and sturdy gift boxes so intricate crowns, delicate pearls, and flutes arrive spotless and unbent.',
      pillar2Badge: 'Air Dispatch with Live Tracking',
      pillar2Top: 'Express Pan-India',
      pillar3Title: 'Size Fit Guarantee',
      pillar3Desc: 'Unsure whether size 2 or 3 suits your Laddu Gopal Ji? Share a photo on WhatsApp for instant sizing guidance, with prompt 7-day hassle-free exchange if needed.',
      pillar3Badge: '7-Day Easy Exchange Policy',
      pillar3Top: '0 to 6 No. Vigrah Fit',
      pillar4Title: 'Direct Devotee Seva',
      pillar4Desc: 'Speak directly with fellow bhakts on call (+91 70782 11946) or WhatsApp (+91 79821 60480) for festival color combinations, custom requests, and order assistance.',
      pillar4Badge: 'Call & WhatsApp 10 AM – 7 PM',
      pillar4Top: 'Real Devotees, Not Bots',
      momentsOfSeva: 'Moments of Seva',
      momentsSubtitle: 'Glimpses of devotion from our artisans and devotees.',
      lovedByDevotees: 'Loved by Devotees',
      review1Text: 'The poshak is absolutely stunning. The embroidery work is so detailed. My Kanha looks divine!',
      review1Name: 'Radhika S.',
      review2Text: 'I ordered the complete shringar set for Janmashtami. The packaging was beautiful and the quality is premium.',
      review2Name: 'Meera V.',
      review3Text: 'Beautiful mukut and bansuri. Exactly what I was looking for. Will definitely shop again for daily seva items.',
      review3Name: 'Ananya D.',
      ctaTitle: 'Bring Home',
      ctaHighlight: 'Divine Happiness',
      ctaSubtitle: 'Make every moment of seva special.',
      ctaBtn: 'Shop Madhav Shringaar',
    },
    product: {
      addToCart: 'Add to Devotional Cart',
      addedToCart: 'Added to Seva Cart',
      buyNow: 'Buy Now & Adorn',
      selectSize: 'Select Gopal Ji Size (0–6 No.)',
      sizeGuide: 'View Size Measurement Guide',
      inclusiveOfTaxes: '(Inclusive of all taxes)',
      checkDelivery: 'Check Delivery & COD Availability',
      enterPincode: 'Enter 6-digit delivery pincode',
      checkBtn: 'Check',
      checking: 'Checking...',
      inStock: 'In Stock for Immediate Seva',
      outOfStock: 'Currently Out of Stock',
      description: 'Devotional Description',
      divineMatches: 'Divine Match Suggestions',
      cashOnDelivery: 'Cash on Delivery',
      available: 'Available',
      prepaidOnly: 'Prepaid Only',
      estimatedDelivery: 'Estimated Delivery by',
      deliveredTo: 'Delivering to',
      freeDeliveryThreshold: 'Free Delivery on ₹999+',
      panIndiaExpress: 'Pan-India Express',
      tapSizeToAdd: 'Tap size to add',
      sizesCount: 'sizes',
    },
    cart: {
      yourCart: 'Your Seva Cart',
      devotionalCart: 'Your Devotional Cart',
      emptyCartTitle: 'Your seva cart is feeling empty',
      emptyCartDesc: 'Explore our holy collection of hand-stitched poshak and sacred shringaar.',
      exploreBtn: 'Explore Holy Collection',
      subtotal: 'Subtotal Seva Value',
      total: 'Total Seva Amount',
      qty: 'Qty',
      checkout: 'Proceed to Sacred Checkout',
      reviewCart: 'Review Cart & Checkout',
      freeDeliveryEligible: 'Eligible for Free Pan-India Delivery',
    },
    footer: {
      brandDesc: 'Bringing divine adornments, authentic fabrics, and revered seva essentials to every Kanha devotee with eternal dedication.',
      quickSevaLinks: 'Quick Seva Links',
      home: 'Home',
      helpFaq: 'Help Centre & Devotee FAQs',
      sizeChartGuide: 'Size Chart Guide (0-6 No.)',
      fabricPromise: 'Authentic Fabric Promise',
      shippingDelivery: 'Shipping & Pan-India Delivery',
      exchangeReturns: 'Exchange & Return Policy',
      devotionalCategories: 'Devotional Categories',
      poshakCollection: 'Poshak Collection',
      mukutPagdi: 'Mukut & Pagdi',
      motiMalaHaar: 'Moti Mala & Haar',
      goldenBansuri: 'Golden Bansuri',
      carvedSinghasan: 'Carved Singhasan',
      festiveComboSets: 'Festive Combo Sets',
      devoteeCareSupport: 'Devotee Care Support',
      directCalling: 'Direct Calling',
      callingTime: '(10:00 AM - 7:00 PM IST)',
      whatsappSeva: 'WhatsApp Seva & Custom Orders',
      whatsappSub: 'Chat with Devotee Care',
      devotionalInquiries: 'Devotional Inquiries & Orders',
      operatingHubs: 'Operating from Agra & Noida',
      operatingLocations: 'Uttar Pradesh / Delhi NCR | Express Pan-India Delivery',
      copyright: '© 2025 Madhav Shringaar. Dedicated with utmost reverent seva to Shri Laddu Gopal Ji. All Rights Reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      authenticityPromise: 'Authenticity Promise',
    },
  },
  hi: {
    common: {
      cart: 'सेवा टोकरी',
      whatsappPill: 'राधे राधे! सेवा हेतु संपर्क करें',
      whatsappDefaultMsg: 'राधे राधे! मैं माधव शृंगार से लड्डू गोपाल जी की पोशाक एवं सेवा सामग्री के संबंध में जानकारी लेना चाहता/चाहती हूँ।',
      featured: 'विशेष शृंगार',
      off: 'छूट',
    },
    header: {
      freeShipping: '🚚 पूरे भारत में ₹999 से अधिक पर मुफ़्त डिलीवरी',
      freeShippingMobile: 'मुफ़्त डिलीवरी ₹999+',
      radheRadhe: '॥ राधे राधे ॥',
      trustedDevotees: '10,000+ संतुष्ट कृष्ण भक्तों का विश्वास',
      trustedDevoteesMobile: '10,000+ भक्त',
      searchPlaceholder: 'कान्हा जी की पोशाक, मुकुट, माला, बाँसुरी खोजें...',
      searchBtn: 'खोजें',
      navHome: 'होम',
      navPoshak: 'लड्डू गोपाल पोशाक',
      navMukutBansuri: 'मुकुट एवं बाँसुरी',
      navJewelleryMala: 'आभूषण एवं माला',
      navSinghasan: 'सिंहासन',
      navSevaEssentials: 'सेवा सामग्री',
      navFestiveSets: 'उत्सव कॉम्बो सेट',
      navSizeChart: 'नाप तालिका (0-6 नं.)',
      cart: 'सेवा टोकरी',
      wishlist: 'पसंदीदा शृंगार',
      myAccount: 'मेरा खाता',
      devotee: 'भक्त',
      verified: 'सत्यापित',
      completeProfile: 'प्रोफ़ाइल पूर्ण करें',
      ordersTracking: 'ऑर्डर एवं ट्रैकिंग',
      savedAddresses: 'सहेजे गए पते',
      giftCardsRewards: 'गिफ्ट कार्ड एवं रिवॉर्ड्स',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      adminDashboard: 'व्यवस्थापक डैशबोर्ड',
      signOut: 'लॉग आउट',
      signIn: 'लॉगिन करें',
      sidebarPoshak: 'पोशाक',
      sidebarMukut: 'मुकुट',
      sidebarBansuri: 'बाँसुरी',
      sidebarCart: 'टोकरी',
    },
    home: {
      divineEssentials: 'पवित्र सेवा सामग्री',
      hero1Title: 'सजाएं अपने लाडले कान्हा को',
      hero1Subtitle: 'सुंदर पोशाक एवं शृंगार। ठाकुर जी के लिए पूर्ण भक्ति भाव से निर्मित।',
      hero1Btn: 'पोशाक संग्रह देखें',
      hero1Btn2: 'शृंगार दर्शन करें',
      newBadge: 'नवीन संग्रह!',
      hero2Title: 'विशेष ज़री पोशाक',
      hero2Subtitle: 'सिद्ध कारीगरों द्वारा हस्तनिर्मित। प्रत्येक टांका भक्ति भाव से युक्त। आपके प्रिय लड्डू गोपाल के लिए सर्वथा उपयुक्त।',
      hero2Btn: 'संपूर्ण संग्रह देखें',
      darshanBadge: 'विशेष दर्शन',
      hero3Title: 'मुकुट एवं बाँसुरी',
      hero3Subtitle: 'हाथ से तराशी गई बाँसुरी और ब्रज राजकुमार के विग्रह योग्य अलौकिक मुकुट।',
      hero3Btn: 'आभूषण दर्शन करें',
      curatedSeva: 'विशिष्ट सेवा संग्रह',
      discoverShringar: 'दिव्य शृंगार दर्शन',
      poshakTitle: 'पोशाक',
      bestsellersBadge: 'सर्वाधिक प्रिय',
      mukutTitle: 'मुकुट',
      bansuriTitle: 'बाँसुरी',
      jewelsTitle: 'आभूषण',
      kanhasWorldTag: 'दिव्य शृंगार विवरण',
      kanhasWorldTitle: 'कान्हा की बाल लीला एवं शृंगार',
      kanhasWorldSubtitle: '“जहाँ हर बारीक शृंगार सप्रेम और भक्ति भाव से चुना जाता है।”',
      kanhasWorldDesc: 'भक्ति के साकार रूप का अनुभव करें। ठाकुर जी की बाँसुरी की मनमोहक मुद्रा, मुकुट की अलौकिक आभा और पोशाक की बारीक नक्काशी—सब कुछ आपके प्रिय लाडले के पावन विग्रह के लिए तैयार किया गया है।',
      readOurStoryBtn: 'हमारा सेवा संकल्प पढ़ें',
      featuredTitle: 'विशेष शृंगार संग्रह',
      featuredSubtitle: 'माधव शृंगार के प्रामाणिक उत्पाद, आपके लाडले कान्हा के विग्रह हेतु तैयार।',
      noFeatured: 'वर्तमान में कोई उत्पाद उपलब्ध नहीं है।',
      viewEntireCollection: 'संपूर्ण संग्रह देखें',
      intricateBadge: 'नक्काशीदार',
      divineBadge: 'मधुर ध्वनि',
      blessedBadge: 'पावन आभूषण',
      sacredBadge: 'पवित्र आसन',
      completeShringar: 'संपूर्ण शृंगार सेट',
      completeSubtitle: '“आपके प्यारे कान्हा जी की नित्य सेवा के सभी शृंगार, एक ही स्थान पर।”',
      poshakBadge: 'पोशाक',
      mukutBadge: 'मुकुट',
      malaBadge: 'माला',
      bansuriBadge: 'बाँसुरी',
      kanganBadge: 'कंगन',
      exploreCombos: 'कॉम्बो सेट देखें',
      matchingSets: 'मैचिंग सेट!',
      sevaForOccasions: 'हर पावन पर्व एवं उत्सव हेतु सेवा',
      dailySeva: 'नित्य सेवा',
      janmashtami: 'जन्माष्टमी विशेष',
      festivals: 'पावन त्योहार',
      specialDarshan: 'विशेष दर्शन',
      explore: 'दर्शन करें',
      devotionalPromise: 'पवित्र सेवा संकल्प • हमारा भक्ति भाव',
      promiseTitle: 'ब्रज की पावन भूमि में निर्मित, सप्रेम सज्जित',
      promiseDesc: 'प्रत्येक पोशाक, मुकुट और शृंगार सामग्री ठीक उसी आत्मीय भाव से तैयार की जाती है, जैसे हम अपने घर के मंदिर में ठाकुर जी को लाड़ लड़ाते हैं — पूर्ण शुद्धता, कोमल वस्त्र और समर्पित सेवा के साथ।',
      pillar1Title: 'हस्तशिल्प ब्रज धाम कारीगरी',
      pillar1Desc: 'मथुरा-वृन्दावन के पीढ़ियों पुराने कारीगरों द्वारा शुद्ध ब्रोकेड, रेशम और मखमली अस्तर से सिली पोशाकें, जो ठाकुर जी के सुकोमल विग्रह को परम सुखद अनुभव कराती हैं।',
      pillar1Badge: '100% विग्रह-अनुकूल कोमल वस्त्र',
      pillar1Top: 'ब्रज धाम कारीगरी',
      pillar2Title: 'पवित्र सुरक्षित पैकेजिंग',
      pillar2Desc: 'पवित्र बहु-स्तरीय सुरक्षा और मजबूत बक्से में सुरक्षित पैक, ताकि बारीक मुकुट, मोती माला और बाँसुरी बिना किसी क्षति के आपके द्वार तक पहुंचे।',
      pillar2Badge: 'एक्सप्रेस एयर डिस्पैच एवं लाइव ट्रैकिंग',
      pillar2Top: 'अखिल भारतीय एक्सप्रेस',
      pillar3Title: 'विग्रह नाप संतुष्टि (0 से 6 नं.)',
      pillar3Desc: 'यदि आप अपने कान्हा जी के सही नाप (0 से 6 नंबर) को लेकर असमंजस में हैं, तो व्हाट्सऐप पर फोटो भेजकर सही मार्गदर्शन पाएं। आवश्यकता पड़ने पर 7 दिन में सहज बदलाव उपलब्ध।',
      pillar3Badge: '7 दिन आसान साइज़ बदलाव सुविधा',
      pillar3Top: '0 से 6 नं. विग्रह नाप',
      pillar4Title: 'प्रत्यक्ष भक्त सेवा सहायता',
      pillar4Desc: 'उत्सव अनुसार रंग मिलान, विशेष शृंगार या ऑर्डर सहायता के लिए साथी भक्तों से सीधे फोन (+91 70782 11946) या व्हाट्सऐप (+91 79821 60480) पर बात करें।',
      pillar4Badge: 'कॉल एवं व्हाट्सऐप (सुबह 10 से शाम 7)',
      pillar4Top: 'सच्चे भक्त, कोई रोबोट नहीं',
      momentsOfSeva: 'सेवा के पावन क्षण',
      momentsSubtitle: 'हमारे कारीगरों और कृष्ण भक्तों की भक्ति एवं आनंद की झलकियां।',
      lovedByDevotees: 'भक्तों का अनुभव एवं स्नेह',
      review1Text: 'पोशाक वास्तव में अलौकिक है। बारीक ज़री का काम अद्भुत है। मेरे कान्हा जी अति मनमोहक लग रहे हैं!',
      review1Name: 'राधिका एस.',
      review2Text: 'मैंने जन्माष्टमी के लिए संपूर्ण शृंगार सेट मंगाया था। पैकेजिंग बहुत सुंदर थी और गुणवत्ता सर्वश्रेष्ठ है।',
      review2Name: 'मीरा वी.',
      review3Text: 'अति सुंदर मुकुट और बाँसुरी। जैसी कल्पना की थी, बिल्कुल वैसा ही मिला। नित्य सेवा हेतु पुनः ऑर्डर करूंगी।',
      review3Name: 'अनन्या डी.',
      ctaTitle: 'घर लाएं',
      ctaHighlight: 'दिव्य आनंद एवं कृपा',
      ctaSubtitle: 'ठाकुर जी की सेवा के प्रत्येक क्षण को बनाएं अलौकिक एवं स्मरणीय।',
      ctaBtn: 'माधव शृंगार से जुड़ें',
    },
    product: {
      addToCart: 'सेवा टोकरी में जोड़ें',
      addedToCart: 'सेवा टोकरी में जोड़ा गया',
      buyNow: 'अभी ऑर्डर करें',
      selectSize: 'गोपाल जी का साइज़ चुनें (0–6 नं.)',
      sizeGuide: 'नाप एवं साइज़ चार्ट देखें',
      inclusiveOfTaxes: '(सभी कर सहित)',
      checkDelivery: 'पिनकोड द्वारा डिलीवरी एवं COD जांचें',
      enterPincode: '6-अंकों का पिनकोड दर्ज करें',
      checkBtn: 'जांचें',
      checking: 'जांच जारी है...',
      inStock: 'तत्काल सेवा हेतु उपलब्ध',
      outOfStock: 'वर्तमान में उपलब्ध नहीं',
      description: 'शृंगार विवरण',
      divineMatches: 'दिव्य मिलान सुझाव',
      cashOnDelivery: 'कैश ऑन डिलीवरी (सामान मिलने पर भुगतान)',
      available: 'उपलब्ध है',
      prepaidOnly: 'केवल ऑनलाइन भुगतान',
      estimatedDelivery: 'अनुमानित डिलीवरी तिथि:',
      deliveredTo: 'डिलीवरी गंतव्य:',
      freeDeliveryThreshold: '₹999+ पर मुफ़्त डिलीवरी',
      panIndiaExpress: 'अखिल भारतीय एक्सप्रेस',
      tapSizeToAdd: 'साइज़ चुनकर जोड़ें',
      sizesCount: 'साइज़ उपलब्ध',
    },
    cart: {
      yourCart: 'आपकी सेवा टोकरी',
      devotionalCart: 'आपकी भक्ति सेवा टोकरी',
      emptyCartTitle: 'आपकी सेवा टोकरी अभी खाली है',
      emptyCartDesc: 'ठाकुर जी की हस्तनिर्मित पोशाकों और सुंदर शृंगार का पावन संग्रह देखें।',
      exploreBtn: 'दिव्य संग्रह देखें',
      subtotal: 'सामग्री का कुल मूल्य',
      total: 'कुल सेवा राशि',
      qty: 'मात्रा',
      checkout: 'चेकआउट की ओर बढ़ें',
      reviewCart: 'टोकरी देखें एवं ऑर्डर करें',
      freeDeliveryEligible: 'मुफ़्त डिलीवरी हेतु पात्र',
    },
    footer: {
      brandDesc: 'श्री लड्डू गोपाल जी के प्रत्येक भक्त तक पवित्र शृंगार, प्रामाणिक वस्त्र और नित्य सेवा की सामग्री अटूट भक्ति भाव के साथ पहुंचाना ही हमारा पावन संकल्प है।',
      quickSevaLinks: 'महत्वपूर्ण सेवा लिंक्स',
      home: 'होम',
      helpFaq: 'सहायता केंद्र एवं अक्सर पूछे जाने वाले प्रश्न',
      sizeChartGuide: 'नाप तालिका मार्गदर्शिका (0-6 नं.)',
      fabricPromise: 'प्रामाणिक वस्त्र संकल्प',
      shippingDelivery: 'डिलीवरी एवं शिपिंग नियम',
      exchangeReturns: 'साइज़ बदलाव एवं वापसी नीति',
      devotionalCategories: 'शृंगार श्रेणियां',
      poshakCollection: 'पोशाक संग्रह',
      mukutPagdi: 'मुकुट एवं पगड़ी',
      motiMalaHaar: 'मोती माला एवं हार',
      goldenBansuri: 'सुंदर बाँसुरी',
      carvedSinghasan: 'नक्काशीदार सिंहासन',
      festiveComboSets: 'उत्सव कॉम्बो सेट',
      devoteeCareSupport: 'भक्त सेवा सहायता',
      directCalling: 'सीधे फोन पर बात करें',
      callingTime: '(प्रातः 10:00 से सायं 7:00)',
      whatsappSeva: 'व्हाट्सऐप सेवा एवं विशेष ऑर्डर',
      whatsappSub: 'भक्त सेवा से चैट करें',
      devotionalInquiries: 'भक्ति संबंधी पूछताछ एवं ऑर्डर',
      operatingHubs: 'आगरा एवं नोएडा से संचालित',
      operatingLocations: 'उत्तर प्रदेश / दिल्ली एनसीआर | पूरे भारत में तीव्र डिलीवरी',
      copyright: '© 2025 माधव शृंगार। श्री लड्डू गोपाल जी के चरणों में सप्रेम समर्पित। सर्वाधिकार सुरक्षित।',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा की शर्तें',
      authenticityPromise: 'प्रामाणिकता का वादा',
    },
  },
};
