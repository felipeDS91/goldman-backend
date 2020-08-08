module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'statuses',
      [
        {
          description: 'EM PRODUÇÃO',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'AGUARDANDO PAGAMENTO',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'FINALIZADO',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'PRONTO PARA ENTREGA',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
