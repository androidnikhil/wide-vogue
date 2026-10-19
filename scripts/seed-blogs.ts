import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.blogPost.count();
  if (count > 0) {
    console.log(`Already have ${count} blog posts in database.`);
    return;
  }

  const posts = [
    {
      title: 'Complete Seva Guide for Shri Laddu Gopal Ji: Daily Morning to Shayan',
      slug: 'complete-seva-guide-laddu-gopal-morning-to-shayan',
      category: 'Devotional Seva',
      featuredImage: '/images/devotional/hero_krishna.webp',
      excerpt:
        'Discover the traditional daily seva rituals for Thakur Ji. Learn how to perform Snana, Panchamrit abhishek, shringaar, bhog offering, and peaceful Shayan seva with devotion.',
      content: `## The Essence of Laddu Gopal Seva (Vatsalya Bhava)
In Sanatana Dharma, serving Shri Laddu Gopal Ji is performed in the mood of maternal and affectionate devotion (Vatsalya Bhava). Thakur Ji is not considered merely as a vigraha of stone or metal, but as the divine infant child of the household.

> "Seva is not a ritual duty; it is an offering of unconditional love that purifies the heart and invites divine grace into your home."

### 1. Jagran (Waking Thakur Ji)
In the early morning during Brahma Muhurta, gently wake Laddu Gopal Ji by softly clapping your hands or ringing a small bell. Whisper affectionate prayers:
• "Uttishta Uttishta Govinda Uttishta Garudadhwaja"
• Offer a warm cup of pure water or boiled milk with saffron and tulsi leaves.

### 2. Snana & Abhishek (Sacred Bathing)
Gently remove Thakur Ji's night poshak and seat Him on His snana patra.
• Use lukewarm water mixed with fragrant chandan (sandalwood paste), rose water, or gangajal.
• On festival days or Ekadashi, perform a panchamrit snana (milk, curd, honey, ghee, and sugar).
• Softly dry Thakur Ji using a clean, separate soft cotton cloth reserved exclusively for Him.

### 3. Shringaar (Divine Adornment)
After the holy bath, adorn your deity with seasonal poshak:
• Choose soft pure cottons in summer to keep Him cool, and velvet or woollen poshak in winter.
• Crown Thakur Ji with a Mor Pankh Mukut (peacock feather crown).
• Place His beloved Bansuri (flute) in His lotus hands and adorn His neck with moti or tulsi mala.
• Apply fragrant gopi chandan tilak on His forehead.

### 4. Rajbhog & Arati
Offer fresh satvik bhog prepared without onion, garlic, or artificial ingredients. Always place a fresh Tulsi leaf on every offering.
• Perform Mangala or Rajbhog Arati with a single ghee lamp, incense, and fresh fragrant flowers.
• Sing the Mahamantra: Hare Krishna Hare Krishna, Krishna Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Rama.

### 5. Shayan Seva (Night Rest)
In the evening after Sandhya arati and milk offering, gently change Thakur Ji into a comfortable, lightweight night poshak.
• Remove His mukut and heavy jewelry so He may rest peacefully.
• Place Him on a soft bed or singhasan with a warm blanket in winter, massage His lotus feet with devotion, and chant gentle lullabies.`,
      tags: ['Laddu Gopal Seva', 'Daily Rituals', 'Krishna Bhakti', 'Braj Seva'],
      authorName: 'Madhav Shringaar Seva Team',
      isPublished: true,
      readingTime: 4,
      metaTitle: 'Complete Seva Guide for Shri Laddu Gopal Ji | Madhav Shringaar',
      metaDescription:
        'A comprehensive guide to daily Laddu Gopal Ji seva from morning waking and abhishek to divine shringaar, bhog, and night shayan seva.',
    },
    {
      title: 'How to Choose the Right Poshak Size for Your Kanha Ji (Size 0 to 6 Guide)',
      slug: 'how-to-choose-laddu-gopal-poshak-size-guide',
      category: 'Poshak & Shringaar',
      featuredImage: '/images/devotional/poshak.webp',
      excerpt:
        'Confused about deity garment sizes? Learn how to accurately measure your Laddu Gopal Ji from head to toe and choose the perfect poshak diameter from Size 00 to Size 6.',
      content: `## Finding the Perfect Fit for Your Beloved Thakur Ji
One of the most common questions devotees ask is: *"What size poshak does my Laddu Gopal Ji wear?"* Just like children, deity vigrahas vary in posture, crown height, and arm span. Choosing the proper dress ensures your Kanha Ji sits comfortably and elegantly without fabric bunching or dragging.

> "A well-fitted poshak allows every intricate detail of Thakur Ji's lotus features and divine posture to shine with royal splendour."

### Standard Poshak Sizing Chart (Size 0 to 6)
Here is the recommended measurement guideline:

• **Size 00 (Micro / Newborn):** Vigraha height up to 1.5 inches. Poshak diameter is approximately 3.5 inches. Ideal for tiny brass vigrahas.
• **Size 0 (Newborn Infant):** Vigraha height 1.5 to 2.25 inches. Poshak skirt diameter: 4.5 inches.
• **Size 1 (Toddler):** Vigraha height 2.5 to 3 inches. Poshak skirt diameter: 5.5 inches.
• **Size 2 (Small Child):** Vigraha height 3 to 3.5 inches. Poshak skirt diameter: 6.5 to 7 inches.
• **Size 3 (Medium):** Vigraha height 3.5 to 4 inches. Poshak skirt diameter: 8 inches.
• **Size 4 (Classic Large):** Vigraha height 4 to 4.75 inches. Poshak skirt diameter: 9 to 10 inches.
• **Size 5 (Grand Vigraha):** Vigraha height 5 to 5.5 inches. Poshak skirt diameter: 11 to 12 inches.
• **Size 6 (Temple Grandeur):** Vigraha height 5.5 to 6.5 inches. Poshak skirt diameter: 13 to 14 inches.

### Step-by-Step Measuring Method
1. **Height Measurement:** Take a soft measuring tape and measure from the base of Thakur Ji's seat to the top of His head (excluding the hair bun or crown).
2. **Chest / Arm Width:** Check the distance between His outstretched lotus hands.
3. **Flared Gher (Skirt Diameter):** Measure an existing poshak that fits your Laddu Gopal Ji perfectly from one outer circular edge to the opposite edge across the center.

### Fabric Care & Storage Tips
• Never fold heavy zari or stone-studded poshak tightly down the center; gently roll them or lay them flat between butter paper.
• Protect from temple moisture by keeping seasonal dresses in breathable muslin bags.`,
      tags: ['Size Guide', 'Poshak Sizing', 'Laddu Gopal Dress', 'Measurement Guide'],
      authorName: 'Madhav Shringaar Seva Team',
      isPublished: true,
      readingTime: 3,
      metaTitle: 'How to Choose Poshak Size (0 to 6 Guide) | Madhav Shringaar',
      metaDescription:
        'Comprehensive size guide for Laddu Gopal dresses. Learn how to measure vigraha height and gher diameter to pick the ideal poshak size from 00 to 6.',
    },
    {
      title: 'The Spiritual Significance of Mor Pankh Mukut & Bansuri in Krishna Shringaar',
      slug: 'spiritual-significance-mor-pankh-mukut-bansuri',
      category: 'Vrindavan Katha',
      featuredImage: '/images/devotional/complete_shringar.webp',
      excerpt:
        'Why does Shri Krishna always adorn a peacock feather on His crown and carry a golden flute? Explore the deep Braj katha and mystical meaning of Thakur Ji’s divine ornaments.',
      content: `## The Mystical Adornments of Banke Bihari
Every sacred ornament worn by Shri Krishna carries a profound spiritual meaning. From the iridescent peacock feather (Mor Pankh) to the hollow bamboo flute (Bansuri), these symbols are not mere decorations—they are eternal emblems of pure devotion, humility, and divine love.

> "The flute has no melody of its own; it becomes musical only when it empties itself completely and allows the Divine breath to flow through it."

### The Story of the Peacock's Offering
According to Braj Katha, when Shri Krishna played His flute in the lush groves of Govardhan, the peacocks of Vrindavan danced in ecstasy under the sweet melody. Overcome with gratitude and bliss, the king of peacocks bowed before Kanha and shed his most lustrous feathers, praying:
*"O Lord of the Universe, we have nothing of wealth to offer You. Please accept our feathers as an offering of our eternal surrender."*

Touching the peacock's humility, Krishna affectionately placed the peacock feather upon His crown (Chudamani), declaring that wherever He is worshipped, the Mor Pankh will forever crown His head.

### Lessons from the Holy Bansuri (Flute)
The flute represents the highest spiritual state of a devotee (Sharanagati):
1. **Emptiness of Ego:** The bamboo flute is hollow inside. To be used as Thakur Ji's instrument, a devotee must empty the heart of pride, anger, and ego.
2. **Straightforwardness:** The flute is straight and uncrooked, symbolizing purity of mind and truthfulness in devotional service.
3. **Patience under Channelling:** The flute endures cuts and holes to produce sweet melodies. Similarly, through challenges, the devotee's devotion becomes refined and melodious.

### How to Adorn Thakur Ji with Mukut and Bansuri
• Always place the Mor Pankh tilted slightly to the left side of the mukut, matching traditional Vrindavan darshan posture.
• Fasten the bansuri gently between Thakur Ji's fingers with pure yellow or red silk thread so it remains secure.
• Match the stone colors of the mukut with His necklace and poshak borders for a harmonious temple darshan.`,
      tags: ['Krishna Katha', 'Mor Pankh', 'Bansuri', 'Vrindavan Lore'],
      authorName: 'Madhav Shringaar Seva Team',
      isPublished: true,
      readingTime: 4,
      metaTitle: 'Spiritual Meaning of Mor Pankh Mukut & Bansuri | Madhav Shringaar',
      metaDescription:
        'Discover the mystical story behind Shri Krishna’s peacock feather crown (Mor Pankh) and holy flute (Bansuri) in Braj devotional tradition.',
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.create({ data: post });
    console.log(`Created: ${post.title}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
