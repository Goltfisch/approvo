import currency from 'currency.js';

export const EURO = value => currency(value, {
    symbol: '€', 
    decimal: ',', 
    separator: '.',
    formatWithSymbol: true,
    pattern: '# !'
});