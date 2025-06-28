// Seleziona il database
db = db.getSiblingDB('navigationDb');

// Crea la collezione utenti
db.createCollection('users');
const usersInsertResult = db.users.insertMany([
  { role: "user", tokens: 20, email: "user1@test.com", password:"$2b$10$zz12ioVC79mfjiyYbKuln.eZvESVHHx8v0nOuTKT0rWMxPnjZ0sJa"},
  { role: "user", tokens: 50, email: "user2@test.com", password:"$2b$10$zz12ioVC79mfjiyYbKuln.eZvESVHHx8v0nOuTKT0rWMxPnjZ0sJa"},
  { role: "operator", email: "operator1@test.com", password:"$2b$10$zz12ioVC79mfjiyYbKuln.eZvESVHHx8v0nOuTKT0rWMxPnjZ0sJa"},
  { role: "operator", email: "operator2@test.com", password:"$2b$10$zz12ioVC79mfjiyYbKuln.eZvESVHHx8v0nOuTKT0rWMxPnjZ0sJa"},
  { role: "admin", email: "admin1@test.com", password:"$2b$10$zz12ioVC79mfjiyYbKuln.eZvESVHHx8v0nOuTKT0rWMxPnjZ0sJa"},
  { role: "admin", email: "admin2@test.com", password:"$2b$10$zz12ioVC79mfjiyYbKuln.eZvESVHHx8v0nOuTKT0rWMxPnjZ0sJa"}
]);

// Convertiamo gli _id in stringa
const user1Id = usersInsertResult.insertedIds[0].toString();
const user2Id = usersInsertResult.insertedIds[1].toString();



// Crea la collezione restricted_areas
db.createCollection('restrictedareas');
db.restrictedareas.insertMany([
  { topLeft: { lon: 10.0, lat: 45.0 }, bottomRight: { lon: 11.0, lat: 44.0 } },
  { topLeft: { lon: 12.5, lat: 43.5 }, bottomRight: { lon: 13.0, lat: 43.0 } },
  { topLeft: { lon: 9.0, lat: 42.5 }, bottomRight: { lon: 9.5, lat: 42.0 } }
]);

// Crea la collezione navigation_plans
db.createCollection('navigationplans');
db.navigationplans.insertMany([
  {
    userId: user1Id,
    boatId: "BOAT123456",
    waypoints: [
      { lon: 8.0, lat: 43.0 },
      { lon: 8.2, lat: 43.2 },
      { lon: 8.4, lat: 43.0 },
      { lon: 8.0, lat: 43.0 }
    ],
    startDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 74 * 60 * 60 * 1000),
  },
  {
    userId: user1Id,
    boatId: "BOAT789012",
    waypoints: [
      { lon: 9.5, lat: 43.5 },
      { lon: 9.7, lat: 43.7 },
      { lon: 9.9, lat: 43.5 },
      { lon: 9.5, lat: 43.5 }
    ],
    startDate: new Date(Date.now() + 96 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 98 * 60 * 60 * 1000),
  },
  {
    userId: user2Id,
    boatId: "BOAT345678",
    waypoints: [
      { lon: 11.0, lat: 44.5 },
      { lon: 11.2, lat: 44.7 },
      { lon: 11.4, lat: 44.5 },
      { lon: 11.0, lat: 44.5 }
    ],
    startDate: new Date(Date.now() + 120 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 122 * 60 * 60 * 1000),
  },
  {
    userId: user2Id,
    boatId: "BOAT901234",
    waypoints: [
      { lon: 12.0, lat: 45.0 },
      { lon: 12.2, lat: 45.2 },
      { lon: 12.4, lat: 45.0 },
      { lon: 12.0, lat: 45.0 }
    ],
    startDate: new Date(Date.now() + 144 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 146 * 60 * 60 * 1000),
  },
  {
    userId: user2Id,
    boatId: "BOAT567890",
    waypoints: [
      { lon: 8.0, lat: 42.5 },
      { lon: 8.2, lat: 42.7 },
      { lon: 8.4, lat: 42.5 },
      { lon: 8.0, lat: 42.5 }
    ],
    startDate: new Date(Date.now() + 168 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 170 * 60 * 60 * 1000),
    status:"accepted"
  }
]);

