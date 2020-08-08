module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'materials',
      [
        {
          description: 'ZIRCÔNIA',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'DIAMANTE',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
