import { DataSource } from 'typeorm';
import { seedAdmin, seedRecepcionista } from './users.seeder';
import { seedEspecialidades } from './especialidades.seeder';
import { seedCategorias } from './categorias.seeder';

export async function runAllSeeders(dataSource: DataSource): Promise<void> {
  console.log('\n🌱 Ejecutando seeders...\n');

  console.log('📌 Usuarios:');
  await seedAdmin(dataSource);
  await seedRecepcionista(dataSource);

  console.log('\n📌 Especialidades:');
  await seedEspecialidades(dataSource);

  console.log('\n📌 Categorías de Servicios:');
  await seedCategorias(dataSource);

  console.log('\n✅ Seeders completados.\n');
}
