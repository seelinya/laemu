'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Hero } from '@/components/sections/Hero'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

const products = [
  // LAEMU Eigenprodukte – Kleidung
  { id: 1, name: 'LAEMU Hoodie Schwarz', category: 'Kleidung', subcategory: 'LAEMU', price: 'CHF 79', badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80' },
  { id: 2, name: 'LAEMU T-Shirt Weiss', category: 'Kleidung', subcategory: 'LAEMU', price: 'CHF 39', badge: null, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
  { id: 3, name: 'LAEMU T-Shirt Schwarz', category: 'Kleidung', subcategory: 'LAEMU', price: 'CHF 39', badge: null, img: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=600&q=80' },
  { id: 4, name: 'LAEMU Beanie', category: 'Kleidung', subcategory: 'LAEMU', price: 'CHF 45', badge: null, img: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80' },
  // LAEMU Eigenprodukte – Accessoires
  { id: 5, name: 'LAEMU Cap', category: 'Accessoires', subcategory: 'LAEMU', price: 'CHF 49', badge: 'Neu', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80' },
  { id: 6, name: 'LAEMU Tote Bag', category: 'Accessoires', subcategory: 'LAEMU', price: 'CHF 29', badge: null, img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80' },
  { id: 7, name: 'LAEMU Sticker-Set', category: 'Accessoires', subcategory: 'LAEMU', price: 'CHF 12', badge: null, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { id: 8, name: 'LAEMU Poster A2', category: 'Accessoires', subcategory: 'LAEMU', price: 'CHF 25', badge: null, img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80' },
  // Formation Merch
  { id: 9, name: 'T-Shirt Hess-Rusch-Hegner', category: 'Kleidung', subcategory: 'Hess-Rusch-Hegner', price: 'CHF 35', badge: null, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
  { id: 10, name: 'Cap Rusch-Büeblä', category: 'Accessoires', subcategory: 'Rusch-Büeblä', price: 'CHF 40', badge: 'Neu', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80' },
  { id: 16, name: 'T-Shirt Bodäständix', category: 'Kleidung', subcategory: 'Bodäständix', price: 'CHF 35', badge: null, img: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=600&q=80' },
  { id: 17, name: 'Hoodie Bürgler-Gisler-Hess', category: 'Kleidung', subcategory: 'Bürgler-Gisler-Hess', price: 'CHF 69', badge: null, img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80' },
  // CDs
  { id: 11, name: 'LAEMU CD Sampler Vol. 1', category: 'CDs', subcategory: 'LAEMU', price: 'CHF 22', badge: 'Neu', img: 'https://images.unsplash.com/photo-1511715112108-9acc5b103dfc?w=600&q=80' },
  { id: 12, name: 'Hess-Rusch-Hegner – Live 2023', category: 'CDs', subcategory: 'Hess-Rusch-Hegner', price: 'CHF 25', badge: null, img: 'https://images.unsplash.com/photo-1511715112108-9acc5b103dfc?w=600&q=80' },
  { id: 13, name: 'Gasser-Hess-Zumstein – Bergsound', category: 'CDs', subcategory: 'Gasser-Hess-Zumstein', price: 'CHF 25', badge: null, img: 'https://images.unsplash.com/photo-1511715112108-9acc5b103dfc?w=600&q=80' },
  { id: 18, name: 'Echo vom Hindere-Litzä – Debut', category: 'CDs', subcategory: 'Echo vom Hindere-Litzä', price: 'CHF 25', badge: 'Neu', img: 'https://images.unsplash.com/photo-1511715112108-9acc5b103dfc?w=600&q=80' },
  // Spiele
  { id: 14, name: 'Ländlermusik-Quiz', category: 'Spiele', subcategory: 'LAEMU', price: 'CHF 34', badge: 'Neu', img: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&q=80' },
  { id: 15, name: 'Volksmusik-Memo', category: 'Spiele', subcategory: 'LAEMU', price: 'CHF 24', badge: null, img: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&q=80' },
  // Instrumente & Zubehör
  { id: 19, name: 'Chlefeli-Set Professionell', category: 'Instrumente', subcategory: 'LAEMU', price: 'CHF 28', badge: 'Neu', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=80' },
  { id: 20, name: 'Holzlöffel-Set (4-teilig)', category: 'Instrumente', subcategory: 'LAEMU', price: 'CHF 18', badge: null, img: 'https://images.unsplash.com/photo-1519924879-7d66f81399fa?w=600&q=80' },
  { id: 21, name: 'Notenhefter A4 (LAEMU)', category: 'Instrumente', subcategory: 'LAEMU', price: 'CHF 15', badge: null, img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=80' },
]

const categories = ['Alle', 'Kleidung', 'Accessoires', 'CDs', 'Spiele', 'Instrumente']
const brands = [
  'Alle Marken',
  'LAEMU',
  'Rusch-Büeblä',
  'Hess-Rusch-Hegner',
  'Gasser-Hess-Zumstein',
  'Bürgler-Gisler-Hess',
  'Echo vom Hindere-Litzä',
  'Bodäständix',
  'LT Widertäktig',
  'Ländlertrio Augenschmaus',
]

const reviews = [
  { name: 'Sabrina K.', location: 'Luzern', rating: 5, text: 'Der Hoodie ist wunderschön und die Qualität ist top. Trage ihn bei jedem Konzert!' },
  { name: 'Hanspeter M.', location: 'Zug', rating: 5, text: 'Endlich Merch für Ländlermusik-Fans. Das T-Shirt bekomme ich immer wieder kommentiert.' },
  { name: 'Vreni L.', location: 'Appenzell', rating: 5, text: 'Schnelle Lieferung, tolle Qualität. Der Tote Bag ist mein ständiger Begleiter.' },
]

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('Alle')
  const [activeBrand, setActiveBrand] = useState('Alle Marken')
  const [addedToCart, setAddedToCart] = useState<number | null>(null)

  const filtered = products.filter((p) => {
    const catMatch = activeCategory === 'Alle' || p.category === activeCategory
    const brandMatch = activeBrand === 'Alle Marken' || p.subcategory === activeBrand
    return catMatch && brandMatch
  })

  const handleAddToCart = (id: number) => {
    setAddedToCart(id)
    setTimeout(() => setAddedToCart(null), 1500)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-dark">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
            alt="LAEMU Shop"
            fill
            className="object-cover opacity-30"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.span variants={fadeUp} className="label text-accent-gold">LAEMU Shop</motion.span>
            <motion.h1 variants={fadeUp} className="font-heading text-6xl md:text-8xl font-bold text-white leading-tight mt-4 mb-6">
              Trage die Bewegung.
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans text-xl text-white/60 leading-relaxed">
              LAEMU Lifestyle — Swiss Folk Culture
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="py-8 bg-surface border-b border-border sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-sm px-5 py-2.5 transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-accent-gold text-white'
                    : 'bg-background text-text-secondary hover:bg-border'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto font-sans text-sm text-text-secondary whitespace-nowrap">
              {filtered.length} Produkte
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
            <span className="font-sans text-xs text-text-secondary whitespace-nowrap">Marke:</span>
            <div className="relative">
              <select
                value={activeBrand}
                onChange={(e) => setActiveBrand(e.target.value)}
                className="appearance-none border border-border bg-background font-sans text-sm text-dark px-4 py-2 pr-8 focus:outline-none focus:border-dark cursor-pointer hover:border-dark transition-colors"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <Card hover padding="none" className="overflow-hidden group">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-accent-gold text-white text-xs px-2 py-1 font-sans">
                        {product.badge}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-sans font-medium text-sm mb-1 group-hover:text-accent-gold transition-colors">{product.name}</h4>
                    <p className="font-sans text-xs text-text-secondary mb-3">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-accent-gold">{product.price}</span>
                      <motion.button
                        onClick={() => handleAddToCart(product.id)}
                        className={`font-sans text-xs px-3 py-1.5 transition-all ${
                          addedToCart === product.id
                            ? 'bg-muted-green text-white'
                            : 'bg-dark text-white hover:bg-accent-gold'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        {addedToCart === product.id ? '✓ Hinzugefügt' : 'In den Warenkorb'}
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Bewertungen</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-4">Was Kunden sagen.</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card padding="lg">
                  <div className="flex mb-4">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <span key={j} className="text-accent-gold">★</span>
                    ))}
                  </div>
                  <p className="font-sans text-text-secondary text-sm leading-relaxed mb-4 italic">"{r.text}"</p>
                  <div>
                    <p className="font-heading font-bold text-sm">{r.name}</p>
                    <p className="font-sans text-xs text-text-secondary">{r.location}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* SELL ON LAEMU CTA */}
      <section className="py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Section>
              <motion.span variants={fadeUp} className="label text-accent-gold">Für Formationen & Künstler</motion.span>
              <motion.h2 variants={fadeUp} className="heading-lg text-white mt-3 mb-6">
                Willst du deine Produkte über LAEMU verkaufen?
              </motion.h2>
              <motion.p variants={fadeUp} className="body-lg text-white/60 mb-8">
                LAEMU bietet Formationen und Künstlern die Möglichkeit, ihre Merchandise-Produkte
                über unsere Plattform zu vertreiben. Einfach, fair und mit direktem Kontakt zu
                deinen Fans.
              </motion.p>
              <motion.div variants={fadeUp} className="space-y-4">
                {[
                  '✓ Kein Aufwand für Fulfillment',
                  '✓ Faire Umsatzbeteiligung',
                  '✓ Direkter Kontakt zu Fans',
                  '✓ Einfache Produkt-Verwaltung',
                ].map((item) => (
                  <p key={item} className="font-sans text-white/70 text-sm">{item}</p>
                ))}
              </motion.div>
            </Section>
            <Section>
              <motion.div variants={fadeUp} className="bg-surface p-8">
                <h3 className="font-heading text-xl font-bold mb-6">Als Anbieter registrieren</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label text-text-secondary block mb-2">Name / Formation</label>
                    <input type="text" className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-background" placeholder="Dein Name oder Formation" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-2">E-Mail</label>
                    <input type="email" className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-background" placeholder="deine@email.ch" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-2">Beschreibe deine Produkte</label>
                    <textarea rows={3} className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-background resize-none" placeholder="Was möchtest du verkaufen?" />
                  </div>
                  <Button variant="primary" size="md" className="w-full">
                    Anfrage senden
                  </Button>
                </div>
              </motion.div>
            </Section>
          </div>
        </div>
      </section>
    </>
  )
}
