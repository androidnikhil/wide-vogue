export type Language = 'en' | 'hi';

export interface Translations {
  common: {
    freeShippingBanner: string;
    radheRadhe: string;
    trustedDevotees: string;
    home: string;
    poshak: string;
    mukut: string;
    bansuri: string;
    shringaar: string;
    singhasan: string;
    cart: string;
    wishlist: string;
    myAccount: string;
    orders: string;
    trackOrder: string;
    signIn: string;
    signOut: string;
    searchPlaceholder: string;
    quickLinks: string;
    devoteeCare: string;
    copyright: string;
    hub: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    explorePoshak: string;
    curatedSeva: string;
    discoverShringar: string;
    whyDevoteesChooseUs: string;
    devotionalPromise: string;
    promiseTitle: string;
    promiseDesc: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar1Badge: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar2Badge: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar3Badge: string;
    pillar4Title: string;
    pillar4Desc: string;
    pillar4Badge: string;
    momentsOfSeva: string;
    momentsSubtitle: string;
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
  order: {
    orderStatus: string;
    orderId: string;
    liveTracking: string;
    openBoxTitle: string;
    openBoxDesc: string;
    needAssistance: string;
    callSupport: string;
    trackAnother: string;
    invoice: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      freeShippingBanner: '🚚 Free Shipping above ₹999 across India',
      radheRadhe: '॥ Radhe Radhe ॥',
      trustedDevotees: 'Trusted by 10,000+ Happy Devotees',
      home: 'Home',
      poshak: 'Poshak',
      mukut: 'Mukut & Pagdi',
      bansuri: 'Bansuri',
      shringaar: 'Complete Shringaar',
      singhasan: 'Carved Singhasan',
      cart: 'Cart',
      wishlist: 'Wishlist',
      myAccount: 'My Account',
      orders: 'Orders & Tracking',
      trackOrder: 'Track Order',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      searchPlaceholder: 'Search divine poshak, mukut, bansuri for Kanha...',
      quickLinks: 'Quick Seva Links',
      devoteeCare: 'Devotee Care Support',
      copyright: '© 2025 Madhav Shringaar. Dedicated with utmost reverent seva to Shri Laddu Gopal Ji. All Rights Reserved.',
      hub: 'Hub',
    },
    home: {
      heroTitle: 'Sacred Adornments for Shri Laddu Gopal Ji',
      heroSubtitle: 'Hand-tailored brocade poshak, zardozi mukut, and revered seva essentials blessed with the timeless devotion of Mathura & Vrindavan.',
      explorePoshak: 'Explore Poshak Seva',
      curatedSeva: 'Curated Seva',
      discoverShringar: 'Discover Shringar',
      whyDevoteesChooseUs: 'Why Devotees Choose Us',
      devotionalPromise: 'पवित्र सेवा संकल्प • Our Devotional Promise',
      promiseTitle: 'Handcrafted in Braj, Adorned with Love',
      promiseDesc: 'Every poshak, mukut, and shringaar essential is crafted just as we would prepare it for Thakur Ji in our own home temple — with pure devotion, gentle deity-safe fabrics, and attentive devotee care.',
      pillar1Title: 'Authentic Braj Artistry',
      pillar1Desc: 'Hand-tailored by generational Mathura & Vrindavan karigars using pure brocades, soft silks, and velvet with feather-soft linings that gently caress Thakur Ji.',
      pillar1Badge: '100% Deity-Safe, Pure Fabrics',
      pillar2Title: 'Pavitra Safe Packaging',
      pillar2Desc: 'Sealed in clean, sacred multi-layer protective packaging and sturdy gift boxes so intricate crowns, delicate pearls, and flutes arrive spotless and unbent.',
      pillar2Badge: 'Air Dispatch with Live Tracking',
      pillar3Title: 'Size Fit Guarantee',
      pillar3Desc: 'Unsure whether size 2 or 3 suits your Laddu Gopal Ji? Share a photo on WhatsApp for instant sizing guidance, with prompt 7-day hassle-free exchange if needed.',
      pillar3Badge: '7-Day Easy Exchange Policy',
      pillar4Title: 'Direct Devotee Seva',
      pillar4Desc: 'Speak directly with fellow bhakts on call (+91 70782 11946) or WhatsApp (+91 79821 60480) for festival color combinations, custom requests, and order assistance.',
      pillar4Badge: 'Call & WhatsApp 10 AM – 7 PM',
      momentsOfSeva: 'Moments of Seva',
      momentsSubtitle: 'Glimpses of devotion from our artisans and devotees.',
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
    order: {
      orderStatus: 'Sacred Order Status',
      orderId: 'Order ID',
      liveTracking: 'Live Courier Track',
      openBoxTitle: 'Open Box Verification',
      openBoxDesc: 'Verify sacred poshak & shringaar items before sharing delivery OTP.',
      needAssistance: 'Need seva assistance?',
      callSupport: 'Call Devotee Care',
      trackAnother: 'Track Another Order',
      invoice: 'Download Sacred Invoice',
    },
  },
  hi: {
    common: {
      freeShippingBanner: '🚚 पूरे भारत में ₹999 से अधिक पर मुफ़्त डिलीवरी',
      radheRadhe: '॥ राधे राधे ॥',
      trustedDevotees: '10,000+ संतुष्ट कृष्ण भक्तों का अटूट विश्वास',
      home: 'मुख्य पृष्ठ',
      poshak: 'लड्डू गोपाल पोशाक',
      mukut: 'मुकुट एवं पगड़ी',
      bansuri: 'सुंदर बाँसुरी',
      shringaar: 'संपूर्ण शृंगार सेट',
      singhasan: 'नक्काशीदार सिंहासन',
      cart: 'सेवा टोकरी',
      wishlist: 'पसंदीदा शृंगार',
      myAccount: 'मेरा खाता',
      orders: 'ऑर्डर एवं ट्रैकिंग',
      trackOrder: 'ऑर्डर ट्रैक करें',
      signIn: 'लॉगिन करें',
      signOut: 'लॉग आउट',
      searchPlaceholder: 'कान्हा जी की पोशाक, मुकुट, बाँसुरी खोजें...',
      quickLinks: 'महत्वपूर्ण सेवा लिंक्स',
      devoteeCare: 'भक्त सेवा सहायता',
      copyright: '© 2025 माधव शृंगार। श्री लड्डू गोपाल जी के चरणों में सप्रेम समर्पित। सर्वाधिकार सुरक्षित।',
      hub: 'हब',
    },
    home: {
      heroTitle: 'श्री लड्डू गोपाल जी के पावन शृंगार एवं वस्त्र',
      heroSubtitle: 'मथुरा एवं वृन्दावन की पावन भक्ति से निर्मित हस्तशिल्प ब्रोकेड पोशाकें, ज़री मुकुट और ठाकुर जी की नित्य सेवा के पवित्र आभूषण।',
      explorePoshak: 'पोशाक सेवा दर्शन',
      curatedSeva: 'विशिष्ट सेवा संग्रह',
      discoverShringar: 'दिव्य शृंगार दर्शन',
      whyDevoteesChooseUs: 'भक्त माधव शृंगार क्यों चुनते हैं',
      devotionalPromise: 'पवित्र सेवा संकल्प • हमारा भक्ति भाव',
      promiseTitle: 'ब्रज की पावन भूमि में निर्मित, सप्रेम सज्जित',
      promiseDesc: 'प्रत्येक पोशाक, मुकुट और शृंगार सामग्री ठीक उसी आत्मीय भाव से तैयार की जाती है, जैसे हम अपने घर के मंदिर में ठाकुर जी को लाड़ लड़ाते हैं — पूर्ण शुद्धता, कोमल वस्त्र और समर्पित सेवा के साथ।',
      pillar1Title: 'हस्तशिल्प ब्रज धाम कारीगरी',
      pillar1Desc: 'मथुरा-वृन्दावन के पीढ़ियों पुराने कारीगरों द्वारा शुद्ध ब्रोकेड, रेशम और मखमली अस्तर से सिली पोशाकें, जो ठाकुर जी के सुकोमल विग्रह को परम सुखद अनुभव कराती हैं।',
      pillar1Badge: '100% विग्रह-अनुकूल कोमल वस्त्र',
      pillar2Title: 'पवित्र सुरक्षित पैकेजिंग',
      pillar2Desc: 'पवित्र बहु-स्तरीय सुरक्षा और मजबूत बक्से में सुरक्षित पैक, ताकि बारीक मुकुट, मोती माला और बाँसुरी बिना किसी क्षति के आपके द्वार तक पहुंचे।',
      pillar2Badge: 'एक्सप्रेस एयर डिस्पैच एवं लाइव ट्रैकिंग',
      pillar3Title: 'विग्रह नाप संतुष्टि (0 से 6 नं.)',
      pillar3Desc: 'यदि आप अपने कान्हा जी के सही नाप (0 से 6 नंबर) को लेकर असमंजस में हैं, तो व्हाट्सऐप पर फोटो भेजकर सही मार्गदर्शन पाएं। आवश्यकता पड़ने पर 7 दिन में सहज बदलाव उपलब्ध।',
      pillar3Badge: '7 दिन आसान साइज़ बदलाव सुविधा',
      pillar4Title: 'प्रत्यक्ष भक्त सेवा सहायता',
      pillar4Desc: 'उत्सव अनुसार रंग मिलान, विशेष शृंगार या ऑर्डर सहायता के लिए साथी भक्तों से सीधे फोन (+91 70782 11946) या व्हाट्सऐप (+91 79821 60480) पर बात करें।',
      pillar4Badge: 'कॉल एवं व्हाट्सऐप (सुबह 10 से शाम 7)',
      momentsOfSeva: 'सेवा के पावन क्षण',
      momentsSubtitle: 'हमारे कारीगरों और कृष्ण भक्तों की भक्ति एवं आनंद की झलकियां।',
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
    order: {
      orderStatus: 'ऑर्डर स्थिति',
      orderId: 'ऑर्डर संख्या',
      liveTracking: 'कूरियर लाइव ट्रैकिंग',
      openBoxTitle: 'ओपन बॉक्स सत्यापन',
      openBoxDesc: 'डिलीवरी ओटीपी साझा करने से पहले पवित्र पोशाक एवं शृंगार की जांच करें।',
      needAssistance: 'कोई सहायता चाहिए?',
      callSupport: 'भक्त सेवा से बात करें',
      trackAnother: 'दूसरा ऑर्डर ट्रैक करें',
      invoice: 'पवित्र इनवॉइस डाउनलोड करें',
    },
  },
};
