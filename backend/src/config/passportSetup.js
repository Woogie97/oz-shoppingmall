const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;

    let connection;
    try {
      connection = await pool.getConnection();
      
      // Find user by provider_id
      const [existingUsers] = await connection.query(
        'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
        ['google', id]
      );

      if (existingUsers.length > 0) {
        return done(null, existingUsers[0]);
      }

      // If user does not exist, create a new one
      const newUser = {
        name: displayName,
        email: email,
        provider: 'google',
        provider_id: id
      };

      const [result] = await connection.query('INSERT INTO users SET ?', newUser);
      
      const [createdUsers] = await connection.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      
      return done(null, createdUsers[0]);

    } catch (error) {
      return done(error, null);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, users[0]);
    } catch (error) {
        done(error, null);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}); 