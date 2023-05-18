const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const indexPath = path.resolve(__dirname, '..', 'build', 'index.html');

// home page

app.get('/', (req, res) => {
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      return console.log(err);
    }

    htmlData = htmlData
      .replace('__META_OG_TITLE__', `Welcome to Carny`)
      .replace('__META_OG_DESCRIPTION__', `Welcome to Carny`)
      .replace('__META_DESCRIPTION__', `Welcome to Carny`)
      .replace('__META_OG_IMAGE__',
        'https://res.cloudinary.com/deprlpgnl/image/upload/v1634626495/QmcsUU4qcanaS41gpXSJNUYboct61zFa8QKKoySq8E3Fcg_cu35sq_w5xrhp.png')
      .replace('__META_TWITTER_TITLE__', `Welcome to Carny`)
      .replace('__META_TWITTER_DESCRIPTION__', `Welcome to Carny`)
      .replace('__META_TWITTER_IMAGE__',
        'https://res.cloudinary.com/deprlpgnl/image/upload/v1634626495/QmcsUU4qcanaS41gpXSJNUYboct61zFa8QKKoySq8E3Fcg_cu35sq_w5xrhp.png');
    return res.send(htmlData);
  });
});

// static resources should just be served as they are
app.use(
  express.static(path.resolve(__dirname, '..', 'build'), { maxAge: '30d' })
);
// here we serve the index.html page
app.get('/nftDetails/:id', (req, res, next) => {
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end();
    }
    /* axios api call */
    let header = { 'content-type': 'application/json' };
    let url = `https://api.carny.io/api/v1/nft/single/${req.params.id}`;
    axios
      .get(url, { headers: header })
      .then((ress) => {
        // inject meta tags
        htmlData = htmlData
          .replace(
            '<title>Welcome to Carny</title>',
            `<title>${ress.data.data.title}</title>`
          )
          .replace('__META_OG_TITLE__', ress.data.data.title)
          .replace('__META_OG_DESCRIPTION__', ress.data.data.description)
          .replace('__META_DESCRIPTION__', ress.data.data.description)
          .replace('__META_OG_IMAGE__', ress.data.data.image.compressed)
          .replace('__META_TWITTER_TITLE__', ress.data.data.title)
          .replace('__META_TWITTER_DESCRIPTION__', ress.data.data.description)
          .replace('__META_TWITTER_IMAGE__', ress.data.data.image.compressed);
        return res.send(htmlData);
      })
      .catch((error) => {
        console.error('Error during file reading', error);
        // return res.status(404).end()
        return res.status(404).send('Post not found');
      });
  });
});

app.get('/creator/:id', (req, res, next) => {
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end();
    }
    /* axios api call */
    let header = { 'content-type': 'application/json' };
    let url = `https://api.carny.io/api/v1/user/getSingleUser/${req.params.id}`;
    axios
      .get(url, { headers: header })
      .then((ress) => {
        // inject meta tags
        htmlData = htmlData
          .replace(
            '<title>Welcome to Carny</title>',
            `<title>${ress.data.data.name}</title>`
          )
          .replace('__META_OG_TITLE__', ress.data.data.name)
          .replace('__META_OG_DESCRIPTION__', ress.data.data.bio)
          .replace('__META_DESCRIPTION__', ress.data.data.bio)
          .replace('__META_OG_IMAGE__', ress.data.data.profile)
          .replace('__META_TWITTER_TITLE__', ress.data.data.name)
          .replace('__META_TWITTER_DESCRIPTION__', ress.data.data.bio)
          .replace('__META_TWITTER_IMAGE__', ress.data.data.profile);
        return res.send(htmlData);
      })
      .catch((error) => {
        console.error('Error during file reading', error);
        // return res.status(404).end()
        return res.status(404).send('Post not found');
      });
  });
});

app.get('/*', (req, res, next) => {
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end();
    }
    htmlData = htmlData
      .replace('__META_OG_TITLE__', `Welcome to Carny`)
      .replace('__META_OG_DESCRIPTION__', `Welcome to Carny`)
      .replace('__META_DESCRIPTION__', `Welcome to Carny`)
      .replace('__META_OG_IMAGE__',
        'https://res.cloudinary.com/deprlpgnl/image/upload/v1634626495/QmcsUU4qcanaS41gpXSJNUYboct61zFa8QKKoySq8E3Fcg_cu35sq_w5xrhp.png')
      .replace('__META_TWITTER_TITLE__', `Welcome to Carny`)
      .replace('__META_TWITTER_DESCRIPTION__', `Welcome to Carny`)
      .replace('__META_TWITTER_IMAGE__',
        'https://res.cloudinary.com/deprlpgnl/image/upload/v1634626495/QmcsUU4qcanaS41gpXSJNUYboct61zFa8QKKoySq8E3Fcg_cu35sq_w5xrhp.png');
    return res.send(htmlData);
  });
});

app.get('/', (req, res, next) => {
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end();
    }
    htmlData = htmlData
      .replace('__META_OG_TITLE__', `Welcome to Carny`)
      .replace('__META_OG_DESCRIPTION__', `Welcome to Carny`)
      .replace('__META_DESCRIPTION__', `Welcome to Carny`)
      .replace('__META_OG_IMAGE__',
        'https://res.cloudinary.com/deprlpgnl/image/upload/v1634626495/QmcsUU4qcanaS41gpXSJNUYboct61zFa8QKKoySq8E3Fcg_cu35sq_w5xrhp.png')
      .replace('__META_TWITTER_TITLE__', `Welcome to Carny`)
      .replace('__META_TWITTER_DESCRIPTION__', `Welcome to Carny`)
      .replace('__META_TWITTER_IMAGE__',
        'https://res.cloudinary.com/deprlpgnl/image/upload/v1634626495/QmcsUU4qcanaS41gpXSJNUYboct61zFa8QKKoySq8E3Fcg_cu35sq_w5xrhp.png');
    return res.send(htmlData);
  });
});

// listening...
app.listen(PORT, (error) => {
  if (error) {
    return console.log('Error during app startup', error);
  }
  console.log('listening on ' + PORT + '...');
});
