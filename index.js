const express = require('express')
const app = express()
const { engine } = require("express-handlebars")
const session = require('express-session')
const { google } = require('googleapis')
const gal = require('google-auth-library')
const router = require('./controllers/routes')
const PORT = 5000

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(session({ resave: false, saveUninitialized: true, secret: 'SECRET' }));
app.engine("hbs", engine({ extname: "hbs", }));
app.set("view engine", "hbs");

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCGX37v8LF+E30A\n88rWt3DlGLlx7NwRXPJTgOOZKPaRI+fe7oe8jVKfCzr0cV52Chp/2HGqdiRakLJ6\nAWtD/HLbaRZ20E3tyXR9N8zHvYbEprzDt4aXm4gijgg6mqu1IP4WpQUTOJhemr9W\nwedZJYtTC55DOKvsRhRKRLwOiJRCTHJJaYPLFwK3nOOanQyyy+4i4JLLYVwi4/es\nxCtVEnHhkjRVZFlvvUjOJvnhvxEy/WTKXfGz6DT2J2CIGEAxC6y6KlNzZeoKuffb\nfbpFnacbtos5WHk98dx/K9hOJ5Ea+mqHK3TkOUBsixtvIY1Al1pON+cvpgkeRBfb\nc7LDvcZbAgMBAAECggEAFqK/n2vMepCN3jszUDhWrEEd/DMKX2Jo7+gmbwaXgpup\n08Qa2Yh1ApXBuKvgXcIV9LNhcnW0ag02A5d5mlpMfumU/y7X8dad6PodZQhoS3hL\nFC02XxO0Ox3yBO1JP5nvM6FY2YQPJuCqmtLPRhUtAzBR2METNRoZEOnDRC99yi0Y\nFl/T7RjdVhJpcF/rMLpIBk9w5FD7uBcRFUu4ugOmMRU5KjydZGm+iUBMU6PwUiY7\nRckspDLHuB2gqIReH5Ny9QArRUXRwjgjkUl176VsVQycUiPUn+k0O3OKGXHxvzCd\nEIBsxPkmAjTs2x+uhZhKq/WYHMk8ItRGdNFTtlpWAQKBgQC6jyNA2pACZE33OLeh\nDdJLJaBD1PPqfFlva4YMLhtXlvw9n2a0dOj6qq/Qo3/Orw5IB6LT80K16MMjaxyp\nrFAWeEbkTJUZ5P1xsmtOSrPF85AgDeKbtOMN4SeyT2iw2/h9GsTJNBKlvCvjdj9P\nZa6hO+vXRS6vlaq8BzaG+G5RWQKBgQC4Y6UAmWnR+ShZZWOrEqsmUI5s7XrMtbAp\nuwJvKIiJHW2oEX9Slztg/aYmjgJSU+vVP0nmiEQDn3KBPMYCBXA2Vva4fH6n5DVX\nMayYqWXkQMz47SBgC7SN8+lOgW84JndBPzIMxMpWh62GQU/Wlzn4C5zZUlGrnnq4\nXzBb2RVK0wKBgHEJW4XnKAya8/aQYgrukfXAVYvkEuqH77SoBK+KnDyFGk7IL3W1\nxJhlJWQYPM9hmBiir9EWetw3rUzfkJ1p75i9xc58bHclHT9vqL7mWmjde/1ADIbl\nohF91AyhOsC2d6htuMBkkcvj6P/IXPHhnV7KLMrhezkeSTXmdO5wxn75AoGBAIwS\nHhFTeWCprq4iaFFXsC49+cPjr2p9BuLcjl/U4cuPUHLhP+CEw/XNGf+l1zulRrzL\nBB+dGlXKNVjZyu1UJkcRTwEcibaOlLq1IJEj9iQr2cmrkPGFUtaXGH+rscps5iDp\nmeK7R53uGbKoQLcaUE4OvEsWzrXZgQ44OWs8gIFDAoGBALGLcdNU565HWn3xvKmZ\nml9kllTzhDvHYl+Mi8olAHC9sxqCgyRlkxLVOSMdK2sG1vm0/aMOZySlDzPsWWzN\nA2nAiTTWxV0EBnlWhU/C7Q4BPIPCgZlGyHRK5SS9O981wuBsBmck1NjGP+mT4a9v\nX6Ce7v5sWMWu+N4GJtqiwlG5\n-----END PRIVATE KEY-----\n"
const GOOGLE_CLIENT_EMAIL = "calendar-api@crafty-sanctum-350917.iam.gserviceaccount.com"
const GOOGLE_PROJECT_NUMBER = "633753943075"
const GOOGLE_CALENDAR_ID = "1n0vujh0b9u8mpi3hsfkhl51nc@group.calendar.google.com"

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: 'v3',
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient
});

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '633753943075-n8g4csf68ij9varq4s6e66urrbenvls8.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    res.redirect('/');
  });



app.get('/', async (req, res) => {
  calendar.events.list({
    calendarId: GOOGLE_CALENDAR_ID,
  }).then((response) => {
    res.render('../views/home/index', {
      user: userProfile,
      events: response.data.items
    })
  })
});

app.get('/events/new', (req, res) => {
  res.render('../views/events/add')
})
const auth = new gal.GoogleAuth({
  keyFile: 'D:\\workplace\\GoogleCalendarTracker\\crafty-sanctum-350917-cd302197fbdf.json',
  scopes: 'https://www.googleapis.com/auth/calendar', //full access to edit calendar
});

app.post('/events/create', async (req, res) => {
  const { summary, description, startDate, endDate } = req.body
  console.log('Start Date: ', new Date(startDate))
  // auth here...
  var event = {
    'summary': summary,
    'location': 'Online',
    'description': description,
    'start': {
      'dateTime':  new Date(startDate),
      'timeZone': 'Asia/Dhaka',
    },
    'end': {
      'dateTime': new Date(endDate),
      'timeZone': 'Asia/Dhaka',
    },
    'attendees': [],
    'reminders': {
      'useDefault': false,
      'overrides': [
        { 'method': 'email', 'minutes': 24 * 60 },
        { 'method': 'popup', 'minutes': 10 },
      ],
    },
  };

  await auth.getClient().then(a => {
    calendar.events.insert({
      auth: a,
      calendarId: GOOGLE_CALENDAR_ID,
      resource: event,
    }, function (err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created: %s', event.data);
      res.redirect('/')
      //res.send('Post request')
    });
  })
})

app.post('/events/delete/:id', (req, res) => {
  const { id } = req.params
  auth.getClient().then((a) => {
    calendar.events.delete({
      auth: a,
      calendarId: GOOGLE_CALENDAR_ID,
      eventId: id
    }).then(() => {
      res.redirect('/')
    })
  })
})

app.get('/events/edit/:id', (req, res) => {
  const { id } = req.params

  calendar.events.get({
    calendarId: GOOGLE_CALENDAR_ID,
    eventId: id
  }).then((event) => {
    console.log(event)
    res.render('../views/events/edit', {
      event: event.data
    })
  })
})

app.post('/events/update/:id', (req, res) => {
  const { id } = req.params
  const { summary, description, startDate, endDate } = req.body

  auth.getClient().then((a) => {
    calendar.events.patch({
      auth: a,
      calendarId: GOOGLE_CALENDAR_ID,
      eventId: id,
      requestBody: {
        summary,
        description,
        start: {
          dateTime: new Date(startDate),
        },
        end: {
          dateTime: new Date(endDate)
        }
      }
    }).then(() => {
      res.redirect('/')
    })
  })
})

app.listen(PORT, () => console.log(`Server listening at ${PORT} port...`))