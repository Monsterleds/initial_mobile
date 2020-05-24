import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();
  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const { price } = products.reduce(
      (previous, current) => {
        if (!current.quantity) {
          previous.price += current.price;
        } else {
          const total = current.price * current.quantity;
          previous.price += total;
        }

        return previous;
      },
      {
        price: 0,
      },
    );

    return formatValue(price);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const { quantity } = products.reduce(
      (previous, current) => {
        if (current.quantity === undefined) {
          current.quantity = 1;
        }
        previous.quantity += current.quantity;

        return previous;
      },
      {
        quantity: 0,
      },
    );

    return quantity;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
