import { DataSource } from 'typeorm';
import { Especialidad } from '../../modules/especialidades/entities/especialidad.entity';

export async function seedEspecialidades(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Especialidad);

  const especialidades = [
    { nombre: 'Masoterapia', descripcion: 'Especialista en masajes terapéuticos y relajantes' },
    { nombre: 'Estética Facial', descripcion: 'Especialista en tratamientos faciales' },
    { nombre: 'Estética Corporal', descripcion: 'Especialista en tratamientos corporales' },
    { nombre: 'Cosmetología', descripcion: 'Especialista en cosmética y dermocosmética' },
    { nombre: 'Naturología', descripcion: 'Especialista en terapias naturales y holísticas' },
  ];

  for (const esp of especialidades) {
    const exists = await repo.findOneBy({ nombre: esp.nombre });
    if (!exists) {
      await repo.save(repo.create(esp));
      console.log(`  ✅ Especialidad creada: ${esp.nombre}`);
    } else {
      console.log(`  ⏭️  Especialidad "${esp.nombre}" ya existe`);
    }
  }
}
