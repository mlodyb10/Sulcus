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
    description: 'Szyfr noszony na skórze. Zimny na początku, potem ciepły — jak wiadomość rozszyfrowana zbyt późno.',
    notes: {
      top: [
        { name: 'Bergamota', description: 'Zimne otwarcie z metalicznym podbiciem. Ostre i natychmiastowe.', origin: 'Kalabria, Włochy' },
        { name: 'Czarny Pieprz', description: 'Suchy, korzenny, lekko elektryczny. Tnie ciszę.', origin: 'Kerala, Indie' },
        { name: 'Liść Fiołka', description: 'Zielony i wodny, jak mokry kamień po deszczu. Zimny i precyzyjny.', origin: 'Delta Nilu, Egipt' },
      ],
      heart: [
        { name: 'Irys', description: 'Pudrowy i mineralny — zapach rzeczy niewyrzeczonych, pokoi po odejściu.', origin: 'Florencja, Włochy' },
        { name: 'Wetyweria', description: 'Ziemista, dymna, zakorzeniona. Głos transmitowany przez zakłócenia.', origin: 'Haiti' },
        { name: 'Dym Brzozowy', description: 'Zwęglone drewno, ledwo wyczuwalny sygnał. Znika zanim zdążysz go nazwać.', origin: 'Lasy bałtyckie' },
      ],
      base: [
        { name: 'Labdanum', description: 'Ciemna żywica bursztynowa z animalicznym ciepłem — stare wiadomości, stara skóra.', origin: 'Kreta, Grecja' },
        { name: 'Piżmo', description: 'Obecność, nie zapach. Ślad po tym, gdy wszystko inne zniknie.', origin: 'Grasse, Francja (syntetyczne)' },
        { name: 'Benzoes', description: 'Blisko wanilii, balsamiczny. Ciepło które każe się przybliżyć.', origin: 'Żywica syjamska' },
      ],
    },
  },
  {
    id: 'calor',
    name: 'Calor',
    price: 440,
    description: 'Ciepło które zostaje na pościeli. Na skórze. Na wspomnieniu.',
    notes: {
      top: [
        { name: 'Kardamon', description: 'Korzenny i zielony, pierwszy oddech ciepła. Intymny od samego początku.', origin: 'Gwatemala' },
        { name: 'Mandarynka', description: 'Cytrus nagrzany słońcem — wspomnienie skóry w popołudniowym świetle.', origin: 'Sycylia, Włochy' },
        { name: 'Różowy Pieprz', description: 'Delikatne ciepło z kwiatowym ugryzieniem. Rumieniec, nie oparzenie.', origin: 'Wyspa Réunion' },
      ],
      heart: [
        { name: 'Absolut Różany', description: 'Głęboka, cielesna, niemal fizyczna. Róża która nie przeprasza.', origin: 'Dolina Róż, Bułgaria' },
        { name: 'Drzewo Sandałowe', description: 'Kremowe i ciepłe, jak oddech w zimny ranek. Ciało przyciśnięte blisko.', origin: 'Mysore, Indie' },
        { name: 'Ambra', description: 'Złota mgła. Sprawia że wszystko wokół staje się cięższe, wolniejsze, pewniejsze.', origin: 'Akord syntetyczny' },
      ],
      base: [
        { name: 'Wanilia', description: 'Nie słodka — niemal wytrawna. Skóra pod słodyczą.', origin: 'Madagaskar' },
        { name: 'Tonka', description: 'Delikatne ciepło kumaryny. Godziny po uścisku, to właśnie pozostaje.', origin: 'Wenezuela' },
        { name: 'Białe Piżmo', description: 'Czyste i bliskie, zapach ciepłej bawełny i spokojnej skóry.', origin: 'Syntetyczne' },
      ],
    },
  },
  {
    id: 'cinis',
    name: 'Cinis',
    price: 460,
    description: 'To co zostaje po ogniu. Zimne, piękne, absolutne.',
    notes: {
      top: [
        { name: 'Dziegieć Brzozowy', description: 'Ostry, leczniczy, szczery. Zapach czegoś co zostało pochłonięte.', origin: 'Lasy syberyjskie' },
        { name: 'Galbanum', description: 'Zielony i gorzki dym ze starego drewna. Początek który już czuje się jak koniec.', origin: 'Persja, Iran' },
        { name: 'Akord Sadzy', description: 'Węgiel i powietrze. Precyzyjna nieobecność tego co spłonęło.', origin: 'Syntetyczne' },
      ],
      heart: [
        { name: 'Oud', description: 'Gęsty, pierwotny, starożytny. Drewno które oddaje swój zapach tylko gdy jest ranione.', origin: 'Laos' },
        { name: 'Czarna Róża', description: 'Suszone płatki na marmurze. Żałobna i piękna.', origin: 'Isparta, Turcja' },
        { name: 'Skóra', description: 'Tytoń, garbnik, zwierzę. Przetrwanie. Ciało bez miękkości.', origin: 'Grasse, Francja' },
      ],
      base: [
        { name: 'Paczula', description: 'Ciemna ziemia, głęboka i powolna. To co zachowuje grunt.', origin: 'Sumatra, Indonezja' },
        { name: 'Kadzidło', description: 'Ceremonialny dym, za długo przytrzymany oddech. Sakralny i ostateczny.', origin: 'Dhofar, Oman' },
        { name: 'Benzoes', description: 'Słodycz pod popiołem. Coś jednak przeżyło.', origin: 'Żywica syjamska' },
      ],
    },
  },
  {
    id: 'umbra',
    name: 'Umbra',
    price: 400,
    description: 'Kształt tego czego już nie ma. Sylwetka w zapachu.',
    notes: {
      top: [
        { name: 'Nocny Jaśmin', description: 'Kwitnie tylko w ciemności. Ciężki, odurzający, trochę nieodpowiedni.', origin: 'Tamil Nadu, Indie' },
        { name: 'Fiołek', description: 'Chłodny i pudrowy — wspomnienie, nie obecność. Już odchodzi.', origin: 'Grasse, Francja' },
        { name: 'Akord Rosy', description: 'Zapach przed zapachem. Zimna wilgoć na liściach, moment na progu.', origin: 'Syntetyczne' },
      ],
      heart: [
        { name: 'Korzeń Irysa', description: 'Pudrowy — nostalgia której nie możesz umiejscowić. Twarz którą prawie rozpoznajesz.', origin: 'Toskania, Włochy' },
        { name: 'Szare Piżmo', description: 'Miękkie jak cień, ani tu ani tam. Zapach kogoś kto niedawno odszedł.', origin: 'Syntetyczne' },
        { name: 'Głóg', description: 'Cichy, lekko leczniczy, gorzko-słodki. Zarośnięte drogi i zapomniane ścieżki.', origin: 'Angielska wieś' },
      ],
      base: [
        { name: 'Szara Ambra', description: 'Starożytna, oceaniczna, niezastąpiona. Substancja zrodzona z samego czasu.', origin: 'Ocean Atlantycki (skamieniała)' },
        { name: 'Biały Cedr', description: 'Suche, czyste drewno. Puste pomieszczenie wciąż lekko zamieszkałe.', origin: 'Atlas, Maroko' },
        { name: 'Mech Dębowy', description: 'Wilgotna leśna ściółka, najstarsza zieleń. Ślad który przeżywa wszystko.', origin: 'Lasy bałkańskie' },
      ],
    },
  },
]
