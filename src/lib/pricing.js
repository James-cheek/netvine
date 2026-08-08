export const FREE_MEMBER_LIMIT = 10

export const PLANS = {
  ngn_monthly: {
    code: 'PLN_j0jgjqbp1gqoszk',
    label: 'Monthly',
    price: 3500,
    futurePrice: 5000,
    currency: 'NGN',
    symbol: '₦',
    interval: 'monthly',
    display: '₦3,500/mo',
    futureDisplay: '₦5,000/mo',
  },
  ngn_annual: {
    code: 'PLN_4fwiq7qx9q8pxuc',
    label: 'Annual',
    price: 35000,
    futurePrice: 50000,
    currency: 'NGN',
    symbol: '₦',
    interval: 'annually',
    display: '₦35,000/yr',
    futureDisplay: '₦50,000/yr',
    savings: '2 months free',
  },
  usd_monthly: {
    code: '', // Add plan code when USD is enabled on Paystack
    label: 'Monthly',
    price: 300,
    futurePrice: 500,
    currency: 'USD',
    symbol: '$',
    interval: 'monthly',
    display: '$3/mo',
    futureDisplay: '$5/mo',
  },
  usd_annual: {
    code: '', // Add plan code when USD is enabled on Paystack
    label: 'Annual',
    price: 3000,
    futurePrice: 5000,
    currency: 'USD',
    symbol: '$',
    interval: 'annually',
    display: '$30/yr',
    futureDisplay: '$50/yr',
    savings: '2 months free',
  },
}

export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''
