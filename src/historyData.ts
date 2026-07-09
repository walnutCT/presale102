import { Product, User } from './types';
import { INITIAL_PRODUCTS } from './data';

/**
 * Generates realistic mock history for the last 30 days.
 * This guarantees the calendar is fully loaded with interactive data.
 */
export function generateMockHistory(users: User[]): Record<string, Product[]> {
  const history: Record<string, Product[]> = {};
  const today = new Date();

  // Use some realistic staff and manager names from users
  const activeUsers = users.filter(u => u.level !== 4); // exclude viewer
  if (activeUsers.length === 0) return history;

  // Let's generate data for ~12 random days in the last 30 days
  const activeDaysCount = 12;
  const dayOffsets: number[] = [];
  while (dayOffsets.length < activeDaysCount) {
    const offset = Math.floor(Math.random() * 28) + 1; // 1 to 28 days ago
    if (!dayOffsets.includes(offset)) {
      dayOffsets.push(offset);
    }
  }

  dayOffsets.sort((a, b) => b - a); // chronological sort

  dayOffsets.forEach(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    // On this date, select 1 to 3 random users who participated
    const participantsCount = Math.floor(Math.random() * 3) + 1;
    const shuffledUsers = [...activeUsers].sort(() => 0.5 - Math.random());
    const dayParticipants = shuffledUsers.slice(0, participantsCount);

    const dayProducts: Product[] = [];

    dayParticipants.forEach(user => {
      // Pick 3 to 7 random products for this user
      const productsCount = Math.floor(Math.random() * 5) + 3;
      const shuffledProducts = [...INITIAL_PRODUCTS].sort(() => 0.5 - Math.random());
      const selectedProducts = shuffledProducts.slice(0, productsCount);

      selectedProducts.forEach(prod => {
        const plusQty = Math.floor(Math.random() * 15) + 5; // 5 to 20
        const overrideQty = plusQty - prod.multiQty;
        const price = overrideQty * prod.unitPrice;

        const timeHour = String(Math.floor(Math.random() * 6) + 8).padStart(2, '0'); // 08:00 to 13:00
        const timeMin = String(Math.floor(Math.random() * 60)).padStart(2, '0');

        dayProducts.push({
          ...prod,
          plusQty,
          overrideQty,
          price,
          addedBy: `${user.username} (${user.roleName})`,
          addedAt: `${dd}/${mm}/${yyyy} ${timeHour}:${timeMin}`,
          delDate: `${dd}/${mm}/${yyyy}`
        });
      });
    });

    history[dateStr] = dayProducts;
  });

  return history;
}

/**
 * Load or initialize the history database in localStorage
 */
export function getHistoryDatabase(users: User[]): Record<string, Product[]> {
  const cached = localStorage.getItem('farmhouse_presale_history');
  if (cached) {
    try {
      return JSON.parse(cached) as Record<string, Product[]>;
    } catch (e) {
      // fallback
    }
  }

  // Initialize and persist mock history
  const newHistory = generateMockHistory(users);
  localStorage.setItem('farmhouse_presale_history', JSON.stringify(newHistory));
  return newHistory;
}

/**
 * Save a specific date's records to the history database
 */
export function saveToHistoryDatabase(dateStr: string, products: Product[]) {
  try {
    const cached = localStorage.getItem('farmhouse_presale_history');
    let history: Record<string, Product[]> = {};
    if (cached) {
      history = JSON.parse(cached);
    }
    history[dateStr] = products;
    localStorage.setItem('farmhouse_presale_history', JSON.stringify(history));
  } catch (e) {
    console.error('Error saving to history database', e);
  }
}
