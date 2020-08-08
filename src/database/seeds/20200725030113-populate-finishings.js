module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'finishings',
      [
        {
          description: 'QUADRADA',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'ABAULADA',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'CHANFRADA',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'EXTERNO',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'CÔNCAVAS',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
