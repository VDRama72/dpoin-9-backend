// FILE: syncMongo.js
const { MongoClient } = require('mongodb');

// Ubah sesuai koneksi kamu
const remoteUri = 'mongodb+srv://vdrama72:JkmJokam354@cluster0.ud4z70o.mongodb.net/dpoin';
const localUri = 'mongodb://localhost:27017';

async function syncCollection(collectionName) {
  const remoteClient = new MongoClient(remoteUri);
  const localClient = new MongoClient(localUri);

  try {
    await remoteClient.connect();
    await localClient.connect();

    const remoteDb = remoteClient.db('dpoin');
    const localDb = localClient.db('dpoint'); // sesuaikan dengan nama DB lokal

    const remoteData = await remoteDb.collection(collectionName).find().toArray();
    console.log(`📦 Mengambil ${remoteData.length} data dari koleksi "${collectionName}"`);

    if (remoteData.length > 0) {
      await localDb.collection(collectionName).deleteMany({});
      await localDb.collection(collectionName).insertMany(remoteData);
      console.log(`✅ Disimpan ke lokal koleksi "${collectionName}"`);
    } else {
      console.log(`⚠️ Tidak ada data pada koleksi "${collectionName}"`);
    }

  } catch (err) {
    console.error('❌ Gagal sinkronisasi:', err);
  } finally {
    await remoteClient.close();
    await localClient.close();
  }
}

(async () => {
  await syncCollection('orders');
  await syncCollection('users');
  await syncCollection('drivers');     // opsional jika kamu punya
  await syncCollection('merchants');   // opsional jika kamu punya
})();
