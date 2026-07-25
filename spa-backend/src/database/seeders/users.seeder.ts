import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { Rol, Sexo } from '../../common/enums';
import { BCRYPT_SALT_ROUNDS } from '../../common/constants';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@spagrace.com' },
  });

  if (existingAdmin) {
    console.log('  ⏭️  Admin ya existe, saltando...');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin123!', BCRYPT_SALT_ROUNDS);

  const admin = userRepository.create({
    nombre: 'Administrador Principal',
    email: 'admin@spagrace.com',
    username: 'admin',
    password: hashedPassword,
    rol: Rol.ADMIN,
    telefono: '+5491100000000',
    sexo: Sexo.OTRO,
  });

  await userRepository.save(admin);
  console.log('  ✅ Admin creado: admin@spagrace.com / Admin123!');
}

export async function seedRecepcionista(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  const existing = await userRepository.findOne({
    where: { email: 'recepcion@spagrace.com' },
  });

  if (existing) {
    console.log('  ⏭️  Recepcionista ya existe, saltando...');
    return;
  }

  const hashedPassword = await bcrypt.hash('Recep123!', BCRYPT_SALT_ROUNDS);

  const user = userRepository.create({
    nombre: 'Recepcionista Principal',
    email: 'recepcion@spagrace.com',
    username: 'recepcion',
    password: hashedPassword,
    rol: Rol.RECEPCIONISTA,
    telefono: '+5491100000001',
    sexo: Sexo.FEMENINO,
  });

  await userRepository.save(user);
  console.log('  ✅ Recepcionista creado: recepcion@spagrace.com / Recep123!');
}
