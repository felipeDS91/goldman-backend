module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'company',
      [
        {
          name: 'Kaio Augusto Gui ME',
          fantasy_name: 'Unioro Joias',
          cnpj: '15771681000106',
          phone: '(11) 3105-0061',
          cellphone: '(11) 98970-1484',
          email: 'contato@uniorojoias.com.br',
          instagram: '@uniorojoias',
          facebook: 'Unioro Joias',
          state: 'SP',
          city: 'São Paulo',
          address: 'Praça da Sé',
          neighborhood: 'Sé',
          zip_code: '01001000',
          complement: 'Sala 601',
          number: '21',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
