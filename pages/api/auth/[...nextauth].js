import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        await connectToDatabase();

        // Bootstrap admin if env provided and user not exists
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;
        if (adminUser && adminPass) {
          const exists = await User.findOne({ username: adminUser });
          if (!exists) {
            const hash = await bcrypt.hash(adminPass, 10);
            await User.create({ username: adminUser, password: hash, role: 'Admin', assignedLocations: [] });
          }
        }

        const user = await User.findOne({ username: credentials.username });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: String(user._id), username: user.username, role: user.role, assignedLocations: user.assignedLocations };
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
  },
};

export default NextAuth(authOptions);


