import { DataSource } from 'typeorm';
import { CategoriaServicio } from '../../modules/servicios/entities/categoria-servicio.entity';

export async function seedCategorias(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(CategoriaServicio);

  const categorias = [
    { nombre: 'Masajes', descripcion: 'Masajes terapéuticos y descontracturantes', icono: 'spa', orden: 1 },
    { nombre: 'Faciales', descripcion: 'Tratamientos faciales y limpieza de cutis', icono: 'face', orden: 2 },
    { nombre: 'Corporales', descripcion: 'Tratamientos de reducción y modelado corporal', icono: 'fitness_center', orden: 3 },
    { nombre: 'Bienestar', descripcion: 'Terapias holísticas y de bienestar general', icono: 'self_care', orden: 4 },
    { nombre: 'Depilación', descripcion: 'Servicios de depilación', icono: 'content_cut', orden: 5 },
  ];

  for (const cat of categorias) {
    const exists = await repo.findOneBy({ nombre: cat.nombre });
    if (!exists) {
      await repo.save(repo.create(cat));
      console.log(`  ✅ Categoría creada: ${cat.nombre}`);
    } else {
      console.log(`  ⏭️  Categoría "${cat.nombre}" ya existe`);
    }
  }
}
