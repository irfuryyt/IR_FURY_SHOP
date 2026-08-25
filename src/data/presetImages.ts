export interface PresetImage {
  id: string;
  title: string;
  category: 'games' | 'premium' | 'giftcards' | 'general';
  url: string;
}

export const PRESET_IMAGES: PresetImage[] = [
  // Games
  {
    id: 'img-codm',
    title: 'سی پی کالاف دیوتی موبایل',
    category: 'games',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-pubg',
    title: 'یوسی پابجی موبایل',
    category: 'games',
    url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-freefire',
    title: 'جم فری فایر',
    category: 'games',
    url: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-clash',
    title: 'جم کلش آف کلنز',
    category: 'games',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-mlbb',
    title: 'الماس موبایل لجندز',
    category: 'games',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-eafc',
    title: 'اف سی پوینت FC Mobile',
    category: 'games',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-roblox',
    title: 'راباکس روبلاکس (Robux)',
    category: 'games',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-brawl',
    title: 'جم براول استارز',
    category: 'games',
    url: 'https://images.unsplash.com/photo-1612287233215-6a84d4ceba35?auto=format&fit=crop&w=800&q=80',
  },

  // Premium Subscriptions
  {
    id: 'img-tg',
    title: 'تلگرام پریمیوم',
    category: 'premium',
    url: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-chatgpt',
    title: 'اشتراک ChatGPT Plus',
    category: 'premium',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-spotify',
    title: 'اسپاتیفای پریمیوم',
    category: 'premium',
    url: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-discord',
    title: 'دیسکورد نیترو (Nitro)',
    category: 'premium',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-youtube',
    title: 'یوتیوب پریمیوم',
    category: 'premium',
    url: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-canva',
    title: 'اکانت کانوا پرو (Canva Pro)',
    category: 'premium',
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
  },

  // Gift Cards
  {
    id: 'img-psn',
    title: 'گیفت کارت پلی استیشن PSN',
    category: 'giftcards',
    url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-steam',
    title: 'گیفت کارت استیم والت',
    category: 'giftcards',
    url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-xbox',
    title: 'گیفت کارت ایکس باکس',
    category: 'giftcards',
    url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-apple',
    title: 'گیفت کارت اپل و آیتونز',
    category: 'giftcards',
    url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-google',
    title: 'گیفت کارت گوگل پلی',
    category: 'giftcards',
    url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-razer',
    title: 'گیفت کارت ریزر گلد (Razer Gold)',
    category: 'giftcards',
    url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'img-nintendo',
    title: 'گیفت کارت نینتندو eShop',
    category: 'giftcards',
    url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
  },
];
