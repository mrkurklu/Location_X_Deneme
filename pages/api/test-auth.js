import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Testing database connection...');
    await connectToDatabase();
    
    console.log('Testing user query...');
    const users = await User.find({}).limit(5);
    
    console.log('Environment variables check:');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
    
    res.status(200).json({ 
      success: true, 
      message: 'Database connection successful',
      userCount: users.length,
      users: users.map(u => ({ username: u.username, role: u.role }))
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 