export interface Product {
  id: string
  name: string
  description: string
}

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'PixelPulse Speaker',
    description: 'Compact Bluetooth speaker with immersive sound and 12-hour battery life.',
  },
  {
    id: 'prod-2',
    name: 'Astra Smart Watch',
    description: 'Fitness-focused smartwatch with heart rate tracking and sleep analysis.',
  },
  {
    id: 'prod-3',
    name: 'Nimbus Noise Canceling Headphones',
    description: 'Over-ear headphones with premium noise cancellation and studio-quality audio.',
  },
]
