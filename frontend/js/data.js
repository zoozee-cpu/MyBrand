/* ============================================================
   ZKS FRAGRANCES — DATA.JS
   Single source of truth for all 8 products
   ============================================================ */

const PRODUCTS = [
  {
    id: "aqua-ember",
    name: "Aqua Ember",
    price: 2200,
    size: "50ml",
    currency: "Rs",
    badge: "Best Seller",
    scentFamily: ["Fresh", "Smoky"],
    occasion: ["Summer", "Evenings"],
    gender: "Unisex",
    description: "A paradox bottled in 50ml — cool ocean air swept through smoldering embers at dusk. Where the sea meets fire, Aqua Ember creates a scented tension that lingers on the skin for hours.",
    longDescription: "Aqua Ember was born from the idea of contrast: the sharp clarity of a sea breeze colliding with the warmth of burning wood. Opening with an electric burst of bergamot and sea salt, the fragrance shifts into a smoky incense heart that is simultaneously calming and seductive. As it dries down, cedarwood and smoky amber anchor the scent to your skin, creating a trail that commands attention without demanding it. This is a fragrance for those who live between worlds — equally at home on a rooftop at sunset or a candlelit dinner. Aqua Ember is ZKS's best-selling signature scent, and once you wear it, you'll understand why. It is not just a fragrance — it's a mood you carry.",
    pyramid: {
      top:   ["Bergamot", "Sea Salt", "Pink Pepper"],
      heart: ["Incense", "Aquatic Notes", "Jasmine"],
      base:  ["Smoky Amber", "Cedarwood", "Musks"]
    },
    images: {
      primary: "assets/images/products/aqua-ember.webp",
      hover:   "assets/images/products/aqua-ember-hover.webp",
      gallery: [
        "assets/images/products/aqua-ember.webp",
        "assets/images/products/aqua-ember-hover.webp"
      ]
    },
    inStock: true,
    featured: true,
    quizProfile: {
      timeOfDay: "both",
      profile:   ["smoky", "fresh"],
      occasion:  "everyday"
    }
  },
  {
    id: "aqua-bloom",
    name: "Aqua Bloom",
    price: 2200,
    size: "50ml",
    currency: "Rs",
    badge: null,
    scentFamily: ["Fresh", "Floral"],
    occasion: ["Summer"],
    gender: "Women",
    description: "The scent of first light over a flower garden after rain — Aqua Bloom captures that fleeting moment of dewy freshness and warm petals with effortless femininity.",
    longDescription: "Aqua Bloom is a love letter to summer mornings. It opens with a luminous explosion of fresh citrus and green leaves — like walking barefoot through a garden just kissed by the morning dew. At its heart, a trio of white florals unfolds: rose, lily of the valley, and freesia, each note intertwining with the next in a soft bouquet that feels both timeless and contemporary. The base settles into a clean, skin-close musk with a whisper of sandalwood, ensuring the scent lingers intimately without overpowering. Aqua Bloom is for the woman who moves through the world with grace and lightness — sophisticated without effort, radiant without trying. Wear it to brunch, to work, or simply because the morning deserves to smell this beautiful.",
    pyramid: {
      top:   ["Yuzu", "Green Leaves", "Bergamot"],
      heart: ["Rose", "Lily of the Valley", "Freesia"],
      base:  ["White Musks", "Sandalwood", "Cashmeran"]
    },
    images: {
      primary: "assets/images/products/aqua-bloom.webp",
      hover:   "assets/images/products/aqua-bloom-hover.webp",
      gallery: [
        "assets/images/products/aqua-bloom.webp",
        "assets/images/products/aqua-bloom-hover.webp"
      ]
    },
    inStock: true,
    featured: true,
    quizProfile: {
      timeOfDay: "day",
      profile:   ["fresh"],
      occasion:  "everyday"
    }
  },
  {
    id: "dark-ember",
    name: "Dark Ember",
    price: 2200,
    size: "50ml",
    currency: "Rs",
    badge: null,
    scentFamily: ["Smoky", "Musky"],
    occasion: ["Winter Nights"],
    gender: "Men",
    description: "Bold, brooding, and unforgettable — Dark Ember is the scent of a man who needs no introduction. Deep saffron, burning wood, and a velvet musk that commands every room it enters.",
    longDescription: "Dark Ember does not whisper — it speaks with authority. This is a fragrance for winter nights and candlelit spaces, for men who prefer depth over flash and substance over trend. It opens with the exotic warmth of saffron, immediately signaling that this is not an ordinary fragrance. The heart reveals a hypnotic blend of oud-kissed amber and smoldering cedarwood — bold, complex, and utterly masculine. As the scent evolves on your skin, a rich foundation of patchouli and smoky musks locks it in place, creating a lasting trail that announces your presence before you even speak. Dark Ember is the olfactory equivalent of a perfectly tailored suit in midnight black — effortlessly powerful, always appropriate for the occasion that demands the best version of you.",
    pyramid: {
      top:   ["Saffron", "Black Pepper", "Cardamom"],
      heart: ["Oud", "Cedarwood", "Smoky Amber"],
      base:  ["Patchouli", "Sandalwood", "Dark Musks"]
    },
    images: {
      primary: "assets/images/products/dark-ember.webp",
      hover:   "assets/images/products/dark-ember-hover.webp",
      gallery: [
        "assets/images/products/dark-ember.webp",
        "assets/images/products/dark-ember-hover.webp"
      ]
    },
    inStock: true,
    featured: true,
    quizProfile: {
      timeOfDay: "night",
      profile:   ["smoky", "woody"],
      occasion:  "special"
    }
  },
  {
    id: "golden-hours",
    name: "Golden Hours",
    price: 2200,
    size: "50ml",
    currency: "Rs",
    badge: null,
    scentFamily: ["Sweet", "Floral"],
    occasion: ["Evenings"],
    gender: "Unisex",
    description: "Pineapple meets vanilla and musk in a golden haze that captures the magic of those last sun-drenched hours before dusk. Joyful, warm, and powerfully alluring.",
    longDescription: "Golden Hours is the scent of the perfect evening — that enchanted window between sunset and night when the air turns golden and time slows down. It opens with an exuberant burst of pineapple and mandarin, instantly lifting the spirits with tropical brightness. The heart blooms into a rich, floral warmth: jasmine absolute and a touch of rose swirled together with creamy vanilla, creating a depth that feels both sophisticated and comforting. The base is pure magnetism — warm musk, tonka bean, and a hint of amber that wraps around the skin like a second layer. Golden Hours is the scent you reach for when you want to feel your absolute best: date nights, wedding receptions, or any moment worth remembering. It was built to turn heads and leave trails.",
    pyramid: {
      top:   ["Pineapple", "Mandarin", "Pink Pepper"],
      heart: ["Jasmine Absolute", "Rose", "Vanilla Blossom"],
      base:  ["Tonka Bean", "Amber", "White Musks"]
    },
    images: {
      primary: "assets/images/products/golden-hours.webp",
      hover:   "assets/images/products/golden-hours-hover.webp",
      gallery: [
        "assets/images/products/golden-hours.webp",
        "assets/images/products/golden-hours-hover.webp"
      ]
    },
    inStock: true,
    featured: true,
    quizProfile: {
      timeOfDay: "night",
      profile:   ["sweet"],
      occasion:  "special"
    }
  },
  {
    id: "illusion",
    name: "Illusion",
    price: 2000,
    size: "50ml",
    currency: "Rs",
    badge: "Best Value",
    scentFamily: ["Smoky", "Musky"],
    occasion: ["Winter Nights", "Evenings"],
    gender: "Unisex",
    description: "A perfect harmony of saffron, jasmine, and sacred woods — Illusion blurs the line between reality and reverie. Each spray leaves you questioning whether you're wearing the scent or it's wearing you.",
    longDescription: "Illusion lives up to its name: a fragrance so seamlessly blended that it becomes impossible to separate where it ends and you begin. It opens with a rare combination of saffron and violet — exotic and intriguing, immediately drawing people in without explanation. The heart is a hypnotic duo of jasmine sambac and incense: sacred, meditative, and deeply sensual. As the fragrance settles, it reveals a foundation of sacred oud wood and grey musk — modern, clean, and otherworldly. Illusion is the choice of those who understand that fragrance is not decoration; it is identity. It works equally for intimate evenings and formal occasions, shifting subtly with your body heat to reveal a different facet each time. At Rs 2,000, it is also ZKS's most accessible luxury.",
    pyramid: {
      top:   ["Saffron", "Violet", "Bergamot"],
      heart: ["Jasmine Sambac", "Incense", "Rose Absolute"],
      base:  ["Oud Wood", "Grey Musk", "Cashmeran"]
    },
    images: {
      primary: "assets/images/products/illusion.webp",
      hover:   "assets/images/products/illusion-hover.webp",
      gallery: [
        "assets/images/products/illusion.webp",
        "assets/images/products/illusion-hover.webp"
      ]
    },
    inStock: true,
    featured: false,
    quizProfile: {
      timeOfDay: "night",
      profile:   ["smoky", "woody"],
      occasion:  "special"
    }
  },
  {
    id: "zks-tulip",
    name: "ZKS Tulip",
    price: 2200,
    size: "50ml",
    currency: "Rs",
    badge: null,
    scentFamily: ["Floral", "Sweet"],
    occasion: ["Summer", "Evenings"],
    gender: "Women",
    description: "ZKS Tulip celebrates the beauty of femininity in full bloom — a lush, velvety floral that balances dreamy sweetness with confident elegance. The scent of a woman who knows exactly who she is.",
    longDescription: "ZKS Tulip was crafted as an ode to the flower that has symbolized feminine beauty and grace across cultures for centuries — reimagined for the modern Pakistani woman who carries both tradition and ambition within her. It opens with a sparkling green-floral rush: tulip petals, peony, and a hint of cyclamen that feels impossibly fresh and alive. The heart deepens into a luxurious rose absolute paired with warm ylang ylang — feminine in the most confident sense of the word. The base grounds everything with a soft vanilla musk and cedarwood, giving the fragrance a lasting warmth that feels like a gentle embrace hours after application. ZKS Tulip is your companion for summer garden parties, family gatherings, and every occasion where you want to feel effortlessly beautiful.",
    pyramid: {
      top:   ["Tulip Petals", "Peony", "Cyclamen"],
      heart: ["Rose Absolute", "Ylang Ylang", "Iris"],
      base:  ["Vanilla Musk", "Cedarwood", "Amber"]
    },
    images: {
      primary: "assets/images/products/zks-tulip.webp",
      hover:   "assets/images/products/zks-tulip-hover.webp",
      gallery: [
        "assets/images/products/zks-tulip.webp",
        "assets/images/products/zks-tulip-hover.webp"
      ]
    },
    inStock: true,
    featured: false,
    quizProfile: {
      timeOfDay: "day",
      profile:   ["sweet"],
      occasion:  "everyday"
    }
  },
  {
    id: "ultra-man",
    name: "Ultra Man",
    price: 2200,
    size: "50ml",
    currency: "Rs",
    badge: null,
    scentFamily: ["Sweet", "Fresh"],
    occasion: ["Summer", "Evenings"],
    gender: "Men",
    description: "The modern man's signature: crisp, sweet, and magnetic. Ultra Man fuses fresh citrus energy with unexpected sweetness and a clean woody heart that stays compelling all day long.",
    longDescription: "Ultra Man redefines what a men's fragrance can be in 2024: not bound by the tired conventions of 'sport' or 'intense,' but instead confident in its versatility and charm. It opens with a luminous blast of grapefruit and mint — clean, energetic, and instantly appealing. The heart introduces an intriguing combination of fresh apple and lavender, a modern take on masculinity that feels sophisticated rather than predictable. The base is where Ultra Man reveals its true character: warm vanilla, tonka bean, and vetiver come together to create a sweetened, long-lasting dry-down that is magnetic without being overpowering. Ultra Man works for office hours, weekend plans, and everything in between. It's the fragrance for the young Pakistani professional who wants to smell outstanding without overthinking it.",
    pyramid: {
      top:   ["Grapefruit", "Mint", "Lemon"],
      heart: ["Fresh Apple", "Lavender", "Geranium"],
      base:  ["Vanilla", "Tonka Bean", "Vetiver"]
    },
    images: {
      primary: "assets/images/products/ultra-man.webp",
      hover:   "assets/images/products/ultra-man-hover.webp",
      gallery: [
        "assets/images/products/ultra-man.webp",
        "assets/images/products/ultra-man-hover.webp"
      ]
    },
    inStock: true,
    featured: false,
    quizProfile: {
      timeOfDay: "both",
      profile:   ["fresh", "sweet"],
      occasion:  "everyday"
    }
  },
  {
    id: "velvet-soul",
    name: "Velvet Soul",
    price: 2200,
    size: "50ml",
    currency: "Rs",
    badge: null,
    scentFamily: ["Sweet", "Musky"],
    occasion: ["Evenings", "Winter Nights"],
    gender: "Women",
    description: "Wrapped in warmth — Velvet Soul is an intimate, skin-close fragrance that envelops like a cashmere embrace. Dark berries, warm vanilla, and velvety musks create an aura of quiet luxury.",
    longDescription: "Velvet Soul is for the woman who understands the power of intimacy — the choice you make when the evening calls for something deeply personal rather than loudly present. It opens with a rich accord of blackberry and plum, dark and sensual from the first moment, immediately setting a mood of sophisticated indulgence. The heart offers a warm, enveloping blend of bourbon vanilla and heliotrope — sweet without being saccharine, comforting without being cloying. The fragrance settles into a foundation of cashmere musk and sandalwood, the softest, most skin-like dry-down in the ZKS collection. Velvet Soul is the fragrance you wear when the occasion is intimate: an evening in, a family dinner, the quiet luxury of knowing you smell extraordinary even when no one is watching. It lingers beautifully on fabrics long after you've left the room.",
    pyramid: {
      top:   ["Blackberry", "Plum", "Bergamot"],
      heart: ["Bourbon Vanilla", "Heliotrope", "Rose"],
      base:  ["Cashmere Musk", "Sandalwood", "Tonka Bean"]
    },
    images: {
      primary: "assets/images/products/velvet-soul.webp",
      hover:   "assets/images/products/velvet-soul-hover.webp",
      gallery: [
        "assets/images/products/velvet-soul.webp",
        "assets/images/products/velvet-soul-hover.webp"
      ]
    },
    inStock: true,
    featured: true,
    quizProfile: {
      timeOfDay: "night",
      profile:   ["sweet"],
      occasion:  "special"
    }
  }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS };
}
