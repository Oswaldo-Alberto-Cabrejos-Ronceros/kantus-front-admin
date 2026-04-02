import type { Product } from '~/types'

export default defineEventHandler(async () => {
  const products: Product[] = [
    {
      id: 1,
      categoryId: 1, // c1: Pollo a la Brasa
      name: '1/4 de Pollo a la Brasa',
      description: 'Jugoso cuarto de pollo a la brasa con papas fritas crujientes y ensalada fresca.',
      price: 18.50,
      imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      categoryId: 1,
      name: '1/2 Pollo a la Brasa',
      description: 'Medio pollo a la brasa, doble porción de papas y ensalada.',
      price: 35.00,
      imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      categoryId: 1,
      name: 'Pollo a la Brasa Entero',
      description: 'Un pollo entero a la brasa, porción familiar de papas, ensalada y cremas variadas.',
      price: 65.00,
      imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 4,
      categoryId: 2, // c2: Parrillas
      name: 'Parrilla Mixta',
      description: 'Deliciosa parrilla con chuleta de cerdo, lomo fino, chorizo, anticuchos y papas doradas.',
      price: 48.00,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 5,
      categoryId: 2,
      name: 'Anticuchos de Corazón',
      description: 'Tres palitos de anticuchos de corazón de res marinados, acompañados con rachi y papas doradas.',
      price: 24.00,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 6,
      categoryId: 3, // c3: Bebidas
      name: 'Jarra de Chicha Morada 1L',
      description: 'Refrescante chicha morada casera preparada con maíz morado, piña y especias.',
      price: 12.00,
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=60'
    }
  ]

  return products
})
