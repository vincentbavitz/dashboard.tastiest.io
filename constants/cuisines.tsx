// Ensure SVGs dont have any width or height attrs.
import AmericanSVG from '@svg/cuisines/american.svg';
import BritishSVG from '@svg/cuisines/british.svg';
import ChineseSVG from '@svg/cuisines/chinese.svg';
import FrenchSVG from '@svg/cuisines/french.svg';
import IndianSVG from '@svg/cuisines/indian.svg';
import ItalianSVG from '@svg/cuisines/italian.svg';
import JapaneseSVG from '@svg/cuisines/japanese.svg';
import MediterraneanSVG from '@svg/cuisines/mediterranean.svg';
import MexicanSVG from '@svg/cuisines/mexican.svg';
import SpanishSVG from '@svg/cuisines/spanish.svg';
import { CuisineSymbol, ICuisine } from '../types/cuisine';

const CUISINES = {
  [CuisineSymbol.ITALIAN]: {
    name: 'Italian',
    href: '/italian',
    svg: ItalianSVG,
    popularity: 1103,
  },
  [CuisineSymbol.FRENCH]: {
    name: 'French',
    href: '/french',
    svg: FrenchSVG,
    popularity: 1337,
  },
  [CuisineSymbol.JAPANESE]: {
    name: 'Japanese',
    href: '/japanese',
    svg: JapaneseSVG,
    popularity: 2147,
  },
  [CuisineSymbol.CHINESE]: {
    name: 'Chinese',
    href: '/chinese',
    svg: ChineseSVG,
    popularity: 3333,
  },
  [CuisineSymbol.INDIAN]: {
    name: 'Indian',
    href: '/indian',
    svg: IndianSVG,
    popularity: 4096,
  },
  [CuisineSymbol.SPANISH]: {
    name: 'Spanish',
    href: '/spanish',
    svg: SpanishSVG,
    popularity: 13,
  },
  [CuisineSymbol.BRITISH]: {
    name: 'British',
    href: '/british',
    svg: BritishSVG,
    popularity: 11,
  },
  [CuisineSymbol.AMERICAN]: {
    name: 'American',
    href: '/america',
    svg: AmericanSVG,
    popularity: 400,
  },
  [CuisineSymbol.MEXICAN]: {
    name: 'Mexican',
    href: '/mexican',
    svg: MexicanSVG,
    popularity: 903,
  },
  [CuisineSymbol.MEDITERRANEAN]: {
    name: 'Mediterranean',
    href: '/mediterranean',
    svg: MediterraneanSVG,
    popularity: 543,
  },
} as { [name: string]: ICuisine };

export default CUISINES;
