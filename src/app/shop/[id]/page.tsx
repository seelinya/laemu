'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'

const products = [
  { id: 1, name: 'LAEMU Hoodie Schwarz', category: 'Kleidung', subcategory: 'LAEMU', price: 'CHF 79', badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80', desc: 'Unser meistverkaufter Hoodie in tiefem Schwarz. Hergestellt aus 100% organischer Baumwolle, mit gesticktem LAEMU-Logo auf der Brust. Bequem, langlebig und perfekt für jeden Auftritt.' },
  { id: 2, name: 'LAEMU T-Shirt Weiss', category: 'Kleidung', subcategory: 'LAEMU', price: 'CHF 39', badge: null, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', desc: 'Klassisches LAEMU T-Shirt in frischem Weiss. Aus weichem Baumwoll-Jersey, mit minimalem LAEMU-Print auf der Brust.' },
  { id: 3, name: 'LAEMU T-Shirt Schwarz', category: 'Kleidung', subcategory: 'LAEMU', price: 'CHF 39', badge: null, img: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800&q=80', desc: 'Das schwarze LAEMU T-Shirt — ein Statement für Liebhaber der Ländlermusik. Aus weichem Baumwoll-Jersey.' },
  { id: 4, name: 'LAEMU Beanie', category: 'Kleidung', subcategory: 'LAEMU', price: 'CHF 45', badge: null, img: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80', desc: 'Warme Wintermütze mit eingestricktem LAEMU-Logo. Aus Merinomix, angenehm weich auf der Haut.' },
  { id: 5, name: 'LAEMU Cap', category: 'Accessoires', subcategory: 'LAEMU', price: 'CHF 49', badge: 'Neu', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80', desc: 'Verstellbare Cap mit gesticktem LAEMU-Logo vorne. Eines von uns designt, für euch gemacht.' },
  { id: 6, name: 'LAEMU Tote Bag', category: 'Accessoires', subcategory: 'LAEMU', price: 'CHF 29', badge: null, img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80', desc: 'Praktische Baumwoll-Tragetasche für den Alltag. Gross genug für Notenmappen, Partituren und alles andere.' },
  { id: 7, name: 'LAEMU Sticker-Set', category: 'Accessoires', subcategory: 'LAEMU', price: 'CHF 12', badge: null, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', desc: '6 hochwertige Vinyl-Sticker mit verschiedenen LAEMU-Motiven. Wasserfest und UV-beständig.' },
  { id: 8, name: 'LAEMU Poster A2', category: 'Accessoires', subcategory: 'LAEMU', price: 'CHF 25', badge: null, img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80', desc: 'Grossformatiges A2-Poster mit ikonischem LAEMU-Artwork. Auf hochwertigem 200g Kunstdruckpapier gedruckt.' },
  { id: 9, name: 'T-Shirt Hess-Rusch-Hegner', category: 'Kleidung', subcategory: 'Hess-Rusch-Hegner', price: 'CHF 35', badge: null, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', desc: 'Offizielles T-Shirt der Ländlerkapelle Hess-Rusch-Hegner. Aus organischer Baumwolle, mit dem Formationslogo.' },
  { id: 10, name: 'Cap Rusch-Büeblä', category: 'Accessoires', subcategory: 'Rusch-Büeblä', price: 'CHF 40', badge: 'Neu', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80', desc: 'Exklusiver Cap der Rusch-Büeblä. Limitierte Auflage — nur solange der Vorrat reicht.' },
  { id: 11, name: 'LAEMU CD Sampler Vol. 1', category: 'CDs', subcategory: 'LAEMU', price: 'CHF 22', badge: 'Neu', img: 'https://images.unsplash.com/photo-1511715112108-9acc5b103dfc?w=800&q=80', desc: 'Der offizielle LAEMU CD-Sampler mit den schönsten Aufnahmen aus der Community. 18 Tracks, 74 Minuten Ländlermusik.' },
  { id: 12, name: 'Hess-Rusch-Hegner – Live 2023', category: 'CDs', subcategory: 'Hess-Rusch-Hegner', price: 'CHF 25', badge: null, img: 'https://images.unsplash.com/photo-1511715112108-9acc5b103dfc?w=800&q=80', desc: 'Mitschnitt des unvergesslichen Live-Konzerts der Kapelle Hess-Rusch-Hegner vom November 2023 in Luzern.' },
  { id: 13, name: 'Gasser-Hess-Zumstein – Bergsound', category: 'CDs', subcategory: 'Gasser-Hess-Zumstein', price: 'CHF 25', badge: null, img: 'https://images.unsplash.com/photo-1511715112108-9acc5b103dfc?w=800&q=80', desc: 'Das Debütalbum des Trios Gasser-Hess-Zumstein. 12 traditionelle Stücke mit modernem Klang.' },
  { id: 14, name: 'Ländlermusik-Quiz', category: 'Spiele', subcategory: 'LAEMU', price: 'CHF 34', badge: 'Neu', img: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80', desc: '200 Fragen rund um Schweizer Volksmusik und Ländlermusik. Für 2–6 Spieler, ab 12 Jahren.' },
  { id: 15, name: 'Volksmusik-Memo', category: 'Spiele', subcategory: 'LAEMU', price: 'CHF 24', badge: null, img: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80', desc: 'Memory-Spiel mit 32 Kartenpaaren aus der Welt der Volksmusik. Für die ganze Familie.' },
  { id: 16, name: 'T-Shirt Bodäständix', category: 'Kleidung', subcategory: 'Bodäständix', price: 'CHF 35', badge: null, img: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800&q=80', desc: 'Offizielles T-Shirt der Formation Bodäständix. Komfort trifft Stil — für Fans und Musikerinnen.' },
  { id: 17, name: 'Hoodie Bürgler-Gisler-Hess', category: 'Kleidung', subcategory: 'Bürgler-Gisler-Hess', price: 'CHF 69', badge: null, img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80', desc: 'Premium-Hoodie des Trios Bürgler-Gisler-Hess. Aus schwerem Fleece mit eingesticktem Formationslogo.' },
  { id: 18, name: 'Echo vom Hindere-Litzä – Debut', category: 'CDs', subcategory: 'Echo vom Hindere-Litzä', price: 'CHF 25', badge: 'Neu', img: 'https://images.unsplash.com/photo-1511715112108-9acc5b103dfc?w=800&q=80', desc: 'Das lang erwartete Debütalbum von Echo vom Hindere-Litzä. 10 neue Kompositionen.' },
  { id: 19, name: 'Chlefeli-Set Professionell', category: 'Instrumente', subcategory: 'LAEMU', price: 'CHF 28', badge: 'Neu', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80', desc: 'Professionelles Chlefeli-Set aus hartem Ahornholz. 2 Paare, handgedrechselt, für maximalen Klang und lange Haltbarkeit.' },
  { id: 20, name: 'Holzlöffel-Set (4-teilig)', category: 'Instrumente', subcategory: 'LAEMU', price: 'CHF 18', badge: null, img: 'https://images.unsplash.com/photo-1519924879-7d66f81399fa?w=800&q=80', desc: 'Traditionelles Holzlöffel-Set aus der Schweizer Volksmusik-Tradition. 4 verschiedene Grössen für vielseitige Rhythmen.' },
  { id: 21, name: 'Notenhefter A4 (LAEMU)', category: 'Instrumente', subcategory: 'LAEMU', price: 'CHF 15', badge: null, img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80', desc: 'Stabiler A4-Notenhefter mit LAEMU-Branding. 60 Seiten mit vorgedrucktem Notenpapier — ideal für Proben und Lehrgang.' },
]

const sizes = ['S', 'M', 'L', 'XL']

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id
  const product = products.find((p) => p.id === Number(id))

  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <p className="font-heading text-2xl font-bold text-dark">Produkt nicht gefunden.</p>
        <Link href="/shop" className="font-sans text-sm text-accent-gold underline underline-offset-4 hover:text-dark transition-colors">
          Zurück zum Shop
        </Link>
      </div>
    )
  }

  const similar = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-6">
        <nav className="flex items-center gap-2 font-sans text-sm text-text-secondary">
          <Link href="/shop" className="hover:text-accent-gold transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-dark font-medium">{product.name}</span>
        </nav>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
        >
          <motion.div variants={fadeIn} className="relative">
            <div className="relative aspect-square overflow-hidden bg-surface">
              <Image
                src={product.img}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-accent-gold text-white font-sans text-xs font-medium px-3 py-1.5">
                  {product.badge}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={stagger} className="flex flex-col justify-center gap-6">
            <motion.div variants={fadeIn}>
              <span className="inline-block font-sans text-xs font-semibold tracking-widest uppercase text-accent-gold mb-3">
                {product.category}
              </span>
              <h1 className="font-heading text-4xl lg:text-5xl font-black text-dark leading-tight mb-2">
                {product.name}
              </h1>
              <p className="font-sans text-sm text-text-secondary">
                Von {product.subcategory}
              </p>
            </motion.div>

            <motion.div variants={fadeIn}>
              <span className="font-heading text-3xl font-bold text-accent-gold">
                {product.price}
              </span>
            </motion.div>

            <motion.div variants={fadeIn}>
              <p className="font-sans text-base text-text-secondary leading-relaxed">
                {product.desc}
              </p>
            </motion.div>

            {product.category === 'Kleidung' && (
              <motion.div variants={fadeIn}>
                <p className="font-sans text-xs font-semibold tracking-widest uppercase text-dark mb-3">
                  Grösse
                </p>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 font-sans text-sm font-medium border transition-all ${
                        selectedSize === size
                          ? 'border-dark bg-dark text-white'
                          : 'border-border bg-surface text-dark hover:border-dark'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div variants={fadeIn}>
              <p className="font-sans text-xs font-semibold tracking-widest uppercase text-dark mb-3">
                Anzahl
              </p>
              <div className="flex items-center gap-0 border border-border w-fit bg-surface">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center font-sans text-lg text-dark hover:bg-background transition-colors"
                >
                  -
                </button>
                <span className="w-12 h-11 flex items-center justify-center font-sans text-sm font-medium text-dark border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center font-sans text-lg text-dark hover:bg-background transition-colors"
                >
                  +
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col gap-4">
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-4 font-sans text-sm font-semibold tracking-wide transition-all duration-300 ${
                  added
                    ? 'bg-accent-gold text-white'
                    : 'bg-dark text-white hover:bg-accent-gold'
                }`}
              >
                {added ? '✓ In den Warenkorb hinzugefügt' : 'In den Warenkorb'}
              </motion.button>

              <Link
                href="/shop"
                className="font-sans text-sm text-text-secondary hover:text-accent-gold transition-colors flex items-center gap-1.5"
              >
                <span>←</span>
                <span>Zurück zum Shop</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {similar.length > 0 && (
        <section className="bg-surface py-24 border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeIn} className="font-heading text-3xl font-black text-dark mb-12">
                Ähnliche Produkte
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((p) => (
                  <motion.div key={p.id} variants={fadeIn}>
                    <Link href={`/shop/${p.id}`} className="group block bg-background overflow-hidden">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={p.img}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                        {p.badge && (
                          <div className="absolute top-3 left-3 bg-accent-gold text-white font-sans text-xs px-2 py-1">
                            {p.badge}
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-sans font-medium text-sm text-dark mb-1 group-hover:text-accent-gold transition-colors">
                          {p.name}
                        </h3>
                        <p className="font-sans text-xs text-text-secondary mb-3">{p.category}</p>
                        <span className="font-heading font-bold text-accent-gold">{p.price}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
