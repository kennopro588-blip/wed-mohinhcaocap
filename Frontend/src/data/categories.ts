export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  gradient: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: 'gundam',
    name: 'Gundam & Mecha',
    slug: 'gundam',
    description: 'Mô hình Bandai Gunpla PG, MG, RG, Metal Build cao cấp',
    itemCount: 34,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    image: '/images/gundam.png',
  },
  {
    id: 'figure',
    name: 'Anime & Game Figures',
    slug: 'figure',
    description: 'Figure 1/4, 1/6, 1/7 từ Good Smile, Alter, Hot Toys',
    itemCount: 33,
    gradient: 'linear-gradient(135deg, #2d1b69 0%, #6d3b6e 100%)',
    image: '/images/figure.png',
  },
  {
    id: 'diecast',
    name: 'Siêu Xe Diecast',
    slug: 'diecast',
    description: 'Mô hình xe ô tô tỉ lệ 1/18, 1/24 từ Autoart, Almost Real',
    itemCount: 33,
    gradient: 'linear-gradient(135deg, #1a0e00 0%, #8B6914 100%)',
    image: '/images/supercar.png',
  },
  {
    id: 'resin',
    name: 'Tượng Resin & Diorama',
    slug: 'resin',
    description: 'Statue giới hạn số lượng từ Prime 1 Studio, Tsume',
    itemCount: 32,
    gradient: 'linear-gradient(135deg, #0d1117 0%, #238636 100%)',
    image: '/images/statue.png',
  },
];
