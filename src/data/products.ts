export interface Note {
  name: string
  description: string
  origin: string
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  notes: {
    top: Note[]
    heart: Note[]
    base: Note[]
  }
}

export const products: Product[] = [
  {
    id: 'morse',
    name: 'Morse',
    price: 420,
    description: 'A cipher worn on skin. Cold at first, then warm — like a message decoded too late.',
    notes: {
      top: [
        { name: 'Bergamot', description: 'A clean citrus opening with metallic undertones, sharp and immediate.', origin: 'Calabria, Italy' },
        { name: 'Black Pepper', description: 'Dry, spiced, slightly electric. Cuts through silence.', origin: 'Kerala, India' },
        { name: 'Violet Leaf', description: 'Green and watery, like wet stone after rain. Cold and precise.', origin: 'Nile Delta, Egypt' },
      ],
      heart: [
        { name: 'Iris', description: 'Powdery and mineral — the scent of things left unsaid, of rooms after departure.', origin: 'Florence, Italy' },
        { name: 'Vetiver', description: 'Earthy, smoky, rooted. A voice transmitted through static.', origin: 'Haïti' },
        { name: 'Birch Smoke', description: 'Charred wood, a faint signal. Disappears before you can name it.', origin: 'Baltic forests' },
      ],
      base: [
        { name: 'Labdanum', description: 'Dark amber resin with animalic warmth — old messages, old skin.', origin: 'Crete, Greece' },
        { name: 'Musk', description: 'A presence rather than a scent. The trace after everything else fades.', origin: 'Grasse, France (synthetic)' },
        { name: 'Benzoin', description: 'Vanilla-adjacent, balsamic. The warmth that makes you lean closer.', origin: 'Siam resin' },
      ],
    },
  },
  {
    id: 'calor',
    name: 'Calor',
    price: 440,
    description: 'The warmth that stays on sheets. On skin. On memory.',
    notes: {
      top: [
        { name: 'Cardamom', description: 'Spiced and green, the first breath of warmth. Intimate from the start.', origin: 'Guatemala' },
        { name: 'Mandarin', description: 'Sun-warmed citrus — memory of skin in afternoon light.', origin: 'Sicily, Italy' },
        { name: 'Pink Pepper', description: 'Soft heat with floral bite. A blush, not a burn.', origin: 'Réunion Island' },
      ],
      heart: [
        { name: 'Rose Absolute', description: "Deep, fleshy, almost bodily. The kind of rose that doesn't apologise.", origin: 'Rose Valley, Bulgaria' },
        { name: 'Sandalwood', description: 'Creamy and warm, like breath on a cold morning. A body pressed close.', origin: 'Mysore, India' },
        { name: 'Amber', description: 'A golden haze. Turns everything around it heavier, slower, more certain.', origin: 'Synthetic accord' },
      ],
      base: [
        { name: 'Vanilla', description: 'Not sweet — almost savoury. The skin beneath the sweetness.', origin: 'Madagascar' },
        { name: 'Tonka Bean', description: 'Soft coumarin warmth. Hours after the embrace, this remains.', origin: 'Venezuela' },
        { name: 'White Musk', description: 'Clean and close, the scent of warm cotton and quiet skin.', origin: 'Synthetic' },
      ],
    },
  },
  {
    id: 'cinis',
    name: 'Cinis',
    price: 460,
    description: 'What remains after the fire. Cold, beautiful, absolute.',
    notes: {
      top: [
        { name: 'Birch Tar', description: 'Acrid, medicinal, honest. The smell of something consumed.', origin: 'Siberian birch forests' },
        { name: 'Galbanum', description: 'Green and bitter smoke rising from old wood. A beginning that already feels like an end.', origin: 'Persia, Iran' },
        { name: 'Soot Accord', description: 'Carbon and air. The precise absence of what burned.', origin: 'Synthetic' },
      ],
      heart: [
        { name: 'Oud', description: 'Dense, primal, ancient. A wood that only gives its scent when wounded.', origin: 'Laos' },
        { name: 'Dark Rose', description: 'Dried petals on marble. Funereal and beautiful.', origin: 'Isparta, Turkey' },
        { name: 'Leather', description: 'Tobacco, tannin, animal. Survival. The body without the softness.', origin: 'Grasse, France' },
      ],
      base: [
        { name: 'Patchouli', description: 'Dark earth, deep and slow. What the ground keeps.', origin: 'Sumatra, Indonesia' },
        { name: 'Incense', description: 'Ceremonial smoke, a breath held too long. Sacred and final.', origin: 'Dhofar, Oman' },
        { name: 'Benzoin', description: 'A sweetness beneath the ash. Something survived after all.', origin: 'Siam resin' },
      ],
    },
  },
  {
    id: 'umbra',
    name: 'Umbra',
    price: 400,
    description: 'The shape of what is no longer there. A silhouette in scent.',
    notes: {
      top: [
        { name: 'Night Jasmine', description: 'Blooms only in darkness. Heavy, intoxicating, a little wrong.', origin: 'Tamil Nadu, India' },
        { name: 'Violet', description: 'Cool and powdery — a memory rather than a presence. Already receding.', origin: 'Grasse, France' },
        { name: 'Dew Accord', description: 'The smell before the smell. Cold moisture on leaves, a threshold moment.', origin: 'Synthetic' },
      ],
      heart: [
        { name: 'Orris', description: "Powdery iris root — nostalgia you can't place. A face you almost recognise.", origin: 'Tuscany, Italy' },
        { name: 'Grey Musk', description: 'Shadow-soft, neither here nor there. The scent of someone recently gone.', origin: 'Synthetic' },
        { name: 'Hawthorn', description: 'Quiet, slightly medicinal, bittersweet. Hedgerows and forgotten paths.', origin: 'English countryside' },
      ],
      base: [
        { name: 'Ambergris', description: 'Ancient, oceanic, irreplaceable. A substance born of time itself.', origin: 'Atlantic Ocean (fossilised)' },
        { name: 'White Cedar', description: 'Dry, clean wood. An empty room still faintly inhabited.', origin: 'Atlas Mountains, Morocco' },
        { name: 'Oakmoss', description: 'Damp forest floor, the oldest green. The trace that outlasts everything.', origin: 'Balkan forests' },
      ],
    },
  },
]
