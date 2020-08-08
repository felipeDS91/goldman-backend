module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'colors',
      [
        {
          description: 'AMARELO',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'ROSÊ',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'BRANCO',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
