import clientPromise from "@/lib/mongodb";

const MAX_REGISTRATIONS_PER_IP = 3; // Максимум 3 регистрации в сутки с одного IP

export async function checkIpLimit(
  ip: string
): Promise<{ allowed: boolean; message?: string }> {
  if (!ip) return { allowed: true }; // Если IP не определён, пропускаем

  const client = await clientPromise;
  const db = client.db("quixmade");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const registrationsCount = await db
    .collection("ipRegistrations")
    .countDocuments({
      ip,
      date: { $gte: today },
    });

  if (registrationsCount >= MAX_REGISTRATIONS_PER_IP) {
    return {
      allowed: false,
      message: `Превышено максимальное количество регистраций с вашего IP (${MAX_REGISTRATIONS_PER_IP} в сутки)`,
    };
  }

  return { allowed: true };
}

export async function recordIpRegistration(ip: string): Promise<void> {
  if (!ip) return;

  const client = await clientPromise;
  const db = client.db("quixmade");

  await db.collection("ipRegistrations").insertOne({
    ip,
    date: new Date(),
  });
}
