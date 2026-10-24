import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Size Chart Guide (0-6 No.) | Shri Laddu Gopal Ji Poshak & Mukut Sizing',
  description: 'Complete sizing guide for Shri Laddu Gopal Ji poshak, mukut, bansuri, and singhasan. Measure your idol height accurately for perfect devotional seva. Fast delivery in Agra, Noida & all India.',
  keywords: [
    'Laddu Gopal size chart',
    'Laddu Gopal dress size guide',
    '0 number Laddu Gopal poshak size',
    '1 number to 6 number Laddu Gopal size in inches',
    'Laddu Gopal mukut size chart',
    'Kanha ji dress measurement Agra Noida',
  ],
  alternates: {
    canonical: '/size-chart',
  },
};

const sizeData = [
  {
    size: '0 No.',
    name: 'Mini / Chhota Bal Gopal',
    heightInches: '1.5" - 2.0"',
    heightCm: '3.8 - 5.0 cm',
    poshakDiameter: '4.0" - 5.0"',
    poshakCm: '10 - 13 cm',
    mukutSize: '0 No. (Smallest)',
    bansuriSize: '1.5" - 2.0"',
    badge: 'Popular',
  },
  {
    size: '1 No.',
    name: '1 Number Laddu Gopal',
    heightInches: '2.0" - 2.5"',
    heightCm: '5.0 - 6.5 cm',
    poshakDiameter: '5.0" - 6.0"',
    poshakCm: '13 - 15 cm',
    mukutSize: '1 No.',
    bansuriSize: '2.0" - 2.5"',
    badge: null,
  },
  {
    size: '2 No.',
    name: '2 Number Laddu Gopal',
    heightInches: '2.5" - 3.2"',
    heightCm: '6.5 - 8.0 cm',
    poshakDiameter: '6.0" - 7.0"',
    poshakCm: '15 - 18 cm',
    mukutSize: '2 No.',
    bansuriSize: '2.5" - 3.0"',
    badge: 'Most Popular',
  },
  {
    size: '3 No.',
    name: '3 Number Laddu Gopal',
    heightInches: '3.2" - 4.0"',
    heightCm: '8.0 - 10.0 cm',
    poshakDiameter: '7.0" - 8.5"',
    poshakCm: '18 - 22 cm',
    mukutSize: '3 No.',
    bansuriSize: '3.0" - 3.5"',
    badge: 'Most Popular',
  },
  {
    size: '4 No.',
    name: '4 Number Laddu Gopal',
    heightInches: '4.0" - 4.8"',
    heightCm: '10.0 - 12.0 cm',
    poshakDiameter: '8.5" - 10.0"',
    poshakCm: '22 - 25 cm',
    mukutSize: '4 No.',
    bansuriSize: '3.5" - 4.0"',
    badge: 'Popular',
  },
  {
    size: '5 No.',
    name: '5 Number Laddu Gopal',
    heightInches: '4.8" - 5.8"',
    heightCm: '12.0 - 15.0 cm',
    poshakDiameter: '10.0" - 12.0"',
    poshakCm: '25 - 30 cm',
    mukutSize: '5 No.',
    bansuriSize: '4.0" - 5.0"',
    badge: null,
  },
  {
    size: '6 No.',
    name: '6 Number Laddu Gopal',
    heightInches: '5.8" - 7.0"',
    heightCm: '15.0 - 18.0 cm',
    poshakDiameter: '12.0" - 14.0"',
    poshakCm: '30 - 35 cm',
    mukutSize: '6 No.',
    bansuriSize: '5.0" - 6.0"',
    badge: null,
  },
  {
    size: '7+ No.',
    name: 'Large / Mandir Seva',
    heightInches: '7.0"+',
    heightCm: '18.0 cm+',
    poshakDiameter: '14.0" - 18.0"',
    poshakCm: '35 - 45 cm',
    mukutSize: '7+ No.',
    bansuriSize: '6.0"+',
    badge: 'Mandir Special',
  },
];

