import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Auth attempt for username:', credentials?.username);
        
        if (!credentials?.username || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }
        
        try {
          console.log('Connecting to database...');
          await connectToDatabase();
          console.log('Database connected successfully');

          // Bootstrap admin if env provided and user not exists
          const adminUser = process.env.ADMIN_USERNAME;
          const adminPass = process.env.ADMIN_PASSWORD;
          
          if (adminUser && adminPass) {
            console.log('Checking for admin user...');
            const exists = await User.findOne({ username: adminUser });
            if (!exists) {
              console.log('Creating admin user...');
              const hash = await bcrypt.hash(adminPass, 10);
              await User.create({ 
                username: adminUser, 
                password: hash, 
                role: 'Admin', 
                assignedLocations: [] 
              });
              console.log('Admin user created successfully');
            } else {
              console.log('Admin user already exists');
            }
          }

          console.log('Looking for user:', credentials.username);
          const user = await User.findOne({ username: credentials.username });
          
          if (!user) {
            console.log('User not found');
            return null;
          }
          
          console.log('User found, checking password...');
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log('Invalid password');
            return null;
          }
          
          console.log('Authentication successful for user:', user.username);
          return { 
            id: String(user._id), 
            username: user.username, 
            role: user.role, 
            assignedLocations: user.assignedLocations 
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.assignedLocations = user.assignedLocations;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: token.username,
        username: token.username,
        role: token.role,
        assignedLocations: token.assignedLocations,
      };
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Error sayfasını da signin'e yönlendir
  },
  debug: true, // Debug modunu açık tut
};

export default NextAuth(authOptions);


