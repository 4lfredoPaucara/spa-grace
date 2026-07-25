import { DataSource } from 'typeorm';
import { seedAdmin, seedRecepcionista } from './users.seeder';

export async function runAllSeeders(dataSource: DataSource): Promise<void> {
  console.log('\n🌱 Ejecutando seeders...\n');

  console.log('📌 Usuarios:');
  await seedAdmin(dataSource);
  await seedRecepcionista(dataSource);

  console.log('\n✅ Seeders completados.\n');
}
