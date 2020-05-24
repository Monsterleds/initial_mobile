import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // const allProducts = await AsyncStorage.clear();
      const allProducts = await AsyncStorage.getItem('@GoStack:products');

      if (allProducts) {
        setProducts(JSON.parse(allProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      await AsyncStorage.setItem(
        '@GoStack:products',
        JSON.stringify([...products, product]),
      );
      setProducts([...products, product]);
    },
    [products],
  );

  // 1º criar o produto retornar ele inteiro (tacando no setProducts)
  // 2º Retonar o quantidade de produtos + 1 e exibir na outra tela
  const increment = useCallback(
    async id => {
      const newProducts = products.map(product => {
        if (product.id === id) {
          product.quantity += 1;

          return product;
        }

        return product;
      });

      await AsyncStorage.setItem(
        '@GoStack:products',
        JSON.stringify(newProducts),
      );

      setProducts(newProducts);
    },
    [products],
  );

  // É PARA EU RETONAR ALGUMA COISA FATO

  const decrement = useCallback(
    async id => {
      const newProducts = products.map(product => {
        if (product.id === id && product.quantity > 1) {
          product.quantity -= 1;

          return product;
        }

        return product;
      });

      setProducts(newProducts);

      await AsyncStorage.setItem(
        '@GoStack:products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
