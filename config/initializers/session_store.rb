# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_tadelv.github.com_session',
  :secret      => '382a5cf9f143a926b9ce56255056b5b5162242a64b41c3911a27541b7152c9ccbf950a3e94707479f5ef09bdf9bdd11def6034996e7f24f972e4d0a818881c5d'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
