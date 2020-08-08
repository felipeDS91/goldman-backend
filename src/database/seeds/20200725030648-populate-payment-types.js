module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'payment_types',
      [
        {
          description: 'DINHEIRO',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'CARTÃO CRÉDITO',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'CARTÃO DÉBITO',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'BOLETO BANCÁRIO',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
