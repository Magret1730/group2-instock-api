/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('warehouses').del();
  await knex('warehouses').insert([
    {
      id: 1,
      warehouse_name: 'Manhattan',
      address: '503 Broadway',
      city: 'New York',
      country: 'USA',
      contact_name: 'Parmin Aujla',
      contact_position: 'Warehouse Manager',
      contact_phone: '+1 (646) 123-1234',
      contact_email: 'paujla@instock.com',
    },
    {
      id: 2,
      warehouse_name: 'Washington',
      address: '33 Pearl Street SW',
      city: 'Washington',
      country: 'USA',
      contact_name: 'Greame Lyon',
      contact_position: 'Warehouse Manager',
      contact_phone: '+1 (646) 123-1234',
      contact_email: 'glyon@instock.com',
    },git 
    {
      id: 3,
      warehouse_name: 'Jersey',
      address: '300 Main Street',
      city: 'New Jersey',
      country: 'USA',
      contact_name: 'Brad MacDonald',
      contact_position: 'Warehouse Manager',
      contact_phone: '+1 (646) 123-1234',
      contact_email: 'bmcdonald@instock.com',
    },
    {
      id: 4,
      warehouse_name: 'SF',
      address: '890 Brannnan Street',
      city: 'San Francisco',
      country: 'USA',
      contact_name: 'Gary Wong',
      contact_position: 'Warehouse Manager',
      contact_phone: '+1 (646) 123-1234',
      contact_email: 'gwong@instock.com',
    },
    {
      id: 5,
      warehouse_name: 'Santa Monica',
      address: '520 Broadway',
      city: 'Santa Monica',
      country: 'USA',
      contact_name: 'Sharon Ng',
      contact_position: 'Warehouse Manager',
      contact_phone: '+1 (646) 123-1234',
      contact_email: 'sng@instock.com',
    },
    {
      id: 6,
      warehouse_name: 'Seattle',
      address: '1201 Third Avenue',
      city: 'Seattle',
      country: 'USA',
      contact_name: 'Daniel Bachu',
      contact_position: 'Warehouse Manager',
      contact_phone: '+1 (646) 123-1234',
      contact_email: 'dbachu@instock.com',
    },
    {
      id: 7,
      warehouse_name: 'Miami',
      address: '2650 NW 5th Avenue',
      city: 'Miami',
      country: 'USA',
      contact_name: 'Alana Thomas',
      contact_position: 'Warehouse Manager',
      contact_phone: '+1 (646) 123-1234',
      contact_email: 'athomas@instock.com',
    },
    {
      id: 8,
      warehouse_name: 'Boston',
      address: '215 Essex Street',
      city: 'Boston',
      country: 'USA',
      contact_name: 'Vanessa Mendoza',
      contact_position: 'Warehouse Manager',
      contact_phone: '+1 (646) 123-1234',
      contact_email: 'vmendoza@instock.com',
    },
  ]);
};