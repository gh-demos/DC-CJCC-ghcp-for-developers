export interface Photo {
  id: string;
  url: string;
  title: string;
  tags: string[];
  likes: number;
  downloads: number;
  views: number;
  photographer?: string;
  dateTaken?: string;
}

export const mockPhotos: Photo[] = [
  {
    id: '1',
    url: '/images/gallery/desert-sunset.webp',
    title: 'Sunset Landscape',
    tags: ['landscape', 'sunset', 'nature'],
    likes: 124,
    downloads: 45,
    views: 1205,
    photographer: 'John Doe',
    dateTaken: '2024-01-15'
  },
  {
    id: '2',
    url: '/images/gallery/portrait-study.webp',
    title: 'Portrait Study',
    tags: ['portrait', 'studio', 'professional'],
    likes: 89,
    downloads: 23,
    views: 892,
    photographer: 'Jane Smith',
    dateTaken: '2024-01-10'
  },
  {
    id: '3',
    url: '/images/gallery/architecture.webp',
    title: 'Architecture',
    tags: ['architecture', 'building', 'city'],
    likes: 156,
    downloads: 67,
    views: 1543,
    photographer: 'Mike Johnson',
    dateTaken: '2024-01-08'
  },
  {
    id: '4',
    url: '/images/gallery/nature-close-up.webp',
    title: 'Nature Close-up',
    tags: ['macro', 'nature', 'flowers'],
    likes: 203,
    downloads: 89,
    views: 2134,
    photographer: 'Sarah Wilson',
    dateTaken: '2024-01-05'
  },
  {
    id: '5',
    url: '/images/gallery/street-photography.webp',
    title: 'Street Photography',
    tags: ['street', 'candid', 'urban'],
    likes: 91,
    downloads: 34,
    views: 765,
    photographer: 'Alex Brown',
    dateTaken: '2024-01-03'
  },
  {
    id: '6',
    url: '/images/gallery/quiet-afternoon.webp',
    title: 'Quiet Afternoon',
    tags: ['lifestyle', 'outdoor', 'relaxation'],
    likes: 267,
    downloads: 112,
    views: 3421,
    photographer: 'Emma Davis',
    dateTaken: '2024-01-01'
  },
  {
    id: '7',
    url: '/images/gallery/mountain-range.webp',
    title: 'Mountain Vista',
    tags: ['landscape', 'mountain', 'adventure'],
    likes: 189,
    downloads: 78,
    views: 1876,
    photographer: 'David Chen',
    dateTaken: '2023-12-28'
  },
  {
    id: '8',
    url: '/images/gallery/coastal-vista.webp',
    title: 'Coastal Vista',
    tags: ['landscape', 'coast', 'adventure'],
    likes: 234,
    downloads: 95,
    views: 2543,
    photographer: 'Lisa Martinez',
    dateTaken: '2023-12-25'
  },
  {
    id: '9',
    url: '/images/gallery/wildlife-portrait.webp',
    title: 'Wildlife Portrait',
    tags: ['wildlife', 'nature', 'animal'],
    likes: 312,
    downloads: 143,
    views: 4321,
    photographer: 'Tom Anderson',
    dateTaken: '2023-12-20'
  }
];