export default function SizeChartPage() {
  return (
    <div className="bg-[#FBF7EE] min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#176B55]/10 border border-[#176B55]/20 text-[#176B55] text-xs font-bold tracking-wider">
            <span>॥ Radhe Radhe ॥</span>
            <span className="text-[#C88A20]">•</span>
            <span>Accurate Seva Measurements</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-[#003020] tracking-tight">
            Laddu Gopal Ji Size Chart
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Choose the perfect poshak, mukut, and flute for your beloved Kanha Ji with our verified sizing reference guide (0 to 6 No.).
          </p>
        </div>

        {/* Master Sizing Table */}
        <div className="bg-white rounded-2xl border border-[#C88A20]/25 shadow-md overflow-hidden">
          <div className="p-5 md:p-6 bg-gradient-to-r from-[#003020] via-[#176B55] to-[#003020] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E6C16A]">straighten</span>
                Official Sizing Dimensions (0 - 6 No.)
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                Standard Vrindavan &amp; Mathura artisanal measurement guide
              </p>
            </div>
            <Link
              href="/search?category=Poshak"
              className="px-4 py-1.5 text-xs font-bold gold-gradient-btn text-primary-container rounded-lg shadow hover:brightness-105 transition-all"
            >
              Browse All Poshaks
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#F7F3EA] border-b border-outline-variant/20 text-[#003020] font-bold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 md:px-6">Size No.</th>
                  <th className="py-3.5 px-4">Idol Height (Inches / CM)</th>
                  <th className="py-3.5 px-4">Poshak Ghera (Diameter)</th>
                  <th className="py-3.5 px-4">Mukut Size</th>
                  <th className="py-3.5 px-4">Flute (Bansuri)</th>
                  <th className="py-3.5 px-4 text-center">Shop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {sizeData.map((item, idx) => (
                  <tr
                    key={item.size}
                    className={`hover:bg-[#FBF7EE] transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#FCF9F2]'
                    }`}
                  >
                    <td className="py-4 px-4 md:px-6 font-bold text-primary flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#176B55]/10 text-[#176B55] flex items-center justify-center font-bold text-xs">
                        {item.size.split(' ')[0]}
                      </span>
                      <div>
                        <div>{item.size}</div>
                        {item.badge && (
                          <span className="inline-block text-[10px] font-bold bg-[#E6C16A]/30 text-[#825500] px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{item.heightInches}</span>
                      <span className="block text-xs text-gray-500">{item.heightCm}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#176B55]">{item.poshakDiameter}</span>
                      <span className="block text-xs text-gray-500">{item.poshakCm}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium">
                      {item.mukutSize}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium">
                      {item.bansuriSize}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 px-3 border-[#C88A20]/40 text-[#825500] hover:bg-[#C88A20] hover:text-white transition-all font-semibold"
                      >
                        <Link href={`/search?size=${encodeURIComponent(item.size)}`}>
                          View {item.size}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Steps: How to Measure */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-serif text-[#003020]">
              How to Measure Your Laddu Gopal Ji
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Follow these simple steps before choosing dresses or ornaments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#176B55]/10 text-[#176B55] flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-primary text-base">Measure Idol Height</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gently use a flexible measuring tape or thread from the lotus feet up to the crown/forehead of Shri Laddu Gopal Ji while seated. Match this height with the table above.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C88A20]/10 text-[#C88A20] flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-primary text-base">Check Poshak Ghera (Diameter)</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Measure any existing poshak from one edge of the circular skirt to the opposite edge across the center. This gives you the ideal diameter (घेरा).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#176B55]/10 text-[#176B55] flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-primary text-base">Select Mukut &amp; Pagdi</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mukut numbers generally correspond directly to the idol size number. If your idol has custom hair/kesh attached, consider choosing one size larger for comfort.
              </p>
            </div>
          </div>
        </div>

        {/* Devotional Advice Callout */}
        <div className="bg-gradient-to-r from-[#FDF9F0] via-[#FAF3E0] to-[#FDF9F0] p-6 md:p-8 rounded-2xl border border-[#C88A20]/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-bold font-serif text-[#003020] flex items-center gap-2">
              <span>🦚</span> Still Unsure About Your Kanha Ji&apos;s Size?
            </h3>
            <p className="text-xs md:text-sm text-gray-600 max-w-xl leading-relaxed">
              Our devotional devotee care team is happy to assist you via WhatsApp. Send us a photo of your Laddu Gopal Ji next to a ruler, and we will guide you to the exact match!
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href="https://wa.me/918755518488?text=Radhe%20Radhe!%20Need%20help%20with%20Laddu%20Gopal%20Ji%20size"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 gold-gradient-btn text-primary-container font-bold text-xs rounded-xl shadow hover:brightness-105 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              WhatsApp Sizing Help
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
