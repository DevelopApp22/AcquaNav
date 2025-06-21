import dotenv from 'dotenv';
import { User } from '../../model/schema/user_model';
import RestrictedArea from '../../model/schema/restrictedArea_model';
import { NavigationPlan } from '../../model/schema/navigationPlan_model';
import { UserRole } from '../../model/user.interface';
import { StatusNavigation } from '../../model/navigationPlan.interface';
import MongoDB from '../mangoDb';
import { hashPassword } from '../../utils/password';

dotenv.config();

const seed = async () => {
  try {

    MongoDB.getInstance();
    // Pulisce le collezioni
    await Promise.all([
      User.deleteMany({}),
      RestrictedArea.deleteMany({}),
      NavigationPlan.deleteMany({}),
    ]);

    // 1. CREA UTENTI
    const [utente] = await User.insertMany([
      { role: UserRole.USER, tokens: 20,email:"alepetty@gmail.com",password: await hashPassword("1111") },
      { role: UserRole.OPERATOR ,email:"ale@gmail.com",password:await hashPassword("1111")},
      { role: UserRole.ADMIN,email:"alep@gmail.com",password:await hashPassword("1111")},
    ]);

    // 2. CREA AREE VIETATE
    await RestrictedArea.insertMany([
      {
        topLeft: { lon: 10.0, lat: 45.0 },
        bottomRight: { lon: 11.0, lat: 44.0 },
      },
      {
        topLeft: { lon: 12.5, lat: 43.5 },
        bottomRight: { lon: 13.0, lat: 43.0 },
      },
    ]);
    // 3. CREA PIANO DI NAVIGAZIONE
    const now = new Date();
    const start = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 ore dopo
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);  // +2 ore

    await NavigationPlan.create({
      userId: utente._id,
      boatId: 'ABCD123456',
      waypoints: [
        { lon: 9.0, lat: 44.0 },
        { lon: 9.5, lat: 44.5 },
        { lon: 9.0, lat: 44.5 },
        { lon: 9.0, lat: 44.0 }, // chiusura
      ],
      startDate: start,
      endDate: end,
      status: StatusNavigation.PENDING,
    });

  } catch (err) {
    console.error(' ERRORE nel seed:', err);
  }
};

seed();
