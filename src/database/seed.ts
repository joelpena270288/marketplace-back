import { DataSource } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { Configuration } from '../config/config.keys';
import { Role } from '../modules/role/entities/role.entity';
import { RoleEnum } from '../modules/role/enums/role.enum';
import { User } from '../modules/users/entities/user.entity';
import { UserDetails } from '../modules/users/user.details.entity';
import * as bcrypt from 'bcryptjs';

async function runSeed() {
  const config = new ConfigService();

  const dataSource = new DataSource({
    type: 'postgres',
    host: config.get(Configuration.DATABASE_HOST),
    port: parseInt(config.get(Configuration.DATABASE_PORT) || '5432', 10),
    username: config.get(Configuration.DATABASE_USERNAME),
    password: config.get(Configuration.DATABASE_PASSWORD),
    database: config.get(Configuration.DATABASE_NAME),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  });

  try {
    const ds = await dataSource.initialize();
    console.log('DataSource initialized for seeding');

    const roleRepo = ds.getRepository(Role);
    const userRepo = ds.getRepository(User);

    const rolesToEnsure = [RoleEnum.ADMIN, RoleEnum.ESTANDAR, RoleEnum.EDITOR];

    for (const roleName of rolesToEnsure) {
      let role = await roleRepo.findOne({ where: { name: roleName } });
      if (!role) {
        role = new Role();
        role.name = roleName;
        role.descripcion = `Rol ${roleName}`;
        role.status = 'ACTIVE';
        await roleRepo.save(role);
        console.log(`Created role: ${roleName}`);
      } else {
        console.log(`Role exists: ${roleName}`);
      }
    }

    // Create admin user
    const adminUsername = config.get('ADMIN_USERNAME') || 'admin';
    const adminPassword = config.get('ADMIN_PASSWORD') || 'Admin123!';
    const adminEmail = config.get('ADMIN_EMAIL') || 'admin@example.com';

    const existingAdmin = await userRepo.findOne({
      where: { username: adminUsername },
    });
    if (existingAdmin) {
      console.log(`Admin user already exists: ${adminUsername}`);
    } else {
      const adminRole = await roleRepo.findOne({
        where: { name: RoleEnum.ADMIN },
      });
      const user = new User();
      user.username = adminUsername.toLowerCase();
      const detail = new UserDetails();
      detail.name = 'Admin';
      detail.lastname = '';
      detail.email = adminEmail;
      user.details = detail;
      user.status = 'ACTIVE';
      user.roles = adminRole ? [adminRole] : [];

      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(adminPassword, salt);

      await userRepo.save(user);
      console.log(`Created admin user: ${adminUsername}`);
    }

    await ds.destroy();
    console.log('Seeding finished');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

// start the seeding process; intentionally not awaited at top-level
void runSeed();
