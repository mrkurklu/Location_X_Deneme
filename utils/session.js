import Credentials from 'next-auth/providers/credentials';
import { connectToDatabase } from '../lib/mongodb';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  session: { strategy: 'jwt' },
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
        const user = await User.findOne({ username: credentials.username });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: String(user._id), username: user.username, role: user.role, assignedLocations: user.assignedLocations };
      },
    }),
  ],
};


