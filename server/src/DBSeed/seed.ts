import mongoose from "mongoose";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

// Import models from the schema files
import { User } from "../models/user.schema";
import { Item } from "../models/item.schema";
import { Collection } from "../models/collection.schema";
import { Chat } from "../models/chat.schema";
import { Message } from "../models/message.schema";


async function seedDatabase() {
  try {
    // Connect to the database
    await mongoose.connect(String(process.env.DB_URL));
    console.log('>> Connected to the database.');

    // Reset database
    await User.deleteMany();
    await Item.deleteMany();
    await Collection.deleteMany();
    await Chat.deleteMany();
    await Message.deleteMany()
    console.log('>> Databse reset.')

    const password1 = await bcrypt.hash('klaus', 10);
    const password2 = await bcrypt.hash('herbert', 10);

    // Create users
    const user1 = await User.create({
      username: 'Klaus',
      email: 'klaus@example.com',
      password: password1,
      address: {
        streetName: 'Stresemannstraße',
        streetNumber: '123',
        postalCode: '10963',
        city: 'Berlin',
      },
      geoLocation: {
        lat: 52.5075201,
        lng: 13.3778567,
      },
      credits: 500,
      reputation: 5,
    });

    const user2 = await User.create({
      username: 'Herbert',
      email: 'herbert@example.com',
      password: password2,
      address: {
        streetName: 'Greifswalder Str.',
        streetNumber: '30',
        postalCode: '10405',
        city: 'Berlin',
      },
      geoLocation: {
        lat: 52.539337,
        lng: 13.425235,
      },
      credits: 600,
      reputation: 3,
    });

    // Create collections
    const collection1 = await Collection.create({
      name: 'House',
      items: [],
    });

    const collection2 = await Collection.create({
      name: 'Tools',
      items: [],
    });
    
    const collection3 = await Collection.create({
      name: 'Power Tools',
      items: [],
    });

    const collection4 = await Collection.create({
      name: 'All',
      items: [],
    });
    const collection5 = await Collection.create({
      name: 'All',
      items: [],
    });
    const collection6 = await Collection.create({
      name: 'Borrowed',
      items: [],
    });
    
    const collection7 = await Collection.create({
      name: 'Lent Out',
      items: [],
    });
    const collection8 = await Collection.create({
      name: 'Borrowed',
      items: [],
    });

    const collection9 = await Collection.create({
      name: 'Lent Out',
      items: [],
    });



    // Create items
    const item1 = await Item.create({
      user: user1._id,
      name: 'Power Drill',
      photo: 'http://5.imimg.com/data5/VW/FM/MY-38627328/cordless-hand-driller-500x500.jpg',
      value: 300,
      description: 'Electric drill, good working condition.',
      lendable: true,
      available: true,
      collections: [collection2._id, collection4._id],
      borrowed: false,
    });

    const item2 = await Item.create({
      user: user2._id,
      name: 'Vacuum Cleaner',
      photo: 'https://www.electrolux.com.my/globalassets/appliances/vacuum-clearner/z931-fr-1500x1500.png?preset=medium',
      value: 200,
      description: 'It is no Dyson but it will do.',
      lendable: false,
      available: true,
      collections: [collection1._id, collection5._id],
      borrowed: false,
    });

    const item3 = await Item.create({
      user: user2._id,
      name: 'Drill',
      photo: 'https://d1b5h9psu9yexj.cloudfront.net/13147/Bosch-PS31-2A-12-Volt-Max-Drill-Driver-Kit_20181127-194416_full.jpg',
      value: 200,
      description: 'Very nice Bosch drill',
      lendable: false,
      available: true,
      collections: [collection3._id, collection5._id],
      borrowed: false,
    });

    // Create chat
    const chat = await Chat.create({
      item: item1._id,
      messages: [],
    });

    // Create messages
    const message1 = await Message.create({
      body: 'Hello',
      from: user1._id,
      to: user2._id,
      seen: false,
    });

    const message2 = await Message.create({
      body: 'Hi',
      from: user2._id,
      to: user1._id,
      seen: false,
    });

    // Update references
    await User.findByIdAndUpdate(user1._id, {
      collections: [collection1._id, collection4._id, collection6._id, collection7._id],
      inbox: [chat._id],
    });

    await User.findByIdAndUpdate(user2._id, {
      collections: [collection2._id, collection5._id, collection8._id, collection9._id],
      inbox: [chat._id],
    });

    await Item.findByIdAndUpdate(item1._id, {
      collections: [collection2._id, collection4._id],
    });

    await Item.findByIdAndUpdate(item2._id, {
      collections: [collection2._id, collection5._id],
    });

    await Item.findByIdAndUpdate(item3._id, {
      collections: [collection3._id, collection5._id],
    });

    await Collection.findByIdAndUpdate(collection1._id, {
      items: [item2._id],
    });

    await Collection.findByIdAndUpdate(collection2._id, {
      items: [item1._id],
    });

    await Collection.findByIdAndUpdate(collection3._id, {
      items: [item3._id],
    });

    await Collection.findByIdAndUpdate(collection4._id, {
      items: [item1._id],
    });

    await Collection.findByIdAndUpdate(collection5._id, {
      items: [item2._id, item3._id],
    });

    await Chat.findByIdAndUpdate(chat._id, {
      messages: [message1._id, message2._id],
    });

    console.log('Seed data inserted successfully.');

  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
    // Disconnect from the database after seeding
    await mongoose.disconnect();
    console.log('>> Disconnected from the database.');
  }
}

seedDatabase();