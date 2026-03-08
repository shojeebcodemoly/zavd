const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://synos-admin:Xc0v778jCOOOElHq@synos-cluster.alvjobm.mongodb.net/synos-db';

async function updateHeroBackground() {
	try {
		console.log('Connecting to MongoDB...');
		await mongoose.connect(MONGODB_URI);
		console.log('Connected to MongoDB');

		const result = await mongoose.connection.db.collection('home_page').updateOne(
			{},
			{
				$set: {
					'hero.backgroundImage': '/image.png'
				}
			}
		);

		console.log('Updated:', result.modifiedCount, 'document(s)');

		// Verify the update
		const doc = await mongoose.connection.db.collection('home_page').findOne({});
		console.log('New background image:', doc.hero.backgroundImage);

		await mongoose.disconnect();
		console.log('Disconnected from MongoDB');
	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
}

updateHeroBackground();
